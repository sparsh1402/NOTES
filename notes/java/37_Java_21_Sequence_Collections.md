# Java 21: Sequence Collections

## Table of Contents
- [Introduction](#introduction)
- [New Collection Hierarchy (Java 21)](#new-collection-hierarchy-java-21)
- [What Makes a Collection "Sequenced"?](#what-makes-a-collection-sequenced)
- [Why These Interfaces?](#why-these-interfaces)
- [Sequence Collection Methods](#sequence-collection-methods)
- [Sequence Set](#sequence-set)
- [Sequence Map](#sequence-map)
- [Examples](#examples)
- [Summary](#summary)

---

## Introduction

### What Changed in Java 21?

**Three new interfaces** were added to the Java Collection Framework:
1. **Sequence Collection** - For ordered collections
2. **Sequence Set** - For ordered sets (no duplicates)
3. **Sequence Map** - For ordered maps

**Purpose:** Provide **common interface** for collections that maintain order and support first/last element operations.

---

## New Collection Hierarchy (Java 21)

### Updated Hierarchy

**Before Java 21:**
```
Collection
  ├── List
  ├── Queue
  ├── Deque
  └── Set
      ├── HashSet
      ├── LinkedHashSet
      └── SortedSet
          └── TreeSet

Map
  ├── HashMap
  ├── LinkedHashMap
  └── SortedMap
      └── TreeMap
```

**After Java 21:**
```
Collection
  └── Sequence Collection  ⭐ NEW
      ├── List
      ├── Deque
      └── Sequence Set  ⭐ NEW
          ├── LinkedHashSet
          └── SortedSet
              └── TreeSet

Map
  └── Sequence Map  ⭐ NEW
      ├── LinkedHashMap
      └── SortedMap
          └── TreeMap
```

**Key Changes:**
- **List** now extends **Sequence Collection**
- **Deque** now extends **Sequence Collection**
- **LinkedHashSet** now implements **Sequence Set** (extends Sequence Collection)
- **SortedSet** now extends **Sequence Set**
- **LinkedHashMap** now implements **Sequence Map**
- **SortedMap** now extends **Sequence Map**

**Left Out:**
- **Queue** - Not sequenced
- **PriorityQueue** - Not sequenced
- **HashSet** - Not sequenced
- **HashMap** - Not sequenced
- **Hashtable** - Not sequenced

---

## What Makes a Collection "Sequenced"?

### Three Conditions

A collection is considered **"sequenced"** if it satisfies **all three conditions**:

#### 1. Predictable Iteration

**Definition:** Elements are stored in a **consistent, well-defined order**.

**Types of Order:**
- **Insertion Order:** Elements stored in the order they were inserted
- **Sorted Order:** Elements stored in sorted order (ascending/descending)

**Examples:**
- **List:** Follows insertion order ✅
- **Deque:** Follows insertion order ✅
- **LinkedHashSet:** Follows insertion order ✅
- **TreeSet:** Follows sorted order ✅
- **HashSet:** No order ❌
- **PriorityQueue:** No consistent order (only top element guaranteed) ❌

#### 2. Access and Manipulation of First and Last Element

**Definition:** Collection provides methods to:
- **Access** first and last elements
- **Add** elements at first and last positions
- **Remove** elements from first and last positions

**Examples:**
- **List:** `get(0)`, `get(size()-1)`, `add(0, element)`, `add(element)`, `remove(0)`, `remove(size()-1)` ✅
- **Deque:** `getFirst()`, `getLast()`, `addFirst()`, `addLast()`, `removeFirst()`, `removeLast()` ✅
- **LinkedHashSet:** Can access/manipulate (via iteration) ✅
- **TreeSet:** `first()`, `last()`, `add()`, `remove()` ✅
- **Queue:** Only front access (no last element access) ❌
- **HashSet:** No first/last concept ❌

#### 3. Reversible View

**Definition:** Collection can provide a **reverse view** (not modifying the original collection).

**Examples:**
- **List:** `Collections.reverse(list)` or `list.reversed()` ✅
- **Deque:** `deque.descendingIterator()` ✅
- **LinkedHashSet:** Can iterate in reverse (doubly linked list) ✅
- **TreeSet:** `treeSet.descendingSet()` ✅
- **Queue:** No reverse view ❌
- **HashSet:** No reverse view ❌

### Why Queue and PriorityQueue Are Left Out?

**Queue:**
- ✅ Predictable iteration (FIFO order)
- ❌ Cannot access last element (only front)
- ❌ No reverse view
- **Result:** Not sequenced

**PriorityQueue:**
- ❌ No predictable iteration (only top element guaranteed)
- ❌ No first/last concept (heap structure)
- ❌ No reverse view
- **Result:** Not sequenced

### Why HashSet and HashMap Are Left Out?

**HashSet/HashMap:**
- ❌ No order maintained
- ❌ No first/last concept
- ❌ No reverse view
- **Result:** Not sequenced

---

## Why These Interfaces?

### The Problem

**Before Java 21:** Each collection type had **different methods** for similar operations.

**Examples:**
```java
// List
list.get(0);  // First element
list.get(list.size() - 1);  // Last element
list.add(0, element);  // Add at first
list.add(element);  // Add at last
Collections.reverse(list);  // Reverse

// Deque
deque.getFirst();
deque.getLast();
deque.addFirst(element);
deque.addLast(element);
deque.descendingIterator();  // Reverse

// LinkedHashSet
// Manual iteration needed - no direct methods

// TreeSet
treeSet.first();
treeSet.last();
treeSet.add(element);
treeSet.descendingSet();  // Reverse
```

**Problem:** No common interface → Different methods for same operations → Hard to remember → Difficult to maintain

### The Solution

**After Java 21:** **Common interface** with **standardized methods**.

**Sequence Collection Methods:**
- `getFirst()` - Get first element
- `getLast()` - Get last element
- `addFirst(E)` - Add at first
- `addLast(E)` - Add at last
- `removeFirst()` - Remove first
- `removeLast()` - Remove last
- `reversed()` - Get reverse view

**Now all sequenced collections use the same methods!**

---

## Sequence Collection Methods

### Common Methods

**All sequenced collections now support:**

```java
// Access
E getFirst();
E getLast();

// Add
void addFirst(E element);
void addLast(E element);

// Remove
E removeFirst();
E removeLast();

// Reverse view
SequenceCollection<E> reversed();
```

### Example Usage

**List:**
```java
List<String> list = new ArrayList<>();
list.add("B");
list.add("C");
list.add("D");

// Java 21+ - Common methods
list.getFirst();  // "B"
list.getLast();   // "D"
list.addFirst("A");  // [A, B, C, D]
list.addLast("Z");   // [A, B, C, D, Z]
list.removeFirst();  // [B, C, D, Z]
list.removeLast();   // [B, C, D]
list.reversed();     // Reverse view: [D, C, B]
```

**Deque:**
```java
Deque<String> deque = new ArrayDeque<>();
deque.add("B");
deque.add("C");
deque.add("D");

// Same methods!
deque.getFirst();
deque.getLast();
deque.addFirst("A");
deque.addLast("Z");
deque.removeFirst();
deque.removeLast();
deque.reversed();
```

---

## Sequence Set

### Why Sequence Set?

**Question:** Why not put `LinkedHashSet` directly under `Sequence Collection`?

**Answer:** **Sequence Collection allows duplicates**, but **Set does not allow duplicates**.

**Solution:** Create **Sequence Set** interface that:
- Extends **Sequence Collection**
- Adds **no duplicates** constraint
- `LinkedHashSet` and `SortedSet` implement it

### Sequence Set Methods

**Inherits all Sequence Collection methods** plus:
- **No duplicates** guarantee
- Same methods: `getFirst()`, `getLast()`, `addFirst()`, `addLast()`, etc.

### Example

```java
SequenceSet<String> set = new LinkedHashSet<>();
set.add("B");
set.add("C");
set.add("D");

set.getFirst();  // "B"
set.getLast();   // "D"
set.addFirst("A");  // [A, B, C, D]
set.addLast("Z");   // [A, B, C, D, Z]

// Try to add duplicate
set.addFirst("C");  // Moves C to first: [C, A, B, D, Z] (no duplicate)

set.removeFirst();
set.removeLast();
set.reversed();
```

**Key Point:** Adding duplicate moves element to first/last position (maintains uniqueness).

### SortedSet Behavior

**Important:** For `SortedSet` (TreeSet), `addFirst()` and `addLast()` throw **UnsupportedOperationException**.

**Why?** Sorted order is determined by comparator, not by position.

```java
SortedSet<Integer> sortedSet = new TreeSet<>();
sortedSet.add(5);
sortedSet.add(7);
sortedSet.add(14);

sortedSet.getFirst();  // 5 (smallest)
sortedSet.getLast();   // 14 (largest)
sortedSet.addFirst(2);  // ❌ UnsupportedOperationException
sortedSet.addLast(20);  // ❌ UnsupportedOperationException

// Use regular add() - it will be placed in sorted order
sortedSet.add(2);  // ✅ Added at first (smallest)
sortedSet.add(20); // ✅ Added at last (largest)
```

---

## Sequence Map

### Methods

**Sequence Map provides:**

```java
// Access
Map.Entry<K, V> firstEntry();
Map.Entry<K, V> lastEntry();
K firstKey();
V firstValue();
K lastKey();
V lastValue();

// Add
V putFirst(K key, V value);
V putLast(K key, V value);

// Remove
Map.Entry<K, V> pollFirstEntry();
Map.Entry<K, V> pollLastEntry();

// Views
SequenceSet<K> sequencedKeySet();
SequenceCollection<V> sequencedValues();
SequenceSet<Map.Entry<K, V>> sequencedEntrySet();

// Reverse
SequenceMap<K, V> reversed();
```

### Example

**LinkedHashMap:**
```java
SequenceMap<Integer, String> map = new LinkedHashMap<>();
map.put(200, "B");
map.put(300, "C");
map.put(400, "D");

map.firstEntry();  // 200=B
map.lastEntry();   // 400=D
map.putFirst(100, "A");  // {100=A, 200=B, 300=C, 400=D}
map.putLast(500, "E");   // {100=A, 200=B, 300=C, 400=D, 500=E}
map.pollFirstEntry();    // Removes 100=A
map.pollLastEntry();     // Removes 500=E
map.reversed();          // Reverse view
```

**SortedMap (TreeMap):**
```java
SortedMap<Integer, String> sortedMap = new TreeMap<>();
sortedMap.put(5, "Five");
sortedMap.put(7, "Seven");
sortedMap.put(14, "Fourteen");

sortedMap.firstEntry();  // 5=Five
sortedMap.lastEntry();   // 14=Fourteen
sortedMap.putFirst(2, "Two");   // ❌ UnsupportedOperationException
sortedMap.putLast(20, "Twenty"); // ❌ UnsupportedOperationException

// Use regular put() - sorted by key
sortedMap.put(2, "Two");    // ✅ Added at first (smallest key)
sortedMap.put(20, "Twenty"); // ✅ Added at last (largest key)
```

---

## Examples

### Complete Example

```java
import java.util.*;

public class SequenceCollectionExample {
    public static void main(String[] args) {
        // List (Sequence Collection)
        SequenceCollection<String> list = new ArrayList<>();
        list.add("B");
        list.add("C");
        list.add("D");
        
        System.out.println("List:");
        System.out.println("First: " + list.getFirst());  // B
        System.out.println("Last: " + list.getLast());    // D
        list.addFirst("A");
        list.addLast("Z");
        System.out.println(list);  // [A, B, C, D, Z]
        
        // LinkedHashSet (Sequence Set)
        SequenceSet<String> set = new LinkedHashSet<>();
        set.add("B");
        set.add("C");
        set.add("D");
        
        System.out.println("\nSet:");
        System.out.println("First: " + set.getFirst());  // B
        System.out.println("Last: " + set.getLast());    // D
        set.addFirst("A");
        set.addLast("Z");
        System.out.println(set);  // [A, B, C, D, Z]
        
        // LinkedHashMap (Sequence Map)
        SequenceMap<Integer, String> map = new LinkedHashMap<>();
        map.put(200, "B");
        map.put(300, "C");
        map.put(400, "D");
        
        System.out.println("\nMap:");
        System.out.println("First: " + map.firstEntry());  // 200=B
        System.out.println("Last: " + map.lastEntry());     // 400=D
        map.putFirst(100, "A");
        map.putLast(500, "E");
        System.out.println(map);  // {100=A, 200=B, 300=C, 400=D, 500=E}
    }
}
```

---

## Summary

### Key Points

1. **Three new interfaces** in Java 21:
   - **Sequence Collection** - Ordered collections
   - **Sequence Set** - Ordered sets (no duplicates)
   - **Sequence Map** - Ordered maps

2. **Criteria for sequenced collections:**
   - Predictable iteration (insertion or sorted order)
   - Access/manipulation of first and last elements
   - Reversible view

3. **Why these interfaces?**
   - **Common interface** for similar operations
   - **Standardized methods** across all sequenced collections
   - **Easier to remember** and maintain

4. **Collections included:**
   - List, Deque → Sequence Collection
   - LinkedHashSet, SortedSet → Sequence Set
   - LinkedHashMap, SortedMap → Sequence Map

5. **Collections excluded:**
   - Queue, PriorityQueue, HashSet, HashMap, Hashtable

6. **Special cases:**
   - **SortedSet/SortedMap:** `addFirst()`/`putFirst()` throw UnsupportedOperationException (use regular `add()`/`put()`)

---

## Key Takeaways

1. **Sequence Collection** = Common interface for ordered collections
2. **Sequence Set** = Sequence Collection + no duplicates
3. **Sequence Map** = Ordered maps with first/last operations
4. **Common methods:** `getFirst()`, `getLast()`, `addFirst()`, `addLast()`, `removeFirst()`, `removeLast()`, `reversed()`
5. **Criteria:** Predictable iteration + first/last access + reversible view
6. **Benefit:** Standardized API, easier to use and remember

---

## Interview Questions

1. **What are Sequence Collections in Java 21?**  
   Three new interfaces (Sequence Collection, Sequence Set, Sequence Map) that provide common API for ordered collections.

2. **What makes a collection "sequenced"?**  
   Three conditions: predictable iteration, access/manipulation of first/last elements, reversible view.

3. **Why are Queue and PriorityQueue not sequenced?**  
   Queue cannot access last element, PriorityQueue has no predictable iteration (only top element guaranteed).

4. **Why is Sequence Set needed?**  
   Sequence Collection allows duplicates, but Set doesn't. Sequence Set adds no-duplicates constraint.

5. **What methods do Sequence Collections provide?**  
   `getFirst()`, `getLast()`, `addFirst()`, `addLast()`, `removeFirst()`, `removeLast()`, `reversed()`.

6. **Why were these interfaces added?**  
   To provide common interface for similar operations across different collection types (standardized API).

7. **What happens when you call addFirst() on SortedSet?**  
   Throws UnsupportedOperationException - sorted order is determined by comparator, not position.

8. **Which collections are sequenced?**  
   List, Deque, LinkedHashSet, SortedSet, LinkedHashMap, SortedMap.

9. **What is the difference between Sequence Collection and Sequence Set?**  
   Sequence Collection allows duplicates, Sequence Set doesn't (extends Sequence Collection with uniqueness constraint).

10. **What is a reversible view?**  
    A view of the collection in reverse order without modifying the original collection.

