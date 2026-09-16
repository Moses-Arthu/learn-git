import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HelpCircle, CheckCircle2, XCircle, Sparkles } from 'lucide-react';

export function QuizBlock({ quiz, onCorrectAnswer }) {
  const [selectedIdx, setSelectedIdx] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);

  if (!quiz) return null;

  const handleSelect = (idx) => {
    if (isAnswered) return;
    setSelectedIdx(idx);
    setIsAnswered(true);

    const chosen = quiz.options[idx];
    if (chosen.isCorrect) {
      // Trigger canvas confetti!
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

  return (
    <div className="neu-flat animate-fade-in" style={{ padding: '24px', borderRadius: '20px', margin: '28px 0' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
        <HelpCircle size={18} color="var(--git-orange)" />
        <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--git-orange)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Knowledge Check
        </span>
      </div>

      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '18px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
        {quiz.question}
      </h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {quiz.options.map((option, idx) => {
          let extraClass = "";
          let icon = null;

          if (isAnswered) {
            if (option.isCorrect) {
              extraClass = "correct";
              icon = <CheckCircle2 size={18} color="var(--green-accent)" />;
            } else if (selectedIdx === idx) {
              extraClass = "wrong";
              icon = <XCircle size={18} color="var(--red-accent)" />;
            }
          }

          return (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              disabled={isAnswered}
              className={`neu-btn ${extraClass}`}
              style={{
                width: '100%',
                justifyContent: 'space-between',
                padding: '14px 18px',
                textAlign: 'left',
                borderRadius: '14px',
                fontSize: '14px',
                lineHeight: '1.5',
                background: isAnswered && option.isCorrect
                  ? 'rgba(16, 185, 129, 0.08)'
                  : isAnswered && selectedIdx === idx && !option.isCorrect
                  ? 'rgba(239, 68, 68, 0.08)'
                  : undefined,
                border: isAnswered && option.isCorrect
                  ? '1px solid var(--green-accent)'
                  : isAnswered && selectedIdx === idx && !option.isCorrect
                  ? '1px solid var(--red-accent)'
                  : undefined
              }}
            >
              <span>{option.text}</span>
              {icon}
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div
          className="neu-pressed animate-slide-up"
          style={{
            marginTop: '18px',
            padding: '16px',
            borderRadius: '14px',
            borderLeft: quiz.options[selectedIdx]?.isCorrect
              ? '4px solid var(--green-accent)'
              : '4px solid var(--red-accent)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '700', fontSize: '14px', marginBottom: '4px', color: quiz.options[selectedIdx]?.isCorrect ? 'var(--green-accent)' : 'var(--red-accent)' }}>
            {quiz.options[selectedIdx]?.isCorrect ? '🎉 Correct!' : '💡 Explanation'}
          </div>
          <p style={{ fontSize: '13.5px', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
            {quiz.explanation}
          </p>
        </div>
      )}
    </div>
  );
}
