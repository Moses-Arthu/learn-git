import React, { useEffect } from 'react';
import { GitBranch, Terminal, GitCommit, X, ArrowRight } from 'lucide-react';

const STORAGE_KEY = 'gitlearn_onboarding_seen';

const PANELS = [
  {
    icon: <GitBranch size={20} color="#ffffff" />,
    title: 'Git Graph',
    desc: 'Watch your repo come alive as you run commands.',
  },
  {
    icon: <Terminal size={20} color="#ffffff" />,
    title: 'Terminal',
    desc: 'Type real Git commands in a safe, simulated shell.',
  },
  {
    icon: <GitCommit size={20} color="#ffffff" />,
    title: 'Lessons',
    desc: 'Read, quiz yourself, and earn XP as you progress.',
  },
];

export function OnboardingOverlay({ onDismiss }) {
  // Allow Escape key to dismiss
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') onDismiss();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onDismiss]);

  return (
    <div
      className="onboarding-backdrop"
      onClick={onDismiss}
      role="dialog"
      aria-modal="true"
      aria-label="Welcome to Learn Git"
    >
      <div
        className="glass-card onboarding-card"
        onClick={(e) => e.stopPropagation()}
        style={{ padding: '40px 36px', maxWidth: '520px', width: '100%' }}
      >
        {/* Close button */}
        <button
          onClick={onDismiss}
          className="neu-btn-ghost"
          aria-label="Close welcome overlay"
          style={{ position: 'absolute', top: 16, right: 16, width: '36px', height: '36px', padding: 0, justifyContent: 'center' }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '16px' }}>
          <div style={{
            width: '56px', height: '56px', borderRadius: '16px', flexShrink: 0,
            background: 'var(--gradient-brand)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--glow-orange)'
          }}>
            <GitBranch size={28} color="#ffffff" />
          </div>
          <div>
            <h2 style={{
              fontSize: '26px', fontWeight: '900', lineHeight: '1.2',
              letterSpacing: '-0.03em', color: 'var(--text-primary)'
            }}>
              Learn Git in{' '}
              <span style={{ color: 'var(--git-orange)' }}>8 lessons</span>
            </h2>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginTop: '4px' }}>
              Interactive terminal · Quizzes · XP rewards
            </p>
          </div>
        </div>

        {/* One-sentence pitch */}
        <p style={{
          fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.7',
          marginBottom: '8px'
        }}>
          This course gives you a <strong style={{ color: 'var(--text-primary)' }}>live Git environment</strong> right
          in your browser — no install needed. Each lesson builds on the last.
        </p>

        {/* 3-panel explainer */}
        <div className="onboarding-panel-grid" role="list">
          {PANELS.map((panel, idx) => (
            <div key={panel.title} className="onboarding-panel-item card-hover-lift" role="listitem" style={{ 
              background: 'rgba(255,255,255,0.02)', 
              border: '1px solid rgba(255,255,255,0.05)', 
              borderRadius: '16px', padding: '20px 16px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)'
            }}>
              <div className="onboarding-panel-icon" style={{ 
                background: idx === 1 ? 'var(--gradient-cool)' : (idx === 2 ? 'var(--green-accent)' : 'var(--gradient-brand)'),
                boxShadow: idx === 1 ? 'var(--glow-cyan)' : (idx === 2 ? 'var(--glow-green)' : 'var(--glow-orange)'),
                width: '44px', height: '44px', borderRadius: '12px', marginBottom: '12px'
              }}>
                {panel.icon}
              </div>
              <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.3', marginBottom: '6px' }}>
                {panel.title}
              </span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {panel.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Keyboard hint */}
        <p style={{
          fontSize: '12px', color: 'var(--text-muted)', marginBottom: '24px',
          fontFamily: 'var(--font-mono)', textAlign: 'center'
        }}>
          Tip: use{' '}
          <span className="kbd" style={{ background: 'rgba(255,255,255,0.05)' }}>←</span>
          {' / '}
          <span className="kbd" style={{ background: 'rgba(255,255,255,0.05)' }}>→</span>
          {' '}arrow keys to navigate lessons
        </p>

        {/* CTA */}
        <button
          onClick={onDismiss}
          className="neu-btn-cyan"
          style={{ width: '100%', justifyContent: 'center', fontSize: '16px', padding: '16px 24px', borderRadius: '16px' }}
          autoFocus
        >
          Start Learning <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

export function shouldShowOnboarding() {
  return !localStorage.getItem(STORAGE_KEY);
}

export function markOnboardingSeen() {
  localStorage.setItem(STORAGE_KEY, '1');
}
