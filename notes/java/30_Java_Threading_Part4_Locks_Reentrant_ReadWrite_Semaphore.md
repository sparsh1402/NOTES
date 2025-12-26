# Java Threading - Part 4: Locks (Reentrant, Read-Write, Semaphore, Stamped)

## Table of Contents
- [Introduction to Custom Locks](#introduction-to-custom-locks)
- [Reentrant Lock](#reentrant-lock)
- [Read-Write Lock](#read-write-lock)
- [Stamped Lock](#stamped-lock)
- [Semaphore](#semaphore)
- [Condition for Inter-Thread Communication](#condition-for-inter-thread-communication)
- [Summary](#summary)

---

## Introduction to Custom Locks

### Why Custom Locks?

**Problem with synchronized:**
- Synchronized depends on **object** (monitor lock)
- If threads use **different objects**, synchronized doesn't work
- Need lock that works **independent of objects**

**Example Problem:**
```java
class SharedResource {
    public synchronized void produce() {
        // Critical section
    }
}

// Thread 1 uses object1
SharedResource object1 = new SharedResource();
Thread thread1 = new Thread(() -> object1.produce());

// Thread 2 uses object2 (different object!)
SharedResource object2 = new SharedResource();
Thread thread2 = new Thread(() -> object2.produce());

// Both threads can execute simultaneously ❌
// Because they use different objects (different locks)
```

**Solution:** Use **custom locks** that don't depend on objects.

### Types of Custom Locks

1. **Reentrant Lock** - Basic lock (like synchronized)
2. **Read-Write Lock** - Shared (read) and exclusive (write) locks
3. **Stamped Lock** - Read-write + optimistic locking
4. **Semaphore** - Allows multiple threads (with permit count)

---

## Reentrant Lock

### What is Reentrant Lock?

**Reentrant Lock** is a lock that doesn't depend on objects - it depends on the **lock object itself**.

**Key Point:** Multiple threads can use **different objects** but **same lock object** → only one thread executes.

### How to Use Reentrant Lock

**Steps:**
1. Create `ReentrantLock` object
2. Call `lock()` before critical section
3. Call `unlock()` in `finally` block

**Example:**
```java
import java.util.concurrent.locks.ReentrantLock;

class SharedResource {
    private ReentrantLock lock = new ReentrantLock();
    
    public void produce(ReentrantLock lock) {
        lock.lock();  // Acquire lock
        try {
            System.out.println("Lock acquired by: " + 
                Thread.currentThread().getName());
            Thread.sleep(4000);  // Simulate work
            System.out.println("Lock released by: " + 
                Thread.currentThread().getName());
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();  // Always release in finally
        }
    }
}

public class ReentrantLockExample {
    public static void main(String[] args) {
        SharedResource resource1 = new SharedResource();
        SharedResource resource2 = new SharedResource();
        
        // Same lock object for both threads
        ReentrantLock lock = new ReentrantLock();
        
        Thread thread1 = new Thread(() -> resource1.produce(lock));
        Thread thread2 = new Thread(() -> resource2.produce(lock));
        
        thread1.start();
        thread2.start();
    }
}
```

**Output:**
```
Lock acquired by: Thread-0
(Thread-1 waiting...)
Lock released by: Thread-0
Lock acquired by: Thread-1
Lock released by: Thread-1
```

**Key Points:**
- **Same lock object** → Only one thread executes
- **Different objects** → Still works (unlike synchronized)
- **Must unlock in finally** → Ensures lock is always released

### Reentrant Lock vs Synchronized

| Aspect | Synchronized | Reentrant Lock |
|--------|--------------|----------------|
| **Depends on** | Object | Lock object |
| **Different objects** | ❌ Doesn't work | ✅ Works |
| **Manual unlock** | ❌ Automatic | ✅ Manual (finally) |
| **Try lock** | ❌ No | ✅ Yes (tryLock()) |
| **Fairness** | ❌ No | ✅ Optional |

---

## Read-Write Lock

### What is Read-Write Lock?

**Read-Write Lock** provides two types of locks:
- **Read Lock (Shared Lock):** Multiple threads can acquire simultaneously
- **Write Lock (Exclusive Lock):** Only one thread can acquire

### Shared Lock vs Exclusive Lock

**Shared Lock (Read Lock):**
- **Multiple threads** can acquire simultaneously
- **Only for reading** - cannot modify data
- **Cannot acquire** if write lock is held

**Exclusive Lock (Write Lock):**
- **Only one thread** can acquire
- **Can read and write** data
- **Cannot acquire** if any lock (read or write) is held

**Rules:**
1. **Multiple read locks** → ✅ Allowed
2. **Read lock + Write lock** → ❌ Not allowed
3. **Write lock + Read lock** → ❌ Not allowed
4. **Write lock + Write lock** → ❌ Not allowed

### How to Use Read-Write Lock

**Example:**
```java
import java.util.concurrent.locks.ReadWriteLock;
import java.util.concurrent.locks.ReentrantReadWriteLock;

class SharedResource {
    public void produce(ReadWriteLock lock) {
        lock.readLock().lock();  // Acquire read lock
        try {
            System.out.println("Read lock acquired by: " + 
                Thread.currentThread().getName());
            Thread.sleep(8000);
            // Only read operations here
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.readLock().unlock();
        }
    }
    
    public void consume(ReadWriteLock lock) {
        lock.writeLock().lock();  // Acquire write lock
        try {
            System.out.println("Write lock acquired by: " + 
                Thread.currentThread().getName());
            Thread.sleep(5000);
            // Read and write operations here
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.writeLock().unlock();
        }
    }
}

public class ReadWriteLockExample {
    public static void main(String[] args) {
        SharedResource resource = new SharedResource();
        ReadWriteLock lock = new ReentrantReadWriteLock();
        
        // Multiple threads can acquire read lock
        Thread thread1 = new Thread(() -> resource.produce(lock));
        Thread thread2 = new Thread(() -> resource.produce(lock));
        
        // Only one thread can acquire write lock
        Thread thread3 = new Thread(() -> resource.consume(lock));
        
        thread1.start();
        thread2.start();
        thread3.start();
    }
}
```

**Output:**
```
Read lock acquired by: Thread-0
Read lock acquired by: Thread-1
(Thread-3 waiting for write lock...)
Read lock released by: Thread-0
Read lock released by: Thread-1
Write lock acquired by: Thread-3
Write lock released by: Thread-3
```

### When to Use Read-Write Lock?

**Use when:**
- **Read operations are very high** compared to write operations
- **Example:** 1000 reads, 10 writes
- **Benefit:** Multiple threads can read simultaneously (no blocking)

**Don't use when:**
- Write operations are frequent
- Read and write operations are balanced

---

## Stamped Lock

### What is Stamped Lock?

**Stamped Lock** provides:
1. **Read-Write Lock functionality** (like ReadWriteLock)
2. **Optimistic Locking** (lock-free reads)

### Optimistic Locking

**Concept:** Read without acquiring lock, validate later if write occurred.

**How it works:**
1. **Read data** (no lock) → Get **stamp** (version number)
2. **Perform operations**
3. **Validate stamp** → Check if write occurred
4. **If valid** → Use result
5. **If invalid** → Retry with proper lock

**Visual Flow:**
```
Thread 1: Optimistic Read
  Read data (stamp = 1)
  Perform operations
  Validate stamp → Still 1? ✅ Valid → Use result

Thread 2: Write Lock
  Acquire write lock
  Modify data
  Release lock (stamp = 2)

Thread 1: Optimistic Read (if write happened)
  Read data (stamp = 1)
  Perform operations
  Validate stamp → Now 2? ❌ Invalid → Retry
```

### Stamped Lock Methods

**Read-Write Operations:**
```java
import java.util.concurrent.locks.StampedLock;

StampedLock lock = new StampedLock();

// Read lock
long readStamp = lock.readLock();
try {
    // Read operations
} finally {
    lock.unlockRead(readStamp);  // Pass stamp
}

// Write lock
long writeStamp = lock.writeLock();
try {
    // Write operations
} finally {
    lock.unlockWrite(writeStamp);  // Pass stamp
}
```

**Optimistic Read:**
```java
// Optimistic read (no lock acquired)
long stamp = lock.tryOptimisticRead();

// Perform operations
int value = sharedData;

// Validate stamp
if (!lock.validate(stamp)) {
    // Write occurred - retry with proper lock
    stamp = lock.readLock();
    try {
        value = sharedData;  // Re-read
    } finally {
        lock.unlockRead(stamp);
    }
}
```

**Complete Example:**
```java
import java.util.concurrent.locks.StampedLock;

class SharedResource {
    private int value = 10;
    private StampedLock lock = new StampedLock();
    
    public void optimisticRead() {
        long stamp = lock.tryOptimisticRead();
        int currentValue = value;
        
        try {
            Thread.sleep(6000);  // Simulate work
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Validate stamp
        if (!lock.validate(stamp)) {
            System.out.println("Write occurred - rollback");
            // Retry with proper lock
            stamp = lock.readLock();
            try {
                currentValue = value;  // Re-read
            } finally {
                lock.unlockRead(stamp);
            }
        } else {
            System.out.println("Optimistic read successful: " + currentValue);
        }
    }
    
    public void write() {
        long stamp = lock.writeLock();
        try {
            System.out.println("Write lock acquired");
            value = 20;  // Modify value
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlockWrite(stamp);
            System.out.println("Write lock released");
        }
    }
}
```

**Key Points:**
- **Stamp** = Version number (incremented on write)
- **Optimistic read** = No lock, just get stamp
- **Validate** = Check if write occurred (stamp changed)
- **If invalid** = Retry with proper read lock

---

## Semaphore

### What is Semaphore?

**Semaphore** allows **multiple threads** to acquire lock simultaneously (up to permit count).

**Key Concept:** Instead of "only one thread", semaphore allows "N threads at a time".

### How Semaphore Works

**Permits:**
- **Permit count** = Maximum threads that can acquire lock
- **acquire()** = Get permit (wait if no permit available)
- **release()** = Return permit

**Example:**
```java
import java.util.concurrent.Semaphore;

class SharedResource {
    public void produce(Semaphore semaphore) {
        try {
            semaphore.acquire();  // Get permit
            System.out.println("Lock acquired by: " + 
                Thread.currentThread().getName());
            Thread.sleep(4000);
            System.out.println("Lock released by: " + 
                Thread.currentThread().getName());
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            semaphore.release();  // Return permit
        }
    }
}

public class SemaphoreExample {
    public static void main(String[] args) {
        Semaphore semaphore = new Semaphore(2);  // 2 permits
        SharedResource resource = new SharedResource();
        
        // 4 threads trying to acquire
        for (int i = 0; i < 4; i++) {
            Thread thread = new Thread(() -> resource.produce(semaphore));
            thread.start();
        }
    }
}
```

**Output:**
```
Lock acquired by: Thread-0
Lock acquired by: Thread-1
(Thread-2 and Thread-3 waiting...)
Lock released by: Thread-0
Lock acquired by: Thread-2
Lock released by: Thread-1
Lock acquired by: Thread-3
```

**Flow:**
1. **Thread-0** and **Thread-1** acquire permits (2 permits available)
2. **Thread-2** and **Thread-3** wait (no permits available)
3. **Thread-0** releases permit → **Thread-2** acquires
4. **Thread-1** releases permit → **Thread-3** acquires

### Use Cases for Semaphore

**1. Connection Pool:**
```java
// Only 5 connections available
Semaphore connectionPool = new Semaphore(5);

// Thread acquires connection
connectionPool.acquire();
try {
    // Use connection
} finally {
    connectionPool.release();  // Return connection
}
```

**2. Printer Pool:**
```java
// Only 2 printers available
Semaphore printerPool = new Semaphore(2);

// Thread uses printer
printerPool.acquire();
try {
    // Print document
} finally {
    printerPool.release();
}
```

**3. Rate Limiting:**
```java
// Allow maximum 10 requests per second
Semaphore rateLimiter = new Semaphore(10);
```

---

## Condition for Inter-Thread Communication

### Problem with wait() and notify()

**Issue:** `wait()` and `notify()` work only with **synchronized** (monitor locks).

**Problem:** When using **custom locks** (ReentrantLock, ReadWriteLock), `wait()` and `notify()` don't work.

### Solution: Condition

**Condition** provides `await()` and `signal()` methods for custom locks.

**Comparison:**
| Monitor Lock | Custom Lock |
|--------------|-------------|
| `wait()` | `await()` |
| `notify()` | `signal()` |
| `notifyAll()` | `signalAll()` |

### How to Use Condition

**Example:**
```java
import java.util.concurrent.locks.Condition;
import java.util.concurrent.locks.ReentrantLock;

class SharedResource {
    private boolean itemAvailable = false;
    private ReentrantLock lock = new ReentrantLock();
    private Condition condition = lock.newCondition();
    
    public void addItem() {
        lock.lock();
        try {
            itemAvailable = true;
            System.out.println("Producer: Item added");
            condition.signalAll();  // Notify waiting threads
        } finally {
            lock.unlock();
        }
    }
    
    public void consumeItem() {
        lock.lock();
        try {
            while (!itemAvailable) {
                System.out.println("Consumer: Waiting for item...");
                condition.await();  // Wait (releases lock)
            }
            itemAvailable = false;
            System.out.println("Consumer: Item consumed");
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            lock.unlock();
        }
    }
}

public class ConditionExample {
    public static void main(String[] args) {
        SharedResource resource = new SharedResource();
        
        Thread producer = new Thread(() -> {
            try {
                Thread.sleep(2000);
                resource.addItem();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        
        Thread consumer = new Thread(() -> {
            resource.consumeItem();
        });
        
        producer.start();
        consumer.start();
    }
}
```

**Output:**
```
Consumer: Waiting for item...
(2 seconds wait)
Producer: Item added
Consumer: Item consumed
```

**Key Points:**
- **Create condition:** `lock.newCondition()`
- **await()** = Wait (releases lock, like wait())
- **signal()** = Wake one thread (like notify())
- **signalAll()** = Wake all threads (like notifyAll())
- **Must use with lock:** Only works with custom locks

---

## Summary

### Reentrant Lock

- **Purpose:** Lock independent of objects
- **Use when:** Different objects, same lock needed
- **Methods:** `lock()`, `unlock()`

### Read-Write Lock

- **Purpose:** Multiple reads, exclusive writes
- **Use when:** Read operations >> Write operations
- **Methods:** `readLock()`, `writeLock()`

### Stamped Lock

- **Purpose:** Read-write + optimistic locking
- **Use when:** Need optimistic reads (lock-free)
- **Methods:** `readLock()`, `writeLock()`, `tryOptimisticRead()`, `validate()`

### Semaphore

- **Purpose:** Allow N threads simultaneously
- **Use when:** Limited resources (connections, printers)
- **Methods:** `acquire()`, `release()`

### Condition

- **Purpose:** Inter-thread communication with custom locks
- **Use when:** Using custom locks (not synchronized)
- **Methods:** `await()`, `signal()`, `signalAll()`

---

## Key Takeaways

1. **Reentrant Lock:** Object-independent locking
2. **Read-Write Lock:** Multiple reads, exclusive writes
3. **Stamped Lock:** Optimistic locking support
4. **Semaphore:** N threads at a time
5. **Condition:** wait/notify for custom locks

---

## Interview Questions

1. **What is the difference between synchronized and ReentrantLock?**  
   Synchronized depends on object, ReentrantLock depends on lock object (works with different objects).

2. **What is Read-Write Lock?**  
   Allows multiple read locks simultaneously, but only one write lock (exclusive).

3. **When to use Read-Write Lock?**  
   When read operations are very high compared to write operations.

4. **What is optimistic locking?**  
   Read without lock, validate later if write occurred (using version/stamp).

5. **What is Stamped Lock?**  
   Provides read-write lock functionality plus optimistic locking.

6. **What is Semaphore?**  
   Allows N threads to acquire lock simultaneously (based on permit count).

7. **What is Condition?**  
   Provides await()/signal() for inter-thread communication with custom locks.

8. **Why use Condition instead of wait/notify?**  
   wait/notify only works with synchronized, Condition works with custom locks.

9. **What is the difference between signal() and signalAll()?**  
   signal() wakes one thread, signalAll() wakes all waiting threads.

10. **What is a permit in Semaphore?**  
    Permission to acquire lock. Semaphore has N permits = N threads can acquire simultaneously.

