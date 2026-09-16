export const LESSONS = [
  {
    id: 0,
    title: "What is Git?",
    category: "Foundations",
    eyebrow: "LESSON 01 · FOUNDATIONS",
    summary: "Git is a distributed version control system that tracks every change made to your code, allowing you to time-travel, experiment safely, and collaborate with teams.",
    analogy: "Think of Git like video game save checkpoints or Google Docs' version history for your entire code folder. Every time you commit, Git creates a permanent snapshot you can return to at any time.",
    concepts: [
      {
        icon: "History",
        title: "Time Travel",
        description: "Broke something that was working? Git lets you instantly rollback or inspect your project at any point in history."
      },
      {
        icon: "GitBranch",
        title: "Parallel Branching",
        description: "Work on new features or risky experiments without touching the working production version of your code."
      },
      {
        icon: "Users",
        title: "Seamless Collaboration",
        description: "Multiple developers can work on the same codebase simultaneously without overwriting each other's work."
      }
    ],
    gitVsGithub: [
      { tool: "Git", role: "Local CLI tool on your computer tracking file history in .git folder." },
      { tool: "GitHub", role: "Cloud platform hosting Git repos online for backup, pull requests & team code review." },
      { tool: "GitLab / Bitbucket", role: "Alternative cloud hosting services built on top of Git." }
    ],
    interactiveSteps: [
      { label: "Check Git status", command: "git status", hint: "See the current state of your repository" }
    ],
    quiz: {
      id: "q0",
      question: "Which statement best describes the primary purpose of Git?",
      options: [
        { text: "A cloud website where developers host their code portfolios online", isCorrect: false },
        { text: "A local version control system that tracks file changes over time", isCorrect: true },
        { text: "A text editor tailored for writing HTML and JavaScript", isCorrect: false },
        { text: "A programming language used for database management", isCorrect: false }
      ],
      explanation: "Git is the local version control command-line tool. GitHub is the website that stores Git repositories online!"
    }
  },
  {
    id: 1,
    title: "Setup & Configuration",
    category: "Foundations",
    eyebrow: "LESSON 02 · FOUNDATIONS",
    summary: "Before making your first commit, tell Git who you are. Git attaches your name and email address to every snapshot you create.",
    analogy: "Setting up Git configuration is like stamping your digital signature on a passport. Every commit stamp includes your identity.",
    terminalExamples: [
      {
        title: "1. Check your Git version",
        code: "git --version\n# Expected output: git version 2.43.0"
      },
      {
        title: "2. Set your identity (One-time global setup)",
        code: 'git config --global user.name "Your Name"\ngit config --global user.email "you@example.com"'
      },
      {
        title: "3. Verify active configuration settings",
        code: "git config --list\n# Output:\n# user.name=Your Name\n# user.email=you@example.com"
      }
    ],
    concepts: [
      {
        icon: "Globe",
        title: "What does --global mean?",
        description: "The --global flag sets your user info for all repos on your computer. Omit it if you want different credentials for a specific work project."
      }
    ],
    interactiveSteps: [
      { label: "Configure Name", command: 'git config --global user.name "Developer"', hint: "Set global identity name" },
      { label: "Verify Config", command: "git config --list", hint: "View global Git configuration settings" }
    ],
    quiz: {
      id: "q1",
      question: "What is the main purpose of running `git config --global user.name`?",
      options: [
        { text: "To register a username for logging into GitHub.com", isCorrect: false },
        { text: "To attach your author name to every commit snapshot you record", isCorrect: true },
        { text: "To create a brand new repository folder", isCorrect: false },
        { text: "To download the Git installation installer", isCorrect: false }
      ],
      explanation: "Git attaches your global user.name and user.email to every commit snapshot as the commit author."
    }
  },
  {
    id: 2,
    title: "Your First Repository",
    category: "Foundations",
    eyebrow: "LESSON 03 · FOUNDATIONS",
    summary: "A repository (repo) is a project folder monitored by Git. You can create a new repo using `git init` or download an existing one with `git clone`.",
    analogy: "Running `git init` is like mounting a high-definition security camera inside your folder. From that instant forward, Git monitors all file creations, edits, and deletions.",
    terminalExamples: [
      {
        title: "Creating a fresh local repository",
        code: "mkdir my-cool-app\ncd my-cool-app\ngit init\n# Initialized empty Git repository in /my-cool-app/.git/"
      },
      {
        title: "Cloning an existing repository from GitHub",
        code: "git clone https://github.com/facebook/react.git\n# Downloading files and complete commit history..."
      }
    ],
    concepts: [
      {
        icon: "FolderGit2",
        title: "The hidden .git folder",
        description: "When you run git init, Git generates a hidden .git directory containing all history, objects, and refs. Never delete this folder unless you want to erase version history!"
      }
    ],
    interactiveSteps: [
      { label: "Initialize Repo", command: "git init", hint: "Turn the current directory into a Git repo" },
      { label: "Check Repo Status", command: "git status", hint: "Inspect current working directory status" }
    ],
    quiz: {
      id: "q2",
      question: "You have an existing project folder on your computer. Which command initializes Git tracking inside it?",
      options: [
        { text: "git create", isCorrect: false },
        { text: "git start", isCorrect: false },
        { text: "git init", isCorrect: true },
        { text: "git new-repo", isCorrect: false }
      ],
      explanation: "`git init` creates the hidden .git metadata folder and starts tracking changes in your project."
    }
  },
  {
    id: 3,
    title: "Staging & Commits",
    category: "Foundations",
    eyebrow: "LESSON 04 · FOUNDATIONS",
    summary: "Git uses a two-step save system: first you stage changed files using `git add`, then you lock in a snapshot using `git commit`.",
    analogy: "Imagine packing a cardboard box to ship. Your edited files live in your working directory. Adding files (`git add .`) places them in the staging box. Committing (`git commit -m '...'`) seals the box with a label and places it on the shelf.",
    workflowDiagram: [
      { step: "Working Directory", detail: "Modified / Untracked files" },
      { step: "git add .", detail: "Staging Area (Index)" },
      { step: "git commit -m '...'", detail: "Repository History (Commits)" }
    ],
    terminalExamples: [
      {
        title: "The standard daily git workflow",
        code: `# 1. Create a file\necho "console.log('Hello');" > app.js\n\n# 2. Check status\ngit status\n# Untracked files: app.js\n\n# 3. Stage file(s)\ngit add app.js   # or git add .\n\n# 4. Commit snapshot\ngit commit -m "Add core app logic"\n\n# 5. View history log\ngit log --oneline`
      }
    ],
    concepts: [
      {
        icon: "CheckCircle2",
        title: "Writing Great Commit Messages",
        description: "Use imperative present tense (e.g. 'Add user authentication' instead of 'Added auth'). Keep summary lines concise (under 50-72 chars)."
      }
    ],
    interactiveSteps: [
      { label: "Stage All Files", command: "git add .", hint: "Move modified/untracked files to Staging Area" },
      { label: "Commit Snapshot", command: 'git commit -m "Add homepage component"', hint: "Create permanent commit snapshot" },
      { label: "View Commit Log", command: "git log", hint: "Show recent commit history" }
    ],
    quiz: {
      id: "q3",
      question: "What does the command `git add .` do?",
      options: [
        { text: "Saves a permanent snapshot of changes into the repository log", isCorrect: false },
        { text: "Stages all new and modified files in the directory for the next commit", isCorrect: true },
        { text: "Uploads your code directly to GitHub servers", isCorrect: false },
        { text: "Creates a new feature branch", isCorrect: false }
      ],
      explanation: "`git add .` stages all pending changes in the current directory, preparing them to be committed."
    }
  },
  {
    id: 4,
    title: "Branches",
    category: "Branching",
    eyebrow: "LESSON 05 · BRANCHING",
    summary: "Branches enable you to isolate new features, experiments, or bug fixes from the main code line. You can switch between branches instantly.",
    analogy: "Imagine your main codebase is a trunk of a tree (`main`). When building a feature, you grow a separate branch. You can tweak the branch freely without risking the stability of the trunk.",
    terminalExamples: [
      {
        title: "Listing, creating, and switching branches",
        code: `# List active branches (* indicates active branch)\ngit branch\n\n# Create a feature branch\ngit branch feature/dark-mode\n\n# Switch to the new branch\ngit checkout feature/dark-mode\n\n# Modern shortcut: Create & switch in one command!\ngit checkout -b feature/dark-mode`
      }
    ],
    concepts: [
      {
        icon: "Tag",
        title: "Clean Branch Naming Conventions",
        description: "feature/user-profile (new feature), fix/nav-bug (bug fix), hotfix/auth-crash (urgent patch), main (stable production code)."
      }
    ],
    interactiveSteps: [
      { label: "Create & Switch Branch", command: "git checkout -b feature/neumorphism", hint: "Create branch & checkout" },
      { label: "List All Branches", command: "git branch", hint: "View available local branches" },
      { label: "Switch to main", command: "git checkout main", hint: "Return to default main branch" }
    ],
    quiz: {
      id: "q4",
      question: "Which command creates a new branch named `fix/header` AND switches to it immediately?",
      options: [
        { text: "git branch fix/header --switch", isCorrect: false },
        { text: "git checkout -b fix/header", isCorrect: true },
        { text: "git new -b fix/header", isCorrect: false },
        { text: "git switch-create fix/header", isCorrect: false }
      ],
      explanation: "`git checkout -b <branch>` (or modern `git switch -c <branch>`) creates and checks out the branch in a single step."
    }
  },
  {
    id: 5,
    title: "Merging & Conflicts",
    category: "Branching",
    eyebrow: "LESSON 06 · BRANCHING",
    summary: "Once your branch feature is tested and complete, merge it back into `main`. If Git encounters opposing edits on identical lines, it raises a merge conflict.",
    analogy: "Merging is like combining two streams of work. If both streams edited different files, Git merges automatically. If both edited line 10 of index.html, Git pauses and asks you to choose the winner.",
    terminalExamples: [
      {
        title: "Merging a feature branch into main",
        code: `# 1. Switch to the target destination branch\ngit checkout main\n\n# 2. Execute merge\ngit merge feature/dark-mode\n# Output: Fast-forward or Merge commit created!\n\n# 3. Clean up deleted branch\ngit branch -d feature/dark-mode`
      },
      {
        title: "Resolving a Merge Conflict marker in a file",
        code: `<<<<<<< HEAD (main)\n<button class="btn-blue">Click Me</button>\n=======\n<button class="btn-orange">Click Me</button>\n>>>>>>> feature/dark-mode\n\n# To resolve: Keep desired code, remove markers, then stage & commit:\ngit add index.html\ngit commit -m "Resolve merge conflict in button theme"`
      }
    ],
    concepts: [
      {
        icon: "AlertTriangle",
        title: "Don't Panic on Conflicts!",
        description: "Merge conflicts are normal in team software development. Git marks the exact lines between <<<<<<< and >>>>>>>. Choose the correct version and commit."
      }
    ],
    interactiveSteps: [
      { label: "Merge Feature Branch", command: "git merge feature/neumorphism", hint: "Merge feature branch into current branch" },
      { label: "Delete Branch", command: "git branch -d feature/neumorphism", hint: "Delete completed feature branch" }
    ],
    quiz: {
      id: "q5",
      question: "You are currently on branch `main` and want to bring in changes from `feature/search`. What command do you run?",
      options: [
        { text: "git merge main", isCorrect: false },
        { text: "git merge feature/search", isCorrect: true },
        { text: "git pull feature/search", isCorrect: false },
        { text: "git checkout feature/search --into main", isCorrect: false }
      ],
      explanation: "You must first be standing on the destination branch (`main`), then run `git merge feature/search`."
    }
  },
  {
    id: 6,
    title: "GitHub & Remotes",
    category: "Remote",
    eyebrow: "LESSON 07 · REMOTE",
    summary: "Remotes are online repository copies (like GitHub). You `push` to upload your local commits and `pull` to download remote updates.",
    analogy: "Local Git repo = your offline notebook on your desk. Remote GitHub repo = the shared cloud document stored on Google Drive.",
    terminalExamples: [
      {
        title: "Connecting a local repo to GitHub & pushing",
        code: `# 1. Add remote link (nickname 'origin')\ngit remote add origin https://github.com/youruser/app.git\n\n# 2. Push for first time & set upstream tracking\ngit push -u origin main\n\n# 3. Standard future push & pull\ngit push\ngit pull`
      }
    ],
    concepts: [
      {
        icon: "Cloud",
        title: "What is 'origin'?",
        description: "origin is the default nickname Git gives to the remote server URL. You can view all linked remotes with 'git remote -v'."
      }
    ],
    interactiveSteps: [
      { label: "Add Remote", command: "git remote add origin https://github.com/user/repo.git", hint: "Link local repo to remote URL" },
      { label: "Push to Remote", command: "git push -u origin main", hint: "Upload commits to remote main branch" },
      { label: "Pull Latest Changes", command: "git pull", hint: "Download & merge updates from remote" }
    ],
    quiz: {
      id: "q6",
      question: "After making local commits, which command uploads them up to your GitHub repository?",
      options: [
        { text: "git upload", isCorrect: false },
        { text: "git sync", isCorrect: false },
        { text: "git push", isCorrect: true },
        { text: "git publish", isCorrect: false }
      ],
      explanation: "`git push` sends local branch commits to your remote repository (e.g. GitHub)."
    }
  },
  {
    id: 7,
    title: "Quick Reference & Cheatsheet",
    category: "Reference",
    eyebrow: "LESSON 08 · REFERENCE",
    summary: "Master reference guide containing essential Git commands, workflow cheat sheet, and interactive sandbox playground.",
    analogy: "Your developer Swiss Army knife — reference this whenever you need to check command parameters, undo mistakes, or view branch syntax.",
    isReferenceLesson: true,
    quiz: {
      id: "q7",
      question: "Which command temporarily stashes your uncommitted changes so you can work on a clean workspace?",
      options: [
        { text: "git pause", isCorrect: false },
        { text: "git stash", isCorrect: true },
        { text: "git hide", isCorrect: false },
        { text: "git save-draft", isCorrect: false }
      ],
      explanation: "`git stash` temporarily shelves (or stashes) changes you've made to your working copy so you can work on something else."
    }
  }
];

export const BADGES = [
  { id: "foundations", name: "Git Novice", desc: "Completed Foundations lessons", icon: "Award", minScore: 1 },
  { id: "branch_master", name: "Branch Master", desc: "Mastered branching & checkout", icon: "GitBranch", minScore: 3 },
  { id: "conflict_slayer", name: "Conflict Conqueror", desc: "Learned merge conflict resolution", icon: "ShieldCheck", minScore: 5 },
  { id: "github_hero", name: "GitHub Hero", desc: "Pushed code & pulled remotes", icon: "Zap", minScore: 7 }
];
