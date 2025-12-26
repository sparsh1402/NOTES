# Java Set Implementations (HashSet, LinkedHashSet, TreeSet)

## Table of Contents
- [Set Interface](#set-interface)
- [HashSet](#hashset)
- [LinkedHashSet](#linkedhashset)
- [TreeSet](#treeset)
- [Set Operations (Union, Intersection, Difference)](#set-operations-union-intersection-difference)
- [Comparison Table](#comparison-table)
- [Summary](#summary)

---

## Set Interface

### What is Set?

**Set** is a collection that **does not contain duplicate elements**.

**Key Points:**
- **No duplicates:** Each element appears only once
- **Unordered:** Does not maintain insertion order (except LinkedHashSet)
- **No index access:** Cannot access elements by index
- **Child of Collection:** Inherits all Collection methods

**Visual Representation:**
```
Set (No Duplicates):
add(1), add(2), add(1), add(3)
Result: {1, 2, 3}  (duplicate 1 not added)

List (Allows Duplicates):
add(1), add(2), add(1), add(3)
Result: [1, 2, 1, 3]  (duplicate 1 allowed)
```

### Set Properties

1. **No duplicate elements**
   - If same element added again, **returns false** (not inserted)

2. **At most one null element**
   - Can have **one null** value

3. **No index-based access**
   - Cannot use `get(index)` like List

4. **Unordered** (except LinkedHashSet)
   - Iteration order not guaranteed

### Why Set Doesn't Allow Duplicates?

**Answer:** Set internally uses **Map** (HashMap/LinkedHashMap/TreeMap), and **Map doesn't allow duplicate keys**.

**How it works:**
- **Element** → stored as **key** in Map
- **Value** → **dummy object** (not used)
- **Duplicate key** → Map overwrites value, but Set checks and returns false

---

## HashSet

### What is HashSet?

**HashSet** is a Set implementation that uses **HashMap internally**.

**Key Points:**
- **Internal Structure:** Uses HashMap
- **No order guarantee:** Iteration order not predictable
- **Fast operations:** O(1) average time complexity
- **Not thread-safe**

### How HashSet Works Internally

**HashSet internally uses HashMap:**

**Structure:**
```java
// HashSet internally has:
private transient HashMap<E, Object> map;

// Dummy value for all entries
private static final Object PRESENT = new Object();
```

**Visual Representation:**
```
HashSet.add(12):
  Internally calls: map.put(12, PRESENT)
  
HashMap Structure:
  Key: 12
  Value: PRESENT (dummy object)
  
HashSet.add(11):
  Internally calls: map.put(11, PRESENT)
  
HashMap Structure:
  Key: 11
  Value: PRESENT (dummy object)
  
HashSet.add(12) again:
  Internally calls: map.put(12, PRESENT)
  Returns: false (key already exists)
```

**Code Example:**
```java
// HashSet internally does:
public boolean add(E e) {
    return map.put(e, PRESENT) == null;
    // PRESENT is a dummy object: private static final Object PRESENT = new Object();
}
```

**Why Dummy Object?**
- Map requires **key-value pair**
- Set only needs **keys** (elements)
- **Value is dummy** - never used, just placeholder

### Example

```java
import java.util.*;

public class HashSetExample {
    public static void main(String[] args) {
        Set<Integer> set = new HashSet<>();
        
        // Add elements
        set.add(12);
        set.add(11);
        set.add(33);
        set.add(4);
        
        // Try to add duplicate
        boolean added = set.add(12);  // Returns false (already present)
        
        // Iteration (order not guaranteed)
        for (Integer value : set) {
            System.out.print(value + " ");  // Could be: 33, 4, 11, 12 (random order)
        }
        
        // Contains
        System.out.println("\nContains 11: " + set.contains(11));  // true
        
        // Remove
        set.remove(11);
        
        // Size
        System.out.println("Size: " + set.size());  // 3
    }
}
```

### Time Complexity

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| **add()** | **O(1) average** | Same as HashMap.put() |
| **remove()** | **O(1) average** | Same as HashMap.remove() |
| **contains()** | **O(1) average** | Same as HashMap.containsKey() |
| **size()** | **O(1)** | Constant time |
| **Iteration** | **O(n)** | n elements |
| **Space Complexity** | **O(n)** | n elements |

**Note:** Time complexity is **same as HashMap** because HashSet uses HashMap internally.

### HashSet Properties

| Property | Value |
|----------|-------|
| **Thread Safe?** | ❌ No |
| **Maintains Insertion Order?** | ❌ No |
| **Null Element Allowed?** | ✅ Yes (one) |
| **Duplicate Elements?** | ❌ No |
| **Index Access?** | ❌ No |
| **Internal Structure** | HashMap |

### Thread-Safe Version

**ConcurrentHashMap.newKeySet():**
```java
import java.util.concurrent.*;

Set<Integer> set = ConcurrentHashMap.newKeySet();
// Thread-safe HashSet

set.add(1);
set.add(2);
// Safe for multiple threads
```

**How it works:**
- Uses **ConcurrentHashMap** internally
- Returns a **Set view** of ConcurrentHashMap keys
- All operations are **thread-safe**

---

## LinkedHashSet

### What is LinkedHashSet?

**LinkedHashSet** is a Set implementation that uses **LinkedHashMap internally**.

**Key Points:**
- **Internal Structure:** Uses LinkedHashMap
- **Maintains insertion order:** Elements iterated in insertion order
- **Fast operations:** O(1) average time complexity
- **Not thread-safe**

### How LinkedHashSet Works Internally

**LinkedHashSet internally uses LinkedHashMap:**

**Structure:**
```java
// LinkedHashSet internally has:
private transient LinkedHashMap<E, Object> map;

// Dummy value
private static final Object PRESENT = new Object();
```

**Visual Representation:**
```
LinkedHashSet.add(1):
  Internally: LinkedHashMap.put(1, PRESENT)
  Maintains doubly linked list: head → 1 ← tail

LinkedHashSet.add(21):
  Internally: LinkedHashMap.put(21, PRESENT)
  Doubly linked list: head → 1 ↔ 21 ← tail

LinkedHashSet.add(23):
  Internally: LinkedHashMap.put(23, PRESENT)
  Doubly linked list: head → 1 ↔ 21 ↔ 23 ← tail

Iteration follows linked list order: 1, 21, 23
```

**Why Insertion Order?**
- **LinkedHashMap** maintains **doubly linked list**
- **Iteration follows linked list** (not hash buckets)
- **Predictable order:** Same as insertion order

**Note:** LinkedHashSet **only supports insertion order**, not access order (unlike LinkedHashMap).

### Example

```java
import java.util.*;

public class LinkedHashSetExample {
    public static void main(String[] args) {
        Set<Integer> set = new LinkedHashSet<>();
        
        // Add elements
        set.add(2);
        set.add(77);
        set.add(82);
        set.add(63);
        set.add(5);
        
        // Iteration (maintains insertion order)
        for (Integer value : set) {
            System.out.print(value + " ");  // Always: 2, 77, 82, 63, 5
        }
        
        // Duplicate not added
        set.add(2);  // Returns false, set unchanged
        
        // Final set: {2, 77, 82, 63, 5} (insertion order maintained)
    }
}
```

### Time Complexity

**Same as LinkedHashMap:**
- **add():** O(1) average
- **remove():** O(1) average
- **contains():** O(1) average
- **Iteration:** O(n)

### LinkedHashSet Properties

| Property | Value |
|----------|-------|
| **Thread Safe?** | ❌ No |
| **Maintains Insertion Order?** | ✅ Yes |
| **Null Element Allowed?** | ✅ Yes (one) |
| **Duplicate Elements?** | ❌ No |
| **Index Access?** | ❌ No |
| **Internal Structure** | LinkedHashMap |
| **Access Order?** | ❌ No (only insertion order) |

### Thread-Safe Version

**Collections.synchronizedSet():**
```java
import java.util.*;

Set<Integer> set = new LinkedHashSet<>();
Set<Integer> syncSet = Collections.synchronizedSet(set);
// Thread-safe LinkedHashSet
```

---

## TreeSet

### What is TreeSet?

**TreeSet** is a Set implementation that uses **TreeMap internally**.

**Key Points:**
- **Internal Structure:** Uses TreeMap
- **Sorted order:** Elements always sorted
- **Natural or custom ordering:** Comparator support
- **Slower operations:** O(log n) time complexity

### How TreeSet Works Internally

**TreeSet internally uses TreeMap:**

**Structure:**
```java
// TreeSet internally has:
private transient NavigableMap<E, Object> map;

// Dummy value
private static final Object PRESENT = new Object();
```

**Visual Representation:**
```
TreeSet.add(4):
  Internally: TreeMap.put(4, PRESENT)
  Red-Black Tree:
        4 (Black)
       / \
    null null

TreeSet.add(1):
  Internally: TreeMap.put(1, PRESENT)
  Red-Black Tree:
        4 (Black)
       /
      1 (Red)
     / \
  null null

TreeSet.add(5):
  Internally: TreeMap.put(5, PRESENT)
  Red-Black Tree:
        4 (Black)
       / \
    (Red)1   5 (Red)
       / \   / \
    null null null null

Iteration (in-order): 1, 4, 5 (sorted)
```

### Natural Ordering Example

```java
import java.util.*;

public class TreeSetNaturalOrder {
    public static void main(String[] args) {
        // Natural ordering (ascending for Integer)
        Set<Integer> set = new TreeSet<>();
        
        set.add(2);
        set.add(5);
        set.add(63);
        set.add(77);
        set.add(82);
        
        // Iteration (always sorted)
        for (Integer value : set) {
            System.out.print(value + " ");  // Always: 2, 5, 63, 77, 82
        }
    }
}
```

### Custom Comparator Example

```java
import java.util.*;

public class TreeSetComparator {
    public static void main(String[] args) {
        // Descending order using Comparator
        Set<Integer> set = new TreeSet<>((a, b) -> b - a);
        
        set.add(2);
        set.add(5);
        set.add(63);
        set.add(77);
        set.add(82);
        
        // Iteration (descending order)
        for (Integer value : set) {
            System.out.print(value + " ");  // Always: 82, 77, 63, 5, 2
        }
    }
}
```

### Time Complexity

**Same as TreeMap:**
- **add():** O(log n)
- **remove():** O(log n)
- **contains():** O(log n)
- **first()/last():** O(log n)
- **Iteration:** O(n)

**Why O(log n)?**
- **Red-Black Tree** structure
- **Balanced BST** (height = O(log n))
- **Binary search** property

### TreeSet Properties

| Property | Value |
|----------|-------|
| **Thread Safe?** | ❌ No |
| **Maintains Sorted Order?** | ✅ Yes |
| **Null Element Allowed?** | ❌ No (cannot compare null) |
| **Duplicate Elements?** | ❌ No |
| **Index Access?** | ❌ No |
| **Internal Structure** | TreeMap (Red-Black Tree) |

---

## Set Operations (Union, Intersection, Difference)

### Mathematical Set Operations

**Set supports three mathematical operations:**

1. **Union** - All unique elements from both sets
2. **Intersection** - Common elements in both sets
3. **Difference** - Elements in first set but not in second

### Union (addAll)

**Operation:** `set1.addAll(set2)`

**Result:** All unique elements from both sets

**Visual Representation:**
```
Set1: {1, 2, 11, 33, 4}
Set2: {11, 9, 8, 8, 10, 5, 12}

Union (Set1 ∪ Set2):
  Add all elements from Set2 to Set1
  Duplicates automatically ignored
  
Result: {1, 2, 11, 33, 4, 9, 8, 10, 5, 12}
```

**Example:**
```java
import java.util.*;

public class SetUnion {
    public static void main(String[] args) {
        Set<Integer> set1 = new HashSet<>();
        set1.add(1);
        set1.add(2);
        set1.add(11);
        set1.add(33);
        set1.add(4);
        
        Set<Integer> set2 = new HashSet<>();
        set2.add(11);
        set2.add(9);
        set2.add(8);
        set2.add(8);  // Duplicate ignored
        set2.add(10);
        set2.add(5);
        set2.add(12);
        
        // Union: set1 ∪ set2
        set1.addAll(set2);
        System.out.println("Union: " + set1);
        // Output: [1, 2, 33, 4, 5, 8, 9, 10, 11, 12]
    }
}
```

### Intersection (retainAll)

**Operation:** `set1.retainAll(set2)`

**Result:** Only elements common to both sets

**Visual Representation:**
```
Set1: {1, 2, 11, 33, 4}
Set2: {11, 9, 8, 10, 5, 12}

Intersection (Set1 ∩ Set2):
  Keep only elements present in both sets
  
Result: {11, 12}  (common elements)
```

**Example:**
```java
import java.util.*;

public class SetIntersection {
    public static void main(String[] args) {
        Set<Integer> set1 = new HashSet<>();
        set1.add(1);
        set1.add(2);
        set1.add(11);
        set1.add(33);
        set1.add(4);
        set1.add(12);
        
        Set<Integer> set2 = new HashSet<>();
        set2.add(11);
        set2.add(9);
        set2.add(8);
        set2.add(10);
        set2.add(5);
        set2.add(12);
        
        // Intersection: set1 ∩ set2
        set1.retainAll(set2);
        System.out.println("Intersection: " + set1);
        // Output: [11, 12]  (common elements)
    }
}
```

### Difference (removeAll)

**Operation:** `set1.removeAll(set2)`

**Result:** Elements in set1 but not in set2

**Visual Representation:**
```
Set1: {1, 2, 11, 33, 4}
Set2: {11, 9, 8, 10, 5, 12}

Difference (Set1 - Set2):
  Remove all elements from Set1 that are in Set2
  
Result: {1, 2, 33, 4}  (elements only in Set1)
```

**Example:**
```java
import java.util.*;

public class SetDifference {
    public static void main(String[] args) {
        Set<Integer> set1 = new HashSet<>();
        set1.add(1);
        set1.add(2);
        set1.add(11);
        set1.add(33);
        set1.add(4);
        
        Set<Integer> set2 = new HashSet<>();
        set2.add(11);
        set2.add(9);
        set2.add(8);
        set2.add(10);
        set2.add(5);
        set2.add(12);
        
        // Difference: set1 - set2
        set1.removeAll(set2);
        System.out.println("Difference: " + set1);
        // Output: [1, 2, 33, 4]  (elements only in Set1)
    }
}
```

### Complete Example

```java
import java.util.*;

public class SetOperationsExample {
    public static void main(String[] args) {
        Set<Integer> set1 = new HashSet<>();
        set1.add(1);
        set1.add(2);
        set1.add(11);
        set1.add(33);
        set1.add(4);
        
        Set<Integer> set2 = new HashSet<>();
        set2.add(11);
        set2.add(9);
        set2.add(8);
        set2.add(10);
        set2.add(5);
        set2.add(12);
        
        // Union
        Set<Integer> union = new HashSet<>(set1);
        union.addAll(set2);
        System.out.println("Union: " + union);
        // Output: [1, 2, 33, 4, 5, 8, 9, 10, 11, 12]
        
        // Intersection
        Set<Integer> intersection = new HashSet<>(set1);
        intersection.retainAll(set2);
        System.out.println("Intersection: " + intersection);
        // Output: [11]
        
        // Difference
        Set<Integer> difference = new HashSet<>(set1);
        difference.removeAll(set2);
        System.out.println("Difference: " + difference);
        // Output: [1, 2, 33, 4]
    }
}
```

---

## Concurrent Modification Exception

### What is Concurrent Modification Exception?

**ConcurrentModificationException** is thrown when a collection is **modified while being iterated**.

**Example:**
```java
import java.util.*;

public class ConcurrentModificationExample {
    public static void main(String[] args) {
        Set<Integer> set = new HashSet<>();
        set.add(1);
        set.add(2);
        set.add(3);
        set.add(4);
        set.add(5);
        
        // Iterating over set
        Iterator<Integer> iterator = set.iterator();
        while (iterator.hasNext()) {
            Integer value = iterator.next();
            System.out.println(value);
            
            // Modifying while iterating
            set.add(8);  // ❌ ConcurrentModificationException
        }
    }
}
```

**Why It Happens:**
- **Iterator** expects collection to remain unchanged
- **Modification** during iteration causes inconsistency
- **Fail-fast** behavior (detects modification immediately)

**Solution 1: Use Iterator's remove()**
```java
Iterator<Integer> iterator = set.iterator();
while (iterator.hasNext()) {
    Integer value = iterator.next();
    if (value == 3) {
        iterator.remove();  // ✅ Safe - uses iterator's remove
    }
}
```

**Solution 2: Use Thread-Safe Collection**
```java
Set<Integer> set = ConcurrentHashMap.newKeySet();
// Thread-safe - can modify during iteration
```

**Solution 3: Collect changes, apply after iteration**
```java
List<Integer> toAdd = new ArrayList<>();
for (Integer value : set) {
    if (someCondition) {
        toAdd.add(value * 2);
    }
}
set.addAll(toAdd);  // Add after iteration
```

---

## Comparison Table

### Set Implementations

| Feature | HashSet | LinkedHashSet | TreeSet |
|---------|---------|---------------|---------|
| **Internal Structure** | HashMap | LinkedHashMap | TreeMap |
| **Order** | ❌ No order | ✅ Insertion order | ✅ Sorted order |
| **Time Complexity (avg)** | O(1) | O(1) | O(log n) |
| **Time Complexity (worst)** | O(log n) | O(log n) | O(log n) |
| **Null Element** | ✅ Yes (one) | ✅ Yes (one) | ❌ No |
| **Thread Safe?** | ❌ No | ❌ No | ❌ No |
| **Use Case** | Fast, no order | Fast + order | Sorted data |

### When to Use Which?

**HashSet:**
- ✅ **Fastest** operations (O(1) average)
- ✅ **No order** requirement
- ✅ **Most common** use case

**LinkedHashSet:**
- ✅ Need **insertion order** maintained
- ✅ Need **predictable iteration**
- ✅ **LRU cache** implementation
- ⚠️ Slightly slower than HashSet (linked list overhead)

**TreeSet:**
- ✅ Need **sorted elements**
- ✅ Need **range queries**
- ✅ Need **navigation** (first, last, lower, higher)
- ⚠️ Slower than HashSet (O(log n) vs O(1))

### Performance Comparison

```
Operation Speed (Fastest to Slowest):
1. HashSet (O(1) average)
2. LinkedHashSet (O(1) average, slight overhead)
3. TreeSet (O(log n))

Memory Usage:
1. HashSet (most efficient)
2. LinkedHashSet (extra pointers for linked list)
3. TreeSet (tree structure overhead)
```

---

## Summary

### Set Interface

**Key Features:**
- **No duplicates** - Each element appears only once
- **Unordered** (except LinkedHashSet) - No index access
- **At most one null** - Can have one null element
- **Child of Collection** - Inherits all Collection methods

### HashSet

**Key Features:**
- **Uses HashMap internally** - Element as key, dummy object as value
- **No order guarantee** - Random iteration order
- **O(1) average** - Fast operations
- **Thread-safe version:** `ConcurrentHashMap.newKeySet()`

### LinkedHashSet

**Key Features:**
- **Uses LinkedHashMap internally** - Maintains doubly linked list
- **Insertion order** - Predictable iteration order
- **O(1) average** - Fast operations
- **Only insertion order** - Access order not supported

### TreeSet

**Key Features:**
- **Uses TreeMap internally** - Red-Black Tree structure
- **Sorted order** - Always sorted (natural or Comparator)
- **O(log n)** - Slower but sorted
- **No null elements** - Cannot compare null

### Set Operations

- **Union (addAll):** All unique elements from both sets
- **Intersection (retainAll):** Common elements in both sets
- **Difference (removeAll):** Elements in first but not in second

### Key Takeaways

1. **Set uses Map internally:**
   - HashSet → HashMap
   - LinkedHashSet → LinkedHashMap
   - TreeSet → TreeMap

2. **Element stored as key:**
   - Value is dummy object (not used)
   - Duplicate key → returns false

3. **Time complexity:**
   - HashSet/LinkedHashSet: O(1) average
   - TreeSet: O(log n)

4. **Order:**
   - HashSet: No order
   - LinkedHashSet: Insertion order
   - TreeSet: Sorted order

---

## Practice Exercises

1. Create a HashSet and demonstrate no duplicates.

2. Create a LinkedHashSet and show insertion order is maintained.

3. Create a TreeSet with custom Comparator for descending order.

4. Perform union, intersection, and difference operations on two sets.

5. Demonstrate ConcurrentModificationException and how to avoid it.

---

## Interview Questions

1. **What is Set?**  
   Collection that does not contain duplicate elements.

2. **How does HashSet work internally?**  
   Uses HashMap internally. Element stored as key, dummy object as value.

3. **Why doesn't Set allow duplicates?**  
   Because it uses Map internally, and Map doesn't allow duplicate keys.

4. **What is the difference between HashSet and LinkedHashSet?**  
   LinkedHashSet maintains insertion order using doubly linked list, HashSet has no order guarantee.

5. **What is the time complexity of HashSet operations?**  
   O(1) average (same as HashMap), O(log n) worst case.

6. **What is the time complexity of TreeSet operations?**  
   O(log n) for all operations (uses Red-Black Tree).

7. **Can TreeSet have null element?**  
   No, TreeSet cannot have null element (cannot compare null for sorting).

8. **What data structure does TreeSet use?**  
   Red-Black Tree (self-balancing binary search tree).

9. **What is the difference between HashSet and TreeSet?**  
   HashSet: O(1) average, no order. TreeSet: O(log n), sorted order.

10. **How does LinkedHashSet maintain insertion order?**  
    Uses LinkedHashMap internally, which maintains doubly linked list for order.

11. **What are the set operations (union, intersection, difference)?**  
    addAll (union), retainAll (intersection), removeAll (difference).

12. **What is ConcurrentModificationException?**  
    Exception thrown when collection is modified during iteration.

13. **How to make HashSet thread-safe?**  
    Use `ConcurrentHashMap.newKeySet()`.

14. **Why does Set not have index-based access?**  
    Set is unordered (except LinkedHashSet), so index doesn't make sense.

15. **What is the internal structure of HashSet?**  
    HashMap where element is key and value is dummy object (PRESENT).

