# Java Threading - Part 6: Thread Pool Executor

## Table of Contents
- [What is Thread Pool?](#what-is-thread-pool)
- [Advantages of Thread Pool](#advantages-of-thread-pool)
- [ThreadPoolExecutor Constructor](#threadpoolexecutor-constructor)
- [Thread Pool Flow](#thread-pool-flow)
- [Thread Pool Lifecycle](#thread-pool-lifecycle)
- [How to Decide Core Pool Size?](#how-to-decide-core-pool-size)
- [Summary](#summary)

---

## What is Thread Pool?

### Definition

**Thread Pool** is a **collection of threads** (also called **worker threads**) that are available to perform submitted tasks.

**Key Concepts:**
- **Pre-created threads:** Threads created in advance
- **Reuse threads:** Don't create new thread for each task
- **Queue:** Tasks waiting to be processed
- **Worker threads:** Threads that process tasks

### Visual Representation

```
Thread Pool:
┌─────────────────────┐
│  Thread 1 (Worker) │
│  Thread 2 (Worker) │
│  Thread 3 (Worker) │
│  Thread 4 (Worker) │
│  Thread 5 (Worker) │
└─────────────────────┘
         ↓
    Task Queue
┌─────────────────────┐
│  Task 6             │
│  Task 7             │
│  Task 8             │
└─────────────────────┘
```

### How Thread Pool Works

**Flow:**
1. **Task submitted** → Check if thread available
2. **If available** → Assign task to thread
3. **If not available** → Put task in queue
4. **Thread completes** → Returns to pool, picks next task from queue

**Example:**
```
Task 1 arrives → Thread 1 picks it (busy)
Task 2 arrives → Thread 2 picks it (busy)
Task 3 arrives → Thread 3 picks it (busy)
Task 4 arrives → Queue (all threads busy)
Task 5 arrives → Queue

Thread 1 completes → Picks Task 4 from queue
Thread 2 completes → Picks Task 5 from queue
```

---

## Advantages of Thread Pool

### 1. Save Thread Creation Time

**Without Thread Pool:**
```java
// Each task creates new thread
for (int i = 0; i < 1000; i++) {
    Thread thread = new Thread(() -> processTask(i));
    thread.start();  // Takes time to create thread
}
// Time: 1000 × thread_creation_time
```

**With Thread Pool:**
```java
// Threads pre-created, just reuse
ExecutorService executor = Executors.newFixedThreadPool(10);
for (int i = 0; i < 1000; i++) {
    executor.submit(() -> processTask(i));  // Instant assignment
}
// Time: Only 10 × thread_creation_time (much faster)
```

**Why thread creation takes time?**
- Allocate **stack memory** for thread
- Allocate **program counter**
- Allocate **register**
- **System call** to OS (expensive)

### 2. Remove Thread Lifecycle Management Overhead

**Without Thread Pool:**
- Manually manage thread states (NEW, RUNNABLE, TERMINATED)
- Handle thread cleanup
- Complex state management

**With Thread Pool:**
- **Executor framework** manages lifecycle
- **Automatic cleanup**
- **Abstracted complexity**

### 3. Increase Performance (Less Context Switching)

**Problem with too many threads:**
```
100 threads, 2 CPU cores
→ Only 2 threads run in parallel
→ 98 threads wait (context switching)
→ CPU spends time on context switching instead of processing
→ Performance decreases
```

**Solution with Thread Pool:**
```
Thread pool: 10 threads, 2 CPU cores
→ Better utilization
→ Less context switching
→ More processing time
→ Performance increases
```

**Key Point:** Control number of threads → Reduce context switching → Better performance

---

## ThreadPoolExecutor Constructor

### Constructor Parameters

```java
ThreadPoolExecutor(
    int corePoolSize,              // Minimum threads
    int maximumPoolSize,            // Maximum threads
    long keepAliveTime,            // Idle thread timeout
    TimeUnit unit,                 // Time unit
    BlockingQueue<Runnable> workQueue,  // Task queue
    ThreadFactory threadFactory,   // Custom thread creation
    RejectedExecutionHandler handler    // Rejection handler
)
```

### 1. corePoolSize

**Definition:** Number of threads that are **initially created** and kept in the pool even if they are idle.

**Example:**
```java
corePoolSize = 3
→ Thread pool always has 3 threads (even if idle)
→ Thread 1, Thread 2, Thread 3 (always present)
```

**Key Points:**
- **Minimum threads** always present
- **Created immediately** when pool is created
- **Remain alive** even when idle (unless `allowCoreThreadTimeOut = true`)

### 2. maximumPoolSize

**Definition:** Maximum number of threads that can be created in the pool.

**Example:**
```java
corePoolSize = 3
maximumPoolSize = 5
→ Can create 2 more threads (total 5) when needed
```

**When additional threads are created:**
- All core threads are **busy**
- **Queue is full**
- **New task arrives**
- → Create new thread (up to maximum)

### 3. keepAliveTime

**Definition:** Time that idle threads (beyond core pool size) wait before being terminated.

**Example:**
```java
keepAliveTime = 60
TimeUnit.SECONDS
→ Idle threads (beyond core) terminated after 60 seconds
```

**Important:** Only applies if `allowCoreThreadTimeOut = true` for core threads.

### 4. allowCoreThreadTimeOut

**Definition:** If `true`, core threads are terminated if idle for `keepAliveTime`.

**Default:** `false` (core threads never terminate)

**Example:**
```java
allowCoreThreadTimeOut = true
keepAliveTime = 60 seconds
→ Core threads terminated after 60 seconds idle
```

### 5. workQueue

**Definition:** Queue to hold tasks before they are picked up by worker threads.

**Types:**
- **Bounded Queue:** Fixed size (e.g., `ArrayBlockingQueue(10)`)
- **Unbounded Queue:** No size limit (e.g., `LinkedBlockingQueue`)

**Example:**
```java
BlockingQueue<Runnable> queue = new ArrayBlockingQueue<>(5);
// Queue size: 5 tasks
```

**Recommendation:** Use **bounded queue** (better control)

### 6. threadFactory

**Definition:** Factory to create custom threads (name, priority, daemon flag).

**Example:**
```java
ThreadFactory factory = new ThreadFactory() {
    @Override
    public Thread newThread(Runnable r) {
        Thread thread = new Thread(r);
        thread.setName("CustomThread-" + thread.getId());
        thread.setPriority(Thread.NORM_PRIORITY);
        thread.setDaemon(false);
        return thread;
    }
};
```

### 7. rejectedExecutionHandler

**Definition:** Handler for tasks that cannot be accepted (when pool and queue are full).

**Types:**
- **AbortPolicy:** Throws `RejectedExecutionException` (default)
- **DiscardPolicy:** Silently discards task
- **CallerRunsPolicy:** Executes task in caller's thread
- **DiscardOldestPolicy:** Discards oldest task in queue, adds new task

**Example:**
```java
RejectedExecutionHandler handler = new RejectedExecutionHandler() {
    @Override
    public void rejectedExecution(Runnable r, ThreadPoolExecutor executor) {
        System.out.println("Task rejected: " + r);
        // Log or handle rejection
    }
};
```

---

## Thread Pool Flow

### Complete Flow Diagram

```
Task Arrives
    ↓
Is thread available in pool?
    ↓ Yes → Assign to thread → Execute
    ↓ No
Is queue not full?
    ↓ Yes → Add to queue → Wait
    ↓ No
Can create more threads? (current < maximum)
    ↓ Yes → Create new thread → Assign task
    ↓ No
Reject task (call handler)
```

### Detailed Example

**Configuration:**
- `corePoolSize = 2`
- `maximumPoolSize = 4`
- `queueSize = 2`

**Scenario:**
```
Task 1 arrives → Thread 1 picks it (busy)
Task 2 arrives → Thread 2 picks it (busy)
Task 3 arrives → Queue (both threads busy)
Task 4 arrives → Queue
Task 5 arrives → Create Thread 3 (queue full, can create more)
Task 6 arrives → Create Thread 4 (queue full, can create more)
Task 7 arrives → Reject (all threads busy, queue full, max reached)
```

**Why Queue First, Then Create Thread?**

**Reason:** Core pool size is designed for **average workload**. Most requests can be handled by core threads + queue. Only create additional threads for **peak loads**.

**Example:**
```
Core: 3 threads (sufficient for average)
Queue: 10 tasks
→ Most requests handled by 3 threads + queue
→ Additional threads only for sudden peaks
→ Avoids creating unnecessary threads
```

---

## Thread Pool Lifecycle

### States

**1. RUNNING:**
- **Accepts new tasks**
- **Processes submitted tasks**
- **Normal operation state**

**2. SHUTDOWN:**
- **Does NOT accept new tasks**
- **Continues processing existing tasks**
- **Transition:** `shutdown()` method called

**3. STOP:**
- **Does NOT accept new tasks**
- **Stops processing existing tasks**
- **Interrupts running tasks**
- **Transition:** `shutdownNow()` method called

**4. TERMINATED:**
- **All tasks completed**
- **All threads terminated**
- **Final state**

### State Transitions

```
RUNNING
  ↓ shutdown()
SHUTDOWN → (tasks complete) → TERMINATED
  ↓ shutdownNow()
STOP → (force stop) → TERMINATED
```

### Methods

**shutdown():**
```java
executor.shutdown();
// Stops accepting new tasks
// Continues processing existing tasks
// Graceful shutdown
```

**shutdownNow():**
```java
List<Runnable> pendingTasks = executor.shutdownNow();
// Stops accepting new tasks
// Interrupts running tasks
// Returns list of pending tasks
// Forceful shutdown
```

**awaitTermination():**
```java
boolean terminated = executor.awaitTermination(10, TimeUnit.SECONDS);
// Waits for executor to terminate
// Returns true if terminated within timeout
// Returns false if timeout exceeded
// Optional functionality (just checks status)
```

**isTerminated():**
```java
boolean isTerminated = executor.isTerminated();
// Checks if executor is terminated
```

---

## How to Decide Core Pool Size?

### Interview Question

**Question:** "Why did you choose core pool size as 2? Why not 10 or 15?"

**Answer:** Consider multiple factors:

### Factors to Consider

**1. CPU Cores:**
- **Formula:** `Number of CPU cores × (1 + Wait Time / Processing Time)`
- **Example:** 64 cores, CPU-intensive → ~64 threads
- **Example:** 64 cores, IO-intensive → More threads

**2. JVM Memory:**
- **Calculate available memory** for threads
- **Each thread needs:** Stack (1-2 MB) + other overhead
- **Example:** 500 MB available, 5 MB per thread → Max 100 threads

**3. Task Nature:**
- **CPU-intensive:** Threads ≈ CPU cores
- **IO-intensive:** Threads > CPU cores (threads wait during IO)

**4. Memory per Request:**
- **Calculate:** How much heap memory each request needs
- **Example:** 10 MB per request, 1 GB heap → Max 60-70 requests (60% of heap)

**5. Concurrency Requirements:**
- **High concurrency:** More threads
- **Low concurrency:** Fewer threads

### Calculation Example

**Step 1: CPU Cores**
```
CPU cores: 64
Task: CPU-intensive (wait time ≈ 0)
Threads needed: 64 × (1 + 0) = 64
```

**Step 2: JVM Memory**
```
Total JVM: 2 GB
Heap: 1 GB
Code cache: 128 MB
JVM overhead: 256 MB
Available: 500 MB

Per thread: 5 MB
Max threads: 500 / 5 = 100
```

**Step 3: Memory per Request**
```
Heap: 1 GB
Per request: 10 MB
Safe usage: 60% of heap = 600 MB
Max concurrent requests: 600 / 10 = 60
```

**Step 4: Final Decision**
```
From CPU: 64 threads
From JVM: 100 threads
From Memory: 60 threads

Minimum: 60 (most restrictive)
Maximum: 64 (CPU cores)

Configuration:
  corePoolSize: 60
  maximumPoolSize: 64
```

**Step 5: Iterative Refinement**
- **Load testing** with these numbers
- **Monitor** performance
- **Adjust** based on results

### Best Practices

1. **Start with formula:** CPU cores × (1 + Wait/Process)
2. **Check memory constraints:** JVM memory, heap per request
3. **Consider task nature:** CPU vs IO intensive
4. **Load test:** Validate with real workload
5. **Monitor and adjust:** Refine based on metrics

---

## Summary

### Thread Pool Benefits

1. **Save thread creation time** (reuse threads)
2. **Remove lifecycle management** (framework handles it)
3. **Better performance** (less context switching)

### ThreadPoolExecutor Parameters

- **corePoolSize:** Minimum threads (always present)
- **maximumPoolSize:** Maximum threads (can create more)
- **keepAliveTime:** Idle thread timeout
- **workQueue:** Task queue (bounded/unbounded)
- **threadFactory:** Custom thread creation
- **rejectedExecutionHandler:** Handle rejected tasks

### Thread Pool Flow

1. Check available thread → Assign
2. If busy → Check queue → Add if space
3. If queue full → Create new thread (if < max)
4. If max reached → Reject task

### Lifecycle States

- **RUNNING:** Normal operation
- **SHUTDOWN:** No new tasks, finish existing
- **STOP:** Force stop
- **TERMINATED:** All done

### Deciding Core Pool Size

Consider:
- CPU cores
- JVM memory
- Task nature (CPU/IO intensive)
- Memory per request
- Concurrency requirements
- Load testing results

---

## Key Takeaways

1. **Thread Pool** = Collection of pre-created reusable threads
2. **Core Pool Size** = Minimum threads always present
3. **Maximum Pool Size** = Maximum threads that can be created
4. **Queue** = Holds tasks when all threads busy
5. **Flow:** Thread available → Assign, else queue → Create if needed → Reject if max
6. **Core pool size** depends on CPU, memory, task nature, and load testing

---

## Interview Questions

1. **What is a thread pool?**  
   Collection of pre-created threads that can be reused to execute tasks.

2. **What are the advantages of thread pool?**  
   Save thread creation time, remove lifecycle management, better performance (less context switching).

3. **What is core pool size?**  
   Minimum number of threads that are always present in the pool, even when idle.

4. **What is maximum pool size?**  
   Maximum number of threads that can be created in the pool.

5. **When are additional threads created?**  
   When all core threads are busy, queue is full, and current threads < maximum.

6. **Why use queue before creating additional threads?**  
   Core threads are sufficient for average workload. Queue handles most cases. Additional threads only for peaks.

7. **What is the difference between shutdown() and shutdownNow()?**  
   shutdown() stops accepting new tasks but continues existing. shutdownNow() interrupts running tasks and stops immediately.

8. **What is awaitTermination()?**  
   Waits for executor to terminate within timeout. Returns true if terminated, false if timeout exceeded.

9. **How to decide core pool size?**  
   Consider CPU cores, JVM memory, task nature (CPU/IO), memory per request, concurrency requirements, and load testing.

10. **What is the formula for thread pool size?**  
    CPU cores × (1 + Wait Time / Processing Time), then adjust based on memory constraints.

