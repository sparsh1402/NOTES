# Isolation

## Overview

**Isolation** is the third property in the ACID system. It is a **very critical and underrated property** that not many people truly understand the ramifications of.

Understanding transaction isolation is essential for building robust database applications, especially when dealing with concurrent transactions.

---

## The Core Question

**Can my in-flight transaction see changes made by other transactions that are also in-flight?**

This question extends to:
- Other in-flight transactions
- Even transactions that have **finished** (committed)

**Example Scenario:**
- You're running a transaction, reading data repeatedly
- Another transaction commits a change while you're still running
- **Should you see this change?**

**Answer:** It depends. There is no right or wrong answer - it depends on your use case and what you're trying to achieve.

---

## Read Phenomena

**Read phenomena** are usually **undesirable side effects** that occur when transactions interact with each other. These are the "bad things" that can happen when isolation is not properly managed.

Understanding these phenomena helps you:
- Recognize when you encounter them
- Debug issues (they're among the nastiest things to debug)
- Choose appropriate isolation levels

### The Four Read Phenomena

1. **Dirty Read**
2. **Non-repeatable Read**
3. **Phantom Read**
4. **Lost Updates**

---

## 1. Dirty Read

### Definition

A **dirty read** occurs when an in-flight transaction reads data that another transaction has written but **hasn't committed yet**.

**Why it's called "dirty":**
- The write is not fully flushed or committed
- It might change (could be rolled back)
- It's "dirty" because it's not final

### Example: Sales Report

**Setup:**
- Table: `sales` with columns: `product_id`, `quantity`, `price`
- Product 1: quantity = 10, price = $5 → total = $50
- Product 2: quantity = 20, price = $4 → total = $80

**Transaction 1 (Report Generation):**
```sql
BEGIN TRANSACTION;

-- First query: Get individual product totals
SELECT product_id, quantity * price AS total
FROM sales;
-- Returns: Product 1 = $50, Product 2 = $80

-- Second query: Get sum of all sales
SELECT SUM(quantity * price) AS total_sales
FROM sales;
-- Returns: $155 (WRONG!)
```

**Transaction 2 (Concurrent Update):**
```sql
BEGIN TRANSACTION;

-- Add 5 more sales to Product 1
UPDATE sales 
SET quantity = quantity + 5 
WHERE product_id = 1;
-- Now quantity = 15, total = $75

-- BUT: Transaction 2 hasn't committed yet!
-- Transaction 1 reads this uncommitted value
```

**The Problem:**
- Transaction 1 reads Product 1 as $75 (uncommitted)
- Transaction 1 calculates sum: $75 + $80 = $155
- **Expected sum:** $50 + $80 = $130
- **Actual sum shown:** $155 (inconsistent!)

**Worse Scenario:**
- Transaction 2 then **rolls back** (the 5 sales didn't actually happen)
- Transaction 1's report shows $155, but the actual committed value is $130
- **Data is completely inconsistent**

**Result:** Inconsistent data in reports, which can lead to wrong business decisions.

---

## 2. Non-repeatable Read

### Definition

A **non-repeatable read** occurs when:
- You read a value in a transaction
- You read it again (or read a value that depends on it) in the **same transaction**
- The value has **changed** between the two reads

**Important Note:** This isn't about running the exact same query twice. It's about:
- Different queries that yield the same underlying value
- Aggregation functions that read the same data
- Example: `SELECT balance` then `SELECT SUM(balance)` - both depend on the same account balance

### Example: Sales Report with Aggregation

**Setup:**
- Same `sales` table
- Product 1: quantity = 10, price = $5 → total = $50
- Product 2: quantity = 20, price = $4 → total = $80

**Transaction 1:**
```sql
BEGIN TRANSACTION;

-- First read: Individual products
SELECT product_id, quantity * price AS total
FROM sales;
-- Returns: Product 1 = $50, Product 2 = $80
```

**Transaction 2 (Committed):**
```sql
BEGIN TRANSACTION;

-- Add 5 more sales to Product 1
UPDATE sales 
SET quantity = quantity + 5 
WHERE product_id = 1;
-- Now quantity = 15

COMMIT; -- ✅ This is COMMITTED (not a dirty read)
```

**Transaction 1 (Continued):**
```sql
-- Second read: Sum all sales
SELECT SUM(quantity * price) AS total_sales
FROM sales;
-- Returns: $155 (includes the committed change)
```

**The Problem:**
- First read: Product 1 = $50, Product 2 = $80
- Second read (sum): $155
- **Expected sum:** $50 + $80 = $130
- **Actual sum:** $155 (inconsistent within the same transaction!)

**Why This Happens:**
- Transaction 2 committed its change
- Transaction 1 sees the committed change in the second query
- But Transaction 1's first query saw the old value
- **Inconsistent view within the same transaction**

### Implementation Considerations

**Fixing non-repeatable reads is expensive:**

1. **PostgreSQL (MVCC - Multi-Version Concurrency Control):**
   - Any update creates a **new version** of the row
   - Never changes the original value
   - Transaction reads the original version via a version pointer
   - More efficient for long-running transactions

2. **MySQL/Oracle/SQL Server:**
   - Changes the final value in place
   - Maintains an **undo log** (undo stack) with previous values
   - When a transaction needs the old value, it must read from the undo log
   - Can be expensive for long-running transactions

**Key Insight:** Non-repeatable reads can be acceptable in some scenarios, but fixing them has performance costs.

---

## 3. Phantom Read

### Definition

A **phantom read** occurs when:
- You execute a **range query** (e.g., `SELECT ... WHERE date BETWEEN ...`)
- You get a certain number of results
- Another transaction **inserts a new row** that satisfies your range query
- You execute the same query again and get a **different number of results**
- The new row "appears" like a phantom

**Why it's different from non-repeatable read:**
- You didn't read the new row in the first place (it didn't exist)
- It's a completely new row that appears
- You can't "lock" something that doesn't exist yet

### Example: Range Query

**Setup:**
- Same `sales` table
- Product 1: $50
- Product 2: $80

**Transaction 1:**
```sql
BEGIN TRANSACTION;

-- First query: Get all sales
SELECT product_id, quantity * price AS total
FROM sales;
-- Returns: Product 1 = $50, Product 2 = $80
```

**Transaction 2:**
```sql
BEGIN TRANSACTION;

-- Insert a completely new product
INSERT INTO sales (product_id, quantity, price)
VALUES (3, 10, 1);
-- New row: Product 3 = $10

COMMIT; -- ✅ Committed
```

**Transaction 1 (Continued):**
```sql
-- Second query: Sum all sales
SELECT SUM(quantity * price) AS total_sales
FROM sales;
-- Returns: $140 (includes Product 3!)
```

**The Problem:**
- First query: 2 products, total = $130
- Second query: 3 products, total = $140
- **Expected:** $130
- **Actual:** $140 (phantom row appeared)

**Why This Happens:**
- You can't lock a row that doesn't exist
- The new row satisfies your range query
- It "sneaks in" between your reads

**Implementation Challenge:**
- How do you prevent new rows from appearing?
- You can't lock something that doesn't exist
- This requires more sophisticated isolation mechanisms

---

## 4. Lost Updates

### Definition

A **lost update** occurs when:
- Transaction A writes a value
- Transaction B writes to the same value **before Transaction A commits**
- Transaction A's update is **lost** (overwritten)

**Common Scenario:**
- Two transactions read the same value
- Both update it based on what they read
- The second commit overwrites the first
- One update is lost

### Example: Concurrent Quantity Updates

**Setup:**
- Product 1: quantity = 10

**Transaction 1:**
```sql
BEGIN TRANSACTION;

-- Read quantity
SELECT quantity FROM sales WHERE product_id = 1;
-- Returns: 10

-- Update: Add 10 more sales
UPDATE sales 
SET quantity = quantity + 10 
WHERE product_id = 1;
-- Sets quantity = 20
```

**Transaction 2 (Concurrent):**
```sql
BEGIN TRANSACTION;

-- Read quantity (reads original value: 10)
SELECT quantity FROM sales WHERE product_id = 1;
-- Returns: 10 (both transactions read the same value!)

-- Update: Add 5 more sales
UPDATE sales 
SET quantity = quantity + 5 
WHERE product_id = 1;
-- Sets quantity = 15 (overwrites Transaction 1's update!)
```

**Transaction 2 commits first:**
- Final value: 15
- Transaction 1's update (adding 10) is **lost**

**The Problem:**
- Expected: 10 + 10 + 5 = 25
- Actual: 15 (Transaction 1's +10 is lost)
- **One update was completely lost**

**Solution:**
- Use **row-level locks**
- When a transaction updates a row, it locks it
- Other transactions must wait until the lock is released
- Prevents lost updates

---

## Isolation Levels

**Isolation levels** were invented to solve the undesirable read phenomena. They define what changes a transaction can see from other concurrent transactions.

### Setting Isolation Level

```sql
SET TRANSACTION ISOLATION LEVEL <level>;
```

---

## 1. Read Uncommitted

**Definition:** No isolation. A transaction can read uncommitted changes from other transactions.

**Characteristics:**
- **No isolation** - any changes from outside are visible, whether committed or not
- Can read uncommitted values (dirty reads)
- Technically fast (no overhead for maintaining isolation)
- **Not recommended** - allows all read phenomena

**Read Phenomena Allowed:**
- ✅ Dirty Reads
- ✅ Non-repeatable Reads
- ✅ Phantom Reads
- ✅ Lost Updates

**Note:** Most databases don't support this (except SQL Server as an option). It's essentially "no isolation."

---

## 2. Read Committed

**Definition:** Each query in a transaction only sees changes that have been **committed** by other transactions.

**Characteristics:**
- **Most popular isolation level**
- Many databases optimize for read committed workloads
- **Default isolation level** for many databases
- If a transaction commits while you're running, you'll see that change
- Can lead to inconsistencies in long-running transactions

**How it works:**
- If Transaction B makes a change while Transaction A is reading
- Transaction A won't see it unless Transaction B commits
- Once Transaction B commits, Transaction A can see the change (even if still running)

**Read Phenomena Allowed:**
- ❌ Dirty Reads (fixed)
- ✅ Non-repeatable Reads
- ✅ Phantom Reads
- ✅ Lost Updates

**Use Case:** Good for most applications, but be aware of potential inconsistencies in long-running transactions.

---

## 3. Repeatable Read

**Definition:** When a query reads a row, that row will remain **unchanged** for the duration of the transaction.

**Characteristics:**
- Fixes **non-repeatable reads**
- Once you read a value, it won't change (as long as you're in the same transaction)
- Only applies to rows you've actually read
- Doesn't prevent new rows from appearing (phantom reads)

**How it works:**
- When you read a row, the database ensures it won't change
- Uses locking or versioning mechanisms
- Can be expensive if you read many rows

**Read Phenomena Allowed:**
- ❌ Dirty Reads (fixed)
- ❌ Non-repeatable Reads (fixed)
- ❌ Lost Updates (fixed)
- ✅ Phantom Reads (still possible)

**Implementation:**
- **Pessimistic:** Locks rows that are read
- **Optimistic:** Uses versioning (like PostgreSQL's MVCC)

---

## 4. Snapshot Isolation

**Definition:** Each query in a transaction only sees changes that have been committed **up to the start of the transaction**. It's like taking a snapshot of the entire database at that moment.

**Characteristics:**
- **Guaranteed to eliminate all read phenomena**
- Provides a consistent view of the database at transaction start
- More expensive than repeatable read
- PostgreSQL's "Repeatable Read" is actually Snapshot Isolation

**How it works:**
- Transaction gets a timestamp/version when it starts
- All reads are based on that version
- Even if new rows are inserted, they won't appear (filtered by version)
- Even if existing rows are updated, you see the old version

**Read Phenomena Allowed:**
- ❌ Dirty Reads (fixed)
- ❌ Non-repeatable Reads (fixed)
- ❌ Phantom Reads (fixed)
- ❌ Lost Updates (fixed)

**PostgreSQL Note:** In PostgreSQL, "Repeatable Read" is implemented as Snapshot Isolation, so you don't get phantom reads with Repeatable Read in PostgreSQL (unlike other databases).

---

## 5. Serializable

**Definition:** Transactions are executed as if they were **serialized** (one after another), even though they run concurrently.

**Characteristics:**
- **Slowest isolation level**
- No concurrency (effectively)
- Guarantees no read phenomena
- Implemented using optimistic or pessimistic concurrency control

**How it works:**
- Database determines the order transactions should execute
- Based on concepts like linearizability
- Transactions are serialized to produce consistent results

**Read Phenomena Allowed:**
- ❌ Dirty Reads (fixed)
- ❌ Non-repeatable Reads (fixed)
- ❌ Phantom Reads (fixed)
- ❌ Lost Updates (fixed)

**Implementation:**
- Usually uses **optimistic concurrency control**
- If conflicts occur, transaction fails with serialization error
- Application must retry the transaction

---

## Isolation Levels Summary Table

| Isolation Level | Dirty Read | Non-repeatable Read | Phantom Read | Lost Updates |
|----------------|------------|---------------------|--------------|--------------|
| **Read Uncommitted** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Read Committed** | ❌ No | ✅ Yes | ✅ Yes | ✅ Yes |
| **Repeatable Read** | ❌ No | ❌ No | ✅ Yes* | ❌ No |
| **Snapshot** | ❌ No | ❌ No | ❌ No | ❌ No |
| **Serializable** | ❌ No | ❌ No | ❌ No | ❌ No |

*Note: PostgreSQL's Repeatable Read is actually Snapshot Isolation, so it prevents phantom reads too.

---

## Database Implementation Approaches

### Pessimistic Concurrency Control

**Approach:** Use **locks** to prevent conflicts.

**Types of Locks:**
- **Row-level locks:** Lock individual rows being modified
- **Table locks:** Lock entire table (very expensive)
- **Page locks:** Lock logical pages containing changes (common with clustering)

**How it works:**
- When you change data, obtain a lock
- Other transactions must wait until lock is released
- Prevents conflicts but can cause blocking

**Example:**
```sql
-- Transaction 1
UPDATE sales SET quantity = 20 WHERE product_id = 1;
-- Row is now locked

-- Transaction 2 (tries to update same row)
UPDATE sales SET quantity = 25 WHERE product_id = 1;
-- Must wait until Transaction 1 commits/rolls back
```

**Pros:**
- Prevents conflicts
- Guarantees consistency

**Cons:**
- **Lock management is expensive** (must track locks in memory)
- Can cause blocking and deadlocks
- Performance impact with many concurrent transactions
- **Lock escalation:** Row locks can escalate to table locks (very bad!)

**Use Case:** When you need strong guarantees and can tolerate blocking.

---

### Optimistic Concurrency Control

**Approach:** Don't use locks. Let transactions proceed, and detect conflicts when they occur.

**How it works:**
- Transactions proceed without locking
- When conflicts are detected, transaction fails
- Application must retry the transaction
- Error is usually called "serialization error"

**Pros:**
- **No blocking** - transactions don't wait
- **No lock management overhead**
- Better performance for read-heavy workloads
- Preferred by NoSQL databases

**Cons:**
- Transactions can fail and need retry logic
- Application must handle retries
- Can be inefficient if conflicts are frequent

**Use Case:** When conflicts are rare and you want better performance.

---

## Database-Specific Implementations

### PostgreSQL

- **Repeatable Read = Snapshot Isolation**
- Uses **MVCC (Multi-Version Concurrency Control)**
- Updates create new versions of rows
- No phantom reads with Repeatable Read
- Very efficient for long-running transactions

### MySQL / Oracle / SQL Server

- **Repeatable Read uses locking or undo logs**
- Updates change values in place
- Maintain undo logs for old values
- Can be expensive for long-running transactions
- Phantom reads possible with Repeatable Read

### Serializable

- Usually implemented with **optimistic concurrency control**
- If truly serialized (pessimistic), database would be very slow
- Conflicts result in serialization errors
- Application must implement retry logic

---

## SELECT FOR UPDATE

**Special Case:** You can explicitly lock rows for reading:

```sql
SELECT * FROM sales WHERE product_id = 1 FOR UPDATE;
-- This locks the row, preventing other transactions from updating it
```

This is useful when you need to ensure no one else modifies a row you're about to update.

---

## Key Takeaways

### What is Isolation?

**Isolation** is the result of having transactions run in **complete isolation** from other concurrent transactions.

### Why It Matters

1. **Concurrency is Real:** Multiple users/connections execute transactions simultaneously
2. **Read Phenomena are Real:** Without proper isolation, you get undesirable side effects
3. **Isolation Levels Exist:** Different levels solve different problems
4. **Trade-offs:** Stronger isolation = better consistency but potentially worse performance

### Choosing an Isolation Level

- **Most applications:** Read Committed (default, good balance)
- **Need consistency:** Repeatable Read or Snapshot
- **Critical data:** Serializable (with retry logic)
- **Never use:** Read Uncommitted (unless you really know what you're doing)

### Implementation Matters

- Different databases implement isolation differently
- PostgreSQL's Repeatable Read = Snapshot Isolation
- Understand your database's specific behavior
- Test your isolation level assumptions

### When to Worry About Isolation

- **High concurrency:** Many users reading/writing simultaneously
- **Long-running transactions:** More time for conflicts
- **Critical data:** Financial transactions, inventory, etc.
- **Complex queries:** Multiple reads that must be consistent

---

## Summary

1. **Isolation prevents transactions from interfering with each other**
2. **Read phenomena** are undesirable side effects (dirty reads, non-repeatable reads, phantom reads, lost updates)
3. **Isolation levels** solve these problems with different trade-offs
4. **Implementation approaches:** Pessimistic (locks) vs Optimistic (versioning/conflict detection)
5. **Database-specific:** Each database implements isolation differently
6. **Choose wisely:** Understand your use case and choose the appropriate isolation level

---

## Next Steps

- Understanding **Consistency** - how isolation and atomicity work together
- Learning about **Durability** - ensuring committed transactions persist
- Deep dive into **Locks** - how databases implement pessimistic concurrency control
- Exploring **MVCC** - how databases implement optimistic concurrency control

---

*Note: Isolation is one of the most complex ACID properties. Understanding read phenomena and isolation levels is crucial for building robust database applications. Most of the time you won't run into complex situations, but when you do, knowing these concepts will help you debug and solve problems.*

