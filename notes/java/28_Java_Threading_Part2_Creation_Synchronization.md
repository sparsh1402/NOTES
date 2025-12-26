# Java Threading - Part 2: Thread Creation, Synchronization, and Inter-Thread Communication

## Table of Contents
- [Ways to Create Threads](#ways-to-create-threads)
- [Thread Lifecycle Revisited](#thread-lifecycle-revisited)
- [Monitor Locks](#monitor-locks)
- [Synchronization](#synchronization)
- [Inter-Thread Communication](#inter-thread-communication)
- [Wait, Notify, NotifyAll](#wait-notify-notifyall)
- [Producer-Consumer Problem](#producer-consumer-problem)
- [Summary](#summary)

---

## Ways to Create Threads

### Two Ways to Create Threads

**Java provides two ways to create threads:**

1. **Implementing Runnable Interface**
2. **Extending Thread Class**

### Why Two Ways?

**Reason:** Java allows only **single inheritance** but **multiple interface implementation**.

**Scenario:**
```java
// If you already extend a class:
class MyClass extends ParentClass {
    // Cannot extend Thread also
}

// But you can implement Runnable:
class MyClass extends ParentClass implements Runnable {
    // ✅ Allowed
}
```

**Key Point:** If your class already extends another class, you **cannot** extend Thread. But you **can** implement Runnable.

### Method 1: Implementing Runnable Interface

**Runnable Interface:**
```java
@FunctionalInterface
public interface Runnable {
    void run();
}
```

**Thread Class:**
```java
public class Thread implements Runnable {
    private Runnable target;
    
    public Thread(Runnable target) {
        this.target = target;
    }
    
    public void run() {
        if (target != null) {
            target.run();  // Calls runnable's run method
        }
    }
}
```

**Steps to Create Thread Using Runnable:**

1. **Create class implementing Runnable:**
```java
class MyTask implements Runnable {
    @Override
    public void run() {
        System.out.println("Code executed by thread: " + 
            Thread.currentThread().getName());
    }
}
```

2. **Create Runnable object:**
```java
MyTask task = new MyTask();
```

3. **Pass Runnable to Thread constructor:**
```java
Thread thread = new Thread(task);
```

4. **Start the thread:**
```java
thread.start();  // Internally calls run()
```

**Complete Example:**
```java
class MultiThreadingLearning implements Runnable {
    @Override
    public void run() {
        System.out.println("Code executed by thread: " + 
            Thread.currentThread().getName());
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(Thread.currentThread().getName());  // main
        
        // Create Runnable object
        MultiThreadingLearning task = new MultiThreadingLearning();
        
        // Create Thread and pass Runnable
        Thread thread = new Thread(task);
        
        // Start thread
        thread.start();
        
        // Output:
        // main
        // Code executed by thread: Thread-0
    }
}
```

**Using Lambda Expression:**
```java
// Runnable is functional interface, so we can use lambda
Thread thread = new Thread(() -> {
    System.out.println("Code executed by thread: " + 
        Thread.currentThread().getName());
});

thread.start();
```

**How It Works:**
```
1. Thread thread = new Thread(runnableObject)
   → Thread constructor stores runnable in 'target'

2. thread.start()
   → Internally calls run()

3. run() method checks:
   if (target != null) {
       target.run();  // Calls your runnable's run method
   }
```

### Method 2: Extending Thread Class

**Steps to Create Thread by Extending Thread:**

1. **Create class extending Thread:**
```java
class MyThread extends Thread {
    @Override
    public void run() {
        System.out.println("Code executed by thread: " + 
            Thread.currentThread().getName());
    }
}
```

2. **Create Thread object:**
```java
MyThread thread = new MyThread();
```

3. **Start the thread:**
```java
thread.start();  // Directly calls overridden run()
```

**Complete Example:**
```java
class MultiThreadingLearning extends Thread {
    @Override
    public void run() {
        System.out.println("Code executed by thread: " + 
            Thread.currentThread().getName());
    }
}

public class Main {
    public static void main(String[] args) {
        System.out.println(Thread.currentThread().getName());  // main
        
        // Create Thread object
        MultiThreadingLearning thread = new MultiThreadingLearning();
        
        // Start thread
        thread.start();
        
        // Output:
        // main
        // Code executed by thread: Thread-0
    }
}
```

**How It Works:**
```
1. MyThread extends Thread
   → Inherits all Thread methods (start(), run(), etc.)

2. Override run() method
   → Provide your task implementation

3. thread.start()
   → Calls overridden run() method directly
```

### Comparison: Runnable vs Thread

| Aspect | Runnable Interface | Extending Thread |
|--------|-------------------|------------------|
| **Inheritance** | Can extend other class | Cannot extend other class |
| **Flexibility** | More flexible | Less flexible |
| **Industry Standard** | ✅ Preferred | ❌ Not preferred |
| **Code Reusability** | Better | Limited |
| **Object-Oriented** | Better (composition) | Inheritance only |

**Recommendation:** Use **Runnable interface** (industry standard, more flexible).

---

## Thread Lifecycle Revisited

### Detailed State Transitions

**Complete Lifecycle:**
```
        NEW
         │
         │ start()
         ↓
    RUNNABLE ←──────────────────────────────┐
         │                                  │
         │                                  │
    ┌────┴────┬──────────┬──────────────┐   │
    │         │          │              │   │
    ↓         ↓          ↓              ↓   │
BLOCKED  WAITING  TIMED_WAITING    (running)│
    │         │          │              │   │
    │         │          │              │   │
    └────┬────┴────┬─────┘              │   │
         │         │                    │   │
         │         │                    │   │
         └─────────┴────────────────────┘   │
         │                                  │
         │ (completion)                     │
         ↓                                  │
    TERMINATED                              │
                                            │
         (context switching)                │
         └──────────────────────────────────┘
```

### State Details

**NEW:**
- Thread object created: `new Thread()`
- `start()` not called yet
- Just an object in memory

**RUNNABLE:**
- `start()` called
- Thread ready to run or currently running
- Waiting for CPU time or executing

**BLOCKED:**
- Waiting for I/O operation (file read, database query)
- Waiting to acquire lock (synchronized block/method)
- **Releases all monitor locks**

**WAITING:**
- `wait()` method called
- Waiting for `notify()` or `notifyAll()`
- **Releases all monitor locks**

**TIMED_WAITING:**
- `Thread.sleep(time)` called
- Waiting for specific time period
- Automatically returns to RUNNABLE
- **Does NOT release monitor locks**

**TERMINATED:**
- Thread execution completed
- Cannot be restarted

---

## Monitor Locks

### What is Monitor Lock?

**Monitor lock** ensures that **only one thread** can execute a **synchronized section** of code at a time.

**Key Concept:** **Each object has a monitor lock**.

### How Monitor Lock Works

**Visual Representation:**
```
Object: SharedResource
  ┌─────────────────────┐
  │  Monitor Lock       │
  │  (Available/In Use) │
  └─────────────────────┘
```

**When Thread Acquires Lock:**
```
Thread 1 → Acquires Lock on Object
  ┌─────────────────────┐
  │  Monitor Lock: 🔒    │ ← Thread 1 holds lock
  └─────────────────────┘

Thread 2 → Tries to Acquire Lock
  ┌─────────────────────┐
  │  Monitor Lock: 🔒    │ ← Already locked by Thread 1
  └─────────────────────┘
  Thread 2 waits...
```

**When Thread Releases Lock:**
```
Thread 1 → Releases Lock
  ┌─────────────────────┐
  │  Monitor Lock: 🔓    │ ← Available
  └─────────────────────┘

Thread 2 → Acquires Lock
  ┌─────────────────────┐
  │  Monitor Lock: 🔒    │ ← Thread 2 holds lock
  └─────────────────────┘
```

### Example: Monitor Lock

```java
class MonitorLockExample {
    public synchronized void task1() {
        System.out.println("Task 1 started");
        try {
            Thread.sleep(10000);  // Hold lock for 10 seconds
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("Task 1 completed");
    }
    
    public void task2() {
        System.out.println("Task 2: Before synchronized");
        synchronized (this) {
            System.out.println("Task 2: Inside synchronized");
        }
        System.out.println("Task 2 completed");
    }
    
    public void task3() {
        System.out.println("Task 3: No synchronization");
    }
}

public class Main {
    public static void main(String[] args) {
        MonitorLockExample obj = new MonitorLockExample();
        
        // All threads work on same object
        Thread thread1 = new Thread(() -> obj.task1());
        Thread thread2 = new Thread(() -> obj.task2());
        Thread thread3 = new Thread(() -> obj.task3());
        
        thread1.start();
        thread2.start();
        thread3.start();
    }
}
```

**Output:**
```
Task 1 started
Task 2: Before synchronized
Task 3: No synchronization
Task 3 completed
(Thread 2 waiting for lock...)
Task 1 completed
Task 2: Inside synchronized
Task 2 completed
```

**Explanation:**
1. **Thread 1** acquires lock on `obj`, executes `task1()`, holds lock for 10 seconds
2. **Thread 2** tries to acquire lock, but it's held by Thread 1 → **waits**
3. **Thread 3** executes `task3()` (no synchronization) → **executes immediately**
4. After 10 seconds, Thread 1 releases lock
5. Thread 2 acquires lock, executes synchronized block

**Key Points:**
- **Same object:** All threads work on same object → same monitor lock
- **Different methods:** Even different methods share the same lock if same object
- **Different objects:** Different objects have different locks → can execute simultaneously

---

## Synchronization

### What is Synchronization?

**Synchronization** ensures that **only one thread** can access a **critical section** of code at a time.

**Purpose:** Prevent **race conditions** and **data inconsistency**.

### Ways to Synchronize

**1. Synchronized Method:**
```java
public synchronized void method() {
    // Critical section
}
```

**2. Synchronized Block:**
```java
synchronized (object) {
    // Critical section
}
```

### Synchronized Method Example

```java
class Counter {
    private int count = 0;
    
    public synchronized void increment() {
        count++;  // Critical section
    }
    
    public synchronized int getCount() {
        return count;
    }
}
```

**Without Synchronization (Problem):**
```java
// Thread 1: count++ (read count=0, increment, write count=1)
// Thread 2: count++ (read count=0, increment, write count=1)
// Result: count=1 (should be 2) ❌
```

**With Synchronization (Solution):**
```java
// Thread 1: acquires lock, count++ (count=1), releases lock
// Thread 2: waits, acquires lock, count++ (count=2), releases lock
// Result: count=2 ✅
```

### Synchronized Block Example

```java
class SharedResource {
    private Object lock = new Object();
    
    public void method1() {
        synchronized (lock) {
            // Critical section
        }
    }
    
    public void method2() {
        synchronized (this) {  // Lock on current object
            // Critical section
        }
    }
}
```

**Key Points:**
- **Synchronized method:** Locks on `this` (current object)
- **Synchronized block:** Can lock on any object
- **Same object:** Same lock for all synchronized methods/blocks on same object

---

## Inter-Thread Communication

### What is Inter-Thread Communication?

**Inter-thread communication** allows threads to **coordinate** and **communicate** with each other.

**Methods:**
- `wait()` - Makes thread wait
- `notify()` - Wakes up one waiting thread
- `notifyAll()` - Wakes up all waiting threads

**Important:** These methods can only be called from **synchronized** context.

### Wait, Notify, NotifyAll

#### wait()

**Purpose:** Makes current thread **wait** until another thread calls `notify()` or `notifyAll()`.

**Behavior:**
- Thread enters **WAITING** state
- **Releases monitor lock**
- Waits indefinitely until notified

**Syntax:**
```java
synchronized (object) {
    while (condition) {
        object.wait();  // Wait until notified
    }
    // Continue execution
}
```

#### notify()

**Purpose:** Wakes up **one** waiting thread.

**Behavior:**
- Wakes up one thread waiting on same object
- Thread moves from WAITING to RUNNABLE
- Thread must re-acquire lock to continue

**Syntax:**
```java
synchronized (object) {
    // Change condition
    object.notify();  // Wake up one waiting thread
}
```

#### notifyAll()

**Purpose:** Wakes up **all** waiting threads.

**Behavior:**
- Wakes up all threads waiting on same object
- All threads move from WAITING to RUNNABLE
- Threads compete for lock

**Syntax:**
```java
synchronized (object) {
    // Change condition
    object.notifyAll();  // Wake up all waiting threads
}
```

### Example: Wait and Notify

```java
class SharedResource {
    private boolean itemAvailable = false;
    
    public synchronized void addItem() {
        itemAvailable = true;
        System.out.println("Producer: Item added");
        notifyAll();  // Notify waiting consumers
    }
    
    public synchronized void consumeItem() {
        while (!itemAvailable) {
            try {
                System.out.println("Consumer: Waiting for item...");
                wait();  // Wait until item is available
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        itemAvailable = false;
        System.out.println("Consumer: Item consumed");
    }
}

public class Main {
    public static void main(String[] args) {
        SharedResource resource = new SharedResource();
        
        // Producer thread
        Thread producer = new Thread(() -> {
            try {
                Thread.sleep(2000);  // Wait 2 seconds
                resource.addItem();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        });
        
        // Consumer thread
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

**Flow:**
1. **Consumer starts:** Tries to consume, `itemAvailable = false` → calls `wait()`
2. **Consumer waits:** Enters WAITING state, releases lock
3. **Producer starts:** After 2 seconds, calls `addItem()`, sets `itemAvailable = true`, calls `notifyAll()`
4. **Consumer wakes:** Moves to RUNNABLE, re-acquires lock, consumes item

### Why While Loop Instead of If?

**Important:** Always use **while loop** instead of **if condition** for waiting.

**Reason:** **Spurious wakeup** - Thread can wake up even without `notify()`.

**Correct (While Loop):**
```java
synchronized (object) {
    while (!condition) {  // ✅ Check condition again
        wait();
    }
    // Proceed
}
```

**Incorrect (If Condition):**
```java
synchronized (object) {
    if (!condition) {  // ❌ May proceed incorrectly
        wait();
    }
    // Proceed (may be wrong condition)
}
```

**Why While Loop?**
- **Re-check condition:** After wakeup, condition is checked again
- **Prevents spurious wakeup:** Even if thread wakes up incorrectly, condition is re-checked
- **Oracle recommendation:** Always use while loop

---

## Producer-Consumer Problem

### Problem Statement

**Two threads (Producer and Consumer) share a common fixed-size buffer (queue):**

- **Producer:** Generates data and puts it into buffer
- **Consumer:** Consumes data from buffer

**Constraints:**
- Producer **must wait** if buffer is **full**
- Consumer **must wait** if buffer is **empty**

### Solution

```java
import java.util.*;

class SharedBuffer {
    private Queue<Integer> queue;
    private int bufferSize;
    
    public SharedBuffer(int bufferSize) {
        this.queue = new LinkedList<>();
        this.bufferSize = bufferSize;
    }
    
    public synchronized void produce(int item) {
        // Wait if buffer is full
        while (queue.size() == bufferSize) {
            try {
                System.out.println("Producer: Buffer full, waiting...");
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        
        // Add item to buffer
        queue.offer(item);
        System.out.println("Producer: Produced item " + item);
        
        // Notify waiting consumers
        notifyAll();
    }
    
    public synchronized int consume() {
        // Wait if buffer is empty
        while (queue.isEmpty()) {
            try {
                System.out.println("Consumer: Buffer empty, waiting...");
                wait();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        
        // Remove item from buffer
        int item = queue.poll();
        System.out.println("Consumer: Consumed item " + item);
        
        // Notify waiting producers
        notifyAll();
        
        return item;
    }
}

public class ProducerConsumerExample {
    public static void main(String[] args) {
        SharedBuffer buffer = new SharedBuffer(3);  // Buffer size: 3
        
        // Producer thread
        Thread producer = new Thread(() -> {
            for (int i = 1; i <= 6; i++) {
                buffer.produce(i);
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        
        // Consumer thread
        Thread consumer = new Thread(() -> {
            for (int i = 1; i <= 6; i++) {
                buffer.consume();
                try {
                    Thread.sleep(1500);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });
        
        producer.start();
        consumer.start();
    }
}
```

**How It Works:**

1. **Producer produces item:**
   - Checks if buffer is full
   - If full → waits
   - If not full → adds item, notifies consumers

2. **Consumer consumes item:**
   - Checks if buffer is empty
   - If empty → waits
   - If not empty → removes item, notifies producers

3. **Synchronization:**
   - Both methods are `synchronized` → same monitor lock
   - Only one thread can access buffer at a time
   - `wait()` releases lock, `notifyAll()` wakes waiting threads

**Key Points:**
- **Fixed-size buffer:** Queue with maximum capacity
- **Wait when full:** Producer waits if buffer is full
- **Wait when empty:** Consumer waits if buffer is empty
- **Coordination:** `wait()` and `notifyAll()` coordinate threads

---

## Summary

### Thread Creation

**Two Ways:**
1. **Implement Runnable:** More flexible, industry standard
2. **Extend Thread:** Less flexible, single inheritance limitation

**Recommendation:** Use **Runnable interface**.

### Monitor Locks

- **Each object has a monitor lock**
- **Synchronized methods/blocks** acquire lock
- **Only one thread** can hold lock at a time
- **Same object** = same lock (even different methods)

### Synchronization

- **Synchronized method:** Locks on `this`
- **Synchronized block:** Locks on specified object
- **Prevents race conditions** and data inconsistency

### Inter-Thread Communication

- **wait():** Makes thread wait, releases lock
- **notify():** Wakes one waiting thread
- **notifyAll():** Wakes all waiting threads
- **Always use while loop** (not if) for waiting

### Producer-Consumer Problem

- **Producer:** Adds items to buffer (waits if full)
- **Consumer:** Removes items from buffer (waits if empty)
- **Coordination:** Using `wait()` and `notifyAll()`

---

## Key Takeaways

1. **Runnable vs Thread:** Runnable is preferred (more flexible)
2. **Monitor Lock:** Each object has one lock
3. **Synchronization:** Prevents race conditions
4. **Wait/Notify:** Coordinate threads
5. **While Loop:** Always use while (not if) for waiting
6. **Producer-Consumer:** Classic synchronization problem

---

## Interview Questions

1. **What are the ways to create a thread?**  
   Implementing Runnable interface or extending Thread class.

2. **Why do we have two ways to create threads?**  
   Java allows single inheritance but multiple interface implementation. Runnable provides more flexibility.

3. **Which method is preferred and why?**  
   Runnable interface - more flexible, allows extending other classes, industry standard.

4. **What is a monitor lock?**  
   Lock associated with each object that ensures only one thread can execute synchronized code on that object.

5. **What is synchronization?**  
   Mechanism to ensure only one thread can access critical section at a time.

6. **What is the difference between wait() and sleep()?**  
   wait() releases monitor lock, sleep() does not. wait() requires notify(), sleep() wakes automatically.

7. **Why use while loop instead of if for waiting?**  
   To handle spurious wakeup - thread may wake up without notify(), while loop re-checks condition.

8. **What is the Producer-Consumer problem?**  
   Two threads share a buffer - producer adds items (waits if full), consumer removes items (waits if empty).

9. **What happens when wait() is called?**  
   Thread enters WAITING state, releases monitor lock, waits until notify() or notifyAll() is called.

10. **What is the difference between notify() and notifyAll()?**  
    notify() wakes one waiting thread, notifyAll() wakes all waiting threads.

