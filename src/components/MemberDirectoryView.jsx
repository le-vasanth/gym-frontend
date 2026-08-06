import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  UserPlus, 
  Phone, 
  Mail, 
  Dumbbell, 
  Calendar, 
  ArrowRight,
  MoreVertical,
  QrCode,
  Edit2,
  Trash2
} from 'lucide-react';

export default function MemberDirectoryView({ 
  members, 
  searchQuery, 
  onSelectMember, 
  onOpenAddMember,
  onEditMember,
  onDeleteMember
}) {
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.phone.includes(searchQuery) ||
      member.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (statusFilter === 'All') return matchesSearch;
    if (statusFilter === 'Active') return matchesSearch && member.status === 'Active';
    if (statusFilter === 'Expired') return matchesSearch && member.status === 'Expired';
    if (statusFilter === 'VIP') return matchesSearch && member.plan.includes('VIP');
    return matchesSearch;
  });

  return (
    <div className="animate-fade-in">
      {/* Header & Filter Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#0f172a' }}>
            Member Directory <span style={{ color: '#059669' }}>({filteredMembers.length})</span>
          </h2>
          <p style={{ color: '#475569', fontSize: '0.88rem', margin: '0.2rem 0 0 0', fontWeight: 500 }}>
            Manage gym members and membership profiles
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Status Pills */}
          <div style={{
            display: 'flex',
            background: '#f8fafc',
            padding: '3px',
            borderRadius: 'var(--radius-full)',
            border: '1px solid #cbd5e1'
          }}>
            {['All', 'Active', 'Expired', 'VIP'].map(tab => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                style={{
                  padding: '0.38rem 0.95rem',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.8rem',
                  fontWeight: 700,
                  background: statusFilter === tab ? '#059669' : 'transparent',
                  color: statusFilter === tab ? '#ffffff' : '#475569',
                  transition: 'all 0.2s ease'
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          <button className="btn-primary" onClick={onOpenAddMember}>
            <UserPlus size={16} />
            <span>+ Add Member</span>
          </button>
        </div>
      </div>

      {/* Grid of Member Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '1.25rem'
      }}>
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => onSelectMember(member)}
            className="glass-card-interactive"
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '100%',
              position: 'relative'
            }}
          >
            <div>
              {/* Card Top Row: Avatar + Status + ID */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                  <img
                    src={member.avatar}
                    alt={member.name}
                    style={{
                      width: '52px',
                      height: '52px',
                      borderRadius: '14px',
                      objectFit: 'cover',
                      border: member.status === 'Active' ? '2px solid var(--accent-lime)' : '2px solid #f97316'
                    }}
                  />
                  <div>
                    <h3 style={{ fontSize: '1.05rem', margin: 0, fontWeight: 700 }}>
                      {member.name}
                    </h3>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, fontWeight: 500 }}>
                      ID: {member.id}
                    </div>
                  </div>
                </div>

                <span className={member.status === 'Active' ? 'badge badge-active' : 'badge badge-expired'}>
                  {member.status}
                </span>
              </div>

              {/* Membership & Goal Tag */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-glass)',
                marginBottom: '1rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Plan:</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#f8fafc' }}>{member.plan}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Trainer:</span>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-lime)' }}>{member.trainer}</span>
                </div>
              </div>

              {/* Body Stats mini summary */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '0.45rem', borderRadius: '6px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Weight</p>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0 }}>{member.bodyStats.weight}</p>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '0.45rem', borderRadius: '6px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Height</p>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0 }}>{member.bodyStats.height}</p>
                </div>
                <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', padding: '0.45rem', borderRadius: '6px', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>Body Fat</p>
                  <p style={{ fontSize: '0.82rem', fontWeight: 700, margin: 0 }}>{member.bodyStats.bodyFat}</p>
                </div>
              </div>
            </div>

            {/* Card Footer Row: Phone & Last Checkin */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '0.75rem',
              borderTop: '1px solid var(--border-glass)'
            }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Phone size={13} /> {member.phone}
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditMember && onEditMember(member);
                  }}
                  className="btn-icon"
                  title="Edit Member"
                  style={{
                    padding: '0.35rem',
                    borderRadius: '6px',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#94a3b8',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteMember && onDeleteMember(member.id, member.name);
                  }}
                  className="btn-icon"
                  title="Delete Member"
                  style={{
                    padding: '0.35rem',
                    borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#ef4444',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}
                >
                  <Trash2 size={13} />
                </button>
                <span style={{ fontSize: '0.76rem', color: '#22d3ee', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem', marginLeft: '0.25rem' }}>
                  View Profile <ArrowRight size={14} />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
