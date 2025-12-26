# ACID Properties - Hands-On Practice

## Overview

This is a practical demonstration of ACID properties using PostgreSQL in Docker. We'll test each property with real database operations.

---

## Setup: PostgreSQL in Docker

### Step 1: Start PostgreSQL Container

**Command:**
```bash
docker run --name pg-acid -d -e POSTGRES_PASSWORD=postgres postgres:13
```

**What this does:**
- Creates a Docker container named `pg-acid`
- Runs PostgreSQL version 13
- Sets password for postgres user as `postgres`
- Runs in detached mode (`-d`)

### Step 2: Connect to PostgreSQL

**Command:**
```bash
docker exec -it pg-acid psql -U postgres
```

**What this does:**
- Executes `psql` command inside the container
- Logs in as `postgres` user
- Now you're in PostgreSQL command shell

### Step 3: Create Tables

**Products Table:**
```sql
CREATE TABLE products (
    pid SERIAL PRIMARY KEY,
    name TEXT,
    price FLOAT,
    inventory INTEGER
);
```

**Sales Table:**
```sql
CREATE TABLE sales (
    sale_id SERIAL PRIMARY KEY,
    pid INTEGER,
    price FLOAT,
    quantity INTEGER
);
```

**What we have:**
- `products` table: Stores product information (ID, name, price, inventory)
- `sales` table: Stores sales records (sale ID, product ID, price sold at, quantity)

### Step 4: Insert Sample Data

**Insert a product:**
```sql
INSERT INTO products (name, price, inventory)
VALUES ('Phone', 999.99, 100);
```

**Result:** One product (Phone) with 100 units in inventory

---

## Testing Atomicity

### The Scenario

**Goal:** Make a sale of 10 phones

**What needs to happen:**
1. Deduct 10 units from inventory (UPDATE products)
2. Insert a record in sales table (INSERT into sales)

**Problem:** These are TWO separate queries. What if we crash between them?

### Test 1: Without Proper Transaction (Simulating Crash)

**Step 1: Start transaction**
```sql
BEGIN;
```

**Step 2: Update inventory**
```sql
UPDATE products 
SET inventory = inventory - 10 
WHERE pid = 1;
```

**Result:** Inventory is now 90 (you can verify with `SELECT * FROM products;`)

**Step 3: Simulate crash**
- Exit PostgreSQL (simulating a crash)
- Or kill the container

**What happens:**
- Transaction was never committed
- **Atomicity saves us!**
- When you come back and query: `SELECT * FROM products;`
- **Result:** Inventory is still 100 (not 90!)

**Why?**
- Because transaction wasn't committed
- Atomicity ensures "all or nothing"
- Since we crashed before completing both operations, everything is rolled back

### Test 2: Proper Transaction (Complete)

**Step 1: Start transaction**
```sql
BEGIN;
```

**Step 2: Update inventory**
```sql
UPDATE products 
SET inventory = inventory - 10 
WHERE pid = 1;
```

**Step 3: Insert sale record**
```sql
INSERT INTO sales (pid, price, quantity)
VALUES (1, 999.99, 10);
```

**Step 4: Commit**
```sql
COMMIT;
```

**Result:**
- Inventory: 90 units
- Sales table: 1 record (10 units sold)
- **Total: 90 + 10 = 100** ✓ (Consistent!)

**Key Points:**
- Both operations happen together (atomicity)
- If one fails, both are rolled back
- Only when both succeed, transaction commits

---

## Testing Consistency

### The Connection to Atomicity

**What we just demonstrated:**
- After committing the sale transaction:
  - Inventory = 90
  - Sales = 10 units
  - **90 + 10 = 100** ✓

**This is consistency!**
- The data follows the rule: `inventory + sales = original inventory`
- Without atomicity, we couldn't guarantee this consistency

### Consistency Rule

**Rule:** `products.inventory + SUM(sales.quantity WHERE pid = X) = original_inventory`

**In our example:**
- Original inventory: 100
- Current inventory: 90
- Sales: 10
- **90 + 10 = 100** ✓ Consistent!

**If atomicity fails:**
- Inventory: 90 (updated)
- Sales: 0 (not inserted - crashed)
- **90 + 0 = 90** ✗ Inconsistent! (Lost 10 units)

**Key Point:**
- Atomicity ensures consistency
- Without atomicity, you can't guarantee consistency
- Both properties work together

---

## Testing Isolation

### The Scenario

**Setup:**
- Two concurrent transactions (simulating two users/applications)
- Transaction 1: Generating a sales report
- Transaction 2: Making a new sale

**Problem:** What if Transaction 2 makes a sale while Transaction 1 is generating a report?

### Test 1: Default Isolation (Read Committed)

**Terminal 1 (Report Generation):**
```sql
BEGIN;

-- Query 1: Count sales per product
SELECT pid, COUNT(pid) 
FROM sales 
GROUP BY pid;
-- Result: Product 1 = 3 sales, Product 2 = 3 sales

-- Query 2: Get detailed sales (before executing this...)
```

**Terminal 2 (Making Sale - Happens in parallel):**
```sql
BEGIN;

-- Insert new sale
INSERT INTO sales (pid, price, quantity)
VALUES (1, 999.99, 10);

-- Update inventory
UPDATE products 
SET inventory = inventory - 10 
WHERE pid = 1;

COMMIT; -- Sale is committed!
```

**Back to Terminal 1:**
```sql
-- Now execute Query 2
SELECT pid, price, quantity 
FROM sales;
-- Result: Shows 4 sales for product 1 (includes the new sale)
```

**The Problem:**
- Query 1 said: 3 sales for product 1
- Query 2 shows: 4 sales for product 1
- **Inconsistent view!** The count doesn't match the details

**Why this happened:**
- Default isolation level: **Read Committed**
- Transaction 1 can see committed changes from Transaction 2
- This creates inconsistent results within the same transaction

### Test 2: Repeatable Read Isolation

**Terminal 1 (Report Generation):**
```sql
BEGIN TRANSACTION ISOLATION LEVEL REPEATABLE READ;

-- Query 1: Count sales per product
SELECT pid, COUNT(pid) 
FROM sales 
GROUP BY pid;
-- Result: Product 1 = 4 sales, Product 2 = 3 sales
```

**Terminal 2 (Making Sale - Happens in parallel):**
```sql
BEGIN;

INSERT INTO sales (pid, price, quantity)
VALUES (1, 999.99, 10);

UPDATE products 
SET inventory = inventory - 10 
WHERE pid = 1;

COMMIT; -- Sale is committed!
```

**Back to Terminal 1:**
```sql
-- Query 2: Get detailed sales
SELECT pid, price, quantity 
FROM sales;
-- Result: Still shows 4 sales (NOT 5!)

-- Query 1 again (repeatable)
SELECT pid, COUNT(pid) 
FROM sales 
GROUP BY pid;
-- Result: Still 4 sales (repeatable - same result!)
```

**What happened:**
- Transaction 1 got a **snapshot** of data when it started
- Even though Transaction 2 committed a new sale
- Transaction 1 **doesn't see it** (isolated view)
- All queries in Transaction 1 see the same data (repeatable)

**Key Points:**
- **Repeatable Read** = Consistent view throughout transaction
- Transaction sees data as it was at transaction start
- Other transactions' changes are invisible
- More expensive (database must maintain versions)

**After committing Transaction 1:**
```sql
COMMIT;

-- Now if you query again (outside transaction)
SELECT pid, COUNT(pid) 
FROM sales 
GROUP BY pid;
-- Result: 5 sales (now you see the committed change)
```

---

## Testing Durability

### The Scenario

**Goal:** Test if committed data survives a crash

### The Test

**Step 1: Start transaction and insert data**
```sql
BEGIN;

INSERT INTO products (name, price, inventory)
VALUES ('TV', 3000, 10);

COMMIT;
```

**Step 2: Immediately kill the container**
```bash
# In another terminal (while commit is happening)
docker stop pg-acid
```

**What this simulates:**
- Database crash immediately after commit
- Power loss
- System failure

**Step 3: Restart and check**
```bash
# Start container again
docker start pg-acid

# Connect
docker exec -it pg-acid psql -U postgres

# Check if data is there
SELECT * FROM products;
```

**Result:** The TV product is still there! ✓

**Why?**
- **Durability** ensures committed data is written to disk
- Even if database crashes immediately after commit
- Data is persisted to non-volatile storage
- When database restarts, data is recovered

### What If Commit Didn't Complete?

**If you kill container BEFORE commit:**
```sql
BEGIN;

INSERT INTO products (name, price, inventory)
VALUES ('TV', 3000, 10);

-- Kill container here (before COMMIT)
```

**Result:** TV is NOT in the database
- Transaction wasn't committed
- Durability only applies to committed transactions
- Uncommitted data can be lost (that's okay - atomicity handles it)

---

## Key Takeaways

### Atomicity
- ✅ All queries in transaction must succeed together
- ✅ If crash happens, uncommitted changes are rolled back
- ✅ Test: Start transaction, make changes, crash → changes are lost (as expected)

### Consistency
- ✅ Data follows business rules
- ✅ `inventory + sales = original_inventory`
- ✅ Atomicity ensures consistency
- ✅ Test: After sale, verify inventory + sales = original

### Isolation
- ✅ Transactions don't interfere with each other
- ✅ **Read Committed:** Can see other transactions' committed changes (may cause inconsistency)
- ✅ **Repeatable Read:** See consistent snapshot (doesn't see other transactions' changes)
- ✅ Test: Two transactions running in parallel, check what each sees

### Durability
- ✅ Committed data survives crashes
- ✅ Data is written to disk (non-volatile storage)
- ✅ Test: Commit data, kill database, restart → data is still there

---

## Important Notes

### Database Differences

**Isolation Implementation:**
- **PostgreSQL:** Uses MVCC (Multi-Version Concurrency Control) for Repeatable Read
- **MySQL/Oracle:** Uses undo logs for Repeatable Read
- **SQL Server:** Has its own implementation
- Each database implements isolation differently

### Performance Trade-offs

**Repeatable Read:**
- ✅ Consistent view
- ❌ More expensive (must maintain versions)
- ❌ Slower than Read Committed

**Read Committed:**
- ✅ Faster (default in most databases)
- ❌ May see inconsistent data in long transactions

### When to Use What

**Use Read Committed (default):**
- Most applications
- Short transactions
- Can tolerate seeing committed changes

**Use Repeatable Read:**
- Generating reports
- Long-running transactions
- Need consistent view throughout transaction

**Use Serializable:**
- Critical financial operations
- Need strongest isolation
- Can handle retries on conflicts

---

## Summary

### What We Tested

1. **Atomicity:** Transaction with crash → uncommitted changes are lost
2. **Consistency:** After sale, inventory + sales = original (consistent)
3. **Isolation:** Two concurrent transactions → different isolation levels show different results
4. **Durability:** Commit data, kill database → data survives restart

### The ACID Properties Work Together

- **Atomicity** ensures all-or-nothing
- **Consistency** ensures data follows rules
- **Isolation** ensures transactions don't interfere
- **Durability** ensures committed data persists

### Real-World Application

- **Banking:** Need all ACID properties (strong isolation, durability)
- **E-commerce:** Need atomicity (orders), consistency (inventory), durability
- **Analytics:** Can use weaker isolation (Read Committed), still need durability
- **Caching:** May sacrifice durability for speed

---

*Note: This hands-on practice demonstrates ACID properties in action. Understanding how to test and verify these properties helps you build robust database applications and debug issues when they occur.*

