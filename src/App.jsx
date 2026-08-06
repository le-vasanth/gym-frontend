import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import MemberDirectoryView from './components/MemberDirectoryView';
import AttendanceView from './components/AttendanceView';
import PaymentMonitoringView from './components/PaymentMonitoringView';
import PlansView from './components/PlansView';
import MemberModal from './components/MemberModal';
import AddMemberModal from './components/AddMemberModal';
import RecordPaymentModal from './components/RecordPaymentModal';
import DeleteMemberModal from './components/DeleteMemberModal';
import LoginView from './components/LoginView';
import LogoutModal from './components/LogoutModal';
import EditProfileModal from './components/EditProfileModal';
import PhotoViewerModal from './components/PhotoViewerModal';

import { 
  gymPlans, 
  analyticsData 
} from './data/mockGymData';
import { CheckCircle2 } from 'lucide-react';
import { api } from './api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      return localStorage.getItem('hifi_gym_auth') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  
  const [adminName, setAdminName] = useState(() => {
    try {
      return localStorage.getItem('hifi_gym_admin_name') || 'Admin Manager';
    } catch (e) {
      return 'Admin Manager';
    }
  });
  
  const [adminAvatar, setAdminAvatar] = useState(() => {
    try {
      return localStorage.getItem('hifi_gym_admin_avatar') || '';
    } catch (e) {
      return '';
    }
  });
  
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [photoViewerImage, setPhotoViewerImage] = useState(null);

  React.useEffect(() => {
    localStorage.setItem('hifi_gym_auth', isAuthenticated);
  }, [isAuthenticated]);

  React.useEffect(() => {
    localStorage.setItem('hifi_gym_admin_name', adminName);
  }, [adminName]);

  React.useEffect(() => {
    localStorage.setItem('hifi_gym_admin_avatar', adminAvatar);
  }, [adminAvatar]);

  const [members, setMembers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [plans] = useState(gymPlans);
  const [analytics, setAnalytics] = useState(analyticsData);

  // Load from API on mount
  React.useEffect(() => {
    if (!isAuthenticated) return;
    const loadData = async () => {
      try {
        const [m, t, a] = await Promise.all([
          api.getMembers(),
          api.getTransactions(),
          api.getAttendanceLogs()
        ]);
        setMembers(m);
        setTransactions(t);
        setAttendanceLogs(a);
      } catch (err) {
        console.error("Failed to fetch API data:", err);
      }
    };
    loadData();
  }, [isAuthenticated]);

  const handleResetDemoData = () => {
    showToast('Reset feature is disabled in Cloud Mode. Please manage members manually.');
  };

  // Focus on Payments as the default tab!
  const [activeTab, setActiveTab] = useState('payments');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [selectedMember, setSelectedMember] = useState(null);
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [deletingMember, setDeletingMember] = useState(null);
  const [paymentModalMember, setPaymentModalMember] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 4000);
  };

  // 1. Handle Member Arrival Check-In (Attendance Gate)
  const handleCheckInMember = async (member) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    const updatedMemberData = {
      ...member,
      lastCheckIn: `Today, ${timeStr}`,
      totalCheckInsThisMonth: (member.totalCheckInsThisMonth || 0) + 1
    };

    try {
      const savedMember = await api.updateMember(member.id, updatedMemberData);
      setMembers(prev => prev.map(m => m.id === member.id ? savedMember : m));

      const newLog = {
        id: `ATT-${Math.floor(400 + Math.random() * 600)}`,
        memberId: member.id,
        memberName: member.name,
        time: timeStr,
        date: 'Today',
        status: 'ACCESS GRANTED',
        paymentStatusAtScan: member.paymentStatus,
        planCycle: member.planCycle
      };

      const savedLog = await api.createAttendanceLog(newLog);
      setAttendanceLogs(prev => [savedLog, ...prev]);
      showToast(`Checked in ${member.name}! Arrival time logged (${timeStr}).`);
    } catch (e) {
      showToast('Error checking in member.');
    }
  };

  const handleCheckOutMember = (member) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Update member last check-out time
    const updatedMembers = members.map(m => {
      if (m.id === member.id) {
        return {
          ...m,
          lastCheckOut: `Today, ${timeStr}`
        };
      }
      return m;
    });
    setMembers(updatedMembers);

    // Update the latest attendance log for this member to record departure
    let updatedLog = false;
    const updatedLogs = attendanceLogs.map(log => {
      if (!updatedLog && log.memberId === member.id && !log.checkOutTime) {
        updatedLog = true;
        return {
          ...log,
          checkOutTime: timeStr,
          status: 'WORKOUT COMPLETED'
        };
      }
      return log;
    });
    setAttendanceLogs(updatedLogs);
    showToast(`Checked out ${member.name}! Departure time logged at ${timeStr}.`);
  };

  // 2. Handle Recording a Payment / Renewal
  const handleConfirmPayment = async (paymentData) => {
    try {
      const member = members.find(m => m.id === paymentData.memberId);
      if (!member) return;
      
      const fullUpdatedMember = {
        ...member,
        paymentStatus: 'Paid',
        lastPaidDate: paymentData.paidDate,
        nextDueDate: paymentData.newDueDate,
        planType: paymentData.planType,
        planCycle: paymentData.planCycle,
        planPrice: paymentData.priceNum,
        paymentMethod: paymentData.method
      };

      const savedMember = await api.updateMember(paymentData.memberId, fullUpdatedMember);
      setMembers(prev => prev.map(m => m.id === paymentData.memberId ? savedMember : m));

      const newTxn = {
        id: `TXN-${Math.floor(9100 + Math.random() * 899)}`,
        memberId: paymentData.memberId,
        memberName: paymentData.memberName,
        planCycle: `${paymentData.planCycle} Plan`,
        amount: paymentData.amount,
        priceNum: paymentData.priceNum,
        method: paymentData.method,
        date: `${paymentData.paidDate} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
        status: 'Completed'
      };

      const savedTxn = await api.createTransaction(newTxn);
      setTransactions(prev => [savedTxn, ...prev]);
      showToast(`Payment of ${paymentData.amount} recorded for ${paymentData.memberName}! Expiry extended to ${paymentData.newDueDate}.`);
    } catch (e) {
      showToast('Error recording payment in database.');
    }
  };

  // 3. Handle Adding a New Member
  const handleAddMember = async (newMember, checkInImmediately) => {
    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const memberToAdd = {
      ...newMember,
      lastCheckIn: checkInImmediately ? `Today, ${timeStr}` : null,
      totalCheckInsThisMonth: checkInImmediately ? 1 : 0
    };

    try {
      const savedMember = await api.createMember(memberToAdd);
      setMembers(prev => [savedMember, ...prev]);

      if (checkInImmediately) {
        const newLog = {
          id: `LOG-${Math.floor(8000 + Math.random() * 1999)}`,
          memberId: savedMember.id,
          memberName: savedMember.name,
          time: timeStr,
          date: 'Today',
          status: 'ACCESS GRANTED',
          paymentStatusAtScan: savedMember.paymentStatus,
          planCycle: savedMember.planCycle
        };
        const savedLog = await api.createAttendanceLog(newLog);
        setAttendanceLogs(prev => [savedLog, ...prev]);
        showToast(`New member ${savedMember.name} registered & checked in!`);
      } else {
        showToast(`New member ${savedMember.name} registered successfully!`);
      }
    } catch (e) {
      showToast('Error registering member in database.');
    }
  };

  // 4. Handle Editing Member
  const handleEditMember = async (updatedMember) => {
    try {
      const savedMember = await api.updateMember(updatedMember.id, updatedMember);
      setMembers(prev => prev.map(m => m.id === updatedMember.id ? savedMember : m));
      showToast(`Member ${savedMember.name} updated successfully!`);
      setEditingMember(null);
    } catch (e) {
      showToast('Error updating member.');
    }
  };

  // 5. Handle Requesting Deletion (Opens custom Delete Modal inside active screen)
  const handleRequestDelete = (memberOrId, memberName) => {
    let target = null;
    if (typeof memberOrId === 'object' && memberOrId !== null) {
      target = memberOrId;
    } else {
      target = members.find(m => m.id === memberOrId) || { id: memberOrId, name: memberName || 'Member', plan: 'Gym Member' };
    }
    setDeletingMember(target);
  };

  // 6. Confirm Deletion from Modal
  const handleConfirmDelete = async (memberId, memberName) => {
    try {
      await api.deleteMember(memberId);
      setMembers(prev => prev.filter(m => m.id !== memberId));
      if (selectedMember && selectedMember.id === memberId) {
        setSelectedMember(null);
      }
      setDeletingMember(null);
      showToast(`Member ${memberName || memberId} removed from roster.`);
    } catch (e) {
      showToast('Error deleting member.');
    }
  };

  const overdueCount = members.filter(m => m.paymentStatus === 'Overdue').length;

  if (!isAuthenticated) {
    return <LoginView onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navbar */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        allMembers={members}
        onSelectMember={(m) => setSelectedMember(m)}
        onOpenPaymentModal={(m) => {
          setPaymentModalMember(m);
          setIsPaymentModalOpen(true);
        }}
        onOpenCheckInModal={() => {
          setActiveTab('attendance');
        }}
        adminName={adminName}
        adminAvatar={adminAvatar}
        onEditProfileRequest={() => setIsEditProfileModalOpen(true)}
        onLogoutRequest={() => setIsLogoutModalOpen(true)}
        onViewPhoto={setPhotoViewerImage}
      />

      {/* Main App Layout */}
      <div className="app-layout" style={{ padding: '0 1.6rem 2.5rem 1.6rem', gap: '1.6rem' }}>
        {/* Sidebar */}
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          overdueCount={overdueCount}
          todayAttendanceCount={attendanceLogs.length}
        />

        {/* Content Area */}
        <main>
          {/* PRIMARY MODULE 1: PAYMENT MONITORING (INR ₹) */}
          {activeTab === 'payments' && (
            <PaymentMonitoringView
              members={members}
              transactions={transactions}
              searchQuery={searchQuery}
              onOpenPaymentModal={(member) => {
                setPaymentModalMember(member);
                setIsPaymentModalOpen(true);
              }}
              onSendReminder={(name) => {
                showToast(`Automated WhatsApp / SMS payment reminder sent to ${name} successfully!`);
              }}
              onOpenAddMember={() => setIsAddMemberOpen(true)}
              onEditMember={(member) => setEditingMember(member)}
              onDeleteMember={(id, name) => handleRequestDelete(id, name)}
            />
          )}

          {/* PRIMARY MODULE 2: ATTENDANCE SYSTEM */}
          {activeTab === 'attendance' && (
            <AttendanceView
              members={members}
              attendanceLogs={attendanceLogs}
              searchQuery={searchQuery}
              onCheckInMember={handleCheckInMember}
              onCheckOutMember={handleCheckOutMember}
              onResetDemoData={handleResetDemoData}
              onOpenPaymentModal={(member) => {
                setPaymentModalMember(member);
                setIsPaymentModalOpen(true);
              }}
            />
          )}

          {/* SECONDARY MODULES */}
          {activeTab === 'dashboard' && (
            <DashboardView
              members={members}
              transactions={transactions}
              analytics={analytics}
              onOpenAddMember={() => setIsAddMemberOpen(true)}
              onOpenCheckInModal={() => setActiveTab('attendance')}
              onSelectMember={(m) => setSelectedMember(m)}
            />
          )}

          {activeTab === 'members' && (
            <MemberDirectoryView
              members={members}
              searchQuery={searchQuery}
              onSelectMember={(m) => setSelectedMember(m)}
              onOpenAddMember={() => setIsAddMemberOpen(true)}
              onEditMember={(member) => setEditingMember(member)}
              onDeleteMember={(id, name) => handleRequestDelete(id, name)}
            />
          )}

          {activeTab === 'plans' && (
            <PlansView
              plans={plans}
            />
          )}
        </main>
      </div>

      {/* Modals */}
      {selectedMember && (
        <MemberModal
          member={selectedMember}
          onClose={() => setSelectedMember(null)}
          onCheckIn={handleCheckInMember}
          onEditMember={(member) => {
            setSelectedMember(null);
            setEditingMember(member);
          }}
          onDeleteMember={(id, name) => handleRequestDelete(id, name)}
          onViewPhoto={setPhotoViewerImage}
        />
      )}

      {(isAddMemberOpen || editingMember) && (
        <AddMemberModal
          initialMember={editingMember}
          onClose={() => {
            setIsAddMemberOpen(false);
            setEditingMember(null);
          }}
          onAddMember={handleAddMember}
          onEditMember={handleEditMember}
        />
      )}

      {isPaymentModalOpen && (
        <RecordPaymentModal
          member={paymentModalMember}
          allMembers={members}
          onClose={() => {
            setIsPaymentModalOpen(false);
            setPaymentModalMember(null);
          }}
          onConfirmPayment={handleConfirmPayment}
        />
      )}

      {deletingMember && (
        <DeleteMemberModal
          member={deletingMember}
          onClose={() => setDeletingMember(null)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {isLogoutModalOpen && (
        <LogoutModal
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={() => {
            setIsAuthenticated(false);
            setIsLogoutModalOpen(false);
          }}
        />
      )}

      {isEditProfileModalOpen && (
        <EditProfileModal
          currentName={adminName}
          currentAvatar={adminAvatar}
          onClose={() => setIsEditProfileModalOpen(false)}
          onSave={(newName, newAvatar) => {
            setAdminName(newName);
            setAdminAvatar(newAvatar);
            setIsEditProfileModalOpen(false);
            showToast('Profile updated successfully!');
          }}
        />
      )}

      {/* Live Toast */}
      {toastMessage && (
        <div 
          className="animate-slide-up"
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(5, 150, 105, 0.95) 100%)',
            color: '#030712',
            padding: '1rem 1.5rem',
            borderRadius: '14px',
            boxShadow: '0 12px 30px rgba(16, 185, 129, 0.4)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontWeight: 700,
            fontSize: '0.92rem',
            zIndex: 200
          }}
        >
          <CheckCircle2 size={19} color="#030712" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Fullscreen Photo Viewer */}
      {photoViewerImage && (
        <PhotoViewerModal
          imageUrl={photoViewerImage}
          onClose={() => setPhotoViewerImage(null)}
        />
      )}
    </div>
  );
}
