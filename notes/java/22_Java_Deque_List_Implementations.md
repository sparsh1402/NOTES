# Java Deque, List Implementations (ArrayList, LinkedList, Vector, Stack)

## Table of Contents
- [Deque Interface](#deque-interface)
- [ArrayDeque](#arraydeque)
- [List Interface](#list-interface)
- [ArrayList](#arraylist)
- [LinkedList](#linkedlist)
- [Vector](#vector)
- [Stack](#stack)
- [Comparison Table](#comparison-table)
- [Summary](#summary)

---

## Deque Interface

### What is Deque?

**Deque** stands for **Double Ended Queue**.

**Key Concept:** Addition and removal can be done from **both sides** (front and rear).

**Visual Representation:**
```
Normal Queue (FIFO):
Front → [1] [2] [3] [4] ← Rear
         ↑              ↑
      Remove         Add

Deque (Double Ended):
Front ← [1] [2] [3] [4] → Rear
   ↑                    ↑
Add/Remove          Add/Remove
```

**Key Points:**
- **Extends:** Queue interface
- **Both ends:** Can add/remove from front and rear
- **Flexible:** Can implement both Queue and Stack

### Deque Methods

**Deque provides methods from Collection + Queue + new methods:**

#### Insertion Methods

| Method | Description | Exception Behavior |
|--------|-------------|-------------------|
| `addFirst(E e)` | Add at front | Throws exception if fails |
| `offerFirst(E e)` | Add at front | Returns false if fails |
| `addLast(E e)` | Add at rear | Throws exception if fails |
| `offerLast(E e)` | Add at rear | Returns false if fails |

#### Removal Methods

| Method | Description | Exception Behavior |
|--------|-------------|-------------------|
| `removeFirst()` | Remove from front | Throws exception if empty |
| `pollFirst()` | Remove from front | Returns null if empty |
| `removeLast()` | Remove from rear | Throws exception if empty |
| `pollLast()` | Remove from rear | Returns null if empty |

#### Examine Methods (No Removal)

| Method | Description | Exception Behavior |
|--------|-------------|-------------------|
| `getFirst()` | Get front element | Throws exception if empty |
| `peekFirst()` | Get front element | Returns null if empty |
| `getLast()` | Get rear element | Throws exception if empty |
| `peekLast()` | Get rear element | Returns null if empty |

### Behavior of Queue Methods in Deque

**When using Queue methods on Deque:**
- `add()` → calls `addLast()` (adds at rear)
- `offer()` → calls `offerLast()` (adds at rear)
- `poll()` → calls `pollFirst()` (removes from front)
- `remove()` → calls `removeFirst()` (removes from front)
- `peek()` → calls `peekFirst()` (examines front)

**Result:** Deque behaves like normal Queue when using Queue methods.

### Using Deque as Stack

**Stack operations using Deque:**
- `push(E e)` → calls `addFirst()` (adds at front)
- `pop()` → calls `removeFirst()` (removes from front)

**Example:**
```java
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);  // Add at front
stack.push(2);  // Add at front
stack.push(3);  // Add at front
// Stack: [3, 2, 1] (front to rear)

int top = stack.pop();  // Removes 3 (LIFO)
```

---

## ArrayDeque

### What is ArrayDeque?

**ArrayDeque** is a **concrete class** that implements **Deque** interface.

**Key Points:**
- **Resizable array** implementation
- **No capacity restrictions** (grows as needed)
- **Faster than Stack** and **LinkedList** for stack/queue operations
- **Not thread-safe**

### Example: Using ArrayDeque as Queue

```java
import java.util.*;

public class ArrayDequeQueueExample {
    public static void main(String[] args) {
        Deque<Integer> queue = new ArrayDeque<>();
        
        // Add at rear (Queue behavior)
        queue.addLast(1);
        queue.addLast(5);
        queue.addLast(10);
        // Queue: [1, 5, 10]
        
        // Remove from front
        while (!queue.isEmpty()) {
            System.out.print(queue.removeFirst() + " ");  // 1 5 10
        }
    }
}
```

### Example: Using ArrayDeque as Stack

```java
import java.util.*;

public class ArrayDequeStackExample {
    public static void main(String[] args) {
        Deque<Integer> stack = new ArrayDeque<>();
        
        // Add at front (Stack behavior)
        stack.addFirst(1);
        stack.addFirst(5);
        stack.addFirst(10);
        // Stack: [10, 5, 1] (top to bottom)
        
        // Remove from front (LIFO)
        while (!stack.isEmpty()) {
            System.out.print(stack.removeFirst() + " ");  // 10 5 1
        }
    }
}
```

### Time Complexity

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| **Insertion (front/back)** | **O(1) amortized** | O(n) when resizing |
| **Deletion (front/back)** | **O(1)** | Constant time |
| **Search/Examine** | **O(1)** | Direct access |
| **Space Complexity** | **O(n)** | n elements |

**Amortized O(1) Explanation:**
- Most insertions are O(1)
- When array is full, resize happens (O(n))
- Resize doubles capacity
- Average over many operations: O(1)

**Resize Process:**
```
Initial capacity: 8
When full → resize to 16
When full → resize to 32
Always doubles capacity
```

### ArrayDeque Properties

| Property | Value |
|----------|-------|
| **Thread Safe?** | ❌ No |
| **Maintains Insertion Order?** | ✅ Yes |
| **Null Elements Allowed?** | ❌ No |
| **Initial Capacity** | 8 (default) |
| **Growth Factor** | 2x (doubles) |

### Thread-Safe Version

**ConcurrentLinkedDeque** - Thread-safe version of ArrayDeque

```java
import java.util.concurrent.*;

Deque<Integer> safeDeque = new ConcurrentLinkedDeque<>();
// Thread-safe operations
safeDeque.addFirst(1);
safeDeque.addLast(2);
```

---

## List Interface

### What is List?

**List** is an **ordered collection** where:
- **Duplicate values** can be stored
- **Data can be inserted, removed, or accessed from anywhere** (using index)
- **Index-based** operations (0, 1, 2, ...)

**Key Difference from Queue:**
- **Queue:** Insertion/removal only at start/end
- **List:** Insertion/removal/access from **anywhere** (using index)

**Visual Representation:**
```
List with Index:
Index:  0    1    2    3    4
Value: [10] [20] [30] [40] [50]
        ↑              ↑
    Can access      Can insert/remove
    any index       at any index
```

### List Interface Methods

**List provides Collection methods + new index-based methods:**

#### New Methods in List

| Method | Description |
|--------|-------------|
| `add(int index, E element)` | Insert element at specific index |
| `addAll(int index, Collection)` | Insert collection at specific index |
| `get(int index)` | Get element at index |
| `set(int index, E element)` | Replace element at index |
| `remove(int index)` | Remove element at index |
| `indexOf(Object o)` | Get first occurrence index |
| `lastIndexOf(Object o)` | Get last occurrence index |
| `listIterator()` | Returns ListIterator (bidirectional) |
| `listIterator(int index)` | Returns ListIterator starting at index |
| `subList(int from, int to)` | Get sublist (from inclusive, to exclusive) |
| `sort(Comparator)` | Sort list using Comparator |
| `replaceAll(UnaryOperator)` | Replace all elements using function |

### Example: List Methods

```java
import java.util.*;

public class ListMethodsExample {
    public static void main(String[] args) {
        List<Integer> list1 = new ArrayList<>();
        
        // add(int index, E element)
        list1.add(0, 100);  // Insert at index 0
        list1.add(1, 200);  // Insert at index 1
        list1.add(3, 300);  // Insert at index 3 (shifts right)
        list1.add(2, 300);  // Insert at index 2
        // List: [100, 200, 300, 300]
        
        // addAll(int index, Collection)
        List<Integer> list2 = new ArrayList<>();
        list2.add(400);
        list2.add(500);
        list2.add(600);
        
        list1.addAll(2, list2);  // Insert list2 at index 2
        // List: [100, 200, 400, 500, 600, 300, 300]
        
        // replaceAll(UnaryOperator)
        list1.replaceAll(x -> x * -1);  // Multiply all by -1
        // List: [-100, -200, -400, -500, -600, -300, -300]
        
        // sort(Comparator)
        list1.sort((a, b) -> a - b);  // Ascending order
        // List: [-600, -500, -400, -300, -300, -200, -100]
        
        // get(int index)
        int value = list1.get(2);  // Returns -400
        
        // set(int index, E element) - Replaces, doesn't shift
        list1.set(2, -4000);  // Replaces -400 with -4000
        // List: [-600, -500, -4000, -300, -300, -200, -100]
        
        // remove(int index) - Shifts left
        list1.remove(2);  // Removes -4000, shifts left
        // List: [-600, -500, -300, -300, -200, -100]
        
        // indexOf(Object)
        int index = list1.indexOf(-300);  // Returns 2 (first occurrence)
        
        // lastIndexOf(Object)
        int lastIndex = list1.lastIndexOf(-300);  // Returns 3 (last occurrence)
    }
}
```

### ListIterator

**ListIterator** extends **Iterator** and provides **bidirectional** traversal.

**Additional Methods:**
- `hasPrevious()` - Check if previous element exists
- `previous()` - Get previous element
- `nextIndex()` - Index of next element
- `previousIndex()` - Index of previous element
- `set(E e)` - Replace last returned element
- `add(E e)` - Insert element before next element

**Example:**
```java
import java.util.*;

public class ListIteratorExample {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        list.add(-600);
        list.add(-500);
        list.add(-300);
        list.add(-200);
        list.add(-100);
        
        // Forward traversal
        ListIterator<Integer> iterator = list.listIterator();
        while (iterator.hasNext()) {
            int value = iterator.next();
            System.out.print(value + " ");  // -600 -500 -300 -200 -100
            
            if (value == -200) {
                iterator.add(-50);  // Insert -50 before next element
            }
        }
        
        // Backward traversal
        ListIterator<Integer> backIterator = list.listIterator(list.size());
        while (backIterator.hasPrevious()) {
            int value = backIterator.previous();
            System.out.print(value + " ");  // -100 -50 -200 -300 -500 -600
            
            if (value == -200) {
                backIterator.set(-50);  // Replace -200 with -50
            }
        }
    }
}
```

### SubList

**subList(int fromIndex, int toIndex)** - Returns view of portion of list

**Key Points:**
- `fromIndex` is **inclusive**
- `toIndex` is **exclusive**
- Changes to sublist **reflect in original list** (and vice versa)

**Example:**
```java
List<Integer> list = new ArrayList<>();
list.add(1);
list.add(2);
list.add(3);
list.add(4);
list.add(5);

List<Integer> subList = list.subList(1, 4);  // [2, 3, 4]
subList.add(6);  // Also adds to original list
// Original list: [1, 2, 3, 4, 6, 5]
```

---

## ArrayList

### What is ArrayList?

**ArrayList** is a **resizable array** implementation of List.

**Key Points:**
- **Internal Structure:** Dynamic array
- **Index-based access:** O(1) for get/set
- **Not thread-safe**
- **Maintains insertion order**

### Internal Structure

```
ArrayList Internal:
┌─────────────────────────────────┐
│  Array: [10] [20] [30] [40]    │
│  Index:  0    1    2    3      │
│  Size: 4                        │
│  Capacity: 10 (can grow)        │
└─────────────────────────────────┘
```

### Time Complexity

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| **Insert at end** | **O(1) amortized** | O(n) when resizing |
| **Insert at index** | **O(n)** | Requires shifting |
| **Delete at index** | **O(n)** | Requires shifting |
| **Get/Set by index** | **O(1)** | Direct array access |
| **Search (contains)** | **O(n)** | Linear search |
| **Space Complexity** | **O(n)** | n elements |

### Example

```java
import java.util.*;

public class ArrayListExample {
    public static void main(String[] args) {
        List<Integer> list = new ArrayList<>();
        
        // Add elements
        list.add(1);
        list.add(2);
        list.add(3);
        
        // Insert at index
        list.add(1, 10);  // [1, 10, 2, 3] (shifts right)
        
        // Get element
        int value = list.get(2);  // Returns 2
        
        // Set element (replace)
        list.set(2, 20);  // [1, 10, 20, 3] (no shifting)
        
        // Remove by index
        list.remove(0);  // [10, 20, 3] (shifts left)
        
        // Remove by object
        list.remove(Integer.valueOf(20));  // [10, 3]
    }
}
```

### ArrayList Properties

| Property | Value |
|----------|-------|
| **Thread Safe?** | ❌ No |
| **Maintains Insertion Order?** | ✅ Yes |
| **Null Elements Allowed?** | ✅ Yes |
| **Duplicate Elements Allowed?** | ✅ Yes |
| **Index-based Access?** | ✅ Yes (O(1)) |

### Thread-Safe Version

**CopyOnWriteArrayList** - Thread-safe version

```java
import java.util.concurrent.*;

List<Integer> safeList = new CopyOnWriteArrayList<>();
// Thread-safe operations
safeList.add(1);
safeList.get(0);
```

**How it works:** Creates a new copy of array for each write operation.

---

## LinkedList

### What is LinkedList?

**LinkedList** implements both **List** and **Deque** interfaces.

**Key Points:**
- **Internal Structure:** Doubly linked list
- **Supports both:** List operations (index-based) and Deque operations
- **No shifting:** Faster insertion/deletion than ArrayList
- **Not thread-safe**

### Internal Structure

```
LinkedList Internal:
┌─────────┐    ┌─────────┐    ┌─────────┐
│  Node   │───▶│  Node   │───▶│  Node   │
│ Value: 1│    │ Value: 2│    │ Value: 3│
│ Next: ──┼───▶│ Next: ──┼───▶│ Next:null
│ Prev:null◀───┼─ Prev: ─┼───◀┼─ Prev: ─┼
└─────────┘    └─────────┘    └─────────┘
```

### Time Complexity

| Operation | Time Complexity | Notes |
|-----------|----------------|-------|
| **Insert at start/end** | **O(1)** | Direct linking |
| **Insert at index** | **O(n)** | Need to traverse to index |
| **Delete at start/end** | **O(1)** | Direct unlinking |
| **Delete at index** | **O(n)** | Need to traverse to index |
| **Get/Set by index** | **O(n)** | Need to traverse |
| **Search (contains)** | **O(n)** | Linear search |
| **Space Complexity** | **O(n)** | n nodes |

### Example: LinkedList as List

```java
import java.util.*;

public class LinkedListListExample {
    public static void main(String[] args) {
        List<Integer> list = new LinkedList<>();
        
        // List operations
        list.add(100);
        list.add(1, 200);  // Insert at index 1
        list.get(0);  // Get element at index 0
        
        // Index-based operations work
        list.set(1, 300);  // Replace at index 1
        list.remove(0);  // Remove at index 0
    }
}
```

### Example: LinkedList as Deque

```java
import java.util.*;

public class LinkedListDequeExample {
    public static void main(String[] args) {
        Deque<Integer> deque = new LinkedList<>();
        
        // Deque operations
        deque.addFirst(100);
        deque.addLast(200);
        deque.addLast(300);
        // Deque: [100, 200, 300]
        
        int first = deque.getFirst();  // 100
        int last = deque.getLast();    // 300
        
        deque.removeFirst();  // Removes 100
        deque.removeLast();   // Removes 300
    }
}
```

### LinkedList Properties

| Property | Value |
|----------|-------|
| **Thread Safe?** | ❌ No |
| **Maintains Insertion Order?** | ✅ Yes |
| **Null Elements Allowed?** | ✅ Yes |
| **Duplicate Elements Allowed?** | ✅ Yes |
| **Implements** | List, Deque |

### When to Use LinkedList?

✅ **Use when:**
- Frequent insertion/deletion at start/end
- Don't need random access by index
- Need Deque functionality

❌ **Don't use when:**
- Need frequent random access (use ArrayList)
- Need thread-safety (use Vector or CopyOnWriteArrayList)

---

## Vector

### What is Vector?

**Vector** is a **thread-safe** version of ArrayList.

**Key Points:**
- **Synchronized:** All methods are synchronized
- **Thread-safe:** Safe for multi-threaded environments
- **Less efficient:** Slower than ArrayList (due to synchronization)
- **Legacy class:** Older than ArrayList

### Time Complexity

**Same as ArrayList:**
- Insert at end: O(1) amortized
- Insert at index: O(n)
- Delete: O(n)
- Get/Set: O(1)
- Search: O(n)

### Example

```java
import java.util.*;

public class VectorExample {
    public static void main(String[] args) {
        Vector<Integer> vector = new Vector<>();
        
        // Same methods as ArrayList
        vector.add(1);
        vector.add(2);
        vector.add(3);
        
        vector.get(0);  // Get element
        vector.set(1, 20);  // Set element
        vector.remove(0);  // Remove element
        
        // All methods are synchronized (thread-safe)
    }
}
```

### Vector Properties

| Property | Value |
|----------|-------|
| **Thread Safe?** | ✅ Yes (synchronized) |
| **Maintains Insertion Order?** | ✅ Yes |
| **Null Elements Allowed?** | ✅ Yes |
| **Duplicate Elements Allowed?** | ✅ Yes |
| **Performance** | Slower than ArrayList (synchronization overhead) |

### Why Vector is Slower?

**Synchronization overhead:**
- Every method call acquires/releases lock
- Only one thread can access at a time
- ArrayList has no such overhead

**Modern Alternative:** Use `Collections.synchronizedList()` or `CopyOnWriteArrayList`

---

## Stack

### What is Stack?

**Stack** extends **Vector** and represents **LIFO (Last In First Out)** structure.

**Key Points:**
- **Extends Vector:** Inherits thread-safety
- **LIFO:** Last element added is first removed
- **Operations:** push (add), pop (remove), peek (examine)

### Stack Operations

| Method | Description |
|--------|-------------|
| `push(E e)` | Add element to top |
| `pop()` | Remove and return top element |
| `peek()` | Return top element (without removing) |
| `empty()` | Check if stack is empty |
| `search(Object o)` | Search for element (returns position from top) |

### Visual Representation

```
Stack (LIFO):
     ┌───┐
     │ 4 │ ← Top (Last In, First Out)
     ├───┤
     │ 3 │
     ├───┤
     │ 2 │
     ├───┤
     │ 1 │ ← Bottom
     └───┘

push(5) → [5, 4, 3, 2, 1]
pop() → Returns 5, Stack: [4, 3, 2, 1]
```

### Example

```java
import java.util.*;

public class StackExample {
    public static void main(String[] args) {
        Stack<Integer> stack = new Stack<>();
        
        // Push elements
        stack.push(1);
        stack.push(2);
        stack.push(3);
        stack.push(4);
        // Stack: [1, 2, 3, 4] (bottom to top)
        
        // Peek (examine top)
        int top = stack.peek();  // Returns 4
        
        // Pop (remove top)
        while (!stack.empty()) {
            System.out.print(stack.pop() + " ");  // 4 3 2 1 (LIFO)
        }
    }
}
```

### Time Complexity

| Operation | Time Complexity |
|-----------|----------------|
| **push()** | **O(1)** |
| **pop()** | **O(1)** |
| **peek()** | **O(1)** |
| **search()** | **O(n)** |
| **Space Complexity** | **O(n)** |

### Stack Properties

| Property | Value |
|----------|-------|
| **Thread Safe?** | ✅ Yes (extends Vector) |
| **Maintains Insertion Order?** | ✅ Yes (but LIFO access) |
| **Null Elements Allowed?** | ✅ Yes |
| **Duplicate Elements Allowed?** | ✅ Yes |
| **LIFO?** | ✅ Yes |

### Alternative: ArrayDeque as Stack

**ArrayDeque is faster than Stack:**
```java
Deque<Integer> stack = new ArrayDeque<>();
stack.push(1);  // Faster than Stack.push()
stack.pop();    // Faster than Stack.pop()
```

**Why?** ArrayDeque is not synchronized (faster), Stack extends Vector (synchronized, slower).

---

## Comparison Table

### List Implementations

| Feature | ArrayList | LinkedList | Vector | Stack |
|---------|-----------|------------|--------|-------|
| **Thread Safe?** | ❌ No | ❌ No | ✅ Yes | ✅ Yes |
| **Maintains Order?** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Null Allowed?** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Duplicates?** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Index Access** | ✅ O(1) | ❌ O(n) | ✅ O(1) | ✅ O(1) |
| **Insert at End** | ✅ O(1) | ✅ O(1) | ✅ O(1) | ✅ O(1) |
| **Insert at Index** | ❌ O(n) | ❌ O(n) | ❌ O(n) | ❌ O(n) |
| **Delete** | ❌ O(n) | ❌ O(n) | ❌ O(n) | ✅ O(1) |
| **Implements** | List | List, Deque | List | Vector |

### Deque Implementations

| Feature | ArrayDeque | LinkedList |
|---------|------------|------------|
| **Thread Safe?** | ❌ No | ❌ No |
| **Maintains Order?** | ✅ Yes | ✅ Yes |
| **Null Allowed?** | ❌ No | ✅ Yes |
| **Add First/Last** | ✅ O(1) | ✅ O(1) |
| **Remove First/Last** | ✅ O(1) | ✅ O(1) |
| **Index Access** | ❌ No | ❌ O(n) |
| **Internal Structure** | Resizable Array | Doubly Linked List |

### When to Use Which?

**ArrayList:**
- ✅ Frequent random access by index
- ✅ More reads than writes
- ✅ Single-threaded environment

**LinkedList:**
- ✅ Frequent insertion/deletion at start/end
- ✅ Need Deque functionality
- ✅ Don't need random access

**Vector:**
- ✅ Multi-threaded environment (legacy)
- ⚠️ Prefer CopyOnWriteArrayList or Collections.synchronizedList()

**Stack:**
- ✅ LIFO operations needed
- ⚠️ Prefer ArrayDeque (faster, not synchronized)

**ArrayDeque:**
- ✅ Queue or Stack implementation
- ✅ Better performance than Stack/LinkedList
- ✅ Single-threaded environment

---

## Summary

### Deque Interface

- **Double Ended Queue** - Add/remove from both ends
- **12 new methods** - addFirst/Last, removeFirst/Last, getFirst/Last, etc.
- **Can implement Stack** - Using addFirst/removeFirst
- **Can implement Queue** - Using addLast/removeFirst

### ArrayDeque

- **Resizable array** implementation
- **O(1) amortized** for insertion/deletion
- **Not thread-safe**
- **Faster** than Stack and LinkedList

### List Interface

- **Ordered collection** with duplicates
- **Index-based** operations (0, 1, 2, ...)
- **Bidirectional iteration** (ListIterator)
- **Sublist views** (changes reflect in original)

### ArrayList

- **Dynamic array** implementation
- **O(1) index access**, O(n) insertion/deletion at index
- **Not thread-safe**
- **Best for** random access

### LinkedList

- **Doubly linked list** implementation
- **O(1) insertion/deletion** at start/end
- **O(n) index access**
- **Implements** both List and Deque

### Vector

- **Thread-safe** ArrayList
- **Synchronized** methods
- **Slower** than ArrayList
- **Legacy class**

### Stack

- **LIFO** structure
- **Extends Vector** (thread-safe)
- **Operations:** push, pop, peek
- **Prefer ArrayDeque** for better performance

---

## Practice Exercises

1. Implement a Queue using ArrayDeque.

2. Implement a Stack using ArrayDeque.

3. Compare performance of ArrayList vs LinkedList for different operations.

4. Use ListIterator to traverse list in both directions.

5. Create a sublist and demonstrate that changes reflect in original list.

---

## Interview Questions

1. **What is Deque?**  
   Double Ended Queue - can add/remove from both front and rear.

2. **What is the difference between add() and addFirst() in Deque?**  
   `add()` calls `addLast()` (adds at rear), `addFirst()` adds at front.

3. **How to implement Stack using Deque?**  
   Use `addFirst()` for push and `removeFirst()` for pop.

4. **What is the time complexity of ArrayList operations?**  
   Get/Set: O(1), Insert/Delete at index: O(n), Insert at end: O(1) amortized.

5. **What is the difference between ArrayList and LinkedList?**  
   ArrayList uses array (O(1) index access), LinkedList uses linked list (O(n) index access, O(1) insertion/deletion at ends).

6. **What is the difference between ArrayList and Vector?**  
   Vector is thread-safe (synchronized), ArrayList is not. Vector is slower.

7. **What is ListIterator?**  
   Iterator that supports bidirectional traversal (forward and backward).

8. **What is the difference between add() and set() in List?**  
   `add()` inserts (shifts right), `set()` replaces (no shifting).

9. **What is subList()?**  
   Returns view of portion of list. Changes to sublist reflect in original.

10. **What is the time complexity of LinkedList operations?**  
    Insert/Delete at start/end: O(1), Insert/Delete at index: O(n), Get/Set: O(n).

11. **Is ArrayDeque thread-safe?**  
    No. Use ConcurrentLinkedDeque for thread-safe operations.

12. **What is the difference between Stack and ArrayDeque?**  
    Stack is thread-safe but slower, ArrayDeque is faster but not thread-safe.

13. **What is the default initial capacity of ArrayDeque?**  
    8.

14. **What is the time complexity of ArrayDeque operations?**  
    Insert/Delete at front/back: O(1) amortized, Search: O(n).

15. **When to use ArrayList vs LinkedList?**  
    Use ArrayList for random access, LinkedList for frequent insertion/deletion at ends.

