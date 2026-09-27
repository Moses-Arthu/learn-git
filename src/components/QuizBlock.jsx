import React, { useState, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, XCircle, Trophy, Zap } from 'lucide-react';

function shuffleArray(arr) {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export function QuizBlock({ quiz, onCorrectAnswer }) {
  // Shuffle options once per quiz id so the correct answer is never in a predictable position
  const shuffledOptions = useMemo(() => {
    if (!quiz) return [];
    return shuffleArray(quiz.options);
  }, [quiz?.id]);

  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  if (!quiz) return null;

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    const chosen = shuffledOptions[idx];
    if (chosen.isCorrect) {
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 }
        });
      } catch (e) {
        // Fallback gracefully
      }
      onCorrectAnswer();
    }
  };

  const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .quiz-option {
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }
        .quiz-option:not(:disabled):hover {
          transform: translateY(-2px);
          border-color: var(--git-orange, #f97316);
          box-shadow: 0 4px 20px rgba(249, 115, 22, 0.15);
        }
        .quiz-option-wrong {
          animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        .quiz-glass-card {
          background: rgba(30, 41, 59, 0.7);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        }
      `}</style>

      <div 
        className="quiz-glass-card animate-fade-in" 
        style={{ 
          padding: '28px', 
          borderRadius: '24px', 
          margin: '32px 0',
          borderTop: '3px solid var(--git-orange, #f97316)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          position: 'relative'
        }}
      >
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(249, 115, 22, 0.15)',
            border: '1px solid rgba(249, 115, 22, 0.3)',
            boxShadow: '0 0 12px rgba(249, 115, 22, 0.2)',
            padding: '6px 12px',
            borderRadius: '9999px'
          }}>
            <Trophy size={16} color="var(--git-orange, #f97316)" />
            <span style={{ 
              fontSize: '11px', 
              fontWeight: '800', 
              color: 'var(--git-orange, #f97316)', 
              textTransform: 'uppercase', 
              letterSpacing: '0.1em' 
            }}>
              Knowledge Check
            </span>
          </div>
        </div>

        <h3 style={{ 
          fontSize: '18px', 
          fontWeight: '700', 
          marginBottom: '24px', 
          color: 'var(--text-primary, #f8fafc)', 
          lineHeight: '1.5',
          borderLeft: '4px solid var(--cyan-accent, #06b6d4)',
          paddingLeft: '16px'
        }}>
          {quiz.question}
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {shuffledOptions.map((option, idx) => {
            let isSelected = selectedIdx === idx;
            let showCorrect = isAnswered && option.isCorrect;
            let showWrong = isAnswered && isSelected && !option.isCorrect;
            let fadeOut = isAnswered && !option.isCorrect && !isSelected;

            let bgStyle = 'rgba(255, 255, 255, 0.03)';
            let borderStyle = '1px solid rgba(255, 255, 255, 0.08)';
            let shadowStyle = '5px 5px 10px rgba(0,0,0,0.2), -5px -5px 10px rgba(255,255,255,0.02)'; // Neumorphic outset
            let optionClass = 'quiz-option neu-btn';

            if (showCorrect) {
              bgStyle = 'linear-gradient(145deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.2) 100%)';
              borderStyle = '1px solid rgba(16, 185, 129, 0.5)';
              shadowStyle = '0 0 15px rgba(16, 185, 129, 0.2)';
            } else if (showWrong) {
              bgStyle = 'linear-gradient(145deg, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.2) 100%)';
              borderStyle = '1px solid rgba(239, 68, 68, 0.3)';
              optionClass += ' quiz-option-wrong';
              shadowStyle = 'none';
            } else if (isAnswered) {
              shadowStyle = 'none';
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                disabled={isAnswered}
                className={optionClass}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '16px 20px',
                  textAlign: 'left',
                  borderRadius: '16px',
                  background: bgStyle,
                  border: borderStyle,
                  boxShadow: shadowStyle,
                  opacity: fadeOut ? 0.4 : 1,
                  cursor: isAnswered ? 'default' : 'pointer',
                  color: 'var(--text-primary, #e2e8f0)',
                  position: 'relative'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: showCorrect ? 'var(--green-accent, #10b981)' : showWrong ? 'var(--red-accent, #ef4444)' : 'rgba(0,0,0,0.3)',
                  color: showCorrect || showWrong ? '#fff' : 'var(--text-secondary, #94a3b8)',
                  fontSize: '13px',
                  fontWeight: '700',
                  flexShrink: 0
                }}>
                  {showCorrect ? <CheckCircle2 size={16} /> : showWrong ? <XCircle size={16} /> : optionLabels[idx]}
                </div>
                <span style={{ fontSize: '14px', lineHeight: '1.5', flex: 1, fontWeight: showCorrect || showWrong ? '600' : '500' }}>
                  {option.text}
                </span>
                
                {showCorrect && (
                  <div style={{ 
                    background: 'rgba(16, 185, 129, 0.15)', 
                    padding: '4px 8px', 
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'var(--green-accent, #10b981)',
                    fontSize: '12px',
                    fontWeight: '700',
                    animation: 'slide-up 0.3s ease-out'
                  }}>
                    <CheckCircle2 size={14} /> CORRECT
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {isAnswered && (
          <div
            style={{
              marginTop: '24px',
              padding: '20px',
              borderRadius: '16px',
              background: shuffledOptions[selectedIdx]?.isCorrect 
                ? 'linear-gradient(to right, rgba(16,185,129,0.05), rgba(16,185,129,0.15))' 
                : 'linear-gradient(to right, rgba(239,68,68,0.05), rgba(239,68,68,0.1))',
              borderTop: shuffledOptions[selectedIdx]?.isCorrect
                ? '3px solid var(--green-accent, #10b981)'
                : '3px solid var(--red-accent, #ef4444)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              borderLeft: '1px solid rgba(255,255,255,0.05)',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              animation: 'slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
              position: 'relative'
            }}
          >
            {shuffledOptions[selectedIdx]?.isCorrect ? (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '16px', marginBottom: '8px', color: 'var(--green-accent, #10b981)' }}>
                    <span>🎊 Brilliant!</span>
                  </div>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary, #cbd5e1)', lineHeight: '1.6', margin: 0 }}>
                    {quiz.explanation}
                  </p>
                </div>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px', 
                  background: 'var(--git-orange, #f97316)', 
                  color: '#fff', 
                  padding: '6px 12px', 
                  borderRadius: '99px',
                  fontWeight: '700',
                  fontSize: '13px',
                  boxShadow: '0 4px 12px rgba(249,115,22,0.3)',
                  flexShrink: 0
                }}>
                  <Zap size={14} fill="currentColor" /> +25 XP
                </div>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '800', fontSize: '15px', marginBottom: '8px', color: 'var(--red-accent, #ef4444)' }}>
                  <HelpCircle size={18} /> Not quite right
                </div>
                <div style={{ 
                  background: 'rgba(0,0,0,0.2)', 
                  padding: '12px 16px', 
                  borderRadius: '12px', 
                  borderLeft: '3px solid var(--red-accent, #ef4444)' 
                }}>
                  <p style={{ fontSize: '14px', color: 'var(--text-secondary, #cbd5e1)', lineHeight: '1.6', margin: 0 }}>
                    {quiz.explanation}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
