# Deploy to GitHub Pages - Web Interface Guide

This guide will help you deploy your DBMS Notes website to GitHub Pages using only the GitHub web interface (no command line needed).

## Step 1: Create/Prepare Your GitHub Repository

### If you don't have a repository yet:

1. **Go to GitHub.com** and sign in
2. **Click the "+" icon** in the top right corner
3. **Select "New repository"**
4. **Repository settings:**
   - **Name:** `DBMS_Notes` (or any name you prefer)
   - **Description:** "Comprehensive DBMS Notes with Interactive Frontend"
   - **Visibility:** Public (required for free GitHub Pages)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. **Click "Create repository"**

### If you already have a repository:

1. **Go to your repository** on GitHub
2. Make sure it's set to **Public** (Settings → Change visibility → Make public)

---

## Step 2: Upload Files to GitHub

### Option A: Upload Individual Files (Recommended for first time)

1. **Go to your repository** on GitHub
2. **Click "Add file"** → **"Upload files"**
3. **Drag and drop or select** these files one by one:

#### Root Directory Files:
- `index.html`
- `styles.css`
- `app.js`
- `README.md`
- `DEPLOYMENT.md`
- `START_LOCAL_SERVER.md`
- `DEPLOY_GITHUB_WEB.md`
- `.gitignore`
- `_config.yml`

#### Notes Directory:
- Create the `notes` folder first:
  - Click "Add file" → "Create new file"
  - Type `notes/README.md` as the filename
  - Add some content (or leave empty)
  - Click "Commit new file"

4. **Upload all markdown files** from your `notes/` folder:
   - `notes/01_ACID_Properties_Introduction.md`
   - `notes/02_What_is_a_Transaction.md`
   - `notes/03_Atomicity.md`
   - `notes/04_Isolation.md`
   - `notes/05_Consistency.md`
   - `notes/06_Durability.md`
   - `notes/07_ACID_Properties_Hands_On.md`
   - `notes/08_Phantom_Reads.md`
   - `notes/09_Serializable_vs_Repeatable_Read.md`
   - `notes/10_Eventual_Consistency.md`
   - `notes/11_Tables_and_Indexes_Storage.md`
   - `notes/12_Row_vs_Column_Storage.md`
   - `notes/13_Primary_Key_vs_Secondary_Key.md`
   - `notes/14_Database_Pages.md`
   - `notes/15_Create_Postgres_Table_with_Million_Rows.md`
   - `notes/16_Getting_Started_with_Indexing.md`
   - `notes/17_SQL_Query_Planner_and_Optimizer_Explain.md`

5. **For each upload:**
   - Drag files or click "choose your files"
   - Scroll down to "Commit changes"
   - **Commit message:** "Add [filename]" or "Initial commit"
   - **Click "Commit changes"**

### Option B: Upload Multiple Files at Once

1. **Click "Add file"** → **"Upload files"**
2. **Select multiple files** (hold Ctrl/Cmd to select multiple)
3. **Drag all files** from your local folder
4. **Commit message:** "Add website files"
5. **Click "Commit changes"**

---

## Step 3: Create .github/workflows Directory (If Needed)

If the `.github/workflows/deploy.yml` file doesn't exist:

1. **Click "Add file"** → **"Create new file"**
2. **Type:** `.github/workflows/deploy.yml`
3. **Copy and paste** the content from the `deploy.yml` file (if you have it)
4. **Click "Commit new file"**

**Note:** This is optional - GitHub Pages can work without it.

---

## Step 4: Enable GitHub Pages

1. **Go to your repository** on GitHub
2. **Click "Settings"** (top menu bar)
3. **Scroll down** to find **"Pages"** in the left sidebar
4. **Under "Source":**
   - Select **"Deploy from a branch"**
   - **Branch:** `main` (or `master` if that's your default)
   - **Folder:** `/ (root)`
5. **Click "Save"**

---

## Step 5: Wait for Deployment

1. **GitHub will start building** your site (takes 1-2 minutes)
2. **You'll see a message** like: "Your site is live at https://yourusername.github.io/DBMS_Notes/"
3. **Refresh the page** after a minute to see the deployment status

---

## Step 6: Access Your Website

Your website will be available at:
```
https://yourusername.github.io/DBMS_Notes/
```

**Replace `yourusername`** with your actual GitHub username.

---

## Step 7: Update README with Your URL

1. **Go to your repository** on GitHub
2. **Click on `README.md`**
3. **Click the pencil icon** (Edit this file)
4. **Find the line** that says:
   ```markdown
   Visit the live website: **[https://yourusername.github.io/DBMS_Notes/](https://yourusername.github.io/DBMS_Notes/)**
   ```
5. **Replace `yourusername`** with your actual GitHub username
6. **Click "Commit changes"**

---

## Troubleshooting

### Files Not Showing Up?

- **Check file names** - Make sure they match exactly (case-sensitive)
- **Check file paths** - `notes/` folder should contain all markdown files
- **Refresh the page** - Sometimes GitHub needs a moment to update

### Website Not Loading?

1. **Check GitHub Pages status:**
   - Go to Settings → Pages
   - Look for any error messages
   - Make sure it says "Your site is published at..."

2. **Check file structure:**
   - `index.html` should be in the root directory
   - `notes/` folder should exist with all markdown files
   - All CSS and JS files should be in root

3. **Wait a few minutes:**
   - First deployment can take 5-10 minutes
   - Subsequent updates take 1-2 minutes

4. **Clear browser cache:**
   - Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)

### CORS Errors?

- GitHub Pages serves files over HTTP, so CORS shouldn't be an issue
- If you see errors, check browser console (F12)
- Make sure all file paths are correct

### Files in Wrong Location?

- **Move files:** Click on the file → Click "Edit" (pencil icon) → Change the path in the filename
- **Or delete and re-upload** in the correct location

---

## Updating Your Website

When you want to update files:

1. **Go to the file** you want to update
2. **Click the pencil icon** (Edit)
3. **Make your changes**
4. **Scroll down** to "Commit changes"
5. **Commit message:** "Update [filename]"
6. **Click "Commit changes"**
7. **Wait 1-2 minutes** for GitHub Pages to rebuild

---

## File Structure Checklist

Make sure your repository has this structure:

```
DBMS_Notes/
├── index.html
├── styles.css
├── app.js
├── README.md
├── .gitignore
├── _config.yml
├── .github/
│   └── workflows/
│       └── deploy.yml (optional)
└── notes/
    ├── README.md
    ├── 01_ACID_Properties_Introduction.md
    ├── 02_What_is_a_Transaction.md
    ├── 03_Atomicity.md
    ├── ... (all other note files)
```

---

## Quick Checklist

- [ ] Repository is Public
- [ ] All files uploaded to correct locations
- [ ] `index.html` is in root directory
- [ ] `notes/` folder exists with all markdown files
- [ ] GitHub Pages enabled (Settings → Pages)
- [ ] Source set to `main` branch, `/ (root)` folder
- [ ] Website URL updated in README.md
- [ ] Wait 2-5 minutes for first deployment
- [ ] Test the website URL

---

## Need Help?

- **GitHub Pages Documentation:** https://docs.github.com/en/pages
- **Check deployment status:** Settings → Pages → See deployment logs
- **Common issues:** Check the Troubleshooting section above

---

**That's it!** Your website should be live in a few minutes. 🚀

