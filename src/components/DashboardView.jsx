import React, { useState } from 'react';
import { 
  TrendingUp, 
  Users, 
  UserCheck, 
  Clock, 
  AlertTriangle, 
  Send, 
  CheckCircle2,
  QrCode,
  UserPlus,
  ArrowUpRight,
  Flame,
  IndianRupee,
  Receipt
} from 'lucide-react';
import { initialTransactions } from '../data/mockGymData';

export default function DashboardView({ 
  members, 
  transactions = [],
  analytics, 
  onOpenAddMember, 
  onOpenCheckInModal,
  onSelectMember 
}) {
  const safeTransactions = (transactions && transactions.length > 0) ? transactions : initialTransactions;
  const recentCheckIns = members.slice(0, 4);

  return (
    <div className="animate-fade-in">
      {/* Quick Action Buttons Bar (No verbose banner text) */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: '0.85rem',
        marginBottom: '1.25rem'
      }}>
        <button className="btn-primary" onClick={onOpenAddMember}>
          <UserPlus size={16} />
          <span>+ Add Member</span>
        </button>
      </div>

      {/* 4 Executive KPI Cards */}
      <div className="stats-grid" style={{ marginBottom: '1.75rem' }}>
        {/* KPI 1: Collected This Month (Moved from Payments) */}
        <div className="glass-card" style={{ borderLeft: '4px solid #059669' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.8rem', color: '#475569', fontWeight: 700, textTransform: 'uppercase' }}>
              Collected This Month
            </span>
            <div style={{ background: '#dcfce7', padding: '0.4rem', borderRadius: '10px', color: '#15803d' }}>
              <IndianRupee size={19} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.9rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {analytics?.monthlyRevenue || '₹31,600'}
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 700 }}>
              {safeTransactions.length} Paid Receipts
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.35rem 0 0 0', fontWeight: 500 }}>
            UPI (GPay/PhonePe), Card & Cash verified
          </p>
        </div>

        {/* KPI 2: Total Active Members */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Active Members
            </span>
            <div style={{
              background: 'rgba(6, 182, 212, 0.15)',
              padding: '0.35rem',
              borderRadius: '8px',
              color: '#22d3ee'
            }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>
              {members.filter(m => m.status === 'Active').length + 406}
            </h3>
            <span className="badge badge-cyan">94% Active</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.4rem 0 0 0' }}>
            VIP & Annual plans making up 68%
          </p>
        </div>

        {/* KPI 3: Today Check-Ins */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Today's Floor Check-Ins
            </span>
            <div style={{
              background: 'rgba(168, 85, 247, 0.15)',
              padding: '0.35rem',
              borderRadius: '8px',
              color: '#c084fc'
            }}>
              <UserCheck size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>
              {analytics.todayCheckIns}
            </h3>
            <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 600 }}>
              Live Peak
            </span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.4rem 0 0 0' }}>
            Busiest hours: 06:00 AM & 06:00 PM
          </p>
        </div>

        {/* KPI 4: Renewals Due */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>
              Expiring This Week
            </span>
            <div style={{
              background: 'rgba(249, 115, 22, 0.15)',
              padding: '0.35rem',
              borderRadius: '8px',
              color: '#fb923c'
            }}>
              <AlertTriangle size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.85rem', fontWeight: 800, margin: 0 }}>
              {analytics.expiringThisWeek}
            </h3>
            <span className="badge badge-expired">Action Needed</span>
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0.4rem 0 0 0' }}>
            1-click automated SMS reminder ready
          </p>
        </div>
      </div>

      {/* Recent Floor Check-Ins Section (Full Width) */}
      <div className="glass-panel" style={{ padding: '1.4rem', marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Live Gym Floor Check-Ins</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.2rem 0 0 0' }}>
              Recent member arrivals scanned at front desk
            </p>
          </div>
          <button 
            className="btn-secondary" 
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.78rem' }}
            onClick={onOpenCheckInModal}
          >
            + Manual Desk Check-In
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recentCheckIns.map((member) => (
            <div
              key={member.id}
              onClick={() => onSelectMember(member)}
              className="glass-card-interactive"
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 2.2fr 1.8fr 1.2fr',
                alignItems: 'center',
                padding: '0.95rem 1.4rem',
                borderLeft: '4px solid #10b981',
                borderRadius: '10px'
              }}
            >
              {/* Column 1: Member Name & Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem' }}>
                <img
                  src={member.avatar}
                  alt={member.name}
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2px solid var(--accent-lime)'
                  }}
                />
                <div>
                  <h4 style={{ fontSize: '0.98rem', margin: 0, fontWeight: 700, color: '#0f172a' }}>
                    {member.name}
                  </h4>
                  <span style={{ fontSize: '0.74rem', color: '#10b981', fontWeight: 700 }}>
                    Active Member
                  </span>
                </div>
              </div>

              {/* Column 2: Membership Plan & Workout Goal */}
              <div>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                  {member.plan}
                </p>
                <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0.15rem 0 0 0', fontWeight: 500 }}>
                  Goal: {member.workoutGoal}
                </p>
              </div>

              {/* Column 3: Trainer */}
              <div>
                <p style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#94a3b8', margin: 0, fontWeight: 600 }}>
                  Assigned Trainer
                </p>
                <p style={{ fontSize: '0.88rem', fontWeight: 700, color: '#334155', margin: '0.15rem 0 0 0' }}>
                  {member.trainer}
                </p>
              </div>

              {/* Column 4: Check-In Timestamp */}
              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-active" style={{ fontSize: '0.75rem', padding: '0.35rem 0.75rem' }}>
                  {member.lastCheckIn}
                </span>
                <p style={{ fontSize: '0.74rem', color: '#64748b', margin: '0.25rem 0 0 0', fontWeight: 500 }}>
                  Front Desk Scan
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gym Payment Transaction Ledger (₹ INR) - Moved from Payments */}
      <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', marginTop: '1.75rem', borderRadius: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.2rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
              <Receipt size={19} color="#059669" /> Gym Payment Transaction Ledger (₹ INR)
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: '0.2rem 0 0 0', fontWeight: 500 }}>
              Verified UPI (Google Pay / PhonePe), card and cash receipt log for Indian accounting
            </p>
          </div>
          <span className="badge badge-active">{safeTransactions.length} Verified Receipts</span>
        </div>

        <div style={{ 
          maxHeight: '350px', 
          overflowY: 'auto', 
          overflowX: 'auto', 
          border: '1px solid #e2e8f0', 
          borderRadius: '10px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, background: '#f8fafc', zIndex: 10, borderBottom: '2px solid #e2e8f0' }}>
              <tr style={{ color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.85rem 1rem' }}>Receipt No</th>
                <th style={{ padding: '0.85rem 1rem' }}>Date & Time</th>
                <th style={{ padding: '0.85rem 1rem' }}>Member Name</th>
                <th style={{ padding: '0.85rem 1rem' }}>Plan Cycle</th>
                <th style={{ padding: '0.85rem 1rem' }}>Payment Method</th>
                <th style={{ padding: '0.85rem 1rem' }}>Amount Collected (INR)</th>
                <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {safeTransactions.map((txn) => (
                <tr key={txn.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 800, color: '#059669' }}>
                    {txn.receiptNo}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', fontSize: '0.88rem', color: '#334155', fontWeight: 500 }}>
                    {txn.date}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 700, color: '#0f172a' }}>
                    {txn.memberName}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', fontSize: '0.88rem', color: '#64748b' }}>
                    {txn.planCycle}
                  </td>
                  <td style={{ padding: '0.9rem 1rem' }}>
                    <span style={{
                      background: '#f1f5f9',
                      border: '1px solid #cbd5e1',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      color: '#0f172a'
                    }}>
                      {txn.method}
                    </span>
                  </td>
                  <td style={{ padding: '0.9rem 1rem', fontWeight: 800, color: '#15803d', fontSize: '0.98rem' }}>
                    {txn.amount}
                  </td>
                  <td style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>
                    <span className="badge badge-active" style={{ fontSize: '0.72rem' }}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
