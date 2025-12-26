# Java Exception Handling

## Table of Contents
- [What is an Exception?](#what-is-an-exception)
- [Exception Hierarchy](#exception-hierarchy)
  - [Error vs Exception](#error-vs-exception)
  - [Checked vs Unchecked Exceptions](#checked-vs-unchecked-exceptions)
- [Types of Exceptions](#types-of-exceptions)
  - [Runtime Exceptions (Unchecked)](#runtime-exceptions-unchecked)
  - [Compile-time Exceptions (Checked)](#compile-time-exceptions-checked)
- [Exception Handling Keywords](#exception-handling-keywords)
- [Try-Catch Block](#try-catch-block)
  - [Basic Try-Catch](#basic-try-catch)
  - [Multiple Catch Blocks](#multiple-catch-blocks)
  - [Catching Multiple Exceptions](#catching-multiple-exceptions)
  - [Catch Block Order](#catch-block-order)
- [Finally Block](#finally-block)
- [Throw Keyword](#throw-keyword)
- [Throws Keyword](#throws-keyword)
- [Custom Exceptions](#custom-exceptions)
- [Advantages and Disadvantages](#advantages-and-disadvantages)
- [Best Practices](#best-practices)
- [Summary](#summary)

---

## What is an Exception?

An **exception** is an **event** that occurs during the execution of a program that **disrupts the normal flow** of the program.

### Key Concepts

1. **Event During Execution:** Exception happens when program is running
2. **Disrupts Normal Flow:** Program cannot continue normally
3. **Exception Object:** Runtime system creates an exception object with:
   - **Exception Type** - What kind of exception occurred
   - **Message** - Why it failed
   - **Stack Trace** - Where it occurred (from error point to start)

### How Exception Handling Works

```
Program Flow:
┌─────────┐
│  main() │
└────┬────┘
     │ calls
     ▼
┌──────────┐
│ method1()│
└────┬─────┘
     │ calls
     ▼
┌──────────┐
│ method2()│
└────┬─────┘
     │ calls
     ▼
┌──────────┐
│ method3()│ ← Exception occurs here!
└────┬─────┘
     │
     │ Exception object created
     │ {type, message, stackTrace}
     │
     ▼
┌─────────────────────────────────┐
│ Runtime System searches for     │
│ handler in call stack:          │
│                                 │
│ 1. Check method3() - Can handle?│
│    ❌ No                        │
│                                 │
│ 2. Check method2() - Can handle?│
│    ❌ No                        │
│                                 │
│ 3. Check method1() - Can handle?│
│    ❌ No                        │
│                                 │
│ 4. Check main() - Can handle?   │
│    ❌ No                        │
│                                 │
│ Result: Program terminates      │
│         Prints stack trace      │
└─────────────────────────────────┘
```

**Example:**
```java
public class ExceptionExample {
    public static void main(String[] args) {
        method1();
    }
    
    static void method1() {
        method2();
    }
    
    static void method2() {
        method3();
    }
    
    static void method3() {
        int result = 5 / 0;  // ArithmeticException occurs here
    }
}
```

**Output:**
```
Exception in thread "main" java.lang.ArithmeticException: / by zero
    at ExceptionExample.method3(ExceptionExample.java:18)
    at ExceptionExample.method2(ExceptionExample.java:14)
    at ExceptionExample.method1(ExceptionExample.java:10)
    at ExceptionExample.main(ExceptionExample.java:6)
```

**Stack Trace Explanation:**
- **Line 18:** Where exception occurred (method3)
- **Line 14:** Called by method2
- **Line 10:** Called by method1
- **Line 6:** Called by main

---

## Exception Hierarchy

```
                    Object
                      │
                  Throwable
                      │
        ┌─────────────┴─────────────┐
        │                           │
      Error                    Exception
        │                           │
        │                    ┌──────┴──────┐
        │                    │             │
   (JVM Issues)      RuntimeException   Checked Exceptions
        │                    │             │
   OutOfMemoryError    ArithmeticException │
   StackOverflowError  NullPointerException│
                        ClassCastException  │
                        ...                 │
                                        IOException
                                        SQLException
                                        ClassNotFoundException
                                        ...
```

### Error vs Exception

| Feature | Error | Exception |
|---------|-------|-----------|
| **Cause** | JVM issues | Program issues |
| **Control** | Cannot control | Can control/handle |
| **Should Handle?** | ❌ No | ✅ Yes |
| **Examples** | OutOfMemoryError, StackOverflowError | IOException, NullPointerException |
| **Type** | Unchecked | Checked/Unchecked |

**Error Examples:**
```java
// OutOfMemoryError - JVM heap is full
public class ErrorExample {
    public static void main(String[] args) {
        String[] array = new String[Integer.MAX_VALUE];  // OutOfMemoryError
    }
}

// StackOverflowError - Stack memory is full
public class StackOverflowExample {
    public static void main(String[] args) {
        recursiveMethod();  // Infinite recursion
    }
    
    static void recursiveMethod() {
        recursiveMethod();  // StackOverflowError
    }
}
```

**Key Point:** Errors are **not meant to be handled**. They indicate serious JVM problems.

### Checked vs Unchecked Exceptions

```
Exception Hierarchy:
                    Exception
                      │
        ┌─────────────┴─────────────┐
        │                           │
  Checked Exception         RuntimeException (Unchecked)
        │                           │
  Must handle at              No need to handle
  compile time                    at compile time
        │                           │
  IOException              ArithmeticException
  SQLException            NullPointerException
  ClassNotFoundException  ClassCastException
  ...                     ...
```

**Comparison:**

| Feature | Checked Exception | Unchecked Exception |
|---------|------------------|---------------------|
| **Also Known As** | Compile-time exception | Runtime exception |
| **Handling Required** | ✅ Yes (compile error if not handled) | ❌ No (optional) |
| **When Detected** | Compile time | Runtime |
| **Inherits From** | Exception (but not RuntimeException) | RuntimeException |
| **Examples** | IOException, SQLException | ArithmeticException, NullPointerException |

**Example - Checked Exception:**
```java
public class CheckedExceptionExample {
    public static void method1() {
        throw new ClassNotFoundException();  // ❌ Compile error!
        // Error: unreported exception ClassNotFoundException;
        // must be caught or declared to be thrown
    }
}
```

**Example - Unchecked Exception:**
```java
public class UncheckedExceptionExample {
    public static void method1() {
        throw new ArithmeticException();  // ✅ Compiles fine
        // No error - runtime exception
    }
}
```

---

## Types of Exceptions

### Runtime Exceptions (Unchecked)

**Compiler does NOT force you to handle them.** Code compiles fine, but may fail at runtime.

#### 1. ClassCastException

**Occurs when:** Trying to cast an object to an incompatible type.

```java
Object obj = new Integer(10);
String str = (String) obj;  // ClassCastException
// java.lang.Integer cannot be cast to java.lang.String
```

#### 2. ArithmeticException

**Occurs when:** Arithmetic operation fails (e.g., divide by zero).

```java
int result = 5 / 0;  // ArithmeticException: / by zero
```

#### 3. IndexOutOfBoundsException

**ArrayIndexOutOfBoundsException:**
```java
int[] array = new int[2];  // indices: 0, 1
int value = array[3];  // ArrayIndexOutOfBoundsException
```

**StringIndexOutOfBoundsException:**
```java
String str = "Hello";  // indices: 0,1,2,3,4
char ch = str.charAt(5);  // StringIndexOutOfBoundsException
```

#### 4. NullPointerException

**Occurs when:** Trying to access members of a null object.

```java
String str = null;
int length = str.length();  // NullPointerException
```

#### 5. NumberFormatException

**Occurs when:** Trying to convert invalid string to number.

```java
int num = Integer.parseInt("ABC");  // NumberFormatException
// Valid: Integer.parseInt("123") ✅
```

**Summary of Runtime Exceptions:**
- Compiler **does not force** handling
- Code **compiles successfully**
- Exception occurs **at runtime**
- Can handle with try-catch (optional)

### Compile-time Exceptions (Checked)

**Compiler FORCES you to handle them.** Code will NOT compile if not handled.

**Common Checked Exceptions:**
- `ClassNotFoundException`
- `InterruptedException`
- `IOException`
- `FileNotFoundException`
- `SQLException`

**Example:**
```java
public class CheckedExceptionExample {
    public static void method1() {
        throw new ClassNotFoundException();  // ❌ Compile error!
    }
}
```

**Error Message:**
```
unreported exception ClassNotFoundException;
must be caught or declared to be thrown
```

**Solution Options:**
1. **Handle it** (try-catch)
2. **Declare it** (throws)

---

## Exception Handling Keywords

There are **5 keywords** for exception handling:

1. **try** - Block of code that might throw exception
2. **catch** - Block that handles the exception
3. **finally** - Block that always executes
4. **throw** - Throws an exception
5. **throws** - Declares that method might throw exception

---

## Try-Catch Block

### Basic Try-Catch

**Syntax:**
```java
try {
    // Code that might throw exception
} catch (ExceptionType e) {
    // Handle the exception
}
```

**Example:**
```java
public class TryCatchExample {
    public static void main(String[] args) {
        try {
            int result = 5 / 0;  // Might throw ArithmeticException
        } catch (ArithmeticException e) {
            System.out.println("Cannot divide by zero!");
            e.printStackTrace();  // Print stack trace
        }
        System.out.println("Program continues...");
    }
}
```

**Output:**
```
Cannot divide by zero!
java.lang.ArithmeticException: / by zero
    at TryCatchExample.main(TryCatchExample.java:5)
Program continues...
```

### Multiple Catch Blocks

You can have **multiple catch blocks** for different exception types.

**Example:**
```java
public class MultipleCatchExample {
    public static void method1() throws ClassNotFoundException, InterruptedException {
        // Can throw these exceptions
    }
    
    public static void main(String[] args) {
        try {
            method1();
        } catch (ClassNotFoundException e) {
            System.out.println("Class not found!");
        } catch (InterruptedException e) {
            System.out.println("Interrupted!");
        }
    }
}
```

**Important Rule:**
> **Catch block can only catch exceptions that can be thrown in the try block.**

```java
// ❌ WRONG - FileNotFoundException cannot be thrown
try {
    method1();  // Only throws ClassNotFoundException, InterruptedException
} catch (ClassNotFoundException e) {
    // OK
} catch (FileNotFoundException e) {  // ❌ Error!
    // This exception cannot be thrown by try block
}
```

### Catching Multiple Exceptions

**Java 7+:** You can catch multiple exceptions in one catch block.

**Syntax:**
```java
catch (ExceptionType1 | ExceptionType2 e) {
    // Handle both exceptions
}
```

**Example:**
```java
public class MultiCatchExample {
    public static void method1() throws ClassNotFoundException, InterruptedException {
        // Can throw these
    }
    
    public static void main(String[] args) {
        try {
            method1();
        } catch (ClassNotFoundException | InterruptedException e) {
            // Handle both exceptions the same way
            System.out.println("Exception occurred: " + e.getClass().getSimpleName());
        } catch (Exception e) {
            // Handle any other exception
            System.out.println("Other exception");
        }
    }
}
```

### Catch Block Order

**Rule:** **Specific exceptions first, generic exceptions last.**

```
┌─────────────────────────────────────┐
│  Correct Order:                     │
│                                     │
│  try { ... }                        │
│  catch (SpecificException e) { }   │ ← Most specific
│  catch (ParentException e) { }     │ ← More generic
│  catch (Exception e) { }           │ ← Most generic (last)
└─────────────────────────────────────┘
```

**Example - Correct Order:**
```java
try {
    method1();
} catch (ClassNotFoundException e) {  // ✅ Specific first
    System.out.println("Class not found");
} catch (Exception e) {  // ✅ Generic last
    System.out.println("General exception");
}
```

**Example - Wrong Order:**
```java
try {
    method1();
} catch (Exception e) {  // ❌ Generic first - ERROR!
    System.out.println("General exception");
} catch (ClassNotFoundException e) {  // ❌ Unreachable - ERROR!
    System.out.println("Class not found");
}
// Error: exception ClassNotFoundException has already been caught
```

**Why?** Parent class (`Exception`) can catch child exceptions (`ClassNotFoundException`), so the specific catch becomes unreachable.

---

## Finally Block

**Purpose:** Code that **always executes**, regardless of whether exception occurs or not.

**Syntax:**
```java
try {
    // Code
} catch (Exception e) {
    // Handle exception
} finally {
    // Always executes
}
```

**Or:**
```java
try {
    // Code
} finally {
    // Always executes (no catch)
}
```

### Key Points

1. **Always Executes:** Even if you return from try or catch block
2. **Only One Finally:** Can have only one finally block per try
3. **Common Uses:**
   - Closing resources (files, streams, connections)
   - Cleanup code
   - Logging

**Example:**
```java
public class FinallyExample {
    public static void main(String[] args) {
        try {
            System.out.println("Inside try");
            return;  // Even with return, finally executes
        } catch (Exception e) {
            System.out.println("Inside catch");
        } finally {
            System.out.println("Inside finally - Always executes!");
        }
    }
}
```

**Output:**
```
Inside try
Inside finally - Always executes!
```

**When Finally Does NOT Execute:**
- JVM crashes (OutOfMemoryError, StackOverflowError)
- System shutdown
- Process killed forcefully

**Example with Resource Cleanup:**
```java
public class ResourceExample {
    public static void main(String[] args) {
        // Simulating file/stream operations
        try {
            // Open file/stream
            System.out.println("Opening resource...");
            // Read data
            int result = 5 / 0;  // Exception occurs
        } catch (ArithmeticException e) {
            System.out.println("Exception handled");
        } finally {
            // Always close resource
            System.out.println("Closing resource...");
        }
    }
}
```

---

## Throw Keyword

**Purpose:** To **throw an exception** explicitly.

**Syntax:**
```java
throw new ExceptionType("message");
```

### Two Uses of Throw

#### 1. Throw New Exception

```java
public class ThrowExample {
    public static void validateAge(int age) {
        if (age < 18) {
            throw new IllegalArgumentException("Age must be 18 or above");
        }
        System.out.println("Age is valid: " + age);
    }
    
    public static void main(String[] args) {
        validateAge(15);  // Throws IllegalArgumentException
    }
}
```

#### 2. Rethrow Exception

```java
public class RethrowExample {
    public static void method1() throws ClassNotFoundException {
        throw new ClassNotFoundException("Class not found");
    }
    
    public static void main(String[] args) {
        try {
            method1();
        } catch (ClassNotFoundException e) {
            // Do some logging or processing
            System.out.println("Logging exception: " + e.getMessage());
            // Rethrow to let caller handle it
            throw e;  // Rethrow the exception
        }
    }
}
```

**Why Rethrow?**
- Do some processing (logging, cleanup) before rethrowing
- Let caller handle the exception
- Useful for debugging and centralized error handling

**Important:** You can only throw objects that are instances of `Throwable` or its subclasses.

```java
throw new Exception();           // ✅ OK
throw new RuntimeException();    // ✅ OK
throw new MyCustomException();    // ✅ OK (if extends Exception)
throw new String("Error");       // ❌ Error - String is not Throwable
```

---

## Throws Keyword

**Purpose:** Declares that a method **might throw** a checked exception.

**Syntax:**
```java
returnType methodName() throws ExceptionType {
    // Method body
}
```

**Key Points:**
- Used with **methods** (not with code blocks)
- Tells caller: "This method might throw this exception, you handle it"
- Caller must handle it (try-catch) or declare throws

**Example:**
```java
public class ThrowsExample {
    // Method declares it might throw ClassNotFoundException
    public static void method1() throws ClassNotFoundException {
        throw new ClassNotFoundException("Class not found");
    }
    
    // Caller must handle it
    public static void main(String[] args) {
        try {
            method1();  // Must handle ClassNotFoundException
        } catch (ClassNotFoundException e) {
            System.out.println("Handled: " + e.getMessage());
        }
    }
}
```

**Delegating to Caller:**
```java
public class ThrowsChainExample {
    public static void method3() throws ClassNotFoundException {
        throw new ClassNotFoundException("Error in method3");
    }
    
    public static void method2() throws ClassNotFoundException {
        method3();  // Doesn't handle, delegates to caller
    }
    
    public static void method1() throws ClassNotFoundException {
        method2();  // Doesn't handle, delegates to caller
    }
    
    public static void main(String[] args) {
        try {
            method1();  // Must handle here
        } catch (ClassNotFoundException e) {
            System.out.println("Handled in main: " + e.getMessage());
        }
    }
}
```

**Multiple Exceptions:**
```java
public void method() throws IOException, SQLException, ClassNotFoundException {
    // Can throw multiple exceptions
}
```

**Difference: Throw vs Throws**

| Feature | throw | throws |
|---------|-------|--------|
| **Used With** | Code block | Method signature |
| **Purpose** | Throw exception | Declare exception |
| **Number** | One exception at a time | Multiple exceptions (comma-separated) |
| **Example** | `throw new Exception();` | `void method() throws Exception` |

---

## Custom Exceptions

You can create your **own exception classes** by extending Exception or RuntimeException.

### Creating Custom Exception

**Step 1: Create Exception Class**
```java
// Custom checked exception
public class MyCustomException extends Exception {
    public MyCustomException(String message) {
        super(message);  // Pass message to parent
    }
}

// Custom unchecked exception
public class MyCustomRuntimeException extends RuntimeException {
    public MyCustomRuntimeException(String message) {
        super(message);
    }
}
```

**Step 2: Use Custom Exception**
```java
public class CustomExceptionExample {
    public static void method1() throws MyCustomException {
        throw new MyCustomException("Some issue arose");
    }
    
    public static void main(String[] args) {
        try {
            method1();
        } catch (MyCustomException e) {
            System.out.println("Caught: " + e.getMessage());
        }
    }
}
```

**Custom Exception Hierarchy:**
```
                    Exception
                      │
        ┌─────────────┴─────────────┐
        │                           │
  MyCustomException        RuntimeException
  (Checked)                      │
                                 │
                        MyCustomRuntimeException
                        (Unchecked)
```

**When to Use:**
- **Checked Exception:** When caller must handle it (extends `Exception`)
- **Unchecked Exception:** When handling is optional (extends `RuntimeException`)

---

## Advantages and Disadvantages

### Advantages

#### 1. Separates Error Handling from Regular Code

**Without Exception Handling:**
```java
public int getStudentCapacity(int classNumber) {
    if (classNumber <= 0 || classNumber > 12) {
        return -1;  // Error code
    }
    
    int capacity = getCapacity(classNumber);
    if (capacity == 0) {
        return -2;  // Error code
    }
    
    String[] names = new String[capacity];
    if (names == null || names.length == 0) {
        return -3;  // Error code
    }
    
    names[0] = "New Value";
    return 0;  // Success
}
```

**With Exception Handling:**
```java
public int getStudentCapacity(int classNumber) {
    try {
        // Clean, readable code
        int capacity = getCapacity(classNumber);
        String[] names = new String[capacity];
        names[0] = "New Value";
        return 0;
    } catch (IndexOutOfBoundsException e) {
        // Handle error
        return -1;
    } catch (Exception e) {
        // Handle other errors
        return -2;
    }
}
```

#### 2. Allows Program Recovery

```java
try {
    processData();
} catch (Exception e) {
    logError(e);
    // Recover and continue
    useDefaultData();
    continueProcessing();
}
```

#### 3. Provides Better Debugging Information

- **Exception Type:** What went wrong
- **Message:** Why it failed
- **Stack Trace:** Where it occurred (complete call chain)

#### 4. Improves Security

```java
try {
    processSensitiveData(data);
} catch (Exception e) {
    // Hide sensitive information
    log.error("Error occurred");  // Don't log actual data
    throw new GenericException("Processing failed");
}
```

### Disadvantages

#### 1. Performance Overhead

**Problem:** If exception is not handled and stack trace is huge:

```
Method1 → Method2 → Method3 → ... → Method100
                                    ↑
                              Exception occurs
                                    │
                    Runtime searches backwards:
                    Method100? No
                    Method99? No
                    ...
                    Method1? No
                    Terminate
```

**Solution:** Handle exceptions as close to source as possible.

#### 2. Can Be Avoided in Some Cases

**With Exception Handling:**
```java
public int divide(int a, int b) {
    try {
        return a / b;
    } catch (ArithmeticException e) {
        return -1;
    }
}
```

**Better Approach (Avoid Exception):**
```java
public int divide(int a, int b) {
    if (b == 0) {
        return -1;  // Simple check, no exception overhead
    }
    return a / b;
}
```

**Rule:** If you can handle it with a simple condition, **avoid exception handling**.

---

## Best Practices

1. **Handle Exceptions Close to Source:** Don't let exceptions propagate unnecessarily
2. **Use Specific Exceptions:** Catch specific exceptions, not generic `Exception`
3. **Don't Swallow Exceptions:** At least log exceptions
4. **Use Finally for Cleanup:** Always close resources in finally block
5. **Avoid Exceptions for Control Flow:** Use exceptions for exceptional cases, not normal flow
6. **Document Exceptions:** Use JavaDoc to document thrown exceptions

**Example - Good Practice:**
```java
public void processFile(String filename) throws IOException {
    FileInputStream fis = null;
    try {
        fis = new FileInputStream(filename);
        // Process file
    } catch (FileNotFoundException e) {
        log.error("File not found: " + filename, e);
        throw e;  // Rethrow or handle appropriately
    } finally {
        if (fis != null) {
            try {
                fis.close();  // Always close
            } catch (IOException e) {
                log.error("Error closing file", e);
            }
        }
    }
}
```

---

## Summary

### What is Exception?
- Event that disrupts normal program flow
- Creates exception object with type, message, stack trace
- Runtime system searches for handler in call stack

### Exception Hierarchy
```
Object → Throwable → Error (unchecked)
                  → Exception → RuntimeException (unchecked)
                             → Checked Exceptions
```

### Types
- **Error:** JVM issues, cannot control (OutOfMemoryError, StackOverflowError)
- **Runtime Exception:** Unchecked, compiler doesn't force handling
- **Checked Exception:** Must handle or declare throws

### Handling Mechanisms
- **try-catch:** Handle exception
- **finally:** Always executes (cleanup)
- **throw:** Throw exception
- **throws:** Declare exception

### Key Rules
- Catch specific exceptions first, generic last
- Catch can only catch exceptions thrown in try block
- Finally always executes (except JVM crashes)
- Checked exceptions must be handled or declared

### Advantages
- Clean code separation
- Program recovery
- Better debugging
- Security (hide sensitive info)

### Disadvantages
- Performance overhead (huge stack traces)
- Can sometimes be avoided with simple checks

---

## Practice Exercises

1. Create a method that divides two numbers. Handle `ArithmeticException` if divisor is zero.

2. Create a method that reads from an array. Handle `ArrayIndexOutOfBoundsException`.

3. Create a custom exception `InvalidAgeException`. Throw it when age is less than 18.

4. Create a method that opens a file. Use try-catch-finally to ensure file is always closed.

5. Create a method chain (method1 → method2 → method3). Throw exception in method3, handle in method1 using throws.

6. Demonstrate multiple catch blocks with proper ordering (specific to generic).

---

## Interview Questions

1. **What is an exception?**  
   An event that occurs during program execution and disrupts normal flow. Creates exception object with type, message, and stack trace.

2. **What is the difference between Error and Exception?**  
   Error: JVM issues, cannot control (OutOfMemoryError). Exception: Program issues, can handle (IOException, NullPointerException).

3. **What is the difference between checked and unchecked exceptions?**  
   Checked: Must handle at compile time (IOException). Unchecked: No compile-time requirement (ArithmeticException, NullPointerException).

4. **What is stack trace?**  
   Sequence of method calls from where exception occurred to the starting point. Helps in debugging.

5. **What is the difference between throw and throws?**  
   `throw`: Throws an exception in code. `throws`: Declares that method might throw exception.

6. **When does finally block not execute?**  
   When JVM crashes (OutOfMemoryError, StackOverflowError), system shutdown, or process killed forcefully.

7. **Can you have multiple catch blocks?**  
   Yes, but specific exceptions must come before generic ones.

8. **Can you catch multiple exceptions in one catch block?**  
   Yes (Java 7+): `catch (Exception1 | Exception2 e) { }`

9. **What happens if exception is not handled?**  
   Program terminates abruptly and prints stack trace.

10. **How to create custom exception?**  
    Extend `Exception` (checked) or `RuntimeException` (unchecked). Provide constructor with message.

11. **What is the advantage of exception handling?**  
    Separates error handling from regular code, allows program recovery, provides debugging information.

12. **When should you avoid exception handling?**  
    When you can handle it with simple condition checks (e.g., checking for null or zero before operation).

13. **What is rethrowing exception?**  
    Catching an exception, doing some processing (logging), then throwing it again to let caller handle it.

14. **Can finally block have return statement?**  
    Yes, but it will override return from try/catch blocks.

15. **What is the parent class of all exceptions?**  
    `Throwable` is the parent of both `Error` and `Exception`.

