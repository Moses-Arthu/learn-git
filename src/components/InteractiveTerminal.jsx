import React, { useState, useRef, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, HelpCircle, Check, Copy } from 'lucide-react';

export function InteractiveTerminal({ repoState, setRepoState, externalCommand, onCommandExecuted, onResetRepo }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState([
    { type: 'comment', text: '# Interactive Neumorphic Git Terminal Simulator' },
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

  return (
    <div className="neu-flat animate-fade-in" style={{ borderRadius: '20px', overflow: 'hidden', marginBottom: '28px' }}>
      {/* Terminal Title Bar */}
      <div style={{
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border-dark)',
        background: 'rgba(0,0,0,0.15)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ff5f56' }}></div>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ffbd2e' }}></div>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#27c93f' }}></div>
          <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginLeft: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <TerminalIcon size={14} color="var(--git-orange)" /> bash — version-control-simulator
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button onClick={handleCopyHistory} className="neu-btn neu-icon-btn" style={{ width: '30px', height: '30px' }} title="Copy Console Log">
            {copied ? <Check size={14} color="var(--green-accent)" /> : <Copy size={14} />}
          </button>
          <button onClick={() => setHistory([])} className="neu-btn neu-icon-btn" style={{ width: '30px', height: '30px' }} title="Clear Console">
            <RotateCcw size={14} />
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
              className="neu-btn"
              style={{ fontSize: '11px', padding: '4px 10px', color: 'var(--yellow-accent)', borderRadius: '8px' }}
              title="Reset repository to fresh state"
            >
              Reset Repo
            </button>
          )}
        </div>
      </div>

      {/* Terminal Console Output */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="neu-pressed-deep"
        style={{
          padding: '20px',
          minHeight: '220px',
          maxHeight: '340px',
          overflowY: 'auto',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          lineHeight: '1.7',
          cursor: 'text'
        }}
      >
        {history.map((item, idx) => {
          let color = 'var(--text-primary)';
          if (item.type === 'comment') color = 'var(--text-muted)';
          else if (item.type === 'cmd') color = 'var(--green-accent)';
          else if (item.type === 'err') color = 'var(--red-accent)';
          else if (item.type === 'warn') color = 'var(--yellow-accent)';
          else if (item.type === 'highlight') color = 'var(--cyan-accent)';
          else if (item.type === 'green') color = 'var(--green-accent)';

          return (
            <div key={idx} style={{ color, wordBreak: 'break-all' }}>
              {item.type === 'cmd' ? `$ ${item.text}` : item.text}
            </div>
          );
        })}

        {/* Live Prompt Input Line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
          <span style={{ color: 'var(--git-orange)', fontWeight: '700' }}>$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command (e.g. git status, git init)..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'var(--text-primary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              width: '100%'
            }}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
