# Java Interfaces - Part 1

## Table of Contents
- [What is an Interface?](#what-is-an-interface)
- [How to Define an Interface](#how-to-define-an-interface)
  - [Basic Syntax](#basic-syntax)
  - [Interface Modifiers](#interface-modifiers)
  - [Extending Interfaces](#extending-interfaces)
- [Why We Need Interfaces](#why-we-need-interfaces)
  - [1. Abstraction](#1-abstraction)
  - [2. Polymorphism](#2-polymorphism)
  - [3. Multiple Inheritance](#3-multiple-inheritance)
- [Methods in Interface](#methods-in-interface)
  - [Method Properties](#method-properties)
  - [Method Access Modifiers](#method-access-modifiers)
- [Fields in Interface](#fields-in-interface)
  - [Field Properties](#field-properties)
- [Interface Implementation](#interface-implementation)
  - [Rules for Implementation](#rules-for-implementation)
  - [Concrete Class Implementation](#concrete-class-implementation)
  - [Abstract Class Implementation](#abstract-class-implementation)
  - [Multiple Interface Implementation](#multiple-interface-implementation)
- [Nested Interfaces](#nested-interfaces)
  - [Interface within Interface](#interface-within-interface)
  - [Interface within Class](#interface-within-class)
- [Difference Between Interface and Abstract Class](#difference-between-interface-and-abstract-class)

---

## What is an Interface?

An **interface** is a mechanism that helps two systems interact with each other without one system having to know the details of the other.

**In short:** Interface helps to achieve **abstraction**.

### Understanding Interface

**System Interaction:**
- **System 1** needs to interact with **System 2**
- **System 2** provides an interface (like a UI or client interface)
- **System 1** doesn't need to know how System 2 works internally
- **System 1** just calls the methods defined in the interface
- All internal implementation details are **abstracted** away

**Real-World Example:**
- When you drive a car and press the brake pedal, that's an interface
- You call "apply brake" without knowing how the car internally slows down
- The braking mechanism is abstracted from you

---

## How to Define an Interface

### Basic Syntax

```java
modifier interface InterfaceName {
    // body
}
```

**Components:**
1. **Modifier** - Access modifier (public or default)
2. **interface** - Keyword to define an interface
3. **InterfaceName** - Name of the interface
4. **Body** - Contains method signatures and constants

### Interface Modifiers

**Allowed Modifiers:**
- `public` - Accessible from anywhere
- `default` (package-private) - Accessible within the same package

**Not Allowed:**
- `protected` - Not allowed
- `private` - Not allowed

**Example:**
```java
// Public interface
public interface Bird {
    void fly();
}

// Default (package-private) interface
interface LivingThing {
    void breathe();
}
```

### Extending Interfaces

An interface can extend multiple other interfaces using the `extends` keyword.

**Syntax:**
```java
modifier interface InterfaceName extends ParentInterface1, ParentInterface2, ... {
    // body
}
```

**Example:**
```java
interface Bird {
    void fly();
}

interface LivingThing {
    void breathe();
}

// Interface extending multiple interfaces
interface NonFlyingBird extends Bird, LivingThing {
    void walk();
}
```

**Important Points:**
- Interfaces can extend **only interfaces**, not classes
- Can extend **multiple interfaces** (comma-separated)
- Uses `extends` keyword (not `implements`)

---

## Why We Need Interfaces

There are three main reasons why we need interfaces:

### 1. Abstraction

**Definition:** Interface helps achieve **full abstraction** - it defines **what** a class must do, but not **how** it will do it.

**Example:**
```java
interface Bird {
    void fly();  // Only signature, no implementation
}

class Eagle implements Bird {
    @Override
    public void fly() {
        System.out.println("Eagle flies high in the sky");
        // Implementation details
    }
}
```

**Key Points:**
- Interface provides 100% abstraction
- All methods in interface are abstract by default
- Implementation is provided by classes that implement the interface
- One system doesn't need to know details of another system

### 2. Polymorphism

**How Interface Achieves Polymorphism:**

1. **Interface as Data Type:** Interface can be used as a data type
2. **Runtime Decision:** At runtime, JVM decides which implementation to call
3. **Dynamic Method Invocation:** Same interface reference can call different implementations

**Example:**
```java
interface Bird {
    void fly();
}

class Eagle implements Bird {
    @Override
    public void fly() {
        System.out.println("Eagle flies high");
    }
}

class Hen implements Bird {
    @Override
    public void fly() {
        System.out.println("Hen flies low");
    }
}

// Using interface for polymorphism
public class Test {
    public static void main(String[] args) {
        Bird bird1 = new Eagle();  // Interface reference holding Eagle object
        Bird bird2 = new Hen();    // Interface reference holding Hen object
        
        bird1.fly();  // Calls Eagle's fly() method
        bird2.fly();  // Calls Hen's fly() method
    }
}
```

**How It Works:**
- At runtime, JVM checks which object the interface reference holds
- Based on the actual object type, it calls the appropriate method
- This is **runtime polymorphism**

**Important:**
- Cannot create object of interface: `new Bird()` is not allowed
- Can hold reference of implementing classes
- Runtime decides which method to invoke

### 3. Multiple Inheritance

**The Diamond Problem:**

Java doesn't allow multiple inheritance with classes due to the **diamond problem**.

**Example of Diamond Problem:**
```java
// If multiple inheritance was allowed (it's not)
class WaterAnimal {
    boolean canBreathe() {
        return true;
    }
}

class LandAnimal {
    boolean canBreathe() {
        return true;
    }
}

// This would cause confusion - which canBreathe() to call?
class Crocodile extends WaterAnimal, LandAnimal {  // ERROR: Not allowed
    // If we call crocodile.canBreathe(), which one?
}
```

**Solution with Interfaces:**

Interfaces solve this because they only have method signatures, not implementations.

```java
interface WaterAnimal {
    boolean canBreathe();  // Only signature
}

interface LandAnimal {
    boolean canBreathe();  // Only signature
}

class Crocodile implements WaterAnimal, LandAnimal {
    @Override
    public boolean canBreathe() {
        return true;  // Single implementation for both
    }
}
```

**Why It Works:**
- Both interfaces have same method signature
- Class provides **one implementation** that satisfies both
- No confusion - only one method to call
- **Multiple inheritance achieved through interfaces**

---

## Methods in Interface

### Method Properties

**Key Points:**
1. **Only Signatures:** Methods in interface have only signatures, no implementation
2. **Implicitly Public:** All methods are implicitly `public` (even if not written)
3. **Implicitly Abstract:** All methods are implicitly `abstract` (even if not written)
4. **Cannot be Final:** Methods cannot be declared as `final`

**Example:**
```java
interface Bird {
    void fly();              // Implicitly: public abstract void fly();
    public void eat();       // Same as above - both are public abstract
}
```

**Why Methods Cannot be Final:**
- `final` keyword means method cannot be overridden
- But interface methods **must be implemented** by classes
- If interface methods were `final`, classes couldn't provide implementation
- This contradicts the purpose of interfaces

### Method Access Modifiers

**In Interface:**
- All methods are **public** by default
- Cannot use `private`, `protected`, or `default` (before Java 9)
- From Java 9, `private` methods are allowed (covered in Part 2)

---

## Fields in Interface

### Field Properties

**All fields in interface are:**
1. **public** - Accessible from anywhere
2. **static** - Belongs to interface, not instances
3. **final** - Constant, cannot be changed

**Example:**
```java
interface Bird {
    int MAX_HEIGHT_IN_FEET = 2000;  // Implicitly: public static final int MAX_HEIGHT_IN_FEET = 2000;
    
    // Same as:
    public static final int MAX_HEIGHT_IN_FEET_2 = 2000;
}
```

**Key Points:**
- Fields are **constants** (public static final)
- Must be initialized when declared
- Cannot be changed after initialization
- Cannot be `private` or `protected`
- Accessible using interface name: `Bird.MAX_HEIGHT_IN_FEET`

---

## Interface Implementation

### Rules for Implementation

1. **Access Modifier:** Overriding method cannot have more restrictive access specifier
   - If interface method is `public`, implementing method must be `public`
   - Cannot be `protected` or `private`

2. **Concrete Class:** Must override **all** abstract methods declared in interface

3. **Abstract Class:** Not forced to override all methods (can have abstract methods)

4. **Multiple Interfaces:** A class can implement multiple interfaces

### Concrete Class Implementation

```java
interface Bird {
    void fly();
    void eat();
}

// Concrete class must implement ALL methods
class Eagle implements Bird {
    @Override
    public void fly() {  // Must be public, cannot be protected/private
        System.out.println("Eagle flies");
    }
    
    @Override
    public void eat() {  // Must implement all methods
        System.out.println("Eagle eats");
    }
}
```

### Abstract Class Implementation

```java
interface Bird {
    void canFly();
    int numberOfLegs();
}

// Abstract class can choose which methods to implement
abstract class Eagle implements Bird {
    @Override
    public void canFly() {
        System.out.println("Eagle can fly");
    }
    // numberOfLegs() not implemented - left for concrete subclass
}

// Concrete class must implement remaining abstract methods
class WhiteEagle extends Eagle {
    @Override
    public int numberOfLegs() {
        return 2;
    }
}
```

### Multiple Interface Implementation

```java
interface WaterAnimal {
    boolean canBreathe();
}

interface LandAnimal {
    boolean canBreathe();
}

// Class implementing multiple interfaces
class Crocodile implements WaterAnimal, LandAnimal {
    @Override
    public boolean canBreathe() {
        return true;  // Single implementation satisfies both
    }
}
```

---

## Nested Interfaces

An interface can be declared within another interface or within a class. These are called **nested interfaces**.

**Purpose:** To group logically related interfaces together.

### Interface within Interface

**Rules:**
- Nested interface within interface **must be public**
- Cannot be `private`, `protected`, or `default`

**Example:**
```java
interface Bird {
    void canFly();  // Outer interface method
    
    // Nested interface - must be public
    interface NonFlyingBird {
        void canRun();  // Inner interface method
    }
}

// Implementing only outer interface
class Eagle implements Bird {
    @Override
    public void canFly() {
        System.out.println("Eagle can fly");
    }
}

// Implementing only inner interface
class Ostrich implements Bird.NonFlyingBird {
    @Override
    public void canRun() {
        System.out.println("Ostrich can run");
    }
}

// Implementing both
class SomeBird implements Bird, Bird.NonFlyingBird {
    @Override
    public void canFly() {
        System.out.println("Can fly");
    }
    
    @Override
    public void canRun() {
        System.out.println("Can run");
    }
}

// Usage
public class Test {
    public static void main(String[] args) {
        Bird.NonFlyingBird bird = new Ostrich();
        bird.canRun();
    }
}
```

**Key Points:**
- When implementing outer interface, only outer methods need implementation
- When implementing inner interface, only inner methods need implementation
- Can implement both separately or together

### Interface within Class

**Rules:**
- Can be `public`, `protected`, `private`, or `default`
- No restriction (unlike interface within interface)

**Example:**
```java
class Bird {
    // Nested interface - can be private, protected, or public
    protected interface NonFlyingBird {
        void canRun();
    }
}

class Ostrich implements Bird.NonFlyingBird {
    @Override
    public void canRun() {
        System.out.println("Ostrich can run");
    }
}
```

**Note:** Nested interfaces are rarely used in practice but are important for interview knowledge.

---

## Difference Between Interface and Abstract Class

| Feature | Abstract Class | Interface |
|---------|---------------|-----------|
| **Keyword** | `abstract class` | `interface` |
| **Child Class Keyword** | `extends` | `implements` |
| **Methods** | Can have both abstract and non-abstract methods | Only abstract methods (before Java 8) |
| **Extends/Implements** | Can extend one class and implement multiple interfaces | Can extend only interfaces |
| **Variables** | Can be static, non-static, final, non-final | Always `public static final` (constants) |
| **Access Modifiers** | Variables and methods can be private, protected, public, default | Everything is public by default |
| **Multiple Inheritance** | Not supported (diamond problem) | Supported (through interfaces) |
| **Implementation** | Can provide implementation of interface | Cannot provide implementation of abstract class |
| **Constructor** | Can have constructor | Cannot have constructor |
| **Abstract Method Declaration** | Must use `abstract` keyword | No keyword needed (implicitly abstract) |
| **Abstract Method Access** | Can be protected, public, or default | Always public |

**Summary:**
- **Abstract Class:** Partial abstraction, can have implementation, single inheritance
- **Interface:** Full abstraction (100%), no implementation (before Java 8), multiple inheritance

---

## Summary

### What is Interface?
- Mechanism for systems to interact without knowing implementation details
- Achieves abstraction

### Key Properties
- Methods are implicitly `public abstract`
- Fields are implicitly `public static final` (constants)
- Cannot create objects of interface
- Can hold references of implementing classes

### Why Use Interfaces?
1. **Abstraction** - Define what, not how
2. **Polymorphism** - Runtime method resolution
3. **Multiple Inheritance** - Achieve through interfaces

### Implementation Rules
- Concrete classes must implement all abstract methods
- Abstract classes can choose which methods to implement
- Can implement multiple interfaces
- Overriding method cannot be more restrictive

### Nested Interfaces
- Can be declared within interface or class
- Used to group related interfaces
- Rarely used in practice

---

## Practice Exercises

1. Create an interface `Vehicle` with methods `start()` and `stop()`. Create classes `Car` and `Bike` implementing this interface.

2. Create two interfaces `Flyable` and `Swimmable`. Create a class `Duck` that implements both interfaces.

3. Create a nested interface `InnerInterface` within a class `OuterClass`. Implement it in another class.

4. Create an abstract class that implements an interface but doesn't implement all methods. Create a concrete subclass that completes the implementation.

5. Demonstrate polymorphism using interface references holding different implementing class objects.

---

## Interview Questions

1. **What is an interface?**  
   A mechanism that helps systems interact without knowing implementation details. It achieves abstraction.

2. **Why can't we create objects of interface?**  
   Interfaces only have method signatures, no implementation. Objects need concrete implementation.

3. **Can interface have variables?**  
   Yes, but they are always `public static final` (constants).

4. **Can interface methods be private?**  
   Before Java 9, no. From Java 9, private methods are allowed in interfaces.

5. **What is the difference between abstract class and interface?**  
   Abstract class can have implementation, single inheritance. Interface has no implementation (before Java 8), multiple inheritance.

6. **Can a class implement multiple interfaces?**  
   Yes, a class can implement multiple interfaces.

7. **Can an interface extend a class?**  
   No, interface can only extend other interfaces.

8. **What is nested interface?**  
   An interface declared within another interface or class.

9. **Why do we need interfaces when we have abstract classes?**  
   Interfaces provide multiple inheritance and 100% abstraction, which abstract classes cannot provide.

10. **What happens if two interfaces have the same method signature?**  
    If a class implements both interfaces, it provides one implementation that satisfies both.

