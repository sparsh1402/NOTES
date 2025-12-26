# Consistency

## Overview

**Consistency** is one of the four ACID properties. It's a property that different database platforms (NoSQL vs Relational vs Graph databases) often trade off for speed, performance, and scalability.

Understanding consistency is crucial because some databases sacrifice it for better performance.

---

## Two Types of Consistency

Consistency has **two different meanings** in databases:

1. **Consistency in Data** - The data stored on disk matches your data model rules
2. **Consistency in Reads** - When you read data, you get the latest committed values

Let's understand both types in detail.

---

## 1. Consistency in Data

### What It Means

**Consistency in data** means: **Is the data stored on disk correct according to your data model rules?**

- This is about the **state of data** that is currently saved on disk
- The data must follow the rules you defined for your database
- If data breaks these rules, it's called **inconsistent** or **corrupted**

### Who Defines It?

**You define it!** (Or the DBA - Database Administrator)

- When you build your data model, you set rules
- The database must follow these rules
- If data breaks the rules, it's inconsistent

### How to Ensure Consistency in Data

#### 1. Referential Integrity and Foreign Keys

**What is Referential Integrity?**
- It means references between data must be valid
- Example: If a table references another table, the referenced data must exist

**Example:**
- Table A has a foreign key pointing to Table B
- If you delete a row from Table B, what happens to Table A?
- Referential integrity ensures this relationship stays valid

**Note:** Even NoSQL databases have referential integrity!
- In NoSQL, you might have documents referencing other documents
- If one document references another, that reference must be valid
- If the referenced document doesn't exist, you have inconsistency

#### 2. Atomicity

**How atomicity helps consistency:**
- Remember the account transfer example?
- If database crashes after debiting one account but before crediting another
- You lose money (data is inconsistent/corrupted)
- Atomicity ensures "all or nothing" - prevents partial updates that cause inconsistency

#### 3. Isolation

**How isolation helps consistency:**
- In the isolation lecture, we saw that different isolation levels can give different results
- If you read data twice in the same transaction and get different values, that's inconsistent
- Isolation levels help prevent this

---

## Example: Instagram Data Model

Let's understand consistency with a real-world example.

### The Tables

**Table 1: `pictures`**
- `id` - Picture ID
- `blob` - The actual picture (binary data)
- `likes` - Number of likes this picture received

**Table 2: `likes_tracking`**
- `user_name` - Who liked the picture
- `picture_id` - Which picture they liked

### The Consistency Rule

**Rule:** The `likes` count in the `pictures` table must equal the number of rows in `likes_tracking` for that picture.

**Why?**
- If picture 1 has `likes = 2`, then `likes_tracking` should have exactly 2 rows for picture 1
- If you count: `SELECT COUNT(*) FROM likes_tracking WHERE picture_id = 1`
- You should get 2 (matching the likes count)

### Example of Inconsistent Data

**Scenario 1: Count Mismatch**
```
pictures table:
- Picture 1: likes = 5

likes_tracking table:
- John liked picture 1
- Edmund liked picture 1
- (Only 2 rows for picture 1)
```

**Problem:**
- Picture 1 shows 5 likes
- But only 2 people actually liked it (only 2 rows in tracking table)
- **This is inconsistent!** The count doesn't match the actual data

**Why does this happen?**
- Maybe the likes counter was updated incorrectly
- Maybe someone deleted a like but the counter wasn't updated
- The data is "out of sync"

**Scenario 2: Orphaned Reference**
```
pictures table:
- Picture 1 exists
- Picture 2 exists
- Picture 3 exists
- (Picture 4 does NOT exist - it was deleted)

likes_tracking table:
- John liked picture 1
- Edmund liked picture 1
- Edmund liked picture 4  ← PROBLEM!
```

**Problem:**
- Edmund liked picture 4
- But picture 4 doesn't exist anymore!
- This is an **orphaned reference** - it references something that doesn't exist
- **This is inconsistent!**

**Why does this happen?**
- Someone deleted picture 4
- But they didn't delete the likes for picture 4 (no cascading delete)
- The likes are now "orphaned" - they point to nothing

### How to Fix This

**Option 1: Database Level (Recommended)**
- Use foreign keys with CASCADE DELETE
- When picture is deleted, automatically delete all its likes
- Database enforces the rule automatically

**Option 2: Application Level**
- Write code to handle deletions properly
- When deleting a picture, also delete its likes
- More work, but gives you more control

---

## 2. Consistency in Reads

### What It Means

**Consistency in reads** means: **When you update data and commit it, the next read should show the updated value.**

**Simple Rule:**
- You write value X and commit it
- The next read must return value X
- If it returns an old value, that's inconsistent

### The Core Question

**If a transaction committed a change, will a new transaction immediately see that change?**

**Answer:** It should! But sometimes it doesn't...

### When Does This Happen?

**Scenario: Master-Replica Setup**

Many databases use this setup:
- **Primary/Master database** - Where you write data
- **Replica/Worker databases** - Copies of the primary for reading

**How it works:**
1. You write to the primary database
2. Primary database saves the change
3. Primary database syncs the change to replicas (this takes time)
4. If you read from a replica before sync completes, you get old data!

**Example:**
```
1. You update: account balance = $1000 (write to primary)
2. Primary commits the change
3. You immediately read from replica
4. Replica still shows old balance = $500 (not synced yet!)
5. This is inconsistent - you just wrote $1000 but read $500
```

**Why this happens:**
- Replication takes time
- If you read from replica before sync completes, you see old data
- This affects the **system as a whole** (not just one database instance)

### Who Suffers From This?

**Both Relational and NoSQL databases** can have this problem:
- Relational databases (MySQL, PostgreSQL) with replicas
- NoSQL databases (MongoDB, Cassandra) with multiple nodes
- Any system with multiple database instances

---

## Eventual Consistency

### What Is It?

**Eventual Consistency** is a term that means: **"I'm not consistent right now, but I will be consistent eventually."**

### Two Important Points

#### 1. Eventual Consistency Applies to Reads, NOT Data Corruption

**Important Distinction:**

**Consistency in Data (Corruption):**
- If your data is corrupted (like 5 likes but only 2 records)
- **There is NO eventual consistency** that will fix this
- The data is just wrong - it won't fix itself
- You need to manually fix it (maybe with a repair job)

**Consistency in Reads:**
- If you read an old value from a replica
- **Eventually** you'll get the correct value (when replication completes)
- This is what "eventual consistency" means
- Keep reading, and eventually you'll see the updated value

#### 2. It's a Marketing Term (But Still Valid)

The term "eventual consistency" is sometimes used as marketing, but it's a real concept:
- It means: "Right now you might see old data, but keep reading and you'll eventually see the new data"
- It's valid in certain use cases
- It was created to differentiate from data corruption (which can't be "eventually" fixed)

### Types of Eventual Consistency

There are different levels:
- **Eventual Strong Consistency** - Will become consistent, and you can know when
- **Eventual Weak Consistency** - Will become consistent, but you don't know when

(We won't go deep into these - it's a whole topic by itself!)

---

## How to Fix Consistency in Reads

### Synchronous Replication

**What it means:**
- When you write to primary, it waits for replicas to confirm they received the change
- Only then does the write complete
- **Result:** Strong consistency - you always read the latest value

**Pros:**
- Strong consistency
- Always see latest data

**Cons:**
- **Slower** - must wait for all replicas
- If one replica is slow, everything waits

### Asynchronous Replication

**What it means:**
- When you write to primary, it doesn't wait for replicas
- Write completes immediately
- Replicas sync in the background
- **Result:** Eventual consistency - might read old data temporarily

**Pros:**
- **Faster** - doesn't wait for replicas
- Better performance

**Cons:**
- Might read old data
- Eventual consistency (not immediate)

### Which One to Choose?

**It depends on what you need:**
- **Need strong consistency?** → Use synchronous replication (slower but consistent)
- **Can tolerate eventual consistency?** → Use asynchronous replication (faster but might show old data)

**Example:**
- **Banking system:** Need strong consistency (can't show wrong balance)
- **Social media likes:** Can tolerate eventual consistency (showing 999 vs 1000 likes is okay)

---

## Summary

### Consistency Has Two Types

#### 1. Consistency in Data

**What it is:**
- Data on disk follows your data model rules
- Referential integrity is maintained
- No orphaned references or mismatched counts

**How to ensure:**
- Use foreign keys and referential integrity
- Atomicity prevents partial updates
- Isolation prevents inconsistent reads

**Important:**
- If data is corrupted, **there is NO eventual consistency**
- You must fix it manually
- Example: 5 likes but only 2 records = corrupted data

#### 2. Consistency in Reads

**What it is:**
- After you commit a change, the next read should show that change
- If you read from a replica before it syncs, you get old data
- This is inconsistent

**How to ensure:**
- Use synchronous replication (slower but consistent)
- Or accept eventual consistency (faster but might show old data)

**Important:**
- This applies to systems with multiple database instances
- Both relational and NoSQL databases can have this problem
- Eventual consistency can fix this (keep reading, eventually you'll see the update)

### Key Takeaways

1. **Consistency in data** = Data follows your rules (no corruption)
2. **Consistency in reads** = You see the latest committed data
3. **Referential integrity** = References between data must be valid
4. **Eventual consistency** = Applies to reads, not data corruption
5. **Synchronous replication** = Strong consistency (slower)
6. **Asynchronous replication** = Eventual consistency (faster)
7. **Choose based on your needs** = Banking needs strong consistency, social media can use eventual consistency

---

## Real-World Examples

### When Consistency Matters

**Banking System:**
- Account balance must be consistent
- Can't show wrong balance
- Need strong consistency

**E-commerce:**
- Inventory count must be accurate
- Can't oversell products
- Need strong consistency

### When Eventual Consistency is Okay

**Social Media Likes:**
- Showing 999 vs 1000 likes is fine
- Eventual consistency is acceptable
- Performance is more important

**Comments/Posts:**
- Seeing a comment a few seconds late is okay
- Eventual consistency works fine
- Better user experience with faster writes

---

## Connection to Other ACID Properties

### How Atomicity Helps Consistency
- Prevents partial updates
- If transfer fails, no money is lost
- Ensures data integrity

### How Isolation Helps Consistency
- Prevents seeing inconsistent data during transaction
- Different isolation levels affect what you see
- Helps maintain consistent view

### How Durability Helps Consistency
- Ensures committed data is saved
- If data isn't durable, you lose consistency
- (We'll learn about durability next!)

---

## Next Steps

- Understanding **Durability** - The final ACID property
- Learning about **Replication** - How databases sync data
- Exploring **CAP Theorem** - Consistency, Availability, Partition tolerance trade-offs

---

*Note: Consistency is about ensuring your data is correct and your reads are accurate. Understanding the difference between data consistency and read consistency helps you choose the right database and configuration for your needs.*

