import React, { useRef, useEffect } from 'react';
import { GitBranch, Sun, Moon, RotateCcw, Sparkles, Menu } from 'lucide-react';

export function Header({ theme, setTheme, xp, progressPct, onReset, toggleMobileMenu }) {
  const prevXpRef = useRef(xp);
  const xpBadgeRef = useRef(null);

  // Trigger pop animation whenever XP increases
  useEffect(() => {
    if (xp > prevXpRef.current && xpBadgeRef.current) {
      xpBadgeRef.current.classList.remove('animate-xp-pop');
      // Force reflow so the animation restarts
      void xpBadgeRef.current.offsetWidth;
      xpBadgeRef.current.classList.add('animate-xp-pop');
    }
    prevXpRef.current = xp;
  }, [xp]);

  return (
    <header className="neu-flat animate-fade-in header-root">
      {/* Top Bar / Logo & Main Action */}
      <div className="header-top-row">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button className="neu-btn neu-icon-btn neu-btn-primary" aria-label="Git Logo" style={{ width: '44px', height: '44px', flexShrink: 0 }}>
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
              Learn <span style={{ color: 'var(--git-orange)' }}>Git</span>
              <span className="neu-badge neu-badge-orange" style={{ fontSize: '9px', padding: '2px 6px' }}>
                8 Lessons
              </span>
            </h1>
            <p className="brand-subtitle" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Interactive terminal · quizzes · XP rewards
            </p>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMobileMenu}
          className="neu-btn neu-btn-primary mobile-menu-btn"
          aria-label="Toggle Navigation Menu"
        >
          <Menu size={16} />
          <span>Lessons</span>
        </button>
      </div>

      {/* Progress Bar Row (visible on mobile too) */}
      <div className="header-progress-row">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Course Progress
          </span>
          <span style={{ fontSize: '11px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--git-orange)' }}>
            {progressPct}%
          </span>
        </div>
        <div className="neu-progress-track" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label="Course completion">
          <div className="neu-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Control Actions Row */}
      <div className="header-actions-row">
        {/* XP Counter */}
        <div
          ref={xpBadgeRef}
          className="neu-pressed xp-counter"
          aria-label={`${xp} experience points`}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '10px', minHeight: '36px' }}
        >
          <Sparkles size={14} color="var(--yellow-accent)" className="animate-pulse-glow" />
          <span style={{ fontSize: '12px', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
            {xp} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>XP</span>
          </span>
        </div>

        {/* Keyboard hint — desktop only */}
        <div className="kbd-hint desktop-only">
          <span className="kbd">←</span>
          <span>/ </span>
          <span className="kbd">→</span>
          <span style={{ marginLeft: '2px' }}>navigate</span>
        </div>

        {/* Reset Progress Button */}
        <button
          onClick={onReset}
          className="neu-btn header-reset-btn"
          title="Reset Learning Progress"
          aria-label="Reset learning progress"
        >
          <RotateCcw size={15} color="var(--git-orange)" />
          <span className="reset-label">Reset</span>
        </button>

        {/* Theme Toggle Button */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="neu-btn neu-icon-btn"
          style={{ width: '44px', height: '44px' }}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
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
          position: relative;
        }

        .header-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .header-progress-row {
          flex: 1;
          min-width: 180px;
          max-width: 300px;
        }

        .header-actions-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mobile-menu-btn {
          display: none;
        }

        .desktop-only {
          display: inline-flex;
        }

        @media (max-width: 900px) {
          .desktop-only {
            display: none;
          }
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

          .header-progress-row {
            max-width: 100%;
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
