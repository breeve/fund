/**
 * Sync Service / 同步服务
 *
 * Orchestrates data synchronization between local storage and cloud providers.
 * Architecture:
 *   App → LocalStorage ←→ SyncService → CloudProvider (iCloud/GDrive/Dropbox)
 *
 * Phase 1: LocalStorage only (SyncService is a no-op shell)
 * Phase 2: iCloud integration via Capacitor
 * Phase 3: Additional cloud providers
 */

import type { StorageProvider } from './storage';

// Cloud provider interface
export interface CloudProvider {
  id: string;
  name: string;
  push(localData: Record<string, unknown>): Promise<void>;
  pull(): Promise<Record<string, unknown> | null>;
  isAvailable(): Promise<boolean>;
}

// Sync status
export type SyncStatus = 'idle' | 'syncing' | 'synced' | 'error' | 'offline';

// Sync conflict resolution
export interface SyncConflict {
  key: string;
  localValue: unknown;
  cloudValue: unknown;
  timestamp: Date;
}

// Sync service events
export type SyncEventType = 'statusChange' | 'conflict' | 'syncComplete' | 'error';
export interface SyncEvent {
  type: SyncEventType;
  status?: SyncStatus;
  conflict?: SyncConflict;
  error?: Error;
}

type SyncListener = (event: SyncEvent) => void;

/**
 * SyncService coordinates local ↔ cloud synchronization.
 * Currently a shell — actual cloud sync is Phase 2+.
 */
export class SyncService {
  private local: StorageProvider;
  private cloudProvider: CloudProvider | null = null;
  private status: SyncStatus = 'idle';
  private listeners: Set<SyncListener> = new Set();
  private syncInterval: ReturnType<typeof setInterval> | null = null;

  constructor(local: StorageProvider) {
    this.local = local;
  }

  /** Set cloud provider (iCloud, GoogleDrive, Dropbox, etc.) */
  setCloudProvider(provider: CloudProvider | null): void {
    this.cloudProvider = provider;
  }

  /** Get current sync status */
  getStatus(): SyncStatus {
    return this.status;
  }

  /** Subscribe to sync events */
  subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /** Emit event to all listeners */
  private emit(event: SyncEvent): void {
    this.listeners.forEach((l) => l(event));
  }

  /** Update status and emit event */
  private setStatus(status: SyncStatus): void {
    this.status = status;
    this.emit({ type: 'statusChange', status });
  }

  /**
   * Trigger a sync operation.
   * Phase 1: No-op shell. Phase 2: Actual cloud sync.
   */
  async sync(): Promise<void> {
    if (!this.cloudProvider) {
      return; // No cloud provider configured, remain local-only
    }

    this.setStatus('syncing');

    try {
      const available = await this.cloudProvider.isAvailable();
      if (!available) {
        this.setStatus('offline');
        return;
      }

      // Phase 2: Pull cloud data → detect conflicts → merge → push local changes
      // const cloudData = await this.cloudProvider.pull();
      // ... conflict resolution logic ...
      // await this.cloudProvider.push(this.getAllLocalData());

      this.setStatus('synced');
      this.emit({ type: 'syncComplete' });
    } catch (err) {
      this.setStatus('error');
      this.emit({ type: 'error', error: err instanceof Error ? err : new Error(String(err)) });
    }
  }

  /** Start periodic background sync */
  startAutoSync(intervalMs = 30_000): void {
    this.stopAutoSync();
    this.syncInterval = setInterval(() => this.sync(), intervalMs);
  }

  /** Stop periodic background sync */
  stopAutoSync(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
      this.syncInterval = null;
    }
  }

  /** Get all local data for cloud upload */
  getAllLocalData(): Record<string, unknown> {
    const data: Record<string, unknown> = {};
    this.local.keys().forEach((key) => {
      data[key] = this.local.get(key);
    });
    return data;
  }

  // Exposed for cloud provider to pull local data
  pullLocalData(): Record<string, unknown> {
    return this.getAllLocalData();
  }
}

// Singleton instance (initialized after store)
let syncServiceInstance: SyncService | null = null;

export function getSyncService(local: StorageProvider): SyncService {
  if (!syncServiceInstance) {
    syncServiceInstance = new SyncService(local);
  }
  return syncServiceInstance;
}
