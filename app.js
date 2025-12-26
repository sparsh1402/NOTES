// Notes data structure organized by subject
const notesData = {
    'dbms': {
        name: 'DBMS',
        description: 'Database Management Systems',
        icon: '🗄️',
        sections: {
            'acid-properties': [
                { id: 'dbms-01', title: 'ACID Properties Introduction', file: 'notes/dbms/01_ACID_Properties_Introduction.md' },
                { id: 'dbms-02', title: 'What is a Transaction?', file: 'notes/dbms/02_What_is_a_Transaction.md' },
                { id: 'dbms-03', title: 'Atomicity', file: 'notes/dbms/03_Atomicity.md' },
                { id: 'dbms-04', title: 'Isolation', file: 'notes/dbms/04_Isolation.md' },
                { id: 'dbms-05', title: 'Consistency', file: 'notes/dbms/05_Consistency.md' },
                { id: 'dbms-06', title: 'Durability', file: 'notes/dbms/06_Durability.md' },
                { id: 'dbms-07', title: 'ACID Properties Hands-On', file: 'notes/dbms/07_ACID_Properties_Hands_On.md' },
                { id: 'dbms-08', title: 'Phantom Reads', file: 'notes/dbms/08_Phantom_Reads.md' },
                { id: 'dbms-09', title: 'Serializable vs Repeatable Read', file: 'notes/dbms/09_Serializable_vs_Repeatable_Read.md' },
                { id: 'dbms-10', title: 'Eventual Consistency', file: 'notes/dbms/10_Eventual_Consistency.md' }
            ],
            'database-storage': [
                { id: 'dbms-11', title: 'Tables and Indexes Storage', file: 'notes/dbms/11_Tables_and_Indexes_Storage.md' },
                { id: 'dbms-12', title: 'Row vs Column Storage', file: 'notes/dbms/12_Row_vs_Column_Storage.md' },
                { id: 'dbms-13', title: 'Primary Key vs Secondary Key', file: 'notes/dbms/13_Primary_Key_vs_Secondary_Key.md' },
                { id: 'dbms-14', title: 'Database Pages', file: 'notes/dbms/14_Database_Pages.md' }
            ],
            'database-indexing': [
                { id: 'dbms-15', title: 'Create Postgres Table with Million Rows', file: 'notes/dbms/15_Create_Postgres_Table_with_Million_Rows.md' },
                { id: 'dbms-16', title: 'Getting Started with Indexing', file: 'notes/dbms/16_Getting_Started_with_Indexing.md' },
                { id: 'dbms-17', title: 'SQL Query Planner and Optimizer', file: 'notes/dbms/17_SQL_Query_Planner_and_Optimizer_Explain.md' }
            ]
        }
    },
    'java': {
        name: 'JAVA',
        description: 'Java Programming Language',
        icon: '☕',
        sections: {
            'oops-concepts': [
                { id: 'java-01', title: 'OOPs Concepts In Java', file: 'notes/java/01_OOPs_Concepts.md' }
            ],
            'java-basics': [
                { id: 'java-02', title: 'Java Overview', file: 'notes/java/02_Java_Overview.md' },
                { id: 'java-03', title: 'Why One Public Class Per File?', file: 'notes/java/03_Why_One_Public_Class_Per_File.md' },
                { id: 'java-04', title: 'Java Variables', file: 'notes/java/04_Java_Variables.md' },
                { id: 'java-05', title: 'Java Methods', file: 'notes/java/05_Java_Methods.md' },
                { id: 'java-06', title: 'Java Constructors', file: 'notes/java/06_Java_Constructors.md' }
            ],
            'java-memory-management': [
                { id: 'java-07', title: 'Java Memory Management', file: 'notes/java/07_Java_Memory_Management.md' }
            ],
            'java-advanced-classes': [
                { id: 'java-08', title: 'Java Types of Classes - Part 1', file: 'notes/java/08_Java_Types_of_Classes_Part1.md' },
                { id: 'java-09', title: 'Java Generic Classes', file: 'notes/java/09_Java_Generic_Classes.md' }
            ]
        }
    },
    'springboot': {
        name: 'SpringBoot',
        description: 'Spring Boot Framework',
        icon: '🌱',
        sections: {
            'fundamentals': [
                // Add your SpringBoot notes here
                // Example: { id: 'springboot-01', title: 'SpringBoot Introduction', file: 'notes/springboot/01_SpringBoot_Introduction.md' }
                // When you add notes, create a 'springboot' folder inside 'notes' and add your markdown files there
            ]
        }
    },
    'hld': {
        name: 'HLD',
        description: 'High Level Design',
        icon: '🏗️',
        sections: {
            'design-patterns': [
                // Add your HLD notes here
                // Example: { id: 'hld-01', title: 'System Design Basics', file: 'notes/hld/01_System_Design_Basics.md' }
                // When you add notes, create a 'hld' folder inside 'notes' and add your markdown files there
            ]
        }
    },
    'lld': {
        name: 'LLD',
        description: 'Low Level Design',
        icon: '🔧',
        sections: {
            'design-principles': [
                // Add your LLD notes here
                // Example: { id: 'lld-01', title: 'Design Principles', file: 'notes/lld/01_Design_Principles.md' }
                // When you add notes, create a 'lld' folder inside 'notes' and add your markdown files there
            ]
        }
    }
};

// Get all subjects
const subjects = Object.keys(notesData);

// Current state
let currentSubject = null;
let currentNoteIndex = -1;
let currentNotes = [];

// Web3Forms API Key
// Get your free access key from: https://web3forms.com
// Replace the value below with your actual access key
const WEB3FORMS_ACCESS_KEY = '2a413337-40d1-40e1-8349-1b397504c446';

// Get all notes for a subject
function getAllNotesForSubject(subjectId) {
    if (!notesData[subjectId]) return [];
    const allNotes = [];
    Object.values(notesData[subjectId].sections).forEach(sectionNotes => {
        allNotes.push(...sectionNotes);
    });
    return allNotes;
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Check if running from file:// protocol
    if (isFileProtocol()) {
        showFileProtocolWarning();
    }
    
    initializeSubjectSelector();
    initializeNavigation();
    initializeContact();
    initializeTheme();
    initializePrint();
    
    // Handle URL hash for direct links
    const hash = window.location.hash.substring(1);
    if (hash) {
        // Check if it's a subject selector (e.g., #subject:dbms)
        if (hash.startsWith('subject:')) {
            const subjectId = hash.split(':')[1];
            selectSubject(subjectId);
        } else {
            // It's a note ID, find which subject it belongs to
            for (const subjectId of subjects) {
                const notes = getAllNotesForSubject(subjectId);
                const note = notes.find(n => n.id === hash);
                if (note) {
                    selectSubject(subjectId);
                    setTimeout(() => loadNote(note), 100);
                    break;
                }
            }
        }
    } else {
        // Default to DBMS subject if available
        if (subjects.includes('dbms')) {
            selectSubject('dbms');
        } else {
            showWelcomeScreen();
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

// Initialize subject selector
function initializeSubjectSelector() {
    const subjectSelector = document.getElementById('subjectSelector');
    if (!subjectSelector) return;
    
    // Remove the placeholder option
    subjectSelector.innerHTML = '';
    
    subjects.forEach(subjectId => {
        const subject = notesData[subjectId];
        const option = document.createElement('option');
        option.value = subjectId;
        option.textContent = `${subject.icon} ${subject.name}`;
        subjectSelector.appendChild(option);
    });
    
    subjectSelector.addEventListener('change', (e) => {
        if (e.target.value) {
            selectSubject(e.target.value);
        }
    });
}

// Select a subject
function selectSubject(subjectId) {
    if (!notesData[subjectId]) return;
    
    currentSubject = subjectId;
    currentNotes = getAllNotesForSubject(subjectId);
    currentNoteIndex = -1;
    
    // Update subject selector
    const subjectSelector = document.getElementById('subjectSelector');
    if (subjectSelector) {
        subjectSelector.value = subjectId;
    }
    
    // Update sidebar header
    const subject = notesData[subjectId];
    const logo = document.querySelector('.logo');
    const subtitle = document.querySelector('.subtitle');
    if (logo) logo.textContent = `${subject.icon} ${subject.name} Notes`;
    if (subtitle) subtitle.textContent = subject.description;
    
    // Update navigation
    updateNavigationMenu();
    
    // Show welcome screen for this subject
    showSubjectWelcomeScreen(subjectId);
    
    // Update URL
    window.history.pushState({}, '', `#subject:${subjectId}`);
}

// Update navigation menu for current subject
function updateNavigationMenu() {
    if (!currentSubject) return;
    
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;
    
    // Clear existing navigation
    navMenu.innerHTML = '';
    
    // Add sections for current subject
    const subject = notesData[currentSubject];
    Object.keys(subject.sections).forEach(sectionId => {
        const sectionNotes = subject.sections[sectionId];
        if (sectionNotes.length === 0) return; // Skip empty sections
        
        const navSection = document.createElement('div');
        navSection.className = 'nav-section';
        
        const sectionTitle = document.createElement('h3');
        sectionTitle.className = 'nav-section-title';
        sectionTitle.textContent = formatSectionTitle(sectionId);
        
        const navList = document.createElement('ul');
        navList.className = 'nav-list';
        navList.id = `${currentSubject}-${sectionId}`;
        
        sectionNotes.forEach(note => {
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
        
        navSection.appendChild(sectionTitle);
        navSection.appendChild(navList);
        navMenu.appendChild(navSection);
    });
}

// Format section title (convert kebab-case to Title Case)
function formatSectionTitle(sectionId) {
    return sectionId
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Initialize navigation
function initializeNavigation() {
    // Navigation buttons
    document.getElementById('prevBtn').addEventListener('click', () => {
        if (currentNoteIndex > 0 && currentNotes.length > 0) {
            loadNote(currentNotes[currentNoteIndex - 1]);
        }
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        if (currentNoteIndex < currentNotes.length - 1 && currentNotes.length > 0) {
            loadNote(currentNotes[currentNoteIndex + 1]);
        }
    });

    document.getElementById('backBtn').addEventListener('click', () => {
        if (currentSubject) {
            showSubjectWelcomeScreen(currentSubject);
        } else {
            showWelcomeScreen();
        }
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
        
        // Configure marked.js to generate heading IDs
        marked.setOptions({
            headerIds: true,
            mangle: false
        });
        
        let html = marked.parse(markdown);
        
        // Post-process HTML to ensure all headings have IDs that match link format
        // Use a temporary DOM element to parse and modify HTML properly
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Find all headings and add/update IDs
        const headings = tempDiv.querySelectorAll('h1, h2, h3, h4, h5, h6');
        headings.forEach(heading => {
            // Get text content (handles nested HTML)
            const textContent = heading.textContent || heading.innerText || '';
            
            // Generate ID from text content
            const id = textContent
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, '') // Remove special characters
                .replace(/\s+/g, '-')      // Replace spaces with hyphens
                .replace(/-+/g, '-')       // Replace multiple hyphens with single
                .replace(/^-+|-+$/g, '');  // Remove leading/trailing hyphens
            
            // Set the ID
            heading.id = id;
        });
        
        // Get the updated HTML
        html = tempDiv.innerHTML;
        
        // Add loading state
        document.getElementById('content').innerHTML = '<div style="text-align: center; padding: 3rem;"><div style="display: inline-block; width: 40px; height: 40px; border: 4px solid var(--border); border-top-color: var(--accent); border-radius: 50%; animation: spin 0.8s linear infinite;"></div></div>';
        
        // Small delay for smooth transition
        setTimeout(() => {
            document.getElementById('content').innerHTML = html;
            
            // Add anchor link click handlers for table of contents
            // Use a small delay to ensure DOM is fully updated
            setTimeout(() => {
                setupAnchorLinks();
            }, 50);
            
            // Update navigation
            currentNoteIndex = currentNotes.findIndex(n => n.id === note.id);
            updateNavigation();
            updateActiveLink(note.id);
            updatePageInfo(note.title);
            
            // Show back button
            document.getElementById('backBtn').style.display = 'block';
            
            // Check if URL has an anchor hash for a section within this note
            const urlHash = window.location.hash;
            if (urlHash && urlHash.startsWith('#')) {
                const hashValue = urlHash.substring(1);
                
                // Check if hash contains note ID and section (format: noteId-sectionId)
                if (hashValue.includes('-') && hashValue.startsWith(note.id + '-')) {
                    const sectionId = hashValue.substring(note.id.length + 1);
                    // Try to scroll to the section after a short delay to ensure DOM is ready
                    setTimeout(() => {
                        scrollToSection(sectionId);
                    }, 300);
                } else if (hashValue === note.id) {
                    // Scroll to top if it's just the note ID
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                } else {
                    // Might be just a section ID, try to scroll to it
                    setTimeout(() => {
                        scrollToSection(hashValue);
                    }, 300);
                }
            } else {
                // Scroll to top with smooth animation
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
            
            // Update URL to note ID (section hash will be handled by anchor clicks)
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

// Show welcome screen (all subjects)
function showWelcomeScreen() {
    currentSubject = null;
    currentNoteIndex = -1;
    currentNotes = [];
    
    const subjectsHtml = subjects.map(subjectId => {
        const subject = notesData[subjectId];
        const noteCount = getAllNotesForSubject(subjectId).length;
        return `
            <div class="subject-card" data-subject="${subjectId}">
                <div class="subject-icon">${subject.icon}</div>
                <h3>${subject.name}</h3>
                <p>${subject.description}</p>
                <div class="subject-stats">${noteCount} notes</div>
            </div>
        `;
    }).join('');
    
    document.getElementById('content').innerHTML = `
        <div class="welcome-screen">
            <h1>📚 Study Notes</h1>
            <p class="lead">Comprehensive notes on various topics</p>
            <div class="subjects-grid">
                ${subjectsHtml}
            </div>
            <div class="welcome-features">
                <div class="feature-card">
                    <h3>📖 Book-like Reading</h3>
                    <p>Beautiful, distraction-free reading experience</p>
                </div>
                <div class="feature-card">
                    <h3>💬 Contact & Feedback</h3>
                    <p>Have questions or feedback? Send me a message!</p>
                </div>
                <div class="feature-card">
                    <h3>🔍 Easy Navigation</h3>
                    <p>Browse through all topics effortlessly</p>
                </div>
                <div class="feature-card">
                    <h3>📱 Responsive Design</h3>
                    <p>Works seamlessly on desktop and mobile devices</p>
                </div>
            </div>
        </div>
    `;
    
    // Add click handlers to subject cards
    document.querySelectorAll('.subject-card').forEach(card => {
        card.addEventListener('click', () => {
            const subjectId = card.getAttribute('data-subject');
            selectSubject(subjectId);
        });
    });
    
    updateNavigation();
    document.getElementById('backBtn').style.display = 'none';
    document.getElementById('currentPage').textContent = 'Home';
    window.history.pushState({}, '', window.location.pathname);
}

// Show welcome screen for a specific subject
function showSubjectWelcomeScreen(subjectId) {
    if (!notesData[subjectId]) return;
    
    const subject = notesData[subjectId];
    const allNotes = getAllNotesForSubject(subjectId);
    
    const sectionsHtml = Object.keys(subject.sections).map(sectionId => {
        const sectionNotes = subject.sections[sectionId];
        if (sectionNotes.length === 0) return '';
        
        const notesList = sectionNotes.map(note => `
            <li class="welcome-note-item">
                <a href="#${note.id}" class="welcome-note-link">${note.title}</a>
            </li>
        `).join('');
        
        return `
            <div class="welcome-section">
                <h3>${formatSectionTitle(sectionId)}</h3>
                <ul class="welcome-notes-list">
                    ${notesList}
                </ul>
            </div>
        `;
    }).join('');
    
    document.getElementById('content').innerHTML = `
        <div class="welcome-screen">
            <h1>${subject.icon} ${subject.name} Notes</h1>
            <p class="lead">${subject.description}</p>
            ${sectionsHtml}
            <div class="quick-start">
                <h3>Quick Start</h3>
                <p>Select a topic from the sidebar or above to begin reading</p>
            </div>
        </div>
    `;
    
    // Add click handlers to note links
    document.querySelectorAll('.welcome-note-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const noteId = link.getAttribute('href').substring(1);
            const note = allNotes.find(n => n.id === noteId);
            if (note) {
                loadNote(note);
            }
        });
    });
    
    currentNoteIndex = -1;
    updateNavigation();
    document.getElementById('backBtn').style.display = 'block';
    document.getElementById('currentPage').textContent = `${subject.name} - Home`;
    window.history.pushState({}, '', `#subject:${subjectId}`);
}

// Update navigation buttons
function updateNavigation() {
    document.getElementById('prevBtn').disabled = currentNoteIndex <= 0 || currentNotes.length === 0;
    document.getElementById('nextBtn').disabled = currentNoteIndex >= currentNotes.length - 1 || currentNotes.length === 0;
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

// Scroll to a specific section by ID
function scrollToSection(sectionId) {
    if (!sectionId) return;
    
    // Try to find the element, with a retry mechanism
    let targetElement = document.getElementById(sectionId);
    
    // If not found immediately, try again after a short delay (for dynamically loaded content)
    if (!targetElement) {
        setTimeout(() => {
            targetElement = document.getElementById(sectionId);
            if (targetElement) {
                performScroll(targetElement);
            }
        }, 100);
        return;
    }
    
    performScroll(targetElement);
}

// Helper function to perform the actual scroll
function performScroll(targetElement) {
    if (!targetElement) return;
    
    // Calculate offset to account for fixed header if any
    const offset = 20; // Adjust this value if you have a fixed header
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    // Smooth scroll to target
    window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
    });
}

// Setup anchor links for table of contents
function setupAnchorLinks() {
    const content = document.getElementById('content');
    if (!content) return;
    
    // Find all anchor links (especially in table of contents)
    const anchorLinks = content.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        // Check if listener already added (using data attribute)
        if (link.dataset.anchorHandlerAdded) {
            return; // Already has handler
        }
        
        // Mark as having handler
        link.dataset.anchorHandlerAdded = 'true';
        
        link.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;
            
            const targetId = href.substring(1); // Remove #
            if (!targetId) return;
            
            // Scroll to the section
            scrollToSection(targetId);
            
            // Update URL hash - preserve note ID if present
            if (currentNoteIndex >= 0 && currentNotes.length > 0) {
                const currentNote = currentNotes[currentNoteIndex];
                // Update URL to include both note ID and section: #noteId-sectionId
                window.history.pushState(null, null, `#${currentNote.id}-${targetId}`);
            } else {
                window.history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

// Initialize contact form
function initializeContact() {
    const contactBtn = document.getElementById('contactBtn');
    const contactModal = document.getElementById('contactModal');
    const contactModalClose = document.getElementById('contactModalClose');
    const contactModalOverlay = document.getElementById('contactModalOverlay');
    const contactForm = document.getElementById('contactForm');
    
    // Open modal
    contactBtn.addEventListener('click', () => {
        contactModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    });
    
    // Close modal
    function closeModal() {
        contactModal.style.display = 'none';
        document.body.style.overflow = '';
    }
    
    contactModalClose.addEventListener('click', closeModal);
    contactModalOverlay.addEventListener('click', closeModal);
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && contactModal.style.display === 'flex') {
            closeModal();
        }
    });
    
    // Handle form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        const formMessage = document.getElementById('formMessage');
        
        // Disable submit button and show loading
        submitBtn.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline-block';
        formMessage.style.display = 'none';
        
        // Get form data
        const formData = {
            access_key: WEB3FORMS_ACCESS_KEY,
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value,
            botcheck: document.getElementById('contactHoneypot').checked
        };
        
        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Show success message
                formMessage.textContent = '✅ Message sent successfully! I\'ll get back to you soon.';
                formMessage.className = 'form-message success';
                formMessage.style.display = 'block';
                
                // Reset form
                contactForm.reset();
                
                // Close modal after 2 seconds
                setTimeout(() => {
                    closeModal();
                    formMessage.style.display = 'none';
                }, 2000);
            } else {
                throw new Error(result.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error sending message:', error);
            formMessage.textContent = `❌ Error: ${error.message || 'Failed to send message. Please try again.'}`;
            formMessage.className = 'form-message error';
            formMessage.style.display = 'block';
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false;
            btnText.style.display = 'inline-block';
            btnLoader.style.display = 'none';
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
    const hash = window.location.hash.substring(1);
    if (hash) {
        if (hash.startsWith('subject:')) {
            const subjectId = hash.split(':')[1];
            selectSubject(subjectId);
        } else {
            // It's a note ID, find which subject it belongs to
            for (const subjectId of subjects) {
                const notes = getAllNotesForSubject(subjectId);
                const note = notes.find(n => n.id === hash);
                if (note) {
                    selectSubject(subjectId);
                    setTimeout(() => loadNote(note), 100);
                    break;
                }
            }
        }
    } else {
        // Default to DBMS subject if available
        if (subjects.includes('dbms')) {
            selectSubject('dbms');
        } else {
            showWelcomeScreen();
        }
    }
});

