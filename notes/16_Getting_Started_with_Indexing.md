# Getting Started with Indexing

## Overview

**Database indexing** is a critical topic that every backend engineer working with databases needs to understand. This guide covers what indexing is, how it works, and the performance benefits of using indexes.

**Goal:** Understand indexing by comparing performance with and without indexes.

---

## What is an Index?

### Definition

**An index** is a **data structure** that you build and assign on top of an existing table. It:
- **Looks through your table** and analyzes it
- **Summarizes** the data
- Creates **shortcuts** for faster lookups

### The Phone Book Analogy

**Best way to think about an index:**
- Imagine a **thick phone book** (like a secretary's handbook)
- The book has **labels/colors** for each letter: A, B, C, D... Z
- **Letter A section:** All companies starting with A
- **Letter B section:** All companies starting with B
- And so on...

**How you use it:**
- Want to find "Zebra" company?
- **Go directly to the Z section**
- Start searching there (much faster!)
- **Don't search through the entire book**

**That's exactly how an index works!**

### Types of Indexes

**Two main types:**
1. **B-tree** (most common)
2. **LSM trees** (Log-Structured Merge trees)

**Note:** We won't go into depth on how they're constructed (that's a separate topic), but they're data structures that allow you to **search very effectively** and **find things quickly**.

---

## Test Setup: Employees Table

### Table Structure

**Table:** `employees`
- **11 million rows** (large table for testing)
- **ID field:** 
  - Integer, NOT NULL
  - Sequential (auto-increment)
  - **Primary key** (unique)
  - **Has index by default** (B-tree index)
- **Name field:**
  - Text/character field
  - **No index** (just random strings)
  - Generated 11 million random strings

### Creating the Test Table

**SQL Commands:**

```sql
-- Create table
CREATE TABLE employees (
    id SERIAL PRIMARY KEY,
    name TEXT
);

-- Create function to generate random strings
CREATE OR REPLACE FUNCTION random_string(length INTEGER) 
RETURNS TEXT AS 
$$
DECLARE
  chars TEXT[] := '{0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z}';
  result TEXT := '';
  i INTEGER := 0;
  length2 INTEGER := (SELECT TRUNC(RANDOM() * length + 1));
BEGIN
  IF length2 < 0 THEN
    RAISE EXCEPTION 'Given length cannot be less than 0';
  END IF;
  FOR i IN 1..length2 LOOP
    result := result || chars[1+RANDOM()*(ARRAY_LENGTH(chars, 1)-1)];
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Insert 1 million rows
INSERT INTO employees(name)
SELECT random_string(10) 
FROM generate_series(0, 1000000);
```

**Docker Setup:**
```bash
# Start PostgreSQL container
docker run --name pg -e POSTGRES_PASSWORD=postgres -d postgres

# Start container (if already exists)
docker start pg

# Connect to PostgreSQL
docker exec -it pg psql -U postgres
```

---

## Understanding EXPLAIN ANALYZE

### What is EXPLAIN ANALYZE?

**EXPLAIN ANALYZE** is a PostgreSQL command that:
- **Explains** how the query will be executed
- **Actually runs the query** and shows performance
- Tells you **how long it took**
- Shows **what strategy** the database used

**Usage:**
```sql
EXPLAIN ANALYZE SELECT * FROM employees WHERE id = 2000;
```

**Output includes:**
- **Planning time:** Time to decide execution strategy
- **Execution time:** Actual time to run the query
- **Strategy used:** Index scan, sequential scan, etc.

---

## Query Performance Examples

### Example 1: Query on Indexed Column (ID)

**Query:**
```sql
EXPLAIN ANALYZE SELECT id FROM employees WHERE id = 2000;
```

**What happens:**
- Database **scans the index** (not the table!)
- Index is **much smaller** than the table
- Uses **B-tree search** to find ID 2000
- **Very fast!**

**Performance:**
- **Execution time:** ~0.6 milliseconds
- **Strategy:** Index scan
- **Heap fetches:** 0 (didn't need to go to table!)

**Key Insight:**
- **ID is in the index** (since it's the primary key)
- We only selected ID (not name)
- **No need to go to the heap/table!**
- This is called an **inline query** or **covering index**

### Example 2: Query on Indexed Column (Selecting Name)

**Query:**
```sql
EXPLAIN ANALYZE SELECT name FROM employees WHERE id = 5000;
```

**What happens:**
1. **Search the index** for ID = 5000 (fast!)
2. **Find the row location** in the heap
3. **Jump to the table** (different data structure)
4. **Read the page** from disk
5. **Extract the name** column

**Performance:**
- **Execution time:** ~2.5 milliseconds
- **Strategy:** Index scan + heap fetch
- **Heap fetches:** 1 (had to go to table)

**Why it's slower:**
- Found ID in index (fast)
- But name is **not in the index**
- Had to **jump to the table** (different structure)
- **Additional disk read** required
- Still fast, but slower than inline query

**Key Insight:**
- **Index and table are separate structures**
- Table is the "heavier" structure (11 million rows!)
- We try to **avoid going to the table** as much as possible
- But sometimes we have to (when data isn't in index)

### Example 3: Query on Non-Indexed Column (Name)

**Query:**
```sql
EXPLAIN ANALYZE SELECT id FROM employees WHERE name = 'xz';
```

**What happens:**
- **Name column has NO index!**
- Database has **no choice** but to:
  - Go through **every single row** (one by one)
  - Do a **sequential scan** (full table scan)
  - Check each row to see if name = 'xz'
  - **Worst case scenario!**

**Performance:**
- **Execution time:** ~3 seconds (very slow!)
- **Strategy:** Parallel sequential scan
- **Rows scanned:** 11 million rows!

**Why it's so slow:**
- **No index** on name column
- Must scan **entire table**
- Check **every single row**
- PostgreSQL uses **parallel workers** (multiple threads) to help, but still slow

**Key Insight:**
- **Full table scan** is the worst thing
- You want to **avoid it as much as possible**
- Indexes prevent this!

### Example 4: LIKE Query (Pattern Matching)

**Query:**
```sql
EXPLAIN ANALYZE SELECT * FROM employees WHERE name LIKE '%z%';
```

**What this does:**
- Finds all rows where name contains 'z' (anywhere)
- `%z%` means: anything before, 'z' in the middle, anything after

**Performance:**
- **Execution time:** ~1.11 seconds
- **Strategy:** Parallel sequential scan
- **Rows scanned:** 11 million rows

**Why it's slow:**
- **Pattern matching** (`LIKE` with `%`)
- Even with an index, this is **hard to optimize**
- Must check every row
- **Very expensive query!**

---

## Creating an Index

### Creating Index on Name Column

**Command:**
```sql
CREATE INDEX employees_name ON employees(name);
```

**What happens:**
- Database **builds a B-tree index** on the name column
- Must **fetch all 11 million rows**
- **Analyzes and organizes** them into the index structure
- **Takes time** (several seconds to minutes, depending on data size)

**Why it takes time:**
- Building index is **expensive**
- Must process all existing data
- Creates the data structure
- But **worth it** for query performance!

### After Creating Index: Same Query

**Query (after index created):**
```sql
EXPLAIN ANALYZE SELECT id FROM employees WHERE name = 'xz';
```

**What happens now:**
- Database uses **bitmap index scan** on `employees_name` index
- **Much faster!** Searches the index instead of the table
- Finds the row quickly
- Then fetches from heap if needed

**Performance:**
- **Execution time:** ~47 milliseconds (much faster!)
- **Strategy:** Bitmap index scan
- **Before:** 3 seconds
- **After:** 47 milliseconds
- **~64x faster!**

**Key Insight:**
- Index makes queries **dramatically faster**
- From seconds to milliseconds!
- **Worth the initial creation cost**

---

## The LIKE Problem: Indexes Don't Always Help

### Query with LIKE (After Index Created)

**Query:**
```sql
EXPLAIN ANALYZE SELECT * FROM employees WHERE name LIKE '%z%';
```

**What happens:**
- **Back to slow query!** (even with index)
- **Still does sequential scan**
- **Index is NOT used!**

**Performance:**
- **Execution time:** Still ~1+ seconds
- **Strategy:** Parallel sequential scan (not index scan!)

**Why index doesn't help:**
- **LIKE with `%` at the beginning** (`%z%`)
- This is an **expression**, not a literal value
- **Cannot search index** on this expression
- Index works for **exact matches** or **prefix matches** (`z%`), but not `%z%`

**Key Insight:**
- **Having an index doesn't mean it will always be used!**
- Database **planner decides** whether to use index
- **Expressions** (like `LIKE '%z%'`) often can't use index
- **You must understand** when indexes help and when they don't

---

## Key Concepts

### 1. Index Scan vs Sequential Scan

**Index Scan:**
- Searches the **index structure** (B-tree)
- **Much smaller** than the table
- **Very fast** (milliseconds)
- Used when column has index

**Sequential Scan:**
- Scans the **entire table** row by row
- **Very slow** (seconds)
- Used when no index or index can't be used
- **Worst case scenario!**

### 2. Inline Query (Covering Index)

**What it is:**
- Query where **all needed data is in the index**
- **No need to go to the table/heap**
- **Sweetest query** for database engineers!

**Example:**
```sql
SELECT id FROM employees WHERE id = 2000;
```
- ID is in the index (primary key)
- We only select ID
- **No heap fetch needed!**

**Benefits:**
- **Fastest possible query**
- No disk reads to table
- Everything in index

### 3. Heap Fetch

**What it is:**
- When you need data **not in the index**
- Must **jump to the table/heap**
- **Additional disk read** required
- **Slower** than inline query

**Example:**
```sql
SELECT name FROM employees WHERE id = 5000;
```
- ID found in index (fast)
- But name is **not in index**
- Must **fetch from heap** (slower)

### 4. Planning Time vs Execution Time

**Planning Time:**
- Time for database to **decide execution strategy**
- Should we use index? Sequential scan?
- Usually **very fast** (milliseconds)

**Execution Time:**
- **Actual time** to run the query
- Includes all I/O operations
- This is what **really matters**

### 5. Caching

**Why repeated queries are faster:**
- **Multiple caches** at play:
  - SSD cache
  - OS cache
  - Database buffer pool cache
- **First query:** Reads from disk
- **Second query:** Might hit cache (much faster!)
- **Don't rely on cache** for performance testing

---

## Best Practices

### 1. Create Indexes on Frequently Queried Columns

**Rule of thumb:**
- If you **frequently query** a column
- **Create an index** on it
- Especially for **WHERE clauses**

**Example:**
```sql
-- If you often do this:
SELECT * FROM employees WHERE name = 'something';

-- Create index:
CREATE INDEX idx_employees_name ON employees(name);
```

### 2. Avoid SELECT *

**Why it's bad:**
- Pulls **all columns** (even if you don't need them)
- **Expensive** if you have large columns (BLOBs, text)
- **Wasteful** - pulls data you don't use

**Better:**
```sql
-- Instead of:
SELECT * FROM employees WHERE id = 1000;

-- Do this:
SELECT id, name FROM employees WHERE id = 1000;
-- Only select what you need!
```

### 3. Understand When Indexes Help

**Indexes help with:**
- ✅ **Exact matches:** `WHERE name = 'value'`
- ✅ **Range queries:** `WHERE id BETWEEN 1000 AND 2000`
- ✅ **Prefix matches:** `WHERE name LIKE 'z%'` (starts with z)

**Indexes DON'T help with:**
- ❌ **Pattern matching:** `WHERE name LIKE '%z%'` (contains z)
- ❌ **Expressions:** `WHERE UPPER(name) = 'VALUE'`
- ❌ **Functions:** `WHERE LENGTH(name) > 10`

### 4. Use EXPLAIN ANALYZE

**Always check your queries:**
```sql
EXPLAIN ANALYZE SELECT ...;
```

**What to look for:**
- **Index scan** = Good! ✅
- **Sequential scan** = Bad! ❌ (unless table is small)
- **Execution time** = How long it actually took

### 5. Multi-Column Indexes (Covering Indexes)

**Advanced technique:**
- Include **multiple columns** in index
- Allows **inline queries** for those columns
- **Don't need to go to heap** for those columns

**Example:**
```sql
CREATE INDEX idx_employees_id_name ON employees(id, name);

-- This query can be fully satisfied by index:
SELECT id, name FROM employees WHERE id = 1000;
```

---

## Performance Comparison Summary

| Query Type | Column | Index? | Strategy | Time | Notes |
|------------|--------|--------|----------|------|-------|
| `SELECT id WHERE id = 2000` | ID | ✅ Yes | Index scan | 0.6 ms | Inline query - fastest! |
| `SELECT name WHERE id = 5000` | ID | ✅ Yes | Index scan + Heap | 2.5 ms | Index helps, but need heap |
| `SELECT id WHERE name = 'xz'` | Name | ❌ No | Sequential scan | 3000 ms | Full table scan - very slow! |
| `SELECT id WHERE name = 'xz'` | Name | ✅ Yes | Index scan | 47 ms | After index created - much faster! |
| `SELECT * WHERE name LIKE '%z%'` | Name | ✅ Yes | Sequential scan | 1100 ms | Index can't help with LIKE % |

---

## Important Takeaways

### 1. Indexes are Data Structures

- **Separate from the table**
- **Smaller** than the table
- **Organized** for fast searching
- **B-tree** is most common type

### 2. Indexes Dramatically Improve Performance

- **Without index:** Seconds (full table scan)
- **With index:** Milliseconds (index scan)
- **64x+ faster** in our examples!

### 3. Indexes Don't Always Help

- **Planner decides** whether to use index
- **Expressions** often can't use index
- **LIKE with %** at beginning can't use index
- **You must understand** when indexes help

### 4. Inline Queries are Best

- **All data in index** = fastest
- **No heap fetch** needed
- **Sweetest query** for performance

### 5. Always Use EXPLAIN ANALYZE

- **Check your queries**
- **See what strategy** database uses
- **Measure actual performance**
- **Optimize based on results**

---

## Common Mistakes

### Mistake 1: Assuming Index is Always Used

**Wrong assumption:**
- "I created an index, so queries will be fast"
- **Reality:** Database planner decides
- **Solution:** Use EXPLAIN ANALYZE to verify

### Mistake 2: Using LIKE with %

**Problem:**
```sql
WHERE name LIKE '%z%'  -- Can't use index!
```

**Better:**
```sql
WHERE name LIKE 'z%'    -- Can use index (prefix match)
```

### Mistake 3: SELECT *

**Problem:**
- Pulls all columns (even if not needed)
- **Expensive** for large columns

**Better:**
- Select only what you need
- Better yet: Select columns that are in index (inline query)

### Mistake 4: Not Checking Query Plans

**Problem:**
- Writing queries without checking performance
- **Don't know** if index is being used

**Solution:**
- **Always use EXPLAIN ANALYZE**
- Check execution strategy
- Verify index usage

---

## Summary

### What is an Index?

**Index** is a data structure that:
- Provides **shortcuts** for finding data
- **Separate from the table**
- **Much smaller** than the table
- **Organized** for fast searching (B-tree)

### Performance Impact

- **Without index:** Full table scan (seconds)
- **With index:** Index scan (milliseconds)
- **Dramatic improvement** (64x+ faster in examples)

### Key Rules

1. **Create indexes** on frequently queried columns
2. **Avoid SELECT *** - only select what you need
3. **Use EXPLAIN ANALYZE** to check query plans
4. **Understand** when indexes help and when they don't
5. **Inline queries** (covering index) are fastest

### Remember

- **Indexes are powerful** but not magic
- **Planner decides** whether to use index
- **Expressions** often can't use index
- **Always verify** with EXPLAIN ANALYZE

---

## Next Steps

- Understanding **B-tree structure** in detail
- Learning about **multi-column indexes**
- Exploring **covering indexes** (inline queries)
- Understanding **query planning** and optimization
- Learning about **index maintenance** costs
- Exploring **different index types** (B-tree, Hash, etc.)

---

*Note: Indexes are one of the most important tools for database performance. Understanding when and how to use them is crucial for every backend engineer. Always use EXPLAIN ANALYZE to verify that your indexes are actually being used!*

