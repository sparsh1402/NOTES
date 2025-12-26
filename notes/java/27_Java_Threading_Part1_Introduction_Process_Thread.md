# Java Threading - Part 1: Introduction, Process, and Thread

## Table of Contents
- [Introduction](#introduction)
- [What is Process?](#what-is-process)
- [What is Thread?](#what-is-thread)
- [Process vs Thread](#process-vs-thread)
- [JVM Instance and Memory Areas](#jvm-instance-and-memory-areas)
- [Thread Lifecycle](#thread-lifecycle)
- [Context Switching](#context-switching)
- [Multitasking vs Multithreading](#multitasking-vs-multithreading)
- [Summary](#summary)

---

## Introduction

**Multi-threading** allows a program to perform **multiple operations at the same time**.

**Key Benefits:**
- **Improved performance** by task parallelism
- **Better responsiveness** to clients
- **Efficient resource sharing**

**Key Challenges:**
- **Concurrency issues** (deadlock, data inconsistency)
- **Synchronization overhead**
- **Complex debugging and testing**

---

## What is Process?

### Definition

**Process** is an **instance of a program that is getting executed**.

**Visual Representation:**
```
Program (Java File):
  test.java
    ↓ (Compilation: javac test.java)
  Bytecode (test.class)
    ↓ (Execution: java test)
  Process Created
```

### How Process is Created

**Step-by-Step:**
1. **Compile:** `javac test.java` → Generates bytecode
2. **Execute:** `java test` → JVM starts a **new process**
3. **Process created:** Allocates resources (memory, etc.)

**Example:**
```java
public class MultiThreadingLearning {
    public static void main(String[] args) {
        System.out.println(Thread.currentThread().getName());
        // Output: main
    }
}
```

**When executed:**
- JVM creates a **new process**
- Process has its own **memory space**
- Process starts with **one thread** (main thread)

### Process Properties

**Key Characteristics:**
- **Independent:** Each process has its own memory space
- **Isolated:** Processes don't share resources
- **Resource allocation:** OS allocates resources when process is created
- **Heap memory:** Each process has its own heap memory

**Visual Representation:**
```
Process 1:
  ┌─────────────┐
  │   Heap      │
  │   Stack      │
  │   Code       │
  └─────────────┘

Process 2:
  ┌─────────────┐
  │   Heap      │
  │   Stack      │
  │   Code       │
  └─────────────┘

(No resource sharing between processes)
```

### Setting Heap Size

**JVM Heap Memory Configuration:**
```bash
# Set initial heap size
java -Xms256m MyClass

# Set maximum heap size
java -Xmx2g MyClass

# Combined
java -Xms256m -Xmx2g MyClass
```

**Note:** Each process gets its own JVM instance with allocated heap memory.

---

## What is Thread?

### Definition

**Thread** is the **smallest sequence of instructions that are executed by CPU independently**.

**Key Points:**
- **Lightweight process:** Thread is also called lightweight process
- **Multiple threads:** One process can have multiple threads
- **Main thread:** When process is created, it starts with one thread (main thread)

**Visual Representation:**
```
Process:
  ┌─────────────────────────────┐
  │  Thread 1 (Main)            │
  │  Thread 2                   │
  │  Thread 3                   │
  └─────────────────────────────┘
```

### Thread Creation

**When process is created:**
- **One thread automatically created:** Main thread
- **Additional threads:** Can be created from main thread

**Example:**
```java
public class MultiThreadingLearning {
    public static void main(String[] args) {
        // Main thread
        System.out.println(Thread.currentThread().getName());
        // Output: main
        
        // Can create more threads here
    }
}
```

---

## Process vs Thread

### Comparison

| Aspect | Process | Thread |
|--------|---------|--------|
| **Definition** | Instance of program being executed | Smallest sequence of instructions executed by CPU |
| **Creation** | Created when program is executed | Created within a process |
| **Memory** | Has its own memory space | Shares memory with other threads in same process |
| **Isolation** | Completely isolated | Share resources within process |
| **Resource Sharing** | No resource sharing | Share code segment, data segment, heap |
| **Communication** | Inter-process communication (IPC) | Direct memory sharing |
| **Overhead** | Heavy (more memory, time) | Lightweight (less memory, time) |

### Visual Comparison

```
Process 1:                    Process 2:
┌─────────────────┐          ┌─────────────────┐
│  Thread 1      │          │  Thread 1      │
│  Thread 2      │          │  Thread 2      │
│  Thread 3      │          │                 │
└─────────────────┘          └─────────────────┘
     ↓                              ↓
  (No sharing)              (No sharing)

Multitasking: Multiple processes running
Multithreading: Multiple threads within one process
```

---

## JVM Instance and Memory Areas

### JVM Instance Per Process

**Key Concept:** Each process gets its own **JVM instance**.

**Visual Representation:**
```
Process 1 → JVM Instance 1
Process 2 → JVM Instance 2
Process 3 → JVM Instance 3

(Each JVM instance is independent)
```

### Memory Areas in JVM

**JVM has multiple memory areas:**

1. **Heap Memory**
   - Stores objects created with `new` keyword
   - Shared among all threads in the process
   - Managed by garbage collector

2. **Stack Memory**
   - Stores method calls and local variables
   - **Each thread has its own stack**
   - Not shared between threads

3. **Code Segment**
   - Stores compiled bytecode/machine code
   - **Shared among all threads** (read-only)
   - Contains instructions to be executed

4. **Data Segment**
   - Stores global and static variables
   - **Shared among all threads**
   - Requires synchronization for modification

5. **Register**
   - Stores intermediate values during execution
   - **Each thread has its own register**
   - Used for context switching

6. **Program Counter (PC)**
   - Points to current instruction being executed
   - **Each thread has its own program counter**
   - Increments after each instruction

**Visual Representation:**
```
JVM Instance:
┌─────────────────────────────────────┐
│  Code Segment (Shared)              │ ← All threads share
│  Data Segment (Shared)              │ ← All threads share
│  Heap Memory (Shared)                │ ← All threads share
│                                     │
│  Thread 1:                          │
│    ┌─────────────┐                  │
│    │ Stack       │                  │ ← Thread-specific
│    │ Register    │                  │ ← Thread-specific
│    │ PC          │                  │ ← Thread-specific
│    └─────────────┘                  │
│                                     │
│  Thread 2:                          │
│    ┌─────────────┐                  │
│    │ Stack       │                  │ ← Thread-specific
│    │ Register    │                  │ ← Thread-specific
│    │ PC          │                  │ ← Thread-specific
│    └─────────────┘                  │
└─────────────────────────────────────┘
```

### Memory Sharing Details

**Shared (All Threads):**
- **Code Segment:** Machine code (read-only)
- **Data Segment:** Global/static variables (read-write, needs synchronization)
- **Heap Memory:** Objects (read-write, needs synchronization)

**Not Shared (Thread-Specific):**
- **Stack:** Method calls, local variables
- **Register:** Intermediate values
- **Program Counter:** Current instruction address

---

## Thread Lifecycle

### Thread States

**Java thread has the following states:**

1. **NEW**
   - Thread object created but not started
   - `new Thread()` → Thread in NEW state

2. **RUNNABLE**
   - Thread is ready to run, waiting for CPU time
   - `thread.start()` → Thread enters RUNNABLE state
   - Includes both "runnable" (waiting) and "running" (executing)

3. **BLOCKED**
   - Thread is blocked waiting for:
     - I/O operation (file read, database query)
     - Lock acquisition (synchronized block/method)
   - **Releases monitor locks** when blocked

4. **WAITING**
   - Thread explicitly waits using `wait()` method
   - Waits until `notify()` or `notifyAll()` is called
   - **Releases monitor locks** when waiting

5. **TIMED_WAITING**
   - Thread waits for specific time period
   - `Thread.sleep(time)` → Thread enters TIMED_WAITING
   - Automatically returns to RUNNABLE after time expires
   - **Does NOT release monitor locks**

6. **TERMINATED**
   - Thread has completed execution
   - Cannot be restarted

**State Transition Diagram:**
```
        NEW
         │
         │ start()
         ↓
    RUNNABLE ←─────────────────┐
         │                      │
         │                      │
    ┌────┴────┐                 │
    │         │                 │
    ↓         ↓                 │
BLOCKED  WAITING               │
    │         │                 │
    │         │                 │
    └────┬────┘                 │
         │                      │
         │                      │
         ↓                      │
  TIMED_WAITING                 │
         │                      │
         │                      │
         └──────────────────────┘
         │
         │ (completion)
         ↓
    TERMINATED
```

### State Details

**NEW State:**
- Thread object created but `start()` not called
- Just an object in memory

**RUNNABLE State:**
- Thread is ready to run
- Waiting for CPU time (runnable)
- Or currently executing (running)
- OS scheduler decides when to execute

**BLOCKED State:**
- Waiting for I/O operation
- Waiting to acquire lock
- **Releases all monitor locks**

**WAITING State:**
- Called `wait()` method
- Waiting for `notify()` or `notifyAll()`
- **Releases all monitor locks**

**TIMED_WAITING State:**
- Called `Thread.sleep(time)`
- Waiting for specific time period
- **Does NOT release monitor locks**

**TERMINATED State:**
- Thread execution completed
- Cannot be restarted

---

## Context Switching

### What is Context Switching?

**Context switching** is the process of saving the state of a thread and restoring the state of another thread so execution can be resumed from the same point later.

### How Context Switching Works

**Scenario: Single CPU Core**

**Visual Flow:**
```
Time T1: Thread 1 executing
  CPU Register: [Thread 1 data]
  Program Counter: [Thread 1 instruction address]

Time T2: Thread 1 time slice ends
  Save Thread 1 state to Thread 1's register
  Load Thread 2 state from Thread 2's register
  CPU Register: [Thread 2 data]
  Program Counter: [Thread 2 instruction address]

Time T3: Thread 2 executing
  CPU executes Thread 2 instructions

Time T4: Thread 2 time slice ends
  Save Thread 2 state
  Load Thread 1 state (resume from where it left)
```

**Step-by-Step:**
1. **Thread 1 executing:** CPU runs Thread 1 instructions
2. **Time slice ends:** OS scheduler interrupts
3. **Save state:** Thread 1's register stores intermediate results
4. **Load Thread 2:** Thread 2's register loaded into CPU
5. **Thread 2 executes:** CPU runs Thread 2 instructions
6. **Repeat:** Process continues for all threads

**Key Points:**
- **Register stores state:** Each thread's register holds its execution state
- **Program Counter:** Points to next instruction to execute
- **Appears parallel:** Multiple threads appear to run simultaneously
- **Actually sequential:** On single CPU, threads take turns

### Multiple CPU Cores

**When you have multiple CPU cores:**

```
CPU Core 1: Thread 1 executing
CPU Core 2: Thread 2 executing
CPU Core 3: Thread 3 executing

(True parallel execution - no context switching needed)
```

**If threads > CPU cores:**
- Some threads run in parallel (one per core)
- Remaining threads wait (context switching)

---

## Multitasking vs Multithreading

### Multitasking

**Definition:** Running multiple processes simultaneously.

**Characteristics:**
- **Different processes:** Process 1, Process 2, Process 3
- **No resource sharing:** Each process has its own memory
- **Independent:** Processes don't interfere with each other
- **Heavy overhead:** More memory and time required

**Visual:**
```
Process 1 (Task 1)    Process 2 (Task 2)    Process 3 (Task 3)
     ↓                      ↓                      ↓
  (No sharing)          (No sharing)          (No sharing)
```

### Multithreading

**Definition:** Running multiple threads within a single process.

**Characteristics:**
- **Same process:** Multiple threads in one process
- **Resource sharing:** Threads share code segment, data segment, heap
- **Coordination needed:** Synchronization required
- **Lightweight:** Less memory and time overhead

**Visual:**
```
Process:
  ┌─────────────────────┐
  │  Thread 1           │
  │  Thread 2           │ ← Share resources
  │  Thread 3           │
  └─────────────────────┘
```

### Key Difference

| Aspect | Multitasking | Multithreading |
|--------|--------------|----------------|
| **Unit** | Process | Thread |
| **Resource Sharing** | ❌ No | ✅ Yes |
| **Memory** | Separate for each | Shared within process |
| **Communication** | IPC (Inter-Process) | Direct memory access |
| **Overhead** | High | Low |
| **Isolation** | Complete | Partial |

---

## Summary

### Process

- **Definition:** Instance of program being executed
- **Creation:** When `java MyClass` is executed
- **Resources:** Has its own memory space (heap, stack, etc.)
- **Isolation:** Completely independent from other processes

### Thread

- **Definition:** Smallest sequence of instructions executed by CPU
- **Creation:** Starts with main thread, can create more
- **Resources:** Shares code segment, data segment, heap with other threads
- **Isolation:** Has its own stack, register, program counter

### Memory Areas

**Shared (All Threads):**
- Code Segment (read-only)
- Data Segment (global/static variables)
- Heap Memory (objects)

**Thread-Specific:**
- Stack (method calls, local variables)
- Register (intermediate values)
- Program Counter (current instruction)

### Thread States

1. **NEW:** Created but not started
2. **RUNNABLE:** Ready to run or running
3. **BLOCKED:** Waiting for I/O or lock
4. **WAITING:** Called `wait()`
5. **TIMED_WAITING:** Called `sleep()`
6. **TERMINATED:** Execution completed

### Context Switching

- **Single CPU:** Threads take turns (context switching)
- **Multiple CPUs:** True parallel execution possible
- **Register:** Stores thread state during context switch

### Multitasking vs Multithreading

- **Multitasking:** Multiple processes (no resource sharing)
- **Multithreading:** Multiple threads in one process (resource sharing)

---

## Key Takeaways

1. **Process** = Instance of program being executed
2. **Thread** = Smallest unit of execution
3. **One process** can have **multiple threads**
4. **Threads share** code segment, data segment, heap
5. **Threads have** their own stack, register, program counter
6. **Context switching** allows multiple threads on single CPU
7. **Multitasking** = multiple processes, **Multithreading** = multiple threads

---

## Interview Questions

1. **What is a process?**  
   Instance of a program that is getting executed. Has its own memory space.

2. **What is a thread?**  
   Smallest sequence of instructions executed by CPU independently. Lightweight process.

3. **What is the difference between process and thread?**  
   Process has its own memory, thread shares memory with other threads in same process.

4. **What memory areas are shared between threads?**  
   Code segment, data segment, heap memory.

5. **What memory areas are thread-specific?**  
   Stack, register, program counter.

6. **What are the thread states?**  
   NEW, RUNNABLE, BLOCKED, WAITING, TIMED_WAITING, TERMINATED.

7. **What is context switching?**  
   Process of saving thread state and restoring another thread's state for execution.

8. **What is the difference between multitasking and multithreading?**  
   Multitasking = multiple processes (no sharing), Multithreading = multiple threads (sharing resources).

9. **When does a process get created?**  
   When `java MyClass` is executed, JVM creates a new process.

10. **What is the main thread?**  
    Initial thread created when process starts. All Java programs start with main thread.

