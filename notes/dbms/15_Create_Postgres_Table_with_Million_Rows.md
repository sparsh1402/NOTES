# Create PostgreSQL Table with a Million Rows

## Overview

This is a practical guide on how to create a PostgreSQL table with millions of rows for testing purposes. This is useful for:
- Testing indexing performance
- Testing partitioning
- Testing other database features
- Performance benchmarking
- Learning database engineering concepts

**Goal:** Create a table with a million rows from scratch using Docker and PostgreSQL.

---

## Setup: Docker and PostgreSQL

### Step 1: Start PostgreSQL Container

**Command:**
```bash
docker run --name pg-one -e POSTGRES_PASSWORD=postgres -d postgres:13
```

**What this does:**
- Creates a Docker container named `pg-one`
- Sets PostgreSQL password to `postgres`
- Uses PostgreSQL version 13 (latest at time of video)
- Runs in detached mode (`-d`)

**Note:** We don't need to expose the port because we'll SSH into the container itself.

### Step 2: Connect to PostgreSQL

**Open a new terminal and run:**
```bash
docker exec -it pg-one psql -U postgres
```

**What this does:**
- Executes `psql` command inside the container
- Logs in as `postgres` user
- Now you're in PostgreSQL command shell

---

## Creating the Table

### Step 3: Create a Table

**Example: IoT Temperature Table**

```sql
CREATE TABLE temp (
    t INTEGER
);
```

**What this creates:**
- Table named `temp` (for temperatures)
- One column: `t` (integer type)
- This will be an IoT-populated table with temperature values

**Goal:** Insert 1 million rows with temperature values from 0 to 100.

---

## Inserting a Million Rows: The Trick

### The Magic: `generate_series()` Function

**PostgreSQL has a built-in function called `generate_series()`** that generates a series of numbers.

**Basic Usage:**
```sql
SELECT * FROM generate_series(0, 1000000);
```

**What this does:**
- Returns values from 0 to 1,000,000
- Creates a series of sequential numbers
- Very fast!

### Step 4: Insert with Random Values

**The Complete Command:**
```sql
INSERT INTO temp (t)
SELECT (random() * 100)::INTEGER
FROM generate_series(0, 1000000);
```

**Breaking it down:**
1. `INSERT INTO temp (t)` - Insert into table `temp`, column `t`
2. `SELECT (random() * 100)::INTEGER` - Generate random values
3. `FROM generate_series(0, 1000000)` - Generate 1,000,001 numbers (0 to 1,000,000)

**How it works:**
- `generate_series(0, 1000000)` creates numbers from 0 to 1,000,000
- `random()` returns a fraction (0.0 to 1.0)
- `random() * 100` gives values from 0.0 to 100.0
- `::INTEGER` coerces (converts) to integer
- Result: Random integers from 0 to 100

**Performance:**
- If you have **indexes**, this will be slower
- Without indexes, this is **very fast**
- Takes just a few seconds!

---

## Verifying the Data

### Step 5: Check the Data

**View sample rows:**
```sql
SELECT t FROM temp LIMIT 10;
```

**What this shows:**
- First 10 rows from the table
- Random temperature values (0 to 100)

**Count total rows:**
```sql
SELECT COUNT(*) FROM temp;
```

**Expected result:**
- **1,000,001 rows** (0 to 1,000,000 inclusive)
- Confirms all data was inserted

---

## Extending to Multiple Columns

### Adding More Columns

**What if you need multiple fields?**

**Example:**
```sql
CREATE TABLE temp (
    t INTEGER,
    sensor_id INTEGER,
    timestamp TIMESTAMP
);
```

**Insert with multiple columns:**
```sql
INSERT INTO temp (t, sensor_id, timestamp)
SELECT 
    (random() * 100)::INTEGER,
    (random() * 1000)::INTEGER,
    NOW() - (random() * INTERVAL '365 days')
FROM generate_series(0, 1000000);
```

**What this does:**
- `t`: Random temperature (0-100)
- `sensor_id`: Random sensor ID (0-1000)
- `timestamp`: Random timestamp within last year

### Creating Character/String Columns

**For text/character columns:**
```sql
INSERT INTO temp (t, sensor_name)
SELECT 
    (random() * 100)::INTEGER,
    CHR(65 + (random() * 26)::INTEGER)  -- Random letter A-Z
FROM generate_series(0, 1000000);
```

**How it works:**
- `CHR()` converts ASCII number to character
- `65` is ASCII for 'A'
- `65 + (random() * 26)` gives ASCII 65-90 (A-Z)
- Converts to character

**More complex strings:**
```sql
-- Random string of 10 characters
SELECT 
    (random() * 100)::INTEGER,
    SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 10)
FROM generate_series(0, 1000000);
```

---

## Complete Example

### Full Script

```sql
-- Step 1: Create table
CREATE TABLE temp (
    t INTEGER
);

-- Step 2: Insert 1 million rows
INSERT INTO temp (t)
SELECT (random() * 100)::INTEGER
FROM generate_series(0, 1000000);

-- Step 3: Verify
SELECT COUNT(*) FROM temp;  -- Should return 1000001

-- Step 4: View sample
SELECT t FROM temp LIMIT 10;
```

---

## Key Concepts

### `generate_series()` Function

**What it is:**
- Built-in PostgreSQL function
- Generates a series of numbers
- Very efficient for generating test data

**Syntax:**
```sql
generate_series(start, stop)
generate_series(start, stop, step)  -- With step size
```

**Examples:**
```sql
-- 0 to 10
SELECT * FROM generate_series(0, 10);
-- Result: 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10

-- Even numbers from 0 to 10
SELECT * FROM generate_series(0, 10, 2);
-- Result: 0, 2, 4, 6, 8, 10

-- Dates
SELECT * FROM generate_series('2020-01-01'::DATE, '2020-12-31'::DATE, '1 day');
```

### `random()` Function

**What it is:**
- Returns a random fraction between 0.0 and 1.0
- Can be multiplied to get different ranges
- Useful for generating random test data

**Examples:**
```sql
random()                    -- 0.0 to 1.0
random() * 100              -- 0.0 to 100.0
random() * 100::INTEGER     -- 0 to 100 (integer)
```

### Type Casting (`::`)

**What it is:**
- PostgreSQL syntax for type casting
- Converts one data type to another

**Examples:**
```sql
100.5::INTEGER     -- Converts to 100
'123'::INTEGER     -- Converts string to integer
65::TEXT           -- Converts number to text
```

---

## Performance Considerations

### With Indexes

**If table has indexes:**
- Insert will be **slower**
- Each row insertion must update indexes
- Still works, but takes longer

**Tip:** Create indexes **after** inserting data for better performance:
```sql
-- Insert data first
INSERT INTO temp (t) SELECT ...;

-- Then create index
CREATE INDEX idx_temp_t ON temp(t);
```

### Without Indexes

**If table has no indexes:**
- Insert is **very fast**
- Just appends rows to table
- Takes just a few seconds for millions of rows

---

## Use Cases

### When to Use This Technique

1. **Testing Index Performance**
   - Create large tables
   - Test different index types
   - Compare query performance

2. **Testing Partitioning**
   - Create large datasets
   - Test partition strategies
   - Measure partition performance

3. **Performance Benchmarking**
   - Test query performance
   - Compare different approaches
   - Measure optimization impact

4. **Learning Database Engineering**
   - Understand how databases handle large datasets
   - Learn optimization techniques
   - Practice with real-world scale data

---

## Tips and Tricks

### Adjusting the Number of Rows

**Change the number:**
```sql
-- 10 million rows
FROM generate_series(0, 10000000)

-- 100 thousand rows
FROM generate_series(0, 100000)
```

### Different Value Ranges

**Change the range:**
```sql
-- Temperatures from -50 to 50
(random() * 100 - 50)::INTEGER

-- IDs from 1 to 10000
(random() * 10000 + 1)::INTEGER
```

### Adding Constraints

**Create table with constraints:**
```sql
CREATE TABLE temp (
    t INTEGER CHECK (t >= 0 AND t <= 100),
    sensor_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## Summary

### Quick Reference

**Docker Setup:**
```bash
docker run --name pg-one -e POSTGRES_PASSWORD=postgres -d postgres:13
docker exec -it pg-one psql -U postgres
```

**Create and Populate:**
```sql
CREATE TABLE temp (t INTEGER);

INSERT INTO temp (t)
SELECT (random() * 100)::INTEGER
FROM generate_series(0, 1000000);
```

**Verify:**
```sql
SELECT COUNT(*) FROM temp;  -- Should be 1000001
SELECT t FROM temp LIMIT 10;
```

### Key Takeaways

1. **`generate_series()`** is your friend for generating test data
2. **`random()`** creates random values
3. **Type casting (`::`)** converts data types
4. **Very fast** without indexes
5. **Easy to extend** to multiple columns
6. **Great for testing** database features

---

## Next Steps

- Creating indexes on large tables
- Testing query performance
- Understanding partitioning
- Learning about database optimization
- Exploring other PostgreSQL functions

---

*Note: This technique is perfect for creating test datasets quickly. Use `generate_series()` and `random()` to populate tables with millions of rows for testing indexing, partitioning, and other database features. Remember: insert data first, then create indexes for better performance!*

