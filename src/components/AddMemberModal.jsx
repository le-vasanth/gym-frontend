import React, { useState, useRef, useEffect } from 'react';
import { X, UserPlus, Camera, Upload, Trash2 } from 'lucide-react';
import { gymPlans, gymTrainers } from '../data/mockGymData';
import CustomSelect from './CustomSelect';

export default function AddMemberModal({ onClose, onAddMember, initialMember, onEditMember }) {
  const [formData, setFormData] = useState({
    name: initialMember ? initialMember.name : '',
    phone: initialMember ? initialMember.phone : '',
    email: initialMember ? initialMember.email : '',
    avatar: initialMember?.avatar || '',
    plan: initialMember ? initialMember.plan : 'VIP Annual All-Access',
    paymentStatus: initialMember ? initialMember.paymentStatus : 'Paid',
    trainer: initialMember ? initialMember.trainer : 'Elena Rostova',
    weight: initialMember?.bodyStats?.weight || '75 kg',
    height: initialMember?.bodyStats?.height || '175 cm',
    bodyFat: initialMember?.bodyStats?.bodyFat || '15%',
    workoutGoal: initialMember?.workoutGoal || 'Hypertrophy & Strength'
  });

  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    return () => {
      if (stream) stream.getTracks().forEach(track => track.stop());
    };
  }, [stream]);

  useEffect(() => {
    if (isCameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsCameraActive(false);
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err) {
      alert('Unable to access camera: ' + err.message);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setFormData({ ...formData, avatar: canvas.toDataURL('image/jpeg', 0.8) });
      stopCamera();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  // First-day entry choice: false = register only (start tomorrow), true = check in immediately today
  const [checkInImmediately, setCheckInImmediately] = useState(false);

  // Dynamic Due Date calculation from today's real date
  const calculateDueDate = (planName, paymentStatus) => {
    const today = new Date();
    if (paymentStatus === 'Overdue') {
      return today.toISOString().split('T')[0];
    }
    if (paymentStatus === 'Due in 7 Days') {
      const d = new Date();
      d.setDate(d.getDate() + 7);
      return d.toISOString().split('T')[0];
    }
    // Calculate from today based on plan duration
    if (planName.includes('6-Month') || planName.includes('6-month')) {
      today.setMonth(today.getMonth() + 6);
    } else if (planName.includes('Monthly') || planName.includes('Month') || planName.includes('monthly')) {
      today.setMonth(today.getMonth() + 1);
    } else {
      // Annual / Yearly default
      today.setFullYear(today.getFullYear() + 1);
    }
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;

    let planPrice = 12500;
    let planCycle = 'Yearly';
    let planType = 'Yearly Plan (12 Months)';
    if (formData.plan.includes('6-Month') || formData.plan.includes('6-month')) {
      planPrice = 7500;
      planCycle = '6-Month';
      planType = '6-Month Plan (6 Months)';
    } else if (formData.plan.includes('Monthly') || formData.plan.includes('Month') || formData.plan.includes('monthly')) {
      planPrice = 1800;
      planCycle = 'Monthly';
      planType = 'Monthly Plan (1 Month)';
    }

    const todayStr = new Date().toISOString().split('T')[0];
    let pStatus = formData.paymentStatus || 'Paid';
    let lastPaid = pStatus === 'Overdue' ? 'Unpaid' : todayStr;
    const nextDue = calculateDueDate(formData.plan, pStatus);

    if (initialMember && onEditMember) {
      const updatedMember = {
        ...initialMember,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || 'member@example.com',
        avatar: formData.avatar || initialMember.avatar,
        pin: initialMember.pin || '1234',
        plan: formData.plan,
        planType: planType,
        planCycle: planCycle,
        planPrice: planPrice,
        paymentStatus: formData.paymentStatus,
        lastPaidDate: lastPaid,
        nextDueDate: nextDue,
        expiresAt: nextDue,
        trainer: formData.trainer,
        bodyStats: {
          weight: formData.weight,
          height: formData.height,
          bodyFat: formData.bodyFat
        },
        workoutGoal: formData.workoutGoal
      };
      onEditMember(updatedMember);
    } else {
      const newMember = {
        id: `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
        name: formData.name,
        phone: formData.phone,
        email: formData.email || 'member@example.com',
        pin: '1234',
        plan: formData.plan,
        planType: planType,
        planCycle: planCycle,
        planPrice: planPrice,
        paymentStatus: pStatus,
        lastPaidDate: lastPaid,
        nextDueDate: nextDue,
        paymentMethod: pStatus === 'Overdue' ? 'Pending' : 'UPI (GPay)',
        status: pStatus === 'Overdue' ? 'Active (Unpaid)' : 'Active',
        expiresAt: nextDue,
        lastCheckIn: null, // NOT 'Just Registered', so they do not automatically appear checked in!
        lastCheckOut: null,
        totalCheckInsThisMonth: 0,
        trainer: formData.trainer,
        avatar: formData.avatar || `https://images.unsplash.com/photo-${1500000000000 + Math.floor(Math.random() * 99999999)}?w=150&auto=format&fit=crop&q=80`,
        bodyStats: {
          weight: formData.weight,
          height: formData.height,
          bodyFat: formData.bodyFat
        },
        workoutGoal: formData.workoutGoal
      };
      onAddMember(newMember, checkInImmediately);
    }
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <UserPlus size={22} color="var(--accent-lime)" />
            <h3 style={{ fontSize: '1.35rem', margin: 0 }}>
              {initialMember ? 'Edit Member Profile' : 'Register New Gym Member'}
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.2rem' }}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="content-grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                FULL NAME *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Alex Mercer"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                PHONE NUMBER *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              className="input-field"
              placeholder="alex.m@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Profile Picture UI */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              PROFILE PICTURE
            </label>
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              gap: '1rem',
              padding: '1.5rem',
              border: '2px dashed #cbd5e1',
              borderRadius: '12px',
              background: '#f8fafc'
            }}>
              {isCameraActive ? (
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <video 
                    ref={videoRef} 
                    autoPlay 
                    playsInline 
                    style={{ width: '100%', maxWidth: '300px', borderRadius: '8px', background: '#000' }}
                  />
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button type="button" onClick={capturePhoto} className="btn-primary" style={{ padding: '0.6rem 1rem' }}>Capture</button>
                    <button type="button" onClick={stopCamera} className="btn-secondary" style={{ padding: '0.6rem 1rem' }}>Cancel</button>
                  </div>
                </div>
              ) : formData.avatar ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <img 
                    src={formData.avatar} 
                    alt="Preview" 
                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #059669' }} 
                  />
                  <button type="button" onClick={() => setFormData({...formData, avatar: ''})} style={{ color: '#dc2626', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
                    <Trash2 size={14} /> Remove Photo
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button 
                    type="button" 
                    onClick={startCamera} 
                    className="btn-secondary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}
                  >
                    <Camera size={16} /> Live Photo
                  </button>
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()} 
                    className="btn-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}
                  >
                    <Upload size={16} /> Select from PC
                  </button>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    accept="image/*" 
                    onChange={handleFileUpload} 
                    style={{ display: 'none' }} 
                  />
                </div>
              )}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          </div>

          {/* Membership Tier & Payment Status */}
          <div className="content-grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                MEMBERSHIP PLAN
              </label>
              <CustomSelect
                value={formData.plan}
                onChange={(val) => setFormData({ ...formData, plan: val })}
                options={gymPlans.map(plan => ({
                  label: `${plan.name} (${plan.price})`,
                  value: plan.name
                }))}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
                INITIAL PAYMENT STATUS
              </label>
              <CustomSelect
                value={formData.paymentStatus}
                onChange={(val) => setFormData({ ...formData, paymentStatus: val })}
                options={[
                  { label: 'Paid (Up to Date)', value: 'Paid' },
                  { label: 'Overdue / Unpaid', value: 'Overdue' },
                  { label: 'Due in 7 Days', value: 'Due in 7 Days' }
                ]}
              />
            </div>
          </div>

          {/* First-Day Gym Floor Entry Option (Only for new registrations) */}
          {!initialMember && (
            <div style={{ marginBottom: '1.25rem', background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
              <label style={{ fontSize: '0.78rem', color: '#0f172a', display: 'block', marginBottom: '0.65rem', fontWeight: 800 }}>
                FIRST-DAY GYM FLOOR ENTRY OPTION
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <label 
                  onClick={() => setCheckInImmediately(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: !checkInImmediately ? '2px solid #059669' : '1px solid #cbd5e1',
                    background: !checkInImmediately ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="checkInOpt"
                    checked={!checkInImmediately}
                    onChange={() => setCheckInImmediately(false)}
                    style={{ accentColor: '#059669' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      📌 Register Only (Will start workout tomorrow or later)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Member is added without automatically logging a gym floor check-in today.
                    </div>
                  </div>
                </label>

                <label 
                  onClick={() => setCheckInImmediately(true)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.65rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: checkInImmediately ? '2px solid #059669' : '1px solid #cbd5e1',
                    background: checkInImmediately ? '#f0fdf4' : '#ffffff',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="checkInOpt"
                    checked={checkInImmediately}
                    onChange={() => setCheckInImmediately(true)}
                    style={{ accentColor: '#059669' }}
                  />
                  <div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                      🟢 Register &amp; Check In Now (Starting workout immediately today)
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Logs their first arrival timestamp and shows them as active on the gym floor.
                    </div>
                  </div>
                </label>
              </div>
            </div>
          )}

          {/* Assigned Trainer */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem', fontWeight: 600 }}>
              ASSIGNED TRAINER
            </label>
            <CustomSelect
              value={formData.trainer}
              onChange={(val) => setFormData({ ...formData, trainer: val })}
              options={gymTrainers.map(tr => ({
                label: `${tr.name} — ${tr.specialty}`,
                value: tr.name
              }))}
            />
          </div>

          {/* Body Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                WEIGHT
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                HEIGHT
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.35rem' }}>
                BODY FAT %
              </label>
              <input
                type="text"
                className="input-field"
                value={formData.bodyFat}
                onChange={(e) => setFormData({ ...formData, bodyFat: e.target.value })}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '1rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {initialMember ? 'Save Changes' : '+ Complete Registration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
