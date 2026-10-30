# HashMap Deep Dive: Hashing, Resize and Treeification (Interview Depth)

> Builds on *Java Map and HashMap Internals*. This note covers the "why" behind each design choice, which is what SDE-2 interviewers ask about.

## Quick Revision

| Fact | Value / Rule |
|---|---|
| Default capacity | **16** buckets, table created lazily on the first `put()` |
| Load factor | **0.75** |
| Threshold | `capacity × loadFactor` (16 → 12, 32 → 24, 64 → 48) |
| Resize trigger | `++size > threshold`, so with 16 buckets the **13th** entry resizes |
| Capacity | Always a **power of two** (`new HashMap<>(20)` → 32) |
| Hash spreading | `h ^ (h >>> 16)` |
| Bucket index | `(n - 1) & hash` |
| Insertion into chain | **Tail** (Java 8+); head in Java 7 |
| Treeify | chain ≥ **8** **and** table ≥ **64** buckets, otherwise **resize** |
| Untreeify | tree ≤ **6** nodes |
| `null` key | hash 0 → bucket 0; one allowed (`ConcurrentHashMap` allows none) |
| Complexity | Avg O(1); worst O(n) pre-Java 8, O(log n) with treeified buckets |

---

## Part 1: How `put()` works

### Structure

- `Node<K,V>[] table`. Each `Node` holds `hash`, `key`, `value`, `next`, so each bucket is a linked list.
- The array is allocated on the first `put()`, not in the constructor.

### Step 1: Spread the hash

```java
static final int hash(Object key) {
    int h;
    return (key == null) ? 0 : (h = key.hashCode()) ^ (h >>> 16);
}
```

Only the **low bits** choose the bucket (step 2). XOR-ing the top 16 bits into the bottom 16 means keys whose `hashCode()`s differ only in their high bits don't all collide.

### Step 2: Find the bucket

```java
int index = (n - 1) & hash;   // n = table length
```

Because `n` is a power of two, `n - 1` is all ones in binary, so `&` equals `hash % n`, but it's faster and never negative. **This is why capacity must be a power of two.**

Worked example, hash 17 with 16 buckets:

```
hash  = 17 = 1 0001
n - 1 = 15 = 0 1111
        &  = 0 0001 = 1  → bucket 1
```

### Step 3: Insert or replace

- **Empty bucket:** place a new node.
- **Otherwise, walk the chain:** a node matches if it has the **same stored hash** *and* (`key == k` **or** `key.equals(k)`). On a match, replace the value and return the old one. Comparing the stored hash first is a cheap check that skips most `equals()` calls.
- **No match:** append at the **tail**.

### Step 4: Check size

If `++size > threshold`, resize.

---

## Part 2: Resizing

### Why load factor 0.75

It trades memory against collisions. A lower value (0.5) means fewer collisions but a half-empty array. A higher value (1.0) saves memory but gives longer chains and slower lookups. 0.75 keeps average chains short without wasting much space.

### What a resize does

1. Allocates a new array of **double** the size (16 → 32).
2. Moves every node into it.
3. Sets the new threshold (12 → 24).

### The Java 8 trick: no full rehash

When capacity doubles, the mask gains exactly **one bit**, the one worth `oldCap`:

```
old: index = hash & 01111   (cap 16 → mask 15)
new: index = hash & 11111   (cap 32 → mask 31)
```

So each node's new index is either:
- the **same** (`hash & oldCap == 0`), or
- **old index + oldCap** (`hash & oldCap != 0`).

Worked example, two nodes that share bucket 5 in a 16-bucket table:

```
Old table (mask 0 1111): only the last 4 bits count
hash A = 0 0101 (5)  & 0 1111 = 0101 = 5  → bucket 5
hash B = 1 0101 (21) & 0 1111 = 0101 = 5  → bucket 5   (the 16-bit is thrown away, so they collide)

New table (mask 1 1111): the 5th bit now counts
hash A = 0 0101 & 1 1111 = 5   → stays at 5     (hash & 16 == 0)
hash B = 1 0101 & 1 1111 = 21  → moves to 5+16  (hash & 16 != 0)
```

Each old bucket splits into a "low" list and a "high" list, both keeping their original order. No `hashCode()` or `equals()` calls are needed. This also shows why doubling the table reduces collisions: keys that shared a bucket because the mask was too short get separated by the extra bit.

### What this costs in a real service

- Each resize is **O(n)** plus a new array allocation. A map growing from 16 to 1M entries resizes about 16 times, which shows up as latency spikes and GC pressure on hot paths.
- **Presize when you know the count:**

```java
Map<String, Product> byId = HashMap.newHashMap(products.size());   // Java 19+
// older Java: new HashMap<>((int) (products.size() / 0.75f) + 1)
```

- **Common mistake:** `new HashMap<>(1000)` for 1000 entries gives capacity 1024 with threshold **768**, so the 769th entry still causes one resize.

### Resizing under concurrency

- **Java 7:** head insertion reversed chains during resize. Two threads resizing at once could create a **cycle**, and the next `get()` on that bucket **looped forever at 100% CPU**. This happened in real production systems.
- **Java 8:** tail insertion and the low/high split preserve order, so the infinite loop is gone. HashMap is **still not thread-safe**: concurrent `put()`s can **lose entries** (two threads write the same empty bucket and one overwrites the other) and leave `size()` wrong.
- **In a service:** use `ConcurrentHashMap` for any shared mutable map.

---

## Part 3: Treeification

### The constants

| Constant | Value | Meaning |
|---|---|---|
| `TREEIFY_THRESHOLD` | **8** | a chain this long becomes a red-black tree |
| `UNTREEIFY_THRESHOLD` | **6** | a tree this small turns back into a list |
| `MIN_TREEIFY_CAPACITY` | **64** | the table needs this many buckets before any treeifying |

Remember it as **"8 and 64, otherwise resize."**

### Why 8

With a reasonable `hashCode()` and load factor 0.75, bucket sizes follow a Poisson distribution. The chance of a bucket reaching 8 nodes is about **0.00000006**, so trees almost never appear with a decent hash. They exist to protect against **bad `hashCode()` implementations** and **hash-flooding attacks**, where an attacker sends deliberately colliding keys (crafted JSON field names, HTTP parameters) to slow a server down.

### Why a minimum of 64

In a small table, a long chain is more likely caused by the table being **too small** than by a bad hash. Doubling spreads keys out more cheaply than building a tree. So a chain of 8+ in a table of fewer than 64 buckets causes a **resize, not a treeify**.

### Why untreeify at 6, not 7

The gap prevents **thrashing**. Without it, a bucket hovering around 7–8 entries would flip between list and tree on every insert and delete.

### How the tree orders keys

1. By **hash value** first.
2. If hashes are equal and the key implements **`Comparable`**, by `compareTo()`.
3. Otherwise by a **tie-breaker** (`tieBreakOrder`: class name, then `System.identityHashCode`), used only to keep inserts balanced.

If every hash is identical and the key isn't `Comparable`, a lookup can't tell which side of the tree to search, may search both, and drifts back towards **O(n)**. That's why good key classes like `String` implement `Comparable`.

### Memory cost

A `TreeNode` is about twice the size of a `Node` (parent, left, right, prev pointers and a red/black flag). Another reason trees are a fallback, not the normal case.

---

## Applied scenarios

### A `hashCode()` that always returns 42

- **Correctness: still correct.** `hashCode()` only picks the bucket; **`equals()` decides which key matches**.
- **Performance:** every entry lands in one bucket, so operations become **O(n)**. The map is effectively a linked list.
- **Treeification helps only partly:** it needs 64+ buckets first (below that, HashMap keeps resizing, which doesn't help because every key still hashes to 42), and stays O(log n) only if the key is `Comparable`.

> **Interview line:** "Results stay correct because `equals()` decides equality, but every key collides into one bucket, so operations become O(n). Treeification gets it to O(log n) only once the table has 64+ buckets, and only if the key is `Comparable`."

### Mutating a key after `put()`

`Employee e1` is put into a map, then `e1.setDepartment("Payments")`, where `department` is used in `hashCode()`. Now `map.get(e1)` returns `null`:

1. On `put`, the hash was computed from the **old** department. The node went into, say, **bucket 5**, and **stored that hash** in its `hash` field.
2. `setDepartment()` changes `e1.hashCode()`. The node is **not moved**; HashMap doesn't know the key changed.
3. `get(e1)` computes the **new** hash, which points to, say, **bucket 11**. Empty, so `null`.
4. Even if the new hash pointed to bucket 5, the **stored hash** wouldn't match the new hash, so it still returns `null` without calling `equals()`.

**Consequence:** the entry is **stranded**. `get()` and `remove()` can't reach it, but it still uses memory and counts in `size()`. In a long-running cache keyed by a mutable object, this is a **memory leak**.

**Fix:** keys should be **immutable**, or at least the fields used in `hashCode()`/`equals()` must never change while the key is in a map. `String`, `Integer` and records make good keys.

---

## Interview lines to remember

> "On resize, the table doubles, and each node either stays at index `i` or moves to `i + oldCap`, depending on one bit of the hash, so there's no full rehash."

> "A bucket treeifies at 8 nodes, but only once the table has 64 buckets; below that it resizes instead. It untreeifies at 6 to avoid thrashing. Trees mainly defend against bad hash codes and hash-flooding attacks."

> "Capacity is a power of two so that `(n - 1) & hash` can replace `%`. The `h ^ (h >>> 16)` step mixes high bits into the low bits that actually choose the bucket."

---

## Practice questions (with answers)

1. **Hash 17, 16 buckets: which bucket?** → `10001 & 01111 = 00001` → bucket **1**.
2. **32 buckets, load factor 0.75: which entry triggers the resize?** → Threshold is 24; the check is `size > threshold`, so the **25th**. (Saying "24" is the common off-by-one.)
3. **Resizing 16 → 32, node in bucket 5 with `hash & 16 != 0`: new bucket?** → **21**.
4. **Chain of 9 nodes, table of 32 buckets: treeify or resize?** → **Resize**. Treeify needs 64+ buckets.
5. **`new HashMap<>(1000)` with exactly 1000 inserts: how many resizes?** → **1** (capacity 1024, threshold 768).
6. **Java 8 HashMap shared across threads without sync: infinite loop or lost entries?** → **Lost entries** and a wrong `size()`. The infinite loop was Java 7.

---

## My gaps to watch

| What I did | Strong answer |
|---|---|
| Gave the bucket number without the bit operation | Show `hash & (n-1)` in binary and say why `n` is a power of two |
| "O(n) or O(log n)" for a constant `hashCode()` | First say results stay correct (`equals()` decides), then O(n), then treeify's two conditions |
| "Because hash is done on department" | Walk through stored hash → old bucket → new hash → wrong bucket → stranded entry → memory leak → immutable keys |
| Said 24 triggers the resize | `size > threshold`, so the 25th |
| Said treeify with 32 buckets | "8 and 64, otherwise resize" |
| One-line answers to "why" questions | 3–4 sentences with the mechanism |
