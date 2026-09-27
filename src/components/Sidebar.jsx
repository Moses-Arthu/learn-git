import React from 'react';
import { CheckCircle2, Circle, Trophy, Award, GitBranch, X, RotateCcw, ArrowRight, Clock } from 'lucide-react';
import { BADGES } from '../data/lessonsData';

// Estimated reading times per lesson (minutes)
const READ_TIMES = {
  0: 3, 1: 4, 2: 3, 3: 5, 4: 4, 5: 5, 6: 4, 7: 6
};

export function Sidebar({ lessons, currentLessonId, onSelectLesson, completedLessons, score, onCloseMobileMenu, onReset }) {
  const total = lessons.length;
  const completedCount = completedLessons.size;
  const progressPct = Math.round((completedCount / total) * 100);

  // Find the next uncompleted lesson (after current)
  const nextLesson = lessons.find(
    l => !completedLessons.has(l.id) && l.id !== currentLessonId
  );

  // Group lessons by category
  const categories = ["Foundations", "Branching", "Remote", "Reference"];

  return (
    <aside style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      padding: '20px 16px',
      borderRadius: '24px',
      height: 'fit-content'
    }} className="neu-flat animate-slide-up">

      {/* Mobile Header Close */}
      {onCloseMobileMenu && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '-8px' }} className="mobile-only-header">
          <span style={{ fontSize: '14px', fontWeight: '800', color: 'var(--git-orange)' }}>
            Course Navigation
          </span>
          <button onClick={onCloseMobileMenu} className="neu-btn neu-icon-btn" style={{ width: '36px', height: '36px' }} aria-label="Close menu">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Overall Progress Card */}
      <div className="neu-pressed" style={{ padding: '16px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Your Progress
          </span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--git-orange)', fontFamily: 'var(--font-mono)' }}>
            {completedCount}/{total}
          </span>
        </div>
        <div className="neu-progress-track" role="progressbar" aria-valuenow={progressPct} aria-valuemin={0} aria-valuemax={100} aria-label="Sidebar course progress">
          <div className="neu-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        {completedCount === 0 && (
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            Complete lessons to earn XP and unlock badges
          </p>
        )}
        {completedCount > 0 && completedCount < total && (
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '8px' }}>
            {total - completedCount} lesson{total - completedCount !== 1 ? 's' : ''} remaining
          </p>
        )}
        {completedCount === total && (
          <p style={{ fontSize: '11px', color: 'var(--green-accent)', marginTop: '8px', fontWeight: '700' }}>
            🏆 Course complete!
          </p>
        )}
      </div>

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} aria-label="Course lessons">
        {categories.map((category) => {
          const categoryLessons = lessons.filter(l => l.category === category);
          if (categoryLessons.length === 0) return null;

          return (
            <div key={category} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div style={{
                fontSize: '11px',
                fontWeight: '800',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                padding: '0 8px 4px'
              }}>
                {category}
              </div>

              {categoryLessons.map((lesson) => {
                const isActive = lesson.id === currentLessonId;
                const isCompleted = completedLessons.has(lesson.id);
                const readTime = READ_TIMES[lesson.id] || 4;

                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.id)}
                    className={`neu-btn ${isActive ? 'active' : ''}`}
                    aria-current={isActive ? 'page' : undefined}
                    aria-label={`${lesson.title}${isCompleted ? ', completed' : ''}${isActive ? ', current lesson' : ''}`}
                    style={{
                      width: '100%',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      fontSize: '13.5px',
                      borderRadius: '12px',
                      border: isActive ? '1px solid var(--git-orange-glow)' : undefined
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden', flex: 1 }}>
                      {isCompleted ? (
                        <CheckCircle2 size={16} color="var(--green-accent)" style={{ flexShrink: 0 }} />
                      ) : (
                        <Circle size={16} color={isActive ? 'var(--git-orange)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                      )}
                      <div style={{ overflow: 'hidden', flex: 1 }}>
                        <span style={{
                          display: 'block',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontWeight: isActive ? '700' : '500',
                          color: isActive ? 'var(--git-orange)' : 'var(--text-primary)'
                        }}>
                          {lesson.title}
                        </span>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', display: 'flex', alignItems: 'center', gap: '3px', marginTop: '1px' }}>
                          <Clock size={9} /> ~{readTime} min
                        </span>
                      </div>
                    </div>

                    {lesson.isReferenceLesson && (
                      <span className="neu-badge neu-badge-cyan" style={{ fontSize: '9px', padding: '2px 6px', flexShrink: 0 }}>
                        REF
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* "Next Up" callout — points to next uncompleted lesson */}
      {nextLesson && nextLesson.id !== currentLessonId && (
        <div>
          <div style={{ fontSize: '11px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px' }}>
            Up Next
          </div>
          <button
            onClick={() => onSelectLesson(nextLesson.id)}
            className="next-up-callout"
            aria-label={`Jump to next lesson: ${nextLesson.title}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--cyan-accent)', marginBottom: '2px' }}>
                  {nextLesson.category}
                </div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                  {nextLesson.title}
                </div>
              </div>
              <ArrowRight size={16} color="var(--cyan-accent)" style={{ flexShrink: 0 }} />
            </div>
          </button>
        </div>
      )}

      {/* Badges Section */}
      <div className="neu-pressed" style={{ padding: '16px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Trophy size={16} color="var(--yellow-accent)" />
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
            Achievements
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {BADGES.map(badge => {
            const isUnlocked = completedCount >= badge.minScore;
            return (
              <div
                key={badge.id}
                title={`${badge.name}: ${badge.desc}`}
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: isUnlocked ? 1 : 0.45,
                  filter: isUnlocked ? 'none' : 'grayscale(100%)',
                  transition: 'all 0.2s ease'
                }}
                className={isUnlocked ? "neu-flat" : "neu-pressed"}
              >
                <Award size={14} color={isUnlocked ? "var(--git-orange)" : "var(--text-muted)"} style={{ flexShrink: 0 }} />
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: isUnlocked ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                    {badge.name}
                  </div>
                  {!isUnlocked && (
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Complete {badge.minScore} lesson{badge.minScore !== 1 ? 's' : ''}
                    </div>
                  )}
                </div>
                {isUnlocked && (
                  <span style={{ fontSize: '10px', color: 'var(--green-accent)', fontWeight: '700', fontFamily: 'var(--font-mono)', flexShrink: 0 }}>✓ Earned</span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Reset Progress Footer Action */}
      {onReset && (
        <button
          onClick={onReset}
          className="neu-btn"
          style={{
            width: '100%',
            justifyContent: 'center',
            padding: '10px',
            fontSize: '13px',
            color: 'var(--text-secondary)'
          }}
          aria-label="Reset all learning progress"
        >
          <RotateCcw size={14} color="var(--git-orange)" />
          <span>Reset Learning Progress</span>
        </button>
      )}
    </aside>
  );
}
