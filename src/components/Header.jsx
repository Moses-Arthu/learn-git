import React from 'react';
import { GitBranch, Sun, Moon, RotateCcw, Award, Sparkles, Menu } from 'lucide-react';

export function Header({ theme, setTheme, xp, progressPct, onReset, toggleMobileMenu }) {
  return (
    <header style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px 24px',
      marginBottom: '24px',
      borderRadius: '20px'
    }} className="neu-flat animate-fade-in">
      {/* Brand logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="neu-btn neu-icon-btn neu-btn-primary" aria-label="Git Logo">
          <GitBranch size={22} color="#ffffff" />
        </button>
        <div>
          <h1 className="brand-title" style={{
            fontSize: '20px',
            fontWeight: '800',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            Version <span style={{ color: 'var(--git-orange)' }}>Control</span>
            <span className="neu-badge neu-badge-orange" style={{ fontSize: '10px' }}>
              PRO
            </span>
          </h1>
          <p className="brand-subtitle" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Neumorphic Interactive Git Masterclass
          </p>
        </div>
      </div>

      {/* Stats & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
        {/* XP Counter */}
        <div className="neu-pressed xp-counter" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px'
        }}>
          <Sparkles size={16} color="var(--yellow-accent)" className="animate-pulse-glow" />
          <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
            {xp} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>XP</span>
          </span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="neu-btn neu-icon-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun size={18} color="var(--yellow-accent)" />
          ) : (
            <Moon size={18} color="var(--purple-accent)" />
          )}
        </button>

        {/* Reset Progress */}
        <button
          onClick={onReset}
          className="neu-btn neu-icon-btn"
          title="Reset Learning Progress"
        >
          <RotateCcw size={17} color="var(--text-muted)" />
        </button>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="neu-btn neu-icon-btn mobile-only-btn"
          style={{ display: 'none' }}
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .mobile-only-btn {
            display: inline-flex !important;
          }
        }
        @media (max-width: 640px) {
          header {
            padding: 12px 14px !important;
            gap: 10px;
          }
          .brand-subtitle {
            display: none;
          }
          .brand-title {
            font-size: 16px !important;
          }
          .xp-counter {
            padding: 6px 10px !important;
          }
        }
      `}</style>
    </header>
  );
}
