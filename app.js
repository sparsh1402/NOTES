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
                { id: 'java-09', title: 'Java Generic Classes', file: 'notes/java/09_Java_Generic_Classes.md' },
                { id: 'java-10', title: 'Java POJOs, Enums, and Final Classes', file: 'notes/java/10_Java_POJOs_Enums_Final_Classes.md' },
                { id: 'java-11', title: 'Java Singleton, Immutable, and Wrapper Classes', file: 'notes/java/11_Java_Singleton_Immutable_Wrapper_Classes.md' }
            ],
            'java-interfaces': [
                { id: 'java-12', title: 'Java Interfaces - Part 1', file: 'notes/java/12_Java_Interfaces_Part1.md' },
                { id: 'java-13', title: 'Java Interfaces - Part 2: Java 8 & 9 Features', file: 'notes/java/13_Java_Interfaces_Part2_Java8_Java9_Features.md' }
            ],
            'java-functional-programming': [
                { id: 'java-14', title: 'Java Functional Interface and Lambda Expression', file: 'notes/java/14_Java_Functional_Interface_Lambda_Expression.md' }
            ],
            'java-advanced-topics': [
                { id: 'java-15', title: 'Java Reflection', file: 'notes/java/15_Java_Reflection.md' },
                { id: 'java-16', title: 'Java Annotations', file: 'notes/java/16_Java_Annotations.md' },
                { id: 'java-17', title: 'Java Exception Handling', file: 'notes/java/17_Java_Exception_Handling.md' },
                { id: 'java-18', title: 'Java Operators', file: 'notes/java/18_Java_Operators.md' },
                { id: 'java-19', title: 'Java Control Flow Statements', file: 'notes/java/19_Java_Control_Flow_Statements.md' }
            ],
            'java-collections': [
                { id: 'java-20', title: 'Java Collection Framework - Introduction', file: 'notes/java/20_Java_Collection_Framework_Introduction.md' },
                { id: 'java-21', title: 'Java Queue, PriorityQueue, Comparator, and Comparable', file: 'notes/java/21_Java_Queue_PriorityQueue_Comparator_Comparable.md' },
                { id: 'java-22', title: 'Java Deque, List Implementations', file: 'notes/java/22_Java_Deque_List_Implementations.md' },
                { id: 'java-23', title: 'Java Map and HashMap Internals', file: 'notes/java/23_Java_Map_HashMap_Internals.md' },
                { id: 'java-24', title: 'Java LinkedHashMap and TreeMap', file: 'notes/java/24_Java_LinkedHashMap_TreeMap.md' },
                { id: 'java-25', title: 'Java Set Implementations', file: 'notes/java/25_Java_Set_Implementations.md' },
                { id: 'java-26', title: 'Java Streams', file: 'notes/java/26_Java_Streams.md' }
            ],
            'java-threading': [
                { id: 'java-27', title: 'Java Threading - Part 1: Introduction, Process, and Thread', file: 'notes/java/27_Java_Threading_Part1_Introduction_Process_Thread.md' },
                { id: 'java-28', title: 'Java Threading - Part 2: Thread Creation, Synchronization', file: 'notes/java/28_Java_Threading_Part2_Creation_Synchronization.md' },
                { id: 'java-29', title: 'Java Threading - Part 3: Deprecated Methods, Join, Priority, Daemon', file: 'notes/java/29_Java_Threading_Part3_Deprecated_Methods_Join_Priority_Daemon.md' },
                { id: 'java-30', title: 'Java Threading - Part 4: Locks (Reentrant, Read-Write, Semaphore)', file: 'notes/java/30_Java_Threading_Part4_Locks_Reentrant_ReadWrite_Semaphore.md' },
                { id: 'java-31', title: 'Java Threading - Part 5: Atomic Variables and Volatile', file: 'notes/java/31_Java_Threading_Part5_Atomic_Variables_Volatile.md' },
                { id: 'java-32', title: 'Java Threading - Part 6: Thread Pool Executor', file: 'notes/java/32_Java_Threading_Part6_Thread_Pool_Executor.md' },
                { id: 'java-33', title: 'Java Threading - Part 7: Future, Callable, and CompletableFuture', file: 'notes/java/33_Java_Threading_Part7_Future_Callable_CompletableFuture.md' },
                { id: 'java-34', title: 'Java Threading - Part 8: Executors Utility and Fork-Join Pool', file: 'notes/java/34_Java_Threading_Part8_Executors_Utility_ForkJoinPool.md' },
                { id: 'java-35', title: 'Java Threading - Part 9: Shutdown, Scheduled Executor, ThreadLocal, Virtual Threads', file: 'notes/java/35_Java_Threading_Part9_Shutdown_ScheduledExecutor_ThreadLocal_VirtualThreads.md' }
            ],
            'java-modern-features': [
                { id: 'java-36', title: 'Java Lombok Library', file: 'notes/java/36_Java_Lombok_Library.md' },
                { id: 'java-37', title: 'Java 21: Sequence Collections', file: 'notes/java/37_Java_21_Sequence_Collections.md' },
                { id: 'java-38', title: 'Java 17: Sealed Classes and Interfaces', file: 'notes/java/38_Java_17_Sealed_Classes_Interfaces.md' },
                { id: 'java-39', title: 'Java 14: Switch Enhancements', file: 'notes/java/39_Java_14_Switch_Enhancements.md' },
                { id: 'java-40', title: 'Java Pattern Matching: instanceof (Java 16) and Switch (Java 21)', file: 'notes/java/40_Java_Pattern_Matching_Instanceof_Switch.md' },
                { id: 'java-41', title: 'Java 16: Records', file: 'notes/java/41_Java_16_Records.md' }
            ]
        }
    },
    'dsa': {
        name: 'DSA',
        description: 'Data Structures & Algorithms',
        icon: '🧩',
        sections: {
            'arrays-and-hashing': [
                { id: 'dsa-01', title: 'Two Sum', file: 'notes/dsa/01_Two_Sum.md' },
                { id: 'dsa-02', title: 'Product of Array Except Self', file: 'notes/dsa/02_Product_of_Array_Except_Self.md' },
                { id: 'dsa-03', title: 'Subarray Sum Equals K', file: 'notes/dsa/03_Subarray_Sum_Equals_K.md' }
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
            'case-studies': [
                { id: 'hld-01', title: 'Price-Drop Alerts for Watched Products', file: 'notes/hld/01_Price_Drop_Alerts.md' }
            ]
        }
    },
    'lld': {
        name: 'LLD',
        description: 'Low Level Design',
        icon: '🔧',
        sections: {
            'design-principles': [
                { id: 'lld-01', title: 'SOLID Principles (Applied to a Spring Boot Service)', file: 'notes/lld/01_SOLID_Principles.md' }
            ]
        }
    }
};

// Subjects that have at least one note (empty subjects stay hidden until notes are added)
const subjects = Object.keys(notesData).filter(id => getAllNotesForSubject(id).length > 0);

// Current state
let currentSubject = null;
let currentNoteIndex = -1;
let currentNotes = [];
let currentNote = null;

// Web3Forms API Key
// Get your free access key from: https://web3forms.com
// Replace the value below with your actual access key
const WEB3FORMS_ACCESS_KEY = '2a413337-40d1-40e1-8349-1b397504c446';

const $ = (id) => document.getElementById(id);

// Get all notes for a subject
function getAllNotesForSubject(subjectId) {
    if (!notesData[subjectId]) return [];
    const allNotes = [];
    Object.values(notesData[subjectId].sections).forEach(sectionNotes => {
        allNotes.push(...sectionNotes);
    });
    return allNotes;
}

// Find which subject and section a note belongs to
function findNote(noteId) {
    for (const subjectId of Object.keys(notesData)) {
        for (const [sectionId, notes] of Object.entries(notesData[subjectId].sections)) {
            const note = notes.find(n => n.id === noteId);
            if (note) return { note, subjectId, sectionId };
        }
    }
    return null;
}

// Format section title (convert kebab-case to Title Case)
function formatSectionTitle(sectionId) {
    const small = new Set(['and', 'or', 'of', 'the', 'vs', 'in', 'to']);
    return sectionId
        .split('-')
        .map((word, i) => (i > 0 && small.has(word)) ? word : word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    initializeSubjectTabs();
    initializeNavigation();
    initializeSidebarToggle();
    initializeSearch();
    initializeContact();
    initializeTheme();
    initializePrint();
    initializeProgress();
    routeFromHash();
});

window.addEventListener('popstate', routeFromHash);

function routeFromHash() {
    const hash = decodeURIComponent(window.location.hash.substring(1));

    if (!hash) {
        selectSubject(subjects.includes('dbms') ? 'dbms' : subjects[0], { push: false });
        return;
    }
    if (hash.startsWith('subject:')) {
        selectSubject(hash.split(':')[1], { push: false });
        return;
    }

    // "#noteId" or "#noteId-section-anchor"
    const ids = getAllNoteIds();
    const noteId = ids.filter(id => hash === id || hash.startsWith(id + '-'))
        .sort((a, b) => b.length - a.length)[0];
    if (noteId) {
        const found = findNote(noteId);
        const section = hash.length > noteId.length ? hash.substring(noteId.length + 1) : null;
        loadNote(found.note, { push: false, section });
        return;
    }
    selectSubject(subjects[0], { push: false });
}

function getAllNoteIds() {
    return Object.keys(notesData).flatMap(id => getAllNotesForSubject(id).map(n => n.id));
}

// ---------------------------------------------------------------
// Subjects and sidebar
// ---------------------------------------------------------------
function initializeSubjectTabs() {
    const tabs = $('subjectTabs');
    tabs.innerHTML = '';
    subjects.forEach(subjectId => {
        const subject = notesData[subjectId];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'subject-tab';
        btn.setAttribute('role', 'tab');
        btn.dataset.subject = subjectId;
        btn.style.setProperty('--tab-color', `var(--${subjectColorVar(subjectId)})`);
        btn.innerHTML = `<span class="dot" aria-hidden="true"></span>${escapeHtml(subject.name)}`;
        btn.addEventListener('click', () => selectSubject(subjectId));
        tabs.appendChild(btn);
    });

    $('brandLink').addEventListener('click', (e) => {
        e.preventDefault();
        selectSubject(currentSubject || subjects[0]);
    });
}

function subjectColorVar(subjectId) {
    return ['dbms', 'java', 'dsa'].includes(subjectId) ? subjectId : 'other';
}

function setSubjectChrome(subjectId) {
    if (currentSubject === subjectId) return;
    currentSubject = subjectId;
    currentNotes = getAllNotesForSubject(subjectId);
    document.body.dataset.subject = subjectId;

    document.querySelectorAll('.subject-tab').forEach(tab => {
        tab.setAttribute('aria-selected', String(tab.dataset.subject === subjectId));
    });
    $('subjectDescription').textContent = notesData[subjectId].description;
    updateNavigationMenu();
}

function selectSubject(subjectId, { push = true } = {}) {
    if (!notesData[subjectId]) subjectId = subjects[0];
    setSubjectChrome(subjectId);
    showSubjectHome(subjectId);
    if (push) window.history.pushState({}, '', `#subject:${subjectId}`);
}

function updateNavigationMenu() {
    const navMenu = $('navMenu');
    navMenu.innerHTML = '';
    const subject = notesData[currentSubject];

    Object.entries(subject.sections).forEach(([sectionId, sectionNotes]) => {
        if (sectionNotes.length === 0) return;
        const navSection = document.createElement('div');
        navSection.className = 'nav-section';
        navSection.innerHTML = `<h3 class="nav-section-title">${escapeHtml(formatSectionTitle(sectionId))}</h3>`;

        const list = document.createElement('ul');
        list.className = 'nav-list';
        sectionNotes.forEach(note => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.className = 'nav-link';
            a.textContent = note.title;
            a.href = `#${note.id}`;
            a.dataset.noteId = note.id;
            a.addEventListener('click', (e) => {
                e.preventDefault();
                loadNote(note);
            });
            li.appendChild(a);
            list.appendChild(li);
        });
        navSection.appendChild(list);
        navMenu.appendChild(navSection);
    });
}

function updateActiveLink(noteId) {
    document.querySelectorAll('.nav-link').forEach(link => {
        const active = link.dataset.noteId === noteId;
        link.classList.toggle('active', active);
        if (active) {
            link.setAttribute('aria-current', 'page');
            link.scrollIntoView({ block: 'nearest' });
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function initializeSidebarToggle() {
    const open = (state) => {
        document.body.classList.toggle('nav-open', state);
        $('scrim').hidden = !state;
        $('menuBtn').setAttribute('aria-expanded', String(state));
    };
    $('menuBtn').addEventListener('click', () => open(!document.body.classList.contains('nav-open')));
    $('scrim').addEventListener('click', () => open(false));
    $('navMenu').addEventListener('click', (e) => { if (e.target.closest('.nav-link')) open(false); });
    window.closeSidebar = () => open(false);
}

// ---------------------------------------------------------------
// Breadcrumbs and pager
// ---------------------------------------------------------------
function setCrumbs(parts) {
    const crumbs = $('crumbs');
    crumbs.innerHTML = parts.map((p, i) => {
        const sep = i > 0 ? '<span class="sep" aria-hidden="true">/</span>' : '';
        const cls = p.cls ? ` class="${p.cls}"` : '';
        if (p.onClick) return `${sep}<a href="${p.href || '#'}" data-crumb="${i}"${cls}>${escapeHtml(p.label)}</a>`;
        return `${sep}<span class="current${p.cls ? ' ' + p.cls : ''}" aria-current="page">${escapeHtml(p.label)}</span>`;
    }).join('');
    crumbs.querySelectorAll('a[data-crumb]').forEach(a => {
        a.addEventListener('click', (e) => {
            e.preventDefault();
            parts[Number(a.dataset.crumb)].onClick();
        });
    });
}

function initializeNavigation() {
    $('prevBtn').addEventListener('click', () => {
        if (currentNoteIndex > 0) loadNote(currentNotes[currentNoteIndex - 1]);
    });
    $('nextBtn').addEventListener('click', () => {
        if (currentNoteIndex < currentNotes.length - 1) loadNote(currentNotes[currentNoteIndex + 1]);
    });
}

function updatePager() {
    const pager = $('pager');
    if (currentNoteIndex < 0) {
        pager.hidden = true;
        return;
    }
    pager.hidden = false;
    const prev = currentNotes[currentNoteIndex - 1];
    const next = currentNotes[currentNoteIndex + 1];
    $('prevBtn').disabled = !prev;
    $('nextBtn').disabled = !next;
    $('prevTitle').textContent = prev ? prev.title : '';
    $('nextTitle').textContent = next ? next.title : '';
}

// ---------------------------------------------------------------
// Subject home
// ---------------------------------------------------------------
function showSubjectHome(subjectId) {
    const subject = notesData[subjectId];
    const sections = Object.entries(subject.sections).filter(([, notes]) => notes.length > 0);
    const total = sections.reduce((n, [, notes]) => n + notes.length, 0);

    const cards = sections.map(([sectionId, notes]) => `
        <section class="section-card">
            <div class="section-card-head">
                <h2>${escapeHtml(formatSectionTitle(sectionId))}</h2>
                <span class="count">${notes.length} ${notes.length === 1 ? 'note' : 'notes'}</span>
            </div>
            <ol>
                ${notes.map(n => `<li><a href="#${n.id}" data-note-id="${n.id}">${escapeHtml(n.title)}</a></li>`).join('')}
            </ol>
        </section>
    `).join('');

    $('content').innerHTML = `
        <div class="subject-home">
            <h1><span class="swatch" aria-hidden="true"></span>${escapeHtml(subject.name)}</h1>
            <p class="lead">${escapeHtml(subject.description)}: <strong>${total} notes</strong> in ${sections.length} ${sections.length === 1 ? 'section' : 'sections'}.</p>
            <div class="section-grid">${cards}</div>
        </div>
    `;

    $('content').querySelectorAll('a[data-note-id]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            loadNote(findNote(link.dataset.noteId).note);
        });
    });

    currentNote = null;
    currentNoteIndex = -1;
    updateActiveLink(null);
    updatePager();
    setCrumbs([{ label: subject.name }]);
    document.title = `${subject.name} · Study Notes`;
    window.scrollTo({ top: 0 });
    updateProgress();
}

// ---------------------------------------------------------------
// Notes
// ---------------------------------------------------------------
function getBasePath() {
    if (window.location.hostname.includes('github.io')) {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1 && pathParts[1]) return '/' + pathParts[1];
    }
    return '';
}

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

async function loadNote(note, { push = true, section = null } = {}) {
    const found = findNote(note.id);
    if (!found) return;
    setSubjectChrome(found.subjectId);

    currentNote = note;
    currentNoteIndex = currentNotes.findIndex(n => n.id === note.id);
    updateActiveLink(note.id);

    const subject = notesData[found.subjectId];
    setCrumbs([
        { label: subject.name, cls: 'crumb-subject', href: `#subject:${found.subjectId}`, onClick: () => selectSubject(found.subjectId) },
        { label: note.title }
    ]);
    document.title = `${note.title} · Study Notes`;
    if (push) window.history.pushState({}, '', `#${note.id}`);

    const content = $('content');
    content.innerHTML = '<div class="loading" role="status" aria-label="Loading note"></div>';
    $('pager').hidden = true;

    if (window.location.protocol === 'file:') {
        content.innerHTML = `
            <div class="state">
                <h2>This page needs a local server</h2>
                <p>Browsers block loading notes from <code>file://</code>. In this folder run <code>python -m http.server 8000</code>, then open <code>http://localhost:8000</code>.</p>
            </div>`;
        return;
    }

    try {
        const response = await fetch(getBasePath() + '/' + note.file);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const markdown = await response.text();
        if (currentNote !== note) return; // user navigated away while loading
        renderNote(markdown, found);
    } catch (error) {
        console.error('Error loading note:', error);
        content.innerHTML = `
            <div class="state">
                <h2>Couldn't load “${escapeHtml(note.title)}”</h2>
                <p>The file <code>${escapeHtml(note.file)}</code> returned ${escapeHtml(error.message)}. Check that the path in <code>app.js</code> matches the file in the repo.</p>
            </div>`;
        return;
    }

    updatePager();
    content.focus({ preventScroll: true });

    if (section) {
        requestAnimationFrame(() => scrollToSection(section));
    } else {
        window.scrollTo({ top: 0 });
    }
    updateProgress();
}

function renderNote(markdown, found) {
    const html = marked.parse(markdown, { mangle: false, headerIds: false });
    const article = document.createElement('article');
    article.className = 'note';
    article.innerHTML = html;

    // Heading IDs in the same format the notes' tables of contents use
    article.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => { h.id = slugify(h.textContent || ''); });

    // Subject / section line above the title
    const h1 = article.querySelector('h1');
    if (h1) {
        const meta = document.createElement('div');
        meta.className = 'note-meta';
        meta.innerHTML = `<span class="tag">${escapeHtml(notesData[found.subjectId].name)}</span> · ${escapeHtml(formatSectionTitle(found.sectionId))}`;
        h1.before(meta);
    }

    // Table of contents styling
    article.querySelectorAll('h2').forEach(h2 => {
        if (/^table of contents$/i.test(h2.textContent.trim())) {
            h2.classList.add('toc-title');
            const list = h2.nextElementSibling;
            if (list && (list.tagName === 'UL' || list.tagName === 'OL')) list.classList.add('toc');
            const hr = list && list.nextElementSibling;
            if (hr && hr.tagName === 'HR') hr.remove();
        }
    });

    // Tables: scroll wrapper; drop header rows that are completely empty
    article.querySelectorAll('table').forEach(table => {
        const thead = table.querySelector('thead');
        if (thead && [...thead.querySelectorAll('th')].every(th => !th.textContent.trim())) thead.remove();
        const wrap = document.createElement('div');
        wrap.className = 'table-wrap';
        table.before(wrap);
        wrap.appendChild(table);
    });

    // Mermaid diagrams: ```mermaid blocks become rendered diagrams
    article.querySelectorAll('pre > code.language-mermaid').forEach(code => {
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = code.textContent;
        code.parentElement.replaceWith(div);
    });

    // Code blocks: syntax highlighting and copy button
    article.querySelectorAll('pre > code').forEach(code => {
        if (window.hljs) {
            try { hljs.highlightElement(code); } catch (e) { /* plain text fallback */ }
        }
        const pre = code.parentElement;
        const wrap = document.createElement('div');
        wrap.className = 'code-block';
        pre.before(wrap);
        wrap.appendChild(pre);

        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.textContent = 'Copy';
        btn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(code.textContent);
                btn.textContent = 'Copied';
            } catch (e) {
                btn.textContent = 'Copy failed';
            }
            setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
        });
        wrap.appendChild(btn);
    });

    // In-page anchor links (table of contents)
    article.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href').substring(1);
            if (!targetId) return;
            e.preventDefault();
            scrollToSection(targetId);
            window.history.replaceState(null, '', `#${currentNote.id}-${targetId}`);
        });
    });

    const content = $('content');
    content.innerHTML = '';
    content.appendChild(article);
    renderMermaid(article);
}

function renderMermaid(root) {
    const nodes = root.querySelectorAll('.mermaid');
    if (!nodes.length || !window.mermaid) return;
    const dark = document.documentElement.getAttribute('data-theme') !== 'light';
    try {
        mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'default', securityLevel: 'strict' });
        mermaid.run({ nodes }).catch(() => {});
    } catch (e) { /* leave diagram source visible */ }
}

function scrollToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ---------------------------------------------------------------
// Reading progress
// ---------------------------------------------------------------
function initializeProgress() {
    window.addEventListener('scroll', updateProgress, { passive: true });
    window.addEventListener('resize', updateProgress);
}

function updateProgress() {
    const bar = $('progressBar');
    if (!currentNote) {
        bar.style.width = '0';
        return;
    }
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = max > 0 ? `${Math.min(100, (window.scrollY / max) * 100)}%` : '100%';
}

// ---------------------------------------------------------------
// Search palette
// ---------------------------------------------------------------
function initializeSearch() {
    const palette = $('palette');
    const input = $('searchInput');
    const results = $('searchResults');
    let items = [];
    let active = 0;
    let lastFocus = null;

    const index = Object.keys(notesData).flatMap(subjectId =>
        Object.entries(notesData[subjectId].sections).flatMap(([sectionId, notes]) =>
            notes.map(note => ({
                note,
                subjectId,
                subject: notesData[subjectId].name,
                section: formatSectionTitle(sectionId),
                haystack: `${note.title} ${formatSectionTitle(sectionId)} ${notesData[subjectId].name}`.toLowerCase()
            }))
        )
    );

    function open() {
        lastFocus = document.activeElement;
        palette.hidden = false;
        input.value = '';
        render('');
        input.focus();
    }

    function close() {
        palette.hidden = true;
        if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    function highlight(title, terms) {
        let out = escapeHtml(title);
        terms.forEach(t => {
            if (!t) return;
            const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'ig');
            out = out.replace(re, '<mark>$1</mark>');
        });
        return out;
    }

    function score(entry, terms) {
        const title = entry.note.title.toLowerCase();
        let s = 0;
        for (const t of terms) {
            if (!entry.haystack.includes(t)) return -1;
            if (title.startsWith(t)) s += 3;
            else if (new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`).test(title)) s += 2;
            else if (title.includes(t)) s += 1;
        }
        return s;
    }

    function render(query) {
        const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        let matches;
        if (terms.length === 0) {
            matches = index.filter(e => e.subjectId === currentSubject);
        } else {
            matches = index
                .map(e => ({ e, s: score(e, terms) }))
                .filter(x => x.s >= 0)
                .sort((a, b) => b.s - a.s)
                .slice(0, 30)
                .map(x => x.e);
        }

        items = matches;
        active = 0;

        if (matches.length === 0) {
            results.innerHTML = `<li class="palette-empty">No notes match “${escapeHtml(query)}”. Try a shorter word.</li>`;
            return;
        }

        const heading = terms.length === 0
            ? `<li class="palette-group" role="presentation">All ${escapeHtml(notesData[currentSubject].name)} notes</li>`
            : '';

        results.innerHTML = heading + matches.map((m, i) => `
            <li class="palette-item" role="option" id="opt-${i}" data-index="${i}" aria-selected="${i === 0}"
                style="--item-color: var(--${subjectColorVar(m.subjectId)})">
                <span class="dot" aria-hidden="true"></span>
                <span class="title">${highlight(m.note.title, terms)}</span>
                <span class="where">${escapeHtml(m.subject)} · ${escapeHtml(m.section)}</span>
            </li>`).join('');
        input.setAttribute('aria-activedescendant', 'opt-0');
    }

    function move(delta) {
        if (items.length === 0) return;
        active = (active + delta + items.length) % items.length;
        results.querySelectorAll('.palette-item').forEach((el, i) => {
            el.setAttribute('aria-selected', String(i === active));
            if (i === active) el.scrollIntoView({ block: 'nearest' });
        });
        input.setAttribute('aria-activedescendant', `opt-${active}`);
    }

    function choose(i) {
        const item = items[i];
        if (!item) return;
        close();
        if (window.closeSidebar) window.closeSidebar();
        loadNote(item.note);
    }

    $('searchBtn').addEventListener('click', open);
    $('paletteScrim').addEventListener('click', close);
    input.addEventListener('input', () => render(input.value));
    input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') { e.preventDefault(); move(1); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); move(-1); }
        else if (e.key === 'Enter') { e.preventDefault(); choose(active); }
        else if (e.key === 'Escape') { e.preventDefault(); close(); }
    });
    results.addEventListener('click', (e) => {
        const li = e.target.closest('.palette-item');
        if (li) choose(Number(li.dataset.index));
    });

    document.addEventListener('keydown', (e) => {
        const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            palette.hidden ? open() : close();
        } else if (e.key === '/' && !typing && palette.hidden && $('contactModal').hidden) {
            e.preventDefault();
            open();
        }
    });
}

// ---------------------------------------------------------------
// Contact form
// ---------------------------------------------------------------
function initializeContact() {
    const modal = $('contactModal');
    const form = $('contactForm');

    modal.hidden = true;
    modal.style.display = 'none';

    const openModal = () => {
        modal.hidden = false;
        modal.style.display = '';
        document.body.style.overflow = 'hidden';
        $('contactName').focus();
    };
    const closeModal = () => {
        modal.hidden = true;
        modal.style.display = 'none';
        document.body.style.overflow = '';
        $('contactBtn').focus();
    };

    $('contactBtn').addEventListener('click', openModal);
    $('contactModalClose').addEventListener('click', closeModal);
    $('contactModalOverlay').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.hidden) closeModal();
    });

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = $('submitBtn');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoader = submitBtn.querySelector('.btn-loader');
        const formMessage = $('formMessage');

        submitBtn.disabled = true;
        btnText.hidden = true;
        btnLoader.hidden = false;
        formMessage.hidden = true;

        const formData = {
            access_key: WEB3FORMS_ACCESS_KEY,
            name: $('contactName').value,
            email: $('contactEmail').value,
            subject: $('contactSubject').value,
            message: $('contactMessage').value,
            botcheck: $('contactHoneypot').checked
        };

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(formData)
            });
            const result = await response.json();
            if (!result.success) throw new Error(result.message || 'The message was not sent.');

            formMessage.textContent = 'Message sent. Thanks for the feedback.';
            formMessage.className = 'form-message success';
            formMessage.hidden = false;
            form.reset();
            setTimeout(() => { closeModal(); formMessage.hidden = true; }, 2000);
        } catch (error) {
            console.error('Error sending message:', error);
            formMessage.textContent = `Message not sent: ${error.message || 'check your connection and try again.'}`;
            formMessage.className = 'form-message error';
            formMessage.hidden = false;
        } finally {
            submitBtn.disabled = false;
            btnText.hidden = false;
            btnLoader.hidden = true;
        }
    });
}

// ---------------------------------------------------------------
// Theme and print
// ---------------------------------------------------------------
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const css = $('hljsTheme');
    if (css) {
        css.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme === 'dark' ? 'github-dark' : 'github'}.min.css`;
    }
    $('themeBtn').setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
}

function initializeTheme() {
    let theme = 'dark';
    try { theme = localStorage.getItem('theme') || 'dark'; } catch (e) {}
    applyTheme(theme);

    $('themeBtn').addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem('theme', next); } catch (e) {}
    });
}

function initializePrint() {
    $('printBtn').addEventListener('click', () => window.print());
}
