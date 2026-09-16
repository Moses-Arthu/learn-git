Git from Scratch — Interactive Learning Guide

A self-contained, browser-based crash course for learning Git from zero to GitHub-ready.

What's Included

The guide covers 8 lessons with interactive quizzes, terminal examples, and visual diagrams:

#LessonTopics1What is Git?Version control concepts, Git vs GitHub2Setup & ConfigInstall Git, git config identity setup3Your First Repogit init, git clone, the .git folder4Staging & CommitsWorking directory → staging area → repository5BranchesCreating, switching, naming branches6Merging & Conflictsgit merge, resolving conflict markers7GitHub & Remotesgit remote, git push, git pull8Quick ReferenceFull command cheat sheet

How to Use


Open git-learn.html in any modern web browser — no installation needed.
Work through lessons in order using the Next → button.
Answer the quiz at the end of each lesson to check your understanding.
Use the Quick Reference (Lesson 8) as a cheat sheet anytime.


Key Git Concepts Covered

The Core Workflow

Edit files  →  git add .  →  git commit -m "message"  →  git push

Essential Commands

bash# Setup (one-time)
git config --global user.name "Your Name"
git config --global user.email "you@example.com"

# Start a repo
git init               # New repo
git clone <url>        # Copy existing repo

# Daily workflow
git status             # See what changed
git add .              # Stage all changes
git commit -m "..."    # Save a snapshot
git push               # Upload to GitHub
git pull               # Download from GitHub

# Branches
git checkout -b feature/name   # Create + switch
git merge feature/name         # Merge into current branch

Prerequisites


A computer with a terminal (Command Prompt, Terminal, or Git Bash)
A web browser (Chrome, Firefox, Edge, Safari)
No prior Git knowledge required


File

FileDescriptiongit-learn.htmlThe interactive lesson app (open this in your browser)README.mdThis file

Next Steps After Completing the Course


Practice — Create a real project folder and commit your first file
GitHub — Sign up at github.com and push your first repo
Learn more — Explore git rebase, git stash, and pull requests
Reference — Bookmark git-scm.com/docs for the full documentation



Built as a companion to the git/learn interactive HTML guide.
