import React, { useRef, useEffect } from 'react';
import { GitBranch, Sun, Moon, RotateCcw, Sparkles, Menu, Zap } from 'lucide-react';

export function Header({ theme, setTheme, xp, progressPct, onReset, toggleMobileMenu }) {
  const prevXpRef = useRef(xp);
  const xpBadgeRef = useRef(null);

  useEffect(() => {
    if (xp > prevXpRef.current && xpBadgeRef.current) {
      xpBadgeRef.current.classList.remove('animate-xp-pop');
      void xpBadgeRef.current.offsetWidth;
      xpBadgeRef.current.classList.add('animate-xp-pop');
    }
    prevXpRef.current = xp;
  }, [xp]);

  return (
    <header className="header-root animate-fade-in">
      {/* Logo + Brand */}
      <div className="header-brand">
        <div className="header-logo">
          <GitBranch size={22} color="#ffffff" />
        </div>
        <div>
          <h1 className="brand-title">
            Learn<span className="brand-accent"> Git</span>
            <span className="brand-pill">8 Lessons</span>
          </h1>
          <p className="brand-subtitle">Interactive terminal · quizzes · XP rewards</p>
        </div>
      </div>

      {/* Center: Progress bar */}
      <div className="header-progress-section">
        <div className="header-progress-meta">
          <span className="progress-label">Course Progress</span>
          <span className="progress-pct">{progressPct}%</span>
        </div>
        <div
          className="header-progress-track"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Course completion"
        >
          <div className="header-progress-fill" style={{ width: `${progressPct}%` }}>
            <div className="progress-shimmer" />
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="header-actions">
        {/* XP Counter */}
        <div ref={xpBadgeRef} className="xp-badge" aria-label={`${xp} experience points`}>
          <Zap size={13} color="#f59e0b" style={{ flexShrink: 0 }} />
          <span className="xp-value">{xp}</span>
          <span className="xp-label">XP</span>
        </div>

        {/* Keyboard hint */}
        <div className="kbd-hint desktop-kbd">
          <kbd className="kbd">←</kbd>
          <kbd className="kbd">→</kbd>
          <span>navigate</span>
        </div>

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="header-icon-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark'
            ? <Sun size={17} color="#f59e0b" />
            : <Moon size={17} color="#a855f7" />}
        </button>

        {/* Reset */}
        <button
          onClick={onReset}
          className="header-icon-btn reset-btn"
          title="Reset Learning Progress"
          aria-label="Reset learning progress"
        >
          <RotateCcw size={15} color="var(--git-orange)" />
          <span className="reset-label">Reset</span>
        </button>

        {/* Mobile Menu */}
        <button
          onClick={toggleMobileMenu}
          className="neu-btn neu-btn-primary mobile-menu-btn"
          aria-label="Open lesson navigation"
        >
          <Menu size={16} />
          <span>Lessons</span>
        </button>
      </div>

      <style>{`
        .header-root {
          display: flex;
          align-items: center;
          gap: 20px;
          padding: 16px 24px;
          margin-bottom: 28px;
          border-radius: 24px;
          background: var(--bg);
          box-shadow: var(--shadow-outset), inset 0 1px 0 rgba(255,255,255,0.06);
          border: 1px solid var(--border-light);
          flex-wrap: wrap;
          position: relative;
          overflow: hidden;
        }

        .header-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--git-orange), var(--cyan-accent), var(--purple-accent));
          border-radius: 24px 24px 0 0;
        }

        .header-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .header-logo {
          width: 46px;
          height: 46px;
          border-radius: 14px;
          background: linear-gradient(135deg, var(--git-orange), #ff6b4a);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 6px 20px var(--git-orange-glow), inset 0 1px 0 rgba(255,255,255,0.2);
          flex-shrink: 0;
        }

        .brand-title {
          font-size: 19px;
          font-weight: 800;
          letter-spacing: -0.03em;
          display: flex;
          align-items: center;
          gap: 6px;
          color: var(--text-primary);
        }

        .brand-accent {
          color: var(--git-orange);
        }

        .brand-pill {
          font-size: 9px;
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(241,78,50,0.15);
          color: var(--git-orange);
          border: 1px solid rgba(241,78,50,0.25);
          font-weight: 700;
          font-family: var(--font-mono);
          letter-spacing: 0.04em;
        }

        .brand-subtitle {
          font-size: 11px;
          color: var(--text-muted);
          margin-top: 1px;
        }

        .header-progress-section {
          flex: 1;
          min-width: 160px;
          max-width: 360px;
        }

        .header-progress-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .progress-label {
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
        }

        .progress-pct {
          font-size: 11px;
          font-weight: 800;
          font-family: var(--font-mono);
          color: var(--git-orange);
        }

        .header-progress-track {
          height: 8px;
          background: var(--bg);
          box-shadow: var(--shadow-inset);
          border-radius: 999px;
          overflow: hidden;
          position: relative;
        }

        .header-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--git-orange), #ff8c42, var(--cyan-accent));
          border-radius: 999px;
          transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }

        .progress-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.3) 50%, transparent 100%);
          animation: shimmer 2.5s infinite;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-shrink: 0;
        }

        .xp-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          border-radius: 10px;
          background: var(--bg);
          box-shadow: var(--shadow-inset);
          border: 1px solid rgba(245,158,11,0.2);
          min-height: 36px;
          cursor: default;
        }

        .xp-value {
          font-size: 13px;
          font-weight: 800;
          font-family: var(--font-mono);
          color: var(--yellow-accent);
        }

        .xp-label {
          font-size: 10px;
          color: var(--text-muted);
          font-weight: 600;
        }

        .header-icon-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          background: var(--bg);
          box-shadow: var(--shadow-outset-sm);
          border: 1px solid var(--border-light);
          border-radius: 10px;
          cursor: pointer;
          color: var(--text-secondary);
          font-family: var(--font-sans);
          font-size: 12px;
          font-weight: 600;
          min-height: 36px;
          transition: all 0.2s ease;
        }

        .header-icon-btn:hover {
          box-shadow: var(--shadow-outset-hover);
          transform: translateY(-1px);
          color: var(--text-primary);
        }

        .header-icon-btn:focus-visible {
          outline: 2px solid var(--git-orange);
          outline-offset: 2px;
        }

        .kbd-hint {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .kbd {
          background: var(--bg);
          box-shadow: var(--shadow-outset-sm);
          border: 1px solid var(--border-dark);
          border-radius: 5px;
          padding: 2px 6px;
          font-size: 10px;
          font-family: var(--font-mono);
          color: var(--text-secondary);
        }

        .desktop-kbd {
          display: inline-flex;
        }

        .mobile-menu-btn {
          display: none !important;
        }

        @media (max-width: 900px) {
          .desktop-kbd { display: none; }
          .mobile-menu-btn { display: inline-flex !important; }
        }

        @media (max-width: 768px) {
          .header-root {
            flex-direction: column;
            align-items: stretch;
            padding: 14px 16px;
            gap: 14px;
          }
          .header-brand {
            justify-content: space-between;
          }
          .header-progress-section {
            max-width: 100%;
          }
          .header-actions {
            justify-content: space-between;
            border-top: 1px solid var(--border-dark);
            padding-top: 12px;
          }
          .brand-subtitle { display: none; }
          .reset-label { display: none; }
        }
      `}</style>
    </header>
  );
}
