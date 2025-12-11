# Database Pages - A Deep Dive

## Overview

**Database Pages** are fundamental storage units in databases. Understanding how pages work is crucial for understanding database performance and storage.

**Key Concept:** Databases use **fixed-size pages** to store data. Tables, collections, rows, columns, indexes, sequences, documents, and more eventually end up as **bytes in a page**.

**Benefits of Pages:**
- **Separation of concerns:** Storage engine can be separated from database frontend
- **Easier operations:** Makes it easier to read, write, or cache data
- **Unified approach:** Everything is a page, regardless of content

---

## A Pool of Pages

### How Pages are Read

**Process:**
1. Database finds the **page** where the row lives
2. Identifies the **file and offset** where the page is located on disk
3. Asks the **OS** to read from the file at that offset for the length of the page
4. **OS checks filesystem cache** first
5. If not in cache, OS issues the read and pulls the page into memory
6. Database consumes the page

### Buffer Pool (Shared Memory)

**What is it?**
- Database allocates a **pool of memory** (often called **shared** or **buffer pool**)
- Pages read from disk are **placed in the buffer pool**
- Once a page is in the buffer pool, you get access to:
  - The requested row
  - **All other rows in that page** (depending on row width)

**Why this is efficient:**
- **Index range scans** benefit greatly
- **Smaller rows = more rows per page = more bang for your buck**
- One I/O gives you multiple rows!

**Example:**
- Page size: 8 KB
- Row size: 100 bytes
- **One I/O = ~80 rows!** (instead of just one)

### How Pages are Written

**Process:**
1. User updates a row
2. Database finds the **page** where the row lives
3. **Pulls the page** into the buffer pool (if not already there)
4. **Updates the row in memory**
5. Makes a **journal entry** (WAL - Write Ahead Log) persisted to disk
6. Page can **remain in memory** to receive more writes
7. Page is **flushed back to disk** later (minimizing I/O)

**Key Points:**
- **Deletes and inserts** work the same way
- Implementation may vary by database
- **Batching writes** in memory before flushing reduces I/O

---

## Page Content

### What Goes in Pages?

**What you store in pages is up to you** - but different storage models optimize for different workloads:

### Row-Store Databases

**How they store:**
- Write **rows and all their attributes** one after another
- Packed in the page
- **Optimized for OLTP workloads** (especially writes)

**Example:**
```
Page: [Row1: all columns] [Row2: all columns] [Row3: all columns] ...
```

### Column-Store Databases

**How they store:**
- Write rows **column by column**
- **Optimized for OLAP workloads**
- Single page read = packed with values from **one column**
- Makes aggregate functions like `SUM` much more effective

**Example:**
```
Page: [Column1: all values] [Column2: all values] [Column3: all values] ...
```

### Document-Based Databases

**How they store:**
- **Compress documents** and store them in pages
- Similar to row stores
- Documents are packed in pages

### Graph-Based Databases

**How they store:**
- Persist **connectivity** in pages
- Page read is efficient for **traversing graphs**
- Can be tuned for:
  - **Depth-first** traversal
  - **Breadth-first** traversal
  - **Search** operations

### The Goal

**Pack your items in the page** such that:
- A page read is **effective**
- Page gives you **as much useful information as possible**
- Helps with **client-side workload**

**Warning:**
- If you find yourself reading **many pages** to do **tiny little work**
- **Consider rethinking your data modeling!**
- Data modeling is underrated but crucial!

---

## Small vs Large Pages

### Trade-offs

**Small Pages:**
- ✅ **Faster to read and write**
- ✅ Especially if page size is closer to **media block size**
- ❌ **Higher overhead:** Page header metadata cost compared to useful data
- ❌ More metadata overhead per page

**Large Pages:**
- ✅ **Minimize metadata overhead**
- ✅ **Reduce page splits**
- ❌ **Higher cold read and write** costs
- ❌ Slower to read/write

### Default Page Sizes

**Common database defaults:**
- **PostgreSQL:** 8 KB
- **MySQL InnoDB:** 16 KB
- **MongoDB WiredTiger:** 32 KB
- **SQL Server:** 8 KB
- **Oracle:** 8 KB

**Key Point:**
- Database defaults work for **most cases**
- But it's important to **know these defaults**
- Be prepared to **configure it for your use case**

### Advanced Considerations

**Note:** This gets very complicated closer to the disk/SSD level:
- Technologies like **Zoned storage**
- **Key-value store namespaces** in NVMe
- Optimizations between host and media
- (These are advanced topics beyond basic page concepts)

---

## How Pages are Stored on Disk

### Method 1: File Per Table (Array of Pages)

**How it works:**
- Make a **file per table** or collection
- File is an **array of fixed-size pages**
- Page 0, followed by Page 1, followed by Page 2, etc.

**To read a page, you need:**
1. **File name** (from the table)
2. **Offset** (where to start reading)
3. **Length** (how many bytes to read)

**With this design, we have all three!**

**Formula:**
- To read page X:
  - **File name:** From the table
  - **Offset:** `X * Page_Size`
  - **Length:** `Page_Size` bytes

**Example:**
- Table: `test`
- Page size: 8 KB (8,192 bytes)
- Read pages 2 through 9:
  - **File:** `test` table file
  - **Offset:** 16,384 (2 × 8,192)
  - **Length:** 65,536 bytes (8 × 8,192)

**Benefits:**
- Simple and straightforward
- Easy to calculate offsets
- Direct mapping: page number → file offset

### Other Methods

**Important:** This is just **one way** to store pages!

**The beauty of databases:**
- **Every database implementation is different**
- Different databases use different storage methods
- Each has its own optimizations

---

## PostgreSQL Page Layout

### Overview

**PostgreSQL default page size:** 8 KB (8,192 bytes)

**PostgreSQL page structure:**
1. **Page Header** - 24 bytes
2. **ItemIds** - 4 bytes each (array of pointers)
3. **Items** - Variable length (actual data)
4. **Special** - Variable length (for B+Tree index pages)

### 1. Page Header (24 bytes)

**What it contains:**
- **Metadata** to describe what is in the page
- **Free space available** in the page
- **Fixed size:** 24 bytes

**Purpose:**
- Tracks page state
- Tracks available space
- Essential metadata for page management

### 2. ItemIds (4 bytes each)

**What they are:**
- **Array of item pointers** (NOT the items/tuples themselves!)
- Each ItemId is a **4-byte offset:length pointer**
- Points to:
  - **Offset** in the page where the item is
  - **Length** of the item

**How it works:**
- ItemId array is at the **beginning** of the page
- Each ItemId points to where the actual item (tuple) is stored
- Items are stored **after** the ItemId array

**HOT Optimization (Heap Only Tuple):**

**What is HOT?**
- When an **update** happens to a row in PostgreSQL
- A **new tuple** is generated (MVCC - Multi-Version Concurrency Control)
- If the new tuple fits in the **same page** as the old tuple
- **HOT optimization** changes the old ItemId pointer to point to the new tuple
- **Indexes and other data structures** can still point to the old tuple ID
- **Very powerful optimization!**

**How it works:**
- Old ItemId → Points to old tuple
- Update happens → New tuple created in same page
- **ItemId pointer updated** → Now points to new tuple
- Indexes don't need to be updated (still point to same ItemId)
- **Saves index maintenance cost!**

**Criticism:**
- **ItemId size:** 4 bytes each
- If you can store 1,000 items
- **Half the page (4 KB) is wasted on headers!**
- This is a trade-off PostgreSQL made

### 3. Items (Variable Length)

**What they are:**
- **The actual items (tuples/rows)** live here
- Stored **one after the other** in the page
- **Variable length** - depends on row size

**Terminology:**
- **Row:** What the user sees (logical)
- **Tuple:** Physical instance of the row in the page
- **Item:** The tuple itself

**Important:**
- The **same row** can have **multiple tuples** (MVCC)
- Example: 1 active tuple + 7 tuples for older transactions + 2 dead tuples
- Dead tuples are eventually cleaned up (VACUUM)

### 4. Special (Variable Length)

**What it is:**
- **Only applicable to B+Tree index leaf pages**
- Each page links to the **previous and next** page
- **Information about page pointers** are stored here

**Purpose:**
- Enables **sequential traversal** of index pages
- Links leaf pages together
- Important for range scans in indexes

### How Tuples are Referenced

**Process:**
1. **Index** points to an **ItemId** (in the ItemId array)
2. **ItemId** points to the **actual tuple** (offset and length)
3. Database reads the tuple from that location

**Benefits:**
- **Indirection** allows HOT optimization
- Can update tuple location without updating indexes
- Flexible page layout

---

## Summary

### Key Concepts

1. **Data in databases ends in pages:**
   - Whether it's index, sequence, or table rows
   - Everything becomes bytes in a page

2. **Pages make operations easier:**
   - Database can work with pages regardless of content
   - Easier to read, write, or cache

3. **Page structure:**
   - Page has a **header** (metadata)
   - Page has **data** (actual content)
   - Stored on disk as part of a file

4. **Database differences:**
   - Each database has **different implementation**
   - Different page layouts
   - Different storage methods
   - But the **concept is the same**

### Important Takeaways

1. **Pages are the fundamental storage unit**
2. **Buffer pool** caches pages in memory
3. **One I/O = multiple rows** (if rows are small)
4. **Page size** is a trade-off (small vs large)
5. **Different storage models** (row vs column) pack pages differently
6. **PostgreSQL uses ItemIds** for indirection (enables HOT optimization)
7. **Understanding pages** helps optimize data modeling

### Performance Implications

1. **Smaller rows = more rows per page = better I/O efficiency**
2. **Page layout matters** - affects how data is accessed
3. **HOT optimization** saves index maintenance costs
4. **Data modeling** should consider page efficiency
5. **Reading many pages for little work = bad design**

---

## Next Steps

- Understanding **B+Tree indexes** in detail
- Learning about **MVCC (Multi-Version Concurrency Control)**
- Exploring **HOT optimization** in depth
- Understanding **VACUUM** and dead tuple cleanup
- Learning about **buffer pool management**
- Exploring **different page layouts** in other databases

---

*Note: Understanding database pages is fundamental to understanding database performance. Pages are the bridge between logical data (rows, columns) and physical storage (disk). The way pages are structured and accessed directly impacts query performance. Remember: one I/O can give you many rows if your data is well-modeled!*

