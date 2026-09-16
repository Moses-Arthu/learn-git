import React from 'react';
import { CheckCircle2, Circle, Trophy, Award, GitBranch, Terminal, X, RotateCcw } from 'lucide-react';
import { BADGES } from '../data/lessonsData';

export function Sidebar({ lessons, currentLessonId, onSelectLesson, completedLessons, score, onCloseMobileMenu, onReset }) {
  const total = lessons.length;
  const completedCount = completedLessons.size;
  const progressPct = Math.round((completedCount / total) * 100);

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
          <button onClick={onCloseMobileMenu} className="neu-btn neu-icon-btn" style={{ width: '32px', height: '32px' }} aria-label="Close menu">
            <X size={16} />
          </button>
        </div>
      )}
      {/* Overall Progress Card */}
      <div className="neu-pressed" style={{ padding: '16px', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Course Progress
          </span>
          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--git-orange)', fontFamily: 'var(--font-mono)' }}>
            {completedCount} / {total} ({progressPct}%)
          </span>
        </div>
        <div className="neu-progress-track">
          <div className="neu-progress-fill" style={{ width: `${progressPct}%` }}></div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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

                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.id)}
                    className={`neu-btn ${isActive ? 'active' : ''}`}
                    style={{
                      width: '100%',
                      justify: 'space-between',
                      padding: '10px 14px',
                      fontSize: '13.5px',
                      borderRadius: '12px',
                      border: isActive ? '1px solid var(--git-orange-glow)' : undefined
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
                      {isCompleted ? (
                        <CheckCircle2 size={16} color="var(--green-accent)" style={{ flexShrink: 0 }} />
                      ) : (
                        <Circle size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                      )}
                      <span style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontWeight: isActive ? '700' : '500',
                        color: isActive ? 'var(--git-orange)' : 'var(--text-primary)'
                      }}>
                        {lesson.title}
                      </span>
                    </div>

                    {lesson.isReferenceLesson && (
                      <span className="neu-badge neu-badge-cyan" style={{ fontSize: '9px', padding: '2px 6px' }}>
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

      {/* Badges Section */}
      <div className="neu-pressed" style={{ padding: '16px', borderRadius: '16px', marginTop: '10px' }}>
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
                  opacity: isUnlocked ? 1 : 0.4,
                  filter: isUnlocked ? 'none' : 'grayscale(100%)',
                  transition: 'all 0.2s ease'
                }}
                className={isUnlocked ? "neu-flat" : "neu-pressed"}
              >
                <Award size={14} color={isUnlocked ? "var(--git-orange)" : "var(--text-muted)"} style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '11px', fontWeight: '600', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {badge.name}
                </span>
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
        >
          <RotateCcw size={14} color="var(--git-orange)" />
          <span>Reset Learning Progress</span>
        </button>
      )}
    </aside>
  );
}
