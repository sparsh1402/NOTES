# Java Queue, PriorityQueue, Comparator, and Comparable

## Table of Contents
- [Queue Interface](#queue-interface)
- [PriorityQueue](#priorityqueue)
- [Comparator](#comparator)
- [Comparable](#comparable)
- [Comparator vs Comparable](#comparator-vs-comparable)
- [Summary](#summary)

---

## Queue Interface

### What is a Queue?

**Queue** is a data structure that follows **FIFO (First In First Out)** principle.

**Real-world Example:** People standing in a line (queue) at a movie theater:
- New person joins at the **rear** (end)
- Person gets ticket from the **front** (beginning)

**Visual Representation:**
```
Queue Structure:
┌─────────────────────────────────┐
│  Front  →  [1] [2] [3] [4]  ←  Rear │
└─────────────────────────────────┘
     ↑                    ↑
  Remove              Add here
```

### Queue Interface

**Queue** is an **interface** that extends **Collection** interface.

**Key Points:**
- Child of Collection interface
- Generally follows FIFO approach (exceptions: PriorityQueue)
- Supports all Collection methods **plus** 6 additional methods

### Queue Methods

**Queue provides 6 additional methods:**

| Method | Return Type | Description | Exception Behavior |
|--------|-------------|-------------|-------------------|
| `add(E e)` | `boolean` | Inserts element | Throws exception if fails |
| `offer(E e)` | `boolean` | Inserts element | Returns false if fails |
| `poll()` | `E` | Retrieves and removes head | Returns null if empty |
| `remove()` | `E` | Retrieves and removes head | Throws exception if empty |
| `peek()` | `E` | Retrieves head (doesn't remove) | Returns null if empty |
| `element()` | `E` | Retrieves head (doesn't remove) | Throws exception if empty |

### Method Comparison

#### Add vs Offer

**Both insert elements, but handle failures differently:**

```java
Queue<Integer> queue = new LinkedList<>();

// add() - Throws exception on failure
queue.add(5);        // ✅ Success
queue.add(null);     // ❌ NullPointerException (null not allowed)

// offer() - Returns false on failure
queue.offer(5);      // ✅ Returns true
queue.offer(null);   // ❌ Returns false (null not allowed)
```

**Key Difference:**
- `add()`: Throws exception if insertion fails
- `offer()`: Returns `false` if insertion fails

#### Poll vs Remove

**Both retrieve and remove head element:**

```java
Queue<Integer> queue = new LinkedList<>();
queue.add(1);
queue.add(2);

// poll() - Returns null if empty
int value1 = queue.poll();  // Returns 1, queue: [2]
int value2 = queue.poll();  // Returns 2, queue: []
int value3 = queue.poll();  // Returns null (empty)

// remove() - Throws exception if empty
Queue<Integer> queue2 = new LinkedList<>();
queue2.add(1);
int val1 = queue2.remove();  // Returns 1
int val2 = queue2.remove();  // ❌ NoSuchElementException (empty)
```

**Key Difference:**
- `poll()`: Returns `null` if queue is empty
- `remove()`: Throws `NoSuchElementException` if queue is empty

#### Peek vs Element

**Both retrieve head without removing:**

```java
Queue<Integer> queue = new LinkedList<>();
queue.add(1);
queue.add(2);

// peek() - Returns null if empty
int head1 = queue.peek();  // Returns 1, queue: [1, 2] (unchanged)
queue.clear();
int head2 = queue.peek();  // Returns null (empty)

// element() - Throws exception if empty
Queue<Integer> queue2 = new LinkedList<>();
queue2.add(1);
int head3 = queue2.element();  // Returns 1
queue2.clear();
int head4 = queue2.element();  // ❌ NoSuchElementException (empty)
```

**Key Difference:**
- `peek()`: Returns `null` if queue is empty
- `element()`: Throws `NoSuchElementException` if queue is empty

### Queue Hierarchy

```
Collection (Interface)
     │
     │ extends
     │
Queue (Interface)
     │
     │ implements
     │
PriorityQueue (Class)
ArrayDeque (Class)
LinkedList (Class)
```

---

## PriorityQueue

### What is PriorityQueue?

**PriorityQueue** is a special type of queue where elements are ordered by **priority** (not FIFO).

**Key Points:**
- **Two types:** Min Priority Queue (Min Heap) and Max Priority Queue (Max Heap)
- **Internal Structure:** Uses **heap data structure**
- **Ordering:** By natural ordering (default) or by Comparator

### Min Priority Queue (Min Heap)

**Default behavior** - Smallest element has highest priority.

**Visual Representation:**
```
Min Heap Structure:
          1
         / \
        2   8
       / \
      5   (empty)

Level Order: 1, 2, 8, 5
```

**Example:**
```java
import java.util.*;

public class MinPriorityQueueExample {
    public static void main(String[] args) {
        // Min Priority Queue (default)
        PriorityQueue<Integer> minPQ = new PriorityQueue<>();
        
        // Add elements
        minPQ.add(5);
        minPQ.add(2);
        minPQ.add(8);
        minPQ.add(1);
        
        // Print (level order traversal)
        System.out.println("Min Priority Queue: " + minPQ);
        // Output: [1, 2, 8, 5]
        
        // Remove elements (always removes minimum)
        while (!minPQ.isEmpty()) {
            System.out.print(minPQ.poll() + " ");  // 1 2 5 8
        }
    }
}
```

**Output:**
```
Min Priority Queue: [1, 2, 8, 5]
1 2 5 8
```

**How It Works:**
1. Elements stored in **min heap** structure
2. **Smallest element** always at root (head)
3. When you `poll()`, you get the **minimum** element
4. After removal, heap reorganizes (heapify)

### Max Priority Queue (Max Heap)

**Requires Comparator** - Largest element has highest priority.

**Visual Representation:**
```
Max Heap Structure:
          8
         / \
        5   2
       / \
      1   (empty)

Level Order: 8, 5, 2, 1
```

**Example:**
```java
import java.util.*;

public class MaxPriorityQueueExample {
    public static void main(String[] args) {
        // Max Priority Queue (using Comparator)
        PriorityQueue<Integer> maxPQ = new PriorityQueue<>((a, b) -> b - a);
        
        // Add elements
        maxPQ.add(5);
        maxPQ.add(2);
        maxPQ.add(8);
        maxPQ.add(1);
        
        // Print (level order traversal)
        System.out.println("Max Priority Queue: " + maxPQ);
        // Output: [8, 5, 2, 1]
        
        // Remove elements (always removes maximum)
        while (!maxPQ.isEmpty()) {
            System.out.print(maxPQ.poll() + " ");  // 8 5 2 1
        }
    }
}
```

**Output:**
```
Max Priority Queue: [8, 5, 2, 1]
8 5 2 1
```

**How to Create Max Priority Queue:**

**Method 1: Using Lambda Expression**
```java
PriorityQueue<Integer> maxPQ = new PriorityQueue<>((a, b) -> b - a);
```

**Method 2: Using Collections.reverseOrder()**
```java
PriorityQueue<Integer> maxPQ = new PriorityQueue<>(Collections.reverseOrder());
```

**Method 3: Using Comparator**
```java
PriorityQueue<Integer> maxPQ = new PriorityQueue<>(new Comparator<Integer>() {
    @Override
    public int compare(Integer a, Integer b) {
        return b - a;  // Descending order
    }
});
```

### Natural Ordering

**PriorityQueue orders elements by natural ordering by default:**

- **Integer:** Ascending order (1, 2, 3, ...)
- **String:** Lexicographical order (alphabetical)
- **Custom Objects:** Must implement Comparable or provide Comparator

**Example:**
```java
PriorityQueue<Integer> pq = new PriorityQueue<>();
// Natural ordering for Integer = Ascending (Min Heap)

PriorityQueue<String> pq2 = new PriorityQueue<>();
// Natural ordering for String = Lexicographical (A, B, C, ...)
```

### Time Complexity

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| `add(E e)` | O(log n) | Add element and heapify |
| `peek()` | O(1) | Get head without removing |
| `poll()` | O(log n) | Remove head and heapify |
| `remove(Object)` | O(n) | Remove arbitrary element |
| `contains(Object)` | O(n) | Search for element |

### When to Use PriorityQueue?

✅ **Use PriorityQueue when:**
- Need **heap data structure** functionality
- Want **min/max element** at top
- Solving **DSA problems** requiring heap
- Need **priority-based** ordering

❌ **Don't use PriorityQueue when:**
- Need **FIFO** behavior (use regular Queue)
- Want to maintain **insertion order**
- Need **random access** to elements

---

## Comparator

### What is Comparator?

**Comparator** is a **functional interface** that provides a way to **compare two objects** for sorting.

**Key Points:**
- **Functional Interface** (one abstract method)
- **Method:** `compare(T o1, T o2)`
- **Purpose:** Define custom sorting logic
- **Flexible:** Can create multiple comparators for same class

### Comparator Interface

**Signature:**
```java
@FunctionalInterface
public interface Comparator<T> {
    int compare(T o1, T o2);
}
```

**Return Values:**
- **Positive number** (> 0): `o1 > o2` (swap needed)
- **Zero** (0): `o1 == o2` (no swap)
- **Negative number** (< 0): `o1 < o2` (no swap)

### How Sorting Algorithm Uses Comparator

**Internal Algorithm Logic:**
```java
if (comparator.compare(o1, o2) > 0) {
    // Swap o1 and o2
    swap(o1, o2);
}
```

**Flow Diagram:**
```
Sorting Algorithm
     │
     ▼
Compare two elements
     │
     ▼
Call comparator.compare(o1, o2)
     │
     ├─ > 0 → Swap elements
     ├─ = 0 → No swap
     └─ < 0 → No swap
     │
     ▼
Continue sorting...
```

### Example 1: Sorting Integers in Descending Order

**Problem:** Sort integer array in descending order (default is ascending).

**Solution using Comparator:**
```java
import java.util.*;

public class ComparatorExample1 {
    public static void main(String[] args) {
        Integer[] array = {6, 4, 1, 9, 2, 11};
        
        // Sort in descending order using Comparator
        Arrays.sort(array, (a, b) -> b - a);
        
        System.out.println(Arrays.toString(array));
        // Output: [11, 9, 6, 4, 2, 1]
    }
}
```

**How It Works:**
```
Array: [6, 4, 1, 9, 2, 11]

Compare 6 and 4:
  comparator.compare(6, 4) = 4 - 6 = -2 (< 0)
  No swap (algorithm expects > 0 to swap)

Compare 6 and 9:
  comparator.compare(6, 9) = 9 - 6 = 3 (> 0)
  Swap! Now: [9, 4, 1, 6, 2, 11]

Continue sorting...
Final: [11, 9, 6, 4, 2, 1] (descending)
```

**Note:** For descending order, use `(a, b) -> b - a`  
For ascending order, use `(a, b) -> a - b`

### Example 2: Sorting Custom Objects

**Problem:** Sort Car objects by name.

**Car Class:**
```java
class Car {
    String name;
    String type;
    
    Car(String name, String type) {
        this.name = name;
        this.type = type;
    }
    
    @Override
    public String toString() {
        return name + " (" + type + ")";
    }
}
```

**Solution using Comparator:**
```java
import java.util.*;

public class ComparatorExample2 {
    public static void main(String[] args) {
        Car[] cars = {
            new Car("SUV", "Petrol"),
            new Car("Sedan", "Diesel"),
            new Car("Hatchback", "CNG")
        };
        
        // Sort by name (ascending)
        Arrays.sort(cars, (c1, c2) -> c1.name.compareTo(c2.name));
        
        System.out.println("Sorted by name (ascending):");
        for (Car car : cars) {
            System.out.println(car);
        }
        // Output:
        // Hatchback (CNG)
        // Sedan (Diesel)
        // SUV (Petrol)
        
        // Sort by name (descending)
        Arrays.sort(cars, (c1, c2) -> c2.name.compareTo(c1.name));
        
        System.out.println("\nSorted by name (descending):");
        for (Car car : cars) {
            System.out.println(car);
        }
        // Output:
        // SUV (Petrol)
        // Sedan (Diesel)
        // Hatchback (CNG)
        
        // Sort by type
        Arrays.sort(cars, (c1, c2) -> c1.type.compareTo(c2.type));
        
        System.out.println("\nSorted by type:");
        for (Car car : cars) {
            System.out.println(car);
        }
    }
}
```

### Ways to Implement Comparator

#### Method 1: Lambda Expression (Recommended)

```java
Arrays.sort(array, (a, b) -> b - a);  // Descending
Arrays.sort(array, (a, b) -> a - b);  // Ascending
```

#### Method 2: Anonymous Class

```java
Arrays.sort(array, new Comparator<Integer>() {
    @Override
    public int compare(Integer a, Integer b) {
        return b - a;  // Descending
    }
});
```

#### Method 3: Separate Comparator Class

```java
class DescendingComparator implements Comparator<Integer> {
    @Override
    public int compare(Integer a, Integer b) {
        return b - a;
    }
}

// Usage
Arrays.sort(array, new DescendingComparator());
```

#### Method 4: Method Reference (for existing methods)

```java
Arrays.sort(array, Integer::compareTo);  // Natural ordering
```

### Using Comparator with Collections

**Collections.sort() also accepts Comparator:**
```java
List<Car> carList = new ArrayList<>();
carList.add(new Car("SUV", "Petrol"));
carList.add(new Car("Sedan", "Diesel"));

// Sort using Comparator
Collections.sort(carList, (c1, c2) -> c1.name.compareTo(c2.name));
```

**Note:** `Collections.sort()` internally converts to array and calls `Arrays.sort()`.

### Key Benefits of Comparator

✅ **Flexibility:** Multiple sorting strategies for same class  
✅ **No modification:** Don't need to change original class  
✅ **Reusable:** Can create different comparators for different needs  
✅ **Functional:** Can use lambda expressions  

---

## Comparable

### What is Comparable?

**Comparable** is an **interface** that provides a way to define **natural ordering** for a class.

**Key Points:**
- **Interface** (not functional interface)
- **Method:** `compareTo(T o)`
- **Purpose:** Define default sorting for class
- **Single implementation:** Only one compareTo per class

### Comparable Interface

**Signature:**
```java
public interface Comparable<T> {
    int compareTo(T o);
}
```

**Return Values:**
- **Positive number** (> 0): `this > o` (this comes after o)
- **Zero** (0): `this == o` (equal)
- **Negative number** (< 0): `this < o` (this comes before o)

### How Sorting Algorithm Uses Comparable

**Internal Algorithm Logic:**
```java
if (o1.compareTo(o2) > 0) {
    // Swap o1 and o2
    swap(o1, o2);
}
```

**Flow Diagram:**
```
Sorting Algorithm
     │
     ▼
Compare two elements
     │
     ▼
Call o1.compareTo(o2)
     │
     ├─ > 0 → Swap elements
     ├─ = 0 → No swap
     └─ < 0 → No swap
     │
     ▼
Continue sorting...
```

### Example: Implementing Comparable

**Car Class with Comparable:**
```java
class Car implements Comparable<Car> {
    String name;
    String type;
    
    Car(String name, String type) {
        this.name = name;
        this.type = type;
    }
    
    @Override
    public int compareTo(Car other) {
        // Sort by type (ascending)
        return this.type.compareTo(other.type);
    }
    
    @Override
    public String toString() {
        return name + " (" + type + ")";
    }
}
```

**Usage:**
```java
import java.util.*;

public class ComparableExample {
    public static void main(String[] args) {
        List<Car> cars = new ArrayList<>();
        cars.add(new Car("SUV", "Petrol"));
        cars.add(new Car("Sedan", "Diesel"));
        cars.add(new Car("Hatchback", "CNG"));
        
        // Sort using Comparable (no Comparator needed)
        Collections.sort(cars);
        
        for (Car car : cars) {
            System.out.println(car);
        }
        // Output:
        // Hatchback (CNG)
        // Sedan (Diesel)
        // SUV (Petrol)
        // (Sorted by type: CNG < Diesel < Petrol)
    }
}
```

### Built-in Comparable Examples

**Many Java classes implement Comparable:**

**Integer:**
```java
Integer a = 5;
Integer b = 3;
int result = a.compareTo(b);  // Returns 2 (5 > 3)
```

**String:**
```java
String s1 = "Apple";
String s2 = "Banana";
int result = s1.compareTo(s2);  // Returns negative (Apple < Banana)
```

**Usage:**
```java
Integer[] numbers = {5, 1, 3, 2};
Arrays.sort(numbers);  // Uses Integer's compareTo()
// Result: [1, 2, 3, 5]

String[] words = {"Banana", "Apple", "Cherry"};
Arrays.sort(words);  // Uses String's compareTo()
// Result: ["Apple", "Banana", "Cherry"]
```

### Limitations of Comparable

❌ **Only one sorting strategy** per class  
❌ **Requires modifying** the class  
❌ **Cannot change** sorting order dynamically  
❌ **Less flexible** than Comparator  

---

## Comparator vs Comparable

### Comparison Table

| Feature | Comparator | Comparable |
|---------|------------|------------|
| **Interface Type** | Functional Interface | Regular Interface |
| **Method** | `compare(T o1, T o2)` | `compareTo(T o)` |
| **Parameters** | 2 objects | 1 object (other) |
| **Where Defined** | Separate class or lambda | Inside the class itself |
| **Number of Implementations** | Multiple (unlimited) | One (per class) |
| **Modification Required** | ❌ No (external) | ✅ Yes (modify class) |
| **Flexibility** | ✅ High | ❌ Low |
| **Use Case** | Multiple sorting strategies | Single natural ordering |

### Visual Comparison

```
Comparator:
┌─────────────────────────────────┐
│  External (Separate)            │
│  - Can create multiple          │
│  - No class modification        │
│  - Flexible                     │
└─────────────────────────────────┘

Comparable:
┌─────────────────────────────────┐
│  Internal (In Class)            │
│  - Only one per class           │
│  - Requires class modification  │
│  - Fixed ordering               │
└─────────────────────────────────┘
```

### When to Use Which?

**Use Comparator when:**
- ✅ Need **multiple sorting strategies**
- ✅ **Cannot modify** the class
- ✅ Want **flexibility** in sorting
- ✅ Need **descending order** for built-in types

**Use Comparable when:**
- ✅ Class has **one natural ordering**
- ✅ Can **modify the class**
- ✅ Want **default sorting** behavior
- ✅ Sorting is **core functionality** of class

### Example: Both Approaches

**Using Comparable (Fixed):**
```java
class Car implements Comparable<Car> {
    String name;
    String type;
    
    @Override
    public int compareTo(Car other) {
        return this.name.compareTo(other.name);  // Only by name
    }
}

// Usage
Collections.sort(cars);  // Always sorts by name
```

**Using Comparator (Flexible):**
```java
class Car {
    String name;
    String type;
    // No Comparable implementation
}

// Usage - Multiple ways
Collections.sort(cars, (c1, c2) -> c1.name.compareTo(c2.name));      // By name
Collections.sort(cars, (c1, c2) -> c1.type.compareTo(c2.type));       // By type
Collections.sort(cars, (c1, c2) -> c2.name.compareTo(c1.name));       // By name (descending)
```

### PriorityQueue with Comparator

**Example:**
```java
// Min Priority Queue (default - natural ordering)
PriorityQueue<Integer> minPQ = new PriorityQueue<>();

// Max Priority Queue (using Comparator)
PriorityQueue<Integer> maxPQ = new PriorityQueue<>((a, b) -> b - a);

// Custom Priority Queue (by absolute value)
PriorityQueue<Integer> absPQ = new PriorityQueue<>((a, b) -> 
    Integer.compare(Math.abs(a), Math.abs(b))
);
```

---

## Summary

### Queue Interface

- **FIFO** principle (generally)
- **6 methods:** add/offer, poll/remove, peek/element
- **Exception vs Return:** Some methods throw exceptions, others return null/false

### PriorityQueue

- **Two types:** Min Heap (default) and Max Heap (with Comparator)
- **Uses heap** data structure internally
- **Natural ordering** by default
- **Time complexity:** O(log n) for add/poll, O(1) for peek

### Comparator

- **Functional interface** with `compare(o1, o2)`
- **Flexible:** Multiple comparators per class
- **External:** No need to modify class
- **Use for:** Custom sorting, multiple strategies

### Comparable

- **Interface** with `compareTo(o)`
- **Fixed:** One implementation per class
- **Internal:** Must modify class
- **Use for:** Natural ordering, default sorting

### Key Differences

| Aspect | Comparator | Comparable |
|--------|------------|------------|
| **Flexibility** | High (multiple) | Low (single) |
| **Modification** | Not required | Required |
| **Method** | `compare(o1, o2)` | `compareTo(o)` |
| **Parameters** | 2 | 1 |

---

## Practice Exercises

1. Create a PriorityQueue and demonstrate min and max heap behavior.

2. Sort an array of integers in descending order using Comparator.

3. Create a Student class and sort by different fields (name, age, grade) using Comparator.

4. Implement Comparable for a Person class and sort by age.

5. Use PriorityQueue with custom Comparator to solve: "Find K largest elements".

---

## Interview Questions

1. **What is the difference between add() and offer() in Queue?**  
   `add()` throws exception on failure, `offer()` returns false.

2. **What is the difference between poll() and remove()?**  
   `poll()` returns null if empty, `remove()` throws exception.

3. **What is PriorityQueue?**  
   Queue where elements are ordered by priority (min/max heap).

4. **How to create a Max Priority Queue?**  
   Use Comparator: `new PriorityQueue<>((a, b) -> b - a)`

5. **What is the difference between Comparator and Comparable?**  
   Comparator is external (multiple strategies), Comparable is internal (single strategy).

6. **When to use Comparator vs Comparable?**  
   Use Comparator for flexibility, Comparable for natural ordering.

7. **What data structure does PriorityQueue use?**  
   Heap (min heap by default, max heap with Comparator).

8. **What is the time complexity of PriorityQueue operations?**  
   add/poll: O(log n), peek: O(1), remove arbitrary: O(n)

9. **How does Comparator.compare() work?**  
   Returns positive if o1 > o2 (swap), zero if equal, negative if o1 < o2 (no swap).

10. **How does Comparable.compareTo() work?**  
    Returns positive if this > o (swap), zero if equal, negative if this < o (no swap).

11. **Can a class have multiple Comparators?**  
    Yes, you can create multiple Comparator implementations.

12. **Can a class have multiple Comparable implementations?**  
    No, only one compareTo() method per class.

13. **What is natural ordering?**  
    Default ordering defined by Comparable (e.g., Integer: ascending, String: lexicographical).

14. **How to sort in descending order using Comparator?**  
    Use `(a, b) -> b - a` or `(a, b) -> b.compareTo(a)`

15. **Why is Comparator more flexible than Comparable?**  
    Comparator allows multiple sorting strategies without modifying the class, while Comparable provides only one fixed ordering.

