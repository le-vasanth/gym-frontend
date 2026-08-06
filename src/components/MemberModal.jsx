import React from 'react';
import { 
  X, 
  Phone, 
  Mail, 
  Calendar, 
  Award, 
  Dumbbell, 
  QrCode, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Edit2,
  Trash2
} from 'lucide-react';

export default function MemberModal({ member, onClose, onCheckIn, onEditMember, onDeleteMember, onViewPhoto }) {
  if (!member) return null;

  const isExpired = member.status === 'Expired';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <img
              src={member.avatar}
              alt={member.name}
              onClick={() => onViewPhoto && onViewPhoto(member.avatar)}
              style={{
                width: '68px',
                height: '68px',
                borderRadius: '16px',
                objectFit: 'cover',
                border: isExpired ? '2px solid #f97316' : '2px solid var(--accent-lime)',
                cursor: 'pointer'
              }}
            />
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <h3 style={{ fontSize: '1.4rem', margin: 0 }}>{member.name}</h3>
                <span className={isExpired ? 'badge badge-expired' : 'badge badge-active'}>
                  {member.status}
                </span>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#22d3ee', fontWeight: 600, margin: '0.2rem 0 0 0' }}>
                {member.plan} • ID: {member.id}
              </p>
            </div>
          </div>

          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Contact Information Box */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-glass)',
          marginBottom: '1.25rem'
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>PHONE NUMBER</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{member.phone}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>EMAIL ADDRESS</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{member.email}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>RENEWAL DUE DATE</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: isExpired ? '#fb923c' : '#4ade80' }}>
              {member.expiresAt}
            </span>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block' }}>ASSIGNED TRAINER</span>
            <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--accent-lime)' }}>{member.trainer}</span>
          </div>
        </div>

        {/* Body Stats & Progress */}
        <h4 style={{ fontSize: '0.92rem', marginBottom: '0.6rem', color: 'var(--text-secondary)' }}>
          Body Composition & Training Goal
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.75rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Weight</span>
            <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>{member.bodyStats.weight}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Height</span>
            <span style={{ fontSize: '1.05rem', fontWeight: 700 }}>{member.bodyStats.height}</span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', border: '1px solid var(--border-glass)' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block' }}>Body Fat</span>
            <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#22d3ee' }}>{member.bodyStats.bodyFat}</span>
          </div>
        </div>

        {/* QR Access Badge & Actions */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(34, 197, 94, 0.06)',
          border: '1px solid rgba(34, 197, 94, 0.25)',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <QrCode size={32} color="#4ade80" />
            <div>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block' }}>
                Digital Floor QR Pass
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Last Check-In: {member.lastCheckIn}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={() => {
                onClose();
                onEditMember && onEditMember(member);
              }}
              className="btn-secondary"
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Edit2 size={14} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => {
                onClose();
                onDeleteMember && onDeleteMember(member.id, member.name);
              }}
              className="btn-secondary"
              style={{ padding: '0.5rem 0.85rem', fontSize: '0.82rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.05)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
            <button
              onClick={() => {
                onCheckIn(member);
                onClose();
              }}
              className="btn-primary"
              style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
            >
              <CheckCircle2 size={15} />
              <span>Log Check-In</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
