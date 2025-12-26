# Java Memory Management

## Table of Contents
1. [Introduction](#introduction)
2. [Types of Memory](#types-of-memory)
3. [Stack Memory](#stack-memory)
4. [Heap Memory](#heap-memory)
5. [Types of References](#types-of-references)
6. [Garbage Collector](#garbage-collector)
7. [Garbage Collection Algorithms](#garbage-collection-algorithms)
8. [Summary](#summary)

---

## Introduction

Memory management is a **very important topic** for interviews and real-world Java development. Understanding how Java manages memory is crucial for writing efficient applications.

**What We've Covered So Far:**
- How to create classes
- How to create primitive data types
- How to create objects
- How to call methods

**Natural Question:** How are memories allocated to these?

**Answer:** JVM (Java Virtual Machine) manages memory automatically.

---

## Types of Memory

Java divides RAM memory into **two main parts**:

1. **Stack Memory**
2. **Heap Memory**

**Key Points:**
- JVM manages both types of memory
- Different types of data are stored in different memory areas
- Heap memory is generally **larger** than stack memory
- Heap has **only one copy** (shared)
- Stack has **multiple copies** (one per thread)

---

## Stack Memory

### What is Stored in Stack?

1. **Temporary Variables**
   - Variables created inside methods/blocks
   - Life span: within the method/block scope
   - Destroyed when scope ends

2. **Method Memory Blocks (Frames)**
   - Each method gets its own memory frame
   - Stores variables and references created within that method
   - Each method call creates a new frame

3. **Primitive Data Types**
   - `int`, `byte`, `short`, `long`, `float`, `double`, `boolean`, `char`
   - Stored directly in stack (values, not references)

4. **References to Heap Objects**
   - When you create objects with `new`, the object is stored in heap
   - The **reference** (address) to that object is stored in stack
   - Types of references: Strong, Weak, Soft, Phantom

5. **Thread-Specific**
   - Each thread has its own stack memory
   - Multiple threads = multiple stack copies
   - All threads share the same heap memory

### Characteristics of Stack Memory

1. **Scope-Based Visibility**
   - Variables are only visible within their scope
   - As soon as variable goes out of scope, it gets deleted

2. **LIFO (Last In First Out) Order**
   - Last item added is first to be removed
   - When method ends, its frame is removed from stack

3. **Stack Overflow Error**
   - Occurs when stack memory is full
   - Usually happens with deep recursion or too many method calls

### Example: Stack Memory in Action

```java
public class MemoryManagement {
    public static void main(String[] args) {
        int primitive = 10;                    // Primitive variable
        Person personObj = new Person();       // Object reference
        String stringLiteral = "24";           // String literal reference
        MemoryManagement memObj = new MemoryManagement(); // Object reference
        
        memObj.test(personObj);
    }
    
    void test(Person personObj) {
        Person personObj2 = personObj;         // Another reference
        String stringLiteral2 = "24";           // String literal (reused from pool)
        String stringLiteral3 = new String("24"); // String object
    }
}
```

**Memory Representation:**

```
Stack Memory (Main Method Frame):
┌─────────────────────────┐
│ primitive = 10          │ ← Primitive value stored directly
│ personObj → [Heap]      │ ← Reference to Person object
│ stringLiteral → [Pool]  │ ← Reference to string pool
│ memObj → [Heap]         │ ← Reference to MemoryManagement object
└─────────────────────────┘

Stack Memory (test Method Frame):
┌─────────────────────────┐
│ personObj → [Heap]      │ ← Reference (same object as main)
│ personObj2 → [Heap]      │ ← Reference (same object)
│ stringLiteral2 → [Pool]  │ ← Reference (reused "24")
│ stringLiteral3 → [Heap] │ ← Reference to new String object
└─────────────────────────┘
```

**What Happens:**
1. Main method frame is created
2. Variables are stored in main frame
3. `test()` method is called → new frame created
4. When `test()` ends → frame is removed (LIFO)
5. When `main()` ends → frame is removed
6. References are deleted, but **objects remain in heap**

**Who Cleans Up Heap Objects?** → **Garbage Collector**

---

## Heap Memory

### Structure of Heap Memory

Heap memory is divided into:

1. **Young Generation**
   - **Eden Space** - Where new objects are created
   - **Survivor Space (S0 and S1)** - Where surviving objects are moved

2. **Old Generation (Tenured)**
   - Long-lived objects are promoted here
   - Objects that survive multiple GC cycles

3. **Metaspace (Non-Heap)**
   - Stores class metadata
   - Stores static variables (class variables)
   - Stores constants (static final)
   - **Not part of heap memory**

### Object Lifecycle in Heap

**Step 1: Object Creation**
- All new objects are created in **Eden Space**

**Step 2: Minor GC (Garbage Collection)**
- Uses **Mark and Sweep algorithm**
- **Mark Phase:** Identifies objects with no references
- **Sweep Phase:** 
  - Deletes unreferenced objects
  - Moves surviving objects to **Survivor Space (S0 or S1)**
  - Increases object **age** by 1

**Step 3: Aging**
- Each time object survives GC, its age increases
- Age threshold is configurable (e.g., age = 3)

**Step 4: Promotion**
- When object age reaches threshold, it's **promoted** to **Old Generation**
- Old generation objects are long-lived and frequently used

**Step 5: Major GC**
- Runs less frequently than Minor GC
- Cleans up Old Generation
- Takes more time (more references, bigger objects)

### Example: Object Lifecycle

```
Initial State:
Eden: [obj1, obj2, obj3, obj4, obj5]

After First Minor GC (obj2, obj5 have no references):
Eden: [empty]
S0: [obj1(age=1), obj3(age=1), obj4(age=1)]
S1: [empty]
Deleted: obj2, obj5

New objects created:
Eden: [obj6, obj7]

After Second Minor GC (obj4, obj7 have no references):
Eden: [empty]
S0: [empty]
S1: [obj1(age=2), obj3(age=2), obj6(age=1)]
Deleted: obj4, obj7

After Third Minor GC (obj3 has no reference, threshold=3):
Eden: [empty]
S0: [obj1(age=3), obj6(age=2)]
S1: [empty]
Old Generation: [obj1] ← Promoted (age reached 3)
Deleted: obj3
```

### Metaspace vs PermGen

**PermGen (Permanent Generation) - Old (Before Java 7):**
- Part of heap memory
- Fixed size (not expandable)
- Out of memory error when full

**Metaspace (Java 7+):**
- **Not part of heap** (non-heap)
- **Expandable** (grows as needed)
- Stores same data: class metadata, static variables, constants

**Key Difference:**
- PermGen: Fixed size, part of heap
- Metaspace: Expandable, separate from heap

---

## Types of References

### 1. Strong Reference

**Definition:** Default reference type in Java. Object cannot be garbage collected as long as strong reference exists.

**Example:**
```java
Person pObj = new Person();  // Strong reference
```

**Characteristics:**
- Most common type of reference
- Object **will not** be garbage collected while strong reference exists
- Garbage collector checks: "Is there a strong reference?" → If yes, don't delete

### 2. Weak Reference

**Definition:** Reference that allows garbage collector to free the object even if weak reference exists.

**How to Create:**
```java
import java.lang.ref.WeakReference;

Person personObj = new Person();
WeakReference<Person> weakPObj = new WeakReference<>(personObj);
```

**Characteristics:**
- Object **can be garbage collected** even if weak reference exists
- As soon as GC runs, it may free the object
- If you try to access after GC, you get `null`

**Use Case:**
- When you want object to be available, but don't want to prevent GC from cleaning it up

### 3. Soft Reference

**Definition:** Similar to weak reference, but GC only frees it when memory is **very urgent**.

**How to Create:**
```java
import java.lang.ref.SoftReference;

Person personObj = new Person();
SoftReference<Person> softPObj = new SoftReference<>(personObj);
```

**Characteristics:**
- GC **can** free it, but only when memory is **very low**
- If memory is sufficient, GC keeps it alive
- More "lenient" than weak reference

**Difference from Weak:**
- **Weak:** GC frees immediately when it runs
- **Soft:** GC frees only when memory is critically low

### 4. Phantom Reference

**Definition:** Weakest reference type. Used for cleanup operations.

**Note:** Less commonly used, mainly for advanced memory management scenarios.

### Summary Table

| Reference Type | GC Behavior | Use Case |
|---------------|-------------|----------|
| **Strong** | Never deleted while reference exists | Default, most common |
| **Weak** | Deleted as soon as GC runs | When object can be freed anytime |
| **Soft** | Deleted only when memory is urgent | When object should stay if memory available |
| **Phantom** | Weakest, for cleanup | Advanced scenarios |

### Changing References

**Ways to make objects eligible for GC:**

1. **Set reference to null:**
   ```java
   Person obj = new Person();
   obj = null;  // Object now eligible for GC
   ```

2. **Reassign reference:**
   ```java
   Person obj1 = new Person();  // Object 1
   Person obj2 = new Person();  // Object 2
   obj1 = obj2;  // Object 1 now eligible for GC
   ```

3. **Out of scope:**
   ```java
   void method() {
       Person obj = new Person();
   }  // obj goes out of scope, object eligible for GC
   ```

---

## Garbage Collector

### What is Garbage Collector?

**Garbage Collector (GC)** is a program that automatically frees memory by deleting **unreferenced objects** from the heap.

### How GC Works

1. **Scans heap memory** for objects
2. **Checks references** from stack
3. **Marks objects** with no references
4. **Deletes marked objects** (frees memory)

### When Does GC Run?

1. **Periodically** - JVM decides when to run
2. **When heap is getting full** - JVM triggers GC
3. **Manually** - `System.gc()` (but not guaranteed)

### System.gc() Method

```java
System.gc();  // Suggests to JVM to run garbage collector
```

**Important Points:**
- **No guarantee** that GC will run
- JVM has **full control** over when GC runs
- It's a **suggestion**, not a command
- JVM may ignore it if memory is sufficient

**Why No Guarantee?**
- GC is **expensive** (pauses application)
- JVM optimizes GC timing for best performance
- Running GC too often can hurt performance

### Automatic Memory Management

Java provides **automatic memory management**:
- You don't need to manually free memory
- JVM automatically manages memory
- GC runs periodically based on JVM's decision
- If heap fills up fast → GC runs more frequently
- If heap has sufficient space → GC runs less frequently

---

## Garbage Collection Algorithms

### 1. Mark and Sweep

**Two Phases:**

1. **Mark Phase:**
   - Identifies all objects that have **no references**
   - Marks them as eligible for deletion

2. **Sweep Phase:**
   - Removes marked objects from memory
   - Frees up the memory space

**Characteristics:**
- Basic GC algorithm
- Simple but can cause memory fragmentation

### 2. Mark and Sweep with Compaction

**Additional Step: Compaction**

After sweep phase:
- **Compacts** remaining objects together
- Moves objects to create **contiguous free space**
- Makes it easier to allocate new objects

**Why Compaction?**
- Without compaction: Memory has fragments (gaps)
- With compaction: Free space is contiguous
- Easier to allocate large objects

**Example:**
```
Before Compaction:
[Object1][Free][Object2][Free][Object3]
         ↑ Gap        ↑ Gap

After Compaction:
[Object1][Object2][Object3][Free][Free]
                          ↑ Contiguous free space
```

### Types of Garbage Collectors

#### 1. Serial GC

**How it works:**
- Uses **only one thread** for garbage collection
- Works on both young and old generation
- One thread for minor GC, one thread for major GC

**Disadvantages:**
- **Slow** - only one thread working
- **Long pause times** - application stops longer

**When GC runs:**
- All application threads **pause** (stop the world)
- GC completes its work
- Application threads resume

**Use Case:**
- Small applications
- Single-core systems

#### 2. Parallel GC (Java 8 Default)

**How it works:**
- Uses **multiple threads** based on CPU cores
- 2 cores = 2 GC threads, 4 cores = 4 GC threads
- Works **parallelly** (multiple threads at once)

**Advantages:**
- **Faster** than Serial GC
- **Less pause time** (work done faster)
- Better for multi-core systems

**Disadvantages:**
- Still has **pause time** (application threads stop)
- But pause is shorter than Serial GC

**Use Case:**
- Default in Java 8
- Multi-core systems
- Applications that can tolerate short pauses

#### 3. Concurrent Mark and Sweep (CMS)

**How it works:**
- GC threads work **concurrently** with application threads
- Application threads **don't stop** (or stop very little)
- GC and application run **in parallel**

**Advantages:**
- **Minimal pause time**
- Application continues running during GC
- Better user experience

**Disadvantages:**
- **No guarantee** - JVM doesn't guarantee 100% no pause
- **No memory compaction** - can cause fragmentation
- More complex

**Use Case:**
- Applications requiring low latency
- Real-time systems

#### 4. G1 Garbage Collector

**How it works:**
- **Better version** of CMS
- Tries to **guarantee** minimal pause times
- **Brings compaction** - defragments memory
- Divides heap into regions for better management

**Advantages:**
- **Low pause times**
- **Memory compaction** included
- Better throughput and latency

**Characteristics:**
- Default in newer Java versions
- Improved version of previous GCs
- Better balance of performance and pause time

### GC Performance Metrics

**Throughput:**
- Number of requests processed per unit time
- Higher throughput = more requests processed
- Example: 1000 requests/minute → 1500 requests/minute

**Latency:**
- Time taken to process a request
- Lower latency = faster response
- Reduced pause time → lower latency

**Relationship:**
- When pause time decreases → Throughput increases, Latency decreases
- Better GC → Better application performance

---

## Summary

### Key Takeaways

1. **Two Types of Memory:**
   - **Stack:** Temporary variables, method frames, primitives, references
   - **Heap:** Objects, arrays, string pool

2. **Stack Characteristics:**
   - Thread-specific (one per thread)
   - LIFO order
   - Scope-based visibility
   - Stack overflow when full

3. **Heap Structure:**
   - **Young Generation:** Eden + Survivor Spaces (S0, S1)
   - **Old Generation:** Long-lived objects
   - **Metaspace:** Class metadata, static variables, constants

4. **Object Lifecycle:**
   - Created in Eden
   - Survives GC → moved to Survivor, age increases
   - Reaches age threshold → promoted to Old Generation

5. **Types of References:**
   - **Strong:** Never deleted while reference exists
   - **Weak:** Deleted as soon as GC runs
   - **Soft:** Deleted only when memory is urgent

6. **Garbage Collector:**
   - Automatically frees unreferenced objects
   - JVM controls when it runs
   - `System.gc()` is a suggestion, not guaranteed

7. **GC Algorithms:**
   - **Mark and Sweep:** Basic algorithm
   - **Mark and Sweep with Compaction:** Includes compaction
   - **Serial GC:** Single thread (slow)
   - **Parallel GC:** Multiple threads (Java 8 default)
   - **CMS:** Concurrent (minimal pause)
   - **G1:** Best balance (low pause + compaction)

### Important Interview Points

- Difference between stack and heap
- What data is stored where
- Object lifecycle in heap (Eden → Survivor → Old Generation)
- Types of references and their behavior
- When objects become eligible for GC
- Different GC algorithms and their characteristics
- Why GC is expensive (stops application threads)
- How to make objects eligible for GC

### Memory Management Best Practices

1. **Minimize object creation** when possible
2. **Set references to null** when done with objects
3. **Avoid memory leaks** (holding references unnecessarily)
4. **Understand GC behavior** for your application
5. **Monitor memory usage** in production

---

## Related Topics

- **Variables** - How variables are stored in memory
- **Methods** - How method frames work in stack
- **Objects** - How objects are created and managed
- **Performance Tuning** - Optimizing memory usage

