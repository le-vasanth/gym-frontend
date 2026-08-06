import React, { useState } from 'react';
import { X, IndianRupee, CreditCard, Calendar, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';
import CustomSelect from './CustomSelect';

export default function RecordPaymentModal({ member, allMembers, onClose, onConfirmPayment }) {
  const [selectedMemberId, setSelectedMemberId] = useState(member ? member.id : (allMembers[0]?.id || ''));
  const [planCycle, setPlanCycle] = useState(member?.planCycle || 'Monthly');
  const [paymentMethod, setPaymentMethod] = useState('UPI (Google Pay / PhonePe / Paytm)');

  const currentMember = allMembers.find(m => m.id === selectedMemberId) || member || allMembers[0];

  const planPrices = {
    'Monthly': { price: 1800, label: 'Monthly Plan (1 Month Access)', monthsToAdd: 1 },
    '6-Month': { price: 7500, label: '6-Month Plan (Half-Year Gold)', monthsToAdd: 6 },
    'Yearly': { price: 12500, label: 'Yearly Plan (12 Months VIP)', monthsToAdd: 12 }
  };

  const selectedPlanInfo = planPrices[planCycle] || planPrices['Monthly'];

  const calculateNewDueDate = () => {
    const today = new Date();
    today.setMonth(today.getMonth() + selectedPlanInfo.monthsToAdd);
    return today.toISOString().split('T')[0];
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentMember) return;

    const newDueDate = calculateNewDueDate();
    const todayStr = new Date().toISOString().split('T')[0];

    onConfirmPayment({
      memberId: currentMember.id,
      memberName: currentMember.name,
      planCycle: planCycle,
      planType: selectedPlanInfo.label,
      amount: `₹${selectedPlanInfo.price.toLocaleString('en-IN')}`,
      priceNum: selectedPlanInfo.price,
      method: paymentMethod,
      newDueDate: newDueDate,
      paidDate: todayStr
    });

    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ background: '#ffffff', border: '1px solid #cbd5e1' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: '#dcfce7', padding: '0.5rem', borderRadius: '12px', color: '#15803d' }}>
              <IndianRupee size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.35rem', margin: 0, color: '#0f172a' }}>Collect Gym Fee & Renew Plan</h3>
              <p style={{ fontSize: '0.82rem', color: '#475569', margin: '0.1rem 0 0 0', fontWeight: 600 }}>
                Hifi Gym • Collect fee and extend member renewal date
              </p>
            </div>
          </div>
          <button className="btn-icon" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.35rem' }}>
          {/* Step 1: Select Member */}
          <div>
            <label style={{ fontSize: '0.8rem', color: '#334155', display: 'block', marginBottom: '0.45rem', fontWeight: 800 }}>
              STEP 1: SELECT GYM MEMBER *
            </label>
            <CustomSelect
              value={selectedMemberId}
              onChange={(val) => setSelectedMemberId(val)}
              options={allMembers.map(m => ({
                label: `${m.name} (${m.phone}) — Current Status: ${m.paymentStatus}`,
                value: m.id
              }))}
            />
          </div>

          {/* Member Status Summary Card (Light Mode) */}
          {currentMember && (
            <div style={{
              background: currentMember.paymentStatus === 'Overdue' 
                ? '#fef2f2' 
                : '#ecfdf5',
              border: currentMember.paymentStatus === 'Overdue'
                ? '2px solid #fca5a5'
                : '2px solid #6ee7b7',
              padding: '1rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#475569', display: 'block', fontWeight: 800 }}>
                  CURRENT MEMBER STATUS
                </span>
                <strong style={{ fontSize: '1.1rem', color: '#0f172a', display: 'block' }}>
                  {currentMember.name}
                </strong>
                <span style={{ fontSize: '0.84rem', color: '#475569', display: 'block', fontWeight: 600 }}>
                  Due Date: {currentMember.nextDueDate}
                </span>
              </div>
              <span className={currentMember.paymentStatus === 'Overdue' ? 'badge badge-expired' : 'badge badge-active'}>
                {currentMember.paymentStatus}
              </span>
            </div>
          )}

          {/* Step 2: Plan Cycle (Monthly vs 6-Month vs Yearly) */}
          <div>
            <label style={{ fontSize: '0.8rem', color: '#334155', display: 'block', marginBottom: '0.45rem', fontWeight: 800 }}>
              STEP 2: CHOOSE PLAN CYCLE *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
              {['Monthly', '6-Month', 'Yearly'].map((cycle) => {
                const isSelected = planCycle === cycle;
                const priceObj = planPrices[cycle];
                return (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => setPlanCycle(cycle)}
                    style={{
                      background: isSelected ? '#ecfdf5' : '#f8fafc',
                      border: isSelected ? '2px solid #059669' : '1px solid #cbd5e1',
                      borderRadius: '14px',
                      padding: '1rem 0.6rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isSelected ? '0 4px 12px rgba(5, 150, 105, 0.2)' : 'none'
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', color: isSelected ? '#059669' : '#475569', fontWeight: 800, display: 'block', textTransform: 'uppercase' }}>
                      {cycle} PLAN
                    </span>
                    <span style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', display: 'block', margin: '0.25rem 0' }}>
                      ₹{priceObj.price.toLocaleString('en-IN')}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                      +{priceObj.monthsToAdd} {priceObj.monthsToAdd === 1 ? 'Month' : 'Months'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="content-grid-2" style={{ gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.8rem', color: '#334155', display: 'block', marginBottom: '0.45rem', fontWeight: 800 }}>
                STEP 3: HOW DID MEMBER PAY? *
              </label>
              <CustomSelect
                value={paymentMethod}
                onChange={(val) => setPaymentMethod(val)}
                options={[
                  { label: 'UPI (Google Pay / PhonePe / Paytm)', value: 'UPI (Google Pay / PhonePe / Paytm)' },
                  { label: 'Cash (Front Desk Counter)', value: 'Cash (Counter)' },
                  { label: 'Card (POS Swipe / EMI)', value: 'Card (POS Swipe / EMI)' },
                  { label: 'Bank Transfer (NEFT / IMPS)', value: 'Bank Transfer (NEFT / IMPS)' }
                ]}
              />
            </div>

            {/* Calculated New Expiry Date */}
            <div>
              <label style={{ fontSize: '0.8rem', color: '#334155', display: 'block', marginBottom: '0.45rem', fontWeight: 800 }}>
                NEW DUE DATE AFTER RENEWAL
              </label>
              <div style={{
                background: '#ecfdf5',
                border: '2px solid #6ee7b7',
                borderRadius: 'var(--radius-sm)',
                padding: '0.7rem 1rem',
                fontSize: '0.96rem',
                fontWeight: 800,
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Calendar size={18} />
                <span>{calculateNewDueDate()}</span>
              </div>
            </div>
          </div>

          {/* Confirmation Box (Light Mode) */}
          <div style={{
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.15rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.85rem'
          }}>
            <ShieldCheck size={26} color="#059669" />
            <p style={{ fontSize: '0.84rem', color: '#334155', margin: 0, lineHeight: '1.4', fontWeight: 500 }}>
              Confirming this fee will mark <strong>{currentMember?.name}</strong> as <strong>PAID</strong> and allow gym entry until <strong>{calculateNewDueDate()}</strong>.
            </p>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.85rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ padding: '0.8rem 1.5rem', fontSize: '0.94rem' }}>
              <CheckCircle2 size={18} />
              <span>Confirm Fee (₹{selectedPlanInfo.price.toLocaleString('en-IN')})</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
