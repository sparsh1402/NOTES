# Java Threading - Part 5: Atomic Variables and Volatile

## Table of Contents
- [Lock-Based vs Lock-Free Mechanisms](#lock-based-vs-lock-free-mechanisms)
- [Compare and Swap (CAS)](#compare-and-swap-cas)
- [Atomic Variables](#atomic-variables)
- [Volatile Keyword](#volatile-keyword)
- [Atomic vs Volatile](#atomic-vs-volatile)
- [Concurrent Collections](#concurrent-collections)
- [Summary](#summary)

---

## Lock-Based vs Lock-Free Mechanisms

### Two Ways to Achieve Concurrency

**1. Lock-Based Mechanism:**
- Uses locks (synchronized, ReentrantLock, etc.)
- Only one thread executes at a time
- **Slower** (lock overhead)

**2. Lock-Free Mechanism:**
- Uses **CAS (Compare and Swap)** operation
- No locks required
- **Faster** (no lock overhead)

**Important:** Lock-free is **not an alternative** to lock-based. It's for **specific use cases** only.

### When to Use Lock-Free?

**Use lock-free when:**
- **Simple operations:** Read → Modify → Update
- **Example:** `counter++` (increment operation)
- **Not suitable for:** Complex business logic

**Use lock-based when:**
- **Complex operations:** Multiple steps, business logic
- **Example:** Database transactions, complex calculations

---

## Compare and Swap (CAS)

### What is CAS?

**CAS (Compare and Swap)** is a **low-level CPU operation** that provides atomicity.

**Key Points:**
- **CPU-level operation:** Supported by all modern CPUs
- **Atomic:** Single unit operation (no interruption)
- **Works across cores:** Even with multiple CPU cores

### How CAS Works

**CAS Operation has 3 parameters:**
1. **Memory location** (where value is stored)
2. **Expected value** (what we expect current value to be)
3. **New value** (what we want to update to)

**Steps:**
1. **Read** value from memory
2. **Compare** memory value with expected value
3. **If match:** Update memory with new value → **Success**
4. **If no match:** Don't update → **Fail** (retry)

**Visual Flow:**
```
Memory: x = 10

Thread 1: CAS(x, expected=10, new=12)
  Step 1: Read x → 10
  Step 2: Compare 10 == 10? ✅ Match
  Step 3: Update x = 12 → Success

Thread 2: CAS(x, expected=10, new=15)
  Step 1: Read x → 12 (already updated by Thread 1)
  Step 2: Compare 12 == 10? ❌ No match
  Step 3: Don't update → Fail
  Retry: CAS(x, expected=12, new=15)
    Step 1: Read x → 12
    Step 2: Compare 12 == 12? ✅ Match
    Step 3: Update x = 15 → Success
```

### CAS Example (Conceptual)

```java
// Pseudo-code for CAS
boolean CAS(Memory memory, int expected, int newValue) {
    // Step 1: Read from memory
    int currentValue = memory.read();
    
    // Step 2: Compare
    if (currentValue == expected) {
        // Step 3: Update
        memory.write(newValue);
        return true;  // Success
    } else {
        return false;  // Fail (retry needed)
    }
}
```

### ABA Problem

**Problem:** Value changes from A → B → A, but CAS thinks it's still A.

**Example:**
```
Initial: x = 10

Thread 1: CAS(x, expected=10, new=12)
  Reads: x = 10
  (Before updating...)

Thread 2: CAS(x, expected=10, new=15)
  Updates: x = 15

Thread 3: CAS(x, expected=15, new=10)
  Updates: x = 10 (back to original)

Thread 1: Now tries to update
  Compares: 10 == 10? ✅ Match (but value changed!)
  Updates: x = 12 (incorrect - should have failed)
```

**Solution:** Use **version number** or **timestamp** with value.

**With Version:**
```
x = 10, version = 1

Thread 1: CAS(x, expected=(10, version=1), new=12)
  Reads: x = 10, version = 1
  (Before updating...)

Thread 2: Updates: x = 15, version = 2
Thread 3: Updates: x = 10, version = 3

Thread 1: Compares
  Expected: (10, version=1)
  Current: (10, version=3)
  Match? ❌ No (version changed) → Fail correctly
```

---

## Atomic Variables

### What are Atomic Variables?

**Atomic variables** use **CAS operation** internally to provide thread-safe operations **without locks**.

**Java Atomic Classes:**
- `AtomicInteger`
- `AtomicLong`
- `AtomicBoolean`
- `AtomicReference<T>` (for objects)

### Problem Without Atomic

**Example:**
```java
class Counter {
    private int count = 0;
    
    public void increment() {
        count++;  // ❌ Not thread-safe
    }
    
    public int getCount() {
        return count;
    }
}
```

**Why not thread-safe?**
```java
// count++ is actually 3 operations:
// 1. Load count value (read)
// 2. Increment by 1 (modify)
// 3. Store back (write)

// Thread 1: Load count=0, Increment, Store count=1
// Thread 2: Load count=0 (before Thread 1 stores), Increment, Store count=1
// Result: count=1 (should be 2) ❌
```

**Test:**
```java
Counter counter = new Counter();

Thread thread1 = new Thread(() -> {
    for (int i = 0; i < 200; i++) {
        counter.increment();
    }
});

Thread thread2 = new Thread(() -> {
    for (int i = 0; i < 200; i++) {
        counter.increment();
    }
});

thread1.start();
thread2.start();

// Expected: 400
// Actual: ~371 (data loss due to race condition)
```

### Solution: Atomic Variables

**Using AtomicInteger:**
```java
import java.util.concurrent.atomic.AtomicInteger;

class Counter {
    private AtomicInteger count = new AtomicInteger(0);
    
    public void increment() {
        count.incrementAndGet();  // ✅ Thread-safe (uses CAS)
    }
    
    public int getCount() {
        return count.get();
    }
}
```

**How it works internally:**
```java
// AtomicInteger.incrementAndGet() internally does:
public int incrementAndGet() {
    int expected, newValue;
    do {
        expected = this.value;  // Read current value
        newValue = expected + 1;  // Calculate new value
    } while (!CAS(this.value, expected, newValue));  // Retry if fails
    return newValue;
}
```

**Test:**
```java
Counter counter = new Counter();

Thread thread1 = new Thread(() -> {
    for (int i = 0; i < 200; i++) {
        counter.increment();
    }
});

Thread thread2 = new Thread(() -> {
    for (int i = 0; i < 200; i++) {
        counter.increment();
    }
});

thread1.start();
thread2.start();

// Expected: 400
// Actual: 400 ✅ (correct!)
```

### Atomic Variable Methods

**AtomicInteger:**
```java
AtomicInteger atomicInt = new AtomicInteger(0);

// Increment
int value = atomicInt.incrementAndGet();  // ++i
int value = atomicInt.getAndIncrement();  // i++

// Add
int value = atomicInt.addAndGet(5);  // += 5, return new
int value = atomicInt.getAndAdd(5);  // += 5, return old

// Get/Set
int value = atomicInt.get();
atomicInt.set(10);

// Compare and Set
boolean success = atomicInt.compareAndSet(5, 10);
// If current value is 5, set to 10, return true
// Otherwise, return false
```

**AtomicBoolean:**
```java
AtomicBoolean atomicBool = new AtomicBoolean(false);

atomicBool.set(true);
boolean value = atomicBool.get();
boolean success = atomicBool.compareAndSet(false, true);
```

**AtomicReference:**
```java
AtomicReference<String> atomicRef = new AtomicReference<>("Hello");

atomicRef.set("World");
String value = atomicRef.get();
boolean success = atomicRef.compareAndSet("Hello", "World");
```

### When to Use Atomic Variables?

**Use when:**
- **Simple operations:** Read → Modify → Update
- **Examples:** Counter increment, flag toggling, simple state updates
- **Single variable:** One variable operation

**Don't use when:**
- **Complex operations:** Multiple variables, business logic
- **Multiple operations:** Need to update multiple variables atomically

---

## Volatile Keyword

### What is Volatile?

**Volatile** ensures that **read and write operations** happen directly to **main memory** (not CPU cache).

**Purpose:** Make changes visible to all threads immediately.

### CPU Cache Problem

**Without volatile:**
```
CPU Core 1 (Thread 1):
  L1 Cache: x = 11
  Main Memory: x = 10

CPU Core 2 (Thread 2):
  L1 Cache: (empty)
  Reads from Main Memory: x = 10 (stale value!)

Problem: Thread 2 reads old value (10) instead of new value (11)
```

**With volatile:**
```
CPU Core 1 (Thread 1):
  Write directly to Main Memory: x = 11

CPU Core 2 (Thread 2):
  Read directly from Main Memory: x = 11 (correct value!)

Solution: All reads/writes go to main memory
```

### How Volatile Works

**Memory Hierarchy:**
```
CPU Core 1          CPU Core 2
  L1 Cache            L1 Cache
     ↓                   ↓
  L2 Cache (Shared)
     ↓
  Main Memory (RAM)
```

**Without volatile:**
- Write to **L1 Cache** first
- Later sync to main memory
- Other threads may read **stale value** from cache

**With volatile:**
- Write **directly to main memory**
- Read **directly from main memory**
- All threads see **latest value**

### Volatile Example

```java
class SharedData {
    private volatile boolean flag = false;
    
    public void setFlag() {
        flag = true;  // Write directly to main memory
    }
    
    public boolean getFlag() {
        return flag;  // Read directly from main memory
    }
}
```

**Without volatile:**
```java
// Thread 1
flag = true;  // May be cached in L1

// Thread 2 (on different core)
if (flag) {  // May read from cache (stale value: false)
    // May not execute even though flag is true
}
```

**With volatile:**
```java
// Thread 1
flag = true;  // Written directly to main memory

// Thread 2 (on different core)
if (flag) {  // Reads directly from main memory (correct value: true)
    // Executes correctly
}
```

### What Volatile Does NOT Do

**Volatile does NOT:**
- ❌ Provide thread safety for compound operations
- ❌ Make `count++` atomic
- ❌ Prevent race conditions

**Example:**
```java
private volatile int count = 0;

public void increment() {
    count++;  // ❌ Still not thread-safe!
    // Even with volatile, count++ is 3 operations
    // Volatile only ensures visibility, not atomicity
}
```

**Why?**
- `count++` is **3 operations** (read, increment, write)
- Volatile ensures **each operation** goes to main memory
- But **doesn't make the 3 operations atomic**

---

## Atomic vs Volatile

### Key Differences

| Aspect | Atomic | Volatile |
|--------|--------|----------|
| **Thread Safety** | ✅ Yes (atomic operations) | ❌ No (only visibility) |
| **Atomicity** | ✅ Yes (CAS operation) | ❌ No |
| **Compound Operations** | ✅ Safe (count++) | ❌ Not safe (count++) |
| **Performance** | Slower (CAS retry) | Faster (direct memory) |
| **Use Case** | Read-Modify-Write | Simple flag/state |

### Comparison Example

**Volatile (Not Thread-Safe):**
```java
private volatile int count = 0;

public void increment() {
    count++;  // ❌ Not thread-safe
    // Thread 1: Read 0, Increment, Write 1
    // Thread 2: Read 0 (before Thread 1 writes), Increment, Write 1
    // Result: 1 (should be 2)
}
```

**Atomic (Thread-Safe):**
```java
private AtomicInteger count = new AtomicInteger(0);

public void increment() {
    count.incrementAndGet();  // ✅ Thread-safe
    // Uses CAS internally
    // Thread 1: CAS(0, 0, 1) → Success
    // Thread 2: CAS(0, 0, 1) → Fail (value is 1), Retry: CAS(1, 1, 2) → Success
    // Result: 2 ✅
}
```

### When to Use Which?

**Use Atomic when:**
- Need **thread-safe** operations
- **Read-Modify-Write** pattern
- **Examples:** Counter, accumulator

**Use Volatile when:**
- Simple **flag/state** variable
- **Visibility** is main concern
- **No compound operations**
- **Examples:** Stop flag, status flag

---

## Concurrent Collections

### Overview

**Concurrent collections** are thread-safe versions of regular collections.

**How they achieve thread-safety:**
- Some use **locks** (ReentrantLock)
- Some use **lock-free** (CAS operations)

### Collection → Concurrent Collection

| Collection | Thread-Safe Version | Internal Mechanism |
|------------|---------------------|-------------------|
| `ArrayList` | `CopyOnWriteArrayList` | Copy-on-write |
| `LinkedList` | `ConcurrentLinkedDeque` | CAS (lock-free) |
| `HashSet` | `ConcurrentHashMap.newKeySet()` | CAS (lock-free) |
| `HashMap` | `ConcurrentHashMap` | CAS (lock-free) |
| `PriorityQueue` | `PriorityBlockingQueue` | ReentrantLock |
| `Hashtable` | `Hashtable` (already thread-safe) | Synchronized |

### Example: ConcurrentLinkedDeque

**Internal Implementation:**
```java
// When adding element
public boolean add(E e) {
    Node<E> newNode = new Node<>(e);
    while (true) {
        Node<E> last = tail;
        Node<E> next = last.next;
        if (last == tail) {  // Check if tail changed
            if (next == null) {
                // CAS operation
                if (CAS(last.next, null, newNode)) {
                    CAS(tail, last, newNode);  // Update tail
                    return true;
                }
            }
        }
    }
}
```

**Key Point:** Uses **CAS** (lock-free) instead of locks.

### Example: PriorityBlockingQueue

**Internal Implementation:**
```java
// When adding element
public boolean offer(E e) {
    final ReentrantLock lock = this.lock;
    lock.lock();  // Uses ReentrantLock
    try {
        // Add to priority queue
        return queue.offer(e);
    } finally {
        lock.unlock();
    }
}
```

**Key Point:** Uses **ReentrantLock** (lock-based).

---

## Summary

### Lock-Based vs Lock-Free

- **Lock-Based:** Synchronized, ReentrantLock (slower, more flexible)
- **Lock-Free:** CAS operations (faster, specific use cases)

### CAS (Compare and Swap)

- **CPU-level atomic operation**
- **3 steps:** Read, Compare, Update
- **Used by:** Atomic variables, concurrent collections

### Atomic Variables

- **Thread-safe** without locks
- **Uses CAS** internally
- **Use for:** Read-Modify-Write operations
- **Examples:** AtomicInteger, AtomicBoolean, AtomicReference

### Volatile

- **Ensures visibility** (read/write to main memory)
- **Does NOT provide thread safety** for compound operations
- **Use for:** Simple flags/states

### Atomic vs Volatile

- **Atomic:** Thread-safe, atomic operations
- **Volatile:** Visibility only, not thread-safe for compound ops

### Concurrent Collections

- **Thread-safe** collections
- **Some use locks** (PriorityBlockingQueue)
- **Some use CAS** (ConcurrentLinkedDeque, ConcurrentHashMap)

---

## Key Takeaways

1. **CAS** = Compare and Swap (CPU-level atomic operation)
2. **Atomic variables** = Thread-safe using CAS (no locks)
3. **Volatile** = Visibility only (not thread-safe for compound ops)
4. **Use Atomic** for Read-Modify-Write operations
5. **Use Volatile** for simple flags/states

---

## Interview Questions

1. **What is CAS operation?**  
   Compare and Swap - CPU-level atomic operation that reads, compares, and updates value atomically.

2. **What is the difference between Atomic and Volatile?**  
   Atomic provides thread safety (atomicity), Volatile only provides visibility.

3. **Is count++ thread-safe with volatile?**  
   No, volatile only ensures visibility, not atomicity. count++ is 3 operations.

4. **How do Atomic variables work?**  
   They use CAS operation internally - read value, compare with expected, update if match, retry if fail.

5. **What is the ABA problem?**  
   Value changes A→B→A, CAS thinks it's still A. Solved with version numbers.

6. **When to use Atomic variables?**  
   For Read-Modify-Write operations (counters, accumulators) that need thread safety.

7. **When to use Volatile?**  
   For simple flags/states where visibility is main concern, no compound operations.

8. **What is lock-free mechanism?**  
   Achieving concurrency without locks using CAS operations.

9. **How do concurrent collections achieve thread-safety?**  
   Some use locks (ReentrantLock), some use CAS (lock-free).

10. **What is the difference between lock-based and lock-free?**  
    Lock-based uses locks (slower, flexible), lock-free uses CAS (faster, specific use cases).

