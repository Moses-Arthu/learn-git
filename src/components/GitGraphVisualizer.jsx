import React from 'react';
import { GitCommit, GitBranch, FileCode, CheckCircle, ArrowRight, ShieldAlert, Layers } from 'lucide-react';

export function GitGraphVisualizer({ repoState }) {
  const { isInitialized, currentBranch, branches, commits, stagingArea, workingDirectory, remoteUrl } = repoState;

  return (
    <div className="neu-flat animate-fade-in" style={{ padding: '24px', borderRadius: '20px', marginBottom: '24px' }}>
      {/* Visualizer Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="neu-pressed" style={{ padding: '8px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <GitBranch size={16} color="var(--git-orange)" />
            <span style={{ fontSize: '13px', fontWeight: '700', fontFamily: 'var(--font-mono)' }}>
              HEAD &rarr; <span style={{ color: 'var(--git-orange)' }}>{currentBranch || 'uninitialized'}</span>
            </span>
          </div>

          {remoteUrl && (
            <div className="neu-badge neu-badge-cyan" style={{ fontSize: '11px' }}>
              origin: {remoteUrl}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {branches.map(b => (
            <span
              key={b}
              className={`neu-badge ${b === currentBranch ? 'neu-badge-orange' : 'neu-badge-green'}`}
              style={{ fontSize: '11px' }}
            >
              {b}
            </span>
          ))}
        </div>
      </div>

      {!isInitialized ? (
        <div className="neu-pressed" style={{ padding: '24px', textAlign: 'center', borderRadius: '14px', color: 'var(--text-muted)' }}>
          <ShieldAlert size={28} color="var(--yellow-accent)" style={{ marginBottom: '8px' }} />
          <p style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>Repository not initialized</p>
          <p style={{ fontSize: '12px' }}>Run <code>git init</code> in the interactive terminal below to start tracking changes.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Working Directory & Staging Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div className="neu-pressed" style={{ padding: '16px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FileCode size={14} color="var(--cyan-accent)" /> Working Directory
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {workingDirectory.length} files
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {workingDirectory.length === 0 ? (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Clean directory. No unstaged edits.</span>
                ) : (
                  workingDirectory.map((file, idx) => (
                    <div key={idx} style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', display: 'flex', justifyContent: 'space-between', color: file.status === 'untracked' ? 'var(--git-orange)' : 'var(--yellow-accent)' }}>
                      <span>{file.name}</span>
                      <span style={{ fontSize: '10px', textTransform: 'uppercase' }}>{file.status}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Staging Area */}
            <div className="neu-pressed" style={{ padding: '16px', borderRadius: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} color="var(--green-accent)" /> Staging Area (Index)
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  {stagingArea.length} staged
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {stagingArea.length === 0 ? (
                  <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>Staging area empty. Run <code>git add .</code> to stage.</span>
                ) : (
                  stagingArea.map((file, idx) => (
                    <div key={idx} style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', display: 'flex', justifyContent: 'space-between', color: 'var(--green-accent)' }}>
                      <span>✓ {file.name}</span>
                      <span style={{ fontSize: '10px' }}>STAGED</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Commit History Timeline Graph */}
          <div className="neu-pressed" style={{ padding: '16px', borderRadius: '14px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <GitCommit size={14} color="var(--purple-accent)" /> Commit History Graph
              </span>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                {commits.length} commits
              </span>
            </div>

            {commits.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px' }}>
                No commits recorded yet. Stage files and run <code>git commit -m "..."</code> to record a snapshot.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '200px', overflowY: 'auto', paddingRight: '4px' }}>
                {commits.slice().reverse().map((c, i) => (
                  <div key={c.hash} className="neu-flat" style={{ padding: '10px 14px', borderRadius: '12px', position: 'relative' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--git-orange)', fontFamily: 'var(--font-mono)' }}>
                        {c.hash}
                      </span>
                      <span style={{ fontSize: '10px', color: 'var(--purple-accent)', fontFamily: 'var(--font-mono)' }}>
                        [{c.branch}]
                      </span>
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      {c.message}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
