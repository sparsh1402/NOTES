# How to Run Locally

## ⚠️ Important: You MUST use a local server!

**You cannot open `index.html` directly in your browser** (double-clicking the file). This will cause CORS errors because browsers block loading local files via JavaScript for security reasons.

## Quick Start

### Option 1: Python (Easiest)

If you have Python installed:

```bash
# Python 3 (most common)
python -m http.server 8000

# Or if python3 is your command
python3 -m http.server 8000

# Python 2 (if you only have Python 2)
python -m SimpleHTTPServer 8000
```

Then open: **http://localhost:8000**

### Option 2: Node.js

If you have Node.js installed:

```bash
# One-time install (if you don't have it)
npm install -g http-server

# Run the server
http-server -p 8000
```

Or use npx (no installation needed):

```bash
npx http-server -p 8000
```

Then open: **http://localhost:8000**

### Option 3: VS Code Live Server

1. Install the "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Option 4: PHP (if you have PHP installed)

```bash
php -S localhost:8000
```

## Why Do I Need a Server?

When you open an HTML file directly (`file://` protocol), browsers enforce CORS (Cross-Origin Resource Sharing) restrictions. This prevents JavaScript from loading other files (like the markdown files) for security reasons.

Using a local server (`http://localhost`) allows the JavaScript to fetch the markdown files properly.

## Troubleshooting

### "Failed to fetch" Error

- ✅ Make sure you're using a local server (not opening file:// directly)
- ✅ Check that you're accessing via `http://localhost:8000` (not `file://`)
- ✅ Verify all markdown files exist in the `notes/` directory
- ✅ Check browser console for specific error messages

### Files Still Not Loading

1. **Check file paths:**
   - Make sure `notes/` folder exists
   - Verify file names match exactly (case-sensitive)
   - Check `app.js` - file paths should be `notes/XX_Filename.md`

2. **Check browser console:**
   - Press F12 to open developer tools
   - Look at the Console tab for errors
   - Check Network tab to see if files are being requested

3. **Try a different port:**
   ```bash
   python -m http.server 3000  # Use port 3000 instead
   ```

## Best Practice: Deploy to GitHub Pages

For the best experience, deploy to GitHub Pages:
- No local server needed
- Works for everyone
- Professional URL
- See `DEPLOYMENT.md` for instructions

