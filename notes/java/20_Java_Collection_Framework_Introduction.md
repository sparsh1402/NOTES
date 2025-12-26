# Java Collection Framework - Introduction

## Table of Contents
- [What is Java Collection Framework?](#what-is-java-collection-framework)
- [Why Do We Need Collection Framework?](#why-do-we-need-collection-framework)
- [Collection Framework Hierarchy](#collection-framework-hierarchy)
- [Iterable Interface](#iterable-interface)
- [Collection Interface](#collection-interface)
- [Collections Utility Class](#collections-utility-class)
- [Collection vs Collections](#collection-vs-collections)
- [Summary](#summary)

---

## What is Java Collection Framework?

### Definition

**Java Collection Framework** is a unified architecture for representing and manipulating **groups of objects** (collections).

**Key Points:**
- **Added in:** Java 1.2
- **Package:** `java.util`
- **Purpose:** Provides ready-made architecture to manage groups of objects

### Components

**Collection Framework consists of:**
1. **Interfaces** - Define contracts (what operations are available)
2. **Classes** - Concrete implementations (how operations work)
3. **Algorithms** - Methods to manipulate collections (sort, search, etc.)

### What is a Collection?

**Collection** = **Group of objects** or **group of elements**

**Example:**
```java
int[] array = {1, 2, 3, 4};  // Collection of integers
List<Integer> list = new ArrayList<>();  // Collection of integers
```

### What is a Framework?

**Framework** = **Architecture** that provides:
- Pre-built classes and interfaces
- Common methods and operations
- Standard way to work with collections
- Ability to extend and customize

**Benefits:**
- **No need to write from scratch** - Everything is built-in
- **Consistent API** - Same methods across different collections
- **Extensible** - Can build custom collections on top

---

## Why Do We Need Collection Framework?

### Problem Before Collection Framework (Pre-Java 1.2)

**Before Java 1.2, we had:**
- Arrays
- Vector
- Hashtable

**Problem:** **No common interface** - Each collection had different methods!

**Example - Different Ways to Read/Write:**

**Array:**
```java
int[] array = new int[4];
array[0] = 1;        // Write
int value = array[0]; // Read
```

**Vector:**
```java
Vector<Integer> vector = new Vector<>();
vector.add(1);           // Write
int value = vector.get(0); // Read
```

**Hashtable:**
```java
Hashtable<Integer, String> table = new Hashtable<>();
table.put(1, "One");      // Write
String value = table.get(1); // Read
```

**Problems:**
1. ❌ **Different method names** for same operation (add vs put)
2. ❌ **Different syntax** for each collection type
3. ❌ **Hard to remember** which method to use
4. ❌ **No consistency** across collections

### Solution: Collection Framework

**Collection Framework provides:**
- ✅ **Common interface** - Same methods for all collections
- ✅ **Consistent API** - Easy to remember and use
- ✅ **Unified architecture** - All collections follow same pattern

**Example - Unified Way:**

```java
// All collections use same methods
List<Integer> list = new ArrayList<>();
list.add(1);        // Same method for all

Queue<Integer> queue = new PriorityQueue<>();
queue.add(1);       // Same method

Set<Integer> set = new HashSet<>();
set.add(1);         // Same method
```

**Key Benefit:**
- Focus on **which collection to use** (based on requirement)
- Don't worry about **how to use it** (methods are same)

---

## Collection Framework Hierarchy

### Overview Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Iterable (Interface)                      │
│                    (Java 1.5)                                │
│                    - iterator()                              │
│                    - forEach()                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           │ extends
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                  Collection (Interface)                       │
│                  (Java 1.2)                                   │
│                  - add(), remove(), size()                    │
│                  - contains(), isEmpty()                     │
└──────────┬───────────────────────┬───────────────────────────┘
           │                       │
           │ extends               │ extends
           │                       │
┌──────────▼──────────┐  ┌────────▼──────────┐  ┌──────────────┐
│   List (Interface)  │  │  Set (Interface) │  │ Queue (Interface)│
└──────────┬──────────┘  └────────┬──────────┘  └──────┬───────┘
           │                       │                    │
           │ implements            │ implements         │ implements
           │                       │                    │
┌──────────▼──────────┐  ┌────────▼──────────┐  ┌──────▼───────┐
│   ArrayList         │  │   HashSet         │  │ PriorityQueue│
│   LinkedList        │  │   LinkedHashSet   │  │ ArrayDeque    │
│   Vector            │  │   TreeSet         │  │               │
│   Stack             │  └───────────────────┘  └───────────────┘
└─────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                    Map (Interface)                           │
│                    (NOT part of Collection)                 │
│                    - put(), get(), remove()                  │
└──────────┬───────────────────────┬───────────────────────────┘
           │                       │
           │ implements            │ implements
           │                       │
┌──────────▼──────────┐  ┌────────▼──────────┐
│   HashMap           │  │   TreeMap          │
│   LinkedHashMap     │  │   Hashtable        │
└─────────────────────┘  └────────────────────┘
```

### Key Points

1. **Two Main Categories:**
   - **Collection** (extends Iterable) - List, Set, Queue
   - **Map** (separate) - Not part of Collection hierarchy

2. **Root Interface:**
   - **Iterable** - Parent of all collections (except Map)

3. **Main Interfaces:**
   - **Collection** - Common operations
   - **List** - Ordered, allows duplicates
   - **Set** - No duplicates
   - **Queue** - FIFO/LIFO operations
   - **Map** - Key-value pairs

4. **Concrete Classes:**
   - **ArrayList, LinkedList, Vector, Stack** (List implementations)
   - **HashSet, LinkedHashSet, TreeSet** (Set implementations)
   - **PriorityQueue, ArrayDeque** (Queue implementations)
   - **HashMap, LinkedHashMap, TreeMap, Hashtable** (Map implementations)

---

## Iterable Interface

### Purpose

**Iterable** is used to **traverse** (iterate over) collections.

**Key Points:**
- **Added in:** Java 1.5
- **Root interface** for all collections
- Allows collections to be used in **enhanced for loop**

### Methods

**Iterable Interface Methods:**

1. **`iterator()`** - Returns Iterator object (Java 1.5)
2. **`forEach(Consumer)`** - Iterates using lambda expression (Java 1.8)

### Iterator Object

**Iterator** provides methods to iterate:

1. **`hasNext()`** - Returns `true` if more elements exist
2. **`next()`** - Returns next element
3. **`remove()`** - Removes last element returned by iterator

### Ways to Iterate Collections

#### Method 1: Using Iterator

**Syntax:**
```java
Iterator<Type> iterator = collection.iterator();
while (iterator.hasNext()) {
    Type element = iterator.next();
    // Process element
}
```

**Example:**
```java
import java.util.*;

public class IteratorExample {
    public static void main(String[] args) {
        List<Integer> values = new ArrayList<>();
        values.add(1);
        values.add(2);
        values.add(3);
        values.add(4);
        
        // Get iterator
        Iterator<Integer> iterator = values.iterator();
        
        // Iterate using iterator
        while (iterator.hasNext()) {
            Integer value = iterator.next();
            System.out.println(value);
            
            // Remove element 3 while iterating
            if (value == 3) {
                iterator.remove();  // Safe removal during iteration
            }
        }
        
        // Check remaining elements
        System.out.println("After removal:");
        for (Integer val : values) {
            System.out.println(val);  // Prints: 1, 2, 4
        }
    }
}
```

**Output:**
```
1
2
3
4
After removal:
1
2
4
```

**Flow Diagram:**
```
Collection: [1, 2, 3, 4]
     │
     ▼
Get Iterator
     │
     ▼
hasNext()? → Yes
     │
     ▼
next() → Returns 1
     │
     ▼
Process 1
     │
     ▼
hasNext()? → Yes
     │
     ▼
next() → Returns 2
     │
     ▼
Process 2
     │
     ▼
hasNext()? → Yes
     │
     ▼
next() → Returns 3
     │
     ▼
Process 3
     │
     ▼
remove() → Removes 3
     │
     ▼
hasNext()? → Yes
     │
     ▼
next() → Returns 4
     │
     ▼
Process 4
     │
     ▼
hasNext()? → No → Exit
```

#### Method 2: Enhanced For Loop (For-Each)

**Syntax:**
```java
for (Type element : collection) {
    // Process element
}
```

**Example:**
```java
List<Integer> values = new ArrayList<>();
values.add(1);
values.add(2);
values.add(4);

// Enhanced for loop
for (Integer value : values) {
    System.out.println(value);
}
```

**Output:**
```
1
2
4
```

**Key Point:** Any collection implementing `Iterable` can use enhanced for loop.

#### Method 3: ForEach Method (Java 1.8+)

**Syntax:**
```java
collection.forEach(element -> {
    // Process element
});
```

**Example:**
```java
List<Integer> values = new ArrayList<>();
values.add(1);
values.add(2);
values.add(4);

// Using forEach with lambda expression
values.forEach(value -> System.out.println(value));

// Or using method reference
values.forEach(System.out::println);
```

**Output:**
```
1
2
4
```

**How It Works:**
- `forEach()` accepts a **Consumer** (functional interface)
- **Lambda expression** is passed as Consumer
- For each element, lambda expression is invoked

**Internal Flow:**
```
values.forEach(lambda)
     │
     ▼
For each element in values:
     │
     ├─ Element 1 → Invoke lambda(1) → Print 1
     ├─ Element 2 → Invoke lambda(2) → Print 2
     └─ Element 4 → Invoke lambda(4) → Print 4
```

### Comparison: Three Iteration Methods

| Method | When Added | Use Case | Can Remove? |
|--------|------------|----------|-------------|
| **Iterator** | Java 1.5 | Need to remove during iteration | ✅ Yes |
| **Enhanced For Loop** | Java 1.5 | Simple iteration | ❌ No |
| **forEach()** | Java 1.8 | Functional style, lambda | ❌ No |

### Historical Note

**Question:** Iterator was added in Java 1.5, but Collection was in Java 1.2. How did we iterate before?

**Answer:**
- **Iterator object** was already present in Java 1.2 (in Collection interface)
- **Iterable interface** was added in Java 1.5 to expose iterator at root level
- **forEach()** was added in Java 1.8 for functional programming

---

## Collection Interface

### Purpose

**Collection** interface represents a **group of objects** and provides methods to work with them.

**Key Points:**
- **Added in:** Java 1.2
- **Extends:** Iterable
- **Parent of:** List, Set, Queue
- **Provides:** Common methods for all collections

### Common Methods

**Most Frequently Used Methods:**

| Method | Return Type | Description | Java Version |
|--------|-------------|-------------|--------------|
| `size()` | `int` | Returns number of elements | 1.2 |
| `isEmpty()` | `boolean` | Checks if collection is empty | 1.2 |
| `contains(Object)` | `boolean` | Searches for element | 1.2 |
| `add(Object)` | `boolean` | Adds element | 1.2 |
| `remove(Object)` | `boolean` | Removes element | 1.2 |
| `clear()` | `void` | Removes all elements | 1.2 |
| `toArray()` | `Object[]` | Converts to array | 1.2 |
| `addAll(Collection)` | `boolean` | Adds all elements from another collection | 1.2 |
| `removeAll(Collection)` | `boolean` | Removes all elements present in parameter | 1.2 |
| `containsAll(Collection)` | `boolean` | Checks if all elements of parameter are present | 1.2 |
| `equals(Object)` | `boolean` | Checks if two collections are equal | 1.2 |
| `iterator()` | `Iterator` | Returns iterator | 1.2 |
| `stream()` | `Stream` | Returns stream (for processing) | 1.8 |
| `parallelStream()` | `Stream` | Returns parallel stream | 1.8 |

### Detailed Examples

#### Example 1: Basic Operations

```java
import java.util.*;

public class CollectionExample {
    public static void main(String[] args) {
        // Create collection
        List<Integer> values = new ArrayList<>();
        
        // Add elements
        values.add(2);
        values.add(3);
        values.add(4);
        
        // Size
        System.out.println("Size: " + values.size());  // 3
        
        // Is Empty
        System.out.println("Is Empty: " + values.isEmpty());  // false
        
        // Contains
        System.out.println("Contains 5: " + values.contains(5));  // false
        
        // Add element
        values.add(5);
        System.out.println("Contains 5: " + values.contains(5));  // true
        
        // Remove by index (List specific)
        values.remove(3);  // Removes element at index 3 (value 5)
        System.out.println("After remove(3): " + values);  // [2, 3, 4]
        
        // Remove by object
        values.remove(Integer.valueOf(3));  // Removes value 3
        System.out.println("After remove(3): " + values);  // [2, 4]
    }
}
```

**Output:**
```
Size: 3
Is Empty: false
Contains 5: false
Contains 5: true
After remove(3): [2, 3, 4]
After remove(3): [2, 4]
```

**Note:** In List, `remove(int)` removes by index, `remove(Object)` removes by value.

#### Example 2: Collection Operations

```java
import java.util.*;

public class CollectionOperationsExample {
    public static void main(String[] args) {
        // First collection
        List<Integer> values = new ArrayList<>();
        values.add(2);
        values.add(4);
        
        // Second collection
        Stack<Integer> stackValues = new Stack<>();
        stackValues.add(6);
        stackValues.add(7);
        stackValues.add(8);
        
        // Add all - Insert one collection into another
        values.addAll(stackValues);
        System.out.println("After addAll: " + values);  // [2, 4, 6, 7, 8]
        
        // Contains all - Check if all elements present
        System.out.println("Contains all stackValues: " + 
            values.containsAll(stackValues));  // true
        
        // Remove one element
        values.remove(Integer.valueOf(7));
        System.out.println("After removing 7: " + values);  // [2, 4, 6, 8]
        
        // Contains all again
        System.out.println("Contains all stackValues: " + 
            values.containsAll(stackValues));  // false (7 is missing)
        
        // Remove all - Remove all elements present in parameter
        values.removeAll(stackValues);
        System.out.println("After removeAll: " + values);  // [2, 4]
        
        // Clear - Remove all elements
        values.clear();
        System.out.println("After clear: " + values);  // []
        System.out.println("Is Empty: " + values.isEmpty());  // true
    }
}
```

**Output:**
```
After addAll: [2, 4, 6, 7, 8]
Contains all stackValues: true
After removing 7: [2, 4, 6, 8]
Contains all stackValues: false
After removeAll: [2, 4]
After clear: []
Is Empty: true
```

#### Example 3: Convert to Array

```java
import java.util.*;

public class ToArrayExample {
    public static void main(String[] args) {
        List<Integer> values = new ArrayList<>();
        values.add(1);
        values.add(2);
        values.add(3);
        
        // Convert to array
        Object[] array = values.toArray();
        
        // Print array
        for (Object obj : array) {
            System.out.println(obj);
        }
        
        // Convert to typed array
        Integer[] intArray = values.toArray(new Integer[0]);
        System.out.println("Typed array: " + Arrays.toString(intArray));
    }
}
```

**Output:**
```
1
2
3
Typed array: [1, 2, 3]
```

### Key Benefits of Collection Interface

1. **Common Methods:** All collections use same methods
2. **Easy to Remember:** One API for all collections
3. **Polymorphism:** Can use Collection reference for any implementation
4. **Extensibility:** Easy to add new collection types

**Example - Polymorphism:**
```java
// Use Collection interface reference
Collection<Integer> collection;

// Can hold any collection
collection = new ArrayList<>();     // List
collection = new HashSet<>();       // Set
collection = new PriorityQueue<>(); // Queue

// Same methods work for all
collection.add(1);
collection.remove(1);
collection.size();
```

---

## Collections Utility Class

### Purpose

**Collections** (with 's') is a **utility class** that provides **static methods** to operate on collections.

**Key Points:**
- **Class** (not interface)
- **All methods are static** (utility class)
- **Helper methods** for common operations
- **Not part of collection hierarchy** - Just helper methods

### Common Methods

**Most Frequently Used Methods:**

| Method | Description |
|--------|-------------|
| `sort(List)` | Sorts list in ascending order |
| `reverse(List)` | Reverses order of elements |
| `shuffle(List)` | Randomly shuffles elements |
| `swap(List, i, j)` | Swaps elements at positions i and j |
| `binarySearch(List, key)` | Searches element using binary search |
| `max(Collection)` | Returns maximum element |
| `min(Collection)` | Returns minimum element |
| `copy(dest, src)` | Copies elements from src to dest |
| `rotate(List, distance)` | Rotates list by specified distance |
| `frequency(Collection, obj)` | Returns frequency of element |
| `disjoint(c1, c2)` | Returns true if collections have no common elements |

### Examples

#### Example 1: Basic Utility Methods

```java
import java.util.*;

public class CollectionsUtilityExample {
    public static void main(String[] args) {
        List<Integer> values = new ArrayList<>();
        values.add(3);
        values.add(1);
        values.add(4);
        values.add(2);
        
        System.out.println("Original: " + values);  // [3, 1, 4, 2]
        
        // Max
        System.out.println("Max: " + Collections.max(values));  // 4
        
        // Min
        System.out.println("Min: " + Collections.min(values));  // 1
        
        // Sort
        Collections.sort(values);
        System.out.println("After sort: " + values);  // [1, 2, 3, 4]
        
        // Reverse
        Collections.reverse(values);
        System.out.println("After reverse: " + values);  // [4, 3, 2, 1]
        
        // Shuffle
        Collections.shuffle(values);
        System.out.println("After shuffle: " + values);  // Random order
        
        // Binary Search (list must be sorted)
        Collections.sort(values);
        int index = Collections.binarySearch(values, 3);
        System.out.println("Index of 3: " + index);  // 2
    }
}
```

**Output:**
```
Original: [3, 1, 4, 2]
Max: 4
Min: 1
After sort: [1, 2, 3, 4]
After reverse: [4, 3, 2, 1]
After shuffle: [2, 1, 4, 3]  (random)
Index of 3: 2
```

#### Example 2: Advanced Operations

```java
import java.util.*;

public class CollectionsAdvancedExample {
    public static void main(String[] args) {
        List<Integer> list1 = new ArrayList<>();
        list1.add(1);
        list1.add(2);
        list1.add(3);
        
        List<Integer> list2 = new ArrayList<>();
        list2.add(4);
        list2.add(5);
        
        // Disjoint - Check if collections have no common elements
        System.out.println("Disjoint: " + 
            Collections.disjoint(list1, list2));  // true
        
        // Frequency - Count occurrences
        list1.add(2);
        System.out.println("Frequency of 2: " + 
            Collections.frequency(list1, 2));  // 2
        
        // Rotate - Rotate by distance
        System.out.println("Before rotate: " + list1);  // [1, 2, 3, 2]
        Collections.rotate(list1, 2);
        System.out.println("After rotate(2): " + list1);  // [3, 2, 1, 2]
        
        // Swap
        Collections.swap(list1, 0, 1);
        System.out.println("After swap(0,1): " + list1);  // [2, 3, 1, 2]
    }
}
```

**Output:**
```
Disjoint: true
Frequency of 2: 2
Before rotate: [1, 2, 3, 2]
After rotate(2): [3, 2, 1, 2]
After swap(0,1): [2, 3, 1, 2]
```

### Key Points

1. **Static Methods:** All methods are static - call with class name
2. **Utility Class:** Not part of collection hierarchy
3. **Helper Methods:** Makes common operations easier
4. **No Object Needed:** Can't instantiate Collections class

---

## Collection vs Collections

### Comparison Table

| Feature | Collection (no 's') | Collections (with 's') |
|---------|---------------------|------------------------|
| **Type** | Interface | Class |
| **Part of Framework?** | ✅ Yes (core interface) | ❌ No (utility class) |
| **Methods** | Instance methods | Static methods |
| **Usage** | `collection.method()` | `Collections.method()` |
| **Purpose** | Define collection operations | Provide utility operations |
| **Extends** | Iterable | Object |
| **Java Version** | 1.2 | 1.2 |

### Visual Comparison

```
Collection (Interface)
     │
     ├─ Defines what collections can do
     ├─ add(), remove(), size(), etc.
     └─ Implemented by: ArrayList, HashSet, etc.

Collections (Class)
     │
     ├─ Provides helper methods
     ├─ sort(), max(), min(), etc.
     └─ Static methods - no object needed
```

### Examples

**Collection (Interface):**
```java
Collection<Integer> collection = new ArrayList<>();
collection.add(1);        // Instance method
collection.size();       // Instance method
collection.remove(1);    // Instance method
```

**Collections (Class):**
```java
List<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);

Collections.sort(list);           // Static method
int max = Collections.max(list);  // Static method
Collections.reverse(list);        // Static method
```

---

## Summary

### Key Concepts

1. **Collection Framework:**
   - Unified architecture for managing groups of objects
   - Added in Java 1.2
   - Package: `java.util`

2. **Why Needed:**
   - Solves problem of no common interface
   - Provides consistent API
   - Easy to remember and use

3. **Hierarchy:**
   - **Iterable** (root) → **Collection** → **List/Set/Queue**
   - **Map** (separate, not part of Collection)

4. **Iterable:**
   - Used to traverse collections
   - Three ways: Iterator, Enhanced For Loop, forEach()

5. **Collection:**
   - Common interface for all collections
   - Provides methods: add(), remove(), size(), contains(), etc.

6. **Collections:**
   - Utility class with static methods
   - Helper methods: sort(), max(), min(), reverse(), etc.

### Benefits of Collection Framework

✅ **Common Interface** - Same methods for all collections  
✅ **Consistent API** - Easy to learn and remember  
✅ **Extensible** - Can create custom collections  
✅ **Rich Functionality** - Built-in operations (sort, search, etc.)  
✅ **Type Safety** - Generics support  
✅ **Performance** - Optimized implementations  

### Next Steps

In upcoming notes, we'll cover:
- **List** implementations (ArrayList, LinkedList, Vector, Stack)
- **Set** implementations (HashSet, LinkedHashSet, TreeSet)
- **Queue** implementations (PriorityQueue, ArrayDeque)
- **Map** implementations (HashMap, LinkedHashMap, TreeMap, Hashtable)
- **Streams** (Java 1.8) - Advanced processing

---

## Practice Exercises

1. Create a collection and demonstrate all Collection interface methods.

2. Use Iterator to iterate and remove elements conditionally.

3. Compare three iteration methods (Iterator, Enhanced For, forEach).

4. Use Collections utility class to sort, reverse, and find max/min.

5. Explain the difference between Collection and Collections.

---

## Interview Questions

1. **What is Java Collection Framework?**  
   Unified architecture for managing groups of objects, added in Java 1.2.

2. **Why do we need Collection Framework?**  
   Provides common interface, consistent API, eliminates need to remember different methods for different collections.

3. **What is the difference between Collection and Collections?**  
   Collection is an interface (part of framework). Collections is a utility class with static methods.

4. **What is Iterable interface?**  
   Root interface for all collections, used to traverse collections. Added in Java 1.5.

5. **How many ways to iterate a collection?**  
   Three: Iterator, Enhanced For Loop, forEach() method.

6. **What is Iterator?**  
   Object returned by iterator() method, provides hasNext(), next(), remove() methods.

7. **Can we remove elements during iteration?**  
   Yes, using Iterator's remove() method. Not safe with enhanced for loop.

8. **What is the root interface of Collection Framework?**  
   Iterable (for collections). Map is separate.

9. **Is Map part of Collection?**  
   No, Map is separate. It doesn't extend Collection or Iterable.

10. **What are the main interfaces in Collection Framework?**  
    Collection, List, Set, Queue (all extend Collection). Map is separate.

11. **What is Collections utility class?**  
    Class with static methods to operate on collections (sort, max, min, reverse, etc.).

12. **When was Collection Framework added?**  
    Java 1.2 (1998).

13. **What is forEach() method?**  
    Method in Iterable (Java 1.8) that iterates using lambda expression (functional interface).

14. **What is the package for Collection Framework?**  
    `java.util`

15. **Why Map is not part of Collection?**  
    Map stores key-value pairs (different structure), while Collection stores single elements.

