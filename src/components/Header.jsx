import React from 'react';
import { GitBranch, Sun, Moon, RotateCcw, Sparkles, Menu } from 'lucide-react';

export function Header({ theme, setTheme, xp, progressPct, onReset, toggleMobileMenu }) {
  return (
    <header className="neu-flat animate-fade-in header-root">
      {/* Top Bar / Logo & Main Action */}
      <div className="header-top-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="neu-btn neu-icon-btn neu-btn-primary" aria-label="Git Logo" style={{ width: '38px', height: '38px', flexShrink: 0 }}>
            <GitBranch size={20} color="#ffffff" />
          </button>
          <div>
            <h1 className="brand-title" style={{
              fontSize: '18px',
              fontWeight: '800',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              Version <span style={{ color: 'var(--git-orange)' }}>Control</span>
              <span className="neu-badge neu-badge-orange" style={{ fontSize: '9px', padding: '2px 6px' }}>
                PRO
              </span>
            </h1>
            <p className="brand-subtitle" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Neumorphic Interactive Git Masterclass
            </p>
          </div>
        </div>

        {/* Mobile Menu Button - Top Right on Mobile */}
        <button
          onClick={toggleMobileMenu}
          className="neu-btn neu-btn-primary mobile-menu-btn"
          aria-label="Toggle Navigation"
        >
          <Menu size={16} />
          <span>Menu</span>
        </button>
      </div>

      {/* Control Actions Row */}
      <div className="header-actions-row">
        {/* XP Counter */}
        <div className="neu-pressed xp-counter" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 12px'
        }}>
          <Sparkles size={14} color="var(--yellow-accent)" className="animate-pulse-glow" />
          <span style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
            {xp} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>XP</span>
          </span>
        </div>

        {/* Reset Progress Button */}
        <button
          onClick={onReset}
          className="neu-btn header-reset-btn"
          title="Reset Learning Progress"
        >
          <RotateCcw size={15} color="var(--git-orange)" />
          <span className="reset-label">Reset</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="neu-btn neu-icon-btn"
          style={{ width: '36px', height: '36px' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <Sun size={16} color="var(--yellow-accent)" />
          ) : (
            <Moon size={16} color="var(--purple-accent)" />
          )}
        </button>
      </div>

      <style>{`
        .header-root {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          margin-bottom: 24px;
          border-radius: 20px;
          flex-wrap: wrap;
          gap: 12px;
        }

        .header-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .header-actions-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mobile-menu-btn {
          display: none;
        }

        @media (max-width: 768px) {
          .header-root {
            flex-direction: column;
            align-items: stretch;
            padding: 12px 14px;
            gap: 10px;
          }

          .header-top-row {
            width: 100%;
          }

          .mobile-menu-btn {
            display: inline-flex !important;
            padding: 8px 12px;
            font-size: 13px;
          }

          .header-actions-row {
            width: 100%;
            justify-content: space-between;
            padding-top: 8px;
            border-top: 1px solid var(--border-dark);
          }

          .brand-subtitle {
            display: none;
          }
        }
      `}</style>
    </header>
  );
}
