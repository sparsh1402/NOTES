# Atomicity

## Overview

**Atomicity** is one of the four ACID properties that defines a relational database management system (and really, any database system - NoSQL, graph, time-based, etc.).

Atomicity is a **very critical concept** to understand when working with databases.

---

## Definition

**Atomicity:** All the queries in a transaction **must succeed**.

### The "Atom" Analogy

- A transaction is like an **atom** - it **cannot be split**
- Just as an atom (at least before nuclear fission was discovered) was considered indivisible, a transaction is treated as one indivisible unit of work
- All queries in a transaction are considered **one unit of work** that cannot be broken apart

---

## Core Rule of Atomicity

**If one query fails, the entire transaction must roll back.**

### What Constitutes a Failed Query?

A query can fail for various reasons:

1. **Failed constraint**
   - Example: Balance goes negative (violates business rule)
   - Example: Duplicate primary key entry

2. **Invalid SQL syntax**
   - Syntax errors in the query itself

3. **Any other database error**

### The Rule

- Even if you had **100 successful queries** in the same transaction
- If **one single query fails**, the entire transaction should **roll back immediately**
- All successful queries in that transaction are undone
- **All or nothing** - that's atomicity

---

## Database Crashes During Transactions

### The Problem

**What happens if the database crashes during a transaction?**

- You can't manually roll back because the database is down
- The transaction was never committed
- But some queries may have already executed successfully

### The Solution

**If the database crashed prior to a commit:**

- All successful queries in the transaction **should be rolled back**
- Even if you had 100 successful queries and no query actually failed
- The database just crashed mid-transaction
- Upon restart, the database must detect this situation and roll back

### Implementation Challenge

**Critical Questions to Consider:**

1. **What is the database doing during a transaction?**
   - Is it actually writing to disk?
   - Or is it keeping changes in memory?

2. **If I don't commit, what happens?**
   - Do we need to go back to disk and remove these changes?
   - How do we track what needs to be rolled back?

3. **How does the database know what to roll back after a crash?**
   - The database must maintain transaction logs or state information

---

## Database Implementation Strategies

Different databases implement atomicity differently, and understanding these differences helps you choose the right database for your use case.

### Strategy 1: Optimistic (Write to Disk During Transaction)

**Approach:**
- Write changes to disk **as queries execute** (before commit)
- Assume the transaction will commit
- Optimistic in nature

**Pros:**
- **Commits are extremely fast**
- When you commit, the database just writes one bit saying "this transaction is committed"
- No need to flush data to disk during commit (already done)

**Cons:**
- Queries may be slightly slower (I/O during transaction)
- Rollback requires undoing disk writes (more work)

**Example:** PostgreSQL uses this approach - commits are very fast

### Strategy 2: Pessimistic (Write to Memory, Flush on Commit)

**Approach:**
- Keep all changes **in memory** during transaction
- Only write to disk when commit is called
- Flush everything to disk on commit

**Pros:**
- **Queries execute very fast** (no I/O during transaction)
- **Rollback is extremely fast** (just flush memory, no disk operations to undo)

**Cons:**
- **Commits are slower** (must flush all changes to disk)
- Higher risk if crash occurs during commit

**Example:** Some databases use this approach

### Key Insight

**There is no right or wrong approach - there are always trade-offs.**

- Choose based on your use case
- Understand what each database optimizes for
- Consider your transaction patterns (many small transactions vs. few large ones)

---

## Example: Account Transfer with Crash Scenario

### Setup

**Table:** `account`
- `account_id` (Primary Key)
- `balance`

**Initial State:**
- Account ID 1: $1,000
- Account ID 2: $500

**Goal:** Transfer $100 from Account 1 to Account 2

### Transaction Steps

```sql
-- Step 1: Begin Transaction
BEGIN TRANSACTION;

-- Step 2: Check balance
SELECT balance 
FROM account 
WHERE account_id = 1;
-- Returns: 1000 (sufficient funds)

-- Step 3: Debit Account 1
UPDATE account 
SET balance = balance - 100 
WHERE account_id = 1;
-- New balance: $900
-- ✅ This query succeeded

-- Step 4: CRASH! Database goes down
-- ❌ Second update never executed
-- ❌ Transaction never committed
```

### Bad Implementation: What We See After Restart

**After database restart, we see:**
- Account 1: $900 (debit was applied)
- Account 2: $500 (credit never happened)

**Problem:**
- We **lost $100 in thin air**
- The money is gone - no record of where it went
- **Inconsistent data state**
- This is a **data integrity disaster**

### Why This Happens

- The first update was written to disk (or persisted)
- The database crashed before the second update
- The transaction was never committed
- But the first change remains

**This violates atomicity!**

---

## Recovery: Rollback on Restart

### What Should Happen

When the database restarts after a crash:

1. **Detect incomplete transactions**
   - Database must identify transactions that were running when crash occurred
   - These transactions were never committed

2. **Roll back all changes**
   - Undo the debit (change $900 back to $1,000)
   - Restore consistent state

3. **Clean up "garbage"**
   - Remove any partial changes
   - Ensure data consistency

### Real-World Implications

**From Professional Experience:**

- Rollbacks can take **over an hour** for long transactions (especially in SQL Server)
- Some databases **won't let you start** until rollback completes
- Recent database versions may allow partial operation, but the affected database remains in "rollback state"
- During rollback:
  - **CPU gets hammered**
  - **Memory gets hammered**
  - System performance degrades significantly

### Why Long Transactions Are Bad

**Long transactions are generally a bad idea because:**

1. Higher risk of crashes mid-transaction
2. Rollback on restart can take a very long time
3. System resources are consumed during recovery
4. Database may be unavailable during rollback
5. More data to undo = longer recovery time

---

## Summary

### What is Atomicity?

1. **Definition:** A transaction is **one unit of work that cannot be split**
   - Like an atom (before nuclear fission) - indivisible
   - All queries in a transaction must succeed together

2. **Core Rule:** 
   - If **any query fails**, **all queries** in the transaction must be rolled back
   - Even if 100 queries succeeded and 1 failed, everything is undone

3. **Crash Handling:**
   - If database crashes **before commit**, all changes must be rolled back
   - Database must detect and clean up incomplete transactions on restart
   - This is not just about explicit failures - crashes must also trigger rollback

### Key Takeaways

- **All or nothing:** Transactions either fully succeed or fully fail
- **No partial states:** You should never see partially completed transactions
- **Implementation matters:** Different databases handle atomicity differently (optimize for different scenarios)
- **Long transactions are risky:** They increase crash risk and recovery time
- **Recovery is critical:** Databases must handle crashes gracefully to maintain atomicity

### The Connection to Consistency

**Lack of atomicity leads to inconsistencies:**
- Partial transactions create inconsistent data states
- Money can disappear (as in our example)
- Data integrity is compromised
- This is why atomicity is fundamental to database reliability

---

## Next Steps

- Understanding **Consistency** - how atomicity and other properties ensure data integrity
- Exploring **Isolation** - how concurrent transactions interact
- Learning about **Durability** - ensuring committed transactions persist

---

*Note: Atomicity is the foundation that ensures transactions are treated as indivisible units. Understanding how databases implement this (and the trade-offs involved) is crucial for making informed decisions about database selection and transaction design.*

