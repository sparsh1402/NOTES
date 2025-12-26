# Why Only One Public Class Per File in Java?

## Introduction

This is a **very important interview question**: Why in Java can we have only one public class per file?

## Key Rules

1. **Main method must be inside a public class**
2. **Public class name must be the same as the file name**

Understanding these two rules together explains why Java restricts us to one public class per file.

---

## Rule 1: Main Method Must Be Inside a Public Class

### Why?

**The main method is invoked by JVM (Java Virtual Machine).**

- JVM needs **access** to the main method
- JVM calls the main method using the **class name**
  - Example: If class name is `A`, JVM calls it as `A.main()`
- The main method is **static**, so JVM can call it directly with the class name
- The class containing main must be **public** so that:
  - It's accessible to JVM
  - It's available outside its package
  - JVM can invoke the main method from outside

**Summary:**
- Main method is the **entry point** of the program
- JVM invokes the main method
- Main method must be in a **public class** for JVM to access it

---

## Rule 2: Public Class Name Must Match File Name

### What Does This Mean?

If you create a file named `Employee.java`, then:
- Any **public class** in that file **must** be named `Employee`
- You **cannot** have `public class Manager` in a file named `Employee.java`
- This is **not allowed** in Java

### Example:

```java
// File: Employee.java
public class Employee {  // ✅ Correct - matches file name
    public static void main(String[] args) {
        // code
    }
}
```

```java
// File: Employee.java
public class Manager {  // ❌ Error - doesn't match file name
    public static void main(String[] args) {
        // code
    }
}
```

---

## Why This Restriction Exists

### The Problem Without This Restriction

Imagine a file `Employee.java` contains:
- 100 classes: `class A`, `class B`, `class C`, ... `class Z`
- Multiple public classes: `public class A`, `public class B`, `public class C`

**Question:** How would JVM know which public class contains the main method?

JVM needs to:
1. Find the main method
2. Invoke it to start the program
3. But if there are multiple public classes, JVM doesn't know which one has main

### The Solution

Java enforces two rules:
1. **Only one public class per file**
2. **Public class name = File name**

**How This Solves the Problem:**

- If file is `B.java`, then:
  - There can be only **one public class** in that file
  - That public class **must** be named `B`
  - JVM knows: "If I'm looking at `B.java`, the public class is definitely `B`"
  - JVM doesn't need to search through 100 classes
  - JVM directly knows: "The public class in `B.java` is `B`"

**Example Scenario:**

```
File: Employee.java
├── class A (not public)
├── class B (not public)
├── class C (not public)
├── ...
└── public class Employee  ← Only one public class, matches file name
    └── public static void main(String[] args)  ← Main method here
```

JVM's logic:
1. "I need to run `Employee.java`"
2. "The public class must be `Employee` (because file name is `Employee.java`)"
3. "I'll look for main method in class `Employee`"
4. "Found it! I'll invoke it."

---

## The Complete Relationship

### How Everything Connects:

1. **Main method** must be inside a **public class**
   - Because JVM needs to access it

2. **Public class name** must match **file name**
   - Because JVM needs to know which class to look in

3. **Only one public class per file**
   - Because if there were multiple public classes, JVM wouldn't know which one contains main

### The Chain of Logic:

```
JVM needs to invoke main method
    ↓
Main method must be in public class (for JVM access)
    ↓
Public class name must match file name (so JVM knows which class)
    ↓
Only one public class per file (so JVM doesn't get confused)
```

---

## Summary

**Why only one public class per file?**

Because:
1. **Main method** (entry point) must be in a **public class**
2. **Public class name** must match the **file name**
3. If there were multiple public classes, **JVM wouldn't know** which one contains the main method
4. By restricting to **one public class** with **matching file name**, JVM can **easily locate** the main method

**Key Points:**
- Main method = Entry point (invoked by JVM)
- Main method must be in public class (for JVM access)
- Public class name = File name (for JVM to locate)
- One public class per file (to avoid confusion)

---

## Interview Answer

**Q: Why can we have only one public class per file in Java?**

**A:** 
- The main method (entry point) must be inside a public class so that JVM can access it
- The public class name must match the file name so JVM knows which class to look in
- If multiple public classes were allowed, JVM wouldn't know which public class contains the main method
- By restricting to one public class per file with matching name, JVM can easily locate and invoke the main method

---

## Related Concepts

- **Main Method**: Entry point of Java program, invoked by JVM
- **Public Access Modifier**: Makes class accessible from outside its package
- **Static Keyword**: Allows method to be called using class name (without creating object)
- **JVM**: Java Virtual Machine that executes bytecode and invokes main method

