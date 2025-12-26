# Durability

## Overview

**Durability** is the fourth and final ACID property. It ensures that once you commit a transaction, the data is saved permanently and won't be lost, even if something goes wrong.

---

## What is Durability?

### Simple Definition

**Durability** means: **When you commit a transaction, the changes are saved to permanent storage (like a hard drive or SSD) so they won't be lost.**

### What "Non-Volatile Storage" Means

**Non-volatile storage** = Storage that keeps data even when power is turned off
- Examples: Hard drives, SSDs, flash drives
- **NOT** RAM (memory) - RAM loses data when power is off

### The Guarantee

**Durability guarantees:**
- You commit a transaction
- Even if you lose power → Data is still there
- Even if your computer crashes → Data is still there
- Even if the database crashes → Data is still there
- You come back later → You see your changes

**Simple Test:**
- Commit a transaction
- Turn off power immediately
- Turn power back on
- Your data should still be there!

---

## Why Durability Matters

### You Might Think: "Of Course Everything is Durable"

**Not really!** Many database systems actually **sacrifice durability for speed**.

### The Problem: Disk Writes are Slow

**Why durability can be slow:**
- Writing to disk is **much slower** than writing to memory (RAM)
- Disk I/O (input/output) is expensive
- To make things durable, you must write to disk
- This makes writes slower

### The Trade-off

**Many databases offer options:**
- **Option 1:** Write to memory (fast, but not durable)
- **Option 2:** Write to disk (slow, but durable)
- **Option 3:** Write to memory, then write to disk in background (faster, but less durable)

**Example:** Redis gives you these options (most relational databases don't)

---

## Durability Definition

**Durability:** Changes made by a **committed transaction** (emphasis on committed!) must be persisted to **non-volatile storage** like:
- SSD (Solid State Drive)
- Hard drive
- Any permanent storage

**Important:** Only **committed** transactions need to be durable!
- If transaction is not committed, durability doesn't apply
- Uncommitted changes can be lost (that's okay)

---

## Durability Techniques

There are several ways databases ensure durability. Let's look at the main ones.

---

## 1. Write Ahead Log (WAL)

### The Problem with Writing Tables Directly

**Why writing tables directly is slow:**
- Tables are **huge** - lots of data
- Indexes are **huge** - complex data structures
- B-trees and other structures take time to write
- Writing all this to disk is **very slow**

**Result:** Commits would take forever!

### The Solution: Write Ahead Log (WAL)

**What is WAL?**
- Instead of writing the entire table, write only the **changes** (deltas)
- Write these changes to a special log file first
- This log is **much smaller** than the entire table
- Write this log to disk immediately (fast!)

**How it works:**
1. Transaction makes changes
2. Changes are written to WAL (Write Ahead Log) immediately
3. WAL is flushed to disk (fast, because it's small)
4. Later, changes are applied to actual tables (can be slower, done in background)

### Why WAL Works

**Benefits:**
- WAL is **small** - only contains changes, not entire tables
- Writing WAL is **fast** - much faster than writing entire tables
- **Guarantees persistence** - changes are saved immediately
- **Recovery:** If database crashes, can rebuild state from WAL

**Recovery Process:**
- Database crashes
- On restart, database reads WAL entries
- Rebuilds the state of tables from WAL
- Everything is restored!

**Note:** Tables are still written to disk eventually, but we don't wait for that during commit (too slow!)

---

## 2. Asynchronous Snapshots

### How It Works

**Asynchronous snapshots:**
- Keep everything in **memory** (RAM) while transaction runs
- Write to memory is **very fast**
- In the background, take a "snapshot" of everything
- Write the entire snapshot to disk at once
- This happens **asynchronously** (not blocking the transaction)

**Benefits:**
- Writes are fast (to memory)
- Durability happens in background
- Good performance

**Drawbacks:**
- If crash happens before snapshot completes, data might be lost
- Less durable than WAL (but faster)

**Example:** Redis uses this approach (as an option)

---

## 3. Append-Only Files

### How It Works

**Append-only files:**
- Similar to WAL
- Keep track of all changes
- Write changes to a log file (append only - never modify, only add)
- Very lightweight way to store changes
- Can reconstruct entire database state from the log

**Benefits:**
- Fast writes (just appending to a file)
- Lightweight (only stores changes, not entire data)
- Can rebuild state from log if needed

**Example:** Redis also uses this approach

---

## The OS Cache Problem

### What is OS Cache?

**OS Cache = Operating System Cache**

When you ask the operating system (Windows, Linux, etc.) to write something to disk:
- The OS **doesn't write directly to disk**
- Instead, it writes to its **own memory cache** first
- Later, it batches these writes and writes them to disk all at once

**Why does OS do this?**
- **Performance** - batching writes is faster
- Less I/O operations = better performance
- Most applications don't need immediate disk writes

### The Problem for Databases

**What happens:**
1. Database commits a transaction
2. Database asks OS: "Write this WAL to disk"
3. OS says: "Okay, done!" (but it only wrote to cache, not disk!)
4. Database thinks: "Great, data is durable!"
5. Database tells you: "Transaction committed successfully"
6. **BUT:** Data is only in OS cache (RAM), not on disk!

**What if you crash now?**
- Computer loses power
- OS cache (RAM) is lost
- Data is **gone** - even though database said it was committed!
- **Database lied to you!** (Not really, but data wasn't actually durable)

### The Solution: Fsync Command

**What is Fsync?**
- A command that **bypasses OS cache**
- Forces write **directly to disk**
- Tells OS: "I don't trust your cache, write to disk NOW!"

**How it works:**
```sql
-- Database does this internally:
1. Write WAL to OS
2. Call FSYNC (force write to disk, bypass cache)
3. Wait for FSYNC to complete
4. Then tell you: "Committed!"
```

**Benefits:**
- **True durability** - data is actually on disk
- Guaranteed persistence

**Drawbacks:**
- **Very slow** - bypassing cache is expensive
- Slows down commits significantly

### When to Use OS Cache vs Fsync

**OS Cache (faster, less durable):**
- Most applications (Word documents, Notepad, etc.)
- Crashes are rare
- Losing a few seconds of data is okay
- Better performance

**Fsync (slower, more durable):**
- Database systems
- Need guaranteed durability
- Can't afford to lose committed data
- Must bypass cache for safety

**Trade-off:** Speed vs Durability

---

## Summary: What Durability Means

### The Simple Test

**Durability means:**
- You commit a transaction
- Database says "Committed!"
- **At that exact moment**, you can turn off power
- When you come back, your data is still there
- That's durability!

### What We Don't Care About

**We don't care:**
- Where it's stored (SSD, hard drive, etc.)
- How it's stored (WAL, snapshots, etc.)
- We just care: **Is it there when we come back?**

### The Answer: YES!

If durability is working, the answer is always **YES** - your data is there!

---

## Trade-offs: Durability vs Speed

### The Fundamental Trade-off

**Durability = Slower Writes**
- Writing to disk is slow
- Using FSYNC is even slower
- But data is safe

**No Durability = Faster Writes**
- Writing to memory is fast
- But data can be lost
- Risk vs reward

### Real-World Example: Redis

**Redis offers durability options:**

**Option 1: Strong Durability**
- Every write goes to disk immediately
- Very durable
- Slower writes

**Option 2: Eventually Durable**
- Writes go to memory first
- Writes to disk happen in background (every few seconds)
- Faster writes
- **Risk:** If crash happens before disk write, you lose a few seconds of data

**Option 3: No Durability**
- Writes only to memory
- Very fast
- **Risk:** If crash happens, all data in memory is lost

### When to Use Each

**Strong Durability:**
- Banking systems
- Critical data
- Can't afford to lose anything

**Eventually Durable:**
- Application logs
- IoT device data
- Analytics data
- Can afford to lose a few seconds

**No Durability:**
- Caching
- Temporary data
- Data that can be regenerated

### The Reality

**Most of the time:**
- Crashes are very rare
- Systems are built to not crash
- But **Murphy's Law:** "If it can happen, it will happen eventually"
- You can't take that risk with important data

---

## Key Takeaways

### What is Durability?

1. **Definition:** Committed transactions must be saved to permanent storage
2. **Guarantee:** Data survives power loss, crashes, and restarts
3. **Test:** Commit, turn off power, turn on - data should be there!

### Durability Techniques

1. **Write Ahead Log (WAL):** Write changes to log first (fast), then apply to tables later
2. **Asynchronous Snapshots:** Write to memory (fast), snapshot to disk in background
3. **Append-Only Files:** Keep log of all changes, can rebuild from log

### The OS Cache Problem

1. **Problem:** OS writes to cache, not disk (faster but less safe)
2. **Solution:** Use FSYNC to force write directly to disk
3. **Trade-off:** FSYNC is slow but guarantees durability

### Trade-offs

1. **Durability vs Speed:** More durable = slower writes
2. **Choose based on needs:** Critical data needs strong durability
3. **Most systems:** Use strong durability for important data

---

## Real-World Examples

### When Durability is Critical

**Banking System:**
- Every transaction must be durable
- Can't lose money transfers
- Use strong durability (FSYNC)

**E-commerce Orders:**
- Orders must be saved permanently
- Can't lose customer purchases
- Use strong durability

### When You Can Trade Durability

**Application Logs:**
- Losing a few log entries is okay
- Can use eventually durable
- Better performance

**Analytics Data:**
- Can regenerate from source
- Eventually durable is fine
- Faster writes

**Caching:**
- Data can be regenerated
- No durability needed
- Maximum speed

---

## Connection to Other ACID Properties

### How Durability Works with Others

**Atomicity + Durability:**
- Atomicity: All or nothing
- Durability: Committed changes are saved
- Together: Committed transactions are saved completely

**Isolation + Durability:**
- Isolation: Transactions don't interfere
- Durability: Committed changes are saved
- Together: You see consistent, saved data

**Consistency + Durability:**
- Consistency: Data follows rules
- Durability: Data is saved
- Together: Correct data is saved permanently

---

## Summary

### Durability in One Sentence

**Durability means:** When you commit a transaction, the data is saved to permanent storage and will survive any crash or power loss.

### The Three Main Points

1. **What it is:** Saving committed transactions to permanent storage
2. **Why it matters:** Ensures data survives crashes and power loss
3. **The trade-off:** Durability makes writes slower, but data is safe

### Remember

- **Committed = Durable** (must be saved)
- **Uncommitted = Not durable** (can be lost)
- **Disk = Durable** (survives power loss)
- **Memory = Not durable** (lost on power loss)
- **FSYNC = Forces disk write** (bypasses OS cache)
- **Trade-offs exist** - choose based on your needs

---

## Next Steps

- **ACID Examples in Practice** - See ACID properties in action with real database examples
- **Eventual Consistency** - Deep dive into consistency trade-offs
- **Quiz** - Test your understanding of ACID properties
- **Replication** - How databases sync data across multiple instances

---

*Note: Durability is about guaranteeing that your committed data is safe. Understanding the trade-offs between durability and performance helps you choose the right database configuration for your needs. Remember: if it's committed, it should be there when you come back!*

