import React from 'react';
import { CreditCard, Check, Sparkles, Plus, Award, Flame } from 'lucide-react';

export default function PlansView({ plans }) {
  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '1.75rem'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', margin: 0, color: '#0f172a' }}>
            Membership Plans &amp; Packages
          </h2>
          <p style={{ color: '#475569', fontSize: '0.88rem', margin: '0.2rem 0 0 0', fontWeight: 500 }}>
            Manage membership pricing and packages
          </p>
        </div>

        <button className="btn-primary">
          <Plus size={16} />
          <span>+ Create New Plan</span>
        </button>
      </div>

      {/* Grid of Pricing Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {plans.map((plan) => {
          const isVip = plan.name.includes('VIP');
          return (
            <div
              key={plan.id}
              className="glass-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isVip ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid var(--border-glass)',
                boxShadow: isVip ? '0 0 30px rgba(168, 85, 247, 0.18)' : 'none',
                position: 'relative',
                padding: '1.75rem'
              }}
            >
              {isVip && (
                <span className="badge badge-vip" style={{ position: 'absolute', top: '16px', right: '16px' }}>
                  <Sparkles size={12} /> Best Seller
                </span>
              )}

              <div>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>
                  {plan.duration} ACCESS
                </span>
                <h3 style={{ fontSize: '1.4rem', margin: '0.2rem 0 0.6rem 0' }}>
                  {plan.name}
                </h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem', marginBottom: '1.25rem' }}>
                  <span style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                    {plan.price.split('/')[0]}
                  </span>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    /{plan.price.split('/')[1]}
                  </span>
                </div>

                <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1.1rem', marginBottom: '1.5rem' }}>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
                    INCLUDED PERKS & ACCESS:
                  </p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {plan.perks.map((perk, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                        <Check size={16} color="var(--accent-lime)" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button className="btn-secondary" style={{ flex: 1, padding: '0.65rem' }}>
                  Edit Pricing
                </button>
                <button className="btn-primary" style={{ flex: 1, padding: '0.65rem' }}>
                  Assign Plan
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer explanation banner */}
      <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Award size={24} color="#4ade80" />
        <div>
          <h4 style={{ fontSize: '0.95rem', margin: 0 }}>Automated Billing & Recurring Payment Gateways</h4>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0 0' }}>
            In the full production build, we can integrate Stripe or Razorpay to auto-renew subscriptions and send automatic invoice receipts over WhatsApp/Email!
          </p>
        </div>
      </div>
    </div>
  );
}
