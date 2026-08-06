import React, { useState } from 'react';
import { Dumbbell, Search, UserCheck, IndianRupee, CheckCircle2, AlertCircle, Eye, X, LogOut } from 'lucide-react';

export default function Navbar({ 
  searchQuery, 
  setSearchQuery, 
  onOpenCheckInModal, 
  allMembers = [], 
  onOpenPaymentModal, 
  onSelectMember,
  onLogoutRequest,
  adminName = "Admin Manager",
  adminAvatar,
  onEditProfileRequest,
  onViewPhoto
}) {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Compute initials for the avatar
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'AM';
  };

  // Filter members when owner types in the top search box
  const searchResults = searchQuery.trim() === '' ? [] : allMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.phone.includes(searchQuery) ||
    m.id.toLowerCase().includes(searchQuery.toLowerCase())
  ).slice(0, 5);

  return (
    <header className="navbar-glass animate-fade-in" style={{ position: 'sticky', top: 0, zIndex: 60 }}>
      {/* Brand & Logo - Hifi Gym */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        <div style={{
          width: '46px',
          height: '46px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 14px rgba(5, 150, 105, 0.25)'
        }}>
          <Dumbbell size={24} color="#ffffff" style={{ transform: 'rotate(-45deg)' }} />
        </div>
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <span style={{ 
              fontSize: '0.74rem', 
              fontWeight: 700, 
              color: '#059669', 
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '0.1rem'
            }}>
              Welcome to
            </span>
            <h1 style={{ 
              fontSize: '1.38rem', 
              fontWeight: 800, 
              margin: 0, 
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: '1.15'
            }}>
              HIFI GYM
            </h1>
          </div>
        </div>
      </div>

      {/* Global Quick Search Bar right next to the gym name */}
      <div style={{ 
        position: 'relative', 
        width: '360px'
      }}>
        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Search 
            size={17} 
            color="#64748b" 
            style={{ position: 'absolute', left: '14px', pointerEvents: 'none' }} 
          />
          <input
            type="text"
            className="input-field"
            placeholder="Search member name (+91 phone) or ID..."
            value={searchQuery}
            onFocus={() => setIsSearchFocused(true)}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsSearchFocused(true);
            }}
            style={{
              paddingLeft: '38px',
              paddingRight: searchQuery ? '36px' : '12px',
              background: '#ffffff',
              borderColor: isSearchFocused ? '#059669' : '#cbd5e1',
              color: '#0f172a',
              fontWeight: 600,
              boxShadow: isSearchFocused ? '0 0 0 3px rgba(5, 150, 105, 0.15)' : 'none'
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{ position: 'absolute', right: '12px', color: '#64748b', display: 'flex', alignItems: 'center' }}
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Live Search Dropdown Popup */}
        {isSearchFocused && searchResults.length > 0 && (
          <div 
            className="animate-slide-up"
            style={{
              position: 'absolute',
              top: '52px',
              left: 0,
              right: 0,
              background: '#ffffff',
              border: '2px solid #059669',
              borderRadius: '14px',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.15)',
              padding: '0.75rem',
              zIndex: 100
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', padding: '0 0.4rem' }}>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase' }}>
                Quick Member Actions ({searchResults.length} found)
              </span>
              <button 
                onClick={() => setIsSearchFocused(false)} 
                style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}
              >
                Close ✕
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {searchResults.map((m) => {
                const isOverdue = m.paymentStatus === 'Overdue';
                return (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.75rem',
                      background: isOverdue ? '#fff5f5' : '#f8fafc',
                      borderRadius: '10px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <img
                        src={m.avatar}
                        alt={m.name}
                        style={{ width: '36px', height: '36px', borderRadius: '10px', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <strong style={{ fontSize: '0.88rem', color: '#0f172a' }}>{m.name}</strong>
                          <span className={isOverdue ? 'badge badge-expired' : 'badge badge-active'} style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem' }}>
                            {m.paymentStatus}
                          </span>
                        </div>
                        <span style={{ fontSize: '0.74rem', color: '#64748b', display: 'block', fontWeight: 600 }}>
                          {m.phone} • {m.planCycle} Plan
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        onClick={() => {
                          setIsSearchFocused(false);
                          if (onSelectMember) onSelectMember(m);
                        }}
                        className="btn-secondary"
                        style={{ padding: '0.4rem 0.65rem', fontSize: '0.75rem' }}
                        title="View member CRM profile"
                      >
                        <Eye size={13} />
                        <span>Profile</span>
                      </button>

                      <button
                        onClick={() => {
                          setIsSearchFocused(false);
                          if (onOpenPaymentModal) onOpenPaymentModal(m);
                        }}
                        className="btn-primary"
                        style={{ 
                          padding: '0.4rem 0.75rem', 
                          fontSize: '0.75rem',
                          background: isOverdue ? 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' : undefined
                        }}
                      >
                        <IndianRupee size={13} />
                        <span>{isOverdue ? `Collect ₹${m.planPrice}` : 'Renew'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right Controls: Quick Desk Check-In / Owner Status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button 
          className="btn-primary" 
          onClick={onOpenCheckInModal}
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
          title="Switch immediately to the Daily Check-In Gate"
        >
          <UserCheck size={17} />
          <span>Go to Desk Check-In Gate</span>
        </button>

        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem',
          paddingLeft: '1rem',
          borderLeft: '1px solid #e2e8f0'
        }}>
          {adminAvatar ? (
            <img 
              src={adminAvatar} 
              alt={adminName} 
              onClick={() => onViewPhoto && onViewPhoto(adminAvatar)}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid #059669',
                objectFit: 'cover',
                cursor: 'pointer'
              }} 
            />
          ) : (
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              background: '#ecfdf5',
              border: '2px solid #059669',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.88rem',
              color: '#059669'
            }}>
              {getInitials(adminName)}
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.1, marginBottom: '0.2rem' }}>
              {adminName}
            </span>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
              <button 
                onClick={() => {
                  if (onEditProfileRequest) onEditProfileRequest();
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.15rem', 
                  background: 'transparent', 
                  border: 'none', 
                  padding: 0, 
                  color: '#059669', 
                  fontSize: '0.74rem', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <span>Edit</span>
              </button>
              
              <div style={{ width: '1px', height: '10px', background: '#cbd5e1' }}></div>
              
              <button 
                onClick={() => {
                  if (onLogoutRequest) onLogoutRequest();
                }}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.25rem', 
                  background: 'transparent', 
                  border: 'none', 
                  padding: 0, 
                  color: '#dc2626', 
                  fontSize: '0.74rem', 
                  fontWeight: 700, 
                  cursor: 'pointer',
                  transition: 'opacity 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                <LogOut size={12} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
