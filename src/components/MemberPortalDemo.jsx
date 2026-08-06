import React from 'react';
import { 
  QrCode, 
  Dumbbell, 
  Award, 
  Clock, 
  Calendar, 
  MessageSquare, 
  Flame, 
  ShieldCheck,
  CheckCircle2,
  Share2
} from 'lucide-react';

export default function MemberPortalDemo({ member }) {
  if (!member) return null;

  return (
    <div className="animate-fade-in" style={{
      maxWidth: '480px',
      margin: '0 auto',
      padding: '0.5rem 1rem 3rem 1rem'
      {/* Mobile Frame Simulation Card */}
      <div className="glass-panel" style={{
        padding: '1.75rem',
        borderRadius: '24px',
        border: '1px solid rgba(34, 197, 94, 0.4)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Card Header: Brand + Status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Dumbbell size={18} color="#4ade80" />
            <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-0.02em' }}>
              HIFI <span className="gradient-text-lime">MEMBER PASS</span>
            </span>
          </div>
          <span className="badge badge-active">Active</span>
        </div>

        {/* Member Profile Hero */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
          <img
            src={member.avatar}
            alt={member.name}
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '16px',
              objectFit: 'cover',
              border: '2px solid var(--accent-lime)'
            }}
          />
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0 }}>{member.name}</h3>
            <p style={{ fontSize: '0.82rem', color: '#22d3ee', fontWeight: 600, margin: '0.15rem 0 0 0' }}>
              {member.plan}
            </p>
            <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', margin: '0.1rem 0 0 0' }}>
              Member ID: {member.id} • <span style={{ color: '#4ade80', fontWeight: 700 }}>PIN: {member.pin || '1234'} 🔒</span>
            </p>
          </div>
        </div>

        {/* DIGITAL QR CHECK-IN PASS */}
        <div style={{
          background: 'linear-gradient(180deg, rgba(14, 20, 29, 0.9) 0%, rgba(8, 11, 16, 0.95) 100%)',
          border: '1px solid var(--border-glass)',
          borderRadius: '20px',
          padding: '1.5rem',
          textAlign: 'center',
          marginBottom: '1.5rem',
          position: 'relative'
        }}>
          <p style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.08em', marginBottom: '0.85rem' }}>
            SCAN AT RECEPTION DESK
          </p>

          <div style={{
            background: '#ffffff',
            padding: '1rem',
            borderRadius: '16px',
            display: 'inline-block',
            boxShadow: '0 0 30px rgba(34, 197, 94, 0.35)',
            marginBottom: '0.85rem'
          }}>
            <QrCode size={130} color="#030712" />
          </div>

          <p style={{ fontSize: '0.75rem', color: '#4ade80', fontWeight: 600, margin: 0 }}>
            ● Dynamic Token • Valid for Floor Access
          </p>
        </div>

        {/* Membership Details & Expiry */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-glass)',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Valid Until:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc' }}>{member.expiresAt}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Assigned Trainer:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-lime)' }}>{member.trainer}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Current Goal:</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#22d3ee' }}>{member.workoutGoal}</span>
          </div>
        </div>

        {/* Today's Workout Split Card */}
        <div style={{
          background: 'rgba(34, 197, 94, 0.08)',
          border: '1px solid rgba(34, 197, 94, 0.3)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem',
          marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Flame size={16} color="#4ade80" />
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#4ade80', textTransform: 'uppercase' }}>
              Today's Assigned Workout Split
            </span>
          </div>
          <h4 style={{ fontSize: '1rem', margin: '0 0 0.5rem 0', color: '#f8fafc' }}>
            Upper Body Hypertrophy & Core
          </h4>
          <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            <li>Incline Bench Press — 4 sets × 8-10 reps</li>
            <li>Lat Pulldowns — 4 sets × 10-12 reps</li>
            <li>Seated Cable Rows — 3 sets × 12 reps</li>
            <li>Hanging Leg Raises — 3 sets × 15 reps</li>
          </ul>
        </div>

        {/* Action Button: Chat with Trainer */}
        <button className="btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
          <MessageSquare size={17} />
          <span>Message Personal Trainer ({member.trainer})</span>
        </button>
      </div>
    </div>
  );
}
