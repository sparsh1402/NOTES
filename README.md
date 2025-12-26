# Notes - Comprehensive Study Materials

This repository contains comprehensive notes on **Database Management Systems (DBMS)** and **Java Programming Language** based on course materials and industry best practices.

## 🌐 Live Website

Visit the live website: **[https://yourusername.github.io/Notesss/](https://sparsh1402.github.io/NOTES)**

> **Note:** Replace `yourusername` with your actual GitHub username after deployment.

**📖 Deployment Guide:** See [DEPLOY_GITHUB_WEB.md](./DEPLOY_GITHUB_WEB.md) for step-by-step instructions using GitHub web interface.

## ✨ Features

- 📖 **Book-like Reading Experience** - Beautiful, distraction-free interface
- ✨ **Highlight Important Points** - Click and drag to highlight key concepts with multiple colors
- 💾 **Persistent Highlights** - Your highlights are saved automatically
- 🌙 **Dark/Light Theme** - Toggle between themes
- 🔍 **Easy Navigation** - Browse through all topics effortlessly
- 📱 **Responsive Design** - Works on all devices
- 🖨️ **Print Friendly** - Clean print layout
- 🔗 **Table of Contents** - Quick navigation within each note
- 📚 **Organized by Subjects** - DBMS, Java, and more

## 📚 Subjects Covered

### 🗄️ DBMS (Database Management Systems)

#### ACID Properties
- [ACID Properties Introduction](./notes/dbms/01_ACID_Properties_Introduction.md) - Overview of Atomicity, Consistency, Isolation, and Durability
- [What is a Transaction?](./notes/dbms/02_What_is_a_Transaction.md) - Understanding database transactions, their lifecycle, and implementation considerations
- [Atomicity](./notes/dbms/03_Atomicity.md) - Understanding atomicity: all-or-nothing transactions, crash recovery, and implementation strategies
- [Isolation](./notes/dbms/04_Isolation.md) - Transaction isolation, read phenomena, isolation levels, and concurrency control
- [Consistency](./notes/dbms/05_Consistency.md) - Two types of consistency: data consistency and read consistency, referential integrity, and eventual consistency
- [Durability](./notes/dbms/06_Durability.md) - Ensuring committed transactions persist to permanent storage, WAL, OS cache problem, and FSYNC
- [ACID Properties Hands-On](./notes/dbms/07_ACID_Properties_Hands_On.md) - Practical demonstration of ACID properties using PostgreSQL in Docker
- [Phantom Reads](./notes/dbms/08_Phantom_Reads.md) - Understanding phantom reads, how to prevent them, and PostgreSQL's special behavior
- [Serializable vs Repeatable Read](./notes/dbms/09_Serializable_vs_Repeatable_Read.md) - Critical difference between Serializable and Repeatable Read isolation levels, dependency detection, and when to use each
- [Eventual Consistency](./notes/dbms/10_Eventual_Consistency.md) - Understanding eventual consistency, difference between data consistency and read consistency, and why both SQL and NoSQL suffer from it

#### Database Storage
- [Tables and Indexes Storage](./notes/dbms/11_Tables_and_Indexes_Storage.md) - How tables and indexes are stored on disk, pages, I/O operations, heap vs index performance, and clustered indexes
- [Row vs Column Storage](./notes/dbms/12_Row_vs_Column_Storage.md) - Row-oriented vs column-oriented database storage, how each stores data on disk, query performance comparison, and when to use which
- [Primary Key vs Secondary Key](./notes/dbms/13_Primary_Key_vs_Secondary_Key.md) - Clustered index (primary key) vs secondary index, how tables are organized, database differences, and UUID problem
- [Database Pages](./notes/dbms/14_Database_Pages.md) - Deep dive into database pages, buffer pool, page content, storage methods, and PostgreSQL page layout

#### Database Indexing
- [Create Postgres Table with Million Rows](./notes/dbms/15_Create_Postgres_Table_with_Million_Rows.md) - Practical guide to creating large test datasets using generate_series() and random() functions
- [Getting Started with Indexing](./notes/dbms/16_Getting_Started_with_Indexing.md) - Introduction to database indexing, performance comparison with/without indexes, EXPLAIN ANALYZE, and when indexes help
- [SQL Query Planner and Optimizer with EXPLAIN](./notes/dbms/17_SQL_Query_Planner_and_Optimizer_Explain.md) - Understanding EXPLAIN command, cost numbers, query plans, sequential scan vs index scan, and performance analysis

### ☕ Java Programming Language

#### OOPs Concepts
- [OOPs Concepts In Java](./notes/java/01_OOPs_Concepts.md) - Object-Oriented Programming fundamentals, principles, and concepts

#### Java Basics
- [Java Overview](./notes/java/02_Java_Overview.md) - Introduction to Java, JVM, JRE, JDK, and Java editions
- [Why One Public Class Per File?](./notes/java/03_Why_One_Public_Class_Per_File.md) - Understanding Java file structure and naming conventions
- [Java Variables](./notes/java/04_Java_Variables.md) - Primitive and reference types, naming conventions, type conversions
- [Java Methods](./notes/java/05_Java_Methods.md) - Method declaration, access specifiers, overloading, overriding, static, final, abstract methods
- [Java Constructors](./notes/java/06_Java_Constructors.md) - Constructor types, chaining, private constructors, and common interview questions

#### Memory Management
- [Java Memory Management](./notes/java/07_Java_Memory_Management.md) - Stack and heap memory, garbage collection, reference types

#### Advanced Classes
- [Java Types of Classes - Part 1](./notes/java/08_Java_Types_of_Classes_Part1.md) - Concrete, abstract, super/subclass, Object class, nested classes
- [Java Generic Classes](./notes/java/09_Java_Generic_Classes.md) - Generics syntax, inheritance, bounded types, wildcards, type erasure
- [Java POJOs, Enums, and Final Classes](./notes/java/10_Java_POJOs_Enums_Final_Classes.md) - Plain Old Java Objects, Enumerations, and Final classes
- [Java Singleton, Immutable, and Wrapper Classes](./notes/java/11_Java_Singleton_Immutable_Wrapper_Classes.md) - Design patterns and immutable objects

#### Interfaces
- [Java Interfaces - Part 1](./notes/java/12_Java_Interfaces_Part1.md) - Interface definition, abstraction, polymorphism, multiple inheritance
- [Java Interfaces - Part 2: Java 8 & 9 Features](./notes/java/13_Java_Interfaces_Part2_Java8_Java9_Features.md) - Default methods, static methods, private methods

#### Functional Programming
- [Java Functional Interface and Lambda Expression](./notes/java/14_Java_Functional_Interface_Lambda_Expression.md) - Functional interfaces, lambda expressions, built-in functional interfaces

#### Advanced Topics
- [Java Reflection](./notes/java/15_Java_Reflection.md) - Runtime class examination, method invocation, breaking singleton patterns
- [Java Annotations](./notes/java/16_Java_Annotations.md) - Predefined annotations, meta-annotations, custom annotations
- [Java Exception Handling](./notes/java/17_Java_Exception_Handling.md) - Exception hierarchy, checked/unchecked exceptions, try-catch-finally, custom exceptions
- [Java Operators](./notes/java/18_Java_Operators.md) - Arithmetic, relational, logical, bitwise, shift operators, precedence
- [Java Control Flow Statements](./notes/java/19_Java_Control_Flow_Statements.md) - Decision making, iterative statements, branching statements

#### Collections Framework
- [Java Collection Framework - Introduction](./notes/java/20_Java_Collection_Framework_Introduction.md) - Collection hierarchy, Iterable, Collection interfaces, Collections utility class
- [Java Queue, PriorityQueue, Comparator, and Comparable](./notes/java/21_Java_Queue_PriorityQueue_Comparator_Comparable.md) - Queue implementations, custom sorting
- [Java Deque & List Implementations](./notes/java/22_Java_Deque_List_Implementations.md) - ArrayDeque, ArrayList, LinkedList, Vector, Stack
- [Java Map & HashMap Internals](./notes/java/23_Java_Map_HashMap_Internals.md) - HashMap internal structure, collision handling, load factor, rehashing
- [Java LinkedHashMap & TreeMap](./notes/java/24_Java_LinkedHashMap_TreeMap.md) - LinkedHashMap (insertion order), TreeMap (sorted order)
- [Java Set Implementations](./notes/java/25_Java_Set_Implementations.md) - HashSet, LinkedHashSet, TreeSet, internal workings, set operations
- [Java Streams](./notes/java/26_Java_Streams.md) - Stream pipeline, intermediate/terminal operations, lazy evaluation, parallel streams

#### Threading and Concurrency
- [Java Threading - Part 1: Introduction, Process & Thread](./notes/java/27_Java_Threading_Part1_Introduction_Process_Thread.md) - Process vs Thread, JVM memory areas, context switching
- [Java Threading - Part 2: Creation & Synchronization](./notes/java/28_Java_Threading_Part2_Creation_Synchronization.md) - Thread creation, lifecycle, synchronization, inter-thread communication
- [Java Threading - Part 3: Deprecated Methods, Join, Priority & Daemon](./notes/java/29_Java_Threading_Part3_Deprecated_Methods_Join_Priority_Daemon.md) - Thread joining, priority, daemon threads
- [Java Threading - Part 4: Locks (Reentrant, Read-Write, Semaphore)](./notes/java/30_Java_Threading_Part4_Locks_Reentrant_ReadWrite_Semaphore.md) - Custom locks, reentrant lock, read-write lock, stamped lock, semaphore
- [Java Threading - Part 5: Atomic Variables and Volatile](./notes/java/31_Java_Threading_Part5_Atomic_Variables_Volatile.md) - CAS operation, atomic variables, volatile keyword
- [Java Threading - Part 6: Thread Pool Executor](./notes/java/32_Java_Threading_Part6_Thread_Pool_Executor.md) - Thread pool concepts, ThreadPoolExecutor, core pool size calculation
- [Java Threading - Part 7: Future, Callable, and CompletableFuture](./notes/java/33_Java_Threading_Part7_Future_Callable_CompletableFuture.md) - Async programming, Future interface, CompletableFuture chaining
- [Java Threading - Part 8: Executors Utility and Fork-Join Pool](./notes/java/34_Java_Threading_Part8_Executors_Utility_ForkJoinPool.md) - Executors factory methods, work stealing algorithm, Fork-Join pool
- [Java Threading - Part 9: Shutdown, Scheduled Executor, ThreadLocal, Virtual Threads](./notes/java/35_Java_Threading_Part9_Shutdown_ScheduledExecutor_ThreadLocal_VirtualThreads.md) - Executor lifecycle, scheduled tasks, thread-local variables, virtual threads (Java 19+)

#### Modern Java Features
- [Java Lombok Library](./notes/java/36_Java_Lombok_Library.md) - Reducing boilerplate code with annotations
- [Java 21: Sequence Collections](./notes/java/37_Java_21_Sequence_Collections.md) - New collection interfaces for ordered collections
- [Java 17: Sealed Classes and Interfaces](./notes/java/38_Java_17_Sealed_Classes_Interfaces.md) - Controlled inheritance with sealed classes
- [Java 14: Switch Enhancements](./notes/java/39_Java_14_Switch_Enhancements.md) - Switch expressions, arrow syntax, yield statement
- [Java Pattern Matching: instanceof (Java 16) and Switch (Java 21)](./notes/java/40_Java_Pattern_Matching_Instanceof_Switch.md) - Pattern matching for type checking
- [Java 16: Records](./notes/java/41_Java_16_Records.md) - Immutable data carrier classes

*More topics will be added as course transcripts are processed.*

## 🚀 How to Use

### Using the Website

1. **Navigate:** Click on any subject (DBMS, Java) in the sidebar, then select a topic
2. **Highlight:** 
   - Click the "✨ Highlight Mode" button
   - Select text you want to highlight
   - Choose a color (yellow, blue, green, pink)
   - Your highlights are saved automatically
3. **Theme:** Toggle between dark and light themes
4. **Navigation:** Use Previous/Next buttons or sidebar links
5. **Table of Contents:** Click on any heading in the TOC to jump to that section

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/Notesss.git
cd Notesss/NOTES
```

2. Serve locally (using Python):
```bash
# Python 3
python -m http.server 8000

# Or using Node.js http-server
npx http-server
```

3. Open in browser:
```
http://localhost:8000
```

## 📝 Notes Structure

Notes are organized in a structured format with:
- Clear headings and subheadings
- Table of contents for easy navigation
- Code examples with syntax highlighting
- Visual diagrams where applicable
- Key concepts highlighted
- Important definitions and terminology
- Practical examples and use cases
- Interview questions and answers
- Comparison tables

## 🎨 Features in Detail

### Highlighting System

- **Enable Highlight Mode:** Click the "✨ Highlight Mode" button
- **Select Text:** Click and drag to select text
- **Choose Color:** Click on a color button (yellow, blue, green, pink)
- **Remove Highlight:** Click the ✕ button
- **Persistent:** Highlights are saved in browser localStorage

### Theme System

- **Dark Theme:** Default, easy on the eyes for coding
- **Light Theme:** Clean, professional look
- **Auto-save:** Your theme preference is saved

### Navigation

- **Sidebar:** Quick access to all subjects and topics
- **Previous/Next:** Navigate between notes sequentially
- **Back Button:** Return to home screen
- **URL Hash:** Direct links to specific notes and sections
- **Table of Contents:** Jump to any section within a note

## 🛠️ Technology Stack

- **HTML5** - Structure
- **CSS3** - Styling (with CSS variables for theming)
- **JavaScript** - Interactivity and highlighting
- **Marked.js** - Markdown to HTML conversion
- **GitHub Pages** - Hosting

## 📦 Deployment

This site is configured for GitHub Pages. To deploy:

1. Push to `main` branch
2. GitHub Actions will automatically deploy
3. Site will be available at: `https://yourusername.github.io/Notesss/`

Or manually enable GitHub Pages:
1. Go to Settings → Pages
2. Select source: `main` branch
3. Select folder: `/NOTES` (or root if configured)
4. Save

## 📊 Statistics

- **DBMS Notes:** 17 comprehensive topics
- **Java Notes:** 41 comprehensive topics covering:
  - OOPs and Basics (6 topics)
  - Memory Management (1 topic)
  - Advanced Classes (4 topics)
  - Interfaces (2 topics)
  - Functional Programming (1 topic)
  - Advanced Topics (5 topics)
  - Collections Framework (7 topics)
  - Threading and Concurrency (9 topics)
  - Modern Java Features (6 topics)

## 🤝 Contributing

Feel free to submit issues or pull requests if you find any errors or want to add more notes!

## 📄 License

This project is open source and available for educational purposes.

---

*Last updated: December 2024*

