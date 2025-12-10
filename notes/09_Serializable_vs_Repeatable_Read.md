# Serializable vs Repeatable Read Isolation Levels

## Overview

This video explains the **critical difference** between **Serializable** and **Repeatable Read** isolation levels. There are very few resources explaining this difference, so understanding it is important for database engineers.

**Key Question:** Why would you pick Serializable isolation level over Repeatable Read?

---

## The Problem Scenario

### Setup

**Table:** `test`
- Contains rows with values: A, A, B, B
- Two fields/columns with these values

### Two Concurrent Transactions

**Transaction 1 (Blue):**
```sql
UPDATE test SET field = 'B' WHERE field = 'A';
-- Changes all A's to B's
```

**Transaction 2 (Green):**
```sql
UPDATE test SET field = 'A' WHERE field = 'B';
-- Changes all B's to A's
```

**Both transactions start at the same time (concurrent execution)**

---

## What Happens with Repeatable Read?

### The Execution

**Transaction 1:**
- Reads the table: sees A, A, B, B
- Changes A's to B's
- Touches only the two rows with A's
- Result: B, B, B, B

**Transaction 2:**
- Reads the table: sees A, A, B, B (its own view)
- Changes B's to A's
- Touches only the two rows with B's
- Result: A, A, A, A

### The Problem

**From Repeatable Read's perspective:**
- Transaction 1 changed rows with A's
- Transaction 2 changed rows with B's
- **They didn't step on each other's toes**
- **No concurrency issue detected!**
- Both transactions can commit

**Final Result:**
- After both commit: B, B, A, A (mixed state)
- Or: A, A, B, B (depending on which committed first)

**Is this what you want?**
- Maybe yes (if you want this behavior)
- **But often NO** - you want transactions to be serialized!

---

## What We Actually Want: Serializable

### The Goal

**We want transactions to be serialized** - as if they executed one after another, not concurrently.

**What should happen:**
- If Transaction 1 executes first → All B's
- Then Transaction 2 executes → All A's
- **OR**
- If Transaction 2 executes first → All A's
- Then Transaction 1 executes → All B's
- **Result:** Either all A's OR all B's (not mixed!)

### Why Serializable is Needed

**Serializable detects dependencies:**
- Transaction 1 reads A's and writes B's
- Transaction 2 reads B's and writes A's
- **There IS a dependency!** (Transaction 2 depends on what Transaction 1 writes)
- Serializable catches this and prevents both from committing

---

## Hands-On Demonstration

### Test 1: Repeatable Read (The Problem)

**Setup:**
```sql
-- Table has: A, B, B, A (or similar)
SELECT * FROM test;
```

**Terminal 1 (Repeatable Read):**
```sql
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;

UPDATE test SET field = 'A' WHERE field = 'B';
-- Changes B's to A's

SELECT * FROM test;
-- Result: All A's (isolated view)
```

**Terminal 2 (Repeatable Read):**
```sql
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE Read;

UPDATE test SET field = 'B' WHERE field = 'A';
-- Changes A's to B's

SELECT * FROM test;
-- Result: All B's (isolated view)
```

**Both commit:**
```sql
-- Terminal 1
COMMIT; -- ✅ Succeeds

-- Terminal 2
COMMIT; -- ✅ Succeeds
```

**Final state:**
```sql
SELECT * FROM test;
-- Result: Mixed! (A, B, A, B or similar)
-- NOT what we want!
```

**Problem:**
- Both transactions committed
- Result is inconsistent (mixed A's and B's)
- No error was raised
- **This is the problem with Repeatable Read!**

---

### Test 2: Serializable (The Solution)

**Setup:**
```sql
-- Reset table to: A, B, B, A
SELECT * FROM test;
```

**Terminal 1 (Serializable):**
```sql
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SELECT * FROM test;
-- Result: A, B, B, A

UPDATE test SET field = 'B' WHERE field = 'A';
-- Changes A's to B's

-- Don't commit yet...
```

**Terminal 2 (Serializable):**
```sql
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SELECT * FROM test;
-- Result: A, B, B, A (sees same initial state)

UPDATE test SET field = 'A' WHERE field = 'B';
-- Changes B's to A's

-- Don't commit yet...
```

**Now commit:**
```sql
-- Terminal 1
COMMIT; -- ✅ Succeeds

-- Terminal 2
COMMIT; -- ❌ FAILS!
```

**Error Message:**
```
ERROR: could not serialize access due to read/write dependencies among transactions
DETAIL: Reason code: Canceled on identification as a pivot during commit attempt.
HINT: The transaction might succeed if retried.
```

**What happened:**
- Transaction 1 committed successfully
- Transaction 2 **failed** with serialization error
- Transaction 2 was **rolled back automatically**
- Final state: All B's (Transaction 1's changes)

**Why this is better:**
- Only one transaction succeeded
- Result is consistent (all B's, not mixed)
- Serializable detected the dependency and prevented the conflict

---

## Retrying Failed Transactions

### Important: You Must Retry!

**When using Serializable isolation level:**
- Transactions can **fail** with serialization errors
- **You must be prepared to retry** the transaction
- This is the responsibility of the application/developer

**Example Retry Logic:**
```sql
-- Terminal 2 (after failure)
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

-- Now the state is different (all B's from Transaction 1)
SELECT * FROM test;
-- Result: All B's

UPDATE test SET field = 'A' WHERE field = 'B';
-- Changes all B's to A's

COMMIT; -- ✅ Now succeeds (no other transaction running)
```

**Final state:**
```sql
SELECT * FROM test;
-- Result: All A's
```

**Key Point:**
- First attempt failed (conflict detected)
- Retry succeeded (no conflict)
- Result is consistent (all A's)

---

## How Serializable Works

### Dependency Detection

**What Serializable does:**
1. **Detects dependencies** between transactions
2. **Tracks what each transaction reads and writes**
3. **Identifies conflicts:**
   - Transaction 1 writes something
   - Transaction 2 reads what Transaction 1 wrote
   - Transaction 2 writes something that affects Transaction 1
   - **This is a dependency!**

**In our example:**
- Transaction 1: Reads A's, writes B's
- Transaction 2: Reads B's (that Transaction 1 might write), writes A's
- **Dependency detected!** → One must fail

### Serialization Guarantee

**Serializable ensures:**
- Transactions execute as if they were **serialized** (one after another)
- Even though they run concurrently, the result is the same as if they ran sequentially
- **This is the "magic"** - detecting dependencies and ensuring serializability

---

## Alternative: Pessimistic Locking

### Using SELECT FOR UPDATE

**Instead of Serializable, you can use pessimistic locking:**

```sql
BEGIN TRANSACTION ISOLATION LEVEL READ COMMITTED;

-- Lock the rows you're going to update
SELECT * FROM test WHERE field = 'A' FOR UPDATE;
-- This locks all rows with A's

UPDATE test SET field = 'B' WHERE field = 'A';
-- Now update them

COMMIT;
```

**How it works:**
- `SELECT FOR UPDATE` **locks** the rows
- Other transactions must **wait** until you release the lock
- Prevents concurrent modifications
- **But:** You must use `READ COMMITTED` isolation level for this to work properly

**Trade-off:**
- **Serializable:** Optimistic (detect conflicts, retry on failure)
- **Pessimistic Locking:** Lock rows, others wait (no retries needed, but blocking)

---

## Key Differences Summary

### Repeatable Read

**Characteristics:**
- ✅ Prevents non-repeatable reads
- ✅ Prevents dirty reads
- ✅ Each transaction sees consistent snapshot
- ❌ **Does NOT detect write dependencies**
- ❌ **Does NOT prevent serialization conflicts**
- ❌ Both transactions can commit (even if they conflict)

**When to use:**
- Generating reports (need consistent view)
- Read-heavy workloads
- When you don't need strict serialization

### Serializable

**Characteristics:**
- ✅ Prevents non-repeatable reads
- ✅ Prevents dirty reads
- ✅ Prevents phantom reads
- ✅ **Detects write dependencies**
- ✅ **Prevents serialization conflicts**
- ✅ **Only one conflicting transaction succeeds**
- ❌ Transactions can **fail** (must retry)
- ❌ More expensive (dependency detection)

**When to use:**
- Critical operations (banking, financial)
- When you need strict serialization
- When data consistency is more important than performance
- When you can handle retries in your application

---

## Comparison Table

| Feature | Repeatable Read | Serializable |
|---------|----------------|--------------|
| **Prevents Dirty Reads** | ✅ Yes | ✅ Yes |
| **Prevents Non-repeatable Reads** | ✅ Yes | ✅ Yes |
| **Prevents Phantom Reads** | ✅ Yes (PostgreSQL) / ❌ No (others) | ✅ Yes |
| **Detects Write Dependencies** | ❌ No | ✅ Yes |
| **Prevents Serialization Conflicts** | ❌ No | ✅ Yes |
| **Transactions Can Fail** | ❌ No | ✅ Yes (must retry) |
| **Performance** | Faster | Slower (more overhead) |
| **Use Case** | Reports, read-heavy | Critical operations, financial |

---

## Real-World Example

### Scenario: Account Balance Transfer

**Problem with Repeatable Read:**
```sql
-- Transaction 1: Transfer $100 from Account A to Account B
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
UPDATE accounts SET balance = balance + 100 WHERE id = 'B';
COMMIT; -- ✅ Succeeds

-- Transaction 2: Transfer $50 from Account B to Account C
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;
UPDATE accounts SET balance = balance - 50 WHERE id = 'B';
UPDATE accounts SET balance = balance + 50 WHERE id = 'C';
COMMIT; -- ✅ Also succeeds (no conflict detected)
```

**Problem:** Both succeed, but if they run concurrently, there might be issues.

**Solution with Serializable:**
```sql
-- Transaction 1: Transfer $100 from Account A to Account B
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
UPDATE accounts SET balance = balance - 100 WHERE id = 'A';
UPDATE accounts SET balance = balance + 100 WHERE id = 'B';
COMMIT; -- ✅ Succeeds

-- Transaction 2: Transfer $50 from Account B to Account C
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;
UPDATE accounts SET balance = balance - 50 WHERE id = 'B';
UPDATE accounts SET balance = balance + 50 WHERE id = 'C';
COMMIT; -- ❌ Might fail if there's a dependency
-- Must retry if it fails
```

**Result:** Serializable ensures transactions don't conflict, maintaining data integrity.

---

## Key Takeaways

### Repeatable Read

1. **Good for:** Consistent reads, reports, read-heavy workloads
2. **Limitation:** Doesn't detect write dependencies
3. **Result:** Both transactions can commit (even if they conflict)
4. **Final state:** May be inconsistent (mixed results)

### Serializable

1. **Good for:** Critical operations, financial transactions, strict consistency
2. **Advantage:** Detects and prevents write dependencies
3. **Requirement:** Must handle retries in application
4. **Final state:** Always consistent (one transaction succeeds)

### When to Choose What

**Choose Repeatable Read when:**
- You need consistent reads
- Read-heavy workload
- Can tolerate some write conflicts
- Performance is important

**Choose Serializable when:**
- Data integrity is critical
- Financial operations
- Need strict serialization
- Can handle retries in application
- Consistency is more important than performance

### Important Notes

1. **PostgreSQL's Repeatable Read = Snapshot Isolation** (prevents phantom reads)
2. **Other databases' Repeatable Read** doesn't prevent phantom reads
3. **Serializable is more expensive** (dependency detection overhead)
4. **Always prepare for retries** when using Serializable
5. **Alternative:** Use pessimistic locking with `SELECT FOR UPDATE`

---

## Summary

### The Core Difference

**Repeatable Read:**
- Ensures consistent reads within a transaction
- Does NOT detect write dependencies
- Both transactions can commit (even if they conflict)
- Result may be inconsistent

**Serializable:**
- Ensures consistent reads within a transaction
- **Detects write dependencies**
- **Prevents conflicting transactions from both committing**
- One transaction succeeds, other fails (must retry)
- Result is always consistent

### The Bottom Line

**Serializable is stricter** - it ensures transactions are truly serialized, even detecting subtle dependencies that Repeatable Read misses. This comes at the cost of:
- More overhead (dependency detection)
- Possible transaction failures (must retry)
- Slower performance

**But it guarantees:**
- Strict serialization
- No conflicting commits
- Consistent final state

---

## Next Steps

- Understanding **pessimistic locking** strategies
- Learning about **optimistic concurrency control** (how Serializable works)
- Exploring **retry patterns** in applications
- Comparing **isolation levels** across different databases

---

*Note: The difference between Serializable and Repeatable Read is subtle but critical. Serializable detects write dependencies and ensures true serialization, while Repeatable Read only ensures consistent reads. Understanding this difference helps you choose the right isolation level for your use case.*

