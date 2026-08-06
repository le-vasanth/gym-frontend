import React, { useState } from 'react';
import { 
  CreditCard, 
  IndianRupee, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Send, 
  Plus,
  ArrowUpRight,
  Receipt,
  HelpCircle,
  Calendar,
  UserPlus,
  Users,
  Edit2,
  Trash2
} from 'lucide-react';

export default function PaymentMonitoringView({ 
  members, 
  _transactions, 
  onOpenPaymentModal, 
  onSendReminder,
  onOpenAddMember,
  onEditMember,
  onDeleteMember,
  searchQuery: propSearchQuery = '' 
}) {
  const [cycleFilter, setCycleFilter] = useState('All'); // 'All' | 'Monthly' | '6-Month' | 'Yearly'
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Paid' | 'Due Soon' | 'Overdue'
  const [localSearch, setLocalSearch] = useState('');
  const [remindersSent, setRemindersSent] = useState({});

  const handleRemind = (id, name) => {
    onSendReminder(name);
    setRemindersSent(prev => ({ ...prev, [id]: true }));
  };

  const activeSearch = propSearchQuery || localSearch;

  const filteredMembers = members.filter(member => {
    const matchesSearch = 
      member.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
      member.phone.includes(activeSearch) ||
      member.id.toLowerCase().includes(activeSearch.toLowerCase());

    const matchesCycle = 
      cycleFilter === 'All' || 
      (cycleFilter === 'Monthly' && member.planCycle === 'Monthly') ||
      (cycleFilter === '6-Month' && member.planCycle === '6-Month') ||
      (cycleFilter === 'Yearly' && member.planCycle === 'Yearly');

    const matchesStatus = 
      statusFilter === 'All' ||
      member.paymentStatus === statusFilter;

    return matchesSearch && matchesCycle && matchesStatus;
  });

  const paidCount = members.filter(m => m.paymentStatus === 'Paid').length;
  const overdueCount = members.filter(m => m.paymentStatus === 'Overdue').length;
  const dueSoonCount = members.filter(m => m.paymentStatus === 'Due Soon').length;

  // Calculate total overdue amount
  const totalOverdueINR = members
    .filter(m => m.paymentStatus === 'Overdue')
    .reduce((acc, curr) => acc + (curr.planPrice || 0), 0);

  return (
    <div className="animate-fade-in">
      {/* Module Title Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '0.6rem',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.65rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#0f172a' }}>
            Payments &amp; Subscriptions
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          <button 
            onClick={onOpenAddMember}
            style={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '0.42rem 0.85rem', 
              fontSize: '0.8rem', 
              fontWeight: 700,
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem',
              boxShadow: '0 2px 6px rgba(16, 185, 129, 0.25)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <UserPlus size={15} />
            <span>+ Add Member</span>
          </button>
          <button 
            className="btn-primary" 
            onClick={() => onOpenPaymentModal(null)}
            style={{ 
              padding: '0.42rem 0.85rem', 
              fontSize: '0.8rem', 
              borderRadius: '6px',
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem' 
            }}
          >
            <IndianRupee size={15} />
            <span>+ Fee / Renew Plan</span>
          </button>
        </div>
      </div>

      {/* 4 Compact Payment Health KPI Cards */}
      <div className="stats-grid" style={{ 
        marginBottom: '0.85rem',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '0.85rem'
      }}>
        {/* Card 1: All Gym Members */}
        <div 
          className="glass-card" 
          onClick={() => setStatusFilter('All')}
          style={{ 
            borderLeft: '4px solid #6366f1',
            border: statusFilter === 'All' ? '2px solid #6366f1' : undefined,
            background: statusFilter === 'All' ? '#eef2ff' : '#ffffff',
            boxShadow: statusFilter === 'All' ? '0 4px 14px rgba(99, 102, 241, 0.25)' : undefined,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            padding: '0.75rem 1rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.74rem', color: '#4338ca', fontWeight: 700, textTransform: 'uppercase' }}>
              All Members
            </span>
            <div style={{ background: '#e0e7ff', padding: '0.3rem', borderRadius: '8px', color: '#4338ca' }}>
              <Users size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {members.length}
            </h3>
            <span style={{ fontSize: '0.76rem', color: '#64748b', fontWeight: 600 }}>Total Roster</span>
          </div>
        </div>

        {/* Card 2: Fully Paid Members */}
        <div 
          className="glass-card" 
          onClick={() => setStatusFilter(statusFilter === 'Paid' ? 'All' : 'Paid')}
          style={{ 
            borderLeft: '4px solid #059669',
            border: statusFilter === 'Paid' ? '2px solid #059669' : undefined,
            background: statusFilter === 'Paid' ? '#f0fdf4' : '#ffffff',
            boxShadow: statusFilter === 'Paid' ? '0 4px 14px rgba(5, 150, 105, 0.25)' : undefined,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            padding: '0.75rem 1rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.74rem', color: '#059669', fontWeight: 700, textTransform: 'uppercase' }}>
              Fully Paid
            </span>
            <div style={{ background: '#dcfce7', padding: '0.3rem', borderRadius: '8px', color: '#15803d' }}>
              <CheckCircle2 size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {paidCount}
            </h3>
            <span style={{ fontSize: '0.76rem', color: '#059669', fontWeight: 600 }}>Up To Date</span>
          </div>
        </div>

        {/* Card 3: Overdue Revenue at Risk */}
        <div 
          className="glass-card" 
          onClick={() => setStatusFilter(statusFilter === 'Overdue' ? 'All' : 'Overdue')}
          style={{ 
            borderLeft: '4px solid #dc2626',
            border: statusFilter === 'Overdue' ? '2px solid #dc2626' : undefined,
            background: statusFilter === 'Overdue' ? '#fee2e2' : (overdueCount > 0 ? '#fef2f2' : '#ffffff'),
            boxShadow: statusFilter === 'Overdue' ? '0 4px 14px rgba(220, 38, 38, 0.25)' : undefined,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            padding: '0.75rem 1rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.74rem', color: '#dc2626', fontWeight: 700, textTransform: 'uppercase' }}>
              Overdue / Unpaid
            </span>
            <div style={{ background: '#fee2e2', padding: '0.3rem', borderRadius: '8px', color: '#dc2626' }}>
              <AlertCircle size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#dc2626' }}>
              {overdueCount}
            </h3>
            <span style={{ fontSize: '0.76rem', color: '#dc2626', fontWeight: 600 }}>₹{totalOverdueINR.toLocaleString('en-IN')} Due</span>
          </div>
        </div>

        {/* Card 4: Due Soon (7 Days) */}
        <div 
          className="glass-card" 
          onClick={() => setStatusFilter(statusFilter === 'Due Soon' ? 'All' : 'Due Soon')}
          style={{ 
            borderLeft: '4px solid #0284c7',
            border: statusFilter === 'Due Soon' ? '2px solid #0284c7' : undefined,
            background: statusFilter === 'Due Soon' ? '#f0f9ff' : '#ffffff',
            boxShadow: statusFilter === 'Due Soon' ? '0 4px 14px rgba(2, 132, 199, 0.2)' : undefined,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            padding: '0.75rem 1rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.74rem', color: '#0284c7', fontWeight: 700, textTransform: 'uppercase' }}>
              Due in 7 Days
            </span>
            <div style={{ background: '#e0f2fe', padding: '0.3rem', borderRadius: '8px', color: '#0284c7' }}>
              <Clock size={15} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
              {dueSoonCount}
            </h3>
            <span style={{ fontSize: '0.76rem', color: '#0284c7', fontWeight: 600 }}>Renewal Window</span>
          </div>
        </div>
      </div>

      {/* Compact Small Filter Toolbar: Plan Cycles & Payment Status */}
      <div className="glass-panel" style={{ padding: '0.6rem 1rem', marginBottom: '1.25rem', background: '#ffffff', borderRadius: '10px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexWrap: 'wrap' }}>
            {/* Cycle Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginRight: '0.2rem' }}>
                Plan:
              </span>
              {[
                { id: 'All', label: 'All' },
                { id: 'Monthly', label: 'Monthly' },
                { id: '6-Month', label: '6-Month' },
                { id: 'Yearly', label: 'Yearly' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setCycleFilter(tab.id)}
                  style={{
                    padding: '0.28rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    background: cycleFilter === tab.id ? '#059669' : '#f8fafc',
                    color: cycleFilter === tab.id ? '#ffffff' : '#475569',
                    border: cycleFilter === tab.id ? '1px solid #059669' : '1px solid #cbd5e1',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div style={{ width: '1px', height: '22px', background: '#e2e8f0' }} />

            {/* Payment Status Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', marginRight: '0.2rem' }}>
                Status:
              </span>
              {['All', 'Paid', 'Due Soon', 'Overdue'].map(st => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    padding: '0.28rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.76rem',
                    fontWeight: 700,
                    background: statusFilter === st ? '#e0f2fe' : '#ffffff',
                    color: statusFilter === st ? '#0284c7' : '#64748b',
                    border: statusFilter === st ? '1px solid #0284c7' : '1px solid #cbd5e1',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Monitoring Main Table */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', background: '#ffffff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0f172a' }}>
            <CreditCard size={20} color="#059669" /> Member Payment Status ({filteredMembers.length} Members)
          </h3>
          <span style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 600 }}>
            Showing {cycleFilter} Plans • {statusFilter} Status
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '0.9rem 1rem' }}>Member Name & Phone</th>
                <th style={{ padding: '0.9rem 1rem' }}>Fee Plan Cycle</th>
                <th style={{ padding: '0.9rem 1rem' }}>Plan Fee (₹)</th>
                <th style={{ padding: '0.9rem 1rem' }}>Last Paid Date</th>
                <th style={{ padding: '0.9rem 1rem' }}>Next Due Date</th>
                <th style={{ padding: '0.9rem 1rem' }}>Payment Status</th>
                <th style={{ padding: '0.9rem 1rem', textAlign: 'right' }}>Owner Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => {
                const isOverdue = member.paymentStatus === 'Overdue';
                const isDueSoon = member.paymentStatus === 'Due Soon';
                const isPaid = member.paymentStatus === 'Paid';

                return (
                  <tr 
                    key={member.id}
                    style={{ 
                      borderBottom: '1px solid #f1f5f9',
                      background: isOverdue ? '#fff5f5' : 'transparent',
                      transition: 'background 0.2s ease'
                    }}
                  >
                    {/* Member Column */}
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={member.avatar}
                          alt={member.name}
                          style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: '12px',
                            objectFit: 'cover',
                            border: isOverdue ? '2px solid #dc2626' : '2px solid #059669'
                          }}
                        />
                        <div>
                          <h4 style={{ fontSize: '0.98rem', margin: 0, fontWeight: 800, color: '#0f172a' }}>
                            {member.name}
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                            {member.phone}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Plan Cycle */}
                    <td style={{ padding: '1rem' }}>
                      <span style={{
                        display: 'inline-block',
                        background: '#f8fafc',
                        border: '1px solid #cbd5e1',
                        padding: '0.3rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        color: member.planCycle === 'Yearly' ? '#7c3aed' :
                               member.planCycle === '6-Month' ? '#0284c7' : '#0f172a'
                      }}>
                        {member.planType || member.plan || 'Standard Plan'}
                      </span>
                    </td>

                    {/* Amount (₹ INR) */}
                    <td style={{ padding: '1rem', fontSize: '0.98rem', fontWeight: 800, color: '#0f172a' }}>
                      ₹{(member.planPrice || 0).toLocaleString('en-IN')}
                    </td>

                    {/* Last Paid Date */}
                    <td style={{ padding: '1rem', fontSize: '0.88rem', color: '#334155', fontWeight: 500 }}>
                      {member.lastPaidDate || 'Today'}
                      <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                        via {member.paymentMethod || 'UPI (GPay)'}
                      </span>
                    </td>

                    {/* Next Due Date */}
                    <td style={{ 
                      padding: '1rem', 
                      fontSize: '0.9rem', 
                      fontWeight: 800,
                      color: isOverdue ? '#dc2626' : isDueSoon ? '#b45309' : '#059669'
                    }}>
                      {member.nextDueDate || member.expiresAt || 'N/A'}
                    </td>

                    {/* Payment Status Badge */}
                    <td style={{ padding: '1rem' }}>
                      <span className={
                        isPaid ? 'badge badge-active' :
                        isOverdue ? 'badge badge-expired' : 'badge badge-cyan'
                      }>
                        {member.paymentStatus || 'Paid'}
                      </span>
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '1rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.6rem' }}>
                        {isOverdue || isDueSoon ? (
                          <button
                            onClick={() => handleRemind(member.id, member.name)}
                            className="btn-secondary"
                            style={{ 
                              padding: '0.45rem 0.85rem', 
                              fontSize: '0.78rem', 
                              color: '#b45309', 
                              borderColor: '#fcd34d',
                              background: '#fffbeb' 
                            }}
                          >
                            {remindersSent[member.id] ? 'Notice Sent ✓' : 'WhatsApp Alert'}
                          </button>
                        ) : null}

                        <button
                          onClick={() => onEditMember && onEditMember(member)}
                          className="btn-icon"
                          title="Edit Member"
                          style={{
                            padding: '0.45rem',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            background: '#f8fafc',
                            color: '#334155',
                            cursor: 'pointer'
                          }}
                        >
                          <Edit2 size={15} />
                        </button>

                        <button
                          onClick={() => onDeleteMember && onDeleteMember(member.id, member.name)}
                          className="btn-icon"
                          title="Delete Member"
                          style={{
                            padding: '0.45rem',
                            borderRadius: '8px',
                            border: '1px solid #fecaca',
                            background: '#fef2f2',
                            color: '#dc2626',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={15} />
                        </button>

                        <button
                          onClick={() => onOpenPaymentModal(member)}
                          className="btn-primary"
                          style={{
                            padding: '0.5rem 1rem',
                            fontSize: '0.82rem',
                            background: isOverdue ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : undefined,
                            boxShadow: isOverdue ? '0 4px 12px rgba(220, 38, 38, 0.25)' : undefined
                          }}
                        >
                          <span>{isOverdue ? `Collect ₹${(member.planPrice || 0).toLocaleString('en-IN')}` : 'Renew Plan'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
