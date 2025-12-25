# Java Overview

## What is Java?

**Java** is a:
- **Platform independent** language
- **Highly popular object-oriented programming** language

### Key Features

Java has all the OOPs capabilities:
- Inheritance
- Polymorphism
- Encapsulation
- Abstraction

### Major Advantage: Portability (WORA)

**WORA** stands for **Write Once, Run Anywhere**.

**What does it mean?**
- If you write a Java program on your mobile phone
- The same Java program can run on:
  - Laptop
  - Desktop
  - Notebooks
  - Any device with Java support

**That's why Java is highly portable!**

---

## Three Main Components of Java

Java has three main components:

1. **JVM** (Java Virtual Machine)
2. **JRE** (Java Runtime Environment)
3. **JDK** (Java Development Kit)

### 1. JVM (Java Virtual Machine)

**Full Form:** Java Virtual Machine

**What is JVM?**
- It's an **abstract machine**
- **Abstract** means it doesn't exist physically
- It's a kind of software, but we call it a machine
- Don't assume there's a physical machine - it's just an abstract concept

**What is the use of JVM?**

**Flow of Java Program:**

```
Java Program (.java)
    ↓
Compiler (javac)
    ↓
Bytecode (.class)
    ↓
JVM
    ↓
Machine Code
    ↓
CPU → Output
```

**Key Points:**
1. Java program passes through **compiler**
2. Compiler converts it to **bytecode** (`.class` file)
3. Bytecode is passed through **JVM**
4. JVM converts bytecode to **machine code**
5. Machine code can be read by CPU and we get output

**Why JVM is Important:**
- Because of JVM, we get **portability**
- Because of JVM, Java is **platform independent**

**How JVM Provides Portability:**

1. **Java program is platform independent**
   - When Java code is compiled, we get **bytecode** (not machine code directly)
   - This bytecode can be run by JVM

2. **JVM is platform dependent**
   - JVM is **NOT** platform independent
   - JVM is **platform dependent**
   - For Mac OS, you need Mac-compatible JVM
   - For Windows OS, you need Windows-compatible JVM
   - For Linux, you need Linux-compatible JVM

3. **How it works:**
   - You write Java program on mobile phone → get bytecode
   - Take this bytecode to any system (Linux, Mac, Windows)
   - That system's JVM can read the bytecode
   - JVM converts bytecode to machine code for that specific platform
   - **That's why Java is platform independent!**

**JVM Components:**
- JVM has **JIT Compiler** (Just In Time Compiler)
- JIT compiler takes bytecode and converts it to machine code

**Summary:**
- **Java program** = Platform independent
- **JVM** = Platform dependent
- **Bytecode** = Platform independent (can run on any JVM)

### 2. JRE (Java Runtime Environment)

**Full Form:** Java Runtime Environment

**What does JRE contain?**

JRE has **two things**:

1. **JVM** (Java Virtual Machine)
2. **Class Libraries** (Java libraries)

**Understanding Class Libraries:**

Java provides many built-in libraries:
- `java.lang` - Contains classes like `Math.abs()`
- `java.util` - Contains classes like `Arrays.sort()`
- And many more...

**Example:**

```java
// Using Math library
Math.abs(-10);

// Using Arrays library
Arrays.sort(array);
```

**How JRE Works:**

1. You have **bytecode** (`.class` file)
2. Bytecode might use certain libraries (like `Arrays.sort()`, `Math.abs()`)
3. When JVM runs the bytecode, it needs those libraries
4. JRE provides:
   - **JVM** to execute bytecode
   - **Class libraries** to resolve library calls

**Key Points:**
- If you have **only JRE**, you can **run** any Java program
- But you **cannot code** (write Java programs)
- JRE = JVM + Class Libraries
- You cannot have only JVM - JVM comes as part of JRE

**Summary:**
- **JRE** = JVM + Class Libraries
- With JRE, you can run bytecode
- With JRE, you cannot write code

### 3. JDK (Java Development Kit)

**Full Form:** Java Development Kit

**What does JDK contain?**

JDK = **JRE + Additional Development Tools**

**Additional Tools:**
1. **Programming Language** - All Java language features
2. **Compiler** (`javac`) - Compiles `.java` to `.class`
3. **Debugger** - To debug your code
4. Other development features

**What JDK Provides:**

```java
// Programming language features
System.out.println("Hello");

// Compiler
javac Student.java  // Converts .java to .class

// Debugger
// Tools to debug your code
```

**Key Points:**
- If you download **JDK**, you get:
  - JRE (which includes JVM)
  - Compiler
  - Debugger
  - Programming language
- **JDK** = JRE + Compiler + Debugger + Language Features

**Summary:**
- **JDK** = JRE + Compiler + Debugger + Language Features
- With JDK, you can write, compile, and run Java programs

### Comparison: JVM, JRE, JDK

| Component | Contains | Can Write Code? | Can Compile? | Can Run? |
|-----------|----------|-----------------|--------------|----------|
| **JVM** | JIT Compiler | ❌ | ❌ | ✅ (needs bytecode) |
| **JRE** | JVM + Class Libraries | ❌ | ❌ | ✅ |
| **JDK** | JRE + Compiler + Debugger | ✅ | ✅ | ✅ |

**Important Notes:**
- **JVM, JRE, JDK** are all **platform dependent**
- **Java code** (once converted to bytecode) is **platform independent**
- Bytecode can run on any system that has JRE (which includes JVM)

---

## Java Editions

There are three main Java editions:

### 1. JSE (Java Standard Edition)

**Full Form:** Java Standard Edition

**Also known as:** Core Java

**What it includes:**
- Classes
- Objects
- Multi-threading
- All core Java concepts
- Everything you learn as a Java developer

**Usage:** General Java development

### 2. JEE (Java Enterprise Edition)

**Full Form:** Java Enterprise Edition

**Also known as:** Jakarta EE (name has been changed)

**What it includes:**
- Everything in JSE (Java Standard Edition)
- **Plus additional APIs:**
  - Transactional API (rollback, commit)
  - Servlets
  - JSP (Java Server Pages)
  - Persistence API (for managing relational databases)

**Usage:** Building large-scale applications like:
- E-commerce applications
- Enterprise applications
- Applications needing transactional capabilities

### 3. JME (Java Micro Edition)

**Full Form:** Java Micro Edition

**Also known as:** Java Mobile Edition

**What it includes:**
- APIs for mobile applications
- APIs for resource-constrained devices
- APIs for running on mobile devices

**Usage:** Mobile application development

**Note:** When downloading JDK, you'll see versions like "JSE JDK version 17" - this means Java Standard Edition JDK version 17.

---

## Writing Your First Java Program

### File Naming Convention

**Important Rule:**
- **File name** must be equivalent to **class name**
- If file is `Employee.java`, the class must be `Employee`
- **One file can have only one public class**

### Class Structure

A class can have:
1. **Variables**
2. **Methods**
3. **Constructor**
4. **Nested/Inner Classes**

We'll cover all these in detail in future videos.

### Example: First Java Program

```java
// Employee.java
public class Employee {
    // Main method - starting point of the program
    public static void main(String[] args) {
        // This is a comment - compiler will ignore this
        
        /*
         * This is also a comment
         * It can span multiple lines
         */
        
        int a = -10;
        
        System.out.println("This is my first program");
        System.out.println("Output of a is " + a);
    }
}
```

### Understanding the Main Method

**Main method is the starting point of the program.**

**Why?**
- When you compile Java program, you get bytecode
- Bytecode is read by JVM
- **JVM calls the main method** to start running the program
- That's why main is the starting point

**Breaking down `public static void main(String[] args)`:**
1. **`public`** - Can be called from anywhere
   - JVM needs to call this method from outside
   - That's why it must be public
2. **`static`** - Belongs to class, not object
   - JVM doesn't need to create an object to call this
   - Can be called directly using class name
   - We'll cover static in detail later
3. **`void`** - No return type
   - This method doesn't return anything
4. **`main`** - Method name (fixed - JVM looks for this)
5. **`String[] args`** - Command line arguments
   - JVM can pass certain arguments if user wants
   - We'll see this later

**Key Understanding:**
- JVM calls only the `main` method
- All your Java code execution starts from `main`
- From `main`, you call other classes and methods

### Comments in Java

There are two types of comments:

1. **Single-line comment:**
```java
// This is a single-line comment
// You need // for each line
```

2. **Multi-line comment:**
```java
/*
 * This is a multi-line comment
 * Anything between /* and */ is a comment
 * Can span multiple lines
 */
```

**Note:** Compiler ignores comments - they are for human understanding only.

### System.out.println()

**What it does:**
- Prints output to the console
- `System.out.println()` - prints and moves to next line
- `System.out.print()` - prints without moving to next line

**Example:**
```java
System.out.println("This is my first program");
System.out.println("Output of a is " + a);
// Output:
// This is my first program
// Output of a is -10
```

---

## Compilation and Execution

### Step 1: Write Java Code

Create a file `Employee.java`:
```java
public class Employee {
    public static void main(String[] args) {
        int a = -10;
        System.out.println("Output of a is " + a);
    }
}
```

### Step 2: Compile the Code

**Command:**
```bash
javac Employee.java
```

**What happens:**
- Compiler (`javac`) converts `.java` file to `.class` file
- `.class` file contains **bytecode**
- Before compilation: Only `Employee.java` exists
- After compilation: `Employee.class` (bytecode) is created

**Important:**
- `.java` file = Source code
- `.class` file = Bytecode (platform independent)

### Step 3: Run the Program

**Command:**
```bash
java Employee
```

**What happens:**
- JVM reads the bytecode (`.class` file)
- JVM converts bytecode to machine code
- Program executes and produces output

**Output:**
```
Output of a is -10
```

### Important Notes

1. **JVM reads only bytecode, not source code**
   - If you change `.java` file but don't recompile
   - Running `java Employee` will still show old output
   - You must recompile with `javac Employee.java`

2. **Compilation is required after every change**
   ```bash
   # Change Employee.java (e.g., change a = -10 to a = -11)
   # Must recompile:
   javac Employee.java
   # Then run:
   java Employee
   ```

3. **File name must match class name**
   - File: `Employee.java`
   - Class: `public class Employee`

---

## Downloading and Installing Java

### Where to Download

1. Go to **Oracle Archive Downloads**
2. Search for "Java 8 download" (or any version you want)
3. Select your operating system:
   - Windows 64/86
   - Mac OS 64
   - Linux
4. Download and install

**Important:** Download from Oracle's official website - it's authentic and safe.

### Verify Installation

After installation, verify by running:
```bash
java -version
```

You should see output like:
```
java version "1.8.0_xxx"
```
or
```
java version "17.0.x"
```

This confirms Java is properly installed.

---

## Summary

### Key Concepts

1. **Java** = Platform independent, object-oriented programming language
2. **WORA** = Write Once, Run Anywhere (portability)
3. **JVM** = Java Virtual Machine (abstract machine, platform dependent)
4. **JRE** = Java Runtime Environment (JVM + Class Libraries)
5. **JDK** = Java Development Kit (JRE + Compiler + Debugger)

### Java Program Flow

```
Java Code (.java)
    ↓
javac (Compiler)
    ↓
Bytecode (.class) - Platform Independent
    ↓
JVM (Platform Dependent)
    ↓
Machine Code
    ↓
Output
```

### Important Points

- **Java program/bytecode** = Platform independent
- **JVM, JRE, JDK** = Platform dependent
- **Main method** = Starting point (called by JVM)
- **File name** = Must match class name
- **One file** = One public class
- **Compilation required** = After every code change

### Java Editions

- **JSE** = Java Standard Edition (Core Java)
- **JEE** = Java Enterprise Edition (Enterprise applications)
- **JME** = Java Micro Edition (Mobile applications)

---

## Next Steps

- Variables and Data Types
- Operators
- Control Flow Statements
- Methods and Functions
- Object Creation
- Access Specifiers (in detail)
- Static keyword (in detail)

