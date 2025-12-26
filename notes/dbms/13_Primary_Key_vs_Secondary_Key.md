# Primary Key vs Secondary Key

## Overview

**Primary Key** and **Secondary Key** (also called **Primary Index** and **Secondary Index**) are almost analogous concepts, but they have **very subtle differences**. Understanding these differences helps you:
- Optimize your queries
- Know what you're doing when executing queries
- Make informed decisions about database design

**Key Insight:** When we say "primary key," it gives you much more information than just "it's unique." It has implicit information that affects how the table is organized and how queries perform.

---

## Understanding the Heap (Table Space)

### What is the Heap?

**Heap** (also called **table space**) is:
- A dedicated area on disk where table data is stored
- Usually a **slow access space** (not as much these days, but still)
- Where all the data, expensive data, large datasets are stored
- In row store databases, rows are stored here

### Default Table Organization

**Without primary key:**
- Table is organized **row by row**
- **There is NO order** enforced by default
- Rows are just **appended** as they come
- If you insert value 7 → goes to top
- If you insert value 1 → goes to bottom
- If you insert value 2 → still goes to bottom
- **No ordering maintained!**

**Example:**
```
Insert 7 → [7, ...]
Insert 1 → [7, ..., 1, ...]
Insert 2 → [7, ..., 1, ..., 2, ...]
```
Rows are just appended, no ordering!

---

## Primary Key (Clustered Index)

### What is a Primary Key?

**Primary Key** does more than just ensure uniqueness:
- It **organizes the table** around that key
- This is called **clustering**
- The table is **clustered** (organized) around the primary key

### Clustering Concept

**Clustering** means:
- The table is **organized** around the primary key
- Rows must **maintain order** based on the primary key
- When you insert a row, it must **fit into the correct position**
- There is an **additional cost** associated with this ordering

**But the benefit:**
- It's almost like **an index in the table itself**
- The table is organized that way
- Very efficient for certain queries

### Terminology

**Different databases use different terms:**
- **Oracle:** IOT (Index Organized Table) - **Not to be confused with Internet of Things!**
- **PostgreSQL/Others:** Clustered Index
- **General:** Primary Key (when it's clustered)

**Key Point:** When you say "primary key," it often means the table is organized around that key (clustered).

---

## How Primary Key Works: Example

### Insertion Example

**Step 1: Insert value 1**
```
Table: [1, First Name, Last Name, ...]
```

**Step 2: Insert value 8**
```
Table: [1, First Name, Last Name, ...]
        [8, First Name, Last Name, ...]
```
Value 8 goes after 1 (maintains order).

**Step 3: Insert value 2**
```
Table: [1, First Name, Last Name, ...]
        [2, First Name, Last Name, ...]  ← Must go here!
        [8, First Name, Last Name, ...]
```
Value 2 must sit **right after value 1** to maintain order!

**The Challenge:**
- Value 8 was already there
- Value 2 needs to go between 1 and 8
- Database must **reorganize** to fit value 2 in the correct position

### How Databases Handle This

**Databases are smart:**
- They don't shift and lift rows like in the naive example
- They use **pages** and **leave space** for future inserts
- They know: "Value 1 and value 8 are here, I'll leave space for 2, 3, 4, 5, 6, 7"
- **But there's still extra cost** for maintaining order

**The Cost:**
- Must maintain ordering
- Inserts might require reorganization
- More expensive than just appending

**The Benefit:**
- Table is organized
- Very efficient for range queries
- Almost like having an index built into the table

---

## Primary Key: Range Query Benefits

### Example: Range Query

**Query:** "Give me all values from 1 to 9"

**With Primary Key (Clustered):**
- Values are **nicely organized** together
- 1, 2, 3, 4, 5, 6, 7, 8, 9 are all **tucked together**
- **One I/O operation** can get all these values
- **Beautifully efficient!**

**Why it's efficient:**
- Values are stored consecutively
- One page read gets multiple consecutive values
- **Minimal I/O operations**

### The Problem with Random Primary Keys

**UUID as Primary Key:**
- UUIDs are **random** in nature
- If UUID is your primary key, table is organized around random values
- When you insert, you're **jumping through the heap left and right**
- **No benefit** from memory caching
- **Very inefficient!**

**Example:**
- Insert UUID-1 → Goes to page 100
- Insert UUID-2 → Goes to page 50 (random!)
- Insert UUID-3 → Goes to page 200 (random!)
- **Scattershot writes** - very expensive!

**Key Insight:** Random primary keys (like UUIDs) **kill performance** in clustered indexes!

### Sequential Primary Keys

**Sequential IDs (auto-increment):**
- 1, 2, 3, 4, 5, 6, 7, 8, 9...
- Values are **consecutive**
- Inserts go to the **end** of the table
- **Very efficient!**
- Benefits from memory caching

**Key Insight:** Sequential primary keys are **much better** for clustered indexes!

---

## Database-Specific Behavior

### MySQL

**Default Behavior:**
- **You must have a primary key** (by default)
- You get one for free (sequential)
- **Table is always clustered** around primary key
- **No option** to have unclustered table

**Implication:**
- Every table is organized around its primary key
- Be careful about primary key choice (avoid UUIDs!)

### Oracle

**Options:**
- **Can have** Index Organized Table (IOT)
- **Don't have to** - it's optional
- You can choose whether to cluster or not

### SQL Server

**Options:**
- **Can have** clustered index (primary key)
- **Don't have to** - it's optional
- You can have unclustered primary key
- You can have clustered index on non-primary key column

### PostgreSQL

**Default Behavior:**
- **All indexes are secondary indexes**
- **No primary indexes** (clustered indexes) by default
- Primary key is just a **secondary index**
- **Can cluster** a table around an index (optional)

**Key Difference:**
- PostgreSQL doesn't automatically cluster around primary key
- You can manually cluster if needed
- All indexes point to Row ID (not primary key)

---

## Secondary Key (Secondary Index)

### What is a Secondary Key?

**Secondary Key** (Secondary Index) is:
- An **additional outside structure**
- **Separate from the table**
- The table itself is a **jumbled mess** (no order)
- The index is **ordered** (B-tree structure)
- Index points to the table (heap)

### How Secondary Index Works

**Table (Heap):**
```
[Value 1, ...]
[Value 7, ...]
[Value 300, ...]
[Value 7, ...]
[Value 8, ...]
```
**No order** - just a jumbled mess!

**Secondary Index (B-tree):**
```
1 → Row ID A
7 → Row ID B, Row ID D
8 → Row ID E
300 → Row ID C
```
**Ordered structure** - separate from table!

### How Queries Work with Secondary Index

**Process:**
1. **Search the index** (B-tree) - find the value you're looking for
2. **Get Row IDs** - index tells you which rows contain the value
3. **Jump to heap** - go to the table to fetch the actual rows
4. **Return data** - get all columns from the heap

**Example Query:**
```sql
SELECT * FROM employees WHERE employee_id = 7;
```

**Steps:**
1. Search index for employee_id = 7
2. Index says: "Row ID B and Row ID D have employee_id = 7"
3. Jump to heap, read Row ID B
4. Jump to heap, read Row ID D
5. Return both rows

**The Disadvantage:**
- Must do **two jumps**: Index → Heap
- **More I/O operations** than clustered index
- Table is not organized, so rows might be scattered

**The Advantage:**
- Table doesn't need to maintain order
- **Faster inserts** (just append to heap)
- Can have **multiple secondary indexes**

---

## Primary Key vs Secondary Key: Comparison

### Primary Key (Clustered Index)

**Characteristics:**
- Table is **organized** around the key
- Rows are **ordered** by the key
- **One per table** (usually)
- **Built into the table** structure

**Pros:**
- ✅ **Very efficient for range queries**
- ✅ Values are stored together
- ✅ **One I/O** can get many consecutive values
- ✅ Almost like index built into table

**Cons:**
- ❌ **Slower inserts** (must maintain order)
- ❌ **Random keys are terrible** (UUID problem)
- ❌ **Reorganization cost** when inserting

**Best For:**
- Sequential primary keys
- Range queries
- Queries that benefit from ordered data

### Secondary Key (Secondary Index)

**Characteristics:**
- Table is **not organized** (jumbled mess)
- Index is **separate structure** (B-tree)
- **Multiple indexes** possible
- Index points to **Row IDs** in heap

**Pros:**
- ✅ **Faster inserts** (just append to heap)
- ✅ **Multiple indexes** on same table
- ✅ **No reorganization** needed
- ✅ Works with any key type (even UUIDs)

**Cons:**
- ❌ **Two jumps**: Index → Heap
- ❌ **More I/O operations**
- ❌ **Less efficient** for range queries
- ❌ Rows might be scattered in heap

**Best For:**
- Multiple search criteria
- Random keys (UUIDs)
- Write-heavy workloads
- When you need multiple indexes

---

## PostgreSQL Special Case

### PostgreSQL Behavior

**PostgreSQL:**
- **All indexes are secondary indexes**
- Primary key is **just a secondary index**
- **No automatic clustering** around primary key
- All indexes point to **Row ID** (not primary key)

**Can You Cluster in PostgreSQL?**
- Yes, you can **manually cluster** a table around an index
- But it's **not automatic**
- Primary key doesn't automatically cluster the table

**Key Difference:**
- **MySQL:** Primary key = Clustered index (automatic)
- **PostgreSQL:** Primary key = Secondary index (not clustered)

---

## Terminology Comparison

### Index Organized Table (IOT) - Oracle Term

**What it means:**
- Table is **organized around an index**
- Index and table are **integrated**
- **Self-descriptive** term (the instructor prefers this!)

**Example:** Oracle's IOT

### Clustered Index - PostgreSQL/SQL Server Term

**What it means:**
- Table is **clustered** around an index
- Same concept as IOT
- Different terminology

### Heap Organized Table (HOT)

**What it means:**
- Table is **not organized** around any index
- Just a **random heap**
- **No primary key** that organizes it
- Rows are just appended

**Example:** Table without clustered index

---

## Key Takeaways

### Primary Key (Clustered)

1. **Organizes the table** around the key
2. **Maintains order** - rows are sorted by key
3. **Efficient for range queries** - values stored together
4. **Slower inserts** - must maintain order
5. **Random keys are bad** - UUIDs kill performance
6. **One per table** (usually)

### Secondary Key (Secondary Index)

1. **Separate structure** from table
2. **Table is jumbled** - no order maintained
3. **Faster inserts** - just append to heap
4. **Two jumps needed** - Index → Heap
5. **Multiple indexes** possible
6. **Works with any key type**

### Database Differences

1. **MySQL:** Primary key always clustered (must have one)
2. **PostgreSQL:** All indexes are secondary (no automatic clustering)
3. **Oracle:** Can choose IOT or not (optional)
4. **SQL Server:** Can choose clustered or not (optional)

### Best Practices

1. **Use sequential IDs** for primary keys (if clustered)
2. **Avoid UUIDs** as primary keys (if clustered)
3. **Use secondary indexes** for multiple search criteria
4. **Use clustered index** for range queries
5. **Understand your database** - behavior differs!

---

## Summary

### Primary Key (Clustered Index)

**What it is:**
- Table organized around the key
- Rows maintain order
- Almost like index built into table

**When to use:**
- Sequential primary keys
- Range queries
- When order matters

**Avoid:**
- Random keys (UUIDs)
- Write-heavy workloads (if order maintenance is expensive)

### Secondary Key (Secondary Index)

**What it is:**
- Separate index structure
- Table is not organized
- Points to Row IDs in heap

**When to use:**
- Multiple search criteria
- Random keys (UUIDs)
- Write-heavy workloads
- When you need multiple indexes

### The Bottom Line

**Primary Key gives you more than uniqueness:**
- It tells you the table is **organized** around that key
- It affects **insert performance**
- It affects **query performance**
- It affects **storage organization**

**Understanding this helps you:**
- Choose the right primary key
- Optimize your queries
- Make informed database design decisions

---

## Next Steps

- Understanding **B-trees** in detail
- Learning about **index maintenance** costs
- Exploring **UUID vs Sequential ID** trade-offs
- Understanding **clustering** in different databases
- Learning about **composite indexes**

---

*Note: The difference between primary and secondary keys is subtle but important. Primary keys often organize the table (clustered), while secondary keys are separate structures pointing to the table. Understanding this helps you optimize your database design and queries!*

