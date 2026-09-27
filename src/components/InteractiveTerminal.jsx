import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, Check, Copy, Zap, GitBranch } from 'lucide-react';

export function InteractiveTerminal({ repoState, setRepoState, externalCommand, onCommandExecuted, onResetRepo }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'comment', text: '# Interactive Git Terminal Simulator' },
    { type: 'comment', text: '# Type a git command or click quick action buttons above to execute.' },
    { type: 'out', text: 'Type "help" for a list of supported interactive commands.' }
  ]);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [copied, setCopied] = useState(false);

  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Handle external command execution (when user clicks an interactive step button in lessons)
  useEffect(() => {
    if (externalCommand) {
      executeCommand(externalCommand);
      if (onCommandExecuted) onCommandExecuted();
    }
  }, [externalCommand]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const executeCommand = (rawCmd) => {
    const cmd = rawCmd.trim();
    if (!cmd) return;

    const newHistory = [...history, { type: 'cmd', text: cmd }];
    setCommandHistory(prev => [...prev, cmd]);
    setHistoryIndex(-1);

    const parts = cmd.split(' ').filter(Boolean);
    const mainCmd = parts[0]?.toLowerCase();
    const subCmd = parts[1]?.toLowerCase();

    let outputLines = [];

    if (cmd === 'clear') {
      setHistory([]);
      setInput('');
      return;
    }

    if (cmd === 'help') {
      outputLines = [
        { type: 'out', text: 'Supported Interactive Commands:' },
        { type: 'highlight', text: '  git init                   - Initialize empty repository' },
        { type: 'highlight', text: '  git status                 - View working tree & staging state' },
        { type: 'highlight', text: '  git add .                  - Stage all untracked/modified files' },
        { type: 'highlight', text: '  git commit -m "msg"        - Create snapshot commit' },
        { type: 'highlight', text: '  git branch [name]          - List or create branches' },
        { type: 'highlight', text: '  git checkout -b <name>     - Create & switch branch' },
        { type: 'highlight', text: '  git merge <branch>         - Merge branch into current HEAD' },
        { type: 'highlight', text: '  git remote add origin <url>- Link remote repo' },
        { type: 'highlight', text: '  git push                   - Push commits to GitHub' },
        { type: 'highlight', text: '  git log --oneline          - Show compact commit log' },
        { type: 'highlight', text: '  clear                      - Clear terminal history' }
      ];
    } else if (mainCmd === 'git') {
      if (!subCmd) {
        outputLines = [{ type: 'err', text: 'usage: git [--version] [--help] <command> [<args>]' }];
      } else if (subCmd === 'init') {
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
        outputLines = [
          { type: 'out', text: 'Initialized empty Git repository in /project/.git/' },
          { type: 'comment', text: '# Hint: run "git status" to see your working directory.' }
        ];
      } else if (!repoState.isInitialized && subCmd !== 'config' && subCmd !== '--version') {
        outputLines = [{ type: 'err', text: 'fatal: not a git repository (or any of the parent directories): .git' }];
      } else if (subCmd === 'status') {
        if (repoState.workingDirectory.length === 0 && repoState.stagingArea.length === 0) {
          outputLines = [
            { type: 'out', text: `On branch ${repoState.currentBranch}` },
            { type: 'out', text: 'nothing to commit, working tree clean' }
          ];
        } else {
          let lines = [{ type: 'warn', text: `On branch ${repoState.currentBranch}` }];

          if (repoState.stagingArea.length > 0) {
            lines.push({ type: 'highlight', text: 'Changes to be committed:' });
            repoState.stagingArea.forEach(f => {
              lines.push({ type: 'green', text: `  new file:   ${f.name}` });
            });
          }

          if (repoState.workingDirectory.length > 0) {
            lines.push({ type: 'err', text: 'Untracked files:' });
            lines.push({ type: 'comment', text: '  (use "git add <file>..." to include in what will be committed)' });
            repoState.workingDirectory.forEach(f => {
              lines.push({ type: 'err', text: `  ${f.name}` });
            });
          }
          outputLines = lines;
        }
      } else if (subCmd === 'add') {
        if (repoState.workingDirectory.length === 0) {
          outputLines = [{ type: 'out', text: 'Nothing to stage.' }];
        } else {
          const stagedFiles = [...repoState.workingDirectory];
          setRepoState(prev => ({
            ...prev,
            stagingArea: [...prev.stagingArea, ...stagedFiles],
            workingDirectory: []
          }));
          outputLines = [{ type: 'out', text: `Staged ${stagedFiles.length} file(s) for commit.` }];
        }
      } else if (subCmd === 'commit') {
        if (repoState.stagingArea.length === 0) {
          outputLines = [
            { type: 'err', text: 'On branch ' + repoState.currentBranch },
            { type: 'err', text: 'nothing to commit, working tree clean' }
          ];
        } else {
          // Extract message after -m
          const msgMatch = cmd.match(/-m\s+["']?([^"']+)["']?/);
          const msg = msgMatch ? msgMatch[1] : 'Update project files';
          const hash = Math.random().toString(36).substring(2, 9);

          const newCommit = {
            hash,
            message: msg,
            branch: repoState.currentBranch,
            timestamp: new Date().toLocaleTimeString()
          };

          setRepoState(prev => ({
            ...prev,
            commits: [...prev.commits, newCommit],
            stagingArea: []
          }));

          outputLines = [
            { type: 'highlight', text: `[${repoState.currentBranch} ${hash}] ${msg}` },
            { type: 'out', text: ` ${repoState.stagingArea.length} file(s) changed, ${repoState.stagingArea.length * 12} insertions(+)` }
          ];
        }
      } else if (subCmd === 'branch') {
        const targetBranch = parts[2];
        if (!targetBranch) {
          // List branches
          outputLines = repoState.branches.map(b => ({
            type: b === repoState.currentBranch ? 'green' : 'out',
            text: b === repoState.currentBranch ? `* ${b}` : `  ${b}`
          }));
        } else if (targetBranch === '-d') {
          const delBranch = parts[3];
          if (!delBranch) {
            outputLines = [{ type: 'err', text: 'fatal: branch name required' }];
          } else if (delBranch === repoState.currentBranch) {
            outputLines = [{ type: 'err', text: `error: Cannot delete branch '${delBranch}' checked out` }];
          } else {
            setRepoState(prev => ({
              ...prev,
              branches: prev.branches.filter(b => b !== delBranch)
            }));
            outputLines = [{ type: 'out', text: `Deleted branch ${delBranch}` }];
          }
        } else {
          // Create branch
          if (repoState.branches.includes(targetBranch)) {
            outputLines = [{ type: 'err', text: `fatal: A branch named '${targetBranch}' already exists.` }];
          } else {
            setRepoState(prev => ({
              ...prev,
              branches: [...prev.branches, targetBranch]
            }));
            outputLines = [{ type: 'out', text: `Created branch '${targetBranch}'` }];
          }
        }
      } else if (subCmd === 'checkout') {
        if (parts[2] === '-b') {
          const newB = parts[3];
          if (!newB) {
            outputLines = [{ type: 'err', text: 'fatal: branch name required' }];
          } else {
            setRepoState(prev => ({
              ...prev,
              branches: prev.branches.includes(newB) ? prev.branches : [...prev.branches, newB],
              currentBranch: newB
            }));
            outputLines = [{ type: 'out', text: `Switched to a new branch '${newB}'` }];
          }
        } else {
          const targetB = parts[2];
          if (!targetB) {
            outputLines = [{ type: 'err', text: 'fatal: branch name required' }];
          } else if (!repoState.branches.includes(targetB)) {
            outputLines = [{ type: 'err', text: `error: pathspec '${targetB}' did not match any file(s) known to git` }];
          } else {
            setRepoState(prev => ({
              ...prev,
              currentBranch: targetB
            }));
            outputLines = [{ type: 'out', text: `Switched to branch '${targetB}'` }];
          }
        }
      } else if (subCmd === 'merge') {
        const sourceB = parts[2];
        if (!sourceB) {
          outputLines = [{ type: 'err', text: 'fatal: branch name required' }];
        } else {
          outputLines = [
            { type: 'out', text: `Updating ${repoState.currentBranch}...` },
            { type: 'green', text: 'Fast-forward merge successful!' }
          ];
        }
      } else if (subCmd === 'remote') {
        if (parts[2] === 'add' && parts[3] === 'origin') {
          const url = parts[4] || 'https://github.com/developer/git-learn.git';
          setRepoState(prev => ({ ...prev, remoteUrl: url }));
          outputLines = [{ type: 'out', text: `Added remote origin ${url}` }];
        } else {
          outputLines = [{ type: 'out', text: `origin  ${repoState.remoteUrl || 'https://github.com/user/repo.git'} (fetch/push)` }];
        }
      } else if (subCmd === 'push') {
        outputLines = [
          { type: 'out', text: 'Enumerating objects: 5, done.' },
          { type: 'out', text: 'Writing objects: 100% (5/5), 450 bytes | 450.00 KiB/s, done.' },
          { type: 'green', text: `To ${repoState.remoteUrl || 'https://github.com/user/repo.git'}` },
          { type: 'green', text: ` * [new branch]      ${repoState.currentBranch} -> ${repoState.currentBranch}` }
        ];
      } else if (subCmd === 'pull') {
        outputLines = [
          { type: 'out', text: `From ${repoState.remoteUrl || 'https://github.com/user/repo.git'}` },
          { type: 'green', text: 'Already up to date.' }
        ];
      } else if (subCmd === 'log') {
        if (repoState.commits.length === 0) {
          outputLines = [{ type: 'err', text: 'fatal: your current branch does not have any commits yet' }];
        } else {
          outputLines = repoState.commits.map(c => ({
            type: 'highlight',
            text: `${c.hash} (${c.branch}) ${c.message}`
          }));
        }
      } else {
        outputLines = [{ type: 'err', text: `git: '${subCmd}' is not a valid git command. See 'help'.` }];
      }
    } else {
      outputLines = [{ type: 'err', text: `command not found: ${mainCmd}. Try "git status" or "help".` }];
    }

    setHistory([...newHistory, ...outputLines]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
      setHistoryIndex(nextIdx);
      setInput(commandHistory[commandHistory.length - 1 - nextIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[commandHistory.length - 1 - nextIdx] || '');
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  const handleCopyHistory = () => {
    const text = history.map(h => h.text).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const quickCommands = ['git status', 'git add .', 'git log', 'git branch', 'clear'];
  const branchName = repoState?.currentBranch || 'main';
  const promptText = `~/repo (${branchName}) $`;

  return (
    <>
      <style>{`
        .mac-term-wrapper {
          border-radius: 20px;
          overflow: hidden;
          margin-bottom: 28px;
          background-color: #0d1117;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(241,78,50,0.15);
        }
        .mac-term-header {
          padding: 12px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          background-color: #161b22;
          user-select: none;
        }
        .mac-dot {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: inline-block;
          transition: filter 0.2s;
          cursor: pointer;
        }
        .mac-dot:hover {
          filter: brightness(0.8);
        }
        .mac-dot.red { background: #ff5f56; }
        .mac-dot.yellow { background: #ffbd2e; }
        .mac-dot.green { background: #27c93f; }
        
        .mac-term-title-center {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          font-size: 13px;
          font-weight: 500;
          color: #8b949e;
          font-family: var(--font-mono, monospace);
        }
        
        @media (max-width: 600px) {
          .mac-term-title-center {
            display: none;
          }
        }
        
        .term-toolbar-btn {
          background: transparent;
          border: none;
          color: #8b949e;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 6px;
          border-radius: 6px;
          transition: all 0.2s ease;
        }
        .term-toolbar-btn:hover {
          background: rgba(255,255,255,0.1);
          color: #c9d1d9;
        }
        
        .mac-term-output {
          padding: 20px 24px;
          min-height: 260px;
          max-height: 400px;
          overflow-y: auto;
          font-family: var(--font-mono, 'Menlo', 'Monaco', 'Courier New', monospace);
          font-size: 14px;
          line-height: 1.8;
          cursor: text;
          background-color: #0d1117;
        }
        
        .quick-actions-bar {
          display: flex;
          gap: 10px;
          padding: 12px 24px;
          background: #0d1117;
          border-bottom: 1px solid rgba(255,255,255,0.05);
          overflow-x: auto;
          scrollbar-width: none;
        }
        .quick-actions-bar::-webkit-scrollbar {
          display: none;
        }
        .quick-action-pill {
          background: rgba(46, 160, 67, 0.1);
          border: 1px solid rgba(46, 160, 67, 0.4);
          color: #3fb950;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-family: var(--font-mono, monospace);
          cursor: pointer;
          white-space: nowrap;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .quick-action-pill:hover {
          background: rgba(46, 160, 67, 0.2);
          box-shadow: 0 0 10px rgba(46, 160, 67, 0.3);
        }
        
        .term-line {
          animation: term-fade-in 0.3s ease-out forwards;
          opacity: 0;
        }
        
        @keyframes term-fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .term-line-cmd {
          border-left: 3px solid var(--git-orange, #f14e32);
          padding-left: 12px;
          margin-left: -15px;
          margin-top: 8px;
          margin-bottom: 4px;
        }
        
        .blinking-cursor {
          display: inline-block;
          width: 8px;
          height: 15px;
          background-color: #8b949e;
          animation: blink 1s step-end infinite;
          vertical-align: middle;
          margin-left: 2px;
        }
        
        .blinking-dollar {
          animation: blink 1.5s step-end infinite;
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        
        .branch-pill {
          background: rgba(241, 78, 50, 0.15);
          color: #f14e32;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          border: 1px solid rgba(241, 78, 50, 0.3);
        }
      `}</style>
      
      <div className="mac-term-wrapper animate-fade-in">
        {/* Terminal Header */}
        <div className="mac-term-header" style={{ position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="mac-dot red"></div>
            <div className="mac-dot yellow"></div>
            <div className="mac-dot green"></div>
          </div>
          
          <div className="mac-term-title-center">
            bash — git simulator
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div className="branch-pill">
              <GitBranch size={12} />
              {branchName}
            </div>
            <button onClick={handleCopyHistory} className="term-toolbar-btn" title="Copy Console Log">
              {copied ? <Check size={16} color="#3fb950" /> : <Copy size={16} />}
            </button>
            <button onClick={() => setHistory([])} className="term-toolbar-btn" title="Clear Console">
              <RotateCcw size={16} />
            </button>
            {onResetRepo && (
              <button
                onClick={() => {
                  onResetRepo();
                  setHistory([
                    { type: 'comment', text: '# Repo reset — fresh working directory.' },
                    { type: 'out', text: 'Run "git status" to see untracked files. Try git add . then git commit!' }
                  ]);
                }}
                className="term-toolbar-btn"
                style={{ color: '#d29922' }}
                title="Reset repository to fresh state"
              >
                <Zap size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Quick Actions Bar */}
        <div className="quick-actions-bar">
          {quickCommands.map(cmd => (
            <button 
              key={cmd} 
              className="quick-action-pill"
              onClick={() => executeCommand(cmd)}
            >
              <TerminalIcon size={12} />
              {cmd}
            </button>
          ))}
        </div>

        {/* Terminal Output */}
        <div className="mac-term-output" onClick={() => inputRef.current?.focus()}>
          {history.map((item, idx) => {
            // Cap staggered animation to avoid performance issues
            const animDelay = `${Math.min(idx * 0.05, 1)}s`;
            
            if (item.type === 'cmd') {
              return (
                <div key={idx} className="term-line term-line-cmd" style={{ animationDelay: animDelay }}>
                  <span style={{ color: '#8b949e', marginRight: '8px' }}>~/repo ({branchName}) $</span>
                  <span style={{ color: '#3fb950', fontWeight: '500' }}>{item.text}</span>
                </div>
              );
            }
            
            let color = '#c9d1d9'; // default text / out
            let prefix = null;
            let style = {};
            
            if (item.type === 'comment') {
              color = '#6e7681';
              style = { fontStyle: 'italic' };
            } else if (item.type === 'err') {
              color = '#ff7b72';
              prefix = <span style={{ marginRight: '6px' }}>✗</span>;
            } else if (item.type === 'warn') {
              color = '#d29922';
            } else if (item.type === 'highlight') {
              color = '#00d2ff'; // cyan
            } else if (item.type === 'green') {
              color = '#27c93f';
            } else if (item.type === 'out') {
              color = '#ffffff';
            }

            return (
              <div key={idx} className="term-line" style={{ color, animationDelay: animDelay, wordBreak: 'break-all', ...style }}>
                {prefix}{item.text}
              </div>
            );
          })}

          {/* Input Line */}
          <div style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
            <span style={{ color: '#8b949e', marginRight: '8px', whiteSpace: 'nowrap' }}>
              ~/repo ({branchName}) <span className="blinking-dollar" style={{ color: 'var(--git-orange, #f14e32)', fontWeight: 'bold' }}>$</span>
            </span>
            <div style={{ position: 'relative', flex: 1, display: 'flex', alignItems: 'center' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#c9d1d9',
                  fontFamily: 'inherit',
                  fontSize: 'inherit',
                  width: '100%',
                  caretColor: 'transparent' // hide default caret, we use custom
                }}
                spellCheck="false"
                autoComplete="off"
              />
              {/* Custom Block Cursor positioned after text */}
              <span 
                style={{ 
                  position: 'absolute', 
                  left: `${input.length * 8.4}px`, // approximate monospace char width
                  pointerEvents: 'none'
                }}
              >
                <span className="blinking-cursor"></span>
              </span>
            </div>
          </div>
          <div ref={bottomRef} style={{ height: '20px' }} />
        </div>
      </div>
    </>
  );
}
