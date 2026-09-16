import React, { useState, useEffect } from 'react';
import { LESSONS } from './data/lessonsData';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { GitGraphVisualizer } from './components/GitGraphVisualizer';
import { InteractiveTerminal } from './components/InteractiveTerminal';
import { QuizBlock } from './components/QuizBlock';
import { CheatSheet } from './components/CheatSheet';
import { ChevronLeft, ChevronRight, Terminal as TerminalIcon, Sparkles, BookOpen, CheckCircle, RotateCcw } from 'lucide-react';
import confetti from 'canvas-confetti';

export function App() {
  const [currentLessonId, setCurrentLessonId] = useState(0);
  const [completedLessons, setCompletedLessons] = useState(() => {
    const saved = localStorage.getItem('gitlearn_completed');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [xp, setXp] = useState(() => {
    const saved = localStorage.getItem('gitlearn_xp');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('gitlearn_theme') || 'dark';
  });

  const [externalCommand, setExternalCommand] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Interactive Repository State for Git Graph & Terminal
  const [repoState, setRepoState] = useState({
    isInitialized: true,
    currentBranch: 'main',
    branches: ['main'],
    commits: [],
    stagingArea: [],
    workingDirectory: [
      { name: 'index.html', status: 'untracked' },
      { name: 'style.css', status: 'untracked' }
    ],
    remoteUrl: ''
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('gitlearn_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('gitlearn_completed', JSON.stringify(Array.from(completedLessons)));
  }, [completedLessons]);

  useEffect(() => {
    localStorage.setItem('gitlearn_xp', xp.toString());
  }, [xp]);

  const currentLesson = LESSONS.find(l => l.id === currentLessonId) || LESSONS[0];
  const isLastLesson = currentLessonId === LESSONS.length - 1;
  const isFirstLesson = currentLessonId === 0;

  const handleNext = () => {
    // Mark current lesson completed
    if (!completedLessons.has(currentLessonId)) {
      const updated = new Set(completedLessons).add(currentLessonId);
      setCompletedLessons(updated);
      setXp(prev => prev + 50); // 50 XP per lesson completion

      if (updated.size === LESSONS.length) {
        // Course completion celebration!
        try {
          confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
        } catch (e) {}
      }
    }

    if (currentLessonId < LESSONS.length - 1) {
      setCurrentLessonId(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentLessonId > 0) {
      setCurrentLessonId(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset your learning progress and XP?")) {
      setCompletedLessons(new Set());
      setXp(0);
      setCurrentLessonId(0);
      handleResetRepo();
      localStorage.removeItem('gitlearn_completed');
      localStorage.removeItem('gitlearn_xp');
    }
  };

  const handleResetRepo = () => {
    setRepoState({
      isInitialized: true,
      currentBranch: 'main',
      branches: ['main'],
      commits: [],
      stagingArea: [],
      workingDirectory: [
        { name: 'index.html', status: 'untracked' },
        { name: 'style.css', status: 'untracked' }
      ],
      remoteUrl: ''
    });
  };

  const handleQuizCorrect = () => {
    setXp(prev => prev + 25);
  };

  const handleTryInTerminal = (cmd) => {
    setExternalCommand(cmd);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '24px 16px' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Header Bar */}
        <Header
          theme={theme}
          setTheme={setTheme}
          xp={xp}
          progressPct={Math.round((completedLessons.size / LESSONS.length) * 100)}
          onReset={handleReset}
          toggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        {/* Main Grid Layout */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '28px' }} className="layout-grid">
          {/* Mobile Backdrop Overlay */}
          {isMobileMenuOpen && (
            <div
              className="sidebar-backdrop"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}

          {/* Sidebar */}
          <div className={`sidebar-wrapper ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
            <Sidebar
              lessons={LESSONS}
              currentLessonId={currentLessonId}
              onSelectLesson={(id) => {
                setCurrentLessonId(id);
                setIsMobileMenuOpen(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              completedLessons={completedLessons}
              score={completedLessons.size}
              onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
              onReset={handleReset}
            />
          </div>

          {/* Main Content Area */}
          <main style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Git Branch & Repository Visualizer Widget */}
            <GitGraphVisualizer repoState={repoState} />

            {/* Interactive Terminal Simulator Widget */}
            <InteractiveTerminal
              repoState={repoState}
              setRepoState={setRepoState}
              externalCommand={externalCommand}
              onCommandExecuted={() => setExternalCommand('')}
              onResetRepo={handleResetRepo}
            />

            {/* Lesson Content Card */}
            {currentLesson.isReferenceLesson ? (
              <CheatSheet onTryInTerminal={handleTryInTerminal} />
            ) : (
              <article className="neu-flat animate-fade-in" style={{ padding: '32px', borderRadius: '24px' }}>
                {/* Lesson Header */}
                <div style={{ marginBottom: '24px' }}>
                  <div style={{
                    fontSize: '12px',
                    fontWeight: '800',
                    color: 'var(--git-orange)',
                    fontFamily: 'var(--font-mono)',
                    letterSpacing: '0.08em',
                    marginBottom: '8px'
                  }}>
                    {currentLesson.eyebrow}
                  </div>

                  <h2 style={{
                    fontSize: '28px',
                    fontWeight: '800',
                    lineHeight: '1.2',
                    marginBottom: '12px',
                    color: 'var(--text-primary)'
                  }}>
                    {currentLesson.title}
                  </h2>

                  <p style={{
                    fontSize: '16px',
                    color: 'var(--text-secondary)',
                    lineHeight: '1.7',
                    maxWidth: '800px'
                  }}>
                    {currentLesson.summary}
                  </p>
                </div>

                {/* Analogy Box */}
                {currentLesson.analogy && (
                  <div className="neu-pressed" style={{
                    padding: '20px 24px',
                    borderRadius: '16px',
                    marginBottom: '28px',
                    borderLeft: '4px solid var(--cyan-accent)',
                    background: 'rgba(0, 210, 255, 0.03)'
                  }}>
                    <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--cyan-accent)', textTransform: 'uppercase', marginBottom: '4px' }}>
                      💡 Analogy
                    </div>
                    <p style={{ fontSize: '14.5px', color: 'var(--text-primary)', lineHeight: '1.6' }}>
                      {currentLesson.analogy}
                    </p>
                  </div>
                )}

                {/* Concepts Cards Grid */}
                {currentLesson.concepts && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '28px' }}>
                    {currentLesson.concepts.map((concept, idx) => (
                      <div key={idx} className="neu-flat neu-flat-hover" style={{ padding: '20px', borderRadius: '16px' }}>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '8px', color: 'var(--git-orange)' }}>
                          {concept.title}
                        </h4>
                        <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                          {concept.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Interactive Command Step Launcher */}
                {currentLesson.interactiveSteps && (
                  <div className="neu-pressed" style={{ padding: '20px', borderRadius: '16px', marginBottom: '28px' }}>
                    <div style={{ fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <TerminalIcon size={14} color="var(--green-accent)" /> Interactive Step Launcher
                    </div>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {currentLesson.interactiveSteps.map((step, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleTryInTerminal(step.command)}
                          className="neu-btn neu-btn-primary"
                          style={{ fontSize: '13px', padding: '10px 16px', borderRadius: '12px' }}
                        >
                          <TerminalIcon size={15} /> {step.label}: <code>{step.command}</code>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Code / Terminal Examples */}
                {currentLesson.terminalExamples && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '28px' }}>
                    {currentLesson.terminalExamples.map((ex, idx) => (
                      <div key={idx} className="neu-pressed-deep" style={{ borderRadius: '16px', overflow: 'hidden' }}>
                        <div style={{ padding: '10px 18px', fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-dark)', background: 'rgba(0,0,0,0.1)' }}>
                          {ex.title}
                        </div>
                        <pre style={{ padding: '16px 20px', fontFamily: 'var(--font-mono)', fontSize: '13px', color: 'var(--green-accent)', overflowX: 'auto', lineHeight: '1.7' }}>
                          {ex.code}
                        </pre>
                      </div>
                    ))}
                  </div>
                )}

                {/* Knowledge Check Quiz */}
                {currentLesson.quiz && (
                  <QuizBlock quiz={currentLesson.quiz} onCorrectAnswer={handleQuizCorrect} />
                )}

                {/* Lesson Navigation Footer */}
                <div style={{
                  display: 'flex',
                  justify: 'space-between',
                  alignItems: 'center',
                  marginTop: '40px',
                  paddingTop: '24px',
                  borderTop: '1px solid var(--border-dark)'
                }}>
                  <button
                    onClick={handlePrev}
                    disabled={isFirstLesson}
                    className="neu-btn"
                  >
                    <ChevronLeft size={18} /> Previous
                  </button>

                  <div style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    Lesson {currentLessonId + 1} of {LESSONS.length}
                  </div>

                  <button
                    onClick={handleNext}
                    className="neu-btn neu-btn-primary"
                  >
                    {isLastLesson ? 'Finish Course 🎉' : 'Next Lesson'} <ChevronRight size={18} />
                  </button>
                </div>
              </article>
            )}

            {/* Course Completion Celebration Screen */}
            {completedLessons.size === LESSONS.length && (
              <div className="neu-flat animate-fade-in" style={{ padding: '40px', textAlign: 'center', borderRadius: '24px' }}>
                <div style={{ fontSize: '54px', marginBottom: '16px' }}>🏆</div>
                <h2 style={{ fontSize: '28px', fontWeight: '800', marginBottom: '12px', color: 'var(--git-orange)' }}>
                  Congratulations! You Mastered Git!
                </h2>
                <p style={{ fontSize: '16px', color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto 24px', lineHeight: '1.7' }}>
                  You completed all 8 lessons, answered the quizzes, and practiced with the interactive terminal simulator. You are now equipped for real-world software development!
                </p>
                <button
                  onClick={handleReset}
                  className="neu-btn neu-btn-primary"
                  style={{ margin: '0 auto' }}
                >
                  <RotateCcw size={16} /> Restart Course & Practice Again
                </button>
              </div>
            )}
          </main>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .layout-grid {
            grid-template-columns: 1fr !important;
          }
          .sidebar-wrapper {
            display: none;
          }
          .sidebar-wrapper.mobile-open {
            display: block;
          }
        }
      `}</style>
    </div>
  );
}
