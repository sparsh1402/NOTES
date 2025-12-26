# Java Threading - Part 3: Deprecated Methods, Thread Join, Priority, and Daemon Threads

## Table of Contents
- [Deprecated Methods: stop(), suspend(), resume()](#deprecated-methods-stop-suspend-resume)
- [Thread Joining](#thread-joining)
- [Thread Priority](#thread-priority)
- [Daemon Threads](#daemon-threads)
- [Summary](#summary)

---

## Deprecated Methods: stop(), suspend(), resume()

### Why Are These Methods Deprecated?

**These methods are deprecated because they can cause serious problems:**

1. **stop()** - Terminates thread abruptly
2. **suspend()** - Puts thread on hold without releasing locks
3. **resume()** - Resumes suspended thread

### stop() Method

**What it does:**
- **Terminates thread abruptly**
- Thread enters **TERMINATED** state immediately
- **No lock release** - locks remain held
- **No resource cleanup** - resources not properly released

**Problem:**
```java
Thread thread1 = new Thread(() -> {
    synchronized (resource) {
        // Critical section
        // If stop() is called here, lock is NOT released
    }
});

Thread thread2 = new Thread(() -> {
    synchronized (resource) {
        // Waiting forever - deadlock!
        // thread1's lock was never released
    }
});
```

**Visual Representation:**
```
Thread 1: Acquires lock on Resource 1
  ┌─────────────────┐
  │ Resource 1: 🔒  │ ← Thread 1 holds lock
  └─────────────────┘

Thread 1: stop() called
  ┌─────────────────┐
  │ Resource 1: 🔒  │ ← Lock NOT released! ❌
  └─────────────────┘
  Thread 1: TERMINATED

Thread 2: Waiting for Resource 1
  ┌─────────────────┐
  │ Resource 1: 🔒  │ ← Still locked, waiting forever
  └─────────────────┘
  Thread 2: DEADLOCK! ❌
```

**Example:**
```java
class SharedResource {
    public synchronized void produce() {
        System.out.println("Lock acquired by: " + 
            Thread.currentThread().getName());
        try {
            Thread.sleep(8000);  // Hold lock for 8 seconds
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("Lock released by: " + 
            Thread.currentThread().getName());
    }
}

public class StopExample {
    public static void main(String[] args) {
        SharedResource resource = new SharedResource();
        
        Thread thread1 = new Thread(() -> {
            resource.produce();
        }, "Thread-1");
        
        Thread thread2 = new Thread(() -> {
            try {
                Thread.sleep(1000);  // Wait 1 second
                resource.produce();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }, "Thread-2");
        
        thread1.start();
        thread2.start();
        
        try {
            Thread.sleep(3000);  // Wait 3 seconds
            thread1.stop();  // ❌ Deprecated - terminates abruptly
            System.out.println("Thread-1 stopped");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        // Thread-2 will wait forever - DEADLOCK!
    }
}
```

**Output:**
```
Lock acquired by: Thread-1
Thread-1 stopped
(Thread-2 waiting forever - deadlock)
```

**Why stop() is Deprecated:**
- **No lock release:** Locks remain held → **deadlock**
- **No cleanup:** Resources not properly released
- **Unsafe:** Can leave objects in inconsistent state

### suspend() Method

**What it does:**
- **Puts thread on hold** (similar to wait)
- Thread enters **suspended state**
- **Does NOT release monitor locks** (unlike wait)

**Problem:**
```java
Thread thread1 = new Thread(() -> {
    synchronized (resource) {
        // Critical section
        // If suspend() is called, lock is NOT released
    }
});

Thread thread2 = new Thread(() -> {
    synchronized (resource) {
        // Waiting forever - deadlock!
    }
});
```

**Visual Representation:**
```
Thread 1: Acquires lock on Resource 1
  ┌─────────────────┐
  │ Resource 1: 🔒  │ ← Thread 1 holds lock
  └─────────────────┘

Thread 1: suspend() called
  ┌─────────────────┐
  │ Resource 1: 🔒  │ ← Lock NOT released! ❌
  └─────────────────┘
  Thread 1: SUSPENDED (but lock held)

Thread 2: Waiting for Resource 1
  ┌─────────────────┐
  │ Resource 1: 🔒  │ ← Still locked, waiting forever
  └─────────────────┘
  Thread 2: DEADLOCK! ❌
```

**Example:**
```java
class SharedResource {
    public synchronized void produce() {
        System.out.println("Lock acquired by: " + 
            Thread.currentThread().getName());
        try {
            Thread.sleep(8000);  // Hold lock for 8 seconds
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        System.out.println("Lock released by: " + 
            Thread.currentThread().getName());
    }
}

public class SuspendExample {
    public static void main(String[] args) {
        SharedResource resource = new SharedResource();
        
        Thread thread1 = new Thread(() -> {
            resource.produce();
        }, "Thread-1");
        
        Thread thread2 = new Thread(() -> {
            try {
                Thread.sleep(1000);  // Wait 1 second
                resource.produce();
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }, "Thread-2");
        
        thread1.start();
        thread2.start();
        
        try {
            Thread.sleep(3000);  // Wait 3 seconds
            thread1.suspend();  // ❌ Deprecated - suspends without releasing lock
            System.out.println("Thread-1 suspended");
            
            Thread.sleep(3000);  // Wait 3 more seconds
            thread1.resume();  // Resume thread
            System.out.println("Thread-1 resumed");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

**Output:**
```
Lock acquired by: Thread-1
Thread-1 suspended
(Thread-2 waiting...)
Thread-1 resumed
Lock released by: Thread-1
Lock acquired by: Thread-2
Lock released by: Thread-2
```

**Why suspend() is Deprecated:**
- **No lock release:** Locks remain held → **deadlock**
- **Use wait() instead:** wait() releases locks properly

### resume() Method

**What it does:**
- **Resumes execution** of suspended thread
- Makes suspended thread active again

**Why it's Deprecated:**
- **Depends on suspend():** Since suspend() is deprecated, resume() is also deprecated
- **Use notify() instead:** For threads waiting with wait()

### Comparison: wait() vs suspend()

| Aspect | wait() | suspend() |
|--------|--------|-----------|
| **Lock Release** | ✅ Releases monitor locks | ❌ Does NOT release locks |
| **State** | WAITING | SUSPENDED |
| **Wake Up** | notify() or notifyAll() | resume() |
| **Status** | ✅ Recommended | ❌ Deprecated |
| **Deadlock Risk** | ✅ Safe | ❌ Can cause deadlock |

### How to Stop Thread Safely?

**Instead of stop(), use:**
1. **Volatile boolean flag:**
```java
class MyThread extends Thread {
    private volatile boolean running = true;
    
    public void stopThread() {
        running = false;
    }
    
    @Override
    public void run() {
        while (running) {
            // Do work
        }
    }
}
```

2. **Interrupt mechanism:**
```java
class MyThread extends Thread {
    @Override
    public void run() {
        while (!Thread.currentThread().isInterrupted()) {
            // Do work
        }
    }
}

// To stop:
thread.interrupt();
```

---

## Thread Joining

### What is Thread Joining?

**Thread joining** makes the **current thread wait** for a **specific thread to finish** its execution.

**Purpose:** Coordinate threads and ensure certain tasks complete before proceeding.

### join() Method

**Syntax:**
```java
thread.join();  // Wait for thread to finish
```

**Behavior:**
- **Current thread blocks** (waits)
- **Waits until specified thread completes**
- **Current thread resumes** after specified thread finishes

### Example: Without join()

```java
public class WithoutJoin {
    public static void main(String[] args) {
        System.out.println("Main thread started");
        
        Thread thread1 = new Thread(() -> {
            System.out.println("Thread-1 started");
            try {
                Thread.sleep(5000);  // Work for 5 seconds
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Thread-1 completed");
        });
        
        thread1.start();
        
        System.out.println("Main thread finished");
        // Main thread doesn't wait for thread1
    }
}
```

**Output:**
```
Main thread started
Main thread finished
Thread-1 started
(5 seconds wait)
Thread-1 completed
```

**Problem:** Main thread finishes before thread1 completes.

### Example: With join()

```java
public class WithJoin {
    public static void main(String[] args) {
        System.out.println("Main thread started");
        
        Thread thread1 = new Thread(() -> {
            System.out.println("Thread-1 started");
            try {
                Thread.sleep(5000);  // Work for 5 seconds
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Thread-1 completed");
        });
        
        thread1.start();
        
        try {
            thread1.join();  // Main thread waits for thread1
            System.out.println("Main thread: Thread-1 completed, continuing...");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        
        System.out.println("Main thread finished");
    }
}
```

**Output:**
```
Main thread started
Thread-1 started
(5 seconds wait)
Thread-1 completed
Main thread: Thread-1 completed, continuing...
Main thread finished
```

**Result:** Main thread waits for thread1 to complete.

### Multiple Threads Joining

```java
public class MultipleJoin {
    public static void main(String[] args) {
        Thread thread1 = new Thread(() -> {
            System.out.println("Thread-1 working...");
            try {
                Thread.sleep(2000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Thread-1 completed");
        });
        
        Thread thread2 = new Thread(() -> {
            System.out.println("Thread-2 working...");
            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Thread-2 completed");
        });
        
        thread1.start();
        thread2.start();
        
        try {
            thread1.join();  // Wait for thread1
            thread2.join();  // Wait for thread2
            System.out.println("All threads completed");
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
}
```

**Output:**
```
Thread-1 working...
Thread-2 working...
(2 seconds wait)
Thread-1 completed
(1 more second wait)
Thread-2 completed
All threads completed
```

### join() with Timeout

**Syntax:**
```java
thread.join(milliseconds);  // Wait with timeout
```

**Example:**
```java
try {
    thread.join(3000);  // Wait maximum 3 seconds
    if (thread.isAlive()) {
        System.out.println("Thread still running after timeout");
    } else {
        System.out.println("Thread completed within timeout");
    }
} catch (InterruptedException e) {
    e.printStackTrace();
}
```

### Use Cases for join()

1. **Coordination:** Ensure certain tasks complete before proceeding
2. **Dependency:** Thread depends on another thread's result
3. **Resource cleanup:** Wait for threads to finish before cleanup
4. **Result collection:** Collect results from multiple threads

---

## Thread Priority

### What is Thread Priority?

**Thread priority** is a **hint to the thread scheduler** about which thread should be executed next.

**Range:** 1 (lowest) to 10 (highest)

**Constants:**
- `Thread.MIN_PRIORITY` = 1
- `Thread.NORM_PRIORITY` = 5 (default)
- `Thread.MAX_PRIORITY` = 10

### Setting Thread Priority

**Methods:**
```java
thread.setPriority(priority);  // Set priority (1-10)
thread.setPriority(Thread.MAX_PRIORITY);  // Set to 10
thread.setPriority(Thread.MIN_PRIORITY);  // Set to 1
thread.setPriority(Thread.NORM_PRIORITY); // Set to 5

int priority = thread.getPriority();  // Get priority
```

**Example:**
```java
Thread thread1 = new Thread(() -> {
    for (int i = 0; i < 5; i++) {
        System.out.println("Thread-1: " + i);
    }
});

Thread thread2 = new Thread(() -> {
    for (int i = 0; i < 5; i++) {
        System.out.println("Thread-2: " + i);
    }
});

thread1.setPriority(Thread.MIN_PRIORITY);  // Priority: 1
thread2.setPriority(Thread.MAX_PRIORITY);  // Priority: 10

thread1.start();
thread2.start();
```

### Important Points About Priority

**1. No Guarantee:**
- **JVM does NOT guarantee** priority order
- **Just a hint** to thread scheduler
- **Not a strict rule**

**Example:**
```java
// Even with different priorities, order is NOT guaranteed
Thread t1 = new Thread(() -> System.out.println("T1"));
Thread t2 = new Thread(() -> System.out.println("T2"));
Thread t3 = new Thread(() -> System.out.println("T3"));

t1.setPriority(5);
t2.setPriority(10);  // Highest
t3.setPriority(1);   // Lowest

t1.start();
t2.start();
t3.start();

// Output order may vary:
// T1, T2, T3 (expected)
// T3, T1, T2 (actual - different!)
// T2, T3, T1 (actual - different!)
```

**2. Inherits Parent Priority:**
- **New thread inherits** priority of parent thread
- **Default:** NORM_PRIORITY (5)

**Example:**
```java
System.out.println(Thread.currentThread().getPriority());  // 5 (main thread)

Thread child = new Thread(() -> {
    System.out.println(Thread.currentThread().getPriority());  // 5 (inherited)
});
child.start();
```

**3. Platform Dependent:**
- **Different OS** may handle priority differently
- **Not portable** across platforms

### Why Not Rely on Priority?

**Problems:**
1. **No guarantee:** Order not guaranteed
2. **Platform dependent:** Behavior varies
3. **Unpredictable:** May work sometimes, not always
4. **Not production-ready:** Not used in real applications

**Recommendation:** **Never rely on thread priority** in production code.

---

## Daemon Threads

### What is Daemon Thread?

**Daemon thread** is a **background thread** that runs as long as **at least one user thread is alive**.

**Key Characteristics:**
- **Background thread:** Runs behind the scenes
- **Life depends on user threads:** Dies when all user threads finish
- **Supporting role:** Performs supporting tasks (GC, logging, autosave)

### User Thread vs Daemon Thread

| Aspect | User Thread | Daemon Thread |
|--------|-------------|---------------|
| **Type** | Normal thread | Background thread |
| **Life** | Independent | Depends on user threads |
| **Stops when** | Task completes | All user threads finish |
| **Default** | ✅ Yes | ❌ No (must set explicitly) |
| **Use case** | Main application logic | Supporting tasks |

### Creating Daemon Thread

**Method:**
```java
thread.setDaemon(true);  // Make thread daemon
boolean isDaemon = thread.isDaemon();  // Check if daemon
```

**Important:** Must set **before** calling `start()`.

### Example: User Thread

```java
public class UserThreadExample {
    public static void main(String[] args) {
        System.out.println("Main thread started");
        
        Thread thread1 = new Thread(() -> {
            System.out.println("Thread-1 started");
            try {
                Thread.sleep(8000);  // Work for 8 seconds
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Thread-1 completed");
        });
        
        thread1.start();
        
        System.out.println("Main thread finished");
        // Main thread finishes, but thread1 continues
    }
}
```

**Output:**
```
Main thread started
Main thread finished
Thread-1 started
(8 seconds wait)
Thread-1 completed
```

**Result:** Thread-1 continues even after main thread finishes (user thread).

### Example: Daemon Thread

```java
public class DaemonThreadExample {
    public static void main(String[] args) {
        System.out.println("Main thread started");
        
        Thread thread1 = new Thread(() -> {
            System.out.println("Daemon thread started");
            try {
                Thread.sleep(8000);  // Work for 8 seconds
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            System.out.println("Daemon thread completed");
        });
        
        thread1.setDaemon(true);  // Make it daemon
        thread1.start();
        
        System.out.println("Main thread finished");
        // Main thread finishes, daemon thread also stops
    }
}
```

**Output:**
```
Main thread started
Main thread finished
Daemon thread started
(Daemon thread stops immediately - doesn't wait 8 seconds)
```

**Result:** Daemon thread stops when main thread (user thread) finishes.

### Visual Representation

**User Thread:**
```
Main Thread (User) ────────────────┐
                                    │
Thread-1 (User) ────────────────────┼─── Continues
                                    │
(Program keeps running)
```

**Daemon Thread:**
```
Main Thread (User) ────────────────┐
                                    │
Daemon Thread ─────────────────────┼─── Stops when main finishes
                                    │
(Program stops)
```

### Real-World Examples of Daemon Threads

**1. Garbage Collector:**
- JVM's garbage collector runs as daemon thread
- Cleans up memory while program runs
- Stops when all user threads finish

**2. Auto-Save:**
- Editor's auto-save feature
- Periodically saves work
- Stops when program closes

**3. Logging:**
- Background logging thread
- Writes logs while program runs
- Stops when program finishes

**4. Background Tasks:**
- Periodic cleanup
- Cache refresh
- Health checks

### Example: Garbage Collector (Conceptual)

```java
// JVM internally does something like:
Thread gcThread = new Thread(() -> {
    while (true) {
        // Perform garbage collection
        System.gc();
        try {
            Thread.sleep(5000);  // Every 5 seconds
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }
});

gcThread.setDaemon(true);  // Daemon thread
gcThread.start();
```

### Important Points About Daemon Threads

**1. Must Set Before start():**
```java
thread.setDaemon(true);  // ✅ Correct
thread.start();

thread.start();
thread.setDaemon(true);  // ❌ Wrong - IllegalThreadStateException
```

**2. Main Thread is User Thread:**
- Main thread is always user thread
- Program keeps running as long as user threads are alive

**3. Daemon Threads Don't Prevent JVM Exit:**
- JVM exits when all user threads finish
- Daemon threads don't keep JVM alive

**4. Use for Supporting Tasks:**
- Use daemon threads for background/supporting tasks
- Don't use for critical application logic

---

## Summary

### Deprecated Methods

**stop(), suspend(), resume():**
- **Deprecated** because they don't release locks
- **Can cause deadlock**
- **Use alternatives:** wait()/notify(), interrupt mechanism

### Thread Joining

**join() method:**
- Makes current thread **wait** for specified thread to finish
- **Coordination:** Ensures tasks complete before proceeding
- **Use cases:** Dependency, result collection, cleanup

### Thread Priority

**Priority (1-10):**
- **Just a hint** to thread scheduler
- **No guarantee** of execution order
- **Not recommended** for production code
- **Platform dependent**

### Daemon Threads

**Daemon threads:**
- **Background threads** that support user threads
- **Die when** all user threads finish
- **Use cases:** GC, logging, autosave, background tasks
- **Must set before** start()

---

## Key Takeaways

1. **Deprecated Methods:** stop(), suspend(), resume() are unsafe - don't use
2. **Thread Join:** Coordinate threads, ensure completion
3. **Thread Priority:** Not reliable, don't rely on it
4. **Daemon Threads:** Background threads, die when user threads finish
5. **Best Practices:** Use wait()/notify(), join() for coordination, daemon for supporting tasks

---

## Interview Questions

1. **Why are stop(), suspend(), and resume() deprecated?**  
   They don't release monitor locks, which can cause deadlock situations.

2. **What is the difference between wait() and suspend()?**  
   wait() releases monitor locks, suspend() does not. wait() is safe, suspend() can cause deadlock.

3. **How to stop a thread safely?**  
   Use volatile boolean flag or interrupt mechanism instead of stop().

4. **What is thread joining?**  
   Makes current thread wait for specified thread to finish execution.

5. **What is thread priority?**  
   Hint to thread scheduler (1-10), but JVM doesn't guarantee execution order.

6. **Should you rely on thread priority?**  
   No, it's not guaranteed and platform dependent. Not recommended for production.

7. **What is a daemon thread?**  
   Background thread that dies when all user threads finish. Used for supporting tasks.

8. **What are examples of daemon threads?**  
   Garbage collector, auto-save, logging, background cleanup tasks.

9. **When does a daemon thread stop?**  
   When all user threads finish execution.

10. **Can you change daemon status after starting thread?**  
    No, must set before calling start(), otherwise IllegalThreadStateException.

