import React, { useState } from 'react';
import { Search, Copy, Check, Terminal, BookOpen, ExternalLink } from 'lucide-react';
import { CHEATSHEET } from '../data/cheatsheetData';

export function CheatSheet({ onTryInTerminal }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [copiedCmd, setCopiedCmd] = useState(null);

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

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header & Search */}
      <div className="neu-flat" style={{ padding: '24px', borderRadius: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <BookOpen size={20} color="var(--git-orange)" />
          <h2 style={{ fontSize: '20px', fontWeight: '800' }}>Git Quick Reference Cheat Sheet</h2>
        </div>

        {/* Search bar */}
        <div style={{ position: 'relative', marginBottom: '16px' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            className="neu-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search commands or descriptions (e.g. checkout, commit, push, stash)..."
            style={{ paddingLeft: '46px' }}
          />
        </div>

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`neu-btn ${activeCategory === cat ? 'active' : ''}`}
              style={{ fontSize: '12px', padding: '6px 14px', borderRadius: '999px' }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Command Tables */}
      {filteredCategories.length === 0 ? (
        <div className="neu-pressed" style={{ padding: '32px', textAlign: 'center', borderRadius: '16px', color: 'var(--text-muted)' }}>
          No Git commands found matching "{searchQuery}". Try a different keyword!
        </div>
      ) : (
        filteredCategories.map(cat => (
          <div key={cat.category} className="neu-flat" style={{ padding: '20px', borderRadius: '18px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--git-orange)', marginBottom: '14px', paddingBottom: '8px', borderBottom: '1px solid var(--border-dark)' }}>
              {cat.category}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cat.commands.map((item, idx) => (
                <div
                  key={idx}
                  className="neu-pressed"
                  style={{
                    padding: '12px 16px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '240px' }}>
                    <code style={{ fontFamily: 'var(--font-mono)', fontSize: '13.5px', color: 'var(--green-accent)', fontWeight: '600' }}>
                      {item.cmd}
                    </code>
                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                      {item.desc}
                    </span>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Try in Terminal Button */}
                    <button
                      onClick={() => onTryInTerminal(item.cmd)}
                      className="neu-btn"
                      style={{ fontSize: '11px', padding: '6px 10px', borderRadius: '8px' }}
                      title="Run command in Terminal Simulator"
                    >
                      <Terminal size={13} color="var(--cyan-accent)" /> Run
                    </button>

                    {/* Copy Button */}
                    <button
                      onClick={() => handleCopy(item.cmd)}
                      className="neu-btn neu-icon-btn"
                      style={{ width: '32px', height: '32px', borderRadius: '8px' }}
                      title="Copy command"
                    >
                      {copiedCmd === item.cmd ? <Check size={14} color="var(--green-accent)" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
