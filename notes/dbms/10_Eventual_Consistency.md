# Eventual Consistency

## Overview

**Consistency** is the property of having expected results in the view of data or during reads while working with a database system. It's one of the ACID properties in relational database systems.

**Eventual Consistency** is a term that emerged recently, specifically as NoSQL databases started to become popular. However, **both relational databases and NoSQL databases suffer from eventual consistency** - this is not well understood by many people.

---

## Important Clarification

### Common Misconception

**Many people think:** Eventual consistency is only for NoSQL databases.

**Reality:** This is **NOT correct!** Both relational and NoSQL databases can have eventual consistency issues.

---

## Two Types of Consistency

It's **very critical** to understand the difference between these two types of consistency:

1. **Consistency in Data** - The data itself is consistent
2. **Consistency in Reads** - Reads show the latest committed values

These are **two separate concepts** that we need to understand clearly.

---

## 1. Consistency in Data

### What It Means

**Consistency in data** emerges when you have:
- Multiple views and representations of your data
- Multiple tables
- Foreign keys and joins
- Normalized view of your data

**Key Point:** Different tables/collections represent the same unit of information, and they must be consistent with each other.

### Example: Instagram Data Model

**Table 1: `pictures`**
- `id` - Picture ID
- `blob` - The actual picture
- `likes` - Total number of likes this picture received

**Table 2: `user_likes`**
- Lists all users who liked what pictures
- Contains records like: User A liked Picture 1, User B liked Picture 1

**The Consistency Rule:**
- If Picture 1 has `likes = 2` in the pictures table
- Then the `user_likes` table must have **exactly 2 records** for Picture 1
- These two views must be **consistent** with each other

**If they're not consistent:**
- Picture shows 5 likes
- But user_likes table only has 2 records
- **This is inconsistent data!**

### What Ensures Consistency in Data

**1. Atomicity**
- If you update multiple tables in a transaction
- All updates must succeed together (all or nothing)
- If one fails, all are rolled back
- This ensures consistency across tables

**2. Isolation**
- Prevents other transactions from seeing partial updates
- Ensures consistent view during transaction execution

**3. Durability**
- Committed changes are saved
- If you commit and read again, the data is still there
- If it's not there, it's not durable, and therefore not consistent

**4. Referential Integrity and Foreign Keys**
- Database enforces relationships between tables
- Example: If you delete a picture, all related likes are deleted (CASCADE)
- This maintains consistency

### Who Defines Consistency in Data?

**You define it!** (Or the database designer)
- You decide how to split data into multiple tables
- You normalize your database the way you want
- You set up foreign keys and referential integrity
- The consistency rules are defined by you

### NoSQL and Consistency in Data

**Most NoSQL databases:**
- Do NOT have atomicity across different collections
- Have atomicity only within a single collection/document
- If you're updating multiple collections, you cannot ensure atomicity
- This makes it harder to maintain consistency in data

**Relational databases are better for this:**
- Can update multiple tables atomically
- Foreign keys ensure referential integrity
- Better tools for maintaining consistency in data

---

## 2. Consistency in Reads

### What It Means

**Consistency in reads** means: **If I update a value and commit it, a new transaction that reads that value should get the new value.**

**Simple Rule:**
- You update field to value X
- You commit the change
- A new transaction reads that field
- **It better get value X** (the new value)

### You Might Think: "Of Course!"

**You might say:** "Of course that makes sense! If I updated a value, of course a new transaction will pick it up. What are you talking about?"

**Reality:** This is **NOT guaranteed** if you have multiple database instances!

---

## The Problem: Multiple Database Instances

### Single Server = No Problem

**If you have one database server:**
- Everything is nice and easy
- Relational databases work perfectly
- Consistency in reads is guaranteed
- **Life is dandy!**

### Multiple Servers = Problem!

**In reality, you never have just one server:**
- If you have millions of users, you need to scale
- You need to handle lots of reads and updates
- You add:
  - **Caches** (Redis, Memcached)
  - **Follower/Replica nodes** (for reads)
  - **Leader/Master node** (for writes)

**The moment you introduce multiple instances, you have a consistency problem!**

---

## Example: Master-Follower Setup

### The Setup

**Architecture:**
- **1 Leader/Master node** - Handles all writes
- **2 Follower nodes** - Handle reads (offload read traffic)
- Followers get data propagated from the leader
- Load balancer distributes reads to followers

**Why this setup?**
- Offload huge number of reads to follower nodes
- Leader handles writes
- Better performance and scalability

### The Consistency Problem

**Initial State:**
- All databases have value **Z**
- Leader: Z
- Follower 1: Z
- Follower 2: Z
- **Consistent!** ✓

**Step 1: Update on Leader**
```sql
UPDATE table SET field = 'X' WHERE field = 'Z';
COMMIT;
```
- Leader now has: **X**
- Followers still have: **Z** (not updated yet!)

**Step 2: Read from Follower**
- Someone reads from Follower 1
- Gets value: **Z** (old value!)
- **Inconsistent!** ✗

**The Problem:**
- We updated value to X
- But a read got the old value Z
- **We broke our rule!** (New transaction should get new value)

**This is inconsistent, even though it's a relational database (PostgreSQL)!**

### What Happens Over Time

**Eventually:**
- Leader pushes the new value X to followers
- Followers receive the update
- New reads start getting value X
- **Eventually consistent!**

**But initially:** Reads got old value (inconsistent)

---

## Eventual Consistency Explained

### Definition

**Eventual Consistency:** A system where:
- After you write a value, reads might get the **old value** initially
- But **eventually**, all reads will get the **new value**
- The system becomes consistent over time

### Key Points

1. **"Eventually"** means: Not immediately, but after some time
2. **Applies to reads:** Not to data corruption
3. **Both SQL and NoSQL suffer from this:** When you have multiple instances

### The Marketing Term

**"Eventual consistency" is somewhat of a marketing term:**
- It means: "Right now you're inconsistent, but eventually you'll be consistent"
- It's a way to say: "We're not consistent right now, but we will be"
- The question is: **Can you tolerate this?**

---

## When Eventual Consistency is Acceptable

### Examples Where It's OK

**Social Media Likes:**
- User sees 7,000 likes instead of 7,011 likes
- **Does it matter?** Probably not
- Nobody is going to count all the likes
- Eventual consistency is acceptable

**View Counts:**
- Picture shows 3,000,020 views vs 3,000,070 views
- **Does it matter?** No
- The difference is negligible
- Eventual consistency is fine

**Analytics Data:**
- Slight delay in seeing latest numbers
- **Does it matter?** Usually no
- Eventual consistency is acceptable

### Examples Where It's NOT Acceptable

**Banking - Balance Updates:**
- You deposit $1,000
- You better see that $1,000 immediately!
- **Does it matter?** YES! Critical!
- Eventual consistency is NOT acceptable

**Double Spending Problem:**
- You have $1,000 in account
- You withdraw $1,000 twice (concurrent transactions)
- Due to inconsistency, you end up with $2,000
- **This is BAD!** You tricked the bank
- Eventual consistency caused a serious problem

**Financial Transactions:**
- Any money-related operation
- Must be immediately consistent
- Eventual consistency is NOT acceptable

---

## Important Distinction: Data Consistency vs Read Consistency

### Consistency in Data

**What it is:**
- Multiple tables/views representing the same information
- They must be consistent with each other
- Example: Picture likes count = number of like records

**What ensures it:**
- Atomicity (all or nothing)
- Isolation (no interference)
- Durability (committed data persists)
- Referential integrity (foreign keys)

**If you screw this up:**
- You updated 3 out of 7 tables
- Database crashed
- **Your data is CORRUPTED**
- **There is NO eventual consistency coming from this!**
- Your data is just wrong - it won't fix itself

### Consistency in Reads

**What it is:**
- After you commit a change, new reads should see that change
- Problem: With multiple instances, reads might get old values

**What causes the problem:**
- Multiple database instances (leader + followers)
- Caching (Redis, Memcached)
- Replication delay

**If you have this problem:**
- Reads might get old values initially
- But eventually, all reads will get new values
- **This is eventual consistency**

### Critical Point

**If your data is corrupted (inconsistent data):**
- There is **NO eventual consistency** that will fix it
- Your data is just wrong
- No matter how long you wait, it will stay wrong
- You must fix it manually

**Eventual consistency only applies to reads:**
- If follower node is offline, it will come online and pick up new data
- That's eventual consistency
- But this only works if your **data itself is consistent**

---

## The Root Cause: Multiple Places

### The Fundamental Problem

**The moment you put data in two places, you're inconsistent!**

**Examples:**
1. **Leader + Followers:** Data in leader and followers (two places)
2. **Database + Cache:** Data in database and Redis cache (two places)
3. **Sharding:** Data split across multiple shards (multiple places)

**Why this causes inconsistency:**
- Update happens in one place
- Read happens from another place
- Read might get old value (not updated yet)
- **Inconsistent!**

### Solutions

**1. Synchronous Replication:**
- Wait for all followers to confirm before commit
- **Pros:** Strong consistency (immediate)
- **Cons:** Slower (must wait)

**2. Asynchronous Replication:**
- Commit immediately, replicate in background
- **Pros:** Faster
- **Cons:** Eventual consistency (might read old values)

**3. No Caching:**
- Don't use cache
- **Pros:** Always consistent
- **Cons:** Slower (no cache benefits)

**4. Cache Invalidation:**
- Update cache when database updates
- **Pros:** Better consistency
- **Cons:** More complex, still might have delays

---

## Summary

### Two Types of Consistency

**1. Consistency in Data:**
- Multiple tables/views must be consistent
- Ensured by: Atomicity, Isolation, Durability, Referential Integrity
- If you screw this up: Data is corrupted, no eventual consistency can fix it

**2. Consistency in Reads:**
- New reads should see latest committed values
- Problem: With multiple instances, reads might get old values
- Solution: Eventually, all reads will get new values (eventual consistency)

### Eventual Consistency

**What it is:**
- System where reads might get old values initially
- But eventually, all reads will get new values
- Applies to **reads only**, not to data corruption

**Who suffers from it:**
- **Both relational and NoSQL databases**
- When you have multiple instances (leader + followers)
- When you use caching
- When you scale horizontally

**When it's acceptable:**
- Social media likes, views, analytics
- Non-critical data
- When slight delay is okay

**When it's NOT acceptable:**
- Banking, financial transactions
- Critical operations
- When immediate consistency is required

### Key Takeaways

1. **Two types of consistency:** Data consistency vs Read consistency
2. **Eventual consistency applies to reads:** Not to data corruption
3. **Both SQL and NoSQL suffer from it:** When you have multiple instances
4. **The moment data is in two places:** You're inconsistent
5. **Can you tolerate it?** Depends on your use case
6. **If data is corrupted:** No eventual consistency will fix it

---

## Real-World Examples

### Relational Database with Replicas

**PostgreSQL with read replicas:**
- Write to master
- Read from replicas
- Replicas might be slightly behind
- **Eventual consistency!**

### NoSQL with Multiple Nodes

**MongoDB with replica set:**
- Write to primary
- Read from secondaries
- Secondaries might be behind
- **Eventual consistency!**

### Database with Cache

**Any database + Redis cache:**
- Update database
- Cache still has old value
- Read from cache gets old value
- **Eventual consistency!**

---

## Next Steps

- Understanding **synchronous vs asynchronous replication**
- Learning about **CAP Theorem** (Consistency, Availability, Partition tolerance)
- Exploring **strong consistency** vs **eventual consistency** trade-offs
- Understanding **cache invalidation** strategies

---

*Note: Eventual consistency is a reality when scaling databases. Understanding the difference between data consistency and read consistency helps you make informed decisions about when eventual consistency is acceptable and when you need strong consistency.*

