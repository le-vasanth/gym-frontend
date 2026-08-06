import React, { useState, useRef, useEffect } from 'react';
import { User, X, Check, Camera, Upload, Trash2 } from 'lucide-react';

export default function EditProfileModal({ currentName, currentAvatar, onClose, onSave }) {
  const [name, setName] = useState(currentName || 'Admin Manager');
  const [avatar, setAvatar] = useState(currentAvatar || '');
  
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const [stream, setStream] = useState(null);

  // Cleanup camera when component unmounts or modal closes
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [stream]);

  // Attach stream to video element when it becomes available
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
      // Draw video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      // Convert to base64 jpeg
      const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
      setAvatar(dataUrl);
      stopCamera();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatar(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim(), avatar.trim());
    }
  };

  const handleClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.65)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div 
        className="animate-slide-up"
        style={{
          background: '#ffffff',
          borderRadius: '20px',
          width: '100%',
          maxWidth: '440px',
          padding: '2rem',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
          position: 'relative'
        }}
      >
        <button
          onClick={handleClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'transparent',
            border: 'none',
            color: '#64748b',
            cursor: 'pointer',
            padding: '0.4rem',
            display: 'flex'
          }}
        >
          <X size={20} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: '#ecfdf5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#059669'
          }}>
            <User size={20} />
          </div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Edit Profile
          </h2>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>
              Display Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              autoFocus={!isCameraActive}
              style={{
                width: '100%',
                padding: '0.85rem 1rem',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                fontSize: '0.95rem',
                color: '#0f172a',
                outline: 'none',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#059669'}
              onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem' }}>
              Profile Picture
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
                    <button type="button" onClick={capturePhoto} className="btn-primary" style={{ padding: '0.6rem 1rem' }}>
                      Capture
                    </button>
                    <button type="button" onClick={stopCamera} className="btn-secondary" style={{ padding: '0.6rem 1rem' }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : avatar ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <img 
                    src={avatar} 
                    alt="Preview" 
                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #059669' }} 
                  />
                  <button type="button" onClick={() => setAvatar('')} style={{ color: '#dc2626', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 600 }}>
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
              
              {/* Hidden canvas for capturing video frame */}
              <canvas ref={canvasRef} style={{ display: 'none' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary"
              style={{ flex: 1, padding: '0.85rem' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{
                flex: 1,
                padding: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Check size={16} />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
