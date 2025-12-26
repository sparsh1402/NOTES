# Java Functional Interface and Lambda Expression

## Table of Contents
- [Functional Interface](#functional-interface)
  - [What is Functional Interface?](#what-is-functional-interface)
  - [@FunctionalInterface Annotation](#functionalinterface-annotation)
  - [Functional Interface Properties](#functional-interface-properties)
- [Lambda Expression](#lambda-expression)
  - [What is Lambda Expression?](#what-is-lambda-expression)
  - [Why Lambda Expression?](#why-lambda-expression)
  - [Syntax of Lambda Expression](#syntax-of-lambda-expression)
  - [Ways to Implement Functional Interface](#ways-to-implement-functional-interface)
- [Types of Functional Interfaces](#types-of-functional-interfaces)
  - [Consumer](#consumer)
  - [Supplier](#supplier)
  - [Function](#function)
  - [Predicate](#predicate)
- [Functional Interface Extension](#functional-interface-extension)
  - [Functional Interface Extending Non-Functional Interface](#functional-interface-extending-non-functional-interface)
  - [Non-Functional Interface Extending Functional Interface](#non-functional-interface-extending-functional-interface)
  - [Functional Interface Extending Functional Interface](#functional-interface-extending-functional-interface)
- [Summary](#summary)

---

## Functional Interface

### What is Functional Interface?

A **functional interface** is an interface that contains **exactly one abstract method**.

**Also Known As:** SAM Interface (Single Abstract Method)

**Key Points:**
- Must have **only one** abstract method
- Can have **default methods**
- Can have **static methods**
- Can have **methods from Object class** (like `toString()`, `equals()`, etc.)

**Example:**
```java
// Functional interface - has only one abstract method
@FunctionalInterface
interface Bird {
    void fly();  // Only one abstract method
}

// Also functional interface (even without annotation)
interface Animal {
    void eat();  // Only one abstract method
}
```

### @FunctionalInterface Annotation

The `@FunctionalInterface` annotation is **optional** but recommended.

**Purpose:**
- Ensures interface has exactly one abstract method
- Prevents adding more abstract methods accidentally
- Makes intent clear

**Example:**
```java
@FunctionalInterface
interface Bird {
    void fly();
    
    // If you try to add another abstract method:
    // void eat();  // Compilation error!
}
```

**Without Annotation:**
```java
interface Bird {
    void fly();
    void eat();  // No error - but now it's NOT a functional interface
}
```

### Functional Interface Properties

**Can Have:**
1. **One abstract method** (required)
2. **Default methods** (allowed)
3. **Static methods** (allowed)
4. **Object class methods** (allowed - not counted as abstract)

**Example:**
```java
@FunctionalInterface
interface Bird {
    void fly();  // Abstract method
    
    // Default method - allowed
    default void eat() {
        System.out.println("Bird eats");
    }
    
    // Static method - allowed
    static void sleep() {
        System.out.println("Bird sleeps");
    }
    
    // Object class method - allowed (not counted)
    @Override
    String toString();  // From Object class
}
```

**Object Class Methods:**
- Methods like `toString()`, `equals()`, `hashCode()` from `Object` class
- Not considered as abstract methods for functional interface
- Implementing class gets them from `Object` class automatically

---

## Lambda Expression

### What is Lambda Expression?

A **lambda expression** is a **concise way to implement a functional interface**.

**Key Points:**
- Works **only with functional interfaces**
- Reduces verbosity compared to anonymous classes
- Introduced in Java 8

### Why Lambda Expression?

**Problem with Anonymous Classes:**
```java
@FunctionalInterface
interface Bird {
    void fly(String name);
}

// Anonymous class - too verbose
Bird bird = new Bird() {
    @Override
    public void fly(String name) {
        System.out.println(name + " flies");
    }
};
```

**Solution with Lambda:**
```java
// Lambda expression - concise
Bird bird = (String name) -> {
    System.out.println(name + " flies");
};

// Even more concise (single line)
Bird bird = (String name) -> System.out.println(name + " flies");
```

**Benefits:**
- **Less code** - No need to write method name, return type, etc.
- **Readable** - More concise and clear
- **Functional programming** - Enables functional programming style

### Syntax of Lambda Expression

```java
(parameters) -> { body }
```

**Components:**
1. **Parameters** - Input parameters (can be empty `()`)
2. **Arrow operator** - `->`
3. **Body** - Implementation (can be single expression or block)

**Examples:**
```java
// No parameters
() -> System.out.println("Hello");

// One parameter
(String name) -> System.out.println(name);
name -> System.out.println(name);  // Type can be inferred

// Multiple parameters
(int a, int b) -> a + b;
(a, b) -> a + b;  // Type can be inferred

// Block body
(String name) -> {
    System.out.println("Name: " + name);
    System.out.println("Length: " + name.length());
}

// Single expression (no braces needed)
(int x) -> x * 2;
```

**Rules:**
- If **single expression**, braces `{}` are optional
- If **multiple statements**, braces `{}` are required
- If **single parameter**, parentheses `()` are optional
- If **no parameters** or **multiple parameters**, parentheses `()` are required
- **Return statement** is optional for single expression

### Ways to Implement Functional Interface

There are **three ways** to implement a functional interface:

#### 1. Using `implements` Keyword

```java
@FunctionalInterface
interface Bird {
    void fly();
}

class Eagle implements Bird {
    @Override
    public void fly() {
        System.out.println("Eagle flies");
    }
}

// Usage
Bird bird = new Eagle();
bird.fly();
```

#### 2. Using Anonymous Class

```java
@FunctionalInterface
interface Bird {
    void fly();
}

// Anonymous class
Bird bird = new Bird() {
    @Override
    public void fly() {
        System.out.println("Bird flies");
    }
};

bird.fly();
```

#### 3. Using Lambda Expression

```java
@FunctionalInterface
interface Bird {
    void fly();
}

// Lambda expression
Bird bird = () -> System.out.println("Bird flies");
bird.fly();
```

**Why Lambda is Better:**
- **Less verbose** - No need for method name, `@Override`, etc.
- **Functional interface has only one method** - Compiler knows which method to implement
- **More readable** - Cleaner syntax

---

## Types of Functional Interfaces

Java provides **four built-in functional interfaces** in `java.util.function` package:

1. **Consumer** - Accepts input, returns nothing
2. **Supplier** - Accepts nothing, returns output
3. **Function** - Accepts input, returns output
4. **Predicate** - Accepts input, returns boolean

### Consumer

**Definition:** Represents an operation that accepts a **single input parameter** and **returns no result**.

**Interface:**
```java
@FunctionalInterface
interface Consumer<T> {
    void accept(T t);
}
```

**Example:**
```java
import java.util.function.Consumer;

public class Test {
    public static void main(String[] args) {
        // Consumer accepts Integer, returns nothing
        Consumer<Integer> consumer = (Integer value) -> {
            if (value > 10) {
                System.out.println("Value is greater than 10");
            }
            // Process the value
        };
        
        consumer.accept(11);  // Calls the lambda
    }
}
```

**Simplified:**
```java
Consumer<Integer> consumer = value -> {
    if (value > 10) {
        System.out.println("Value is greater than 10");
    }
};

consumer.accept(11);
```

### Supplier

**Definition:** Represents a supplier of results. Accepts **no input parameter** but **produces a result**.

**Interface:**
```java
@FunctionalInterface
interface Supplier<T> {
    T get();
}
```

**Example:**
```java
import java.util.function.Supplier;

public class Test {
    public static void main(String[] args) {
        // Supplier accepts nothing, returns String
        Supplier<String> supplier = () -> "Hello World";
        
        String result = supplier.get();
        System.out.println(result);
    }
}
```

**With Block:**
```java
Supplier<String> supplier = () -> {
    return "Hello World";
};

// Or simply (single expression)
Supplier<String> supplier = () -> "Hello World";
```

### Function

**Definition:** Represents a function that accepts **one argument** and **produces a result**.

**Interface:**
```java
@FunctionalInterface
interface Function<T, R> {
    R apply(T t);
}
```

**Example:**
```java
import java.util.function.Function;

public class Test {
    public static void main(String[] args) {
        // Function accepts Integer, returns String
        Function<Integer, String> function = (Integer num) -> {
            return num.toString();
        };
        
        String result = function.apply(123);
        System.out.println(result);  // "123"
    }
}
```

**Simplified:**
```java
Function<Integer, String> function = num -> num.toString();
String result = function.apply(123);
```

### Predicate

**Definition:** Represents a predicate (boolean-valued function) that accepts **one argument** and **returns boolean**.

**Interface:**
```java
@FunctionalInterface
interface Predicate<T> {
    boolean test(T t);
}
```

**Example:**
```java
import java.util.function.Predicate;

public class Test {
    public static void main(String[] args) {
        // Predicate accepts Integer, returns boolean
        Predicate<Integer> isEven = (Integer value) -> {
            return value % 2 == 0;
        };
        
        boolean result = isEven.test(4);
        System.out.println(result);  // true
    }
}
```

**Simplified:**
```java
Predicate<Integer> isEven = value -> value % 2 == 0;
boolean result = isEven.test(4);
```

**Summary Table:**

| Interface | Input | Output | Method Name |
|-----------|-------|--------|-------------|
| **Consumer<T>** | 1 parameter | void | `accept(T t)` |
| **Supplier<T>** | None | 1 result | `get()` |
| **Function<T, R>** | 1 parameter | 1 result | `apply(T t)` |
| **Predicate<T>** | 1 parameter | boolean | `test(T t)` |

---

## Functional Interface Extension

### Functional Interface Extending Non-Functional Interface

**Scenario:** Functional interface extends a non-functional interface with abstract methods.

**Problem:**
```java
// Non-functional interface (has abstract method)
interface LivingThing {
    void canBreathe();
}

// Functional interface trying to extend
@FunctionalInterface
interface Bird extends LivingThing {
    void fly();  // Another abstract method
}
// ERROR: Now has 2 abstract methods (canBreathe + fly)
```

**Solution:**
```java
// Parent has default method
interface LivingThing {
    default void canBreathe() {
        System.out.println("Can breathe");
    }
}

// Functional interface - only one abstract method
@FunctionalInterface
interface Bird extends LivingThing {
    void fly();  // Only one abstract method
}
// OK: canBreathe is default, fly is abstract
```

### Non-Functional Interface Extending Functional Interface

**Scenario:** Non-functional interface extends functional interface.

**Example:**
```java
// Functional interface
@FunctionalInterface
interface LivingThing {
    void canBreathe();
}

// Non-functional interface (no @FunctionalInterface annotation)
interface Bird extends LivingThing {
    void fly();  // Adds another abstract method
}
// OK: Bird is not marked as functional, so can have multiple abstract methods
```

### Functional Interface Extending Functional Interface

**Scenario:** Functional interface extends another functional interface.

**Case 1: Different Methods (ERROR)**
```java
@FunctionalInterface
interface LivingThing {
    void canBreathe();
}

@FunctionalInterface
interface Bird extends LivingThing {
    void fly();  // Different method
}
// ERROR: Now has 2 abstract methods
```

**Case 2: Same Method (OK)**
```java
@FunctionalInterface
interface LivingThing {
    boolean canBreathe();
}

@FunctionalInterface
interface Bird extends LivingThing {
    boolean canBreathe();  // Same method signature
}
// OK: Same method, child overrides parent
```

**Implementation:**
```java
// Lambda expression
Bird bird = () -> true;  // Implements canBreathe()

bird.canBreathe();  // Returns true
```

---

## Summary

### Functional Interface
- Interface with **exactly one abstract method**
- Can have default methods, static methods, Object class methods
- `@FunctionalInterface` annotation is optional but recommended
- Also known as SAM (Single Abstract Method) interface

### Lambda Expression
- **Concise way** to implement functional interface
- Syntax: `(parameters) -> { body }`
- Works **only with functional interfaces**
- Reduces verbosity compared to anonymous classes

### Built-in Functional Interfaces
- **Consumer<T>** - Accepts input, returns nothing
- **Supplier<T>** - Accepts nothing, returns output
- **Function<T, R>** - Accepts input, returns output
- **Predicate<T>** - Accepts input, returns boolean

### Key Benefits
- **Less code** - More concise
- **Readable** - Cleaner syntax
- **Functional programming** - Enables functional style
- **Reusable** - Built-in interfaces for common use cases

---

## Practice Exercises

1. Create a functional interface `Calculator` with method `int calculate(int a, int b)`. Implement it using lambda expression.

2. Use `Consumer` to print all elements of a list.

3. Use `Supplier` to generate random numbers.

4. Use `Function` to convert a list of integers to list of strings.

5. Use `Predicate` to filter even numbers from a list.

6. Create a custom functional interface and implement it using all three ways (implements, anonymous, lambda).

---

## Interview Questions

1. **What is a functional interface?**  
   An interface with exactly one abstract method. Can have default methods, static methods, and Object class methods.

2. **What is lambda expression?**  
   A concise way to implement a functional interface. Syntax: `(parameters) -> { body }`.

3. **Why use lambda expression?**  
   Reduces verbosity, more readable, enables functional programming style.

4. **Can lambda expression work with non-functional interfaces?**  
   No, lambda expression works only with functional interfaces (interfaces with exactly one abstract method).

5. **What are the built-in functional interfaces?**  
   Consumer, Supplier, Function, and Predicate in `java.util.function` package.

6. **What is the difference between Consumer and Supplier?**  
   Consumer accepts input and returns nothing. Supplier accepts nothing and returns output.

7. **What is Predicate?**  
   A functional interface that accepts one argument and returns boolean.

8. **Can a functional interface extend another functional interface?**  
   Yes, but only if they have the same method signature. If they have different methods, it won't be functional anymore.

9. **What is @FunctionalInterface annotation?**  
   Optional annotation that ensures interface has exactly one abstract method and prevents adding more.

10. **Can functional interface have default methods?**  
    Yes, functional interface can have default methods, static methods, and Object class methods in addition to one abstract method.

