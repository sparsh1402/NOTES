# How Tables and Indexes are Stored on Disk

## Overview

Understanding how tables and indexes are stored on disk is **one of the most important fundamentals** in databases. This knowledge helps you understand:
- How queries are executed
- What costs are associated with queries
- Why some queries are fast and others are slow
- How to optimize database performance

---

## Storage Concepts

### Topics Covered

1. **Table** - Logical point of view
2. **Row ID** - Unique identifier of a row
3. **Page** - Fixed-size memory/disk location
4. **I/O** - Input/Output operations
5. **Heap** - Data structure storing table data
6. **Index** - Data structure for efficient lookups
7. **B-trees** - Data structure used by indexes
8. **Query Performance** - Heap vs Index comparison

---

## 1. Table (Logical View)

### What is a Table?

**From a logical point of view:**
- A table has **columns** (fields)
- A table has **rows** (records)
- Each row contains data for all columns

**Note:** Even if you work with NoSQL databases (documents instead of rows), the concept is the same:
- Documents = Rows
- Fields = Columns
- At the end of the day, it's all **bits and bytes**
- The storage model understands this

### Example Table Structure

```
Table: employees
Columns: employee_id, name, date_of_birth, salary
Rows: Multiple employee records
```

---

## 2. Row ID (Row Identifier)

### What is Row ID?

**Row ID** is a **system-maintained unique identifier** for each row.

**Key Points:**
- Most databases don't work with the fields you provide
- Databases create their own system-maintained row identifier
- This uniquely identifies a particular row

### Database-Specific Implementations

**PostgreSQL:**
- Creates a **Row ID** (also called **Tuple ID**)
- Separate from user-defined columns
- Every row has a unique Row ID

**MySQL:**
- The **primary key** becomes the pseudo Row ID
- If no primary key, MySQL creates one internally

**Why Row ID Matters:**
- Used internally by the database
- Indexes point to Row IDs
- Helps locate rows in the heap

---

## 3. Page

### What is a Page?

**Page** is a **fixed-size memory location** that translates to a **disk location** containing a bunch of bytes.

**Key Characteristics:**
- **Fixed size** (usually)
- Contains multiple rows
- How many rows fit? Depends on:
  - Size of the row
  - Size of the columns
  - Data types used

### Page Sizes by Database

**PostgreSQL:**
- Default: **8 KB** (8,192 bytes)
- Can be configured

**MySQL:**
- Default: **16 KB** (16,384 bytes)
- Can be configured

### Example Calculation

**If each page holds 3 rows:**
- For 1,001 rows: 1,001 ÷ 3 = **~333 pages**
- These pages are stored on disk
- On disk, they're just ones and zeros (binary data)
- Each page has a physical start and end location

### Important: Database Reads Pages, Not Rows

**RAM (Random Access Memory):**
- Byte-addressable
- Can read a specific byte location
- Direct access: "Give me byte at location X"

**Disk:**
- **NOT byte-addressable**
- Reads **entire pages**, not individual bytes or rows
- Cannot say: "Give me row 1000"
- Must say: "Give me page containing row 1000"
- Gets the **entire page** with many rows

**This is critical to understand!**

---

## 4. I/O (Input/Output)

### What is an I/O?

**I/O** is an **operation that reads from or writes to disk**.

**Key Points:**
- **This is the currency of databases**
- We try to **minimize I/O as much as possible**
- **Less I/O = Faster queries**
- This is what makes queries slow or fast

### What Does an I/O Fetch?

**An I/O can fetch:**
- **One page** (most common)
- **More than one page** (depending on disk partitions, OS, etc.)

**Important:**
- **I/O cannot read a single row**
- It reads **entire pages** with many rows
- When you do an I/O, you get **many rows for free**

### The Cost of I/O

**Why I/O is expensive:**
1. **Disk access is slow** (much slower than RAM)
2. **You get more than you need:**
   - You want one row, but get a whole page
   - You want one column, but get all columns
   - You cannot say: "I want this page but not that data"

**Example:**
```sql
SELECT name FROM employees WHERE employee_id = 100;
```

**What happens:**
- Database reads the page containing row 100
- Gets **all columns** (name, date_of_birth, salary, etc.)
- Database then **filters out** what you don't want
- **Cost:** Deserializing bytes to memory structures is expensive

**This is why:**
- `SELECT *` is expensive
- `SELECT name` is also expensive (you still get all columns)
- You want to minimize I/O operations

### Operating System Cache

**Important Note:**
- I/O doesn't always go to disk
- Operating system has a **cache**
- I/O might go to **OS cache** (faster than disk)
- **PostgreSQL relies heavily on OS cache**
- An I/O might hit cache instead of physical disk

---

## 5. Heap

### What is a Heap?

**Heap** is a **collection of pages** that represent your data table.

**Key Characteristics:**
- Contains **everything** about the table
- All table data is stored in the heap
- Called "heap" because it's a special data structure
- Has **a lot of data** (everything!)

### Why Heap is Expensive to Query

**Problems with heap:**
1. **Contains everything** - lots of data
2. **Not organized** - rows are not necessarily in order
3. **Must scan many pages** to find what you want
4. **You're looking for few things, but heap gives you everything**

**Example:**
- You want employee ID 10,000
- Heap might be 333 pages
- You might need to scan **all 333 pages** to find it
- Very expensive!

**This is why we need indexes!**

---

## 6. Index

### What is an Index?

**Index** is **another data structure** (no magic!) that helps you **pinpoint exactly where to go in the heap** to fetch information efficiently.

**Key Characteristics:**
- **Separate data structure** from the heap
- Has **pointers to the heap**
- Pointers are **numbers** (Row IDs)
- Row ID contains metadata about which page in the heap to pull
- Contains **part of the data** (indexed columns)
- Used to **quickly search** for something

### How Indexes Work

**Process:**
1. **Search the index** for the value you want
2. **Index tells you:** "This value is at Row ID X, Page Y"
3. **Go directly to that page** in the heap
4. **Fetch only that page** (instead of scanning all pages)

**Example:**
- You want employee ID 40
- Index says: "Employee 40 is at Row ID 4, Page 1"
- Go directly to Page 1 in heap
- Much faster than scanning all pages!

### What Can Be Indexed?

- **One column** (single-column index)
- **Multiple columns** (composite index)
- You index **exactly what you need to search for**

### Index Storage

**Important:**
- Index is **also stored as pages**
- **Costs I/O** to pull index entries
- Index is **not magic** - it's a data structure (usually B-tree)
- Must be **read from disk** when database starts
- Some indexes fit in memory, others don't
- **Larger indexes = more expensive** to search

**Key Insight:**
- **Smaller index = more can fit in memory = faster**
- **Larger index = might not fit in memory = slower**

### Popular Index Data Structures

- **B-tree** (most common)
- **Hash indexes**
- **Many other types**

---

## 7. B-trees

### What is a B-tree?

**B-tree** is a **tree data structure** used by most indexes.

**How it works:**
- **Tree structure** (not sequential)
- **Go left** if value is less
- **Go right** if value is more
- **Efficient search** - logarithmic time complexity

**Note:** We'll cover B-trees in detail in another section. For now, understand that indexes use B-trees for efficient searching.

---

## 8. How Data Looks on Disk

### Simplified View

**This is a simplified representation** - take it with a grain of salt, but it helps understand the concept.

### Heap Structure on Disk

**Page 0:**
- Row ID 1: Employee ID 10, Name: Adam, Date of Birth: ..., Salary: ...
- Row ID 2: Employee ID 20, Name: Knight, Date of Birth: ..., Salary: ...
- Row ID 3: Employee ID 30, Name: Ali, Date of Birth: ..., Salary: ...

**Page 1:**
- Row ID 4: Employee ID 40, ...
- Row ID 5: Employee ID 50, ...
- Row ID 6: Employee ID 60, ...

**Page 2:**
- Row ID 7: Employee ID 70, ...
- Row ID 8: Employee ID 80, ...
- Row ID 9: Employee ID 90, ...

**Page 333:**
- Row ID 1000: Employee ID 10,000, ...

**Key Points:**
- Each page contains multiple rows
- Rows are stored sequentially within pages
- Pages are stored on disk
- This is the **heap** - all your table data

### Index Structure on Disk

**If you index on Employee ID:**

**Index contains:**
- Employee ID 10 → Row ID 1, Page 0
- Employee ID 20 → Row ID 2, Page 0
- Employee ID 30 → Row ID 3, Page 0
- Employee ID 40 → Row ID 4, Page 1
- Employee ID 50 → Row ID 5, Page 1
- ...
- Employee ID 10,000 → Row ID 1000, Page 333

**Key Points:**
- Index only contains **indexed column** (Employee ID)
- Index contains **pointers** (Row ID + Page number)
- Index is **separate** from heap
- Index uses **B-tree structure** (not sequential as shown)

---

## 9. Query Example: With Index vs Without Index

### Example Query

```sql
SELECT * FROM employees WHERE employee_id = 10,000;
```

### Scenario 1: Without Index (Heap Scan)

**What happens:**
1. Start at Page 0
2. Read Page 0 → Check rows 1, 2, 3 → None match (Employee IDs 10, 20, 30)
3. **Discard page** (but you already paid the I/O cost!)
4. Read Page 1 → Check rows 4, 5, 6 → None match
5. **Discard page**
6. Read Page 2 → Check rows 7, 8, 9 → None match
7. **Discard page**
8. Continue scanning...
9. Read Page 333 → Found! Employee ID 10,000

**Cost:**
- **333 I/O operations** (one per page)
- Very expensive!
- Must scan almost all pages to find the last one

**Note:** Some databases use parallel processing (multiple threads) to scan from both ends, but it's still expensive.

### Scenario 2: With Index

**What happens:**
1. **Search the index** (B-tree search)
2. Find: Employee ID 10,000 → Row ID 1000, Page 333
3. **One I/O** to read index page
4. **Go directly to Page 333** in heap
5. **One I/O** to read heap page
6. Found! Return row 1000

**Cost:**
- **2 I/O operations** total
- Much faster!
- Know exactly which page to read

**Key Insight:**
- Index tells you **exactly where to go**
- No need to scan all pages
- **Dramatic performance improvement!**

### Important: You Still Get Extra Data

**Even with index:**
- When you read Page 333, you get **all rows** in that page
- If Page 333 has rows 1000, 1001, 1002
- You get all three rows, but only use row 1000
- **You cannot escape this** - I/O gives you the whole page
- Database discards what you don't need

---

## 10. Clustered Index (Index-Organized Table)

### What is a Clustered Index?

**Clustered Index** is when the **heap table is organized around a single index**.

**Key Points:**
- Normally, heap is **not organized** (rows in random order)
- With clustered index, heap is **ordered** by the index
- Table data is **physically sorted** by the index
- Also called **Index-Organized Table (IOT)** in Oracle terminology

### Primary Key as Clustered Index

**MySQL:**
- **Primary key is always a clustered index**
- If you define a primary key, table is organized around it
- **Be very careful** about what data type you pick!

**PostgreSQL:**
- **Primary key is just a secondary index** (not clustered)
- All indexes point to Row ID
- Different behavior than MySQL

### UUID Problem with Clustered Index

**The Problem:**
- UUIDs are **truly random**
- If UUID is your clustered index (primary key in MySQL)
- Heap must be organized around this random index
- **Every insert** hits a different random page
- **Scattershot writes** - very expensive!

**Why it's bad:**
- Random UUID → Random page location
- Each insert hits a different page
- Cannot batch writes efficiently
- **Kills write performance**

**Solution:**
- Use **sequential IDs** (auto-increment) for clustered index
- Or use **non-clustered index** (like PostgreSQL)

### PostgreSQL vs MySQL: Index Differences

**MySQL (Clustered Index):**
- Primary key = Clustered index
- Table organized around primary key
- Other indexes point to **primary key**

**PostgreSQL (Secondary Indexes Only):**
- **All indexes are secondary**
- All indexes point to **Row ID** (system-maintained)
- Row ID lives in heap
- **If you edit anything, all indexes get updated**
- This is a cost you must understand

**Key Difference:**
- MySQL: Indexes point to primary key
- PostgreSQL: Indexes point to Row ID
- Both have trade-offs

---

## Summary

### What We Learned

1. **Table:** Logical view with columns and rows
2. **Row ID:** System-maintained unique identifier (or primary key in MySQL)
3. **Page:** Fixed-size memory/disk location (8 KB in PostgreSQL, 16 KB in MySQL)
4. **I/O:** Operation that reads/writes pages (not rows or bytes)
5. **Heap:** Collection of pages containing all table data
6. **Index:** Separate data structure with pointers to heap
7. **B-trees:** Tree structure used by indexes for efficient searching

### Key Insights

1. **Database reads pages, not rows:**
   - Cannot read a single row
   - Must read entire page
   - Get many rows for free

2. **I/O is the currency:**
   - Minimize I/O = Faster queries
   - More I/O = Slower queries
   - This is what makes queries fast or slow

3. **Heap is expensive:**
   - Contains everything
   - Must scan many pages
   - Not organized

4. **Index is efficient:**
   - Points to exact page
   - Dramatically reduces I/O
   - But also stored as pages (costs I/O to read)

5. **Clustered vs Secondary Indexes:**
   - Clustered: Table organized around index (MySQL primary key)
   - Secondary: Index points to Row ID (PostgreSQL)
   - Both have trade-offs

### Performance Tips

1. **Use indexes** for frequently searched columns
2. **Avoid random UUIDs** as clustered index (in MySQL)
3. **Understand I/O costs** - this is what matters
4. **Smaller indexes** fit in memory = faster
5. **Know your database** - MySQL vs PostgreSQL behave differently

---

## Next Steps

- Understanding **B-trees** in detail
- Learning about **row store vs column store**
- Exploring **clustered indexes** vs **secondary indexes**
- Understanding **index maintenance** costs
- Learning about **composite indexes**

---

*Note: Understanding how tables and indexes are stored on disk is fundamental to database performance. This knowledge helps you write better queries, design better schemas, and optimize database performance. Remember: I/O is the currency of databases - minimize it!*

