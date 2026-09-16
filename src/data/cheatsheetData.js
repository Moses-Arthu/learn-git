export const CHEATSHEET = [
  {
    category: "Configuration",
    commands: [
      { cmd: 'git config --global user.name "Your Name"', desc: "Sets your display author name globally for all repositories." },
      { cmd: 'git config --global user.email "you@domain.com"', desc: "Sets your author email address globally." },
      { cmd: "git config --list", desc: "Displays all current configuration keys and values." }
    ]
  },
  {
    category: "Repository Setup",
    commands: [
      { cmd: "git init", desc: "Initializes a new Git repository in the current directory." },
      { cmd: "git clone <url>", desc: "Downloads a full copy of a remote repo and its entire commit history." },
      { cmd: "git status", desc: "Shows working directory & staging area status (untracked, modified, staged files)." },
      { cmd: "git log --oneline", desc: "Lists compact commit history with abbreviated hashes and commit messages." }
    ]
  },
  {
    category: "Staging & Committing",
    commands: [
      { cmd: "git add <filename>", desc: "Stages a specific file for the next commit." },
      { cmd: "git add .", desc: "Stages all modified and untracked files in the current folder." },
      { cmd: 'git commit -m "message"', desc: "Commits staged snapshot with a descriptive commit message." },
      { cmd: "git diff", desc: "Shows line-by-line differences between working tree and staging area." }
    ]
  },
  {
    category: "Branching & Merging",
    commands: [
      { cmd: "git branch", desc: "Lists all local branches. Active branch is marked with an asterisk (*)." },
      { cmd: "git checkout -b <branch>", desc: "Creates a new branch and immediately switches to it." },
      { cmd: "git checkout <branch>", desc: "Switches workspace to an existing target branch." },
      { cmd: "git merge <branch>", desc: "Merges specified branch changes into current active branch." },
      { cmd: "git branch -d <branch>", desc: "Deletes a specified local branch (if already merged)." }
    ]
  },
  {
    category: "Remote Repositories",
    commands: [
      { cmd: "git remote add origin <url>", desc: "Connects local repository to a remote GitHub URL." },
      { cmd: "git push -u origin main", desc: "Pushes local main branch to remote server and sets upstream tracking." },
      { cmd: "git push", desc: "Uploads local branch commits to the remote repository." },
      { cmd: "git pull", desc: "Fetches changes from remote repository and merges them into current branch." }
    ]
  },
  {
    category: "Undoing & Restoring",
    commands: [
      { cmd: "git restore <file>", desc: "Discards uncommitted local changes to a file in working directory." },
      { cmd: "git reset HEAD~1", desc: "Undoes latest commit while keeping file edits in working directory." },
      { cmd: "git revert <commit-hash>", desc: "Creates a new commit that safely reverses changes of a past commit." },
      { cmd: "git stash", desc: "Stashes uncommitted changes into a temporary stack." },
      { cmd: "git stash pop", desc: "Applies stashed changes back into working directory." }
    ]
  }
];
