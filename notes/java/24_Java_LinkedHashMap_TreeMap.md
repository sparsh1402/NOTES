# Java LinkedHashMap and TreeMap

## Table of Contents
- [LinkedHashMap](#linkedhashmap)
- [TreeMap](#treemap)
- [Comparison: HashMap vs LinkedHashMap vs TreeMap](#comparison-hashmap-vs-linkedhashmap-vs-treemap)
- [Summary](#summary)

---

## LinkedHashMap

### What is LinkedHashMap?

**LinkedHashMap** is a **HashMap** that maintains **insertion order** or **access order**.

**Key Points:**
- **Extends HashMap** - Inherits all HashMap functionality
- **Maintains order** - Unlike HashMap (no order guarantee)
- **Two ordering modes:**
  1. **Insertion Order** (default) - Order of insertion
  2. **Access Order** - Least recently used → Most recently used

**Visual Representation:**
```
HashMap (No Order Guarantee):
put(1, "A"), put(2, "B"), put(3, "C")
Iteration: Could be 3, 1, 2 (random order)

LinkedHashMap (Insertion Order):
put(1, "A"), put(2, "B"), put(3, "C")
Iteration: Always 1, 2, 3 (insertion order)

LinkedHashMap (Access Order):
put(1, "A"), put(2, "B"), put(3, "C")
get(2)  // Access 2
Iteration: 1, 3, 2 (2 moved to end - most recently used)
```

### How LinkedHashMap Maintains Order

**LinkedHashMap uses a doubly linked list** in addition to HashMap's bucket structure.

**Node Structure:**
```java
class LinkedHashMap.Entry<K,V> extends HashMap.Node<K,V> {
    Entry<K,V> before;  // Previous node in linked list
    Entry<K,V> after;   // Next node in linked list
}
```

**Comparison with HashMap Node:**
```
HashMap Node:
┌─────────────────────┐
│ hash                │
│ key                 │
│ value               │
│ next (for chaining) │
└─────────────────────┘

LinkedHashMap Node:
┌─────────────────────┐
│ hash                │
│ key                 │
│ value               │
│ next (for chaining) │
│ before (doubly LL)  │ ← Additional
│ after (doubly LL)   │ ← Additional
└─────────────────────┘
```

### Internal Structure

**LinkedHashMap maintains two structures:**
1. **HashMap buckets** (for O(1) access)
2. **Doubly linked list** (for maintaining order)

**Visual Representation:**
```
LinkedHashMap Internal Structure:

HashMap Buckets (for fast access):
┌─────┐  ┌─────┐  ┌─────┐  ┌─────┐
│ [0] │  │ [1] │  │ [2] │  │ [3] │
└──┬──┘  └──┬──┘  └──┬──┘  └──┬──┘
   │        │        │        │
   │     Node(1,"A") │     Node(23,"C")
   │        │        │        │
   │     Node(21,"B")│        │
   │        │        │        │
   └────────┼────────┼────────┘
            │        │
            ▼        ▼

Doubly Linked List (for order):
head → Node(1,"A") ↔ Node(21,"B") ↔ Node(23,"C") ↔ Node(141,"D") ↔ Node(25,"E") ← tail
        before:null  before:←      before:←      before:←        before:←
        after:→      after:→       after:→       after:→         after:null
```

**How It Works:**
1. **HashMap part:** Provides O(1) access using hash buckets
2. **Linked list part:** Maintains insertion/access order
3. **Both work together:** HashMap for fast lookup, linked list for ordered iteration

### Insertion Order Example

**Example:**
```java
import java.util.*;

public class LinkedHashMapInsertionOrder {
    public static void main(String[] args) {
        // Default: insertion order (accessOrder = false)
        Map<Integer, String> map = new LinkedHashMap<>();
        
        map.put(1, "A");
        map.put(21, "B");
        map.put(23, "C");
        map.put(141, "D");
        map.put(25, "E");
        
        // Iteration maintains insertion order
        for (Map.Entry<Integer, String> entry : map.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
        // Output (always in insertion order):
        // 1 -> A
        // 21 -> B
        // 23 -> C
        // 141 -> D
        // 25 -> E
    }
}
```

**Step-by-Step Insertion:**
```
Insert 1, "A":
  HashMap: table[0] = Node(1, "A")
  Linked List: head → Node(1, "A") ← tail

Insert 21, "B":
  HashMap: table[0] = Node(1, "A") → Node(21, "B")
  Linked List: head → Node(1, "A") ↔ Node(21, "B") ← tail

Insert 23, "C":
  HashMap: table[1] = Node(23, "C")
  Linked List: head → Node(1, "A") ↔ Node(21, "B") ↔ Node(23, "C") ← tail

Insert 141, "D":
  HashMap: table[2] = Node(141, "D")
  Linked List: head → Node(1, "A") ↔ Node(21, "B") ↔ Node(23, "C") ↔ Node(141, "D") ← tail

Insert 25, "E":
  HashMap: table[1] = Node(23, "C") → Node(25, "E")
  Linked List: head → Node(1, "A") ↔ Node(21, "B") ↔ Node(23, "C") ↔ Node(141, "D") ↔ Node(25, "E") ← tail
```

### Access Order Example

**Access Order:** Least recently used (LRU) at front, most recently used (MRU) at end.

**Constructor:**
```java
LinkedHashMap(int initialCapacity, float loadFactor, boolean accessOrder)
```

**Example:**
```java
import java.util.*;

public class LinkedHashMapAccessOrder {
    public static void main(String[] args) {
        // accessOrder = true
        Map<Integer, String> map = new LinkedHashMap<>(16, 0.75f, true);
        
        map.put(1, "A");
        map.put(21, "B");
        map.put(23, "C");
        map.put(141, "D");
        map.put(25, "E");
        
        // Initial order: 1, 21, 23, 141, 25
        
        // Access element 23
        map.get(23);  // Moves 23 to end (most recently used)
        
        // New order: 1, 21, 141, 25, 23 (23 moved to end)
        
        for (Map.Entry<Integer, String> entry : map.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
        // Output:
        // 1 -> A
        // 21 -> B
        // 141 -> D
        // 25 -> E
        // 23 -> C  (moved to end after access)
    }
}
```

**How Access Order Works:**
```
Initial State (after all puts):
head → 1 ↔ 21 ↔ 23 ↔ 141 ↔ 25 ← tail

After get(23):
1. Remove 23 from current position
2. Add 23 at the end (tail)

New State:
head → 1 ↔ 21 ↔ 141 ↔ 25 ↔ 23 ← tail
                    (most recently used)
```

**Use Case: LRU Cache**
```java
import java.util.*;

public class LRUCache<K, V> extends LinkedHashMap<K, V> {
    private final int maxSize;
    
    public LRUCache(int maxSize) {
        super(16, 0.75f, true);  // accessOrder = true
        this.maxSize = maxSize;
    }
    
    @Override
    protected boolean removeEldestEntry(Map.Entry<K, V> eldest) {
        return size() > maxSize;  // Remove least recently used when full
    }
    
    public static void main(String[] args) {
        LRUCache<Integer, String> cache = new LRUCache<>(3);
        
        cache.put(1, "A");
        cache.put(2, "B");
        cache.put(3, "C");
        // Cache: [1, 2, 3]
        
        cache.get(1);  // Access 1, moves to end
        // Cache: [2, 3, 1]
        
        cache.put(4, "D");  // Adds 4, removes 2 (least recently used)
        // Cache: [3, 1, 4]
    }
}
```

### Time Complexity

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| **put()** | **O(1) average** | Same as HashMap + O(1) for linked list update |
| **get()** | **O(1) average** | Same as HashMap + O(1) for linked list update (if access order) |
| **remove()** | **O(1) average** | Same as HashMap + O(1) for linked list update |
| **Iteration** | **O(n)** | Follows linked list order (predictable) |
| **Space Complexity** | **O(n)** | n key-value pairs + linked list pointers |

**Note:** Time complexity is **same as HashMap** because:
- HashMap operations: O(1) average
- Linked list updates: O(1) (just pointer updates)

### LinkedHashMap Properties

| Property | Value |
|----------|-------|
| **Thread Safe?** | ❌ No |
| **Maintains Order?** | ✅ Yes (insertion or access) |
| **Null Key Allowed?** | ✅ Yes (one) |
| **Null Value Allowed?** | ✅ Yes (multiple) |
| **Duplicate Keys?** | ❌ No (overwrites value) |
| **Extends** | HashMap |

### Thread-Safe Version

**Collections.synchronizedMap():**
```java
import java.util.*;

Map<Integer, String> map = new LinkedHashMap<>();
Map<Integer, String> syncMap = Collections.synchronizedMap(map);

// Now thread-safe
syncMap.put(1, "A");
syncMap.get(1);
```

**How it works:**
- Wraps LinkedHashMap with synchronized methods
- All operations are synchronized
- Slower than non-synchronized version

---

## TreeMap

### What is TreeMap?

**TreeMap** is a **sorted map** implementation that maintains keys in **sorted order**.

**Key Points:**
- **Sorted:** Keys are always sorted
- **Natural ordering:** By default (ascending for Integer, lexicographical for String)
- **Custom ordering:** Can provide Comparator
- **Red-Black Tree:** Internal data structure (self-balancing BST)

**Visual Representation:**
```
TreeMap (Sorted):
put(4, "SJ"), put(1, "PJ"), put(5, "XJ")
Result: Always sorted by key
Iteration: 1 -> "PJ", 4 -> "SJ", 5 -> "XJ"
```

### TreeMap Hierarchy

```
Map (Interface)
     │
     │ extends
     │
SortedMap (Interface)
     │
     │ extends
     │
NavigableMap (Interface)
     │
     │ implements
     │
TreeMap (Class)
```

### Internal Data Structure

**TreeMap uses Red-Black Tree** (self-balancing binary search tree).

**Node Structure:**
```java
class TreeMap.Entry<K,V> {
    K key;
    V value;
    Entry<K,V> left;   // Left child
    Entry<K,V> right;  // Right child
    Entry<K,V> parent; // Parent node
    boolean color;     // Red or Black (for balancing)
}
```

**Visual Representation:**
```
Red-Black Tree Structure:
          4 (Black)
         / \
    (Red)1   5 (Red)
       / \
   null null

Properties:
- Root is always Black
- Red nodes have Black children
- All paths from root to null have same number of Black nodes
- Self-balancing (height difference ≤ 1)
```

### How TreeMap Stores Data

**Example: Inserting Elements**

```java
TreeMap<Integer, String> map = new TreeMap<>();
map.put(4, "SJ");
map.put(1, "PJ");
map.put(5, "XJ");
```

**Step-by-Step Insertion:**
```
Insert 4, "SJ":
  Root: 4 (Black)
  Structure:
        4
       / \
    null null

Insert 1, "PJ":
  1 < 4, goes to left
  Structure:
        4 (Black)
       /
      1 (Red)
     / \
  null null

Insert 5, "XJ":
  5 > 4, goes to right
  Structure:
        4 (Black)
       / \
    (Red)1   5 (Red)
       / \   / \
    null null null null
```

**Binary Search Tree Property:**
- **Left child < Parent < Right child**
- Enables **O(log n) search** (binary search)

### Natural Ordering vs Comparator

**Natural Ordering (Default):**
```java
import java.util.*;

public class TreeMapNaturalOrder {
    public static void main(String[] args) {
        // Natural ordering (ascending for Integer)
        TreeMap<Integer, String> map = new TreeMap<>();
        
        map.put(5, "E");
        map.put(1, "A");
        map.put(13, "M");
        map.put(21, "U");
        
        // Iteration: Always sorted (ascending)
        for (Map.Entry<Integer, String> entry : map.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
        // Output:
        // 1 -> A
        // 5 -> E
        // 13 -> M
        // 21 -> U
    }
}
```

**Custom Comparator (Descending Order):**
```java
import java.util.*;

public class TreeMapComparator {
    public static void main(String[] args) {
        // Descending order using Comparator
        TreeMap<Integer, String> map = new TreeMap<>((a, b) -> b - a);
        
        map.put(5, "E");
        map.put(1, "A");
        map.put(13, "M");
        map.put(21, "U");
        
        // Iteration: Sorted in descending order
        for (Map.Entry<Integer, String> entry : map.entrySet()) {
            System.out.println(entry.getKey() + " -> " + entry.getValue());
        }
        // Output:
        // 21 -> U
        // 13 -> M
        // 5 -> E
        // 1 -> A
    }
}
```

### SortedMap Interface Methods

**SortedMap adds 4 methods:**

| Method | Description |
|--------|-------------|
| `firstKey()` | Returns first (lowest) key |
| `lastKey()` | Returns last (highest) key |
| `headMap(K toKey)` | Returns view of portion before toKey (exclusive) |
| `tailMap(K fromKey)` | Returns view of portion from fromKey (inclusive) |

**Example:**
```java
import java.util.*;

public class SortedMapExample {
    public static void main(String[] args) {
        SortedMap<Integer, String> map = new TreeMap<>();
        map.put(5, "E");
        map.put(1, "A");
        map.put(13, "M");
        map.put(21, "U");
        // Map: {1=A, 5=E, 13=M, 21=U}
        
        // firstKey() - First (lowest) key
        int first = map.firstKey();  // 1
        
        // lastKey() - Last (highest) key
        int last = map.lastKey();     // 21
        
        // headMap(toKey) - Portion before toKey (exclusive)
        SortedMap<Integer, String> head = map.headMap(13);
        // Returns: {1=A, 5=E} (13 is exclusive)
        
        // tailMap(fromKey) - Portion from fromKey (inclusive)
        SortedMap<Integer, String> tail = map.tailMap(13);
        // Returns: {13=M, 21=U} (13 is inclusive)
    }
}
```

### NavigableMap Interface Methods

**NavigableMap adds many methods for navigation:**

#### Lower Methods (Strictly Less Than)

| Method | Description |
|--------|-------------|
| `lowerEntry(K key)` | Entry with key < given key |
| `lowerKey(K key)` | Key < given key |

**Example:**
```java
TreeMap<Integer, String> map = new TreeMap<>();
map.put(1, "A");
map.put(21, "B");
map.put(23, "C");
map.put(25, "D");
map.put(141, "E");
// Map: {1=A, 21=B, 23=C, 25=D, 141=E}

Map.Entry<Integer, String> lower = map.lowerEntry(23);
// Returns: 21=B (strictly less than 23)

Integer lowerKey = map.lowerKey(23);
// Returns: 21 (only key, not value)
```

#### Floor Methods (Less Than or Equal)

| Method | Description |
|--------|-------------|
| `floorEntry(K key)` | Entry with key ≤ given key |
| `floorKey(K key)` | Key ≤ given key |

**Example:**
```java
TreeMap<Integer, String> map = new TreeMap<>();
map.put(1, "A");
map.put(21, "B");
map.put(23, "C");
map.put(25, "D");

Map.Entry<Integer, String> floor1 = map.floorEntry(23);
// Returns: 23=C (equal to 23, so returns it)

Map.Entry<Integer, String> floor2 = map.floorEntry(24);
// Returns: 23=C (24 not present, returns less than 24)
```

#### Ceiling Methods (Greater Than or Equal)

| Method | Description |
|--------|-------------|
| `ceilingEntry(K key)` | Entry with key ≥ given key |
| `ceilingKey(K key)` | Key ≥ given key |

**Example:**
```java
TreeMap<Integer, String> map = new TreeMap<>();
map.put(1, "A");
map.put(21, "B");
map.put(23, "C");
map.put(25, "D");

Map.Entry<Integer, String> ceiling1 = map.ceilingEntry(23);
// Returns: 23=C (equal to 23)

Map.Entry<Integer, String> ceiling2 = map.ceilingEntry(24);
// Returns: 25=D (24 not present, returns greater than 24)
```

#### Higher Methods (Strictly Greater Than)

| Method | Description |
|--------|-------------|
| `higherEntry(K key)` | Entry with key > given key |
| `higherKey(K key)` | Key > given key |

**Example:**
```java
TreeMap<Integer, String> map = new TreeMap<>();
map.put(1, "A");
map.put(21, "B");
map.put(23, "C");
map.put(25, "D");

Map.Entry<Integer, String> higher = map.higherEntry(23);
// Returns: 25=D (strictly greater than 23)
```

#### First and Last Methods

| Method | Description |
|--------|-------------|
| `firstEntry()` | First (lowest) entry |
| `lastEntry()` | Last (highest) entry |
| `pollFirstEntry()` | Remove and return first entry |
| `pollLastEntry()` | Remove and return last entry |

**Example:**
```java
TreeMap<Integer, String> map = new TreeMap<>();
map.put(1, "A");
map.put(21, "B");
map.put(23, "C");
map.put(25, "D");

Map.Entry<Integer, String> first = map.firstEntry();
// Returns: 1=A

Map.Entry<Integer, String> last = map.lastEntry();
// Returns: 25=D

Map.Entry<Integer, String> polled = map.pollLastEntry();
// Returns: 25=D and removes it from map
// Map now: {1=A, 21=B, 23=C}
```

#### Descending Methods

| Method | Description |
|--------|-------------|
| `descendingMap()` | Returns map in reverse order |
| `descendingKeySet()` | Returns keys in reverse order |

**Example:**
```java
TreeMap<Integer, String> map = new TreeMap<>();
map.put(1, "A");
map.put(3, "C");
map.put(5, "E");
map.put(9, "I");
// Map: {1=A, 3=C, 5=E, 9=I}

NavigableMap<Integer, String> descending = map.descendingMap();
// Returns: {9=I, 5=E, 3=C, 1=A}

NavigableSet<Integer> descendingKeys = map.descendingKeySet();
// Returns: [9, 5, 3, 1]
```

#### Head and Tail Methods (with Inclusive Flag)

| Method | Description |
|--------|-------------|
| `headMap(K toKey, boolean inclusive)` | Portion before toKey |
| `tailMap(K fromKey, boolean inclusive)` | Portion from fromKey |

**Example:**
```java
TreeMap<Integer, String> map = new TreeMap<>();
map.put(1, "A");
map.put(21, "B");
map.put(23, "C");
map.put(25, "D");
map.put(141, "E");

NavigableMap<Integer, String> head1 = map.headMap(23, true);
// Returns: {1=A, 21=B, 23=C} (23 inclusive)

NavigableMap<Integer, String> head2 = map.headMap(23, false);
// Returns: {1=A, 21=B} (23 exclusive)

NavigableMap<Integer, String> tail1 = map.tailMap(23, true);
// Returns: {23=C, 25=D, 141=E} (23 inclusive)

NavigableMap<Integer, String> tail2 = map.tailMap(23, false);
// Returns: {25=D, 141=E} (23 exclusive)
```

### Time Complexity

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| **put()** | **O(log n)** | Insert in balanced BST |
| **get()** | **O(log n)** | Search in balanced BST |
| **remove()** | **O(log n)** | Remove from balanced BST |
| **firstKey/lastKey** | **O(log n)** | Find min/max in tree |
| **lower/floor/ceiling/higher** | **O(log n)** | Binary search in tree |
| **Iteration** | **O(n)** | In-order traversal |
| **Space Complexity** | **O(n)** | n nodes in tree |

**Why O(log n)?**
- **Red-Black Tree** is balanced (height = O(log n))
- **Binary search** property (left < parent < right)
- **Self-balancing** maintains O(log n) height

### TreeMap Properties

| Property | Value |
|----------|-------|
| **Thread Safe?** | ❌ No |
| **Maintains Order?** | ✅ Yes (sorted order) |
| **Null Key Allowed?** | ❌ No (cannot compare null) |
| **Null Value Allowed?** | ✅ Yes (multiple) |
| **Duplicate Keys?** | ❌ No (overwrites value) |
| **Sorted?** | ✅ Yes (always sorted) |
| **Internal Structure** | Red-Black Tree |

---

## Comparison: HashMap vs LinkedHashMap vs TreeMap

### Feature Comparison

| Feature | HashMap | LinkedHashMap | TreeMap |
|---------|----------|---------------|---------|
| **Order** | ❌ No order | ✅ Insertion/Access order | ✅ Sorted order |
| **Internal Structure** | Array + Linked List/Tree | Array + Linked List/Tree + Doubly LL | Red-Black Tree |
| **Time Complexity (avg)** | O(1) | O(1) | O(log n) |
| **Time Complexity (worst)** | O(log n) | O(log n) | O(log n) |
| **Null Key** | ✅ Yes (one) | ✅ Yes (one) | ❌ No |
| **Null Value** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Thread Safe?** | ❌ No | ❌ No | ❌ No |
| **Use Case** | Fast access, no order needed | Fast access + order needed | Sorted data needed |

### When to Use Which?

**HashMap:**
- ✅ **Fastest** access (O(1) average)
- ✅ **No order** requirement
- ✅ **Most common** use case

**LinkedHashMap:**
- ✅ Need **insertion order** maintained
- ✅ Need **LRU cache** functionality
- ✅ Need **predictable iteration** order
- ⚠️ Slightly slower than HashMap (linked list overhead)

**TreeMap:**
- ✅ Need **sorted keys**
- ✅ Need **range queries** (headMap, tailMap)
- ✅ Need **navigation** (lower, floor, ceiling, higher)
- ⚠️ Slower than HashMap (O(log n) vs O(1))

### Performance Comparison

```
Operation Speed (Fastest to Slowest):
1. HashMap (O(1) average)
2. LinkedHashMap (O(1) average, slight overhead)
3. TreeMap (O(log n))

Memory Usage:
1. HashMap (most efficient)
2. LinkedHashMap (extra pointers for linked list)
3. TreeMap (tree structure overhead)
```

---

## Summary

### LinkedHashMap

**Key Features:**
- **Extends HashMap** - Inherits all functionality
- **Maintains order** - Insertion or access order
- **Doubly linked list** - Additional structure for order
- **Two modes:**
  - Insertion order (default)
  - Access order (LRU cache)

**Time Complexity:**
- Same as HashMap: O(1) average
- Linked list updates: O(1)

**Use Cases:**
- Need predictable iteration order
- LRU cache implementation
- Maintain insertion sequence

### TreeMap

**Key Features:**
- **Sorted map** - Always maintains sorted keys
- **Red-Black Tree** - Self-balancing BST
- **Natural or custom ordering** - Comparator support
- **Rich navigation methods** - lower, floor, ceiling, higher

**Time Complexity:**
- All operations: O(log n)
- Slower than HashMap but guaranteed sorted

**Use Cases:**
- Need sorted keys
- Range queries (headMap, tailMap)
- Navigation operations (find nearest key)
- Ordered iteration required

### Key Differences

| Aspect | HashMap | LinkedHashMap | TreeMap |
|--------|---------|---------------|---------|
| **Order** | Random | Insertion/Access | Sorted |
| **Speed** | Fastest | Fast | Moderate |
| **Structure** | Hash table | Hash table + DLL | Red-Black Tree |
| **Null Key** | ✅ | ✅ | ❌ |

---

## Practice Exercises

1. Create a LinkedHashMap and demonstrate insertion order.

2. Create a LinkedHashMap with access order and implement LRU cache.

3. Create a TreeMap with custom Comparator for descending order.

4. Use TreeMap navigation methods (lower, floor, ceiling, higher).

5. Compare performance of HashMap, LinkedHashMap, and TreeMap.

---

## Interview Questions

1. **What is the difference between HashMap and LinkedHashMap?**  
   LinkedHashMap maintains insertion/access order using doubly linked list, HashMap has no order guarantee.

2. **How does LinkedHashMap maintain order?**  
   Uses doubly linked list (before/after pointers) in addition to HashMap's bucket structure.

3. **What is access order in LinkedHashMap?**  
   Mode where most recently used elements move to end. Useful for LRU cache.

4. **What is TreeMap?**  
   Sorted map implementation using Red-Black Tree. Maintains keys in sorted order.

5. **What is the time complexity of TreeMap operations?**  
   O(log n) for all operations (put, get, remove) due to balanced BST structure.

6. **What is the difference between lower() and floor() in TreeMap?**  
   lower() returns strictly less than, floor() returns less than or equal to.

7. **What is the difference between ceiling() and higher() in TreeMap?**  
   ceiling() returns greater than or equal to, higher() returns strictly greater than.

8. **Can TreeMap have null key?**  
   No, TreeMap cannot have null key (cannot compare null for sorting).

9. **What data structure does TreeMap use?**  
   Red-Black Tree (self-balancing binary search tree).

10. **What is the difference between HashMap and TreeMap?**  
    HashMap: O(1) average, no order. TreeMap: O(log n), sorted order.

11. **How to make LinkedHashMap thread-safe?**  
    Use `Collections.synchronizedMap(new LinkedHashMap<>())`.

12. **What is headMap() and tailMap() in TreeMap?**  
    headMap() returns portion before key, tailMap() returns portion from key.

13. **What is pollFirstEntry() in TreeMap?**  
    Removes and returns first (lowest) entry from the map.

14. **What is descendingMap() in TreeMap?**  
    Returns a view of the map in reverse (descending) order.

15. **When to use LinkedHashMap vs TreeMap?**  
    Use LinkedHashMap for insertion/access order. Use TreeMap for sorted keys and range queries.

