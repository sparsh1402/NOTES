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

---

*Last updated: [Date will be updated as notes are added]*

