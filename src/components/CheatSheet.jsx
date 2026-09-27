import React, { useState } from 'react';
import { Search, Copy, Check, Terminal, BookOpen, ExternalLink, Zap, ChevronDown, ChevronUp } from 'lucide-react';
import { CHEATSHEET } from '../data/cheatsheetData';

const CATEGORY_ICONS = {
  'Setup': '⚙️', 'Basics': '📦', 'Branching': '🌿',
  'Remote': '☁️', 'Undo': '↩️', 'Advanced': '🚀'
};

export function CheatSheet({ onTryInTerminal }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedCmd, setCopiedCmd] = useState(null);
  const [expanded, setExpanded] = useState({});

  const categories = ['All', ...CHEATSHEET.map(c => c.category)];

  const filteredCategories = CHEATSHEET.map(cat => {
    if (activeCategory !== 'All' && cat.category !== activeCategory) return null;
    const filteredCommands = cat.commands.filter(cmd =>
      cmd.cmd.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    if (filteredCommands.length === 0) return null;
    return { ...cat, commands: filteredCommands };
  }).filter(Boolean);

  const handleCopy = (cmd) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const toggleExpand = (cat) => setExpanded(prev => ({ ...prev, [cat]: !prev[cat] }));

  return (
    <div className="animate-fade-in cheatsheet-root">
      {/* Header + Search */}
      <div className="cheatsheet-header-card neu-flat">
        {/* Title row */}
        <div className="cheatsheet-title-row">
          <div className="cheatsheet-icon-wrap">
            <BookOpen size={20} color="#ffffff" />
          </div>
          <div>
            <h2 className="cheatsheet-title">Git Quick Reference</h2>
            <p className="cheatsheet-subtitle">Every command you need, searchable and runnable</p>
          </div>
          <div className="cheatsheet-stat-pill">
            {CHEATSHEET.reduce((acc, c) => acc + c.commands.length, 0)} commands
          </div>
        </div>

        {/* Search */}
        <div className="cheatsheet-search-wrap">
          <Search size={16} color="var(--text-muted)" className="cheatsheet-search-icon" />
          <input
            type="text"
            className="neu-input cheatsheet-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search commands (e.g. commit, push, stash, rebase)..."
          />
          {searchQuery && (
            <button className="cheatsheet-clear-btn" onClick={() => setSearchQuery('')}>×</button>
          )}
        </div>

        {/* Category filters */}
        <div className="cheatsheet-filters">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`cheatsheet-filter-pill ${activeCategory === cat ? 'active' : ''}`}
            >
              {CATEGORY_ICONS[cat] && <span>{CATEGORY_ICONS[cat]}</span>}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {filteredCategories.length === 0 ? (
        <div className="neu-pressed cheatsheet-empty">
          <span style={{ fontSize: '32px' }}>🔍</span>
          <p>No commands found for <strong>"{searchQuery}"</strong></p>
          <button className="neu-btn" onClick={() => setSearchQuery('')}>Clear search</button>
        </div>
      ) : (
        filteredCategories.map(cat => (
          <div key={cat.category} className="cheatsheet-cat-card neu-flat">
            <button className="cheatsheet-cat-header" onClick={() => toggleExpand(cat.category)}>
              <div className="cheatsheet-cat-title-row">
                <span className="cheatsheet-cat-emoji">{CATEGORY_ICONS[cat.category] || '📌'}</span>
                <span className="cheatsheet-cat-name">{cat.category}</span>
                <span className="cheatsheet-cat-count">{cat.commands.length} cmds</span>
              </div>
              {expanded[cat.category]
                ? <ChevronUp size={16} color="var(--text-muted)" />
                : <ChevronDown size={16} color="var(--text-muted)" />}
            </button>

            {!expanded[cat.category] && (
              <div className="cheatsheet-cmd-list">
                {cat.commands.map((item, idx) => (
                  <div key={idx} className="cheatsheet-cmd-row">
                    <div className="cheatsheet-cmd-info">
                      <code className="cheatsheet-cmd-code">{item.cmd}</code>
                      <span className="cheatsheet-cmd-desc">{item.desc}</span>
                    </div>
                    <div className="cheatsheet-cmd-actions">
                      <button
                        onClick={() => onTryInTerminal(item.cmd)}
                        className="cheatsheet-run-btn"
                        title="Try in terminal"
                        aria-label={`Run ${item.cmd} in terminal`}
                      >
                        <Terminal size={12} /> Run
                      </button>
                      <button
                        onClick={() => handleCopy(item.cmd)}
                        className="cheatsheet-copy-btn"
                        title="Copy command"
                        aria-label={`Copy ${item.cmd}`}
                      >
                        {copiedCmd === item.cmd
                          ? <Check size={13} color="var(--green-accent)" />
                          : <Copy size={13} />}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
      )}

      <style>{`
        .cheatsheet-root {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .cheatsheet-header-card {
          padding: 24px;
          border-radius: 24px;
          position: relative;
          overflow: hidden;
        }

        .cheatsheet-header-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--git-orange), var(--cyan-accent));
        }

        .cheatsheet-title-row {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .cheatsheet-icon-wrap {
          width: 44px; height: 44px;
          border-radius: 12px;
          background: linear-gradient(135deg, var(--git-orange), #ff6b4a);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px var(--git-orange-glow);
          flex-shrink: 0;
        }

        .cheatsheet-title {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: var(--text-primary);
        }

        .cheatsheet-subtitle {
          font-size: 12px;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .cheatsheet-stat-pill {
          margin-left: auto;
          font-size: 11px;
          font-weight: 700;
          font-family: var(--font-mono);
          padding: 4px 12px;
          border-radius: 999px;
          background: rgba(241,78,50,0.12);
          color: var(--git-orange);
          border: 1px solid rgba(241,78,50,0.2);
        }

        .cheatsheet-search-wrap {
          position: relative;
          margin-bottom: 14px;
        }

        .cheatsheet-search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          pointer-events: none;
        }

        .cheatsheet-input {
          padding-left: 46px !important;
          padding-right: 40px;
          font-size: 14px;
        }

        .cheatsheet-clear-btn {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          font-size: 18px;
          line-height: 1;
          padding: 0 4px;
        }

        .cheatsheet-clear-btn:hover { color: var(--git-orange); }

        .cheatsheet-filters {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .cheatsheet-filter-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          background: var(--bg);
          box-shadow: var(--shadow-outset-sm);
          border: 1px solid var(--border-light);
          color: var(--text-secondary);
          font-family: var(--font-sans);
          transition: all 0.2s;
          min-height: 34px;
        }

        .cheatsheet-filter-pill:hover {
          color: var(--git-orange);
          box-shadow: var(--shadow-outset);
        }

        .cheatsheet-filter-pill.active {
          background: linear-gradient(135deg, var(--git-orange), #ff6b4a);
          color: #fff;
          border-color: transparent;
          box-shadow: 0 4px 14px var(--git-orange-glow);
        }

        /* Empty */
        .cheatsheet-empty {
          padding: 48px;
          text-align: center;
          border-radius: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          color: var(--text-muted);
          font-size: 15px;
        }

        /* Category card */
        .cheatsheet-cat-card {
          border-radius: 20px;
          overflow: hidden;
          padding: 0;
        }

        .cheatsheet-cat-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 20px;
          background: none;
          border: none;
          cursor: pointer;
          width: 100%;
          text-align: left;
          border-bottom: 1px solid var(--border-dark);
          transition: background 0.2s;
        }

        .cheatsheet-cat-header:hover { background: rgba(255,255,255,0.02); }

        .cheatsheet-cat-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .cheatsheet-cat-emoji { font-size: 16px; }

        .cheatsheet-cat-name {
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          color: var(--git-orange);
        }

        .cheatsheet-cat-count {
          font-size: 10px;
          font-weight: 700;
          font-family: var(--font-mono);
          padding: 2px 8px;
          border-radius: 999px;
          background: rgba(241,78,50,0.1);
          color: var(--git-orange);
        }

        /* Commands */
        .cheatsheet-cmd-list {
          padding: 8px 0;
        }

        .cheatsheet-cmd-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 10px 20px;
          border-bottom: 1px solid var(--border-dark);
          transition: background 0.15s;
        }

        .cheatsheet-cmd-row:last-child { border-bottom: none; }

        .cheatsheet-cmd-row:hover { background: rgba(255,255,255,0.02); }

        .cheatsheet-cmd-info {
          display: flex;
          flex-direction: column;
          gap: 3px;
          flex: 1;
          min-width: 0;
        }

        .cheatsheet-cmd-code {
          font-family: var(--font-mono);
          font-size: 13px;
          color: var(--green-accent);
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .cheatsheet-cmd-desc {
          font-size: 12px;
          color: var(--text-secondary);
        }

        .cheatsheet-cmd-actions {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
        }

        .cheatsheet-run-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: 8px;
          font-size: 11px;
          font-weight: 600;
          cursor: pointer;
          background: rgba(0,210,255,0.08);
          color: var(--cyan-accent);
          border: 1px solid rgba(0,210,255,0.2);
          font-family: var(--font-sans);
          transition: all 0.2s;
          min-height: 30px;
        }

        .cheatsheet-run-btn:hover {
          background: rgba(0,210,255,0.16);
          transform: translateY(-1px);
        }

        .cheatsheet-copy-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 30px; height: 30px;
          border-radius: 8px;
          cursor: pointer;
          background: var(--bg);
          box-shadow: var(--shadow-outset-sm);
          border: 1px solid var(--border-light);
          color: var(--text-muted);
          transition: all 0.2s;
        }

        .cheatsheet-copy-btn:hover {
          color: var(--git-orange);
          box-shadow: var(--shadow-outset);
        }
      `}</style>
    </div>
  );
}
