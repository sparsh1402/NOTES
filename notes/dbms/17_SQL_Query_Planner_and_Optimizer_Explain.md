# Understanding The SQL Query Planner and Optimizer with EXPLAIN

## Overview

**EXPLAIN** is a PostgreSQL command used to retrieve information about what query plans PostgreSQL will use for a given SQL statement. Understanding EXPLAIN output helps you:
- Understand how your queries are executed
- Identify performance bottlenecks
- Optimize your queries
- Make informed decisions about indexing

---

## Test Setup: Grades Table

### Table Structure

**Table:** `grades`
- **Over 200 million rows** (large table for testing)
- **Columns:**
  - `id` - Integer (has index - primary key)
  - `grade` - Double (has index)
  - `name` - Text (NO index)

**Indexes:**
- ✅ Index on `id` (primary key)
- ✅ Index on `grade`
- ❌ No index on `name`

---

## What is EXPLAIN?

### Definition

**EXPLAIN** shows you:
- **Query plan** - How PostgreSQL will execute your query
- **Cost estimates** - How expensive the query will be
- **Strategy** - What method will be used (index scan, sequential scan, etc.)
- **Row estimates** - How many rows will be returned

**Important:** EXPLAIN **does NOT actually execute** the query - it just shows the plan!

**To actually execute and measure:**
- Use **EXPLAIN ANALYZE** (covered in another lesson)
- This shows **actual execution time**

---

## Understanding EXPLAIN Output

### Basic Structure

**EXPLAIN output contains:**
1. **Query Plan** - The execution strategy
2. **Cost** - Two numbers separated by dots (e.g., `0.00..289.23`)
3. **Rows** - Estimated number of rows
4. **Width** - Estimated row size in bytes

---

## Example 1: SELECT * (Worst Query)

### Query

```sql
EXPLAIN SELECT * FROM grades;
```

### Output

```
Seq Scan on grades  (cost=0.00..289.23 rows=2000000 width=31)
```

### Breaking It Down

**1. Query Plan: `Seq Scan on grades`**
- **Seq Scan** = Sequential Scan
- **Equivalent to:** Full table scan (in other databases)
- **What it means:** Database goes directly to the table/heap and fetches everything
- **Why:** No filter, selecting everything - no choice but to scan entire table

**2. Cost: `0.00..289.23`**

**First Number (0.00) - Startup Cost:**
- How many milliseconds to fetch the **first page/row**
- In this case: **0 milliseconds**
- **Why zero?** PostgreSQL immediately goes to table and fetches first row
- **Very quick** to get first result!

**When startup cost increases:**
- If PostgreSQL must do work **before fetching**
- Examples:
  - **Aggregating** (SUM, COUNT, etc.)
  - **ORDER BY** (sorting)
  - **Joins** (combining tables)
- **Key Point:** Work that happens **before** you get results

**Second Number (289.23) - Total Cost:**
- **Estimated total time** to finish the entire query
- In this case: **289.23 milliseconds** (estimated)
- **Remember:** This is an **estimation**, not actual time!
- Based on PostgreSQL's **statistics** about the table

**3. Rows: `2000000`**
- **Estimated number of rows** that will be returned
- **Very valuable** for quick estimates!
- **Not accurate**, but gives you an approximation

**Use Case:**
- Instead of `SELECT COUNT(*)` (which scans all rows)
- Use `EXPLAIN` to get **quick estimate**
- Example: Instagram likes count - don't need exact number, estimate is fine!

**4. Width: `31`**
- **Sum of all bytes** for all columns in a row
- In this case: 31 bytes total
- **ID:** 4 bytes (integer)
- **Grade:** 8 bytes (double)
- **Name:** ~19 bytes average (text)

**Important:** 
- **Larger width = more data transferred**
- **More network traffic** (TCP packets)
- **Don't SELECT * with BLOBs** if you don't need them!

---

## Example 2: ORDER BY (Indexed Column)

### Query

```sql
EXPLAIN SELECT * FROM grades ORDER BY grade;
```

### Output

```
Index Scan using grades_grade_idx on grades  (cost=0.43..289.23 rows=2000000 width=31)
```

### Breaking It Down

**1. Query Plan: `Index Scan using grades_grade_idx`**
- Uses the **index on grade** column
- **Index is already sorted!**
- Very efficient for sorting

**2. Cost: `0.43..289.23`**

**Startup Cost (0.43):**
- **Slightly higher** than before (0.00)
- **Why?** Must do some work before fetching:
  - Use index to get sorted order
  - **But it's trivial** because index is already sorted!

**Total Cost (289.23):**
- **Same as before** (almost)
- Should be similar or better

**3. Rows and Width:**
- Same as before (2,000,000 rows, 31 bytes width)

**Key Insight:**
- **Index is already sorted** - sorting is very fast!
- **Startup cost** shows the sorting work
- **Much better** than sorting without index!

---

## Example 3: ORDER BY (Non-Indexed Column)

### Query

```sql
EXPLAIN SELECT * FROM grades ORDER BY name;
```

### Output

```
Sort  (cost=1000.00..2000.00 rows=2000000 width=31)
  ->  Parallel Seq Scan on grades  (cost=0.00..218.23 rows=2000000 width=31)
```

### Breaking It Down

**1. Query Plan: `Parallel Seq Scan on grades`**
- **Parallel sequential scan** - uses multiple threads
- **Why parallel?** PostgreSQL spins up multiple worker threads
- **Scans from bottom going up** (not top to bottom)
- **No index on name** - must scan entire table

**2. Cost: `0.00..218.23`**
- **Startup:** 0.00 (nothing to do before scanning)
- **Total:** 218.23 milliseconds (scanning all rows)

**3. Then: `Sort`**
- **Must sort** all the rows by name
- **Cost: `1000.00..2000.00`**
- **Startup cost: 1000.00** - **Very high!**
- **Why?** Must sort **all 200 million rows** before returning first result!

**Key Insight:**
- **Startup cost is critical!**
- **1000 seconds** just to get to the point where you can fetch!
- **That's a lot!** (Note: This is in cost units, not actual seconds, but shows relative expense)

**4. Worker Processes:**
- **Two parallel workers** doing the scanning
- **Must merge results** at the end
- **Final merge** step shown in output

**Key Insight:**
- **First number (startup cost) is everything you need to watch!**
- **Second number (total cost) is less important** (that's the last one)
- **High startup cost = slow to get first result**

---

## Example 4: SELECT Specific Columns

### Query 1: SELECT id

```sql
EXPLAIN SELECT id FROM grades;
```

### Output

```
Seq Scan on grades  (cost=0.00..289.23 rows=2000000 width=4)
```

**Key Difference:**
- **Width: 4 bytes** (instead of 31)
- **Why?** Only returning `id` column (integer = 4 bytes)
- **Much less data** to transfer!

### Query 2: SELECT name

```sql
EXPLAIN SELECT name FROM grades;
```

### Output

```
Seq Scan on grades  (cost=0.00..289.23 rows=2000000 width=19)
```

**Key Difference:**
- **Width: 19 bytes** (average name size)
- **Text column** - variable length
- **Average** is shown (actual names vary in length)

**Important:**
- **Be careful with width** when returning data to application
- **Larger width = more network traffic**
- **More TCP packets** needed
- **Don't SELECT * with BLOBs!**

### Query 3: SELECT grade

```sql
EXPLAIN SELECT grade FROM grades;
```

### Output

```
Seq Scan on grades  (cost=0.00..289.23 rows=2000000 width=8)
```

**Key Difference:**
- **Width: 8 bytes** (double precision)
- **Only grade column** returned

---

## Example 5: WHERE Clause with Index

### Query 1: SELECT * WHERE id = 10

```sql
EXPLAIN SELECT * FROM grades WHERE id = 10;
```

### Output

```
Index Scan using grades_pkey on grades  (cost=0.43..8.45 rows=1 width=31)
  Index Cond: (id = 10)
```

### Breaking It Down

**1. Query Plan: `Index Scan using grades_pkey`**
- Uses the **primary key index** on `id`
- **Very fast!** Searches index instead of table

**2. Cost: `0.43..8.45`**
- **Startup:** 0.43 (search index)
- **Total:** 8.45 (very fast!)
- **Much better** than sequential scan!

**3. Rows: `1`**
- **Only 1 row** returned (id is unique)

**4. Index Condition: `(id = 10)`**
- Shows the **filter condition** used on the index

**5. Heap Fetch:**
- Must **jump to heap** to get all columns
- Since we selected `*`, need all columns from table

### Query 2: SELECT id WHERE id = 10 (Silly but Demonstrative)

```sql
EXPLAIN SELECT id FROM grades WHERE id = 10;
```

### Output

```
Index Only Scan using grades_pkey on grades  (cost=0.43..8.45 rows=1 width=4)
  Index Cond: (id = 10)
```

### Breaking It Down

**Key Difference: `Index Only Scan`**

**What it means:**
- **Didn't need to jump to heap!**
- **ID is in the index** (it's the indexed column)
- We only selected `id`
- **Everything needed is in the index!**

**Benefits:**
- **Faster** than Index Scan
- **No heap fetch** needed
- **Sweetest query** for performance!

**Width: 4 bytes**
- Only returning `id` (integer = 4 bytes)

**Key Insight:**
- **Index Only Scan** = Fastest possible query
- **All data in index** = No need to go to table
- **This is the goal!**

---

## Key Concepts

### 1. Sequential Scan (Seq Scan)

**What it is:**
- Scans the **entire table** row by row
- **Worst case scenario** for performance
- Used when:
  - No WHERE clause (selecting everything)
  - No index on filtered column
  - Index can't be used (expressions, LIKE with %)

**Performance:**
- **Very slow** for large tables
- Must read **all pages**
- **Avoid if possible!**

### 2. Parallel Sequential Scan

**What it is:**
- **Multiple worker threads** scan the table in parallel
- PostgreSQL's optimization
- **Faster** than single-threaded scan
- **Still slow**, but better than nothing

**When it happens:**
- Large table scans
- PostgreSQL decides it's worth using parallel workers
- **Must merge results** at the end

### 3. Index Scan

**What it is:**
- Searches the **index structure** (B-tree)
- **Much faster** than sequential scan
- **Then jumps to heap** to get actual row data

**When it happens:**
- WHERE clause on indexed column
- Exact match or range query
- Index can be used

**Performance:**
- **Much faster** (milliseconds vs seconds)
- But still needs **heap fetch** for columns not in index

### 4. Index Only Scan

**What it is:**
- **Searches index** and gets all needed data from index
- **No heap fetch** needed!
- **Fastest possible query!**

**When it happens:**
- All selected columns are in the index
- **Covering index** scenario
- **Sweetest query** for performance!

**Example:**
```sql
-- If index is on (id, name)
SELECT id, name FROM grades WHERE id = 10;
-- Can be Index Only Scan!
```

### 5. Cost Numbers

**Format: `startup_cost..total_cost`**

**Startup Cost (First Number):**
- Time to get **first result**
- **Critical number** to watch!
- **High startup cost** = slow to get first row
- Increases with:
  - Sorting (ORDER BY)
  - Aggregation (SUM, COUNT)
  - Joins

**Total Cost (Second Number):**
- **Estimated total time** for entire query
- Based on PostgreSQL statistics
- **Not actual time** (use EXPLAIN ANALYZE for that)
- **Less important** than startup cost

### 6. Rows Estimation

**What it is:**
- **Estimated number of rows** returned
- Based on PostgreSQL's **statistics**
- **Not accurate**, but good approximation

**Use Case:**
- **Quick estimates** instead of `SELECT COUNT(*)`
- Example: Instagram likes - estimate is fine!
- **Much faster** than actual count

**Warning:**
- **Don't use for exact counts**
- Use for **approximations** only

### 7. Width

**What it is:**
- **Estimated row size** in bytes
- **Sum of all column sizes** in the row

**Why it matters:**
- **Larger width = more data transferred**
- **More network traffic** (TCP packets)
- **More memory** used
- **Slower** to transfer

**Best Practice:**
- **Only SELECT what you need**
- **Don't SELECT *** with large columns (BLOBs)
- **Check width** in EXPLAIN output

---

## Best Practices

### 1. Always Use EXPLAIN

**Before optimizing:**
```sql
EXPLAIN SELECT ...;
```

**Check:**
- What strategy is used?
- Is index being used?
- What's the cost?
- How many rows?

### 2. Watch Startup Cost

**Key metric:**
- **Startup cost** tells you how long to get first result
- **High startup cost** = slow queries
- **Look for:** Sorting, aggregation, joins

### 3. Use EXPLAIN for Estimates

**Instead of:**
```sql
SELECT COUNT(*) FROM grades;  -- Very slow!
```

**Use:**
```sql
EXPLAIN SELECT * FROM grades;
-- Check "rows" estimate
```

**Much faster** for approximations!

### 4. Check Width

**Always check width:**
- **Large width** = lots of data
- **More network traffic**
- **Slower** to transfer

**Solution:**
- **Only SELECT what you need**
- **Avoid SELECT ***
- **Especially with BLOBs**

### 5. Understand Index Usage

**Check if index is used:**
- **Index Scan** = Good! ✅
- **Index Only Scan** = Best! ✅✅
- **Seq Scan** = Bad! ❌ (unless table is small)

### 6. Avoid SELECT *

**Why it's bad:**
- Pulls **all columns** (even if not needed)
- **Large width** = more data
- **Expensive** with BLOBs
- **Wasteful** - you don't use all columns

**Better:**
```sql
-- Instead of:
SELECT * FROM grades WHERE id = 10;

-- Do this:
SELECT id, name FROM grades WHERE id = 10;
```

---

## Common Patterns

### Pattern 1: Full Table Scan

**When it happens:**
- `SELECT *` with no WHERE clause
- No index on filtered column
- Expression that can't use index

**What to do:**
- Add WHERE clause
- Create index
- Rewrite query to use index

### Pattern 2: Index Scan

**When it happens:**
- WHERE clause on indexed column
- Exact match or range query

**What to do:**
- ✅ Good! Index is being used
- Consider **Index Only Scan** if possible

### Pattern 3: Index Only Scan

**When it happens:**
- All selected columns are in index
- **Covering index** scenario

**What to do:**
- ✅✅ Best! This is the goal!
- **Keep doing this!**

### Pattern 4: High Startup Cost

**When it happens:**
- ORDER BY on non-indexed column
- Aggregation (SUM, COUNT)
- Joins

**What to do:**
- **Create index** on ORDER BY column
- **Consider** if aggregation is necessary
- **Optimize joins**

---

## Important Warnings

### 1. Integer Primary Key Limit

**Warning:**
- **Don't use INTEGER** for primary key if table will grow beyond **2 billion rows**
- **Integer max:** ~2.1 billion
- **What happened to Parler:** Grew beyond 2 billion notifications, table blew up!

**Solution:**
- Use **BIGINT** for large tables
- **Plan ahead!**

### 2. EXPLAIN vs EXPLAIN ANALYZE

**EXPLAIN:**
- Shows **estimated** costs and times
- **Does NOT execute** the query
- **Fast** - just shows the plan

**EXPLAIN ANALYZE:**
- **Actually executes** the query
- Shows **actual** execution times
- **Slower** - runs the query
- **More accurate** performance data

**Use:**
- **EXPLAIN** for quick checks
- **EXPLAIN ANALYZE** for actual performance measurement

### 3. Cost Units

**Important:**
- **Cost is NOT actual time** (milliseconds or seconds)
- **Relative units** - higher = more expensive
- **Based on statistics** - may not be accurate
- **Use EXPLAIN ANALYZE** for actual times

---

## Summary

### What is EXPLAIN?

**EXPLAIN** shows you:
- **Query plan** - How query will be executed
- **Cost estimates** - Startup and total cost
- **Row estimates** - How many rows returned
- **Width** - Row size in bytes

### Key Metrics

1. **Startup Cost:** Time to get first result (watch this!)
2. **Total Cost:** Estimated total time
3. **Rows:** Estimated row count
4. **Width:** Row size in bytes

### Query Plans

1. **Seq Scan:** Full table scan (worst)
2. **Index Scan:** Uses index, then heap (good)
3. **Index Only Scan:** Everything in index (best!)

### Best Practices

1. **Always use EXPLAIN** to check queries
2. **Watch startup cost** - high = slow
3. **Use EXPLAIN for estimates** instead of COUNT(*)
4. **Check width** - larger = more data
5. **Avoid SELECT *** - only select what you need
6. **Aim for Index Only Scan** when possible

### Remember

- **EXPLAIN shows estimates** (not actual times)
- **Use EXPLAIN ANALYZE** for actual performance
- **Startup cost is critical** - shows time to first result
- **Index Only Scan** is the goal!
- **Width matters** - affects network transfer

---

## Next Steps

- Understanding **EXPLAIN ANALYZE** in detail
- Learning about **buffer hits** and **shared hits**
- Exploring **query optimization** techniques
- Understanding **statistics** and how PostgreSQL uses them
- Learning about **covering indexes** (multi-column indexes)
- Exploring **query hints** and forcing index usage

---

*Note: EXPLAIN is a powerful tool for understanding query performance. Always use it to check your queries and understand how PostgreSQL will execute them. Remember: startup cost is critical - it tells you how long to get the first result!*

