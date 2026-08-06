import React from 'react';
import { LogOut, X } from 'lucide-react';

export default function LogoutModal({ onClose, onConfirm }) {
  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div 
        className="animate-slide-up"
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '400px',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          position: 'relative',
          textAlign: 'center'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '0.4rem',
            display: 'flex'
          }}
        >
          <X size={20} />
        </button>

        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#fee2e2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem auto'
        }}>
          <LogOut size={28} color="#dc2626" />
        </div>

        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem 0' }}>
          Ready to leave?
        </h2>
        <p style={{ color: '#64748b', fontSize: '0.95rem', margin: '0 0 2rem 0', lineHeight: 1.5 }}>
          You will be signed out of the Hifi Gym Admin Terminal. Make sure all your recent changes are saved!
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{ flex: 1, padding: '0.85rem' }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '0.85rem',
              background: '#dc2626',
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            <LogOut size={16} />
            <span>Yes, Log Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
