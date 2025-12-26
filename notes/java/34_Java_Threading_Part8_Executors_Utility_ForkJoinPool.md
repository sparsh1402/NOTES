# Java Threading - Part 8: Executors Utility Class and Fork-Join Pool

## Table of Contents
- [Executors Utility Class](#executors-utility-class)
- [Fixed Thread Pool](#fixed-thread-pool)
- [Cached Thread Pool](#cached-thread-pool)
- [Single Thread Executor](#single-thread-executor)
- [Work Stealing Pool (Fork-Join Pool)](#work-stealing-pool-fork-join-pool)
- [Fork-Join Pool Details](#fork-join-pool-details)
- [RecursiveTask and RecursiveAction](#recursivetask-and-recursiveaction)
- [Summary](#summary)

---

## Executors Utility Class

### What is Executors?

**Executors** is a **utility class** in `java.util.concurrent` package that provides **factory methods** to create thread pool executors.

**Purpose:** Simplify thread pool creation (instead of using ThreadPoolExecutor constructor).

**Location:** `java.util.concurrent.Executors`

### Factory Methods

1. **newFixedThreadPool()** - Fixed number of threads
2. **newCachedThreadPool()** - Dynamic thread creation
3. **newSingleThreadExecutor()** - Single thread
4. **newWorkStealingPool()** - Fork-Join pool

---

## Fixed Thread Pool

### What is Fixed Thread Pool?

**Fixed Thread Pool** creates a thread pool with **fixed number of threads** (min = max).

**Method:**
```java
ExecutorService executor = Executors.newFixedThreadPool(5);
```

### Properties

- **Core Pool Size:** 5 (same as provided)
- **Maximum Pool Size:** 5 (same as core)
- **Queue:** Unbounded (LinkedBlockingQueue)
- **Thread Alive Time:** Always alive (even when idle)

### Example

```java
ExecutorService executor = Executors.newFixedThreadPool(5);

for (int i = 0; i < 10; i++) {
    executor.submit(() -> {
        System.out.println("Task: " + Thread.currentThread().getName());
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    });
}

executor.shutdown();
```

**Behavior:**
- **5 threads** created initially
- **5 tasks** assigned immediately
- **5 tasks** wait in queue
- Threads process tasks from queue as they complete

### When to Use?

**Use when:**
- **Exact number of threads** needed
- **Predictable workload**
- **Limited concurrency** requirement

**Disadvantage:**
- **Not good for heavy workload** (limited concurrency)
- **Unbounded queue** (can grow large)

---

## Cached Thread Pool

### What is Cached Thread Pool?

**Cached Thread Pool** creates threads **dynamically** as needed.

**Method:**
```java
ExecutorService executor = Executors.newCachedThreadPool();
```

### Properties

- **Core Pool Size:** 0 (no threads initially)
- **Maximum Pool Size:** Integer.MAX_VALUE (unlimited)
- **Queue:** SynchronousQueue (size = 0, no queue)
- **Thread Alive Time:** 60 seconds (idle threads terminated)

### How It Works

**Flow:**
1. **Task arrives** → Check if thread available
2. **If available** → Assign to thread
3. **If not available** → **Create new thread** immediately
4. **Thread idle 60s** → Terminate thread

**Example:**
```java
ExecutorService executor = Executors.newCachedThreadPool();

for (int i = 0; i < 100; i++) {
    executor.submit(() -> {
        System.out.println("Task: " + Thread.currentThread().getName());
        try {
            Thread.sleep(1000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    });
}

executor.shutdown();
```

**Behavior:**
- **100 threads** created (one per task)
- **No queue** (threads created immediately)
- **Threads terminate** after 60 seconds idle

### When to Use?

**Use when:**
- **Burst of short-lived tasks**
- **Tasks complete quickly**
- **Variable workload**

**Disadvantage:**
- **Can create too many threads** (memory issue)
- **Not suitable for long-running tasks**

---

## Single Thread Executor

### What is Single Thread Executor?

**Single Thread Executor** creates executor with **only one worker thread**.

**Method:**
```java
ExecutorService executor = Executors.newSingleThreadExecutor();
```

### Properties

- **Core Pool Size:** 1
- **Maximum Pool Size:** 1
- **Queue:** Unbounded (LinkedBlockingQueue)
- **Thread Alive Time:** Always alive

### Example

```java
ExecutorService executor = Executors.newSingleThreadExecutor();

for (int i = 0; i < 5; i++) {
    executor.submit(() -> {
        System.out.println("Task: " + Thread.currentThread().getName());
    });
}

executor.shutdown();
```

**Output:**
```
Task: pool-1-thread-1
Task: pool-1-thread-1
Task: pool-1-thread-1
Task: pool-1-thread-1
Task: pool-1-thread-1
```

**Behavior:**
- **Only one thread** (sequential execution)
- **Tasks processed one by one** (no concurrency)

### When to Use?

**Use when:**
- **Sequential processing** required
- **No concurrency** needed
- **Task ordering** important

**Disadvantage:**
- **No concurrency** at all

---

## Work Stealing Pool (Fork-Join Pool)

### What is Work Stealing Pool?

**Work Stealing Pool** creates a **Fork-Join Pool** executor.

**Method:**
```java
ExecutorService executor = Executors.newWorkStealingPool();
// Or with parallelism level:
ExecutorService executor = Executors.newWorkStealingPool(4);
```

**Internally:** Creates `ForkJoinPool` instance.

### What is Fork-Join Pool?

**Fork-Join Pool** is designed for **divide-and-conquer** tasks.

**Concepts:**
- **Fork:** Divide task into subtasks
- **Join:** Wait for subtasks to complete, combine results

**Purpose:** Bring **more parallelism** by dividing tasks into smaller chunks.

---

## Fork-Join Pool Details

### How Fork-Join Pool Works

**Key Differences from Regular Thread Pool:**

**Regular Thread Pool:**
```
Thread Pool:
  Thread 1, Thread 2
  Queue (shared)
```

**Fork-Join Pool:**
```
Thread Pool:
  Thread 1 (has its own deque)
  Thread 2 (has its own deque)
  Submission Queue (shared)
```

### Two Types of Queues

**1. Submission Queue:**
- **Shared queue** for all threads
- **Regular tasks** go here

**2. Work Stealing Queue (Deque):**
- **Each thread has its own deque**
- **Subtasks** go here (when fork is called)

### Priority System

**When thread becomes free:**
1. **First Priority:** Check **own work stealing queue**
2. **Second Priority:** Check **submission queue**
3. **Third Priority:** **Steal** from other thread's work stealing queue (from back)

### Visual Flow

```
Task arrives → Submission Queue
  ↓
Thread 1 picks task
  ↓
Task can be divided? (RecursiveTask/RecursiveAction)
  ↓ Yes
Fork into subtasks:
  - Subtask 1 → Thread 1 works on it
  - Subtask 2 → Thread 1's work stealing queue
  ↓
Thread 2 (free) → Steals Subtask 2 from Thread 1's queue
  ↓
Both threads work in parallel
  ↓
Join → Wait for subtasks, combine results
```

### Example Flow

```
Initial State:
  Thread 1: Busy (Task A)
  Thread 2: Free
  Submission Queue: Empty
  Thread 1 Work Queue: Empty
  Thread 2 Work Queue: Empty

Task A divides into:
  - Subtask A1 (Thread 1 works on it)
  - Subtask A2 (Thread 1's work queue)

Thread 2 (free):
  1. Check own work queue → Empty
  2. Check submission queue → Empty
  3. Steal from Thread 1's work queue → Subtask A2

Result:
  Thread 1: Working on A1
  Thread 2: Working on A2 (stolen)
  → Parallel execution ✅
```

---

## RecursiveTask and RecursiveAction

### How to Create Divisible Tasks?

**Extend one of these classes:**
- **RecursiveTask<V>:** Returns value
- **RecursiveAction:** No return value

### RecursiveTask Example

**Task:** Calculate sum of numbers from start to end.

```java
import java.util.concurrent.*;

class SumTask extends RecursiveTask<Integer> {
    private int start;
    private int end;
    private static final int THRESHOLD = 4;
    
    public SumTask(int start, int end) {
        this.start = start;
        this.end = end;
    }
    
    @Override
    protected Integer compute() {
        // Base case: small enough, compute directly
        if (end - start <= THRESHOLD) {
            int sum = 0;
            for (int i = start; i <= end; i++) {
                sum += i;
            }
            return sum;
        }
        
        // Divide: split into two subtasks
        int mid = (start + end) / 2;
        SumTask leftTask = new SumTask(start, mid);
        SumTask rightTask = new SumTask(mid + 1, end);
        
        // Fork: start parallel execution
        leftTask.fork();  // Put in work stealing queue
        // rightTask can be computed by current thread
        
        // Join: wait for results
        int rightResult = rightTask.compute();  // Compute in current thread
        int leftResult = leftTask.join();  // Wait for forked task
        
        // Combine results
        return leftResult + rightResult;
    }
}

public class ForkJoinExample {
    public static void main(String[] args) {
        ForkJoinPool pool = ForkJoinPool.commonPool();
        // Or: ExecutorService executor = Executors.newWorkStealingPool();
        
        SumTask task = new SumTask(1, 100);
        int result = pool.invoke(task);
        
        System.out.println("Sum: " + result);  // 5050
    }
}
```

### How Fork and Join Work

**Fork:**
```java
leftTask.fork();
// What happens:
// 1. Subtask put into current thread's work stealing queue
// 2. Current thread continues with rightTask
// 3. Other threads can steal leftTask from queue
```

**Join:**
```java
int leftResult = leftTask.join();
// What happens:
// 1. Wait for leftTask to complete
// 2. Get result when completed
// 3. Continue execution
```

### RecursiveAction Example

**Task:** Print numbers (no return value).

```java
class PrintTask extends RecursiveAction {
    private int start;
    private int end;
    private static final int THRESHOLD = 4;
    
    public PrintTask(int start, int end) {
        this.start = start;
        this.end = end;
    }
    
    @Override
    protected void compute() {
        if (end - start <= THRESHOLD) {
            // Base case: print directly
            for (int i = start; i <= end; i++) {
                System.out.print(i + " ");
            }
        } else {
            // Divide and fork
            int mid = (start + end) / 2;
            PrintTask leftTask = new PrintTask(start, mid);
            PrintTask rightTask = new PrintTask(mid + 1, end);
            
            leftTask.fork();
            rightTask.compute();  // Current thread
            leftTask.join();  // Wait for completion
        }
    }
}
```

### Why Deque (Double-Ended Queue)?

**Reason:** Work stealing happens from **back**, current thread consumes from **front**.

```
Work Stealing Queue (Deque):
  [Front] ← Thread 1 consumes from here
  Task 1
  Task 2
  Task 3
  [Back] ← Other threads steal from here
```

**Benefits:**
- **Current thread:** Fast access from front
- **Stealing threads:** Steal from back (less contention)

---

## Summary

### Executors Utility Class

**Factory Methods:**
- **newFixedThreadPool():** Fixed threads, unbounded queue
- **newCachedThreadPool():** Dynamic threads, no queue, 60s timeout
- **newSingleThreadExecutor():** One thread, sequential
- **newWorkStealingPool():** Fork-Join pool

### Fork-Join Pool

**Key Features:**
- **Two queues:** Submission queue (shared), Work stealing queue (per thread)
- **Work stealing:** Free threads steal from busy threads
- **Priority:** Own queue → Submission queue → Steal from others

### RecursiveTask vs RecursiveAction

- **RecursiveTask:** Returns value (extends `RecursiveTask<V>`)
- **RecursiveAction:** No return value (extends `RecursiveAction`)

### Fork and Join

- **fork():** Put subtask in work stealing queue (parallel execution)
- **join():** Wait for subtask to complete, get result

### Thread Count

**Default:** `Runtime.getRuntime().availableProcessors()`
- 4 CPU cores → 4 threads
- 8 CPU cores → 8 threads

**Custom:** `Executors.newWorkStealingPool(8)` → 8 threads

---

## Key Takeaways

1. **Executors** = Utility class with factory methods
2. **Fixed Thread Pool** = Fixed threads, unbounded queue
3. **Cached Thread Pool** = Dynamic threads, 60s timeout
4. **Single Thread Executor** = One thread, sequential
5. **Work Stealing Pool** = Fork-Join pool for divide-and-conquer
6. **Fork** = Divide task, put in work stealing queue
7. **Join** = Wait for subtask, combine results
8. **Work Stealing** = Free threads steal from busy threads' queues

---

## Interview Questions

1. **What is Executors utility class?**  
   Utility class providing factory methods to create thread pool executors easily.

2. **What is the difference between Fixed and Cached thread pool?**  
   Fixed has fixed threads, Cached creates threads dynamically. Fixed has unbounded queue, Cached has no queue.

3. **What is Fork-Join Pool?**  
   Thread pool designed for divide-and-conquer tasks. Uses work stealing algorithm.

4. **What is work stealing?**  
   Free threads steal tasks from busy threads' work stealing queues to maximize parallelism.

5. **What is the difference between RecursiveTask and RecursiveAction?**  
   RecursiveTask returns value, RecursiveAction doesn't return value.

6. **What does fork() do?**  
   Puts subtask into current thread's work stealing queue for parallel execution.

7. **What does join() do?**  
   Waits for forked subtask to complete and returns result.

8. **What are the two types of queues in Fork-Join Pool?**  
   Submission queue (shared) and Work stealing queue (per thread, deque).

9. **What is the priority when thread becomes free?**  
   Own work queue → Submission queue → Steal from other threads' queues.

10. **How many threads does work stealing pool create by default?**  
    Number of available processors (Runtime.getRuntime().availableProcessors()).

