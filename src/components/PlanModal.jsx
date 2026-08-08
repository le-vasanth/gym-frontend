import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { api } from '../api';

export default function PlanModal({ plan, onClose, onSave, showToast }) {
  const [formData, setFormData] = useState(
    plan || {
      id: `PLAN-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      price: '',
      duration: '',
      perks: []
    }
  );
  
  const [perkInput, setPerkInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPerk = (e) => {
    e.preventDefault();
    if (perkInput.trim()) {
      setFormData({ ...formData, perks: [...formData.perks, perkInput.trim()] });
      setPerkInput('');
    }
  };

  const handleRemovePerk = (index) => {
    const newPerks = formData.perks.filter((_, i) => i !== index);
    setFormData({ ...formData, perks: newPerks });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      let savedPlan;
      if (plan) {
        savedPlan = await api.updatePlan(formData.id, formData);
        showToast('Plan updated successfully!');
      } else {
        savedPlan = await api.createPlan(formData);
        showToast('New plan created successfully!');
      }
      onSave(savedPlan);
    } catch (err) {
      console.error(err);
      showToast('Failed to save plan.');
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '500px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.35rem', margin: 0 }}>
            {plan ? 'Edit Fee Plan' : 'Create Custom Fee Plan'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>PLAN NAME *</label>
            <input 
              type="text" className="input-field" required
              value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. VIP Annual All-Access"
            />
          </div>

          <div className="content-grid-2" style={{ gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>PRICE (TEXT) *</label>
              <input 
                type="text" className="input-field" required
                value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})}
                placeholder="e.g. ₹12,500/yr"
              />
            </div>
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>DURATION *</label>
              <input 
                type="text" className="input-field" required
                value={formData.duration} onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="e.g. 12 Months"
              />
            </div>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontSize: '0.78rem', fontWeight: 600, display: 'block', marginBottom: '0.35rem' }}>PERKS & ACCESS (Press Enter to add)</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <input 
                type="text" className="input-field" 
                value={perkInput} onChange={(e) => setPerkInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPerk(e)}
                placeholder="e.g. 24/7 Access"
              />
              <button type="button" onClick={handleAddPerk} className="btn-secondary">Add</button>
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {formData.perks.map((perk, i) => (
                <li key={i} style={{ display: 'flex', justifyContent: 'space-between', background: '#f1f5f9', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem' }}>
                  <span>{perk}</span>
                  <button type="button" onClick={() => handleRemovePerk(i)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><X size={14}/></button>
                </li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              <Save size={16} />
              {isSubmitting ? 'Saving...' : 'Save Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
