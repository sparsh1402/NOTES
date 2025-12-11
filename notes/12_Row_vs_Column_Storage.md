# Row-based vs Column-based Database Storage

## Overview

**Row-oriented** and **column-oriented** database storage are two different styles databases use to store tables on disk. Each has pros and cons - nothing is perfect. There are use cases for column-oriented databases, and there are use cases for row-oriented databases.

**Also known as:**
- Row-oriented = Row store database
- Column-oriented = Column store = Columnar database (all the same thing!)

---

## The Employee Table Example

**Table Structure:**
- Columns: ID, First Name, Last Name, Social Security Number, Salary, Date of Birth, Title, Join Date
- Rows: Thousands of employee records
- **Row ID:** Unique identifier (system-maintained, different from primary key)

**Queries to Test:**
1. `SELECT first_name FROM employees WHERE social_security_number = '666';`
2. `SELECT * FROM employees WHERE id = 1;`
3. `SELECT SUM(salary) FROM employees;` (aggregation)

**Note:** We're testing **without indexes** to understand the storage model itself.

---

## Row-Oriented Storage

### What is Row-Oriented Storage?

**Row-oriented databases** store tables **as rows on disk**.

**How it works:**
- Rows are stored **contiguously** (one after another)
- Each row contains all columns: ID, First Name, Last Name, SSN, Salary, etc.
- Then the next row starts immediately after
- Rows can be **variable size** (different name lengths, etc.)
- For simplicity, think of them as fixed-size rows

### How Data is Stored

**On disk, it looks like:**
```
Block 1: [Row 1: ID, First Name, Last Name, SSN, Salary, ...]
         [Row 2: ID, First Name, Last Name, SSN, Salary, ...]

Block 2: [Row 3: ID, First Name, Last Name, SSN, Salary, ...]
         [Row 4: ID, First Name, Last Name, SSN, Salary, ...]
```

**Key Points:**
- Each **block** (gray box) = one I/O operation
- One block can contain **multiple rows** (2, 3, 4, 5 rows - depends on block size)
- When you read a block, you get **all columns** for all rows in that block
- **You cannot choose** - you get everything!

### Block Size and I/O

**How blocks work:**
- Disk controller reads in **blocks** (512 bytes, 1024 bytes, etc.)
- **One I/O** can give you **multiple rows**
- But you get **all columns** for those rows
- Whether you want them or not!

**Example:**
- Block size allows 2 rows per block
- You want to find employee with SSN = '666'
- You read Block 1 → Get rows 1 and 2 with ALL columns
- You only need SSN, but you got First Name, Last Name, Salary, etc.
- **Wasteful reads** - pulling columns you don't need

---

## Query Examples: Row-Oriented Storage

### Query 1: SELECT first_name WHERE SSN = '666'

**Process:**
1. Start from the top (no index, must scan)
2. Read Block 1 → Check SSN values → Not found (SSN = '222', '111')
3. Read Block 2 → Check SSN values → Not found (SSN = '444', '333')
4. Read Block 3 → Check SSN values → **Found!** (SSN = '666')
5. **First name is already in memory!** (from Block 3)
6. No extra read needed - just extract first name from memory

**Result:**
- **3 I/O operations** to find the row
- **0 extra I/O** to get first name (already in memory)
- **Total: 3 I/O operations**

**Key Insight:** Once you find a row, asking for extra columns is **cheap** because they're already in memory!

### Query 2: SELECT * WHERE id = 1

**Process:**
1. Database might use trick: Link ID to Row ID (if ID is sequential)
2. Or scan blocks until found
3. Read Block 1 → Found ID = 1
4. **All columns are already in memory!**
5. Return all columns

**Result:**
- **1 I/O operation** (if lucky with Row ID trick)
- **All columns available** - very efficient!
- **Total: 1 I/O operation**

**Key Insight:** `SELECT *` is relatively cheap in row-oriented storage because all columns are in the same block!

### Query 3: SELECT SUM(salary) FROM employees

**Process:**
1. Read Block 1 → Get rows 1 and 2 → Extract salaries (100K, 102K) → Sum them
2. Read Block 2 → Get rows 3 and 4 → Extract salaries (103K, 104K) → Sum them
3. Read Block 3 → Get rows 5 and 6 → Extract salaries (105K, 106K) → Sum them
4. Continue for all blocks...

**Problem:**
- **Every block read** gives you ALL columns
- You only need **salary**, but you get:
  - Row IDs, First Names, Last Names, SSNs, Birth Dates, Titles, Join Dates
- **Wasteful I/O** - pulling lots of data you don't use
- Must read **almost the entire table**

**Result:**
- **Many I/O operations** (one per block)
- **Lots of unnecessary data** read
- **Very inefficient** for aggregation queries

**Key Insight:** Row-oriented storage is **inefficient for aggregation** because you pull all columns but only use one!

---

## Column-Oriented Storage

### What is Column-Oriented Storage?

**Column-oriented databases** store tables **as columns on disk**.

**How it works:**
- Take **all values** from Column 1 (e.g., all IDs)
- Store them **consecutively** on disk
- Then take **all values** from Column 2 (e.g., all First Names)
- Store them **consecutively** on disk
- Continue for all columns

**Example:**
```
ID Column:        [1, 2, 3, 4, 5, 6, ...]
First Name Column: [John, Melissa, Rick, Paul, Hussein, ...]
Last Name Column:  [Smith, Johnson, Williams, ...]
SSN Column:        [111, 222, 333, 444, 555, 666, ...]
Salary Column:     [100K, 102K, 103K, 104K, 105K, 106K, ...]
```

### How Data is Stored

**On disk, it looks like:**
```
ID Block 1:        [1, 2, 3, 4]
ID Block 2:        [5, 6, 7, 8]

First Name Block 1: [John, Melissa, Rick, Paul]
First Name Block 2: [Hussein, ...]

SSN Block 1:       [111, 222, 333, 444]
SSN Block 2:       [555, 666, 777, 888]

Salary Block 1:     [100K, 102K, 103K, 104K]
```

**Key Points:**
- **Row ID is duplicated** in every column structure
- Each column is stored separately
- Columns can span multiple blocks (if many rows)
- **Adding a new row** requires updating ALL column structures
- **Deleting a row** requires marking it in ALL column structures

**Complexity:**
- Much more complex than row-oriented
- Must maintain row ID references across all columns
- Writes are more expensive

---

## Query Examples: Column-Oriented Storage

### Query 1: SELECT first_name WHERE SSN = '666'

**Process:**
1. **Only read SSN column** (don't need other columns!)
2. Read SSN Block 1 → Check values → Not found
3. Read SSN Block 2 → Check values → **Found!** (SSN = '666')
4. Found that SSN '666' corresponds to **Row ID 1006**
5. Now need first name → Jump to **First Name column**
6. Read First Name Block (where Row ID 1006 is located)
7. Extract first name for Row ID 1006

**Result:**
- **2 I/O operations** for SSN column
- **1 I/O operation** for First Name column
- **Total: 3 I/O operations**

**Key Insight:** Column-oriented is efficient when you only need a few columns!

### Query 2: SELECT * WHERE id = 1

**Process:**
1. Read ID column → Find ID = 1 → Maps to Row ID 1001
2. Jump to First Name column → Read block containing Row ID 1001
3. Jump to Last Name column → Read block containing Row ID 1001
4. Jump to SSN column → Read block containing Row ID 1001
5. Jump to Salary column → Read block containing Row ID 1001
6. Jump to Date of Birth column → Read block containing Row ID 1001
7. Jump to Title column → Read block containing Row ID 1001
8. Jump to Join Date column → Read block containing Row ID 1001

**Result:**
- **1 I/O** for ID column
- **7 I/O operations** for each other column (one per column)
- **Total: 8 I/O operations**
- **Disk thrashing!** (jumping around between columns)

**Key Insight:** `SELECT *` is **TERRIBLE** in column-oriented storage! This is the worst query you can do!

**Warning:** Don't do `SELECT *` in column-oriented databases - it kills performance (and ducks)!

### Query 3: SELECT SUM(salary) FROM employees

**Process:**
1. **Only read Salary column!**
2. Read Salary Block 1 → Get all salary values → Sum them
3. Read Salary Block 2 → Get all salary values → Sum them
4. Continue for all salary blocks...

**Result:**
- **Only I/O operations for Salary column!**
- **No other columns read!**
- **Extremely efficient!**
- **Total: Very few I/O operations** (only salary blocks)

**Key Insight:** Column-oriented storage is **AMAZING** for aggregation queries on single columns!

### Compression Bonus

**Column-oriented databases can compress better:**
- If multiple people have the same salary (e.g., 100K)
- Store: `100K → [Row IDs: 1003, 1004, 1005]`
- **Deduplication** - store value once with list of row IDs
- **Even more efficient!**

**Example:**
- Instead of: `100K, 100K, 100K, 102K, 102K`
- Store: `100K → [3 rows], 102K → [2 rows]`
- **Massive space savings!**

---

## Pros and Cons Comparison

### Row-Oriented Storage

#### Pros ✅

1. **Optimal for Read and Write (Transactions)**
   - Very simple implementation
   - Fast writes
   - Fast reads (when you need multiple columns)
   - Great for **OLTP (Online Transaction Processing)**

2. **Efficient for Multi-Column Queries**
   - When you need many columns from the same row
   - `SELECT *` is relatively cheap
   - All columns in same block

3. **Simple Structure**
   - Easy to understand
   - Easy to implement
   - Easy to optimize

4. **Efficient WAL (Write Ahead Log)**
   - Know exactly which blocks to touch
   - Can write to WAL efficiently
   - Clear structure

#### Cons ❌

1. **Inefficient Compression**
   - Row contains different data types
   - Values are not similar (name, SSN, salary all different)
   - Compression algorithms can't find many patterns
   - **Not as effective** as column-oriented

2. **Inefficient for Aggregation**
   - Must read all columns to aggregate one
   - Pull lots of unnecessary data
   - Wasteful I/O operations

3. **Inefficient for Single-Column Queries**
   - Must read entire rows
   - Get columns you don't need

---

### Column-Oriented Storage

#### Pros ✅

1. **Perfect for OLAP (Online Analytical Processing)**
   - Great for analytics
   - Great for reporting
   - Great for data warehousing

2. **Excellent Compression**
   - Similar values stored together
   - Compression algorithms work magic
   - Can deduplicate (same value → list of row IDs)
   - **Much better compression** than row-oriented

3. **Efficient for Aggregation**
   - Only read the column you need
   - No unnecessary data
   - **Very fast** for `SUM`, `AVG`, `COUNT`, etc.

4. **Efficient for Single-Column Queries**
   - Only read that column
   - Skip all other columns

#### Cons ❌

1. **Slow Writes**
   - Must update ALL column structures
   - Very similar to updating multiple indexes
   - **Scattershot writes** - expensive!

2. **Complex Structure**
   - More complex than row-oriented
   - Must maintain row ID references
   - Harder to implement

3. **Inefficient for Multi-Column Queries**
   - `SELECT *` is terrible!
   - Must jump between many column blocks
   - **Disk thrashing** - very slow!

4. **Inefficient for Transactions**
   - Not good for OLTP
   - Writes are slow
   - Complex to maintain

---

## When to Use Which?

### Use Row-Oriented Storage When:

1. **OLTP (Online Transaction Processing)**
   - Banking systems
   - E-commerce transactions
   - Real-time applications
   - Frequent writes and reads

2. **You Need Multiple Columns**
   - `SELECT *` queries
   - Queries that touch many columns
   - Transactional workloads

3. **Simple Structure Needed**
   - Easier to understand
   - Easier to maintain
   - General-purpose applications

**Examples:** PostgreSQL, MySQL, SQL Server (default), Oracle (default)

### Use Column-Oriented Storage When:

1. **OLAP (Online Analytical Processing)**
   - Data warehousing
   - Business intelligence
   - Analytics and reporting
   - **Read-heavy, write-light** workloads

2. **Aggregation Queries**
   - `SUM`, `AVG`, `COUNT` on single columns
   - Analytics on specific metrics
   - Reporting queries

3. **Static or Mostly Read-Only Data**
   - Data lakes
   - Historical data
   - Data that doesn't change often

**Examples:** SAP HANA, some Oracle features, specialized analytics databases

---

## Hybrid Approach: Storage Engines

### Database Storage Engines

**Many databases support both:**
- You can **choose the storage engine** per table
- One table can be **row-oriented**
- Another table can be **column-oriented**
- **Mix and match** based on needs!

**How to Choose:**
- **Analytics table?** → Use column-oriented
- **Transactional table?** → Use row-oriented
- **Frequent writes?** → Use row-oriented
- **Mostly reads with aggregation?** → Use column-oriented

**Important Note:**
- **Cannot join** row-oriented table with column-oriented table efficiently
- Some databases support it, but it's **disastrous** for performance
- Stick to one storage type per query

---

## Summary

### Row-Oriented Storage

**Best for:**
- ✅ OLTP (transactions)
- ✅ Multi-column queries
- ✅ `SELECT *` queries
- ✅ Frequent writes

**Worst for:**
- ❌ Aggregation on single columns
- ❌ Analytics queries
- ❌ Compression

### Column-Oriented Storage

**Best for:**
- ✅ OLAP (analytics)
- ✅ Aggregation queries
- ✅ Single-column queries
- ✅ Compression
- ✅ Data warehousing

**Worst for:**
- ❌ `SELECT *` queries
- ❌ Multi-column queries
- ❌ Frequent writes
- ❌ OLTP (transactions)

### Key Takeaways

1. **Row-oriented:** Simple, great for transactions, all columns together
2. **Column-oriented:** Complex, great for analytics, columns separate
3. **Choose based on use case:** OLTP → Row, OLAP → Column
4. **Never do `SELECT *`** in column-oriented databases!
5. **Many databases support both** - choose per table
6. **Nothing is perfect** - each has trade-offs

---

## Real-World Examples

### Row-Oriented Use Cases

**Banking System:**
- Need to read all account info at once
- Frequent updates
- Transactional workload
- **Row-oriented is perfect!**

**E-commerce:**
- Need product details (name, price, description, etc.)
- Frequent writes (inventory updates)
- **Row-oriented is perfect!**

### Column-Oriented Use Cases

**Sales Analytics:**
- `SELECT SUM(revenue) FROM sales WHERE date BETWEEN ...`
- Only need revenue column
- Historical data (rarely updated)
- **Column-oriented is perfect!**

**Business Intelligence:**
- Aggregations on metrics
- Reporting queries
- Read-heavy workload
- **Column-oriented is perfect!**

---

## Next Steps

- Understanding **B-trees** in detail
- Learning about **storage engines** in different databases
- Exploring **compression techniques** in column stores
- Understanding **vertical partitioning**
- Learning about **data warehousing** architectures

---

*Note: Understanding row vs column storage helps you choose the right database and storage engine for your use case. Row-oriented is great for transactions, column-oriented is great for analytics. Choose wisely based on your workload!*

