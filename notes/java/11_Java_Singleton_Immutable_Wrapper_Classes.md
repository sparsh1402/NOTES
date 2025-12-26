# Java Singleton, Immutable, and Wrapper Classes

## Table of Contents
- [Singleton Class](#singleton-class)
  - [What is Singleton?](#what-is-singleton)
  - [Purpose of Singleton](#purpose-of-singleton)
  - [Use Cases](#use-cases)
  - [Six Ways to Create Singleton](#six-ways-to-create-singleton)
    - [1. Eager Initialization](#1-eager-initialization)
    - [2. Lazy Initialization](#2-lazy-initialization)
    - [3. Synchronized Method](#3-synchronized-method)
    - [4. Double-Check Locking](#4-double-check-locking)
    - [5. Bill Pugh Solution (Static Inner Class)](#5-bill-pugh-solution-static-inner-class)
    - [6. Enum Singleton](#6-enum-singleton)
  - [Comparison of Singleton Patterns](#comparison-of-singleton-patterns)
- [Immutable Class](#immutable-class)
  - [What is an Immutable Class?](#what-is-an-immutable-class)
  - [Properties of Immutable Class](#properties-of-immutable-class)
  - [Rules to Create Immutable Class](#rules-to-create-immutable-class)
  - [Example: Immutable Class](#example-immutable-class)
  - [Important: Returning Copy in Getter](#important-returning-copy-in-getter)
  - [Why Return Copy for Collections?](#why-return-copy-for-collections)
- [Wrapper Classes](#wrapper-classes)
  - [What are Wrapper Classes?](#what-are-wrapper-classes)
  - [Primitive Types and Their Wrappers](#primitive-types-and-their-wrappers)
  - [Autoboxing and Unboxing](#autoboxing-and-unboxing)
  - [Reference](#reference)

---

## Singleton Class

### What is Singleton?

A **singleton class** is a class that allows only **one instance** (object) to be created throughout the application lifecycle.

### Purpose of Singleton

The main purpose of a singleton class is to ensure that:
- Only **one object** of the class exists
- No matter how many times it's called or from where it's called
- The same single instance is always returned

### Use Cases

**Common use cases for singleton pattern:**

1. **Database Connection**
   - You want only one connection to the database
   - All queries (SELECT, INSERT, UPDATE) use the same connection
   - Avoids creating multiple connections unnecessarily

2. **Configuration Management**
   - Single source of configuration settings
   - Ensures consistent configuration across the application

3. **Logger Classes**
   - Single logger instance for the entire application
   - Centralized logging

4. **Cache Management**
   - Single cache instance
   - Consistent cache across the application

### Six Ways to Create Singleton

There are six popular ways to implement the singleton pattern in Java:

1. Eager Initialization
2. Lazy Initialization
3. Synchronized Method
4. Double-Check Locking
5. Bill Pugh Solution (Static Inner Class)
6. Enum Singleton

Let's explore each one:

---

#### 1. Eager Initialization

**Concept:** Create the object **eagerly** (in advance) when the class is loaded.

```java
public class DbConnection {
    // 1. Create object eagerly and make it private static
    private static DbConnection connection = new DbConnection();
    
    // 2. Make constructor private so no one can create object from outside
    private DbConnection() {
        // Constructor implementation
    }
    
    // 3. Public static method to get the instance
    public static DbConnection getInstance() {
        return connection;
    }
}
```

**How it works:**
1. Object is created as `private static` - belongs to class, not object
2. Constructor is `private` - prevents external object creation
3. `getInstance()` method is `public static` - can be called using class name
4. Always returns the same single object

**Usage:**
```java
DbConnection conn1 = DbConnection.getInstance();
DbConnection conn2 = DbConnection.getInstance();
// conn1 and conn2 refer to the same object
```

**Disadvantages:**
- Object is created **even if it's not used**
- Static variables are preloaded into memory when application starts
- Wastes memory if the singleton is never used

---

#### 2. Lazy Initialization

**Concept:** Create the object **only when it's first needed** (lazy loading).

```java
public class DbConnection {
    // 1. Declare but don't initialize (starts as null)
    private static DbConnection connection = null;
    
    // 2. Make constructor private
    private DbConnection() {
        // Constructor implementation
    }
    
    // 3. Create object only when first requested
    public static DbConnection getInstance() {
        if (connection == null) {
            connection = new DbConnection();
        }
        return connection;
    }
}
```

**How it works:**
1. Object starts as `null`
2. When `getInstance()` is called, it checks if object is `null`
3. If `null`, creates new object; otherwise returns existing one
4. Object is created only when first needed

**Usage:**
```java
DbConnection conn1 = DbConnection.getInstance(); // Creates object
DbConnection conn2 = DbConnection.getInstance(); // Returns existing object
```

**Disadvantages:**
- **Not thread-safe** - Multiple threads can create multiple objects
- If two threads check `connection == null` simultaneously, both may create objects

**Thread Safety Issue:**
```
Thread 1: checks connection == null → true → creates object
Thread 2: checks connection == null → true → creates object (BEFORE Thread 1 finishes)
Result: Two objects created!
```

---

#### 3. Synchronized Method

**Concept:** Make the `getInstance()` method **synchronized** to ensure thread safety.

```java
public class DbConnection {
    private static DbConnection connection = null;
    
    private DbConnection() {
        // Constructor implementation
    }
    
    // Synchronized method - only one thread can enter at a time
    public static synchronized DbConnection getInstance() {
        if (connection == null) {
            connection = new DbConnection();
        }
        return connection;
    }
}
```

**How it works:**
1. `synchronized` keyword locks the method
2. Only **one thread** can execute the method at a time
3. Other threads wait until the lock is released
4. Ensures only one object is created

**Usage:**
```java
DbConnection conn1 = DbConnection.getInstance(); // Thread 1 - acquires lock, creates object
DbConnection conn2 = DbConnection.getInstance(); // Thread 2 - waits, then gets existing object
```

**Disadvantages:**
- **Very slow** - Every method call acquires and releases lock
- Even after object is created, every `getInstance()` call still uses synchronization
- Performance overhead for frequent calls

**Performance Issue:**
```
Place 1: getInstance() → lock → unlock
Place 2: getInstance() → lock → unlock (even though object already exists)
Place 3: getInstance() → lock → unlock
... (happens 1000 times)
Result: Unnecessary locking/unlocking overhead
```

---

#### 4. Double-Check Locking

**Concept:** Check `null` **twice** - once outside synchronized block, once inside.

```java
public class DbConnection {
    // IMPORTANT: Use volatile keyword
    private static volatile DbConnection connection = null;
    
    private DbConnection() {
        // Constructor implementation
    }
    
    public static DbConnection getInstance() {
        // First check (outside synchronized block)
        if (connection == null) {
            // Synchronized block - only for object creation
            synchronized (DbConnection.class) {
                // Second check (inside synchronized block)
                if (connection == null) {
                    connection = new DbConnection();
                }
            }
        }
        return connection;
    }
}
```

**How it works:**
1. **First check:** If object exists, return immediately (no synchronization)
2. **Synchronized block:** Only entered if object is `null`
3. **Second check:** Inside synchronized block, check again (double-check)
4. Create object only if still `null`
5. After object is created, first check prevents entering synchronized block

**Why `volatile` is Important:**

The `volatile` keyword solves **memory visibility issues**:

**Problem without volatile:**
- Each CPU core has its own **L1 cache**
- Thread 1 (Core 1) creates object → stores in L1 cache
- Thread 2 (Core 2) checks memory → doesn't see update (cache not synced)
- Thread 2 creates another object → **Two objects created!**

**Solution with volatile:**
- `volatile` ensures **all reads/writes happen directly in memory**, not cache
- Thread 1 writes directly to memory
- Thread 2 reads directly from memory
- **No cache issues**

**Usage:**
```java
DbConnection conn1 = DbConnection.getInstance(); // Creates object
DbConnection conn2 = DbConnection.getInstance(); // Returns existing (no synchronization)
```

**Advantages:**
- Thread-safe
- Better performance than synchronized method (synchronization only during creation)
- After object creation, no synchronization overhead

**Disadvantages:**
- Still uses `synchronized` and `volatile` (slightly slower than Bill Pugh solution)
- More complex code

---

#### 5. Bill Pugh Solution (Static Inner Class)

**Concept:** Use a **static inner class** to hold the singleton instance. This combines eager initialization benefits with lazy loading.

```java
public class DbConnection {
    // Private constructor
    private DbConnection() {
        // Constructor implementation
    }
    
    // Static inner class - holds the singleton instance
    private static class ConnectionHelper {
        private static final DbConnection INSTANCE = new DbConnection();
    }
    
    // Public method to get instance
    public static DbConnection getInstance() {
        return ConnectionHelper.INSTANCE;
    }
}
```

**How it works:**
1. **Static inner class** is not loaded until it's first referenced
2. When `getInstance()` is called, `ConnectionHelper` class is loaded
3. Loading the class initializes `INSTANCE` (eager initialization within inner class)
4. `INSTANCE` is `final` - cannot be changed
5. Thread-safe by default (class loading is thread-safe in Java)

**Key Points:**
- **Lazy loading:** Inner class loads only when `getInstance()` is first called
- **Thread-safe:** Class loading is inherently thread-safe
- **No synchronization needed:** No `synchronized` or `volatile` required
- **Fast:** No locking overhead

**Usage:**
```java
DbConnection conn1 = DbConnection.getInstance(); // Loads inner class, creates object
DbConnection conn2 = DbConnection.getInstance(); // Returns existing object
```

**Advantages:**
- Thread-safe without explicit synchronization
- Lazy initialization (object created only when needed)
- Fast (no synchronization overhead)
- Simple and clean code

**Disadvantages:**
- None significant - this is considered one of the best approaches

---

#### 6. Enum Singleton

**Concept:** Use an **enum** to create a singleton. Enums are inherently singleton in Java.

```java
public enum DbConnection {
    INSTANCE;
    
    // Add methods and variables as needed
    public void connect() {
        // Connection logic
    }
    
    public void disconnect() {
        // Disconnection logic
    }
}
```

**How it works:**
1. **Enum constructors are always private** (by default)
2. **JVM ensures only one instance per enum** exists per JVM
3. Enum constants are created only once
4. Thread-safe by default

**Usage:**
```java
DbConnection conn1 = DbConnection.INSTANCE;
DbConnection conn2 = DbConnection.INSTANCE;
// conn1 and conn2 refer to the same object
```

**Advantages:**
- Simplest implementation (just 2-3 lines)
- Thread-safe by default
- Serialization-safe (enums handle serialization automatically)
- Reflection-safe (cannot create multiple instances via reflection)
- No synchronization needed

**Disadvantages:**
- Less flexible (cannot extend classes, only implement interfaces)
- Enum-specific syntax

---

### Comparison of Singleton Patterns

| Pattern | Thread-Safe | Lazy Loading | Performance | Complexity |
|---------|-------------|--------------|-------------|------------|
| **Eager Initialization** | ✅ Yes | ❌ No | ⚡ Fast | ⭐ Simple |
| **Lazy Initialization** | ❌ No | ✅ Yes | ⚡ Fast | ⭐ Simple |
| **Synchronized Method** | ✅ Yes | ✅ Yes | 🐌 Slow | ⭐⭐ Medium |
| **Double-Check Locking** | ✅ Yes | ✅ Yes | ⚡⚡ Medium | ⭐⭐⭐ Complex |
| **Bill Pugh Solution** | ✅ Yes | ✅ Yes | ⚡⚡⚡ Fast | ⭐⭐ Medium |
| **Enum Singleton** | ✅ Yes | ❌ No* | ⚡⚡⚡ Fast | ⭐ Simplest |

*Enum constants are created when enum class is loaded, but this is typically acceptable.

**Recommendations:**
- **Best overall:** Bill Pugh Solution or Enum Singleton
- **For simplicity:** Enum Singleton
- **For flexibility:** Bill Pugh Solution
- **Avoid:** Synchronized Method (too slow) and Lazy Initialization (not thread-safe)

---

## Immutable Class

### What is an Immutable Class?

An **immutable class** is a class whose **state (data) cannot be changed** after the object is created.

**Example from Java:** `String` class is immutable. Once created, you cannot change its value.

### Properties of Immutable Class

1. **State cannot be modified** after object creation
2. **All fields are final** - cannot be reassigned
3. **No setter methods** - cannot modify values
4. **Getter methods return copies** (especially for collections)

### Rules to Create Immutable Class

To create an immutable class, follow these rules:

1. ✅ **Declare the class as `final`**
   - Prevents subclassing
   - Subclasses could potentially modify behavior

2. ✅ **Make all fields `private` and `final`**
   - `private` - cannot be accessed from outside
   - `final` - cannot be reassigned after initialization

3. ✅ **Initialize fields only through constructor**
   - Values set only once during object creation
   - No way to change values after creation

4. ✅ **No setter methods**
   - Don't provide methods to modify fields
   - Only getter methods to read values

5. ✅ **Return copy of mutable objects in getters**
   - If returning collections or mutable objects, return a **copy**
   - Prevents external modification of internal state

### Example: Immutable Class

```java
public final class ImmutablePerson {
    // All fields are private and final
    private final String name;
    private final List<String> petNames;
    
    // Constructor - initialize all fields
    public ImmutablePerson(String name, List<String> petNames) {
        this.name = name;
        // Create a copy of the list to prevent external modification
        this.petNames = new ArrayList<>(petNames);
    }
    
    // Getter methods - no setters!
    public String getName() {
        return name;
    }
    
    // IMPORTANT: Return a copy, not the original list
    public List<String> getPetNames() {
        return new ArrayList<>(petNames); // Return copy
    }
}
```

**Usage:**
```java
List<String> originalList = new ArrayList<>();
originalList.add("SJ");
originalList.add("PJ");

ImmutablePerson person = new ImmutablePerson("My Name", originalList);

// Try to modify name - NOT POSSIBLE (no setter, field is final)
// person.setName("New Name"); // Compilation error!

// Try to modify pet names list
List<String> retrievedList = person.getPetNames();
retrievedList.add("Hello"); // This modifies the COPY, not original

System.out.println(person.getPetNames()); // Still prints: [SJ, PJ]
// Original list inside object is unchanged!
```

### Important: Returning Copy in Getter

**Why return a copy?**

If you return the **original reference** to a collection, the caller can modify it:

```java
// WRONG - Don't do this!
public List<String> getPetNames() {
    return petNames; // Returns original reference
}

// Usage:
List<String> list = person.getPetNames();
list.add("New Pet"); // This modifies the original list inside the object!
// Object is no longer immutable!
```

**Correct approach:**
```java
// CORRECT - Return a copy
public List<String> getPetNames() {
    return new ArrayList<>(petNames); // Returns a new copy
}

// Usage:
List<String> list = person.getPetNames();
list.add("New Pet"); // This modifies the COPY, not the original
// Original list inside object remains unchanged
```

### Why Return Copy for Collections?

**Understanding `final` with Collections:**

```java
private final List<String> petNames;
```

**What `final` means here:**
- `final` means the **reference** cannot be changed
- You cannot reassign `petNames` to point to a different list
- **BUT** you can still **modify the contents** of the list!

**Example:**
```java
private final List<String> petNames = new ArrayList<>();

// This is NOT allowed (reassignment):
petNames = new ArrayList<>(); // Compilation error!

// But this IS allowed (modifying contents):
petNames.add("New Pet"); // This works!
petNames.remove(0);      // This works!
```

**Memory Representation:**
```
petNames (final reference) → [Memory Block: List object]
                                ├── "SJ"
                                └── "PJ"
```

- `final` ensures `petNames` always points to the same memory block
- But you can still add/remove items **inside** that memory block

**Solution: Return Copy**
- When returning the list, create a **new list** with copied values
- Caller modifies the copy, not the original
- Original list inside the object remains unchanged

---

## Wrapper Classes

### What are Wrapper Classes?

**Wrapper classes** are Java classes that **wrap** primitive data types into objects. They provide object-oriented representation of primitives.

### Primitive Types and Their Wrappers

| Primitive Type | Wrapper Class |
|----------------|---------------|
| `byte` | `Byte` |
| `short` | `Short` |
| `int` | `Integer` |
| `long` | `Long` |
| `float` | `Float` |
| `double` | `Double` |
| `char` | `Character` |
| `boolean` | `Boolean` |

### Autoboxing and Unboxing

**Autoboxing:** Automatic conversion from primitive to wrapper object
```java
int num = 10;
Integer obj = num; // Autoboxing: int → Integer
```

**Unboxing:** Automatic conversion from wrapper object to primitive
```java
Integer obj = 10;
int num = obj; // Unboxing: Integer → int
```

### Reference

Wrapper classes, autoboxing, and unboxing are covered in detail in:
- **Java Variables - Part 2: Reference/Non-Primitive Data Types**
- See video/notes on Java Variables for comprehensive coverage

---

## Summary

### Singleton Class
- Ensures only **one instance** of a class exists
- **Six patterns:** Eager, Lazy, Synchronized, Double-Check Locking, Bill Pugh, Enum
- **Best choices:** Bill Pugh Solution or Enum Singleton
- **Use cases:** Database connections, configuration, logging, caching

### Immutable Class
- **State cannot be changed** after object creation
- **Rules:** Final class, private final fields, no setters, return copies in getters
- **Important:** Always return **copy** of collections in getter methods
- **Example:** `String` class in Java

### Wrapper Classes
- **Object representation** of primitive types
- **8 wrapper classes** for 8 primitive types
- **Autoboxing/Unboxing:** Automatic conversion between primitives and wrappers
- Covered in detail in Java Variables notes

---

## Practice Exercises

1. **Implement Singleton:**
   - Create a `Logger` singleton class using Bill Pugh Solution
   - Add methods: `log(String message)`, `getLogCount()`

2. **Implement Immutable Class:**
   - Create an `ImmutableStudent` class with:
     - `name` (String)
     - `grades` (List<Integer>)
     - Ensure it's truly immutable

3. **Compare Singleton Patterns:**
   - Implement the same singleton using:
     - Eager Initialization
     - Bill Pugh Solution
     - Enum Singleton
   - Compare their performance and thread-safety

4. **Fix Immutable Class:**
   - Given a class that claims to be immutable but has a bug
   - Identify and fix the issue (likely in getter method)

---

## Interview Questions

1. **What is a singleton class?**  
   A class that allows only one instance to be created throughout the application.

2. **Why use singleton pattern?**  
   For resources that should have only one instance: database connections, configuration, logging, caching.

3. **What are the different ways to create singleton?**  
   Eager, Lazy, Synchronized, Double-Check Locking, Bill Pugh Solution, Enum Singleton.

4. **What is the best way to implement singleton?**  
   Bill Pugh Solution (static inner class) or Enum Singleton - both are thread-safe, efficient, and simple.

5. **Why use `volatile` in double-check locking?**  
   To ensure memory visibility - prevents cache-related issues where multiple threads might see different values.

6. **What is an immutable class?**  
   A class whose state cannot be changed after object creation.

7. **How to create an immutable class?**  
   - Final class
   - Private final fields
   - No setter methods
   - Return copies of mutable objects in getters

8. **Why return copy in getter for collections?**  
   Because `final` only prevents reassignment, not modification of collection contents. Returning a copy prevents external modification.

9. **What are wrapper classes?**  
   Classes that wrap primitive types into objects (e.g., `Integer` for `int`, `Double` for `double`).

10. **What is autoboxing and unboxing?**  
    - **Autoboxing:** Automatic conversion from primitive to wrapper object
    - **Unboxing:** Automatic conversion from wrapper object to primitive

11. **What is the difference between eager and lazy initialization?**  
    - **Eager:** Object created when class is loaded (application start)
    - **Lazy:** Object created only when first requested

12. **Why is synchronized method singleton slow?**  
    Every `getInstance()` call acquires and releases lock, even after object is created. This causes unnecessary overhead.

13. **How does Bill Pugh solution work?**  
    Uses a static inner class to hold the singleton instance. Inner class loads only when `getInstance()` is first called, providing lazy initialization with thread-safety.

14. **Can you create multiple instances of enum singleton?**  
    No. JVM ensures only one instance per enum constant exists per JVM.

15. **What happens if you don't return copy in getter for collections?**  
    Caller can modify the original collection, breaking immutability of the class.

