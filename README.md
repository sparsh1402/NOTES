# DBMS Notes

This repository contains comprehensive notes on Database Management Systems (DBMS) based on course materials.

## 📚 Table of Contents

- [Introduction](#introduction)
- [Topics Covered](#topics-covered)
- [Notes Structure](#notes-structure)
- [Course Notes](#course-notes)

## Introduction

This repository is a collection of structured notes covering various concepts, topics, and practical examples related to Database Management Systems.

## Topics Covered

### ACID Properties
- [Video 1: ACID Properties Introduction](./notes/01_ACID_Properties_Introduction.md) - Overview of Atomicity, Consistency, Isolation, and Durability
- [Video 2: What is a Transaction?](./notes/02_What_is_a_Transaction.md) - Understanding database transactions, their lifecycle, and implementation considerations
- [Video 3: Atomicity](./notes/03_Atomicity.md) - Understanding atomicity: all-or-nothing transactions, crash recovery, and implementation strategies
- [Video 4: Isolation](./notes/04_Isolation.md) - Transaction isolation, read phenomena, isolation levels, and concurrency control
- [Video 5: Consistency](./notes/05_Consistency.md) - Two types of consistency: data consistency and read consistency, referential integrity, and eventual consistency
- [Video 6: Durability](./notes/06_Durability.md) - Ensuring committed transactions persist to permanent storage, WAL, OS cache problem, and FSYNC
- [Video 7: ACID Properties Hands-On](./notes/07_ACID_Properties_Hands_On.md) - Practical demonstration of ACID properties using PostgreSQL in Docker
- [Video 8: Phantom Reads](./notes/08_Phantom_Reads.md) - Understanding phantom reads, how to prevent them, and PostgreSQL's special behavior
- [Video 9: Serializable vs Repeatable Read](./notes/09_Serializable_vs_Repeatable_Read.md) - Critical difference between Serializable and Repeatable Read isolation levels, dependency detection, and when to use each
- [Video 10: Eventual Consistency](./notes/10_Eventual_Consistency.md) - Understanding eventual consistency, difference between data consistency and read consistency, and why both SQL and NoSQL suffer from it

*More topics will be added as course transcripts are processed.*

## Notes Structure

Notes are organized in a structured format with:
- Clear headings and subheadings
- Code examples where applicable
- Key concepts highlighted
- Important definitions and terminology
- Practical examples and use cases

## Course Notes

All detailed course notes are available in the [`notes/`](./notes/) directory.

### Available Notes

1. **[ACID Properties - Introduction](./notes/01_ACID_Properties_Introduction.md)**
   - Overview of ACID properties
   - Understanding transactions
   - Introduction to Atomicity, Consistency, Isolation, and Durability

2. **[What is a Transaction?](./notes/02_What_is_a_Transaction.md)**
   - Definition and purpose of transactions
   - Transaction lifecycle (BEGIN, COMMIT, ROLLBACK)
   - Implementation considerations (when to write to disk)
   - Read-only transactions and their benefits
   - Account transfer example with SQL
   - Implicit vs explicit transactions

3. **[Atomicity](./notes/03_Atomicity.md)**
   - Definition: all queries in a transaction must succeed
   - The "atom" analogy - indivisible unit of work
   - Failure scenarios and automatic rollback
   - Database crash handling and recovery
   - Implementation strategies (optimistic vs pessimistic)
   - Account transfer crash scenario example
   - Real-world implications of long transactions

4. **[Isolation](./notes/04_Isolation.md)**
   - Core question: Can transactions see changes from other transactions?
   - Read phenomena: Dirty Read, Non-repeatable Read, Phantom Read, Lost Updates
   - Isolation levels: Read Uncommitted, Read Committed, Repeatable Read, Snapshot, Serializable
   - Implementation approaches: Pessimistic (locks) vs Optimistic (versioning)
   - Database-specific implementations (PostgreSQL, MySQL, Oracle, SQL Server)
   - Detailed examples for each read phenomenon
   - When to use which isolation level

5. **[Consistency](./notes/05_Consistency.md)**
   - Two types: Consistency in data vs Consistency in reads
   - Referential integrity and foreign keys
   - Instagram data model example (pictures and likes)
   - Master-replica setup and read consistency
   - Eventual consistency (what it means and when it applies)
   - Synchronous vs asynchronous replication
   - Real-world examples (banking vs social media)
   - Connection to other ACID properties

6. **[Durability](./notes/06_Durability.md)**
   - Definition: Committed transactions must persist to permanent storage
   - Durability techniques: Write Ahead Log (WAL), asynchronous snapshots, append-only files
   - OS cache problem: Why operating systems cache writes
   - FSYNC command: Bypassing OS cache for true durability
   - Trade-offs: Durability vs speed (strong durability vs eventually durable)
   - Redis example: Different durability options
   - Real-world examples: When durability is critical vs when you can trade it
   - Connection to other ACID properties

7. **[ACID Properties Hands-On](./notes/07_ACID_Properties_Hands_On.md)**
   - Setup: PostgreSQL in Docker
   - Testing Atomicity: Transaction with crash simulation
   - Testing Consistency: Verifying data integrity after transactions
   - Testing Isolation: Concurrent transactions with different isolation levels
   - Testing Durability: Committed data surviving database crashes
   - Step-by-step SQL commands and results
   - Practical examples with products and sales tables

8. **[Phantom Reads](./notes/08_Phantom_Reads.md)**
   - Definition: New rows inserted by other transactions appearing in your transaction
   - Sales report example showing inconsistent results
   - How to fix: Serializable isolation level
   - PostgreSQL special behavior: Repeatable Read also prevents phantom reads
   - Database comparison: PostgreSQL vs MySQL/Oracle/SQL Server
   - MVCC (Multi-Version Concurrency Control) explanation
   - Range queries and unbounded queries affected by phantom reads
   - Practical SQL examples with concurrent transactions

9. **[Serializable vs Repeatable Read](./notes/09_Serializable_vs_Repeatable_Read.md)**
   - Critical difference: Dependency detection and serialization conflicts
   - Example: Two transactions swapping A's and B's
   - Repeatable Read: Both transactions commit (mixed result)
   - Serializable: One transaction fails, must retry (consistent result)
   - How Serializable detects write dependencies
   - Retry patterns for failed Serializable transactions
   - Alternative: Pessimistic locking with SELECT FOR UPDATE
   - Comparison table and when to use each isolation level
   - Real-world example: Account balance transfers

10. **[Eventual Consistency](./notes/10_Eventual_Consistency.md)**
   - Two types of consistency: Data consistency vs Read consistency
   - Common misconception: Eventual consistency is only for NoSQL (WRONG!)
   - Why both relational and NoSQL databases suffer from eventual consistency
   - Master-follower setup example showing read inconsistency
   - When eventual consistency is acceptable (social media) vs not acceptable (banking)
   - Critical distinction: Eventual consistency applies to reads, NOT data corruption
   - Root cause: Data in multiple places (leader + followers, database + cache)
   - Solutions: Synchronous vs asynchronous replication
   - Real-world examples: PostgreSQL replicas, MongoDB replica sets, Redis caching

---

*Last updated: [Date will be updated as notes are added]*

