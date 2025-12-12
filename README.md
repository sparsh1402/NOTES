# DBMS Notes

This repository contains comprehensive notes on Database Management Systems (DBMS) based on course materials.

## 🌐 Live Website

Visit the live website: **[https://yourusername.github.io/DBMS_Notes/](https://yourusername.github.io/DBMS_Notes/)**

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

## 📚 Table of Contents

### ACID Properties
- [Video 1: ACID Properties Introduction](./notes/01_ACID_Properties_Introduction.md) - Overview of Atomicity, Consistency, Isolation, and Durability
- [Video 2: What is a Transaction?](./notes/02_What_is_a_Transaction.md) - Understanding database transactions, their lifecycle, and implementation considerations
- [Video 3: Atomicity](./notes/03_Atomicity.md) - Understanding atomicity: all-or-nothing transactions, crash recovery, and implementation strategies
- [Video 4: Isolation](./notes/04_Isolation.md) - Transaction isolation, read phenomena, isolation levels, and concurrency control
- [Video 5: Consistency](./notes/05_Consistency.md) - Two types of consistency: data consistency and read consistency, referential integrity, and eventual consistency
- [Video 6: Durability](./notes/06_Durability.md) - Ensuring committed transactions persist to permanent storage, WAL, OS cache problem, and FSYNC
- [Video 7: ACID Properties Hands-On](./notes/07_ACID_Properties_Hands_On.md) - Practical demonstration of ACID properties using PostgreSQL in Docker
- [Video 8: Phantom Reads](./notes/08_Phantom_Reads.md) - Understanding phantom reads, how to prevent them, and PostgreSQL's special behavior
- [Video 9: Serializable vs Repeatable Read](./notes/09_Serializable_vs_Repeatable_Read.md) - Critical difference between Serializable and Repeatable Read isolation levels, dependency detection, and when to use each
- [Video 10: Eventual Consistency](./notes/10_Eventual_Consistency.md) - Understanding eventual consistency, difference between data consistency and read consistency, and why both SQL and NoSQL suffer from it

### Database Storage
- [Video 11: Tables and Indexes Storage](./notes/11_Tables_and_Indexes_Storage.md) - How tables and indexes are stored on disk, pages, I/O operations, heap vs index performance, and clustered indexes
- [Video 12: Row vs Column Storage](./notes/12_Row_vs_Column_Storage.md) - Row-oriented vs column-oriented database storage, how each stores data on disk, query performance comparison, and when to use which
- [Video 13: Primary Key vs Secondary Key](./notes/13_Primary_Key_vs_Secondary_Key.md) - Clustered index (primary key) vs secondary index, how tables are organized, database differences, and UUID problem
- [Article 14: Database Pages](./notes/14_Database_Pages.md) - Deep dive into database pages, buffer pool, page content, storage methods, and PostgreSQL page layout

### Database Indexing
- [Video 15: Create Postgres Table with Million Rows](./notes/15_Create_Postgres_Table_with_Million_Rows.md) - Practical guide to creating large test datasets using generate_series() and random() functions
- [Video 16: Getting Started with Indexing](./notes/16_Getting_Started_with_Indexing.md) - Introduction to database indexing, performance comparison with/without indexes, EXPLAIN ANALYZE, and when indexes help
- [Video 17: SQL Query Planner and Optimizer with EXPLAIN](./notes/17_SQL_Query_Planner_and_Optimizer_Explain.md) - Understanding EXPLAIN command, cost numbers, query plans, sequential scan vs index scan, and performance analysis

*More topics will be added as course transcripts are processed.*

## 🚀 How to Use

### Using the Website

1. **Navigate:** Click on any topic in the sidebar to read
2. **Highlight:** 
   - Click the "✨ Highlight Mode" button
   - Select text you want to highlight
   - Choose a color (yellow, blue, green, pink)
   - Your highlights are saved automatically
3. **Theme:** Toggle between dark and light themes
4. **Navigation:** Use Previous/Next buttons or sidebar links

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/DBMS_Notes.git
cd DBMS_Notes
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
- Code examples where applicable
- Key concepts highlighted
- Important definitions and terminology
- Practical examples and use cases

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

- **Sidebar:** Quick access to all topics
- **Previous/Next:** Navigate between notes sequentially
- **Back Button:** Return to home screen
- **URL Hash:** Direct links to specific notes

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
3. Site will be available at: `https://yourusername.github.io/DBMS_Notes/`

Or manually enable GitHub Pages:
1. Go to Settings → Pages
2. Select source: `main` branch
3. Select folder: `/ (root)`
4. Save

## 🤝 Contributing

Feel free to submit issues or pull requests if you find any errors or want to add more notes!

## 📄 License

This project is open source and available for educational purposes.

---

*Last updated: [Date will be updated as notes are added]*
