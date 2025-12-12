// Notes data structure
const notesData = {
    'acid-properties': [
        { id: '01', title: 'ACID Properties Introduction', file: 'notes/01_ACID_Properties_Introduction.md' },
        { id: '02', title: 'What is a Transaction?', file: 'notes/02_What_is_a_Transaction.md' },
        { id: '03', title: 'Atomicity', file: 'notes/03_Atomicity.md' },
        { id: '04', title: 'Isolation', file: 'notes/04_Isolation.md' },
        { id: '05', title: 'Consistency', file: 'notes/05_Consistency.md' },
        { id: '06', title: 'Durability', file: 'notes/06_Durability.md' },
        { id: '07', title: 'ACID Properties Hands-On', file: 'notes/07_ACID_Properties_Hands_On.md' },
        { id: '08', title: 'Phantom Reads', file: 'notes/08_Phantom_Reads.md' },
        { id: '09', title: 'Serializable vs Repeatable Read', file: 'notes/09_Serializable_vs_Repeatable_Read.md' },
        { id: '10', title: 'Eventual Consistency', file: 'notes/10_Eventual_Consistency.md' }
    ],
    'database-storage': [
        { id: '11', title: 'Tables and Indexes Storage', file: 'notes/11_Tables_and_Indexes_Storage.md' },
        { id: '12', title: 'Row vs Column Storage', file: 'notes/12_Row_vs_Column_Storage.md' },
        { id: '13', title: 'Primary Key vs Secondary Key', file: 'notes/13_Primary_Key_vs_Secondary_Key.md' },
        { id: '14', title: 'Database Pages', file: 'notes/14_Database_Pages.md' }
    ],
    'database-indexing': [
        { id: '15', title: 'Create Postgres Table with Million Rows', file: 'notes/15_Create_Postgres_Table_with_Million_Rows.md' },
        { id: '16', title: 'Getting Started with Indexing', file: 'notes/16_Getting_Started_with_Indexing.md' },
        { id: '17', title: 'SQL Query Planner and Optimizer', file: 'notes/17_SQL_Query_Planner_and_Optimizer_Explain.md' }
    ]
};

// Flatten all notes for navigation
const allNotes = [
    ...notesData['acid-properties'],
    ...notesData['database-storage'],
    ...notesData['database-indexing']
];

let currentNoteIndex = -1;
let highlightMode = false;
let selectedText = '';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check if running from file:// protocol
    if (isFileProtocol()) {
        showFileProtocolWarning();
    }
    
    initializeNavigation();
    initializeHighlighting();
    initializeTheme();
    initializePrint();
    loadHighlights();
    
    // Handle URL hash for direct links
    if (window.location.hash) {
        const noteId = window.location.hash.substring(1);
        const note = allNotes.find(n => n.id === noteId);
        if (note) {
            loadNote(note);
        }
    }
});

// Show warning if using file:// protocol
function showFileProtocolWarning() {
    const content = document.getElementById('content');
    if (content && content.querySelector('.welcome-screen')) {
        const welcomeScreen = content.querySelector('.welcome-screen');
        const warning = document.createElement('div');
        warning.style.cssText = `
            background: #ff6b6b;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            margin-bottom: 2rem;
            border-left: 4px solid #ff4757;
        `;
        warning.innerHTML = `
            <strong>⚠️ CORS Error Detected</strong>
            <p style="margin: 0.5rem 0 0 0; font-size: 0.875rem;">
                You're opening this file directly. Please use a local server instead.
                <br>
                <strong>Quick fix:</strong> Run <code style="background: rgba(0,0,0,0.2); padding: 0.2rem 0.4rem; border-radius: 4px;">python -m http.server 8000</code> 
                then open <code style="background: rgba(0,0,0,0.2); padding: 0.2rem 0.4rem; border-radius: 4px;">http://localhost:8000</code>
            </p>
        `;
        welcomeScreen.insertBefore(warning, welcomeScreen.firstChild);
    }
}

// Initialize navigation
function initializeNavigation() {
    // Populate navigation menus
    Object.keys(notesData).forEach(sectionId => {
        const navList = document.getElementById(sectionId);
        if (navList) {
            notesData[sectionId].forEach(note => {
                const li = document.createElement('li');
                li.className = 'nav-item';
                const a = document.createElement('a');
                a.className = 'nav-link';
                a.textContent = note.title;
                a.href = `#${note.id}`;
                a.addEventListener('click', (e) => {
                    e.preventDefault();
                    loadNote(note);
                });
                li.appendChild(a);
                navList.appendChild(li);
            });
        }
    });

    // Navigation buttons
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentNoteIndex > 0) {
            loadNote(allNotes[currentNoteIndex - 1]);
        }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentNoteIndex < allNotes.length - 1) {
            loadNote(allNotes[currentNoteIndex + 1]);
        }
    });

    document.getElementById('backBtn').addEventListener('click', () => {
        showWelcomeScreen();
    });
}

// Check if running from file:// protocol
function isFileProtocol() {
    return window.location.protocol === 'file:';
}

// Get base path for files
function getBasePath() {
    // If running on GitHub Pages, use repository name
    if (window.location.hostname.includes('github.io')) {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1 && pathParts[1]) {
            return '/' + pathParts[1];
        }
    }
    // For local development, use relative path
    return '';
}

// Load a note
async function loadNote(note) {
    // Check if running from file:// protocol
    if (isFileProtocol()) {
        document.getElementById('content').innerHTML = `
            <div class="error" style="padding: 2rem; text-align: center;">
                <h2 style="color: #ff6b6b; margin-bottom: 1rem;">⚠️ CORS Error</h2>
                <p style="margin-bottom: 1rem; color: var(--text-secondary);">
                    Cannot load files directly from file system due to browser security restrictions.
                </p>
                <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; margin-top: 1.5rem; text-align: left;">
                    <h3 style="margin-bottom: 1rem; color: var(--accent);">Please use a local server:</h3>
                    <div style="font-family: 'JetBrains Mono', monospace; background: var(--bg-tertiary); padding: 1rem; border-radius: 6px; margin-bottom: 1rem;">
                        <p style="margin: 0.5rem 0;"><strong>Python 3:</strong></p>
                        <code style="color: var(--accent);">python -m http.server 8000</code>
                        <p style="margin: 0.5rem 0;"><strong>Node.js:</strong></p>
                        <code style="color: var(--accent);">npx http-server -p 8000</code>
                        <p style="margin: 0.5rem 0;"><strong>Then open:</strong></p>
                        <code style="color: var(--accent);">http://localhost:8000</code>
                    </div>
                    <p style="margin: 0; font-size: 0.875rem; color: var(--text-muted);">
                        Or deploy to GitHub Pages for the best experience!
                    </p>
                </div>
            </div>
        `;
        return;
    }

    try {
        // Construct file path
        const basePath = getBasePath();
        const filePath = basePath + '/' + note.file;
        
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const markdown = await response.text();
        
        if (!markdown || markdown.trim().length === 0) {
            throw new Error('File is empty');
        }
        
        const html = marked.parse(markdown);
        
        // Add loading state
        document.getElementById('content').innerHTML = '<div style="text-align: center; padding: 3rem;"><div style="display: inline-block; width: 40px; height: 40px; border: 4px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite;"></div></div>';
        
        // Small delay for smooth transition
        setTimeout(() => {
            document.getElementById('content').innerHTML = html;
            
            // Update navigation
            currentNoteIndex = allNotes.findIndex(n => n.id === note.id);
            updateNavigation();
            updateActiveLink(note.id);
            updatePageInfo(note.title);
            
            // Show back button
            document.getElementById('backBtn').style.display = 'block';
            
            // Apply saved highlights
            applyHighlights();
            
            // Scroll to top with smooth animation
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Update URL
            window.history.pushState({}, '', `#${note.id}`);
        }, 150);
    } catch (error) {
        console.error('Error loading note:', error);
        const isNetworkError = error.message.includes('Failed to fetch') || error.message.includes('NetworkError');
        
        document.getElementById('content').innerHTML = `
            <div class="error" style="padding: 2rem;">
                <h2 style="color: #ff6b6b; margin-bottom: 1rem;">Error Loading Note</h2>
                <p style="margin-bottom: 0.5rem; color: var(--text-secondary);">
                    <strong>Could not load:</strong> ${note.title}
                </p>
                <p style="margin-bottom: 1rem; color: var(--text-muted); font-family: 'JetBrains Mono', monospace; font-size: 0.875rem;">
                    ${error.message}
                </p>
                ${isNetworkError ? `
                    <div style="background: var(--bg-secondary); padding: 1.5rem; border-radius: 8px; margin-top: 1.5rem;">
                        <h3 style="margin-bottom: 1rem; color: var(--accent);">Possible Solutions:</h3>
                        <ul style="margin-left: 1.5rem; color: var(--text-secondary);">
                            <li>Make sure you're using a local server (not opening file:// directly)</li>
                            <li>Check that the file exists at: <code style="background: var(--bg-tertiary); padding: 0.2rem 0.4rem; border-radius: 4px;">${note.file}</code></li>
                            <li>Verify file paths are correct in app.js</li>
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    }
}

// Show welcome screen
function showWelcomeScreen() {
    document.getElementById('content').innerHTML = `
        <div class="welcome-screen">
            <h1>Welcome to DBMS Notes</h1>
            <p class="lead">Comprehensive notes on Database Management Systems</p>
            <div class="welcome-features">
                <div class="feature-card">
                    <h3>📖 Book-like Reading</h3>
                    <p>Beautiful, distraction-free reading experience</p>
                </div>
                <div class="feature-card">
                    <h3>✨ Highlight Important Points</h3>
                    <p>Click and drag to highlight key concepts</p>
                </div>
                <div class="feature-card">
                    <h3>🔍 Easy Navigation</h3>
                    <p>Browse through all topics effortlessly</p>
                </div>
                <div class="feature-card">
                    <h3>💾 Persistent Highlights</h3>
                    <p>Your highlights are saved automatically</p>
                </div>
            </div>
            <div class="quick-start">
                <h3>Quick Start</h3>
                <p>Select a topic from the sidebar to begin reading</p>
            </div>
        </div>
    `;
    currentNoteIndex = -1;
    updateNavigation();
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('currentPage').textContent = 'Home';
    window.history.pushState({}, '', window.location.pathname);
}

// Update navigation buttons
function updateNavigation() {
    document.getElementById('prevBtn').disabled = currentNoteIndex <= 0;
    document.getElementById('nextBtn').disabled = currentNoteIndex >= allNotes.length - 1;
}

// Update active link
function updateActiveLink(noteId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${noteId}`) {
            link.classList.add('active');
        }
    });
}

// Update page info
function updatePageInfo(title) {
    document.getElementById('currentPage').textContent = title;
}

// Initialize highlighting
function initializeHighlighting() {
    const highlightBtn = document.getElementById('highlightModeBtn');
    highlightBtn.addEventListener('click', () => {
        highlightMode = !highlightMode;
        highlightBtn.classList.toggle('active', highlightMode);
        document.body.classList.toggle('highlight-mode', highlightMode);
        
        if (highlightMode) {
            enableHighlighting();
        } else {
            disableHighlighting();
        }
    });
}

// Enable highlighting
function enableHighlighting() {
    const content = document.getElementById('content');
    
    content.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('mouseup', handleTextSelection);
}

// Disable highlighting
function disableHighlighting() {
    const content = document.getElementById('content');
    content.removeEventListener('mouseup', handleTextSelection);
    document.removeEventListener('mouseup', handleTextSelection);
    hideTooltip();
}

// Handle text selection
function handleTextSelection(e) {
    if (!highlightMode) return;
    
    const selection = window.getSelection();
    const text = selection.toString().trim();
    
    if (text.length > 0) {
        selectedText = text;
        const range = selection.getRangeAt(0);
        showTooltip(e, range);
    } else {
        hideTooltip();
    }
}

// Show highlight tooltip
function showTooltip(e, range) {
    const tooltip = document.getElementById('highlightTooltip');
    const rect = range.getBoundingClientRect();
    
    tooltip.style.display = 'flex';
    tooltip.style.left = `${rect.left + rect.width / 2 - 100}px`;
    tooltip.style.top = `${rect.top - 50}px`;
    
    // Add event listeners to tooltip buttons
    tooltip.querySelectorAll('.tooltip-btn').forEach(btn => {
        btn.onclick = () => {
            const color = btn.getAttribute('data-color');
            if (color === 'remove') {
                removeHighlight(range);
            } else {
                addHighlight(range, color);
            }
            hideTooltip();
            window.getSelection().removeAllRanges();
        };
    });
}

// Hide tooltip
function hideTooltip() {
    document.getElementById('highlightTooltip').style.display = 'none';
}

// Add highlight
function addHighlight(range, color) {
    const span = document.createElement('span');
    span.className = `highlight highlight-${color}`;
    span.setAttribute('data-highlight-id', Date.now().toString());
    
    try {
        span.appendChild(range.extractContents());
        range.insertNode(span);
        saveHighlights();
    } catch (e) {
        console.error('Error adding highlight:', e);
    }
}

// Remove highlight
function removeHighlight(range) {
    const parent = range.commonAncestorContainer.parentElement;
    if (parent && parent.classList.contains('highlight')) {
        const text = parent.textContent;
        parent.outerHTML = text;
        saveHighlights();
    }
}

// Save highlights
function saveHighlights() {
    const content = document.getElementById('content');
    const highlights = [];
    
    content.querySelectorAll('.highlight').forEach((el, index) => {
        const color = Array.from(el.classList).find(c => c.startsWith('highlight-'))?.replace('highlight-', '');
        if (color) {
            highlights.push({
                text: el.textContent,
                color: color,
                id: el.getAttribute('data-highlight-id') || index.toString()
            });
        }
    });
    
    if (currentNoteIndex >= 0) {
        const note = allNotes[currentNoteIndex];
        const key = `highlights-${note.id}`;
        localStorage.setItem(key, JSON.stringify(highlights));
    }
}

// Load highlights
function loadHighlights() {
    if (currentNoteIndex >= 0) {
        const note = allNotes[currentNoteIndex];
        const key = `highlights-${note.id}`;
        const saved = localStorage.getItem(key);
        
        if (saved) {
            try {
                const highlights = JSON.parse(saved);
                // Highlights will be applied when content is loaded
            } catch (e) {
                console.error('Error loading highlights:', e);
            }
        }
    }
}

// Apply highlights (after content is loaded)
function applyHighlights() {
    if (currentNoteIndex >= 0) {
        const note = allNotes[currentNoteIndex];
        const key = `highlights-${note.id}`;
        const saved = localStorage.getItem(key);
        
        if (saved) {
            try {
                const highlights = JSON.parse(saved);
                const content = document.getElementById('content');
                
                // Apply highlights by finding text and wrapping it
                highlights.forEach(highlight => {
                    const text = highlight.text;
                    if (text && text.length > 0) {
                        highlightTextInElement(content, text, highlight.color, highlight.id);
                    }
                });
            } catch (e) {
                console.error('Error applying highlights:', e);
            }
        }
    }
}

// Helper function to highlight text in an element
function highlightTextInElement(element, text, color, id) {
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: function(node) {
                // Skip if already inside a highlight
                let parent = node.parentElement;
                while (parent && parent !== element) {
                    if (parent.classList.contains('highlight')) {
                        return NodeFilter.FILTER_REJECT;
                    }
                    parent = parent.parentElement;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        },
        false
    );
    
    const textNodes = [];
    let node;
    while (node = walker.nextNode()) {
        if (node.textContent.includes(text)) {
            textNodes.push(node);
        }
    }
    
    textNodes.forEach(textNode => {
        const parent = textNode.parentNode;
        const fullText = textNode.textContent;
        const index = fullText.indexOf(text);
        
        if (index !== -1) {
            const before = fullText.substring(0, index);
            const match = fullText.substring(index, index + text.length);
            const after = fullText.substring(index + text.length);
            
            const span = document.createElement('span');
            span.className = `highlight highlight-${color}`;
            span.setAttribute('data-highlight-id', id);
            span.textContent = match;
            
            const fragment = document.createDocumentFragment();
            if (before) fragment.appendChild(document.createTextNode(before));
            fragment.appendChild(span);
            if (after) fragment.appendChild(document.createTextNode(after));
            
            parent.replaceChild(fragment, textNode);
        }
    });
}

// Initialize theme
function initializeTheme() {
    const themeBtn = document.getElementById('themeBtn');
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
    
    themeBtn.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const newTheme = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    });
}

// Initialize print
function initializePrint() {
    document.getElementById('printBtn').addEventListener('click', () => {
        window.print();
    });
}

// Handle browser back/forward
window.addEventListener('popstate', () => {
    if (window.location.hash) {
        const noteId = window.location.hash.substring(1);
        const note = allNotes.find(n => n.id === noteId);
        if (note) {
            loadNote(note);
        }
    } else {
        showWelcomeScreen();
    }
});

