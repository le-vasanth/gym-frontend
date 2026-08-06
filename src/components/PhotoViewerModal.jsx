import React from 'react';
import { X } from 'lucide-react';

export default function PhotoViewerModal({ imageUrl, altText, onClose }) {
  if (!imageUrl) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '2rem'
    }} onClick={onClose}>
      <div 
        className="animate-zoom-in"
        style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            color: '#ffffff',
            cursor: 'pointer',
            padding: '0.5rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
        >
          <X size={24} />
        </button>
        <img 
          src={imageUrl} 
          alt={altText || 'Profile View'} 
          style={{
            maxWidth: '90vw',
            maxHeight: '80vh',
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            border: '4px solid #ffffff',
            objectFit: 'contain'
          }} 
        />
      </div>
    </div>
  );
}
