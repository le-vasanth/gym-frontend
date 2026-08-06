import React from 'react';
import { 
  Award, 
  Calendar, 
  Clock, 
  Users, 
  Star, 
  CheckCircle2,
  Flame,
  UserPlus
} from 'lucide-react';

export default function TrainerScheduleView({ trainers, classes }) {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.75rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
            Gym Trainers & Class Roster
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', margin: '0.2rem 0 0 0' }}>
            Manage fitness staff specializations, active trainee loads, and daily group workout classes
          </p>
        </div>

        <button className="btn-primary">
          <UserPlus size={16} />
          <span>+ Add New Trainer</span>
        </button>
      </div>

      {/* Section 1: Trainers Roster */}
      <h3 style={{ fontSize: '1.15rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Award size={18} color="var(--accent-lime)" /> Active Fitness Trainers ({trainers.length})
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2.5rem'
      }}>
        {trainers.map((trainer) => (
          <div key={trainer.id} className="glass-card" style={{ position: 'relative' }}>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.1rem' }}>
              <img
                src={trainer.avatar}
                alt={trainer.name}
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '16px',
                  objectFit: 'cover',
                  border: '2px solid var(--accent-lime)'
                }}
              />
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h4 style={{ fontSize: '1.1rem', margin: 0, fontWeight: 700 }}>
                    {trainer.name}
                  </h4>
                  <span className="badge badge-active" style={{ fontSize: '0.68rem', padding: '0.15rem 0.5rem' }}>
                    Staff
                  </span>
                </div>
                <p style={{ fontSize: '0.82rem', color: '#22d3ee', fontWeight: 600, margin: '0.15rem 0 0.35rem 0' }}>
                  {trainer.specialty}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.78rem', color: '#fbbf24' }}>
                  <Star size={14} fill="#fbbf24" />
                  <span style={{ fontWeight: 700 }}>{trainer.rating}</span>
                </div>
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '0.75rem',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-glass)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              fontSize: '0.78rem'
            }}>
              <span style={{ color: 'var(--text-muted)' }}>Experience:</span>
              <span style={{ fontWeight: 600 }}>{trainer.experience}</span>
              <span style={{ color: 'var(--text-muted)' }}>Active Trainees:</span>
              <span style={{ color: 'var(--accent-lime)', fontWeight: 700 }}>{trainer.activeTrainees} members</span>
            </div>

            <div style={{
              marginTop: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: 'var(--text-muted)',
              fontSize: '0.76rem'
            }}>
              <Clock size={14} />
              <span>{trainer.schedule}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Section 2: Today's Class Timetable */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={18} color="#22d3ee" /> Today's Group Class Timetable
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Real-time booking capacity for HIIT, Yoga and Strength Clinics
            </p>
          </div>
          <span className="badge badge-cyan">3 Sessions Today</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {classes.map((cls) => (
            <div
              key={cls.id}
              className="glass-card"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <h4 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
                    {cls.name}
                  </h4>
                  <span className={
                    cls.status === 'In Progress' ? 'badge badge-active' :
                    cls.status === 'Full' ? 'badge badge-expired' : 'badge badge-cyan'
                  }>
                    {cls.status}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
                  Trainer: <strong style={{ color: '#f8fafc' }}>{cls.trainer}</strong> • Time: <strong style={{ color: '#22d3ee' }}>{cls.time}</strong>
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', display: 'block' }}>
                    {cls.capacity}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Member Bookings
                  </span>
                </div>
                <button className="btn-secondary" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  View Roster
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
