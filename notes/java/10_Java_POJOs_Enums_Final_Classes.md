# Java POJOs, Enums, and Final Classes

## Table of Contents
- [POJOs (Plain Old Java Objects)](#pojos-plain-old-java-objects)
  - [What is a POJO?](#what-is-a-pojo)
  - [Properties of POJO](#properties-of-pojo)
  - [Example: Student POJO](#example-student-pojo)
  - [Where are POJOs Used?](#where-are-pojos-used)
    - [Request Mapping](#request-mapping)
    - [Entity Objects](#entity-objects)
- [Enum Classes](#enum-classes)
  - [What is an Enum?](#what-is-an-enum)
  - [Why Enum When We Have Static Final?](#why-enum-when-we-have-static-final)
  - [Properties of Enum](#properties-of-enum)
  - [Normal Enum Class](#normal-enum-class)
    - [Creating Enum Constants](#creating-enum-constants)
    - [Default Values (Ordinals)](#default-values-ordinals)
    - [Common Enum Methods](#common-enum-methods)
      - [values() Method](#values-method)
      - [ordinal() Method](#ordinal-method)
      - [valueOf() Method](#valueof-method)
      - [name() Method](#name-method)
  - [Enum with Custom Values](#enum-with-custom-values)
    - [Defining Custom Values](#defining-custom-values)
    - [Constructor in Enum](#constructor-in-enum)
    - [Getter Methods](#getter-methods)
    - [Static Methods](#static-methods)
  - [Method Override by Constant](#method-override-by-constant)
  - [Enum with Abstract Method](#enum-with-abstract-method)
  - [Enum Implementing Interface](#enum-implementing-interface)
  - [Advantages of Enum over Static Final](#advantages-of-enum-over-static-final)
    - [Readability](#readability)
    - [Type Safety](#type-safety)
    - [Compile-time Control](#compile-time-control)
- [Final Class](#final-class)
  - [What is a Final Class?](#what-is-a-final-class)
  - [Purpose of Final Class](#purpose-of-final-class)
  - [Example: Final Class](#example-final-class)

---

## POJOs (Plain Old Java Objects)

### What is a POJO?

**POJO** stands for **Plain Old Java Object**. It is a very simple Java class with no fancy features.

### Properties of POJO

A class is considered a POJO if it has the following properties:

1. **Contains variables and getter/setter methods**
2. **Class should be public**
3. **Should have a public default constructor**
4. **No annotations** (like `@Entity`, `@Table`, etc.)
5. **Should not extend any class**
6. **Should not implement any interface**

POJOs have very few restrictions and are simple, straightforward classes.

### Example: Student POJO

```java
public class Student {
    // Variables - no restriction on access modifiers
    int id;              // default
    private String name; // private
    protected int age;   // protected
    // public variables are also allowed
    
    // Getter and setter methods
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    // Default constructor (public by default)
    // No annotations
    // Does not extend any class
    // Does not implement any interface
}
```

### Where are POJOs Used?

POJOs are commonly used in two main scenarios:

#### Request Mapping

When a request comes to your system from a client, it's advisable not to use the request object directly across all classes in your component.

**Why?**
- If the request structure changes (e.g., `id` changes to `customer_id`), it would require changes in all classes using it
- It's better to have a 1-to-1 mapping in your component that all classes understand

**Example:**
```java
// Request object from client
{
    "id": 123,
    "name": "John"
}

// POJO in your component
public class CustomerPOJO {
    private int customerId;
    private String customerName;
    
    // getters and setters
}

// Mapping layer converts request to POJO
// All other classes use CustomerPOJO, not the request object
```

#### Entity Objects

In layered architecture (Controller → Business Logic → Repository → Database):

- **Entity POJOs** represent database tables
- Each table has a corresponding POJO/Entity class
- Used to store and retrieve data from the database

**Example:**
```java
// Student entity for student table
public class StudentEntity {
    private int studentId;
    private String studentName;
    private String email;
    
    // getters and setters
}
```

---

## Enum Classes

### What is an Enum?

An **enum** (enumeration) is a collection of constants. It provides a way to define a fixed set of constant values.

**Key Points:**
- Constants are variables whose values cannot be changed
- In enum classes, constants are **implicitly static and final**
- You don't need to explicitly write `static final` for each constant

### Why Enum When We Have Static Final?

This is a common question. We'll explore the advantages of enum over static final constants later in this document.

### Properties of Enum

1. **Cannot extend any class** - Internally extends `java.lang.Enum` class
2. **Can implement interfaces** - No restriction on implementing multiple interfaces
3. **Can have variables, constructors, and methods**
4. **Cannot be instantiated** - Constructor is always private (even if you write default, bytecode makes it private)
5. **No other class can extend enum class**
6. **Can have abstract methods** - All constants must implement the abstract method

### Normal Enum Class

#### Creating Enum Constants

```java
public enum EnumSample {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY;  // Remember the semicolon at the end
}
```

#### Default Values (Ordinals)

Internally, enum constants are assigned values starting from **0**:

- `MONDAY` = 0
- `TUESDAY` = 1
- `WEDNESDAY` = 2
- `THURSDAY` = 3
- `FRIDAY` = 4
- `SATURDAY` = 5
- `SUNDAY` = 6

These default values are called **ordinals**.

#### Common Enum Methods

##### values() Method

Returns an array of all enum constants. This is a static method inherited from `java.lang.Enum`.

```java
EnumSample[] allDays = EnumSample.values();
// Returns: [MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY]
```

**Usage:**
```java
for (EnumSample day : EnumSample.values()) {
    System.out.println(day);
}
```

##### ordinal() Method

Returns the ordinal (position) of the enum constant, starting from 0.

```java
EnumSample monday = EnumSample.MONDAY;
System.out.println(monday.ordinal()); // Prints: 0

EnumSample sunday = EnumSample.SUNDAY;
System.out.println(sunday.ordinal()); // Prints: 6
```

**Example:**
```java
for (EnumSample day : EnumSample.values()) {
    System.out.println(day + " has ordinal: " + day.ordinal());
}
// Output:
// MONDAY has ordinal: 0
// TUESDAY has ordinal: 1
// ...
// SUNDAY has ordinal: 6
```

##### valueOf() Method

Returns the enum constant with the specified name. This is a static method.

```java
EnumSample friday = EnumSample.valueOf("FRIDAY");
// Returns the FRIDAY enum constant
```

**Important:** The name must match exactly (case-sensitive).

##### name() Method

Returns the name of the enum constant as a string.

```java
EnumSample day = EnumSample.FRIDAY;
System.out.println(day.name()); // Prints: FRIDAY
```

**Complete Example:**
```java
// Get enum by name
EnumSample day = EnumSample.valueOf("FRIDAY");
System.out.println(day.name()); // Prints: FRIDAY
```

### Enum with Custom Values

You can define custom values for enum constants instead of using default ordinals.

#### Defining Custom Values

```java
public enum EnumSample {
    MONDAY(101, "First day of the week"),
    TUESDAY(102, "Second day of the week"),
    WEDNESDAY(103, "Third day of the week"),
    THURSDAY(104, "Fourth day of the week"),
    FRIDAY(105, "Fifth day of the week"),
    SATURDAY(106, "Sixth day of the week"),
    SUNDAY(107, "Second week off");
    
    // Member variables
    private int val;
    private String comment;
    
    // Parameterized constructor
    private EnumSample(int val, String comment) {
        this.val = val;
        this.comment = comment;
    }
    
    // Getter methods (for each constant)
    public int getVal() {
        return val;
    }
    
    public String getComment() {
        return comment;
    }
    
    // Static method (class-level, not per constant)
    public static EnumSample getEnumFromValue(int value) {
        for (EnumSample day : EnumSample.values()) {
            if (day.val == value) {
                return day;
            }
        }
        return null;
    }
}
```

**Key Points:**
- Each constant can have multiple custom values
- You need to define member variables for the values
- Constructor must be private (or default, but it becomes private in bytecode)
- Each constant calls the constructor with its values
- Getter methods are available for each constant
- Static methods are class-level, not per constant

**Usage:**
```java
// Get enum by custom value
EnumSample day = EnumSample.getEnumFromValue(107);
System.out.println(day.getComment()); // Prints: "Second week off"
```

### Method Override by Constant

You can override methods for specific enum constants.

```java
public enum EnumSample {
    MONDAY {
        @Override
        public void dummyMethod() {
            System.out.println("Monday dummy method");
        }
    },
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY;
    
    // Default method implementation
    public void dummyMethod() {
        System.out.println("Default dummy method");
    }
}
```

**Usage:**
```java
EnumSample.FRIDAY.dummyMethod();  // Prints: "Default dummy method"
EnumSample.MONDAY.dummyMethod();  // Prints: "Monday dummy method"
```

**Key Points:**
- Each constant has its own copy of the method
- You can override the method for specific constants
- Constants without override use the default implementation

### Enum with Abstract Method

You can define abstract methods in an enum. **All constants must provide implementation** for the abstract method.

```java
public enum EnumSample {
    MONDAY {
        @Override
        public void dummyMethod() {
            System.out.println("Dummy method in Monday");
        }
    },
    TUESDAY {
        @Override
        public void dummyMethod() {
            System.out.println("Dummy method in Tuesday");
        }
    },
    SUNDAY {
        @Override
        public void dummyMethod() {
            System.out.println("Dummy method in Sunday");
        }
    };
    
    // Abstract method - all constants must implement
    public abstract void dummyMethod();
}
```

**Usage:**
```java
EnumSample.MONDAY.dummyMethod();  // Prints: "Dummy method in Monday"
```

**Important:** If you define an abstract method, **every constant must provide its implementation**.

### Enum Implementing Interface

Enums can implement interfaces, just like regular classes.

```java
// Interface
public interface MyInterface {
    String toLowerCase();
}

// Enum implementing interface
public enum EnumSample implements MyInterface {
    MONDAY,
    TUESDAY,
    WEDNESDAY,
    THURSDAY,
    FRIDAY,
    SATURDAY,
    SUNDAY;
    
    // Implementation of interface method
    @Override
    public String toLowerCase() {
        return this.name().toLowerCase();
    }
}
```

**Usage:**
```java
EnumSample day = EnumSample.MONDAY;
System.out.println(day.toLowerCase()); // Prints: "monday"
```

**Key Points:**
- Interface methods are common for all constants
- You can still override interface methods for specific constants if needed
- Interfaces are useful when you want common functionality for all constants

### Advantages of Enum over Static Final

Let's compare enum with static final constants:

#### Using Static Final Constants

```java
public class WeekConstant {
    public static final int MONDAY = 0;
    public static final int TUESDAY = 1;
    public static final int WEDNESDAY = 2;
    public static final int THURSDAY = 3;
    public static final int FRIDAY = 4;
    public static final int SATURDAY = 5;
    public static final int SUNDAY = 6;
    
    public static boolean isWeekend(int day) {
        return day == WeekConstant.SATURDAY || day == WeekConstant.SUNDAY;
    }
}
```

**Problems:**
- No type safety - you can pass any integer (e.g., 100, 1000)
- Less readable - `isWeekend(2)` doesn't clearly indicate it's Wednesday
- No compile-time control

#### Using Enum

```java
public enum EnumSample {
    MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY;
    
    public static boolean isWeekend(EnumSample day) {
        return day == EnumSample.SATURDAY || day == EnumSample.SUNDAY;
    }
}
```

**Advantages:**

##### Readability

```java
// Static final - not clear what 2 means
isWeekend(2);

// Enum - self-documenting
isWeekend(EnumSample.WEDNESDAY);
```

##### Type Safety

```java
// Static final - accepts any integer
isWeekend(100);  // Compiles, but wrong

// Enum - only accepts valid enum values
isWeekend(EnumSample.WEDNESDAY);  // Correct
isWeekend(100);  // Compilation error!
```

##### Compile-time Control

- Enum restricts the parameter to only valid enum constants
- You cannot pass invalid values
- Compiler catches errors at compile time

**Summary:**
- **Readability:** Enum code is self-documenting
- **Type Safety:** Only valid enum values can be passed
- **Compile-time Control:** Invalid values cause compilation errors

---

## Final Class

### What is a Final Class?

A **final class** is a class that cannot be inherited. If you want to prevent a class from being extended, you declare it as `final`.

### Purpose of Final Class

The `final` keyword on a class prevents inheritance. This is useful when:
- You want to prevent modification of the class behavior
- You want to ensure the class implementation remains unchanged
- You're implementing immutable classes or utility classes

### Example: Final Class

```java
// Final class - cannot be inherited
public final class TestClass {
    private int value;
    
    public TestClass(int value) {
        this.value = value;
    }
    
    public int getValue() {
        return value;
    }
}

// This will cause compilation error
public class MyAnotherClass extends TestClass {  // ERROR: Cannot inherit from final class
    // ...
}
```

**Compilation Error:**
```
Cannot inherit from final TestClass
```

**Key Points:**
- Final class cannot be extended
- All methods in a final class are implicitly final (cannot be overridden)
- Final classes are commonly used for:
  - Immutable classes (like `String`, `Integer`, etc.)
  - Utility classes
  - Classes where you want to prevent modification

---

## Summary

### POJOs
- Simple Java classes with variables and getters/setters
- No annotations, no inheritance, no interfaces
- Used for request mapping and entity objects

### Enums
- Collection of constants
- Implicitly static and final
- Cannot extend classes (extends `java.lang.Enum` internally)
- Can implement interfaces
- Provides type safety and better readability than static final constants
- Supports custom values, method overrides, and abstract methods

### Final Classes
- Cannot be inherited
- Used to prevent class extension
- Ensures implementation remains unchanged

---

## Practice Exercises

1. Create a POJO class for a `Product` with fields: `id`, `name`, `price`, and appropriate getters/setters.

2. Create an enum `Color` with constants: RED, GREEN, BLUE, YELLOW, BLACK, WHITE.

3. Create an enum `Status` with custom values:
   - PENDING(1, "Request is pending")
   - APPROVED(2, "Request is approved")
   - REJECTED(3, "Request is rejected")

4. Create a final class `MathUtils` with static utility methods for mathematical operations.

5. Compare the usage of static final constants vs enum for representing days of the week. Show the advantages of enum.

---

## Interview Questions

1. **What is a POJO?**  
   A Plain Old Java Object - a simple class with variables, getters/setters, no annotations, no inheritance, no interfaces.

2. **Why use POJOs?**  
   For request mapping and entity objects to decouple external data structures from internal implementation.

3. **What is an enum?**  
   A collection of constants. Enum constants are implicitly static and final.

4. **Why can't enum extend a class?**  
   Because it internally extends `java.lang.Enum` class, and Java doesn't allow multiple inheritance.

5. **Can enum implement interfaces?**  
   Yes, enum can implement multiple interfaces.

6. **Why is enum better than static final constants?**  
   - Better readability
   - Type safety
   - Compile-time control
   - Can only pass valid enum values

7. **What is a final class?**  
   A class that cannot be inherited. Used to prevent class extension.

8. **Can you create an object of an enum?**  
   No, enum constructors are always private, so you cannot instantiate enums using `new` keyword.

9. **How do you iterate over all enum constants?**  
   Using `values()` method: `for (EnumType e : EnumType.values()) { ... }`

10. **What is the difference between `name()` and `toString()` in enum?**  
    - `name()` returns the exact constant name as declared
    - `toString()` can be overridden to return a custom string representation

