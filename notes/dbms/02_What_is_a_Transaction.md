# What is a Transaction?

## Definition

A **transaction** is a **collection of SQL queries that are treated as one unit of work**.

### Why Do We Need Transactions?

- SQL (Structured Query Language) works with structured data across many tables
- It's very hard (sometimes impossible) to do everything you want in **one query**
- You often need **one or more queries** to achieve what you logically want at the application level
- Transactions group these queries into a **logically single unit of work** that **cannot be split**

---

## Example: Account Deposit

To transfer money from one account to another, you need:

1. **SELECT** - Check if the source account has enough money
2. **UPDATE** - Deduct money from the source account (balance - $100)
3. **UPDATE** - Add money to the destination account (balance + $100)

This is a **read-update-update** pattern - three different queries that form one logical transaction.

---

## Transaction Lifespan

### 1. BEGIN

- Transaction starts with the keyword `BEGIN`
- Indicates to the database: "You're about to start a brand new transaction with multiple queries"

### 2. COMMIT

- When you're satisfied with all queries
- Changes are **not durable** (not persisted) until you commit
- `COMMIT` tells the database to persist all changes made during the transaction to disk
- This is when changes become permanent

### 3. ROLLBACK

- Used when things don't go as planned
- Means: "Forget all the changes I made, do not persist them"
- All changes made during the transaction are discarded

---

## Implementation Considerations: When to Write to Disk?

**Critical Question:** When executing multiple queries in a transaction, when should the database write to disk?

### Option 1: Write to Disk with Every Change
- Write each change to disk as it happens
- **Pros:** Commit is faster (changes already persisted)
- **Cons:** More I/O operations during transaction

### Option 2: Keep Changes in Memory, Write on Commit
- Store all changes in memory during transaction
- Write everything to disk only when commit is called
- **Pros:** Rollback is faster (just flush memory, no disk operations to undo)
- **Cons:** Commit is slower (must write all changes at once)

### Key Insight

Different databases implement this differently:
- **PostgreSQL:** Optimizes for fast commits (writes changes as they happen)
- **SQL Server:** May optimize differently (commits can be slower for large transactions)
- **MySQL, Oracle:** Each has their own optimization strategy

**Important:** Think about these trade-offs when designing your database or application!

---

## Transaction Failure Scenarios

### 1. User-Initiated Rollback

- User explicitly calls `ROLLBACK`
- All changes are discarded

### 2. Unexpected Ending (Crash)

**Scenario:** Database crashes in the middle of a transaction (e.g., after 20,000 queries)

**Problem:** How does the database roll back if it crashed?

**Solution:** 
- Database must track transaction state
- When database restarts, it must know to roll back incomplete transactions
- This requires additional code paths and recovery mechanisms

### 3. Crash During Commit

**The Scariest Scenario:** What if the database crashes **during** a commit?

**Implications:**
- If commits are fast (like PostgreSQL), crash probability during commit is low
- If commits are slow (large transactions), crash probability is higher
- **Critical Question:** Did the commit succeed or not? This is a complex problem to solve

---

## Types of Transactions

### 1. Write Transactions (Modifying Data)

- The most common use case
- Used to change and modify data
- Includes INSERT, UPDATE, DELETE operations

### 2. Read-Only Transactions

**Why use a read-only transaction?**

You might think: "Why not just read without a transaction? Let every query be its own transaction."

**Answer:** Read-only transactions provide **consistency** and **isolation**.

#### Benefits of Read-Only Transactions:

1. **Consistent Snapshot**
   - Transaction provides a snapshot based on the **time the transaction started**
   - All reads are based on that initial time point
   - If data changes by concurrent transactions, you don't see those changes
   - You get an **isolated view** of the data

2. **Isolation**
   - You're isolated from changes made by other concurrent transactions
   - This is critical for generating reports or analytics

**Note:** We'll learn more about this in the Isolation section.

---

## Detailed Example: Account Transfer

### Scenario

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

-- Step 2: Check balance and validate
SELECT balance 
FROM account 
WHERE account_id = 1;
-- Returns: 1000

-- Validation: Check if account has enough money
-- Balance (1000) >= Amount (100) ✓
-- This prevents negative balances (inconsistency)

-- Step 3: Debit Account 1
UPDATE account 
SET balance = balance - 100 
WHERE account_id = 1;
-- New balance: $900

-- Step 4: Credit Account 2
UPDATE account 
SET balance = balance + 100 
WHERE account_id = 2;
-- New balance: $600

-- Step 5: Commit Transaction
COMMIT;
-- Both changes are now physically written to disk
```

### Important Points

1. **Validation:** Check balance before debiting (prevents negative balances)
2. **Constraints:** Can enforce rules at:
   - Application level (as shown above)
   - Database level (e.g., CHECK constraint: `balance >= 0`)
3. **Consistency:** Negative balance = inconsistent data (unless your application logic allows it)
4. **Atomicity:** Both updates happen together or not at all

---

## Implicit Transactions

**Important Concept:** You're **always in a transaction**, whether you explicitly start one or not.

### Explicit Transactions
- User-defined transactions using `BEGIN TRANSACTION`
- You control when to `COMMIT` or `ROLLBACK`

### Implicit Transactions
- If you execute a single statement (UPDATE, INSERT, etc.) without `BEGIN`
- The database **automatically starts a transaction** for you
- The database **immediately commits** it after execution
- You're always in a transaction, even if you don't realize it!

**Example:**
```sql
-- This single statement is automatically wrapped in a transaction
UPDATE account SET balance = 500 WHERE account_id = 1;
-- Database does: BEGIN → UPDATE → COMMIT (automatically)
```

---

## Summary

### What is a Transaction?

1. **Definition:** A collection of queries treated as a **single unit of work**
2. **Purpose:** 
   - Can change data (write transactions)
   - Can be read-only (for consistency and isolation)
3. **Lifespan:**
   - Always starts (explicitly with `BEGIN` or implicitly by the database)
   - Ends with `COMMIT` (persist changes) or `ROLLBACK` (discard changes)
4. **Always Active:** You're always in a transaction, even for single statements

### Key Takeaways

- Transactions group multiple queries into one logical unit
- Implementation details (when to write to disk) vary by database
- Read-only transactions provide consistency and isolation
- Transactions can fail in various ways - databases must handle recovery
- Understanding these fundamentals helps you make better design decisions

---

## Next Steps

- Understanding **Atomicity** - how transactions ensure "all or nothing"
- Exploring **Isolation** - how concurrent transactions interact
- Learning about **Consistency** - maintaining data integrity
- Understanding **Durability** - ensuring committed data persists

---

*Note: This lecture emphasizes thinking about implementation details and trade-offs. Always consider what's happening behind the scenes when working with databases.*

