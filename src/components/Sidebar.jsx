import React from 'react';
import { CheckCircle2, Circle, Trophy, Award, X, RotateCcw, ArrowRight, Clock, Lock, Star } from 'lucide-react';
import { BADGES } from '../data/lessonsData';

const READ_TIMES = { 0: 3, 1: 4, 2: 3, 3: 5, 4: 4, 5: 5, 6: 4, 7: 6 };

const CATEGORY_COLORS = {
  Foundations: { color: 'var(--cyan-accent)', glow: 'var(--cyan-glow)', bg: 'rgba(0,210,255,0.07)' },
  Branching:   { color: 'var(--git-orange)',  glow: 'var(--git-orange-glow)', bg: 'rgba(241,78,50,0.07)' },
  Remote:      { color: 'var(--purple-accent)', glow: 'var(--glow-purple)', bg: 'rgba(168,85,247,0.07)' },
  Reference:   { color: 'var(--green-accent)',  glow: 'var(--glow-green)', bg: 'rgba(16,185,129,0.07)' },
};

export function Sidebar({ lessons, currentLessonId, onSelectLesson, completedLessons, score, onCloseMobileMenu, onReset }) {
  const total = lessons.length;
  const completedCount = completedLessons.size;
  const progressPct = Math.round((completedCount / total) * 100);

  const nextLesson = lessons.find(l => !completedLessons.has(l.id) && l.id !== currentLessonId);
  const categories = ['Foundations', 'Branching', 'Remote', 'Reference'];

  return (
    <aside className="sidebar-root neu-flat animate-slide-up">

      {/* Mobile close row */}
      {onCloseMobileMenu && (
        <div className="sidebar-mobile-header">
          <span className="sidebar-mobile-title">Navigation</span>
          <button onClick={onCloseMobileMenu} className="sidebar-close-btn" aria-label="Close menu">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Progress card */}
      <div className="sidebar-progress-card">
        <div className="sidebar-progress-top">
          <span className="sidebar-progress-label">Progress</span>
          <span className="sidebar-progress-stat">{completedCount} / {total}</span>
        </div>
        <div className="sidebar-progress-track" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100}>
          <div className="sidebar-progress-fill" style={{ width: `${progressPct}%` }}>
            <div className="sidebar-progress-shimmer" />
          </div>
        </div>
        <p className="sidebar-progress-hint">
          {completedCount === 0 && 'Start lesson 1 to earn your first 50 XP →'}
          {completedCount > 0 && completedCount < total && `${total - completedCount} lesson${total - completedCount !== 1 ? 's' : ''} remaining`}
          {completedCount === total && '🏆 Course complete!'}
        </p>
      </div>

      {/* Lesson nav */}
      <nav className="sidebar-nav" aria-label="Course lessons">
        {categories.map(category => {
          const catLessons = lessons.filter(l => l.category === category);
          if (!catLessons.length) return null;
          const cfg = CATEGORY_COLORS[category] || CATEGORY_COLORS.Foundations;

          return (
            <div key={category} className="sidebar-category">
              <div className="sidebar-category-label" style={{ color: cfg.color }}>
                <span className="sidebar-category-dot" style={{ background: cfg.color, boxShadow: `0 0 6px ${cfg.color}` }} />
                {category}
              </div>

              {catLessons.map(lesson => {
                const isActive = lesson.id === currentLessonId;
                const isCompleted = completedLessons.has(lesson.id);
                const readTime = READ_TIMES[lesson.id] || 4;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.id)}
                    className={`sidebar-lesson-btn ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    style={isActive ? { '--cat-color': cfg.color, '--cat-bg': cfg.bg } : {}}
                  >
                    <div className="sidebar-lesson-icon">
                      {isCompleted
                        ? <CheckCircle2 size={15} color="var(--green-accent)" />
                        : isActive
                          ? <Circle size={15} color={cfg.color} style={{ filter: `drop-shadow(0 0 4px ${cfg.color})` }} />
                          : <Circle size={15} color="var(--text-muted)" />}
                    </div>
                    <div className="sidebar-lesson-meta">
                      <span className="sidebar-lesson-title" style={isActive ? { color: cfg.color } : {}}>
                        {lesson.title}
                      </span>
                      <span className="sidebar-lesson-time">
                        <Clock size={9} /> ~{readTime} min
                      </span>
                    </div>
                    {lesson.isReferenceLesson && (
                      <span className="sidebar-ref-badge">REF</span>
                    )}
                    {isActive && <div className="sidebar-active-bar" style={{ background: cfg.color }} />}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* Next Up callout */}
      {nextLesson && (
        <div className="sidebar-next-section">
          <div className="sidebar-next-label">Up Next</div>
          <button
            onClick={() => onSelectLesson(nextLesson.id)}
            className="sidebar-next-btn"
            aria-label={`Jump to: ${nextLesson.title}`}
          >
            <div className="sidebar-next-info">
              <span className="sidebar-next-cat">{nextLesson.category}</span>
              <span className="sidebar-next-title">{nextLesson.title}</span>
            </div>
            <ArrowRight size={15} color="var(--cyan-accent)" />
          </button>
        </div>
      )}

      {/* Badges */}
      <div className="sidebar-badges-card">
        <div className="sidebar-badges-header">
          <Trophy size={14} color="var(--yellow-accent)" />
          <span>Achievements</span>
        </div>
        <div className="sidebar-badges-list">
          {BADGES.map(badge => {
            const isUnlocked = completedCount >= badge.minScore;
            return (
              <div key={badge.id} className={`sidebar-badge ${isUnlocked ? 'unlocked' : 'locked'}`} title={badge.desc}>
                <div className="sidebar-badge-icon">
                  {isUnlocked
                    ? <Star size={12} color="var(--yellow-accent)" fill="var(--yellow-accent)" />
                    : <Lock size={12} color="var(--text-muted)" />}
                </div>
                <div className="sidebar-badge-meta">
                  <span className="sidebar-badge-name">{badge.name}</span>
                  {!isUnlocked && (
                    <span className="sidebar-badge-req">Complete {badge.minScore} lessons</span>
                  )}
                </div>
                {isUnlocked && <span className="sidebar-badge-earned">✓</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset */}
      {onReset && (
        <button onClick={onReset} className="sidebar-reset-btn" aria-label="Reset all progress">
          <RotateCcw size={13} color="var(--git-orange)" />
          <span>Reset Progress</span>
        </button>
      )}

      <style>{`
        .sidebar-root {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 18px;
          padding: 20px 16px;
          border-radius: 24px;
          height: fit-content;
          position: relative;
          overflow: hidden;
        }

        .sidebar-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--git-orange), var(--cyan-accent));
        }

        .sidebar-mobile-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .sidebar-mobile-title {
          font-size: 13px;
          font-weight: 800;
          color: var(--git-orange);
        }

        .sidebar-close-btn {
          background: var(--bg);
          box-shadow: var(--shadow-outset-sm);
          border: 1px solid var(--border-light);
          border-radius: 8px;
          padding: 6px;
          cursor: pointer;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }

        .sidebar-close-btn:hover { color: var(--git-orange); transform: rotate(90deg); }

        /* Progress */
        .sidebar-progress-card {
          background: var(--bg);
          box-shadow: var(--shadow-inset);
          border-radius: 16px;
          border: 1px solid var(--border-dark);
          padding: 14px 16px;
        }

        .sidebar-progress-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
        }

        .sidebar-progress-label {
          font-size: 11px;
          font-weight: 700;
          color: var(--text-secondary);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .sidebar-progress-stat {
          font-size: 12px;
          font-weight: 800;
          color: var(--git-orange);
          font-family: var(--font-mono);
        }

        .sidebar-progress-track {
          height: 8px;
          background: var(--bg);
          box-shadow: var(--shadow-inset);
          border-radius: 999px;
          overflow: hidden;
          position: relative;
        }

        .sidebar-progress-fill {
          height: 100%;
          background: linear-gradient(90deg, var(--git-orange), var(--cyan-accent));
          border-radius: 999px;
          transition: width 0.5s cubic-bezier(0.4,0,0.2,1);
          position: relative;
          overflow: hidden;
        }

        .sidebar-progress-shimmer {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
          animation: shimmer 2s infinite;
        }

        .sidebar-progress-hint {
          font-size: 10.5px;
          color: var(--text-muted);
          margin-top: 8px;
        }

        /* Nav */
        .sidebar-nav { display: flex; flex-direction: column; gap: 18px; }

        .sidebar-category { display: flex; flex-direction: column; gap: 4px; }

        .sidebar-category-label {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 0 8px 6px;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .sidebar-category-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .sidebar-lesson-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          width: 100%;
          padding: 10px 12px;
          border-radius: 12px;
          background: var(--bg);
          box-shadow: var(--shadow-outset-sm);
          border: 1px solid transparent;
          cursor: pointer;
          text-align: left;
          transition: all 0.2s ease;
          position: relative;
          overflow: hidden;
          min-height: 44px;
        }

        .sidebar-lesson-btn:hover {
          box-shadow: var(--shadow-outset);
          transform: translateX(3px);
          border-color: var(--border-light);
        }

        .sidebar-lesson-btn.active {
          background: var(--cat-bg, rgba(241,78,50,0.07));
          border-color: var(--cat-color, var(--git-orange));
          box-shadow: 0 0 0 1px var(--cat-color, var(--git-orange)), var(--shadow-outset-sm);
        }

        .sidebar-active-bar {
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 3px;
          border-radius: 3px 0 0 3px;
        }

        .sidebar-lesson-icon { flex-shrink: 0; }

        .sidebar-lesson-meta {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .sidebar-lesson-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.2s;
        }

        .sidebar-lesson-time {
          font-size: 10px;
          color: var(--text-muted);
          font-family: var(--font-mono);
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .sidebar-ref-badge {
          font-size: 8px;
          padding: 2px 6px;
          border-radius: 999px;
          background: rgba(0,210,255,0.1);
          color: var(--cyan-accent);
          border: 1px solid rgba(0,210,255,0.2);
          font-weight: 700;
          font-family: var(--font-mono);
          flex-shrink: 0;
        }

        /* Next up */
        .sidebar-next-section { display: flex; flex-direction: column; gap: 6px; }

        .sidebar-next-label {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          color: var(--text-muted);
          padding-left: 4px;
        }

        .sidebar-next-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          padding: 12px 14px;
          border-radius: 14px;
          background: var(--bg);
          box-shadow: var(--shadow-inset);
          border: 1px solid var(--border-dark);
          border-left: 3px solid var(--cyan-accent);
          cursor: pointer;
          text-align: left;
          transition: all 0.2s;
          min-height: 44px;
        }

        .sidebar-next-btn:hover {
          border-left-color: var(--git-orange);
          box-shadow: var(--shadow-outset-sm);
        }

        .sidebar-next-info { display: flex; flex-direction: column; gap: 2px; }

        .sidebar-next-cat {
          font-size: 10px;
          color: var(--cyan-accent);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .sidebar-next-title {
          font-size: 13px;
          font-weight: 600;
          color: var(--text-primary);
        }

        /* Badges */
        .sidebar-badges-card {
          background: var(--bg);
          box-shadow: var(--shadow-inset);
          border-radius: 16px;
          border: 1px solid var(--border-dark);
          padding: 14px 16px;
        }

        .sidebar-badges-header {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 12px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--text-secondary);
        }

        .sidebar-badges-list { display: flex; flex-direction: column; gap: 7px; }

        .sidebar-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 10px;
          transition: all 0.2s;
        }

        .sidebar-badge.unlocked {
          background: var(--bg);
          box-shadow: var(--shadow-outset-sm);
          border: 1px solid rgba(245,158,11,0.15);
        }

        .sidebar-badge.locked { opacity: 0.45; filter: grayscale(80%); }

        .sidebar-badge-icon {
          width: 26px; height: 26px;
          border-radius: 50%;
          background: var(--bg);
          box-shadow: var(--shadow-outset-sm);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .sidebar-badge-meta { flex: 1; overflow: hidden; }

        .sidebar-badge-name {
          display: block;
          font-size: 11px;
          font-weight: 700;
          color: var(--text-primary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .sidebar-badge-req {
          display: block;
          font-size: 10px;
          color: var(--text-muted);
          font-family: var(--font-mono);
        }

        .sidebar-badge-earned {
          font-size: 10px;
          color: var(--green-accent);
          font-weight: 800;
          flex-shrink: 0;
        }

        /* Reset */
        .sidebar-reset-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 10px;
          border-radius: 12px;
          background: var(--bg);
          box-shadow: var(--shadow-outset-sm);
          border: 1px solid var(--border-light);
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
          color: var(--text-muted);
          font-family: var(--font-sans);
          transition: all 0.2s;
          min-height: 40px;
        }

        .sidebar-reset-btn:hover {
          color: var(--git-orange);
          box-shadow: var(--shadow-outset);
        }
      `}</style>
    </aside>
  );
}
