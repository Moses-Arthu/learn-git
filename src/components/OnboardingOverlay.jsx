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
        className="onboarding-card"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onDismiss}
          className="neu-btn neu-icon-btn"
          aria-label="Close welcome overlay"
          style={{ position: 'absolute', top: 16, right: 16, width: '36px', height: '36px' }}
        >
          <X size={16} />
        </button>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div style={{
            width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--git-orange), #ff6b4a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 6px 20px var(--git-orange-glow)'
          }}>
            <GitBranch size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{
              fontSize: '22px', fontWeight: '800', lineHeight: '1.2',
              letterSpacing: '-0.02em', color: 'var(--text-primary)'
            }}>
              Learn Git in{' '}
              <span style={{ color: 'var(--git-orange)' }}>8 lessons</span>
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Interactive terminal · Quizzes · XP rewards
            </p>
          </div>
        </div>

        {/* One-sentence pitch */}
        <p style={{
          fontSize: '15px', color: 'var(--text-secondary)', lineHeight: '1.7',
          marginBottom: '4px'
        }}>
          This course gives you a <strong style={{ color: 'var(--text-primary)' }}>live Git environment</strong> right
          in your browser — no install needed. Each lesson builds on the last.
        </p>

        {/* 3-panel explainer */}
        <div className="onboarding-panel-grid" role="list">
          {PANELS.map((panel) => (
            <div key={panel.title} className="onboarding-panel-item" role="listitem">
              <div className="onboarding-panel-icon">
                {panel.icon}
              </div>
              <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', lineHeight: '1.3' }}>
                {panel.title}
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                {panel.desc}
              </span>
            </div>
          ))}
        </div>

        {/* Keyboard hint */}
        <p style={{
          fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '20px',
          fontFamily: 'var(--font-mono)', textAlign: 'center'
        }}>
          Tip: use{' '}
          <span className="kbd">←</span>
          {' / '}
          <span className="kbd">→</span>
          {' '}arrow keys to navigate lessons on desktop
        </p>

        {/* CTA */}
        <button
          onClick={onDismiss}
          className="neu-btn neu-btn-primary"
          style={{ width: '100%', justifyContent: 'center', fontSize: '16px', padding: '14px 20px', borderRadius: '14px' }}
          autoFocus
        >
          Start Learning <ArrowRight size={18} />
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
