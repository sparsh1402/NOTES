# Java Interfaces - Part 2: Java 8 & Java 9 Features

## Table of Contents
- [Introduction](#introduction)
- [Java 8 Features](#java-8-features)
  - [Default Methods](#default-methods)
    - [What is Default Method?](#what-is-default-method)
    - [Why Default Methods?](#why-default-methods)
    - [How to Define Default Method](#how-to-define-default-method)
    - [Default Method in Interface Extension](#default-method-in-interface-extension)
    - [Multiple Interface Conflict](#multiple-interface-conflict)
  - [Static Methods](#static-methods)
    - [What is Static Method in Interface?](#what-is-static-method-in-interface)
    - [How to Define Static Method](#how-to-define-static-method)
    - [Rules for Static Methods](#rules-for-static-methods)
- [Java 9 Features](#java-9-features)
  - [Private Methods](#private-methods)
    - [What is Private Method?](#what-is-private-method)
    - [Why Private Methods?](#why-private-methods)
    - [Rules for Private Methods](#rules-for-private-methods)
  - [Private Static Methods](#private-static-methods)
    - [What is Private Static Method?](#what-is-private-static-method)
    - [Rules for Private Static Methods](#rules-for-private-static-methods)
- [Summary](#summary)

---

## Introduction

**Before Java 8:**
- Interfaces could only have **abstract methods** (method signatures only)
- All implementing classes had to provide implementation for all methods
- Adding new methods to interface required changes in all implementing classes

**Java 8 Introduced:**
- **Default methods** - Methods with implementation in interface
- **Static methods** - Static methods with implementation in interface

**Java 9 Introduced:**
- **Private methods** - Private methods with implementation
- **Private static methods** - Private static methods with implementation

---

## Java 8 Features

### Default Methods

#### What is Default Method?

A **default method** is a method in an interface that has an **implementation**. It uses the `default` keyword.

**Syntax:**
```java
interface InterfaceName {
    void abstractMethod();  // Abstract method (no implementation)
    
    default void defaultMethod() {  // Default method (has implementation)
        // Implementation
    }
}
```

#### Why Default Methods?

**The Problem:**
- Before Java 8, if you added a new method to an interface, **all implementing classes** had to provide implementation
- This was a major issue when adding methods to widely used interfaces like `Collection`

**Example Problem:**
```java
interface Bird {
    void fly();  // All classes implement this
}

class Eagle implements Bird {
    @Override
    public void fly() { /* implementation */ }
}

class Sparrow implements Bird {
    @Override
    public void fly() { /* implementation */ }
}

// Now you want to add a new method
interface Bird {
    void fly();
    int getMinimumFlyHeight();  // NEW METHOD - All classes must implement!
}
// Eagle and Sparrow must now implement getMinimumFlyHeight()
```

**The Solution - Default Methods:**
```java
interface Bird {
    void fly();  // Abstract method
    
    // Default method - provides common implementation
    default int getMinimumFlyHeight() {
        return 100;  // Default implementation
    }
}

class Eagle implements Bird {
    @Override
    public void fly() {
        System.out.println("Eagle flies");
    }
    // No need to implement getMinimumFlyHeight() - uses default
}

class Sparrow implements Bird {
    @Override
    public void fly() {
        System.out.println("Sparrow flies");
    }
    // No need to implement getMinimumFlyHeight() - uses default
}

// Usage
public class Test {
    public static void main(String[] args) {
        Eagle eagle = new Eagle();
        eagle.fly();
        System.out.println(eagle.getMinimumFlyHeight());  // Uses default implementation
    }
}
```

**Why Java 8 Introduced Default Methods:**
- **Stream API** was introduced in Java 8
- `stream()` method was added to `Collection` interface
- Thousands of classes implement `Collection`
- Without default methods, all classes would need to implement `stream()`
- Default method allowed adding `stream()` to interface with implementation
- All existing classes automatically got this functionality

#### How to Define Default Method

```java
interface Bird {
    void fly();  // Abstract method
    
    // Default method
    default int getMinimumFlyHeight() {
        return 100;
    }
    
    // Default method with more logic
    default void printInfo() {
        System.out.println("This is a bird");
        System.out.println("Minimum fly height: " + getMinimumFlyHeight());
    }
}
```

**Key Points:**
- Use `default` keyword before return type
- Must provide implementation (body)
- Implementing classes can use it directly or override it
- Can call other methods (default, static, private) from default method

#### Default Method in Interface Extension

When an interface extends another interface with default methods, there are **three ways** to handle it:

**1. Do Nothing (Inherit Default)**
```java
interface LivingThing {
    default void canBreathe() {
        System.out.println("Can breathe");
    }
}

interface Bird extends LivingThing {
    void fly();  // Doesn't touch canBreathe()
}

class Eagle implements Bird {
    @Override
    public void fly() {
        System.out.println("Eagle flies");
    }
    // canBreathe() is available from parent interface
}

// Usage
Eagle eagle = new Eagle();
eagle.canBreathe();  // Uses default from LivingThing
```

**2. Make it Abstract**
```java
interface LivingThing {
    default void canBreathe() {
        System.out.println("Can breathe");
    }
}

interface Bird extends LivingThing {
    void fly();
    void canBreathe();  // Make it abstract - forces implementation
}

class Eagle implements Bird {
    @Override
    public void fly() {
        System.out.println("Eagle flies");
    }
    
    @Override
    public void canBreathe() {  // Must implement
        System.out.println("Eagle can breathe");
    }
}
```

**3. Override Default Method**
```java
interface LivingThing {
    default void canBreathe() {
        System.out.println("Can breathe");
    }
}

interface Bird extends LivingThing {
    void fly();
    
    @Override
    default void canBreathe() {
        LivingThing.super.canBreathe();  // Call parent default method
        System.out.println("Bird can also breathe");
    }
}

class Eagle implements Bird {
    @Override
    public void fly() {
        System.out.println("Eagle flies");
    }
    // Uses Bird's default canBreathe()
}
```

**Calling Parent Default Method:**
```java
interface Parent {
    default void method() {
        System.out.println("Parent method");
    }
}

interface Child extends Parent {
    @Override
    default void method() {
        Parent.super.method();  // Call parent default method
        System.out.println("Child method");
    }
}
```

#### Multiple Interface Conflict

**Problem:** When a class implements multiple interfaces with same default method name.

```java
interface Bird {
    default void canBreathe() {
        System.out.println("Bird can breathe");
    }
}

interface LivingThing {
    default void canBreathe() {
        System.out.println("Living thing can breathe");
    }
}

// ERROR: Which canBreathe() to use?
class Eagle implements Bird, LivingThing {
    // Compilation error - must provide implementation
}
```

**Solution:** Class must provide its own implementation.

```java
class Eagle implements Bird, LivingThing {
    @Override
    public void canBreathe() {
        // Must provide implementation
        System.out.println("Eagle can breathe");
        // Or call one of them:
        // Bird.super.canBreathe();
        // LivingThing.super.canBreathe();
    }
}
```

---

### Static Methods

#### What is Static Method in Interface?

A **static method** in an interface is a method that can be called using the **interface name** without creating an object.

**Key Points:**
- Has implementation in interface
- Cannot be overridden by implementing classes
- Called using interface name: `InterfaceName.methodName()`
- By default `public` (can be `private` from Java 9)

#### How to Define Static Method

```java
interface Bird {
    void fly();  // Abstract method
    
    // Static method
    static void canBreathe() {
        System.out.println("All birds can breathe");
    }
}

class Eagle implements Bird {
    @Override
    public void fly() {
        System.out.println("Eagle flies");
    }
    // Cannot override canBreathe() - it's static
}

// Usage
public class Test {
    public static void main(String[] args) {
        Bird.canBreathe();  // Call using interface name
        // eagle.canBreathe();  // ERROR - cannot call on instance
    }
}
```

#### Rules for Static Methods

1. **Cannot be Overridden:** Implementing classes cannot override static methods
2. **Called by Interface Name:** Must use `InterfaceName.methodName()`
3. **Cannot Call on Instance:** Cannot call static method using object reference
4. **Can Access Other Static Methods:** Can call other static methods in same interface

**Example:**
```java
interface Bird {
    static void method1() {
        System.out.println("Method 1");
        method2();  // Can call other static method
    }
    
    static void method2() {
        System.out.println("Method 2");
    }
}

class Eagle implements Bird {
    // Cannot override method1() or method2()
}

// Usage
Bird.method1();  // Correct
// new Eagle().method1();  // ERROR
```

**Why Not Make Stream Static?**
- `stream()` method in `Collection` interface is a default method, not static
- Many classes override `stream()` to provide their own implementation
- If it were static, classes couldn't override it
- Default method allows both: common implementation and ability to override

---

## Java 9 Features

### Private Methods

#### What is Private Method?

A **private method** in an interface is a method with implementation that can only be accessed **within the interface itself**.

**Purpose:** To share common code between default methods and other non-static methods.

#### Why Private Methods?

**Problem:**
- Multiple default methods might share common code
- Code duplication occurs
- Need a way to extract common logic

**Example Problem:**
```java
interface Bird {
    default void method1() {
        // 80% common code
        System.out.println("Common logic 1");
        System.out.println("Common logic 2");
        System.out.println("Common logic 3");
        // 20% specific code
        System.out.println("Method 1 specific");
    }
    
    default void method2() {
        // 80% common code (duplicated!)
        System.out.println("Common logic 1");
        System.out.println("Common logic 2");
        System.out.println("Common logic 3");
        // 20% specific code
        System.out.println("Method 2 specific");
    }
}
```

**Solution with Private Methods:**
```java
interface Bird {
    default void method1() {
        commonLogic();  // Call private method
        System.out.println("Method 1 specific");
    }
    
    default void method2() {
        commonLogic();  // Call private method
        System.out.println("Method 2 specific");
    }
    
    // Private method - shared by default methods
    private void commonLogic() {
        System.out.println("Common logic 1");
        System.out.println("Common logic 2");
        System.out.println("Common logic 3");
    }
}
```

#### Rules for Private Methods

1. **Cannot be Abstract:** Must have implementation
2. **Accessible Only Within Interface:** Cannot be accessed outside interface
3. **Can be Called by:** Default methods and other non-static private methods
4. **Cannot be Called by:** Static methods (unless it's private static)

**Example:**
```java
interface Bird {
    void fly();  // Abstract method
    
    default void method1() {
        System.out.println("Method 1");
        privateMethod();  // Can call private method
    }
    
    default void method2() {
        System.out.println("Method 2");
        privateMethod();  // Can call private method
    }
    
    // Private method
    private void privateMethod() {
        System.out.println("Private method");
    }
    
    static void staticMethod() {
        // privateMethod();  // ERROR - static cannot call non-static private
        privateStaticMethod();  // Can call private static
    }
    
    private static void privateStaticMethod() {
        System.out.println("Private static method");
    }
}
```

### Private Static Methods

#### What is Private Static Method?

A **private static method** in an interface is a static method with implementation that can only be accessed **within the interface itself**.

**Purpose:** To share common code between static methods.

#### Rules for Private Static Methods

1. **Can Only Call Static Members:** Private static methods can only call other static methods/variables
2. **Called by Static Methods:** Can be called by static methods and other private static methods
3. **Cannot be Called by Default Methods:** Default methods (non-static) cannot call private static methods directly

**Example:**
```java
interface Bird {
    // Default method (non-static)
    default void defaultMethod() {
        System.out.println("Default method");
        // privateStaticMethod();  // ERROR - non-static cannot call static
        privateMethod();  // Can call non-static private
    }
    
    // Static method
    static void staticMethod() {
        System.out.println("Static method");
        privateStaticMethod();  // Can call private static
    }
    
    // Private method (non-static)
    private void privateMethod() {
        System.out.println("Private method");
    }
    
    // Private static method
    private static void privateStaticMethod() {
        System.out.println("Private static method");
    }
}
```

**Summary of Access Rules:**

| Method Type | Can Call | Cannot Call |
|-------------|----------|-------------|
| **Default (non-static)** | Private (non-static), Static (public) | Private static |
| **Static (public)** | Private static, Static (public) | Private (non-static) |
| **Private (non-static)** | Private (non-static), Default methods | Static methods |
| **Private static** | Private static, Static (public) | Non-static methods |

---

## Summary

### Java 8 Features

**Default Methods:**
- Methods with implementation in interface
- Use `default` keyword
- Implementing classes can use or override
- Solves problem of adding methods to existing interfaces
- Can call parent default using `InterfaceName.super.methodName()`

**Static Methods:**
- Methods with implementation, called using interface name
- Cannot be overridden by implementing classes
- By default `public`
- Useful for utility methods

### Java 9 Features

**Private Methods:**
- Methods with implementation, accessible only within interface
- Used to share code between default methods
- Cannot be abstract
- Cannot be accessed outside interface

**Private Static Methods:**
- Static methods accessible only within interface
- Used to share code between static methods
- Can only call static members
- Cannot be called by default methods

### Key Differences

| Feature | Default | Static | Private | Private Static |
|---------|---------|--------|---------|----------------|
| **Keyword** | `default` | `static` | `private` | `private static` |
| **Can Override?** | Yes | No | N/A | N/A |
| **Called By** | Interface name or instance | Interface name only | Within interface only | Within interface only |
| **Can Call Non-Static?** | Yes | No | Yes | No |
| **Can Call Static?** | Yes | Yes | No | Yes |

---

## Practice Exercises

1. Create an interface `Vehicle` with a default method `start()` and abstract method `drive()`. Create classes implementing it.

2. Create an interface with a static method `getCount()`. Demonstrate calling it using interface name.

3. Create an interface with multiple default methods sharing common code. Extract common code into a private method.

4. Create an interface extending another interface. Override a default method and call parent's default method.

5. Create a class implementing two interfaces with same default method name. Provide implementation to resolve conflict.

---

## Interview Questions

1. **What is a default method?**  
   A method in interface with implementation, using `default` keyword. Allows adding methods to interfaces without breaking existing implementations.

2. **Why were default methods introduced in Java 8?**  
   To add `stream()` method to `Collection` interface without requiring all implementing classes to provide implementation.

3. **Can default methods be overridden?**  
   Yes, implementing classes can override default methods.

4. **What happens if two interfaces have same default method?**  
   Class implementing both must provide its own implementation to resolve conflict.

5. **Can static methods in interface be overridden?**  
   No, static methods in interface cannot be overridden by implementing classes.

6. **How to call parent interface default method?**  
   Use `InterfaceName.super.methodName()`.

7. **What is private method in interface?**  
   A method with implementation accessible only within the interface. Used to share code between default methods.

8. **Can private methods be abstract?**  
   No, private methods must have implementation.

9. **Can default methods call private methods?**  
   Yes, default methods can call private (non-static) methods.

10. **Can static methods call private methods?**  
    No, static methods can only call private static methods, not non-static private methods.

