import React from 'react';
import { 
  IndianRupee,
  UserCheck,
  LayoutDashboard, 
  Users, 
  CreditCard,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, overdueCount, todayAttendanceCount }) {
  const navItems = [
    { 
      id: 'payments', 
      label: 'Payments & Fees', 
      icon: IndianRupee, 
      badge: overdueCount > 0 ? `${overdueCount} Unpaid` : null,
      badgeColor: '#b91c1c',
      badgeBg: '#fee2e2'
    },
    { 
      id: 'attendance', 
      label: 'Attendance & Gate', 
      icon: UserCheck,
      badge: todayAttendanceCount ? `${todayAttendanceCount} Scans` : null,
      badgeColor: '#15803d',
      badgeBg: '#dcfce7'
    },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'members', label: 'Members', icon: Users },
    { id: 'plans', label: 'Fee Plans', icon: CreditCard }
  ];

  return (
    <aside className="glass-panel" style={{
      padding: '1.4rem 1.1rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: 'calc(100vh - 110px)',
      position: 'sticky',
      top: '90px',
      background: '#ffffff'
    }}>
      <div>
        <div style={{ padding: '0 0.5rem 0.85rem 0.5rem', marginBottom: '0.85rem', borderBottom: '2px solid #e2e8f0' }}>
          <p style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: '#059669', letterSpacing: '0.06em', fontWeight: 800, margin: 0 }}>
            MAIN MENU
          </p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  background: isActive ? '#ecfdf5' : 'transparent',
                  color: isActive ? '#059669' : '#334155',
                  border: isActive ? '2px solid #059669' : '1px solid transparent',
                  fontWeight: isActive ? 700 : 600,
                  fontSize: '0.94rem',
                  transition: 'all 0.2s ease',
                  textAlign: 'left'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Icon size={19} color={isActive ? '#059669' : '#64748b'} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span style={{
                    fontSize: '0.72rem',
                    background: item.badgeBg || '#f1f5f9',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    color: item.badgeColor || '#0f172a',
                    fontWeight: 800,
                    border: `1px solid ${item.badgeColor || 'transparent'}`
                  }}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

    </aside>
  );
}
