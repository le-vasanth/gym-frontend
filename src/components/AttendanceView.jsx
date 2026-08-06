import React, { useState } from 'react';
import { 
  UserCheck, 
  Search, 
  Clock, 
  IndianRupee,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Download,
  RefreshCw,
  LogOut,
  Activity,
  Radio
} from 'lucide-react';

export default function AttendanceView({ 
  members, 
  attendanceLogs, 
  onCheckInMember, 
  onCheckOutMember,
  onOpenPaymentModal,
  onResetDemoData,
  searchQuery: propSearchQuery = ''
}) {
  // Mode selection: 'console' (Live Reception Floor Console) or 'kiosk' (Self-Service Touchscreen PIN Kiosk)
  const [activeMode, setActiveMode] = useState('console');
  
  // Console state
  const [searchInput, setSearchInput] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [streamFilter, setStreamFilter] = useState('INSIDE'); // 'INSIDE' | 'COMPLETED' | 'ALL' | 'STOPPED'
  
  // Kiosk PIN mode states
  const [kioskStep, setKioskStep] = useState(1);
  const [kioskDigit, setKioskDigit] = useState('');
  const [pendingMember, setPendingMember] = useState(null);
  const [pinDigit, setPinDigit] = useState('');
  const [pinError, setPinError] = useState('');
  const [accessResult, setAccessResult] = useState(null); // 'GRANTED' | 'DENIED' | null
  const [lastCheckedMember, setLastCheckedMember] = useState(null);

  // CSV Export for standalone gyms without a database
  const handleExportCSV = () => {
    const headers = ["Log ID", "Date", "Arrival Time", "Check-Out Time", "Member Name", "Plan Cycle", "Fee Status", "Gate Status"];
    const rows = attendanceLogs.map(l => [
      l.id,
      l.date,
      l.time,
      l.checkOutTime || "Still Inside",
      l.memberName,
      l.planCycle,
      l.paymentStatusAtScan,
      l.status
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Hifi_Gym_Attendance_Logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter members for live search box
  const query = (propSearchQuery || searchInput).trim().toLowerCase();
  const searchResults = query ? members.filter(m => 
    m.name.toLowerCase().includes(query) || 
    m.phone.includes(query) || 
    m.id.toLowerCase().includes(query)
  ).slice(0, 6) : [];

  // Occupancy metrics
  const insideMembers = members.filter(m => Boolean(m.lastCheckIn) && !m.lastCheckOut);
  const checkedOutMembers = members.filter(m => Boolean(m.lastCheckOut));
  
  const insideLogs = attendanceLogs.filter(l => !l.checkOutTime && !l.status.includes('DENIED'));
  const completedLogs = attendanceLogs.filter(l => Boolean(l.checkOutTime));
  const stoppedLogs = attendanceLogs.filter(l => l.status.includes('DENIED') || l.status.includes('STOPPED'));

  // Filter stream logs
  const filteredLogs = attendanceLogs.filter(log => {
    if (streamFilter === 'INSIDE') return !log.checkOutTime && !log.status.includes('DENIED');
    if (streamFilter === 'COMPLETED') return Boolean(log.checkOutTime);
    if (streamFilter === 'STOPPED') return log.status.includes('DENIED') || log.status.includes('STOPPED');
    return true;
  });

  // Kiosk Keypad Handlers
  const handleKeyPress = (key) => {
    setPinError('');
    if (key === 'CLEAR') {
      if (kioskStep === 1) {
        setKioskDigit('');
        setAccessResult(null);
        setLastCheckedMember(null);
      } else {
        setPinDigit('');
      }
      return;
    }

    if (kioskStep === 1) {
      if (kioskDigit.length < 4) {
        setKioskDigit(prev => prev + key);
      }
    } else {
      if (pinDigit.length < 4) {
        const nextPin = pinDigit + key;
        setPinDigit(nextPin);
        if (nextPin.length === 4) {
          verifyPinAndCheckIn(nextPin);
        }
      }
    }
  };

  const handleNumpadSubmit = () => {
    if (kioskStep === 1) {
      if (!kioskDigit || kioskDigit.length < 4) {
        setPinError('Please enter the 4-digit ID or last 4 digits of phone number.');
        return;
      }
      const matched = members.find(m => 
        m.phone.endsWith(kioskDigit) || 
        m.id.toLowerCase().endsWith(kioskDigit.toLowerCase())
      );
      if (matched) {
        setPendingMember(matched);
        setKioskStep(2);
        setPinDigit('');
        setPinError('');
      } else {
        setPinError('Member not found! Please check digits or see front desk.');
      }
    }
  };

  const verifyPinAndCheckIn = (enteredPin) => {
    if (!pendingMember) return;
    const memberPin = pendingMember.pin || '1234';
    if (enteredPin === memberPin) {
      const isOverdue = pendingMember.paymentStatus === 'Overdue';
      if (isOverdue) {
        setAccessResult('DENIED');
        setLastCheckedMember({
          ...pendingMember,
          scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reason: 'Payment Overdue / Plan Expired'
        });
      } else {
        setAccessResult('GRANTED');
        onCheckInMember(pendingMember);
        setLastCheckedMember({
          ...pendingMember,
          scannedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          reason: 'Plan Active & Paid'
        });
      }
      setPinDigit('');
      setKioskDigit('');
      setKioskStep(1);
      setPendingMember(null);
    } else {
      setPinError('Incorrect 4-digit PIN! Please try again.');
      setPinDigit('');
    }
  };

  const cancelPinStep = () => {
    setKioskStep(1);
    setPendingMember(null);
    setPinDigit('');
    setPinError('');
  };

  return (
    <div className="animate-fade-in">
      {/* 1. DISTINCT HEADER: ENTRANCE COMMAND CENTER BAR */}
      <div className="glass-panel" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        gap: '1rem',
        background: '#ffffff',
        border: '1px solid #cbd5e1',
        padding: '1.25rem 1.5rem',
        borderRadius: '16px',
        color: '#0f172a'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{
              background: '#059669',
              color: '#ffffff',
              padding: '0.25rem 0.65rem',
              borderRadius: '6px',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.08em'
            }}>
              HIFI GYM TERMINAL
            </span>
            <h2 style={{ fontSize: '1.55rem', margin: 0, color: '#0f172a', fontWeight: 800 }}>
              Live Attendance &amp; Gate Console
            </h2>
          </div>
          <p style={{ color: '#64748b', fontSize: '0.86rem', margin: '0.3rem 0 0 0', fontWeight: 500 }}>
            Real-time gym floor occupancy &amp; entrance check-in station • Local browser persistence (No DB needed)
          </p>
        </div>

        {/* Mode Switch & CSV Export */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '3px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0'
          }}>
            <button
              onClick={() => setActiveMode('console')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: activeMode === 'console' ? '#059669' : 'transparent',
                color: activeMode === 'console' ? '#ffffff' : '#64748b',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Activity size={15} />
              <span>Floor Console</span>
            </button>

            <button
              onClick={() => setActiveMode('kiosk')}
              style={{
                padding: '0.45rem 0.9rem',
                borderRadius: '8px',
                fontSize: '0.8rem',
                fontWeight: 700,
                background: activeMode === 'kiosk' ? '#059669' : 'transparent',
                color: activeMode === 'kiosk' ? '#ffffff' : '#64748b',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <Lock size={15} />
              <span>PIN Kiosk</span>
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.45rem', 
              background: '#ffffff',
              border: '1px solid #cbd5e1', 
              color: '#0f172a',
              padding: '0.55rem 0.95rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.05)'
            }}
          >
            <Download size={15} color="#059669" />
            <span>Export CSV</span>
          </button>

          {onResetDemoData && (
            <button
              onClick={onResetDemoData}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#64748b',
                padding: '0.55rem 0.85rem',
                borderRadius: '8px',
                fontSize: '0.78rem',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
                cursor: 'pointer'
              }}
              title="Reset records to default initial state"
            >
              <RefreshCw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* MODE 1: LIVE RECEPTION FLOOR CONSOLE (SPLIT COMMAND CENTER) */}
      {activeMode === 'console' && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(340px, 1fr) minmax(380px, 1.35fr)',
          gap: '1.5rem',
          alignItems: 'start',
          marginBottom: '2rem'
        }}>
          {/* LEFT PANEL: SCAN STATION & FLOOR OCCUPANCY */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Quick Entrance Scanner Box */}
            <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.15rem', margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <UserCheck size={19} color="#059669" />
                  <span>Quick Check-In Station</span>
                </h3>
                <span className="badge badge-active" style={{ fontSize: '0.7rem' }}>
                  Live Desk
                </span>
              </div>

              {/* Instant Search Bar */}
              <div style={{ position: 'relative', marginBottom: '1rem' }}>
                <Search 
                  size={17} 
                  color="#64748b" 
                  style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} 
                />
                <input
                  type="text"
                  className="input-field"
                  placeholder="Scan or type member name / +91 phone..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  style={{ 
                    paddingLeft: '40px', 
                    background: '#f8fafc', 
                    borderColor: '#cbd5e1',
                    fontSize: '0.92rem',
                    fontWeight: 600
                  }}
                />
                {searchInput && (
                  <button
                    onClick={() => {
                      setSearchInput('');
                      setSelectedMember(null);
                    }}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'transparent',
                      border: 'none',
                      color: '#64748b',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Instant Search Results Dropdown List */}
              {searchResults.length > 0 && !selectedMember && (
                <div style={{
                  border: '1px solid #cbd5e1',
                  borderRadius: '12px',
                  background: '#ffffff',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  marginBottom: '1rem',
                  maxHeight: '220px',
                  overflowY: 'auto'
                }}>
                  {searchResults.map(item => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedMember(item);
                        setSearchInput('');
                      }}
                      style={{
                        padding: '0.75rem 1rem',
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        transition: 'background 0.15s ease'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                        <img 
                          src={item.avatar} 
                          alt={item.name} 
                          style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                        <div>
                          <div style={{ fontWeight: 800, fontSize: '0.9rem', color: '#0f172a' }}>{item.name}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{item.phone} • {item.planCycle}</div>
                        </div>
                      </div>
                      <span className={item.paymentStatus === 'Overdue' ? 'badge badge-expired' : 'badge badge-active'} style={{ fontSize: '0.7rem' }}>
                        {item.paymentStatus}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* DIGITAL MEMBER PASS & ONE-CLICK ACCESS ACTION */}
              {selectedMember ? (
                <div className="animate-fade-in" style={{
                  background: selectedMember.paymentStatus === 'Overdue' ? '#fef2f2' : '#f0fdf4',
                  border: selectedMember.paymentStatus === 'Overdue' ? '2px solid #fca5a5' : '2px solid #6ee7b7',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  textAlign: 'left'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'center' }}>
                      <img 
                        src={selectedMember.avatar} 
                        alt={selectedMember.name} 
                        style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #059669' }} 
                      />
                      <div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{selectedMember.name}</div>
                        <div style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>{selectedMember.phone}</div>
                        <div style={{ fontSize: '0.75rem', color: '#059669', fontWeight: 700, marginTop: '0.2rem' }}>
                          ID: {selectedMember.id} • Trainer: {selectedMember.trainer}
                        </div>
                      </div>
                    </div>

                    <span className={selectedMember.paymentStatus === 'Overdue' ? 'badge badge-expired' : 'badge badge-active'}>
                      {selectedMember.paymentStatus}
                    </span>
                  </div>

                  {/* One-Click Action Buttons */}
                  {selectedMember.paymentStatus === 'Overdue' ? (
                    <div>
                      <div style={{
                        background: '#fee2e2',
                        color: '#b91c1c',
                        padding: '0.65rem',
                        borderRadius: '8px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        marginBottom: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}>
                        <ShieldAlert size={16} />
                        <span>Entry Stopped — Membership Fee is Overdue!</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          onClick={() => onOpenPaymentModal(selectedMember)}
                          className="btn-primary"
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            fontSize: '0.88rem',
                            background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                            boxShadow: '0 4px 12px rgba(220, 38, 38, 0.25)'
                          }}
                        >
                          <IndianRupee size={16} />
                          <span>Collect ₹{(selectedMember.planPrice || 0).toLocaleString('en-IN')}</span>
                        </button>
                        <button
                          onClick={() => setSelectedMember(null)}
                          className="btn-secondary"
                          style={{ padding: '0.75rem 1rem' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : Boolean(selectedMember.lastCheckIn) && !selectedMember.lastCheckOut ? (
                    <div>
                      <div style={{ fontSize: '0.8rem', color: '#15803d', fontWeight: 700, marginBottom: '0.85rem' }}>
                        🟢 Currently Inside Gym (Arrived: {selectedMember.lastCheckIn})
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <button
                          onClick={() => {
                            if (onCheckOutMember) onCheckOutMember(selectedMember);
                            setSelectedMember(null);
                          }}
                          style={{
                            flex: 1,
                            padding: '0.75rem',
                            fontSize: '0.88rem',
                            background: '#0f172a',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '10px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: 'pointer'
                          }}
                        >
                          <LogOut size={16} />
                          <span>Check Out Member (Exit)</span>
                        </button>
                        <button
                          onClick={() => setSelectedMember(null)}
                          className="btn-secondary"
                          style={{ padding: '0.75rem 1rem' }}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                      <button
                        onClick={() => {
                          onCheckInMember(selectedMember);
                          setSelectedMember(null);
                        }}
                        className="btn-primary"
                        style={{
                          flex: 1,
                          padding: '0.75rem',
                          fontSize: '0.9rem',
                          background: '#059669',
                          fontWeight: 800
                        }}
                      >
                        <UserCheck size={18} />
                        <span>Check In (Record Arrival)</span>
                      </button>
                      <button
                        onClick={() => setSelectedMember(null)}
                        className="btn-secondary"
                        style={{ padding: '0.75rem 1rem' }}
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px dashed #cbd5e1',
                  color: '#64748b',
                  fontSize: '0.86rem',
                  fontWeight: 600
                }}>
                  Search any member above to check them in or log their workout departure.
                </div>
              )}
            </div>

            {/* LIVE GYM FLOOR OCCUPANCY PANEL */}
            <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #cbd5e1' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Radio size={16} color="#059669" />
                  <span>Live Floor Occupancy</span>
                </h3>
                <span className="badge badge-active" style={{ fontSize: '0.76rem', fontWeight: 800 }}>
                  {insideMembers.length} Training Now
                </span>
              </div>

              {/* Occupancy Progress Gauge */}
              <div style={{
                height: '10px',
                background: '#e2e8f0',
                borderRadius: '999px',
                overflow: 'hidden',
                marginBottom: '1rem'
              }}>
                <div style={{
                  width: `${Math.min(100, (insideMembers.length / Math.max(1, members.length)) * 100 * 3)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #10b981 0%, #059669 100%)',
                  transition: 'width 0.3s ease'
                }} />
              </div>

              {/* Avatar Badges of Members Currently Inside */}
              {insideMembers.length === 0 ? (
                <div style={{ padding: '1.25rem', textAlign: 'center', color: '#94a3b8', fontSize: '0.82rem', fontWeight: 600 }}>
                  Gym floor is empty. No active check-ins currently logged.
                </div>
              ) : (
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.65rem',
                  maxHeight: '190px',
                  overflowY: 'auto'
                }}>
                  {insideMembers.map(m => (
                    <div
                      key={m.id}
                      onClick={() => setSelectedMember(m)}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: '#f0fdf4',
                        border: '1px solid #86efac',
                        padding: '0.35rem 0.7rem',
                        borderRadius: '999px',
                        cursor: 'pointer',
                        transition: 'transform 0.15s ease'
                      }}
                      title="Click to manage or check out"
                    >
                      <img 
                        src={m.avatar} 
                        alt={m.name} 
                        style={{ width: '22px', height: '22px', borderRadius: '50%', objectFit: 'cover' }} 
                      />
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>
                        {m.name}
                      </span>
                      <span style={{ fontSize: '0.68rem', color: '#059669', fontWeight: 600 }}>
                        {m.lastCheckIn?.replace('Today, ', '')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT PANEL: CHRONOLOGICAL ENTRY STREAM & ROSTER */}
          <div className="glass-panel" style={{ padding: '1.5rem', background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Clock size={18} color="#059669" />
                  <span>Today&apos;s Activity Feed</span>
                </h3>
              </div>

              {/* Stream Filters */}
              <div style={{
                display: 'flex',
                background: '#f8fafc',
                padding: '3px',
                borderRadius: '999px',
                border: '1px solid #cbd5e1'
              }}>
                {[
                  { id: 'INSIDE', label: `🟢 Inside (${insideLogs.length})` },
                  { id: 'COMPLETED', label: `🏁 Left (${completedLogs.length})` },
                  { id: 'STOPPED', label: `🔴 Stopped (${stoppedLogs.length})` },
                  { id: 'ALL', label: `All (${attendanceLogs.length})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setStreamFilter(tab.id)}
                    style={{
                      padding: '0.35rem 0.75rem',
                      borderRadius: '999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      background: streamFilter === tab.id ? '#0f172a' : 'transparent',
                      color: streamFilter === tab.id ? '#ffffff' : '#64748b',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Feed Table / List */}
            <div style={{ maxHeight: '560px', overflowY: 'auto' }}>
              {filteredLogs.length === 0 ? (
                <div style={{ padding: '3.5rem', textAlign: 'center', color: '#64748b', fontWeight: 600 }}>
                  No attendance activity matching this filter today.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
                  {filteredLogs.map(log => {
                    const isCompleted = Boolean(log.checkOutTime) || log.status.includes('COMPLETED');
                    const isDenied = log.status.includes('DENIED') || log.status.includes('STOPPED');
                    const isInside = !isCompleted && !isDenied;
                    const matchedMember = members.find(m => m.id === log.memberId);

                    return (
                      <div
                        key={log.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '0.85rem 1rem',
                          borderRadius: '12px',
                          background: isDenied ? '#fef2f2' : isInside ? '#f0fdf4' : '#f8fafc',
                          border: isDenied ? '1px solid #fca5a5' : isInside ? '1px solid #86efac' : '1px solid #e2e8f0',
                          transition: 'transform 0.15s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                          {matchedMember ? (
                            <img 
                              src={matchedMember.avatar} 
                              alt={log.memberName} 
                              style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover' }} 
                            />
                          ) : (
                            <div style={{
                              width: '42px',
                              height: '42px',
                              borderRadius: '50%',
                              background: '#e2e8f0',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              color: '#475569'
                            }}>
                              {log.memberName.slice(0, 2)}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 800, fontSize: '0.94rem', color: '#0f172a' }}>
                              {log.memberName}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.15rem' }}>
                              <span>Log: {log.id}</span>
                              <span>•</span>
                              <span>Arrived: {log.time}</span>
                              {log.checkOutTime && (
                                <>
                                  <span>•</span>
                                  <span>Left: {log.checkOutTime}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.35rem',
                            padding: '0.3rem 0.75rem',
                            borderRadius: '999px',
                            fontSize: '0.72rem',
                            fontWeight: 800,
                            background: isCompleted ? '#e0e7ff' : isInside ? '#dcfce7' : '#fee2e2',
                            color: isCompleted ? '#4338ca' : isInside ? '#15803d' : '#b91c1c',
                            border: isCompleted ? '1px solid #c7d2fe' : isInside ? '1px solid #86efac' : '1px solid #fca5a5'
                          }}>
                            {isCompleted ? '🏁 COMPLETED' : isInside ? '🟢 INSIDE GYM' : '🛑 STOPPED'}
                          </span>

                          {isInside && matchedMember && onCheckOutMember && (
                            <button
                              onClick={() => onCheckOutMember(matchedMember)}
                              style={{
                                background: '#ffffff',
                                border: '1px solid #059669',
                                color: '#059669',
                                padding: '0.35rem 0.7rem',
                                borderRadius: '8px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                              }}
                            >
                              Check Out
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: SELF-SERVICE TOUCHSCREEN PIN KIOSK */}
      {activeMode === 'kiosk' && (
        <div className="glass-panel" style={{ padding: '2.5rem 2rem', background: '#ffffff', textAlign: 'center', maxWidth: '440px', margin: '0 auto 2rem auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '60px',
            height: '60px',
            borderRadius: '16px',
            background: accessResult === 'DENIED' ? '#fee2e2' : '#ecfdf5',
            border: accessResult === 'DENIED' ? '2px solid #dc2626' : '2px solid #059669',
            marginBottom: '1rem'
          }}>
            {accessResult === 'DENIED' ? (
              <ShieldAlert size={32} color="#dc2626" />
            ) : accessResult === 'GRANTED' ? (
              <ShieldCheck size={32} color="#059669" />
            ) : kioskStep === 2 ? (
              <Lock size={30} color="#059669" />
            ) : (
              <UserCheck size={30} color="#059669" />
            )}
          </div>

          {kioskStep === 1 ? (
            <>
              <h3 style={{ fontSize: '1.4rem', marginBottom: '1.25rem', color: '#0f172a' }}>
                Self-Service Entrance Kiosk
              </h3>

              <div style={{
                background: '#f8fafc',
                border: '2px solid #cbd5e1',
                borderRadius: '16px',
                padding: '0.75rem 1.25rem',
                margin: '0 auto 1.25rem auto',
                maxWidth: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '0.2em', color: kioskDigit ? '#0f172a' : '#94a3b8' }}>
                  {kioskDigit || '••••'}
                </span>
                <button
                  onClick={handleNumpadSubmit}
                  className="btn-primary"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.82rem', background: '#059669' }}
                >
                  Next →
                </button>
              </div>
            </>
          ) : (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span className="badge badge-active">Security Verification</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', margin: '0 0 0.5rem 0', color: '#0f172a' }}>
                Enter Your Secret 4-Digit PIN
              </h3>

              <div style={{
                background: '#f8fafc',
                border: '2px solid #059669',
                borderRadius: '14px',
                padding: '0.65rem 1rem',
                maxWidth: '280px',
                margin: '0 auto 0.85rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'left'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <img
                    src={pendingMember?.avatar}
                    alt={pendingMember?.name}
                    style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #059669' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{pendingMember?.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#059669', fontWeight: 700 }}>ID: {pendingMember?.id}</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={cancelPinStep}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#64748b',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Switch
                </button>
              </div>

              <div style={{
                background: '#ffffff',
                border: pinError ? '2px solid #dc2626' : '2px solid #059669',
                borderRadius: '16px',
                padding: '0.75rem 1.25rem',
                margin: '0 auto 1.25rem auto',
                maxWidth: '280px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                boxShadow: '0 4px 12px rgba(5,150,105,0.15)'
              }}>
                <span style={{ fontSize: '1.45rem', fontWeight: 800, letterSpacing: '0.25em', color: pinDigit ? '#0f172a' : '#94a3b8' }}>
                  {pinDigit ? '•'.repeat(pinDigit.length) : '••••'}
                </span>
                <button
                  onClick={handleNumpadSubmit}
                  className="btn-primary"
                  style={{ padding: '0.55rem 1rem', fontSize: '0.82rem', background: '#059669' }}
                >
                  Verify
                </button>
              </div>
            </div>
          )}

          {pinError && (
            <div className="animate-slide-up" style={{
              background: '#fee2e2',
              color: '#991b1b',
              padding: '0.65rem 1rem',
              borderRadius: '10px',
              fontSize: '0.82rem',
              fontWeight: 700,
              maxWidth: '280px',
              margin: '0 auto 1rem auto',
              border: '1px solid #fca5a5'
            }}>
              {pinError}
            </div>
          )}

          {lastCheckedMember && (
            <div className="animate-slide-up" style={{
              background: accessResult === 'DENIED' ? '#fee2e2' : '#dcfce7',
              color: accessResult === 'DENIED' ? '#991b1b' : '#15803d',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontSize: '0.86rem',
              fontWeight: 700,
              maxWidth: '280px',
              margin: '0 auto 1rem auto',
              border: accessResult === 'DENIED' ? '1px solid #fca5a5' : '1px solid #86efac'
            }}>
              <div>{accessResult === 'DENIED' ? '🛑 Entry Stopped!' : '✅ Check-In Confirmed!'}</div>
              <div style={{ fontSize: '0.76rem', marginTop: '0.2rem' }}>{lastCheckedMember.name} ({lastCheckedMember.scannedAt})</div>
            </div>
          )}

          {/* Touch Numpad Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '0.55rem',
            maxWidth: '250px',
            margin: '0 auto'
          }}>
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'CLEAR', '0', '✓'].map((keyVal) => (
              <button
                key={keyVal}
                onClick={() => handleKeyPress(keyVal)}
                style={{
                  padding: '0.85rem 0',
                  borderRadius: '12px',
                  border: '1px solid #cbd5e1',
                  background: keyVal === 'CLEAR' ? '#fee2e2' : keyVal === '✓' ? '#dcfce7' : '#ffffff',
                  color: keyVal === 'CLEAR' ? '#991b1b' : keyVal === '✓' ? '#15803d' : '#0f172a',
                  fontSize: keyVal === 'CLEAR' ? '0.78rem' : '1.2rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {keyVal}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
