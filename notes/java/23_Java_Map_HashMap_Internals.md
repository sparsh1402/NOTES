# Java Map and HashMap Internals

## Table of Contents
- [Map Interface](#map-interface)
- [Why Map is Not Part of Collection?](#why-map-is-not-part-of-collection)
- [HashMap Internals](#hashmap-internals)
- [HashMap Operations](#hashmap-operations)
- [HashMap vs Hashtable](#hashmap-vs-hashtable)
- [Summary](#summary)

---

## Map Interface

### What is Map?

**Map** is an interface that maps **keys to values**.

**Key Points:**
- **Key-Value pairs:** Each key maps to exactly one value
- **No duplicate keys:** One key can map to only one value
- **Duplicate values allowed:** Multiple keys can have same value
- **Not part of Collection:** Different structure (key-value vs single values)

**Visual Representation:**
```
Map Structure:
Key    →  Value
1      →  "SJ"
2      →  "CX"
3      →  "PJ"
4      →  "SJ"  (duplicate value allowed)
```

### Map Properties

1. **Cannot contain duplicate keys**
   - If same key inserted again, **value is overwritten**

2. **Each key maps to exactly one value**
   - One-to-one relationship

3. **Values can be duplicate**
   - Multiple keys can have same value

4. **Null key allowed** (in HashMap)
   - Can have one null key

5. **Null values allowed** (in HashMap)
   - Can have multiple null values

### Map Interface Methods

**Most Frequently Used Methods:**

| Method | Return Type | Description |
|--------|-------------|-------------|
| `size()` | `int` | Number of key-value mappings |
| `isEmpty()` | `boolean` | Check if map is empty |
| `containsKey(Object key)` | `boolean` | Check if key exists |
| `containsValue(Object value)` | `boolean` | Check if value exists |
| `get(Object key)` | `V` | Get value for key |
| `put(K key, V value)` | `V` | Insert/update key-value |
| `remove(Object key)` | `V` | Remove key-value mapping |
| `clear()` | `void` | Remove all mappings |
| `keySet()` | `Set<K>` | Get all keys |
| `values()` | `Collection<V>` | Get all values |
| `entrySet()` | `Set<Map.Entry<K,V>>` | Get all key-value pairs |
| `putIfAbsent(K key, V value)` | `V` | Put if key absent or value is null |
| `getOrDefault(K key, V defaultValue)` | `V` | Get value or default if absent |

### Map.Entry Interface

**Map.Entry** is a **sub-interface** of Map that represents a key-value pair.

**Methods:**
- `getKey()` - Returns the key
- `getValue()` - Returns the value
- `setValue(V value)` - Sets the value

**Purpose:** Used to iterate over key-value pairs.

---

## Why Map is Not Part of Collection?

### Key Difference

**Collection:**
- Deals with **single values**
- Methods: `add(value)`, `remove(value)`, `contains(value)`

**Map:**
- Deals with **key-value pairs**
- Methods: `put(key, value)`, `get(key)`, `remove(key)`

**Example:**
```java
// Collection - single values
List<Integer> list = new ArrayList<>();
list.add(1);        // Just value
list.add(2);        // Just value

// Map - key-value pairs
Map<Integer, String> map = new HashMap<>();
map.put(1, "One");  // Key-Value pair
map.put(2, "Two");  // Key-Value pair
```

**Conclusion:** Map requires **different methods** than Collection, so it's a separate interface.

---

## HashMap Internals

### Internal Data Structure

**HashMap** uses an **array of buckets** (also called bins or slots).

**Internal Structure:**
```
HashMap Internal:
┌─────────────────────────────────────────┐
│  Array of Node<K,V> (Buckets)           │
│  ┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐   │
│  │ [0] │  │ [1] │  │ [2] │  │ [3] │   │
│  └─────┘  └─────┘  └─────┘  └─────┘   │
│     │        │        │        │       │
│   null    Node     Node      null      │
│            │        │                   │
│          Node     Node                  │
│            │        │                   │
│          null     null                  │
└─────────────────────────────────────────┘
```

### Node Structure

**Each bucket contains a Node (or Tree node after treeify):**

```java
class Node<K,V> implements Map.Entry<K,V> {
    final int hash;      // Hash code of key
    final K key;         // Key
    V value;             // Value
    Node<K,V> next;      // Pointer to next node (for chaining)
}
```

**Visual Representation:**
```
Node Structure:
┌─────────────────────┐
│ hash: 1234567       │
│ key: 1              │
│ value: "SJ"         │
│ next: ────────────▶ │
└─────────────────────┘
```

### Default Values

| Property | Default Value |
|----------|---------------|
| **Initial Capacity** | 16 buckets |
| **Load Factor** | 0.75 |
| **Threshold** | 12 (16 * 0.75) |
| **Treeify Threshold** | 8 (linked list → tree) |

### How put() Works

**Step-by-Step Process:**

#### Step 1: Compute Hash

```java
int hash = hash(key);  // Compute hash code of key
```

**Example:**
```java
put(1, "SJ");
// hash(1) → 1234567 (example)
```

#### Step 2: Calculate Index

```java
int index = hash % table.length;  // Modulo operation
```

**Example:**
```java
// hash = 1234567
// table.length = 16 (default)
// index = 1234567 % 16 = 7
```

#### Step 3: Check Bucket

```java
if (table[index] == null) {
    // Create new node
} else {
    // Handle collision
}
```

#### Step 4: Handle Collision or Insert

**If bucket is empty:**
```java
table[index] = new Node(hash, key, value, null);
```

**If collision (bucket not empty):**
```java
// Check if key already exists
if (existingKey.equals(key)) {
    // Update value
    existingNode.value = value;
} else {
    // Add to linked list (chaining)
    newNode.next = existingNode;
    table[index] = newNode;
}
```

**Visual Example:**
```
Initial: table[1] = null

put(1, "SJ"):
  hash(1) = 1234567
  index = 1234567 % 16 = 7
  table[7] = Node(1, "SJ", null)

put(5, "PJ"):
  hash(5) = 616100
  index = 616100 % 16 = 4
  table[4] = Node(5, "PJ", null)

put(10, "KJ"):
  hash(10) = 515100
  index = 515100 % 16 = 1
  table[1] = Node(10, "KJ", null)

Collision Example:
put(17, "XJ"):
  hash(17) = 1234567 (same as key 1)
  index = 1234567 % 16 = 7 (same index)
  
  Check: table[7] already has Node(1, "SJ")
  Create: Node(17, "XJ")
  Link: Node(17, "XJ").next = Node(1, "SJ")
  table[7] = Node(17, "XJ")
  
  Result:
  table[7] → Node(17, "XJ") → Node(1, "SJ") → null
```

### How get() Works

**Step-by-Step Process:**

#### Step 1: Compute Hash

```java
int hash = hash(key);
```

#### Step 2: Calculate Index

```java
int index = hash % table.length;
```

#### Step 3: Search in Bucket

```java
Node node = table[index];
while (node != null) {
    if (node.hash == hash && node.key.equals(key)) {
        return node.value;
    }
    node = node.next;  // Traverse linked list
}
return null;  // Not found
```

**Visual Example:**
```
get(5):
  hash(5) = 616100
  index = 616100 % 16 = 4
  
  Check table[4]:
    Node(5, "PJ")
    hash matches? Yes (616100)
    key.equals(5)? Yes
    Return: "PJ"
```

### Collision Handling

**Two Methods:**

1. **Chaining (Linked List)** - Default
2. **Tree (Balanced BST)** - After threshold

**Chaining:**
```
Collision at index 1:
table[1] → Node(10, "KJ") → Node(26, "MJ") → Node(42, "NJ") → null
```

**Tree (after treeify):**
```
When linked list length >= 8:
Convert to Red-Black Tree (balanced BST)

table[1] → TreeNode (root)
            /        \
      TreeNode    TreeNode
      (10, "KJ")  (26, "MJ")
```

### Load Factor

**Definition:** Ratio of number of elements to number of buckets.

**Default:** 0.75 (75%)

**Formula:**
```
Threshold = Capacity × Load Factor
Threshold = 16 × 0.75 = 12
```

**Purpose:**
- **Prevents long linked lists** (reduces collisions)
- **Triggers rehashing** when threshold crossed
- **Maintains O(1) average time complexity**

**How It Works:**
```
Initial: Capacity = 16, Load Factor = 0.75, Threshold = 12

After 12 insertions:
  - 13th insertion triggers rehashing
  - Capacity doubles: 16 → 32
  - All elements rehashed and redistributed
  - New threshold: 32 × 0.75 = 24
```

**Visual Representation:**
```
Before Rehashing (16 buckets, 12 elements):
┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │10 │11 │12 │13 │14 │15 │
└───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
   │   │   │   │   │   │   │   │   │   │   │   │
  ... ... ... ... ... ... ... ... ... ... ... ...

After Rehashing (32 buckets, 12 elements):
┌───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┬───┐
│ 0 │ 1 │ 2 │ 3 │ 4 │ 5 │ 6 │ 7 │ 8 │ 9 │10 │11 │12 │13 │14 │15 │16 │17 │18 │19 │20 │21 │22 │23 │24 │25 │26 │27 │28 │29 │30 │31 │
└───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┴───┘
   │   │   │   │   │   │   │   │   │   │   │   │
  ... ... ... ... ... ... ... ... ... ... ... ...

More buckets = Less collisions = Better performance
```

### Treeify Threshold

**Definition:** When linked list length reaches this threshold, convert to tree.

**Default:** 8

**Purpose:**
- **Prevents O(n) worst case** (long linked list)
- **Converts to balanced BST** (Red-Black Tree)
- **Maintains O(log n) worst case** instead of O(n)

**How It Works:**
```
Linked List (length < 8):
table[1] → Node(10) → Node(26) → Node(42) → ... → Node(X) → null
Search: O(n) worst case

After 8th collision:
Convert to Tree:
table[1] → TreeNode (root)
            /        \
      TreeNode    TreeNode
      (10)        (26)
        \            \
      TreeNode    TreeNode
      (42)        (X)

Search: O(log n) worst case
```

**Tree Structure:**
- **Red-Black Tree** (self-balancing BST)
- **Left child < parent < right child**
- **Always balanced** (height difference ≤ 1)

### HashCode and Equals Contract

**Critical Contract for HashMap:**

#### Contract 1: If objects are equal, hashCodes must be equal

```java
if (obj1.equals(obj2)) {
    then obj1.hashCode() == obj2.hashCode()
}
```

**Why Important:**
- **Consistent hashing:** Same key always generates same hash
- **Enables get() to work:** Can find key using hash

**Example:**
```java
Integer key1 = 5;
Integer key2 = 5;

key1.equals(key2);        // true
key1.hashCode() == key2.hashCode();  // true (MUST be)

// During put(5, "value"):
hash(5) = 616100

// During get(5):
hash(5) = 616100 (SAME hash - can find it!)
```

#### Contract 2: If hashCodes are equal, objects may not be equal

```java
if (obj1.hashCode() == obj2.hashCode()) {
    obj1.equals(obj2) may be false  // Hash collision possible
}
```

**Why Important:**
- **Hash collisions are possible:** Different keys can have same hash
- **Must compare keys:** Can't rely only on hash for equality

**Example:**
```java
String key1 = "Aa";
String key2 = "BB";

key1.hashCode() == key2.hashCode();  // true (collision)
key1.equals(key2);                   // false (different keys)

// Both map to same bucket, but different keys
// HashMap handles by comparing keys using equals()
```

**Violation Consequences:**
```java
// BAD: Violates contract
class BadKey {
    int id;
    
    @Override
    public boolean equals(Object o) {
        return this.id == ((BadKey)o).id;
    }
    
    // Missing hashCode() or returns different values
    // Same keys will have different hashes
    // get() won't find the key!
}
```

### Time Complexity

| Operation | Average | Worst Case | Notes |
|-----------|---------|------------|-------|
| **put()** | **O(1)** | **O(log n)** | O(n) if linked list, O(log n) if tree |
| **get()** | **O(1)** | **O(log n)** | O(n) if linked list, O(log n) if tree |
| **remove()** | **O(1)** | **O(log n)** | O(n) if linked list, O(log n) if tree |
| **containsKey()** | **O(1)** | **O(log n)** | Same as get() |
| **Space Complexity** | **O(n)** | **O(n)** | n key-value pairs |

**Why Average is O(1)?**
- **Load factor (0.75):** Keeps buckets well-distributed
- **Rehashing:** Prevents long linked lists
- **Tree conversion:** Prevents O(n) worst case

**Why Worst Case is O(log n)?**
- **Tree structure:** After treeify threshold
- **Balanced BST:** Height is O(log n)
- **Not O(n):** Because of tree conversion

---

## HashMap Operations

### Basic Operations Example

```java
import java.util.*;

public class HashMapExample {
    public static void main(String[] args) {
        Map<Integer, String> map = new HashMap<>();
        
        // put() - Insert/Update
        map.put(null, "test");      // Null key allowed
        map.put(0, null);           // Null value allowed
        map.put(1, "A");
        map.put(2, "B");
        map.put(3, "C");
        
        // putIfAbsent() - Put only if key absent or value is null
        map.putIfAbsent(null, "new");  // Key exists, value not null → No change
        map.putIfAbsent(0, "zero");    // Key exists, value is null → Updates to "zero"
        map.putIfAbsent(3, "D");       // Key exists, value not null → No change
        
        // size()
        System.out.println("Size: " + map.size());  // 5
        
        // isEmpty()
        System.out.println("Is Empty: " + map.isEmpty());  // false
        
        // containsKey()
        System.out.println("Contains 3: " + map.containsKey(3));  // true
        
        // get()
        System.out.println("Get 1: " + map.get(1));  // "A"
        
        // getOrDefault()
        System.out.println("Get 9: " + map.getOrDefault(9, "default"));  // "default"
        
        // remove()
        String removed = map.remove(null);  // Removes null key
        System.out.println("Removed: " + removed);  // "test"
        
        // Iterate using entrySet()
        for (Map.Entry<Integer, String> entry : map.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
        // Output:
        // 0 -> zero
        // 1 -> A
        // 2 -> B
        // 3 -> C
        
        // Iterate using keySet()
        for (Integer key : map.keySet()) {
            System.out.println("Key: " + key);
        }
        // Output: 0, 1, 2, 3
        
        // Iterate using values()
        for (String value : map.values()) {
            System.out.println("Value: " + value);
        }
        // Output: zero, A, B, C
        
        // clear()
        map.clear();
        System.out.println("Is Empty: " + map.isEmpty());  // true
    }
}
```

### putIfAbsent() Behavior

**putIfAbsent() inserts if:**
1. Key doesn't exist, OR
2. Key exists but value is null

**Example:**
```java
Map<Integer, String> map = new HashMap<>();
map.put(1, "A");
map.put(2, null);

map.putIfAbsent(1, "X");  // Key exists, value not null → No change
map.putIfAbsent(2, "B");  // Key exists, value is null → Updates to "B"
map.putIfAbsent(3, "C");  // Key doesn't exist → Inserts "C"
```

---

## HashMap vs Hashtable

### Comparison Table

| Feature | HashMap | Hashtable |
|---------|---------|-----------|
| **Thread Safe?** | ❌ No | ✅ Yes (synchronized) |
| **Null Key** | ✅ Allowed (one) | ❌ Not allowed |
| **Null Value** | ✅ Allowed (multiple) | ❌ Not allowed |
| **Performance** | ✅ Faster | ❌ Slower (synchronization) |
| **Legacy** | ✅ Modern (Java 1.2) | ⚠️ Legacy (Java 1.0) |
| **Iterator** | ✅ Fail-fast | ⚠️ Not fail-fast |
| **Initial Capacity** | 16 | 11 |
| **Load Factor** | 0.75 | 0.75 |

### Key Differences

**1. Thread Safety:**
```java
// HashMap - Not thread-safe
Map<Integer, String> map = new HashMap<>();
// Multiple threads can cause issues

// Hashtable - Thread-safe
Map<Integer, String> table = new Hashtable<>();
// Synchronized - safe for multiple threads
```

**2. Null Handling:**
```java
// HashMap - Allows null
Map<Integer, String> map = new HashMap<>();
map.put(null, "test");    // ✅ Allowed
map.put(1, null);         // ✅ Allowed

// Hashtable - No null
Map<Integer, String> table = new Hashtable<>();
table.put(null, "test");  // ❌ NullPointerException
table.put(1, null);       // ❌ NullPointerException
```

**3. Modern Alternative:**
```java
// Use ConcurrentHashMap instead of Hashtable
Map<Integer, String> concurrentMap = new ConcurrentHashMap<>();
// Thread-safe, better performance than Hashtable
```

### When to Use Which?

**HashMap:**
- ✅ Single-threaded environment
- ✅ Need null keys/values
- ✅ Better performance

**Hashtable:**
- ⚠️ Legacy code
- ⚠️ Multi-threaded (prefer ConcurrentHashMap)

**ConcurrentHashMap:**
- ✅ Multi-threaded environment
- ✅ Better than Hashtable
- ✅ Modern alternative

---

## Summary

### Map Interface

- **Key-Value pairs** - Each key maps to one value
- **No duplicate keys** - Duplicate keys overwrite values
- **Duplicate values allowed** - Multiple keys can have same value
- **Not part of Collection** - Different structure

### HashMap Internals

**Data Structure:**
- **Array of buckets** (default: 16)
- **Each bucket:** Node (linked list) or TreeNode (tree)
- **Collision handling:** Chaining → Tree (after threshold)

**Key Concepts:**
1. **Hashing:** `index = hash(key) % capacity`
2. **Load Factor (0.75):** Triggers rehashing at 75% capacity
3. **Treeify Threshold (8):** Converts linked list to tree
4. **Rehashing:** Doubles capacity when threshold crossed

**Time Complexity:**
- **Average:** O(1) for put/get/remove
- **Worst Case:** O(log n) (tree structure)

**HashCode-Equals Contract:**
- If `equals()` → `hashCode()` must be same
- If `hashCode()` same → `equals()` may differ (collision)

### HashMap vs Hashtable

| Feature | HashMap | Hashtable |
|---------|---------|-----------|
| Thread Safe | ❌ | ✅ |
| Null Key/Value | ✅ | ❌ |
| Performance | ✅ Faster | ❌ Slower |

### Best Practices

1. **Override hashCode() and equals()** for custom keys
2. **Maintain contract:** Equal objects → same hashCode
3. **Use ConcurrentHashMap** for multi-threaded environments
4. **Choose appropriate initial capacity** if known
5. **Understand load factor** impact on performance

---

## Practice Exercises

1. Create a HashMap and demonstrate all basic operations.

2. Create a custom key class and ensure hashCode() and equals() contract.

3. Demonstrate collision handling with multiple keys mapping to same bucket.

4. Compare performance of HashMap vs Hashtable.

5. Use entrySet(), keySet(), and values() to iterate HashMap.

---

## Interview Questions

1. **How does HashMap work internally?**  
   Uses array of buckets. Computes hash, calculates index, stores in bucket. Handles collisions with chaining (linked list) or tree.

2. **What is load factor in HashMap?**  
   Ratio of elements to buckets (default 0.75). Triggers rehashing when threshold crossed to maintain performance.

3. **What happens when HashMap is full?**  
   Rehashing occurs: capacity doubles, all elements rehashed and redistributed to new buckets.

4. **What is treeify threshold?**  
   When linked list length reaches 8, converts to Red-Black Tree to maintain O(log n) worst case instead of O(n).

5. **What is the time complexity of HashMap operations?**  
   Average: O(1), Worst case: O(log n) (after tree conversion).

6. **What is the hashCode-equals contract?**  
   If objects are equal, hashCodes must be equal. If hashCodes are equal, objects may not be equal.

7. **Why is HashMap not thread-safe?**  
   No synchronization. Multiple threads can cause data inconsistency. Use ConcurrentHashMap for thread-safety.

8. **What is the difference between HashMap and Hashtable?**  
   HashMap is not thread-safe, allows null. Hashtable is thread-safe, doesn't allow null.

9. **How does HashMap handle collisions?**  
   Uses chaining (linked list) initially. After treeify threshold (8), converts to balanced BST (Red-Black Tree).

10. **What is the default initial capacity of HashMap?**  
    16 buckets.

11. **What is rehashing?**  
    Process of doubling capacity and redistributing all elements when load factor threshold is crossed.

12. **Can HashMap have null key?**  
    Yes, HashMap allows one null key and multiple null values.

13. **What is the worst case time complexity of HashMap?**  
    O(log n) - when tree structure is used after treeify threshold.

14. **Why is average time complexity O(1)?**  
    Load factor and rehashing keep buckets well-distributed, preventing long linked lists.

15. **What happens if hashCode() and equals() contract is violated?**  
    HashMap won't work correctly. get() may not find existing keys, duplicate keys may be stored.

