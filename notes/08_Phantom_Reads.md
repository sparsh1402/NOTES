# Phantom Reads

## Overview

**Phantom Reads** is one of the three read phenomena in databases (along with Dirty Read and Non-repeatable Read). It's a problem that many people overlook, but if misused, it can lead to disasters.

---

## What is a Phantom Read?

### Definition

**Phantom Read:** When another transaction **inserts a new row**, and suddenly when you do a query in your own isolated transaction, you start seeing that row **even though you shouldn't see it**.

### Key Characteristics

- Happens in **concurrent transactions** (transactions running at the same time)
- Another transaction **inserts** a new row
- Your transaction sees this new row (even though it shouldn't)
- Creates **inconsistent results** in your transaction
- Most of the time, this is **undesirable**

---

## Example: Sales Report

### Setup

**Table:** `sales`
- Contains sales records with dates, product IDs, prices, etc.
- Initial state: 5 records in the table

### The Problem Scenario

**Transaction 1 (Report Generation):**
```sql
BEGIN TRANSACTION;

-- Query 1: Get all sales
SELECT * FROM sales;
-- Result: 5 records

-- Query 2: Sum sales by product
SELECT pid, SUM(price) 
FROM sales 
GROUP BY pid;
-- Result: Product 1 = $40
```

**Transaction 2 (Making a Sale - Happens Concurrently):**
```sql
-- This automatically starts and commits a transaction
INSERT INTO sales (pid, price, date)
VALUES (1, 15, '2021-02-07');
-- Committed immediately (auto-commit)
```

**Back to Transaction 1:**
```sql
-- Query 3: Get all sales again
SELECT * FROM sales;
-- Result: Now shows 6 records! (The new sale appeared!)

-- Query 4: Sum sales by product again
SELECT pid, SUM(price) 
FROM sales 
GROUP BY pid;
-- Result: Product 1 = $55 (changed from $40!)
```

### The Problem

**What happened:**
- Transaction 1 started to produce a report
- Query 1 showed 5 records, Product 1 = $40
- Transaction 2 inserted a new sale (Product 1, $15)
- Transaction 1's Query 4 now shows Product 1 = $55
- **Inconsistent!** The report shows different numbers

**Why it's bad:**
- You're producing a report that should be **consistent** based on when the transaction started
- If people make sales while you're producing the report, you get **inconsistent results**
- Example: You list all products, then do a sum query → numbers don't match!

**Range Queries:**
```sql
-- Even range queries are affected
SELECT * FROM sales 
WHERE date BETWEEN '2021-01-01' AND '2021-02-28';
-- The new row inserted by Transaction 2 appears here too!
```

---

## How to Fix Phantom Reads

### Solution 1: Serializable Isolation Level

**What it does:**
- **Serializable isolation level** allows databases to serialize transactions
- If a transaction has a dependency (like your read depends on preventing inserts), the database detects it
- Database isolates those changes from your transaction

**How to use:**
```sql
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Now your transaction is isolated
SELECT * FROM sales;
-- Result: 6 records (includes previously committed data)

-- Another transaction inserts a new sale
-- (happens in parallel)

-- Your query again
SELECT * FROM sales;
-- Result: Still 6 records (doesn't see the new insert!)
```

**What happens:**
- PostgreSQL detects that something happened in another transaction
- But it **isolates you** from that change
- You can safely commit your transaction
- You can produce a report without seeing phantom rows

**Key Point:**
- Serializable isolation level prevents phantom reads
- Your transaction sees a consistent snapshot
- Other transactions' inserts don't affect your view

---

## PostgreSQL Special Behavior

### Important: PostgreSQL is Special!

**PostgreSQL prevents phantom reads even in Repeatable Read isolation level!**

### Repeatable Read vs Phantom Read

**Repeatable Read:**
- Allows you to execute the same query and get the **same result**
- Different from phantom read
- Phantom read = you get a **new row** that didn't exist before
- Non-repeatable read = you re-read a value and it **changed**

**PostgreSQL's Repeatable Read:**
```sql
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- Query 1: Get all sales
SELECT * FROM sales;
-- Result: 7 records

-- Another transaction inserts a new sale
-- (happens in parallel)

-- Query 2: Get all sales again
SELECT * FROM sales;
-- Result: Still 7 records (doesn't see the new insert!)
```

**Why this works:**
- PostgreSQL uses **MVCC (Multi-Version Concurrency Control)**
- When you start a transaction, you create a **version** of the rows
- As other people commit changes, the database increases its version
- But your transaction still sees **your version** (the one from when you started)

**Range Queries Also Protected:**
```sql
-- Even range queries are protected in PostgreSQL's Repeatable Read
SELECT * FROM sales 
WHERE date BETWEEN '2021-01-01' AND '2021-02-28';
-- Won't see new rows inserted by other transactions
```

---

## Other Databases (MySQL, Oracle, SQL Server)

### The Difference

**In MySQL, Oracle, SQL Server:**
- **Repeatable Read does NOT prevent phantom reads**
- You still see new rows inserted by other transactions
- This is **very critical** to understand!

**To prevent phantom reads in these databases:**
- **Option 1:** Use **Serializable isolation level**
- **Option 2:** Use **pessimistic locking**
  - Lock the data so others can't insert
  - Example: "If someone is changing stuff, don't allow me to read it until they're done"

### Comparison Table

| Database | Repeatable Read Prevents Phantom Reads? | Serializable Prevents Phantom Reads? |
|----------|------------------------------------------|----------------------------------------|
| **PostgreSQL** | ✅ Yes (special behavior) | ✅ Yes |
| **MySQL** | ❌ No | ✅ Yes |
| **Oracle** | ❌ No | ✅ Yes |
| **SQL Server** | ❌ No | ✅ Yes |

---

## Key Takeaways

### What is a Phantom Read?

1. **Definition:** New row inserted by another transaction appears in your transaction
2. **When it happens:** Concurrent transactions, one inserts, one reads
3. **Why it's bad:** Creates inconsistent results in your transaction
4. **Example:** Report shows different numbers because new sales appear mid-report

### How to Fix It

1. **PostgreSQL:** Use **Repeatable Read** or **Serializable** (both work)
2. **Other databases:** Use **Serializable** or **pessimistic locking**
3. **Serializable:** Database serializes transactions to prevent conflicts
4. **Pessimistic locking:** Lock data to prevent others from inserting

### PostgreSQL is Special

1. **Repeatable Read in PostgreSQL = Snapshot Isolation**
2. Prevents phantom reads even in Repeatable Read
3. Uses MVCC (Multi-Version Concurrency Control)
4. Each transaction sees a version from when it started
5. Other databases don't do this - Repeatable Read doesn't prevent phantom reads

### Important Notes

1. **Phantom reads are different from non-repeatable reads:**
   - **Phantom read:** New row appears (didn't exist before)
   - **Non-repeatable read:** Existing value changes

2. **Range queries are affected:**
   - `SELECT * FROM sales WHERE date BETWEEN ...`
   - New rows that match the range can appear

3. **Unbounded queries are affected:**
   - `SELECT * FROM sales` (no WHERE clause)
   - New rows can appear

4. **Most of the time, phantom reads are undesirable:**
   - You want consistent results in your transaction
   - Reports should be based on a snapshot of data

---

## Practical Example Summary

### Scenario: Generating a Sales Report

**Without proper isolation:**
1. Start transaction
2. Query: "Get all sales" → 5 records
3. Query: "Sum by product" → Product 1 = $40
4. **Meanwhile:** Another transaction inserts a sale (Product 1, $15)
5. Query: "Get all sales" → 6 records (phantom row!)
6. Query: "Sum by product" → Product 1 = $55 (inconsistent!)

**With Serializable or PostgreSQL's Repeatable Read:**
1. Start transaction with proper isolation
2. Query: "Get all sales" → 5 records
3. Query: "Sum by product" → Product 1 = $40
4. **Meanwhile:** Another transaction inserts a sale (Product 1, $15)
5. Query: "Get all sales" → Still 5 records (isolated!)
6. Query: "Sum by product" → Still $40 (consistent!)

**Result:** Consistent report, no phantom reads!

---

## Summary

### Phantom Reads in One Sentence

**Phantom reads occur when a new row inserted by another transaction appears in your transaction, creating inconsistent results.**

### The Three Read Phenomena

1. **Dirty Read:** Reading uncommitted data
2. **Non-repeatable Read:** Re-reading a value and it changed
3. **Phantom Read:** A new row appears that didn't exist before

### How to Prevent Phantom Reads

- **PostgreSQL:** Use Repeatable Read or Serializable
- **Other databases:** Use Serializable or pessimistic locking
- **Key:** Understand your database's behavior!

### Remember

- Phantom reads can lead to **disasters** if not handled properly
- Most of the time, they are **undesirable**
- Use appropriate isolation levels to prevent them
- **PostgreSQL is special** - Repeatable Read prevents phantom reads
- **Other databases** require Serializable to prevent phantom reads

---

## Next Steps

- Understanding **Serializable isolation level** in detail
- Learning about **pessimistic locking** strategies
- Exploring **MVCC (Multi-Version Concurrency Control)** in PostgreSQL
- Comparing isolation levels across different databases

---

*Note: Phantom reads are a subtle but important problem. Understanding how your database handles them (especially the PostgreSQL special behavior) is crucial for building robust applications that generate consistent reports and maintain data integrity.*

