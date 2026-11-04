// Notes data structure organized by subject
const notesData = {
    'dbms': {
        name: 'DBMS',
        description: 'Database Management Systems',
        icon: '🗄️',
        sections: {
            'acid-properties': [
                { id: 'dbms-01', title: 'ACID Properties Introduction', file: 'notes/dbms/01_ACID_Properties_Introduction.md', date: '2025-12-26' },
                { id: 'dbms-02', title: 'What is a Transaction?', file: 'notes/dbms/02_What_is_a_Transaction.md', date: '2025-12-26' },
                { id: 'dbms-03', title: 'Atomicity', file: 'notes/dbms/03_Atomicity.md', date: '2025-12-26' },
                { id: 'dbms-04', title: 'Isolation', file: 'notes/dbms/04_Isolation.md', date: '2025-12-26' },
                { id: 'dbms-05', title: 'Consistency', file: 'notes/dbms/05_Consistency.md', date: '2025-12-26' },
                { id: 'dbms-06', title: 'Durability', file: 'notes/dbms/06_Durability.md', date: '2025-12-26' },
                { id: 'dbms-07', title: 'ACID Properties Hands-On', file: 'notes/dbms/07_ACID_Properties_Hands_On.md', date: '2025-12-26' },
                { id: 'dbms-08', title: 'Phantom Reads', file: 'notes/dbms/08_Phantom_Reads.md', date: '2025-12-26' },
                { id: 'dbms-09', title: 'Serializable vs Repeatable Read', file: 'notes/dbms/09_Serializable_vs_Repeatable_Read.md', date: '2025-12-26' },
                { id: 'dbms-10', title: 'Eventual Consistency', file: 'notes/dbms/10_Eventual_Consistency.md', date: '2025-12-26' }
            ],
            'database-storage': [
                { id: 'dbms-11', title: 'Tables and Indexes Storage', file: 'notes/dbms/11_Tables_and_Indexes_Storage.md', date: '2025-12-26' },
                { id: 'dbms-12', title: 'Row vs Column Storage', file: 'notes/dbms/12_Row_vs_Column_Storage.md', date: '2025-12-26' },
                { id: 'dbms-13', title: 'Primary Key vs Secondary Key', file: 'notes/dbms/13_Primary_Key_vs_Secondary_Key.md', date: '2025-12-26' },
                { id: 'dbms-14', title: 'Database Pages', file: 'notes/dbms/14_Database_Pages.md', date: '2025-12-26' }
            ],
            'database-indexing': [
                { id: 'dbms-15', title: 'Create Postgres Table with Million Rows', file: 'notes/dbms/15_Create_Postgres_Table_with_Million_Rows.md', date: '2025-12-26' },
                { id: 'dbms-16', title: 'Getting Started with Indexing', file: 'notes/dbms/16_Getting_Started_with_Indexing.md', date: '2025-12-26' },
                { id: 'dbms-17', title: 'SQL Query Planner and Optimizer', file: 'notes/dbms/17_SQL_Query_Planner_and_Optimizer_Explain.md', date: '2025-12-26' }
            ]
        }
    },
    'java': {
        name: 'JAVA',
        description: 'Java Programming Language',
        icon: '☕',
        sections: {
            'oops-concepts': [
                { id: 'java-01', title: 'OOPs Concepts In Java', file: 'notes/java/01_OOPs_Concepts.md', date: '2025-12-25' }
            ],
            'java-basics': [
                { id: 'java-02', title: 'Java Overview', file: 'notes/java/02_Java_Overview.md', date: '2025-12-25' },
                { id: 'java-03', title: 'Why One Public Class Per File?', file: 'notes/java/03_Why_One_Public_Class_Per_File.md', date: '2025-12-26' },
                { id: 'java-04', title: 'Java Variables', file: 'notes/java/04_Java_Variables.md', date: '2025-12-26' },
                { id: 'java-05', title: 'Java Methods', file: 'notes/java/05_Java_Methods.md', date: '2025-12-26' },
                { id: 'java-06', title: 'Java Constructors', file: 'notes/java/06_Java_Constructors.md', date: '2025-12-26' }
            ],
            'java-memory-management': [
                { id: 'java-07', title: 'Java Memory Management', file: 'notes/java/07_Java_Memory_Management.md', date: '2025-12-26' }
            ],
            'java-advanced-classes': [
                { id: 'java-08', title: 'Java Types of Classes - Part 1', file: 'notes/java/08_Java_Types_of_Classes_Part1.md', date: '2025-12-26' },
                { id: 'java-09', title: 'Java Generic Classes', file: 'notes/java/09_Java_Generic_Classes.md', date: '2025-12-26' },
                { id: 'java-10', title: 'Java POJOs, Enums, and Final Classes', file: 'notes/java/10_Java_POJOs_Enums_Final_Classes.md', date: '2025-12-27' },
                { id: 'java-11', title: 'Java Singleton, Immutable, and Wrapper Classes', file: 'notes/java/11_Java_Singleton_Immutable_Wrapper_Classes.md', date: '2025-12-27' }
            ],
            'java-interfaces': [
                { id: 'java-12', title: 'Java Interfaces - Part 1', file: 'notes/java/12_Java_Interfaces_Part1.md', date: '2025-12-27' },
                { id: 'java-13', title: 'Java Interfaces - Part 2: Java 8 & 9 Features', file: 'notes/java/13_Java_Interfaces_Part2_Java8_Java9_Features.md', date: '2025-12-27' }
            ],
            'java-functional-programming': [
                { id: 'java-14', title: 'Java Functional Interface and Lambda Expression', file: 'notes/java/14_Java_Functional_Interface_Lambda_Expression.md', date: '2025-12-27' }
            ],
            'java-advanced-topics': [
                { id: 'java-15', title: 'Java Reflection', file: 'notes/java/15_Java_Reflection.md', date: '2025-12-27' },
                { id: 'java-16', title: 'Java Annotations', file: 'notes/java/16_Java_Annotations.md', date: '2025-12-27' },
                { id: 'java-17', title: 'Java Exception Handling', file: 'notes/java/17_Java_Exception_Handling.md', date: '2025-12-27' },
                { id: 'java-18', title: 'Java Operators', file: 'notes/java/18_Java_Operators.md', date: '2025-12-27' },
                { id: 'java-19', title: 'Java Control Flow Statements', file: 'notes/java/19_Java_Control_Flow_Statements.md', date: '2025-12-27' }
            ],
            'java-collections': [
                { id: 'java-20', title: 'Java Collection Framework - Introduction', file: 'notes/java/20_Java_Collection_Framework_Introduction.md', date: '2025-12-27' },
                { id: 'java-21', title: 'Java Queue, PriorityQueue, Comparator, and Comparable', file: 'notes/java/21_Java_Queue_PriorityQueue_Comparator_Comparable.md', date: '2025-12-27' },
                { id: 'java-22', title: 'Java Deque, List Implementations', file: 'notes/java/22_Java_Deque_List_Implementations.md', date: '2025-12-27' },
                { id: 'java-23', title: 'Java Map and HashMap Internals', file: 'notes/java/23_Java_Map_HashMap_Internals.md', date: '2025-12-27' },
                { id: 'java-42', title: 'HashMap Deep Dive: Hashing, Resize and Treeification', file: 'notes/java/42_HashMap_Deep_Dive_Hashing_Resize_Treeify.md', date: '2026-10-30' },
                { id: 'java-24', title: 'Java LinkedHashMap and TreeMap', file: 'notes/java/24_Java_LinkedHashMap_TreeMap.md', date: '2025-12-27' },
                { id: 'java-25', title: 'Java Set Implementations', file: 'notes/java/25_Java_Set_Implementations.md', date: '2025-12-27' },
                { id: 'java-26', title: 'Java Streams', file: 'notes/java/26_Java_Streams.md', date: '2025-12-27' }
            ],
            'java-threading': [
                { id: 'java-27', title: 'Java Threading - Part 1: Introduction, Process, and Thread', file: 'notes/java/27_Java_Threading_Part1_Introduction_Process_Thread.md', date: '2025-12-27' },
                { id: 'java-28', title: 'Java Threading - Part 2: Thread Creation, Synchronization', file: 'notes/java/28_Java_Threading_Part2_Creation_Synchronization.md', date: '2025-12-27' },
                { id: 'java-29', title: 'Java Threading - Part 3: Deprecated Methods, Join, Priority, Daemon', file: 'notes/java/29_Java_Threading_Part3_Deprecated_Methods_Join_Priority_Daemon.md', date: '2025-12-27' },
                { id: 'java-30', title: 'Java Threading - Part 4: Locks (Reentrant, Read-Write, Semaphore)', file: 'notes/java/30_Java_Threading_Part4_Locks_Reentrant_ReadWrite_Semaphore.md', date: '2025-12-27' },
                { id: 'java-31', title: 'Java Threading - Part 5: Atomic Variables and Volatile', file: 'notes/java/31_Java_Threading_Part5_Atomic_Variables_Volatile.md', date: '2025-12-27' },
                { id: 'java-32', title: 'Java Threading - Part 6: Thread Pool Executor', file: 'notes/java/32_Java_Threading_Part6_Thread_Pool_Executor.md', date: '2025-12-27' },
                { id: 'java-33', title: 'Java Threading - Part 7: Future, Callable, and CompletableFuture', file: 'notes/java/33_Java_Threading_Part7_Future_Callable_CompletableFuture.md', date: '2025-12-27' },
                { id: 'java-34', title: 'Java Threading - Part 8: Executors Utility and Fork-Join Pool', file: 'notes/java/34_Java_Threading_Part8_Executors_Utility_ForkJoinPool.md', date: '2025-12-27' },
                { id: 'java-35', title: 'Java Threading - Part 9: Shutdown, Scheduled Executor, ThreadLocal, Virtual Threads', file: 'notes/java/35_Java_Threading_Part9_Shutdown_ScheduledExecutor_ThreadLocal_VirtualThreads.md', date: '2025-12-27' }
            ],
            'java-modern-features': [
                { id: 'java-36', title: 'Java Lombok Library', file: 'notes/java/36_Java_Lombok_Library.md', date: '2025-12-27' },
                { id: 'java-37', title: 'Java 21: Sequence Collections', file: 'notes/java/37_Java_21_Sequence_Collections.md', date: '2025-12-27' },
                { id: 'java-38', title: 'Java 17: Sealed Classes and Interfaces', file: 'notes/java/38_Java_17_Sealed_Classes_Interfaces.md', date: '2025-12-27' },
                { id: 'java-39', title: 'Java 14: Switch Enhancements', file: 'notes/java/39_Java_14_Switch_Enhancements.md', date: '2025-12-27' },
                { id: 'java-40', title: 'Java Pattern Matching: instanceof (Java 16) and Switch (Java 21)', file: 'notes/java/40_Java_Pattern_Matching_Instanceof_Switch.md', date: '2025-12-27' },
                { id: 'java-41', title: 'Java 16: Records', file: 'notes/java/41_Java_16_Records.md', date: '2025-12-27' }
            ]
        }
    },
    'dsa': {
        name: 'DSA',
        description: 'Data Structures & Algorithms',
        icon: '🧩',
        sections: {
            'arrays-and-hashing': [
                { id: 'dsa-01', title: 'Two Sum', file: 'notes/dsa/01_Two_Sum.md', date: '2026-10-23' },
                { id: 'dsa-02', title: 'Product of Array Except Self', file: 'notes/dsa/02_Product_of_Array_Except_Self.md', date: '2026-10-23' },
                { id: 'dsa-03', title: 'Subarray Sum Equals K', file: 'notes/dsa/03_Subarray_Sum_Equals_K.md', date: '2026-10-24' }
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
                { id: 'hld-01', title: 'Price-Drop Alerts for Watched Products', file: 'notes/hld/01_Price_Drop_Alerts.md', date: '2026-10-24' }
            ]
        }
    },
    'lld': {
        name: 'LLD',
        description: 'Low Level Design',
        icon: '🔧',
        sections: {
            'design-principles': [
                { id: 'lld-01', title: 'SOLID Principles (Applied to a Spring Boot Service)', file: 'notes/lld/01_SOLID_Principles.md', date: '2026-10-25' }
            ]
        }
    }
};

// Subjects that have at least one note (empty subjects stay hidden until notes are added)
const subjects = Object.keys(notesData).filter(id => getAllNotesForSubject(id).length > 0);

// Short blurbs for the topic cards on the home page (falls back to the subject description)
const subjectBlurbs = {
    dbms: 'ACID, isolation levels, storage engines, pages and indexing, with hands-on Postgres experiments.',
    java: 'Language core to concurrency: collections internals, threading, executors and modern Java features.',
    dsa: 'Interview problems with the pattern, the key insight and a quick-revision table for each.',
    hld: 'System design case studies: requirements, estimates, architecture and the trade-offs interviewers probe.',
    lld: 'Object-oriented design, SOLID and design patterns applied to real services and interview problems.',
    springboot: 'Spring Boot fundamentals for building production services.'
};

// Short names for the side menu and tags
const subjectShort = { dbms: 'Databases', java: 'Java', dsa: 'DSA', hld: 'High Level Design', lld: 'Low Level Design', springboot: 'Spring Boot' };
const shortName = (id) => subjectShort[id] || notesData[id].name;

// ---------------------------------------------------------------
// State and small helpers
// ---------------------------------------------------------------
let currentSubject = null;
let currentNoteIndex = -1;
let currentNotes = [];
let currentNote = null;
let featuredTimer = null;
let tocObserver = null;
const expanded = new Set();      // tree nodes the reader opened: "s:java", "s:java/java-threading"
const metaCache = new Map();     // note.id -> Promise<{ description, minutes }>

// Web3Forms API Key (https://web3forms.com)
const WEB3FORMS_ACCESS_KEY = '2a413337-40d1-40e1-8349-1b397504c446';

const $ = (id) => document.getElementById(id);

function getAllNotesForSubject(subjectId) {
    if (!notesData[subjectId]) return [];
    return Object.values(notesData[subjectId].sections).flat();
}

function findNote(noteId) {
    for (const subjectId of Object.keys(notesData)) {
        for (const [sectionId, notes] of Object.entries(notesData[subjectId].sections)) {
            const note = notes.find(n => n.id === noteId);
            if (note) return { note, subjectId, sectionId };
        }
    }
    return null;
}

function allEntries() {
    let order = 0;
    return subjects.flatMap(subjectId =>
        Object.entries(notesData[subjectId].sections).flatMap(([sectionId, notes]) =>
            notes.map(note => ({ note, subjectId, sectionId, order: order++ }))
        )
    );
}

function latestEntries(limit) {
    return allEntries()
        .sort((a, b) => (b.note.date || '').localeCompare(a.note.date || '') || b.order - a.order)
        .slice(0, limit);
}

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

function slugify(text) {
    return text.toLowerCase().trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-+|-+$/g, '');
}

function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T00:00:00');
    if (isNaN(d)) return '';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function subjectColorVar(subjectId) {
    return ['dbms', 'java', 'dsa', 'hld', 'lld', 'springboot'].includes(subjectId) ? subjectId : 'other';
}

function pad2(n) { return String(n).padStart(2, '0'); }

function getBasePath() {
    if (window.location.hostname.includes('github.io')) {
        const pathParts = window.location.pathname.split('/');
        if (pathParts.length > 1 && pathParts[1]) return '/' + pathParts[1];
    }
    return '';
}

function fetchMarkdown(note) {
    return fetch(getBasePath() + '/' + note.file).then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.text();
    });
}

function plainText(el) {
    return (el ? el.textContent : '').replace(/\s+/g, ' ').trim();
}

function describe(markdown) {
    const words = markdown.replace(/```[\s\S]*?```/g, ' ').split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 220));
    let description = '';
    try {
        const doc = document.createElement('div');
        doc.innerHTML = marked.parse(markdown);
        const first = [...doc.querySelectorAll('p, blockquote')].find(p => plainText(p).length > 40 && !/:$/.test(plainText(p)));
        description = plainText(first).replace(/^>\s*/, '');
        if (description.length > 230) description = description.slice(0, 227).replace(/\s+\S*$/, '') + '…';
    } catch (e) { /* no description */ }
    return { description, minutes };
}

function getMeta(note) {
    if (!metaCache.has(note.id)) {
        metaCache.set(note.id, fetchMarkdown(note).then(describe).catch(() => ({ description: '', minutes: 0 })));
    }
    return metaCache.get(note.id);
}

// ---------------------------------------------------------------
// Init and routing
// ---------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
    buildTree();
    buildTopicsMenu();
    initializeSidebarToggle();
    initializeSearch();
    initializeContact();
    initializeTheme();
    initializeProgress();
    $('brandLink').addEventListener('click', (e) => { e.preventDefault(); showHome(); });
    routeFromHash();
});

window.addEventListener('popstate', routeFromHash);

function routeFromHash() {
    const hash = decodeURIComponent(window.location.hash.substring(1));
    if (!hash) { showHome({ push: false }); return; }
    if (hash.startsWith('subject:')) { selectSubject(hash.split(':')[1], { push: false }); return; }

    // "#noteId" or "#noteId-section-anchor"
    const ids = allEntries().map(e => e.note.id);
    const noteId = ids.filter(id => hash === id || hash.startsWith(id + '-')).sort((a, b) => b.length - a.length)[0];
    if (noteId) {
        const section = hash.length > noteId.length ? hash.substring(noteId.length + 1) : null;
        loadNote(findNote(noteId).note, { push: false, section });
        return;
    }
    showHome({ push: false });
}

function setView(view) {
    document.body.dataset.view = view;
    if (view !== 'note') {
        $('toc').hidden = true;
        document.body.classList.remove('has-side-toc');
        if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
    }
    if (view !== 'home' && featuredTimer) { clearInterval(featuredTimer); featuredTimer = null; }
}

function setSubject(subjectId) {
    currentSubject = subjectId;
    currentNotes = getAllNotesForSubject(subjectId);
    document.body.dataset.subject = subjectId || '';
}

function bindNoteLinks(root) {
    root.querySelectorAll('a[data-note-id]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const found = findNote(link.dataset.noteId);
            if (found) loadNote(found.note);
        });
    });
    root.querySelectorAll('a[data-subject-link]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            selectSubject(link.dataset.subjectLink, { anchor: link.dataset.section || null });
        });
    });
}

// ---------------------------------------------------------------
// Top bar: topics dropdown
// ---------------------------------------------------------------
function buildTopicsMenu() {
    const panel = $('topicsList');
    const btn = $('topicsBtn');
    panel.innerHTML = subjects.map(id => {
        const s = notesData[id];
        const n = getAllNotesForSubject(id).length;
        return `<a class="dropdown-item" href="#subject:${id}" data-subject-link="${id}" style="--dot: var(--${subjectColorVar(id)})">
            <span class="dot" aria-hidden="true"></span>
            <span class="name">${escapeHtml(s.description)}</span>
            <span class="count">${n}</span>
            <span class="desc">${escapeHtml(subjectBlurbs[id] || s.description)}</span>
        </a>`;
    }).join('');
    bindNoteLinks(panel);

    const setOpen = (open) => { panel.hidden = !open; btn.setAttribute('aria-expanded', String(open)); };
    btn.addEventListener('click', (e) => { e.stopPropagation(); setOpen(panel.hidden); });
    panel.addEventListener('click', () => setOpen(false));
    document.addEventListener('click', (e) => { if (!$('topicsMenu').contains(e.target)) setOpen(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

// ---------------------------------------------------------------
// Sidebar topic tree
// ---------------------------------------------------------------
const chevron = '<svg class="chev" viewBox="0 0 24 24" width="13" height="13" aria-hidden="true"><path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';

function buildTree() {
    const nav = $('navMenu');
    nav.innerHTML = `<ul>${subjects.map(subjectId => {
        const subject = notesData[subjectId];
        const sections = Object.entries(subject.sections).filter(([, notes]) => notes.length);
        const count = sections.reduce((n, [, notes]) => n + notes.length, 0);
        return `
        <li class="tree-subject" data-subject="${subjectId}" style="--dot: var(--${subjectColorVar(subjectId)})">
            <button class="tree-toggle" type="button" data-key="s:${subjectId}" aria-expanded="false">
                <span class="dot" aria-hidden="true"></span>
                <span class="label">${escapeHtml(shortName(subjectId))}</span>
                <span class="count">${count}</span>${chevron}
            </button>
            <ul class="tree-group" hidden>
                ${sections.map(([sectionId, notes]) => `
                <li class="tree-section">
                    <button class="tree-toggle" type="button" data-key="s:${subjectId}/${sectionId}" aria-expanded="false">
                        <span class="label">${escapeHtml(formatSectionTitle(sectionId))}</span>
                        <span class="count">${notes.length}</span>${chevron}
                    </button>
                    <ul class="tree-notes" hidden>
                        ${notes.map(n => `<li><a class="nav-link" href="#${n.id}" data-note-id="${n.id}">${escapeHtml(n.title)}</a></li>`).join('')}
                    </ul>
                </li>`).join('')}
            </ul>
        </li>`;
    }).join('')}</ul>`;

    nav.querySelectorAll('.tree-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const key = btn.dataset.key;
            expanded.has(key) ? expanded.delete(key) : expanded.add(key);
            syncTree();
        });
    });
    bindNoteLinks(nav);
}

function syncTree(activeNoteId = currentNote ? currentNote.id : null) {
    document.querySelectorAll('#navMenu .tree-toggle').forEach(btn => {
        const open = expanded.has(btn.dataset.key);
        btn.setAttribute('aria-expanded', String(open));
        btn.nextElementSibling.hidden = !open;
    });
    document.querySelectorAll('#navMenu .tree-subject').forEach(li => {
        li.classList.toggle('is-current', li.dataset.subject === currentSubject);
    });
    document.querySelectorAll('#navMenu .nav-link').forEach(link => {
        const active = link.dataset.noteId === activeNoteId;
        link.classList.toggle('active', active);
        if (active) {
            link.setAttribute('aria-current', 'page');
            requestAnimationFrame(() => link.scrollIntoView({ block: 'nearest' }));
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

function revealInTree(subjectId, sectionId) {
    expanded.add(`s:${subjectId}`);
    if (sectionId) expanded.add(`s:${subjectId}/${sectionId}`);
    syncTree();
}

function initializeSidebarToggle() {
    const open = (state) => {
        document.body.classList.toggle('nav-open', state);
        $('scrim').hidden = !state;
        $('menuBtn').setAttribute('aria-expanded', String(state));
    };
    $('menuBtn').addEventListener('click', () => {
        // on the home page the tree is hidden; show it as a drawer anyway
        open(!document.body.classList.contains('nav-open'));
    });
    $('scrim').addEventListener('click', () => open(false));
    $('navMenu').addEventListener('click', (e) => { if (e.target.closest('.nav-link')) open(false); });
    window.closeSidebar = () => open(false);
}

// ---------------------------------------------------------------
// Home
// ---------------------------------------------------------------
function showHome({ push = true } = {}) {
    setView('home');
    setSubject(null);
    currentNote = null;
    currentNoteIndex = -1;
    syncTree(null);
    if (push) window.history.pushState({}, '', window.location.pathname);
    document.title = 'Study Notes · DBMS, Java, DSA, HLD, LLD';

    const entries = allEntries();
    const latest = latestEntries(8);
    const featured = latest.slice(0, 5);
    const sectionCount = subjects.reduce((n, id) => n + Object.values(notesData[id].sections).filter(s => s.length).length, 0);
    const startNote = latest[0] ? latest[0].note : null;

    const tracks = subjects.map((id, i) => {
        const s = notesData[id];
        const n = getAllNotesForSubject(id).length;
        return `<a class="track" href="#subject:${id}" data-subject-link="${id}">
            <span class="num">${pad2(i + 1)}</span>
            <h3>${escapeHtml(s.description)}</h3>
            <p>${escapeHtml(subjectBlurbs[id] || s.description)}</p>
            <span class="foot"><span>${n} ${n === 1 ? 'note' : 'notes'}</span><span class="arrow" aria-hidden="true">&rarr;</span></span>
        </a>`;
    }).join('');

    const latestRows = latest.map((e, i) => `
        <li><a href="#${e.note.id}" data-note-id="${e.note.id}">
            <span class="idx">${pad2(i + 1)}</span>
            <span class="body">
                <span class="eyebrow">${escapeHtml(notesData[e.subjectId].description)}</span>
                <h3>${escapeHtml(e.note.title)}</h3>
                <p data-desc="${e.note.id}"></p>
            </span>
            <span class="when"><span data-mins="${e.note.id}"></span><br>${escapeHtml(formatDate(e.note.date))}</span>
        </a></li>`).join('');

    const sectionPills = subjects.flatMap(id =>
        Object.entries(notesData[id].sections).filter(([, n]) => n.length).map(([sectionId]) =>
            `<a class="pill" href="#subject:${id}" data-subject-link="${id}" data-section="${sectionId}">${escapeHtml(formatSectionTitle(sectionId))}</a>`)
    ).join('');

    $('content').innerHTML = `
    <div class="home">
        <section class="hero">
            <div>
                <span class="eyebrow muted"><span class="dot" style="--dot: var(--accent)"></span>Interview prep notebook</span>
                <h1 class="hero-title">Engineering notes,<br><em>written to revise from</em></h1>
                <p class="hero-lead">Databases, Java, data structures, system design and low-level design, written up while preparing for SDE-2 interviews. Each note has the code, the diagrams and the trade-offs that come up in rounds.</p>
                <div class="hero-actions">
                    ${startNote ? `<a class="btn btn-primary" href="#${startNote.id}" data-note-id="${startNote.id}">Start reading</a>` : ''}
                    <a class="btn" href="#tracks" id="browseBtn">Browse topics</a>
                </div>
            </div>
            <div class="featured" aria-roledescription="carousel" aria-label="Recently added notes">
                <div class="featured-head">
                    <span class="eyebrow muted">Recently added</span>
                    <div class="featured-dots" id="featuredDots">
                        ${featured.map((e, i) => `<button type="button" aria-label="Show ${escapeHtml(e.note.title)}" data-i="${i}"${i === 0 ? ' aria-current="true"' : ''}></button>`).join('')}
                    </div>
                </div>
                <div id="featuredSlot"></div>
            </div>
        </section>

        <section class="stats" aria-label="At a glance">
            <div class="stat"><b>${entries.length}</b><span>Notes</span></div>
            <div class="stat"><b>${subjects.length}</b><span>Topics</span></div>
            <div class="stat"><b>${sectionCount}</b><span>Sections</span></div>
            <a class="stat" href="progress/"><b id="mockCount">–</b><span>Mock rounds</span></a>
        </section>

        <section class="block" id="tracks">
            <div class="block-head">
                <h2>What would you like to revise?</h2>
                <span class="aside">${subjects.length} topics · ${entries.length} notes</span>
            </div>
            <div class="tracks">${tracks}</div>
        </section>

        <section class="block">
            <div class="home-split">
                <div>
                    <div class="block-head"><h2>Latest</h2></div>
                    <ol class="latest">${latestRows}</ol>
                </div>
                <aside class="rail">
                    <div>
                        <div class="sidebar-label">Sections</div>
                        <div class="pills">${sectionPills}</div>
                    </div>
                    <div class="rail-card" id="progressCard">
                        <h3>SDE-2 readiness</h3>
                        <p>Every mock round is scored against the SDE-2 bar and logged to the dashboard.</p>
                        <a class="text-link" href="progress/">Open the dashboard &rarr;</a>
                    </div>
                </aside>
            </div>
        </section>
    </div>`;

    const content = $('content');
    bindNoteLinks(content);
    $('browseBtn').addEventListener('click', (e) => {
        e.preventDefault();
        $('tracks').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });

    // descriptions and read times for the latest list
    latest.forEach(e => getMeta(e.note).then(meta => {
        const p = content.querySelector(`[data-desc="${e.note.id}"]`);
        const m = content.querySelector(`[data-mins="${e.note.id}"]`);
        if (p) p.textContent = meta.description;
        if (m && meta.minutes) m.textContent = `${meta.minutes} min`;
    }));

    // featured carousel
    let fi = 0;
    const showFeatured = (i) => {
        fi = i;
        const e = featured[i];
        if (!e) return;
        document.querySelectorAll('#featuredDots button').forEach((b, j) => b.setAttribute('aria-current', String(j === i)));
        const slot = $('featuredSlot');
        if (!slot) return;
        slot.innerHTML = `<a class="featured-card" href="#${e.note.id}" data-note-id="${e.note.id}">
            <span class="eyebrow">${escapeHtml(notesData[e.subjectId].description)}</span>
            <h2>${escapeHtml(e.note.title)}</h2>
            <p data-fdesc>&nbsp;</p>
            <div class="when">${escapeHtml(formatSectionTitle(e.sectionId))} · ${escapeHtml(formatDate(e.note.date))}</div>
        </a>`;
        bindNoteLinks(slot);
        getMeta(e.note).then(meta => {
            const p = slot.querySelector('[data-fdesc]');
            if (p && fi === i) p.textContent = meta.description;
        });
    };
    showFeatured(0);
    document.querySelectorAll('#featuredDots button').forEach(b => b.addEventListener('click', () => {
        showFeatured(Number(b.dataset.i));
        if (featuredTimer) { clearInterval(featuredTimer); featuredTimer = null; }
    }));
    if (featuredTimer) clearInterval(featuredTimer);
    const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (featured.length > 1 && !reduceMotion) {
        featuredTimer = setInterval(() => showFeatured((fi + 1) % featured.length), 7000);
    }

    // mock rounds from the progress log
    fetch(getBasePath() + '/progress/sessions.json').then(r => r.ok ? r.json() : null).then(data => {
        const sessions = (data && data.sessions) || [];
        const count = $('mockCount');
        if (count) count.textContent = String(sessions.length);
        const last = sessions[sessions.length - 1];
        const card = $('progressCard');
        if (last && card) {
            card.innerHTML = `
                <h3>Last mock round</h3>
                <div class="score">${escapeHtml(String(last.score))}<small> / 10</small></div>
                <p style="margin-top:10px">${escapeHtml(last.title)}<br><span style="color:var(--text-3)">${escapeHtml(formatDate(last.date))}</span></p>
                <a class="text-link" href="progress/">Open the dashboard &rarr;</a>`;
        }
    }).catch(() => {});

    $('pager') && ($('pager').hidden = true);
    window.scrollTo({ top: 0 });
    updateProgress();
}

// ---------------------------------------------------------------
// Subject page
// ---------------------------------------------------------------
function selectSubject(subjectId, { push = true, anchor = null } = {}) {
    if (!notesData[subjectId] || !subjects.includes(subjectId)) { showHome({ push }); return; }
    setView('subject');
    setSubject(subjectId);
    currentNote = null;
    currentNoteIndex = -1;
    expanded.add(`s:${subjectId}`);
    syncTree(null);
    if (push) window.history.pushState({}, '', `#subject:${subjectId}`);

    const subject = notesData[subjectId];
    const sections = Object.entries(subject.sections).filter(([, notes]) => notes.length > 0);
    const total = sections.reduce((n, [, notes]) => n + notes.length, 0);
    const updated = getAllNotesForSubject(subjectId).map(n => n.date || '').sort().pop();
    let idx = 0;

    $('content').innerHTML = `
    <div class="subject-page">
        <a class="eyebrow" href="#" id="homeCrumb">All topics</a>
        <h1 class="page-title">${escapeHtml(subject.description)}</h1>
        <p class="page-lead">${escapeHtml(subjectBlurbs[subjectId] || subject.description)}</p>
        <div class="meta-row">
            <span>${total} ${total === 1 ? 'note' : 'notes'}</span><span class="sep">·</span>
            <span>${sections.length} ${sections.length === 1 ? 'section' : 'sections'}</span>
            ${updated ? `<span class="sep">·</span><span>Updated ${escapeHtml(formatDate(updated))}</span>` : ''}
        </div>
        ${sections.map(([sectionId, notes]) => `
        <section class="subject-section" id="sec-${sectionId}">
            <h2>${escapeHtml(formatSectionTitle(sectionId))}<span class="count">${notes.length} ${notes.length === 1 ? 'note' : 'notes'}</span></h2>
            <ol class="note-rows">
                ${notes.map(n => `<li><a href="#${n.id}" data-note-id="${n.id}">
                    <span class="idx">${pad2(++idx)}</span>
                    <span class="t">${escapeHtml(n.title)}</span>
                    <span class="when">${escapeHtml(formatDate(n.date))}</span>
                </a></li>`).join('')}
            </ol>
        </section>`).join('')}
    </div>`;

    bindNoteLinks($('content'));
    $('homeCrumb').addEventListener('click', (e) => { e.preventDefault(); showHome(); });
    document.title = `${subject.description} · Study Notes`;
    if (anchor && $(`sec-${anchor}`)) {
        requestAnimationFrame(() => $(`sec-${anchor}`).scrollIntoView({ block: 'start' }));
    } else {
        window.scrollTo({ top: 0 });
    }
    updateProgress();
}

// ---------------------------------------------------------------
// Note page
// ---------------------------------------------------------------
async function loadNote(note, { push = true, section = null } = {}) {
    const found = findNote(note.id);
    if (!found) return;
    setView('note');
    setSubject(found.subjectId);

    currentNote = note;
    currentNoteIndex = currentNotes.findIndex(n => n.id === note.id);
    revealInTree(found.subjectId, found.sectionId);
    syncTree(note.id);

    document.title = `${note.title} · Study Notes`;
    if (push) window.history.pushState({}, '', `#${note.id}`);

    const content = $('content');
    content.innerHTML = '<div class="loading" role="status" aria-label="Loading note"></div>';
    $('toc').hidden = true;

    if (window.location.protocol === 'file:') {
        content.innerHTML = `
            <div class="state">
                <h2>This page needs a local server</h2>
                <p>Browsers block loading notes from <code>file://</code>. In this folder run <code>python -m http.server 8000</code>, then open <code>http://localhost:8000</code>.</p>
            </div>`;
        return;
    }

    let markdown;
    try {
        markdown = await fetchMarkdown(note);
    } catch (error) {
        console.error('Error loading note:', error);
        content.innerHTML = `
            <div class="state">
                <h2>Couldn't load “${escapeHtml(note.title)}”</h2>
                <p>The file <code>${escapeHtml(note.file)}</code> returned ${escapeHtml(error.message)}. Check that the path in <code>app.js</code> matches the file in the repo.</p>
            </div>`;
        return;
    }
    if (currentNote !== note) return; // reader navigated away while loading

    renderNote(markdown, found);
    content.focus({ preventScroll: true });
    if (section) requestAnimationFrame(() => scrollToSection(section, false));
    else window.scrollTo({ top: 0 });
    updateProgress();
}

function renderNote(markdown, found) {
    const { note, subjectId, sectionId } = found;
    const subject = notesData[subjectId];
    const meta = describe(markdown);
    metaCache.set(note.id, Promise.resolve(meta));

    const article = document.createElement('article');
    article.className = 'note';
    article.innerHTML = marked.parse(markdown, { mangle: false, headerIds: false });

    // Heading IDs in the same format the notes' own tables of contents use
    const used = new Set();
    article.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(h => {
        let id = slugify(h.textContent || '') || 'section';
        while (used.has(id)) id += '-1';
        used.add(id);
        h.id = id;
    });

    // Title and lead paragraph move into the page header
    const h1 = article.querySelector('h1');
    const title = h1 ? plainText(h1) : note.title;
    let leadHtml = '';
    if (h1) {
        const next = h1.nextElementSibling;
        if (next && next.tagName === 'P') { leadHtml = next.innerHTML; next.remove(); }
        const after = h1.nextElementSibling;
        if (after && after.tagName === 'HR') after.remove();
        h1.remove();
    }
    const first = article.firstElementChild;
    if (first && first.tagName === 'HR') first.remove();
    // section headings draw their own rule, so a "---" right before one is redundant
    article.querySelectorAll('hr').forEach(hr => {
        const next = hr.nextElementSibling;
        if (!next || /^H[12]$/.test(next.tagName)) hr.remove();
    });

    // In-note "Table of Contents" styling
    article.querySelectorAll('h2').forEach(h2 => {
        if (/^table of contents$/i.test(h2.textContent.trim())) {
            h2.classList.add('toc-title');
            const list = h2.nextElementSibling;
            if (list && (list.tagName === 'UL' || list.tagName === 'OL')) list.classList.add('toc');
            const hr = list && list.nextElementSibling;
            if (hr && hr.tagName === 'HR') hr.remove();
        }
    });

    // Hover anchors on headings
    article.querySelectorAll('h2, h3').forEach(h => {
        if (h.classList.contains('toc-title')) return;
        const a = document.createElement('a');
        a.className = 'heading-anchor';
        a.href = `#${note.id}-${h.id}`;
        a.textContent = '#';
        a.setAttribute('aria-label', `Link to ${plainText(h)}`);
        a.dataset.anchor = h.id;
        h.appendChild(a);
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

    // Mermaid diagrams
    article.querySelectorAll('pre > code.language-mermaid').forEach(code => {
        const div = document.createElement('div');
        div.className = 'mermaid';
        div.textContent = code.textContent;
        code.parentElement.replaceWith(div);
    });

    // Code blocks: highlighting, language label, copy button
    article.querySelectorAll('pre > code').forEach(code => {
        const lang = ([...code.classList].find(c => c.startsWith('language-')) || '').replace('language-', '');
        if (window.hljs) {
            try { hljs.highlightElement(code); } catch (e) { /* plain text fallback */ }
        }
        const pre = code.parentElement;
        const wrap = document.createElement('div');
        wrap.className = 'code-block';
        pre.before(wrap);
        wrap.appendChild(pre);
        if (lang && lang !== 'plaintext' && lang !== 'text') {
            const tag = document.createElement('span');
            tag.className = 'code-lang';
            tag.textContent = lang;
            wrap.appendChild(tag);
        }
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'copy-btn';
        btn.textContent = 'Copy';
        btn.addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(code.textContent); btn.textContent = 'Copied'; }
            catch (e) { btn.textContent = 'Copy failed'; }
            setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
        });
        wrap.appendChild(btn);
    });

    // In-page anchor links
    article.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.dataset.anchor || link.getAttribute('href').substring(1);
            if (!targetId) return;
            e.preventDefault();
            scrollToSection(targetId);
            window.history.replaceState(null, '', `#${note.id}-${targetId}`);
        });
    });

    // Prev / next within the subject
    const prev = currentNotes[currentNoteIndex - 1];
    const next = currentNotes[currentNoteIndex + 1];
    const pagerHtml = (prev || next) ? `
        <nav class="pager" aria-label="More notes">
            <button class="pager-link prev" type="button" data-go="${prev ? prev.id : ''}"${prev ? '' : ' disabled'}>
                <span class="pager-dir">&larr; Previous</span><span class="pager-title">${prev ? escapeHtml(prev.title) : ''}</span>
            </button>
            <button class="pager-link next" type="button" data-go="${next ? next.id : ''}"${next ? '' : ' disabled'}>
                <span class="pager-dir">Next &rarr;</span><span class="pager-title">${next ? escapeHtml(next.title) : ''}</span>
            </button>
        </nav>` : '';

    const wrap = document.createElement('div');
    wrap.className = 'note-wrap';
    wrap.innerHTML = `
        <header class="note-header">
            <div class="top-row">
                <a class="eyebrow" href="#subject:${subjectId}" data-subject-link="${subjectId}">${escapeHtml(subject.description)}</a>
                <div class="note-tools">
                    <button class="icon-btn" type="button" id="printBtn" aria-label="Print this note" title="Print">
                        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true"><path d="M7 9V4h10v5M7 17H5a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-2M7 14h10v6H7z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/></svg>
                    </button>
                </div>
            </div>
            <h1 class="page-title">${escapeHtml(title)}</h1>
            ${leadHtml ? `<p class="page-lead">${leadHtml}</p>` : ''}
            <div class="meta-row">
                ${note.date ? `<span>${escapeHtml(formatDate(note.date))}</span><span class="sep">·</span>` : ''}
                <span>${meta.minutes} min read</span>
            </div>
            <div class="pills">
                <a class="pill" href="#subject:${subjectId}" data-subject-link="${subjectId}">${escapeHtml(shortName(subjectId))}</a>
                <a class="pill" href="#subject:${subjectId}" data-subject-link="${subjectId}" data-section="${sectionId}">${escapeHtml(formatSectionTitle(sectionId))}</a>
            </div>
        </header>`;
    wrap.appendChild(article);
    wrap.insertAdjacentHTML('beforeend', pagerHtml);

    const content = $('content');
    content.innerHTML = '';
    content.appendChild(wrap);
    bindNoteLinks(wrap.querySelector('.note-header'));
    $('printBtn').addEventListener('click', () => window.print());
    wrap.querySelectorAll('.pager-link[data-go]').forEach(b => b.addEventListener('click', () => {
        const f = b.dataset.go && findNote(b.dataset.go);
        if (f) loadNote(f.note);
    }));

    buildToc(article, note);
    renderMermaid(article);
}

function buildToc(article, note) {
    const heads = [...article.querySelectorAll('h2, h3')].filter(h => !h.classList.contains('toc-title'));
    const toc = $('toc');
    const list = $('tocList');
    if (tocObserver) { tocObserver.disconnect(); tocObserver = null; }
    if (heads.length < 2) {
        toc.hidden = true;
        document.body.classList.remove('has-side-toc');
        return;
    }
    list.innerHTML = heads.map(h => {
        const label = plainText(h).replace(/#$/, '').trim();
        return `<li class="lvl-${h.tagName === 'H2' ? 2 : 3}"><a href="#${note.id}-${h.id}" data-target="${h.id}">${escapeHtml(label)}</a></li>`;
    }).join('');
    toc.hidden = false;
    document.body.classList.add('has-side-toc');

    list.querySelectorAll('a').forEach(a => a.addEventListener('click', (e) => {
        e.preventDefault();
        scrollToSection(a.dataset.target);
        window.history.replaceState(null, '', `#${note.id}-${a.dataset.target}`);
    }));

    const links = new Map([...list.querySelectorAll('a')].map(a => [a.dataset.target, a]));
    const visible = new Set();
    const setActive = (id) => {
        links.forEach((a, key) => a.classList.toggle('active', key === id));
        const a = links.get(id);
        if (a) a.scrollIntoView({ block: 'nearest' });
    };
    if ('IntersectionObserver' in window) {
        tocObserver = new IntersectionObserver(entries => {
            entries.forEach(en => en.isIntersecting ? visible.add(en.target.id) : visible.delete(en.target.id));
            const firstVisible = heads.find(h => visible.has(h.id));
            if (firstVisible) { setActive(firstVisible.id); return; }
            // nothing in the band: the last heading above the viewport is the current section
            const above = heads.filter(h => h.getBoundingClientRect().top < 120).pop();
            setActive(above ? above.id : heads[0].id);
        }, { rootMargin: '-70px 0px -65% 0px' });
        heads.forEach(h => tocObserver.observe(h));
    }
    setActive(heads[0].id);
}

function renderMermaid(root) {
    const nodes = root.querySelectorAll('.mermaid');
    if (!nodes.length || !window.mermaid) return;
    const dark = document.documentElement.getAttribute('data-theme') !== 'light';
    try {
        mermaid.initialize({ startOnLoad: false, theme: dark ? 'dark' : 'neutral', securityLevel: 'strict' });
        mermaid.run({ nodes }).catch(() => {});
    } catch (e) { /* leave diagram source visible */ }
}

function scrollToSection(sectionId, smooth = true) {
    const target = document.getElementById(sectionId);
    if (target) target.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
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
    if (!currentNote) { bar.style.width = '0'; return; }
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

    const index = allEntries().map(e => ({
        note: e.note,
        subjectId: e.subjectId,
        subject: shortName(e.subjectId),
        section: formatSectionTitle(e.sectionId),
        haystack: `${e.note.title} ${formatSectionTitle(e.sectionId)} ${notesData[e.subjectId].name} ${notesData[e.subjectId].description}`.toLowerCase()
    }));
    const reEscape = (t) => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

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
        terms.forEach(t => { if (t) out = out.replace(new RegExp(`(${reEscape(t)})`, 'ig'), '<mark>$1</mark>'); });
        return out;
    }
    function score(entry, terms) {
        const title = entry.note.title.toLowerCase();
        let s = 0;
        for (const t of terms) {
            if (!entry.haystack.includes(t)) return -1;
            if (title.startsWith(t)) s += 3;
            else if (new RegExp(`\\b${reEscape(t)}`).test(title)) s += 2;
            else if (title.includes(t)) s += 1;
        }
        return s;
    }
    function render(query) {
        const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
        let matches;
        let heading = '';
        if (terms.length === 0) {
            if (currentSubject) {
                matches = index.filter(e => e.subjectId === currentSubject);
                heading = `All ${escapeHtml(notesData[currentSubject].name)} notes`;
            } else {
                const ids = new Set(latestEntries(10).map(e => e.note.id));
                matches = index.filter(e => ids.has(e.note.id));
                heading = 'Recently added';
            }
        } else {
            matches = index.map(e => ({ e, s: score(e, terms) }))
                .filter(x => x.s >= 0).sort((a, b) => b.s - a.s).slice(0, 30).map(x => x.e);
        }
        items = matches;
        active = 0;
        if (matches.length === 0) {
            results.innerHTML = `<li class="palette-empty">No notes match “${escapeHtml(query)}”. Try a shorter word.</li>`;
            return;
        }
        results.innerHTML = (heading ? `<li class="palette-group" role="presentation">${heading}</li>` : '') + matches.map((m, i) => `
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
    let opener = null;
    modal.hidden = true;

    const openModal = (e) => {
        opener = e && e.currentTarget;
        modal.hidden = false;
        document.body.style.overflow = 'hidden';
        $('contactName').focus();
    };
    const closeModal = () => {
        modal.hidden = true;
        document.body.style.overflow = '';
        if (opener && opener.focus) opener.focus();
    };

    $('contactBtn').addEventListener('click', openModal);
    $('contactBtn2').addEventListener('click', openModal);
    $('contactModalClose').addEventListener('click', closeModal);
    $('contactModalOverlay').addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) closeModal(); });

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
// Theme
// ---------------------------------------------------------------
function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    const css = $('hljsTheme');
    if (css) {
        css.href = `https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/${theme === 'dark' ? 'github-dark-dimmed' : 'github'}.min.css`;
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
        if (currentNote) renderMermaidAgain();
    });
}

function renderMermaidAgain() {
    // diagrams are drawn once with the theme of the moment; reload the note to redraw them
    if (document.querySelector('.note .mermaid')) loadNote(currentNote, { push: false });
}
