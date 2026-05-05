import React, { useEffect } from 'react';
import { Button } from './Button';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: ModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.4)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: 'var(--spacing-4)'
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div style={{ 
        backgroundColor: 'var(--color-white)', 
        borderRadius: 'var(--radius-2xl)', 
        boxShadow: 'var(--shadow-lg)',
        width: '100%',
        maxWidth: 640,
        maxHeight: '90vh',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        {/* Modal Header */}
        <div style={{ 
          padding: 'var(--spacing-6) var(--spacing-8)', 
          borderBottom: '1px solid var(--color-gray-100)',
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h2 id="modal-title" style={{ 
            fontSize: 'var(--font-size-xl)', 
            fontWeight: 'var(--font-weight-bold)',
            color: 'var(--color-gray-900)'
          }}>{title}</h2>
          <Button 
            variant="ghost" 
            onClick={onClose} 
            aria-label="关闭"
            style={{ padding: '4px', fontSize: '20px', color: 'var(--color-gray-400)' }}
          >✕</Button>
        </div>

        {/* Modal Body */}
        <div style={{ 
          padding: 'var(--spacing-8)', 
          overflowY: 'auto',
          flex: 1
        }}>
          {children}
        </div>

        {/* Modal Footer */}
        {footer && (
          <div style={{ 
            padding: 'var(--spacing-6) var(--spacing-8)', 
            borderTop: '1px solid var(--color-gray-100)',
            backgroundColor: 'var(--color-gray-50)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 'var(--spacing-3)'
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
