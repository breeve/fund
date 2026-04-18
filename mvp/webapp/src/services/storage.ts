/**
 * Storage Provider Interface / 存储提供者接口
 *
 * Abstracts read/write operations for asset data.
 * Phase 1: LocalStorageProvider
 * Phase 2: iCloudStorageProvider (via Capacitor)
 * Future: GoogleDriveProvider, DropboxProvider, etc.
 */

export interface StorageProvider {
  /** Read a value by key */
  get<T>(key: string): T | null;
  /** Write a value by key */
  set<T>(key: string, value: T): void;
  /** Remove a value by key */
  remove(key: string): void;
  /** Get all keys */
  keys(): string[];
  /** Clear all data */
  clear(): void;
}

/**
 * LocalStorage implementation
 * Used in Web browser (Phase 1) and can wrap native storage in Capacitor
 */
export class LocalStorageProvider implements StorageProvider {
  private prefix: string;

  constructor(prefix = 'fund:') {
    this.prefix = prefix;
  }

  private k(key: string): string {
    return `${this.prefix}${key}`;
  }

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(this.k(key));
      if (raw === null) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    localStorage.setItem(this.k(key), JSON.stringify(value));
  }

  remove(key: string): void {
    localStorage.removeItem(this.k(key));
  }

  keys(): string[] {
    const allKeys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(this.prefix)) {
        allKeys.push(k.slice(this.prefix.length));
      }
    }
    return allKeys;
  }

  clear(): void {
    this.keys().forEach((k) => this.remove(k));
  }
}

/** Singleton instance */
export const localStorageProvider = new LocalStorageProvider();
