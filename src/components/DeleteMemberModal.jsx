import React from 'react';
import { X, Trash2, AlertTriangle, User } from 'lucide-react';

export default function DeleteMemberModal({ member, onClose, onConfirm }) {
  if (!member) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ maxWidth: '440px', padding: '1.75rem' }}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Trash2 size={20} color="#ef4444" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#f8fafc', fontWeight: 800 }}>
                Delete Gym Member
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Confirmation Required
              </span>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Member Preview Box */}
        <div style={{
          background: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          borderRadius: '12px',
          padding: '1rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.9rem'
        }}>
          <img
            src={member.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={member.name}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '12px',
              objectFit: 'cover',
              border: '2px solid #ef4444'
            }}
          />
          <div>
            <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 800, color: '#f8fafc' }}>
              {member.name}
            </h4>
            <span style={{ fontSize: '0.78rem', color: '#cbd5e1', display: 'block', fontWeight: 600 }}>
              {member.phone} • ID: {member.id}
            </span>
            <span style={{ fontSize: '0.74rem', color: '#ef4444', fontWeight: 700 }}>
              {member.planType || member.plan}
            </span>
          </div>
        </div>

        {/* Warning message */}
        <p style={{ fontSize: '0.84rem', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 1.5rem 0' }}>
          Are you sure you want to permanently remove <strong style={{ color: '#f8fafc' }}>{member.name}</strong> from the Hifi Gym roster? This action cannot be undone and removes their access records.
        </p>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onClose}
            style={{ padding: '0.55rem 1.1rem', fontSize: '0.85rem' }}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => onConfirm(member.id, member.name)}
            style={{
              padding: '0.55rem 1.1rem',
              fontSize: '0.85rem',
              background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <Trash2 size={16} />
            <span>Yes, Delete Member</span>
          </button>
        </div>
      </div>
    </div>
  );
}
