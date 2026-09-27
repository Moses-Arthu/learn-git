import React from 'react';
import { GitBranch, GitCommit, FileCode, CheckCircle, Layers, ArrowRight, Zap, Circle } from 'lucide-react';

export function GitGraphVisualizer({ repoState }) {
  if (!repoState) return null;

  const {
    isInitialized = false,
    currentBranch = 'main',
    branches = {},
    commits = [],
    stagingArea = [],
    workingDirectory = [],
    remoteUrl = ''
  } = repoState;

  // Helper to parse file lists consistently (handles array of strings or objects)
  const parseFiles = (files, defaultStatus = 'untracked') => {
    if (!files) return [];
    if (Array.isArray(files)) {
      return files.map(f => typeof f === 'string' ? { name: f, status: defaultStatus } : f);
    }
    return Object.entries(files).map(([name, data]) => ({ name, status: data?.status || defaultStatus }));
  };

  const wdFiles = parseFiles(workingDirectory, 'untracked');
  const stagedFiles = parseFiles(stagingArea, 'staged');

  // Status Color Helper
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'untracked': return '#F59E0B'; // Orange-Yellow
      case 'modified': return '#EAB308'; // Yellow
      case 'clean': return '#10B981'; // Green
      case 'staged': return '#10B981'; // Green
      case 'deleted': return '#EF4444'; // Red
      default: return '#9CA3AF'; // Gray
    }
  };

  return (
    <div className="git-visualizer-container" style={styles.container}>
      {/* Header Row */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <Layers size={18} color="#9CA3AF" />
          <span style={styles.headerTitle}>Git Repository</span>
        </div>
        <div style={styles.headerRight}>
          {Object.keys(branches || {}).map(branch => (
            <div key={branch} style={branch === currentBranch ? styles.activeBranchBadge : styles.branchBadge}>
              <GitBranch size={14} />
              <span>{branch}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HEAD Status */}
      <div style={styles.headStatusWrapper}>
        <div style={styles.headBadge}>
          <div className="animate-pulse-dot" style={styles.pulsingDot}></div>
          <span style={styles.headText}>HEAD</span>
          <ArrowRight size={14} color="#F14E32" />
          <span style={styles.headBranchText}>{currentBranch}</span>
        </div>
        {remoteUrl && (
          <div style={styles.remoteUrlBadge}>
            <Zap size={14} color="#8B5CF6" />
            <span>{remoteUrl}</span>
          </div>
        )}
      </div>

      {!isInitialized ? (
        <div style={styles.emptyState}>
          <GitCommit size={32} color="#4B5563" style={{ marginBottom: '12px' }} />
          <h3 style={{ margin: 0, color: '#E5E7EB', fontSize: '1.1rem' }}>Repository not initialized</h3>
          <p style={{ margin: '8px 0 0', color: '#9CA3AF', fontSize: '0.9rem' }}>Run <code style={styles.codeSnippet}>git init</code> to start</p>
        </div>
      ) : (
        <>
          {/* Working Directory & Staging Area */}
          <div style={styles.workspaceSection}>
            {/* Working Directory */}
            <div style={styles.workspaceCard}>
              <h4 style={styles.cardTitle}>Working Directory</h4>
              {wdFiles.length === 0 ? (
                <div style={styles.emptyFiles}>Clean working tree</div>
              ) : (
                <div style={styles.fileList}>
                  {wdFiles.map((file, i) => (
                    <div key={i} style={{ ...styles.fileItem, borderLeft: `3px solid ${getStatusColor(file.status)}` }}>
                      <FileCode size={16} color={getStatusColor(file.status)} />
                      <span style={styles.fileName}>{file.name}</span>
                      <span style={{ ...styles.fileStatus, color: getStatusColor(file.status) }}>{file.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Animation Arrow */}
            <div style={styles.arrowSection}>
              <div className="animate-flow-right" style={styles.animatedArrow}>
                <ArrowRight size={24} color="#10B981" />
              </div>
              <span style={styles.hintText}>git add</span>
            </div>

            {/* Staging Area */}
            <div style={{ ...styles.workspaceCard, borderLeft: '3px solid #10B981', boxShadow: '-4px 0 15px rgba(16, 185, 129, 0.1)' }}>
              <h4 style={styles.cardTitle}>Staging Area</h4>
              {stagedFiles.length === 0 ? (
                <div style={styles.emptyFiles}>Nothing staged</div>
              ) : (
                <div style={styles.fileList}>
                  {stagedFiles.map((file, i) => (
                    <div key={i} style={{ ...styles.fileItem, background: 'rgba(16, 185, 129, 0.05)' }}>
                      <CheckCircle size={16} color="#10B981" />
                      <span style={{ ...styles.fileName, color: '#10B981' }}>{file.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Commit History */}
          <div style={styles.historySection}>
            <h4 style={styles.historyTitle}>Commit History</h4>
            {commits.length === 0 ? (
              <div style={styles.emptyHistoryBox}>
                <GitCommit size={28} color="#6B7280" />
                <p style={{ margin: '8px 0 4px', color: '#D1D5DB', fontWeight: '500' }}>No commits yet</p>
                <span style={{ fontSize: '0.85rem', color: '#9CA3AF' }}>Stage files and run `git commit`</span>
              </div>
            ) : (
              <div style={styles.timelineContainer}>
                <div style={styles.timelineLine}></div>
                {commits.map((commit, index) => {
                  // Find branches pointing to this commit
                  const commitBranches = Object.entries(branches || {})
                    .filter(([_, hash]) => hash === commit.hash)
                    .map(([name]) => name);

                  return (
                    <div key={commit.hash} className="animate-slide-up" style={{ ...styles.commitNode, animationDelay: `${index * 0.1}s` }}>
                      <div style={styles.timelineDot}></div>
                      <div style={styles.commitCard}>
                        <div style={styles.commitHeader}>
                          <span style={styles.commitHash}>{commit.hash?.substring(0, 7) || 'unknown'}</span>
                          {commitBranches.map(b => (
                            <span key={b} style={styles.commitBranchBadge}>
                              <GitBranch size={12} /> {b}
                            </span>
                          ))}
                        </div>
                        <p style={styles.commitMessage}>{commit.message}</p>
                        {commit.timestamp && (
                          <span style={styles.commitTime}>{new Date(commit.timestamp).toLocaleTimeString()}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* Component-Scoped CSS-in-JS Animations */}
      <style>{`
        .git-visualizer-container * {
          box-sizing: border-box;
        }
        @keyframes pulse-dot {
          0% { opacity: 0.4; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.3); box-shadow: 0 0 10px rgba(16, 185, 129, 0.8); }
          100% { opacity: 0.4; transform: scale(0.8); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes flow-right {
          0% { transform: translateX(-10px); opacity: 0; }
          50% { transform: translateX(5px); opacity: 1; }
          100% { transform: translateX(20px); opacity: 0; }
        }
        .animate-pulse-dot {
          animation: pulse-dot 2s infinite ease-in-out;
        }
        .animate-slide-up {
          opacity: 0;
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-flow-right {
          animation: flow-right 1.5s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}

// Inline Styles
const styles = {
  container: {
    width: '100%',
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderTop: '3px solid #F14E32',
    borderRight: '1px solid rgba(255,255,255,0.05)',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    borderLeft: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '24px',
    padding: '24px',
    color: '#E5E7EB',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    paddingBottom: '16px'
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  headerTitle: {
    fontSize: '0.85rem',
    fontWeight: '700',
    letterSpacing: '1px',
    color: '#9CA3AF',
    textTransform: 'uppercase'
  },
  headerRight: {
    display: 'flex',
    gap: '8px'
  },
  branchBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(255,255,255,0.05)',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '0.75rem',
    color: '#9CA3AF'
  },
  activeBranchBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(241, 78, 50, 0.15)',
    border: '1px solid rgba(241, 78, 50, 0.3)',
    padding: '4px 10px',
    borderRadius: '999px',
    fontSize: '0.75rem',
    color: '#F14E32',
    fontWeight: '600'
  },
  headStatusWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  headBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(0,0,0,0.4)',
    padding: '8px 16px',
    borderRadius: '999px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
  },
  pulsingDot: {
    width: '8px',
    height: '8px',
    backgroundColor: '#10B981',
    borderRadius: '50%'
  },
  headText: {
    fontFamily: 'monospace',
    color: '#F14E32',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  headBranchText: {
    fontFamily: 'monospace',
    color: '#E5E7EB',
    fontSize: '0.9rem'
  },
  remoteUrlBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '0.8rem',
    color: '#A78BFA',
    background: 'rgba(139, 92, 246, 0.1)',
    padding: '6px 12px',
    borderRadius: '12px'
  },
  workspaceSection: {
    display: 'flex',
    alignItems: 'stretch',
    gap: '16px'
  },
  workspaceCard: {
    flex: 1,
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column'
  },
  cardTitle: {
    margin: '0 0 16px 0',
    fontSize: '0.85rem',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  fileList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px'
  },
  fileItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'rgba(0,0,0,0.2)',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '0.85rem'
  },
  fileName: {
    flex: 1,
    fontFamily: 'monospace',
    color: '#D1D5DB'
  },
  fileStatus: {
    fontSize: '0.7rem',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  emptyFiles: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#6B7280',
    fontSize: '0.9rem',
    fontStyle: 'italic',
    padding: '24px 0'
  },
  arrowSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '40px',
    gap: '4px'
  },
  animatedArrow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  hintText: {
    fontSize: '0.65rem',
    color: '#10B981',
    fontFamily: 'monospace',
    opacity: 0.8
  },
  historySection: {
    marginTop: '12px',
    display: 'flex',
    flexDirection: 'column'
  },
  historyTitle: {
    margin: '0 0 16px 0',
    fontSize: '0.85rem',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  emptyHistoryBox: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    border: '2px dashed rgba(255,255,255,0.1)',
    borderRadius: '16px',
    padding: '40px 20px',
    background: 'rgba(255,255,255,0.01)'
  },
  timelineContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingLeft: '16px'
  },
  timelineLine: {
    position: 'absolute',
    left: '21px',
    top: '8px',
    bottom: '8px',
    width: '2px',
    background: 'linear-gradient(to bottom, #F14E32 0%, rgba(241, 78, 50, 0.1) 100%)',
    borderRadius: '2px'
  },
  commitNode: {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '20px',
    zIndex: 1
  },
  timelineDot: {
    width: '12px',
    height: '12px',
    backgroundColor: '#0F1115',
    border: '3px solid #F14E32',
    borderRadius: '50%',
    marginTop: '16px',
    flexShrink: 0,
    boxShadow: '0 0 10px rgba(241, 78, 50, 0.5)'
  },
  commitCard: {
    flex: 1,
    background: 'rgba(0,0,0,0.3)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '12px',
    padding: '12px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  commitHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap'
  },
  commitHash: {
    fontFamily: 'monospace',
    color: '#F14E32',
    fontSize: '0.9rem',
    fontWeight: 'bold'
  },
  commitBranchBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(139, 92, 246, 0.2)',
    color: '#C4B5FD',
    fontSize: '0.7rem',
    padding: '2px 8px',
    borderRadius: '6px',
    border: '1px solid rgba(139, 92, 246, 0.3)'
  },
  commitMessage: {
    margin: 0,
    fontSize: '0.9rem',
    color: '#E5E7EB',
    lineHeight: '1.4'
  },
  commitTime: {
    fontSize: '0.75rem',
    color: '#6B7280'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 20px',
    background: 'rgba(0,0,0,0.2)',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  codeSnippet: {
    background: 'rgba(255,255,255,0.1)',
    padding: '2px 6px',
    borderRadius: '4px',
    fontFamily: 'monospace',
    color: '#D1D5DB'
  }
};
