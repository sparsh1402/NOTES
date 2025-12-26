# Java Threading - Part 9: Shutdown Methods, Scheduled Executor, ThreadLocal, and Virtual Threads

## Table of Contents
- [Shutdown vs AwaitTermination vs ShutdownNow](#shutdown-vs-awaittermination-vs-shutdownnow)
- [Scheduled Thread Pool Executor](#scheduled-thread-pool-executor)
- [ThreadLocal](#threadlocal)
- [Virtual Threads vs Platform Threads](#virtual-threads-vs-platform-threads)
- [Summary](#summary)

---

## Shutdown vs AwaitTermination vs ShutdownNow

### shutdown()

**Purpose:** Initiates **orderly shutdown** of executor service.

**Behavior:**
- ✅ **Stops accepting new tasks**
- ✅ **Continues processing existing tasks**
- ✅ **Graceful shutdown**

**Example:**
```java
ExecutorService executor = Executors.newFixedThreadPool(5);

executor.submit(() -> {
    System.out.println("Task started");
    Thread.sleep(5000);
    System.out.println("Task completed");
});

executor.shutdown();  // Stop accepting new tasks

// This will throw RejectedExecutionException
// executor.submit(() -> System.out.println("New task"));  // ❌ Rejected

// Existing task continues
// Output:
// Task started
// (5 seconds wait)
// Task completed
```

**Key Points:**
- **Does NOT interrupt** running tasks
- **Does NOT wait** for tasks to complete
- **Caller continues** immediately after shutdown()

### awaitTermination()

**Purpose:** **Optional functionality** - waits for executor to terminate within timeout.

**Behavior:**
- ✅ **Blocks calling thread** for specified timeout
- ✅ **Returns true** if terminated within timeout
- ✅ **Returns false** if timeout exceeded
- ⚠️ **Does NOT shutdown** executor (must call shutdown() first)

**Example:**
```java
ExecutorService executor = Executors.newFixedThreadPool(1);

executor.submit(() -> {
    Thread.sleep(5000);
    System.out.println("Task completed");
});

executor.shutdown();

try {
    // Wait maximum 2 seconds
    boolean terminated = executor.awaitTermination(2, TimeUnit.SECONDS);
    System.out.println("Terminated: " + terminated);  // false (not completed in 2s)
} catch (InterruptedException e) {
    e.printStackTrace();
}

// Task still running (will complete after 5 seconds)
```

**Key Points:**
- **Must call shutdown() first**
- **Just checks status** (doesn't force shutdown)
- **Optional** - for coordination purposes

### shutdownNow()

**Purpose:** **Forceful shutdown** - stops executor as soon as possible.

**Behavior:**
- ✅ **Stops accepting new tasks**
- ✅ **Interrupts running tasks**
- ✅ **Returns list of pending tasks**
- ⚠️ **Best effort** (may not stop all tasks)

**Example:**
```java
ExecutorService executor = Executors.newFixedThreadPool(1);

executor.submit(() -> {
    try {
        Thread.sleep(15000);  // Long-running task
        System.out.println("Task completed");
    } catch (InterruptedException e) {
        System.out.println("Task interrupted");
    }
});

Thread.sleep(1000);  // Let task start

List<Runnable> pendingTasks = executor.shutdownNow();
System.out.println("Pending tasks: " + pendingTasks.size());

// Output:
// Task interrupted (interrupted by shutdownNow)
// Pending tasks: 0
```

**Key Points:**
- **Interrupts running tasks** (throws InterruptedException)
- **Returns pending tasks** from queue
- **Forceful** - doesn't wait for graceful completion

### Comparison Table

| Method | Accept New Tasks? | Process Existing? | Interrupt Running? | Wait? |
|--------|-------------------|-------------------|-------------------|-------|
| **shutdown()** | ❌ No | ✅ Yes | ❌ No | ❌ No |
| **awaitTermination()** | - | - | ❌ No | ✅ Yes (timeout) |
| **shutdownNow()** | ❌ No | ❌ No | ✅ Yes | ❌ No |

### Complete Example

```java
ExecutorService executor = Executors.newFixedThreadPool(2);

// Submit tasks
for (int i = 0; i < 5; i++) {
    executor.submit(() -> {
        try {
            Thread.sleep(5000);
            System.out.println("Task completed");
        } catch (InterruptedException e) {
            System.out.println("Task interrupted");
        }
    });
}

// Shutdown (graceful)
executor.shutdown();
System.out.println("Shutdown called");

// Wait for termination (optional)
try {
    boolean terminated = executor.awaitTermination(10, TimeUnit.SECONDS);
    if (terminated) {
        System.out.println("All tasks completed");
    } else {
        System.out.println("Timeout - some tasks still running");
        executor.shutdownNow();  // Force stop
    }
} catch (InterruptedException e) {
    e.printStackTrace();
}
```

---

## Scheduled Thread Pool Executor

### What is Scheduled Executor?

**ScheduledExecutorService** allows scheduling tasks to run:
- **After a delay**
- **At fixed rate** (periodic)
- **With fixed delay** (periodic)

**Inheritance:**
```java
ScheduledExecutorService extends ExecutorService
```

### Creating Scheduled Executor

**Method:**
```java
ScheduledExecutorService executor = Executors.newScheduledThreadPool(5);
```

**Properties:**
- **Core Pool Size:** 5 (provided)
- **Maximum Pool Size:** Integer.MAX_VALUE
- **Keep Alive Time:** 0 (threads always alive)

### Methods

#### 1. schedule(Runnable, delay, unit)

**Purpose:** Schedule task to run **once** after delay.

**Example:**
```java
ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);

ScheduledFuture<?> future = executor.schedule(() -> {
    System.out.println("Hello");
}, 5, TimeUnit.SECONDS);

// Task runs after 5 seconds
// Output: (after 5 seconds) Hello
```

#### 2. schedule(Callable, delay, unit)

**Purpose:** Schedule callable task to run **once** after delay (returns value).

**Example:**
```java
ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);

ScheduledFuture<String> future = executor.schedule(() -> {
    return "Hello";
}, 5, TimeUnit.SECONDS);

try {
    String result = future.get();
    System.out.println("Result: " + result);  // "Hello"
} catch (Exception e) {
    e.printStackTrace();
}
```

#### 3. scheduleAtFixedRate(Runnable, initialDelay, period, unit)

**Purpose:** Schedule task to run **periodically at fixed rate**.

**Behavior:**
- **First execution:** After `initialDelay`
- **Subsequent executions:** Every `period` time
- **Fixed rate:** Next execution scheduled regardless of previous completion

**Example:**
```java
ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);

ScheduledFuture<?> future = executor.scheduleAtFixedRate(() -> {
    System.out.println("Task: " + System.currentTimeMillis());
}, 3, 5, TimeUnit.SECONDS);

// First execution: After 3 seconds
// Then every 5 seconds

// Cancel after 20 seconds
Thread.sleep(20000);
future.cancel(true);
executor.shutdown();
```

**Output:**
```
Task: 1000 (after 3 seconds)
Task: 6000 (after 5 more seconds)
Task: 11000 (after 5 more seconds)
Task: 16000 (after 5 more seconds)
```

**Important:** If task takes longer than period, next execution waits for current to complete.

#### 4. scheduleWithFixedDelay(Runnable, initialDelay, delay, unit)

**Purpose:** Schedule task to run **periodically with fixed delay**.

**Behavior:**
- **First execution:** After `initialDelay`
- **Subsequent executions:** `delay` time **after previous completes**
- **Fixed delay:** Timer starts after task completes

**Example:**
```java
ScheduledExecutorService executor = Executors.newScheduledThreadPool(1);

ScheduledFuture<?> future = executor.scheduleWithFixedDelay(() -> {
    System.out.println("Task: " + System.currentTimeMillis());
    try {
        Thread.sleep(2000);  // Task takes 2 seconds
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
}, 1, 3, TimeUnit.SECONDS);

// First: After 1 second
// Then: 3 seconds after each completion
// (Task takes 2s, wait 3s → Total 5s between starts)
```

**Difference:**
- **scheduleAtFixedRate:** Next execution scheduled at fixed intervals (may overlap)
- **scheduleWithFixedDelay:** Next execution starts after delay from completion (no overlap)

---

## ThreadLocal

### What is ThreadLocal?

**ThreadLocal** provides **thread-local variables**.

**Key Concept:** Each thread has its **own copy** of the variable.

**Purpose:** Store data that is **specific to each thread**.

### How ThreadLocal Works

**Visual Representation:**
```
Thread 1:
  ThreadLocal variable: "Thread-1 data"

Thread 2:
  ThreadLocal variable: "Thread-2 data"

Thread 3:
  ThreadLocal variable: "Thread-3 data"
```

**Key Point:** **One ThreadLocal object**, but **each thread has its own value**.

### ThreadLocal Example

```java
import java.util.concurrent.ThreadLocal;

class SharedResource {
    private static ThreadLocal<String> threadLocal = new ThreadLocal<>();
    
    public void setValue(String value) {
        threadLocal.set(value);  // Set for current thread
    }
    
    public String getValue() {
        return threadLocal.get();  // Get for current thread
    }
    
    public void remove() {
        threadLocal.remove();  // Clean up
    }
}

public class ThreadLocalExample {
    public static void main(String[] args) {
        SharedResource resource = new SharedResource();
        
        // Main thread
        resource.setValue("Main thread value");
        System.out.println("Main: " + resource.getValue());  // "Main thread value"
        
        // Thread 1
        Thread thread1 = new Thread(() -> {
            resource.setValue("Thread-1 value");
            System.out.println("Thread-1: " + resource.getValue());  // "Thread-1 value"
        });
        
        // Thread 2
        Thread thread2 = new Thread(() -> {
            resource.setValue("Thread-2 value");
            System.out.println("Thread-2: " + resource.getValue());  // "Thread-2 value"
        });
        
        thread1.start();
        thread2.start();
        
        // Main thread still has its own value
        System.out.println("Main: " + resource.getValue());  // "Main thread value"
    }
}
```

**Output:**
```
Main: Main thread value
Thread-1: Thread-1 value
Thread-2: Thread-2 value
Main: Main thread value
```

### Important: Clean Up ThreadLocal

**Problem with Thread Pool:**
- Threads are **reused**
- ThreadLocal values **persist** across tasks
- **Memory leak** if not cleaned

**Solution:** Always **remove()** ThreadLocal in finally block.

**Example:**
```java
ExecutorService executor = Executors.newFixedThreadPool(5);
ThreadLocal<String> threadLocal = new ThreadLocal<>();

for (int i = 0; i < 15; i++) {
    executor.submit(() -> {
        try {
            threadLocal.set("Value-" + Thread.currentThread().getName());
            // Do work
            System.out.println("Value: " + threadLocal.get());
        } finally {
            threadLocal.remove();  // ✅ Always clean up
        }
    });
}
```

**Without remove():**
```java
// Task 1: Thread-1 sets value = "Task1"
// Thread-1 completes, returns to pool
// Task 2: Thread-1 picks task, value still = "Task1" (stale!) ❌
```

**With remove():**
```java
// Task 1: Thread-1 sets value = "Task1", removes it
// Thread-1 completes, returns to pool (clean)
// Task 2: Thread-1 picks task, value = null ✅
```

---

## Virtual Threads vs Platform Threads

### Platform Threads (Normal Threads)

**What are Platform Threads?**
- **Wrapper around OS thread** (1:1 mapping)
- **JVM manages** platform thread
- **OS manages** underlying native thread

**How it works:**
```java
Thread thread = new Thread(() -> {
    // Task
});
thread.start();

// JVM → OS: "Create native thread"
// OS creates thread
// 1 Platform Thread = 1 OS Thread
```

**Disadvantages:**
1. **Slow creation:** System call to OS (expensive)
2. **Blocking:** When thread waits (IO, DB), OS thread also blocked (wasted)

**Example:**
```
Platform Thread (Thread 1) → OS Thread 1
  ↓ (DB call, waiting 4 seconds)
OS Thread 1: Blocked (wasted, can't do other work)
```

### Virtual Threads

**What are Virtual Threads?**
- **JVM-managed threads** (not OS threads)
- **M:N mapping:** Many virtual threads → Few OS threads
- **Lightweight:** Just Java objects (no OS overhead)

**How it works:**
```java
// Virtual thread
Thread thread = Thread.ofVirtual().start(() -> {
    // Task
});

// JVM creates virtual thread (Java object)
// No OS thread created yet
// When thread needs to run → Attached to OS thread
// When thread waits → Detached from OS thread
```

**Advantages:**
1. **Fast creation:** Just Java object (no system call)
2. **Non-blocking:** When virtual thread waits, OS thread freed for other virtual threads

**Example:**
```
Virtual Thread 1 → OS Thread 1 (running)
Virtual Thread 2 → OS Thread 2 (running)
Virtual Thread 3 → Waiting (detached from OS thread)
Virtual Thread 4 → OS Thread 1 (attached, running)

When Virtual Thread 3 ready → Attached to OS Thread 2
```

### Visual Comparison

**Platform Threads:**
```
Thread 1 → OS Thread 1 (1:1 mapping)
Thread 2 → OS Thread 2 (1:1 mapping)
Thread 3 → OS Thread 3 (1:1 mapping)

If Thread 1 waits → OS Thread 1 also waits (wasted)
```

**Virtual Threads:**
```
Virtual Thread 1 → OS Thread 1
Virtual Thread 2 → OS Thread 2
Virtual Thread 3 → (waiting, detached)
Virtual Thread 4 → OS Thread 1 (attached)

If Virtual Thread 1 waits → Detached, OS Thread 1 free for Virtual Thread 4
```

### Creating Virtual Threads

**Method 1: Thread.ofVirtual()**
```java
Thread virtualThread = Thread.ofVirtual().start(() -> {
    System.out.println("Virtual thread: " + Thread.currentThread().getName());
});
```

**Method 2: ExecutorService**
```java
ExecutorService executor = Executors.newVirtualThreadPerTaskExecutor();

executor.submit(() -> {
    System.out.println("Virtual thread: " + Thread.currentThread().getName());
});
```

### When to Use Virtual Threads?

**Use Virtual Threads when:**
- **High throughput** requirement (many concurrent tasks)
- **IO-bound tasks** (DB calls, network calls)
- **Many short-lived tasks**

**Use Platform Threads when:**
- **CPU-intensive tasks**
- **Long-running tasks**
- **Need OS-level thread features**

### Key Differences

| Aspect | Platform Thread | Virtual Thread |
|--------|-----------------|----------------|
| **Mapping** | 1:1 (OS thread) | M:N (many to few OS threads) |
| **Creation** | Slow (system call) | Fast (Java object) |
| **When waiting** | OS thread blocked | OS thread freed |
| **Throughput** | Lower | Higher |
| **Use case** | CPU-intensive | IO-intensive, high throughput |

---

## Summary

### Shutdown Methods

- **shutdown():** Graceful shutdown (no new tasks, finish existing)
- **awaitTermination():** Wait for termination (optional, checks status)
- **shutdownNow():** Forceful shutdown (interrupts running tasks)

### Scheduled Executor

- **schedule():** Run once after delay
- **scheduleAtFixedRate():** Run periodically at fixed rate
- **scheduleWithFixedDelay():** Run periodically with fixed delay

### ThreadLocal

- **Thread-specific variables**
- **Each thread has its own copy**
- **Must clean up** (remove()) when using thread pools

### Virtual Threads

- **JVM-managed** (not OS threads)
- **Lightweight** (fast creation)
- **Better throughput** (especially for IO-bound tasks)
- **M:N mapping** (many virtual threads to few OS threads)

---

## Key Takeaways

1. **shutdown()** = Graceful (finish existing tasks)
2. **shutdownNow()** = Forceful (interrupt running tasks)
3. **awaitTermination()** = Wait and check status (optional)
4. **Scheduled Executor** = Schedule tasks (delay, periodic)
5. **ThreadLocal** = Thread-specific variables (must clean up)
6. **Virtual Threads** = Lightweight, high throughput (IO-bound tasks)
7. **Platform Threads** = OS threads, 1:1 mapping (CPU-intensive)

---

## Interview Questions

1. **What is the difference between shutdown() and shutdownNow()?**  
   shutdown() stops accepting new tasks but continues existing. shutdownNow() interrupts running tasks and stops immediately.

2. **What is awaitTermination()?**  
   Waits for executor to terminate within timeout. Returns true if terminated, false if timeout. Must call shutdown() first.

3. **What is ScheduledExecutorService?**  
   Executor service that can schedule tasks to run after delay or periodically.

4. **What is the difference between scheduleAtFixedRate and scheduleWithFixedDelay?**  
   scheduleAtFixedRate schedules at fixed intervals (may overlap). scheduleWithFixedDelay schedules after delay from completion (no overlap).

5. **What is ThreadLocal?**  
   Provides thread-local variables. Each thread has its own copy of the variable.

6. **Why must ThreadLocal be cleaned up?**  
   When using thread pools, threads are reused. ThreadLocal values persist across tasks, causing memory leaks and stale data.

7. **What are Virtual Threads?**  
   JVM-managed lightweight threads. Many virtual threads map to few OS threads (M:N mapping).

8. **What is the difference between Virtual and Platform threads?**  
   Platform threads are 1:1 with OS threads (slow creation, blocking). Virtual threads are JVM-managed (fast creation, non-blocking when waiting).

9. **When to use Virtual Threads?**  
   High throughput scenarios, IO-bound tasks, many concurrent short-lived tasks.

10. **How to create Virtual Threads?**  
    Thread.ofVirtual().start() or Executors.newVirtualThreadPerTaskExecutor().

