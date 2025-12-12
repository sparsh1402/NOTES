# Deployment Guide

## Deploying to GitHub Pages

### Method 1: Automatic Deployment (Recommended)

1. **Enable GitHub Pages:**
   - Go to your repository Settings
   - Navigate to "Pages" section
   - Under "Source", select "Deploy from a branch"
   - Select branch: `main`
   - Select folder: `/ (root)`
   - Click "Save"

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Add frontend for DBMS notes"
   git push origin main
   ```

3. **Wait for deployment:**
   - GitHub will automatically deploy your site
   - Usually takes 1-2 minutes
   - Your site will be available at: `https://yourusername.github.io/DBMS_Notes/`

### Method 2: Using GitHub Actions (Already Configured)

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that will automatically deploy when you push to the `main` branch.

1. **Enable GitHub Pages:**
   - Go to Settings → Pages
   - Under "Build and deployment"
   - Source: "GitHub Actions"

2. **Push your code:**
   ```bash
   git add .
   git commit -m "Add frontend for DBMS notes"
   git push origin main
   ```

3. **Check deployment:**
   - Go to Actions tab to see deployment progress
   - Once complete, your site will be live

### Method 3: Manual Deployment

If you prefer to deploy manually:

1. **Install dependencies (if needed):**
   ```bash
   npm install -g http-server
   ```

2. **Test locally:**
   ```bash
   http-server -p 8000
   ```

3. **Build and deploy:**
   - The site is already static HTML/CSS/JS
   - Just push to GitHub and enable Pages

## Local Development

### Using Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

### Using Node.js

```bash
# Install http-server globally
npm install -g http-server

# Run server
http-server -p 8000
```

### Using VS Code Live Server

1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

## Troubleshooting

### CORS Issues

If you encounter CORS issues when loading markdown files locally:
- Use a local server (don't open `index.html` directly)
- Or use a browser extension to disable CORS

### Markdown Files Not Loading

- Make sure all markdown files are in the `notes/` directory
- Check that file paths in `app.js` are correct
- Verify file names match exactly (case-sensitive)

### Highlights Not Saving

- Check browser console for errors
- Ensure localStorage is enabled in your browser
- Try clearing browser cache and reloading

## Customization

### Change Repository Name

If your repository has a different name, update:
1. `README.md` - Update GitHub Pages URL
2. `index.html` - Update any hardcoded paths (if any)

### Add More Notes

1. Add markdown file to `notes/` directory
2. Update `app.js` - Add entry to `notesData` object
3. Follow the existing naming pattern

### Customize Colors

Edit `styles.css` and modify CSS variables in `:root`:
```css
:root {
    --accent: #4a9eff;  /* Change this */
    --highlight-yellow: rgba(255, 255, 0, 0.3);  /* Change this */
    /* etc. */
}
```

## Features

✅ **Book-like Design** - Clean, professional reading experience
✅ **Highlighting** - Click and drag to highlight with multiple colors
✅ **Dark/Light Theme** - Toggle between themes
✅ **Responsive** - Works on mobile, tablet, and desktop
✅ **Print Friendly** - Clean print layout
✅ **Persistent Highlights** - Saved in browser localStorage
✅ **Easy Navigation** - Sidebar and Previous/Next buttons

## Notes

- The site uses **Marked.js** (loaded from CDN) to convert markdown to HTML
- Highlights are stored in **localStorage** (per note)
- Theme preference is saved in **localStorage**
- All data is client-side only (no backend needed)

