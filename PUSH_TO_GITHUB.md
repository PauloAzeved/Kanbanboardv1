# Push CFC Kanban Board to GitHub

## Your Repository Details
- **GitHub Username:** PauloAzeved
- **Repository Name:** Kanbanboard
- **Repository URL:** https://github.com/PauloAzeved/Kanbanboard

---

## Step-by-Step Instructions

### Step 1: Download Your Project
First, you need to get all these files onto your local computer. Since this is running in Figma Make, you'll need to:
- Copy all the code files to your computer
- Or export the project if Figma Make has that option

### Step 2: Open Terminal
- **Mac:** Open "Terminal" app
- **Windows:** Open "Git Bash" (download from https://git-scm.com if needed)
- **Linux:** Open your terminal

### Step 3: Navigate to Your Project
```bash
cd /path/to/your/project/folder
```
Replace `/path/to/your/project/folder` with where you saved the files.

Example:
```bash
cd ~/Desktop/cfc-kanban-board
```

### Step 4: Run These Commands (Copy & Paste!)

```bash
# Initialize git
git init

# Add all files
git add .

# Make your first commit
git commit -m "Initial commit: CFC Kanban Board with 3-level hierarchy"

# Add your GitHub repository
git remote add origin https://github.com/PauloAzeved/Kanbanboard.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

### Step 5: Enter Your GitHub Credentials
When prompted, enter your GitHub username and password (or personal access token).

### Step 6: Verify It Worked!
Go to: **https://github.com/PauloAzeved/Kanbanboard**

You should see all your files there! 🎉

---

## Important Files to Include

Make sure these files are in your project folder:

### 📁 Source Files
```
src/
├── app/
│   ├── App.tsx
│   └── components/
│       ├── KanbanBoard.tsx
│       ├── Header.tsx
│       ├── KanbanColumn.tsx
│       ├── TaskCard.tsx
│       ├── CreateTaskModal.tsx
│       ├── EditTaskModal.tsx
│       ├── CreateGoalProjectModal.tsx
│       ├── ManageGoalsProjectsModal.tsx
│       ├── GoalProjectSelector.tsx
│       └── TaskPreviewModal.tsx
├── utils/
│   └── seedData.ts
├── styles/
│   ├── theme.css
│   └── fonts.css
└── imports/
    ├── svg-baf0okhfln.tsx
    └── (image files)
```

### 📄 Config Files
- `package.json`
- `vite.config.ts`
- `postcss.config.mjs`
- `tsconfig.json`
- `.gitignore`
- `README.md`
- `index.html`

---

## Don't Forget Your Data! 💾

**BEFORE pushing to GitHub**, save your 50+ tasks:

1. Click the **hamburger menu** (☰) in the app header
2. Click **"Export Data"**
3. Save the JSON file as backup
4. You can keep this in a separate folder (don't commit it to GitHub if it has sensitive data)

---

## Quick Troubleshooting

### "git: command not found"
- Install Git from: https://git-scm.com

### "Permission denied"
- Use a Personal Access Token instead of password
- Create one at: https://github.com/settings/tokens

### "Repository already exists"
- Your repo is already created! Just push to it with the commands above

### "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/PauloAzeved/Kanbanboard.git
```

---

## Alternative: Upload via GitHub Web

If terminal feels complicated:

1. Go to https://github.com/PauloAzeved/Kanbanboard
2. Click "Add file" → "Upload files"
3. Drag and drop ALL your project files
4. Click "Commit changes"

**Note:** This method doesn't preserve git history, but it works!

---

## Need Help?

If you get stuck, let me know:
- What step are you on?
- What error message do you see?
- Screenshot if possible!
