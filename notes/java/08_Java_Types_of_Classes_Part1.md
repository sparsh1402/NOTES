# Java Types of Classes - Part 1

## Table of Contents
1. [Introduction](#introduction)
2. [Concrete Class](#concrete-class)
3. [Abstract Class](#abstract-class)
4. [Superclass and Subclass](#superclass-and-subclass)
5. [Object Class](#object-class)
6. [Nested Classes](#nested-classes)
7. [Summary](#summary)

---

## Introduction

By now you've seen classes used extensively in Java. But do you know how many different types of classes exist?

**Types of Classes:**
1. ✅ Concrete Class
2. ✅ Abstract Class
3. ✅ Superclass/Subclass
4. ✅ Object Class
5. ✅ Nested Class (Static, Non-Static)
6. ✅ Generic Class (covered in Part 2)
7. ✅ POJO (Plain Old Java Object)
8. ✅ Enum
9. ✅ Final Class
10. ✅ Singleton Class
11. ✅ Immutable Class
12. ✅ Wrapper Class

**This Part Covers:**
- Concrete Class
- Abstract Class
- Superclass/Subclass
- Object Class
- Nested Classes (Static, Member, Local, Anonymous)

**Part 2 Will Cover:**
- Generic Class
- POJO
- Enum
- Final Class
- Singleton Class
- Immutable Class
- Wrapper Class

---

## Concrete Class

### Definition

A **concrete class** is any class for which you can create an instance using the `new` keyword.

### Characteristics

1. **Can Create Instances:**
   ```java
   Person personObj = new Person();  // ✅ Can create object
   ```

2. **All Methods Have Implementation:**
   - Unlike interfaces (which only have declarations)
   - All methods in concrete class have complete implementation

3. **Can Be Child of Interface or Base Class:**
   ```java
   // Child of interface
   interface Shape {
       void draw();
   }
   
   class Rectangle implements Shape {
       public void draw() {
           // Implementation
       }
   }
   // Rectangle is a concrete class
   ```

   ```java
   // Child of base class
   class Person {
       void display() {
           // Implementation
       }
   }
   // Person is a concrete class
   ```

### Class Access Modifiers

**For Classes, only two access modifiers are allowed:**

1. **Public:**
   ```java
   public class Person { }
   ```
   - Accessible from any package

2. **Default (Package-Private):**
   ```java
   class Person { }  // No modifier = default
   ```
   - Accessible only within the same package

**Important:** Classes **cannot** be `private` or `protected` (unlike methods and variables).

**Exception:** Nested classes can be `private` or `protected` (covered later).

---

## Abstract Class

### Definition

An **abstract class** is used to achieve **abstraction** - hiding implementation details and exposing only necessary features to the client.

### What is Abstraction?

**Abstraction** means:
- Hiding internal implementation
- Exposing only features that client needs
- Client doesn't need to know "how" it works, only "what" it does

**Example: Car Brake:**
- Client knows: "Apply brake" feature
- Client doesn't know: How brake mechanism works internally
- Implementation is hidden, feature is exposed

### Ways to Achieve Abstraction

1. **Interface** - 100% abstraction
2. **Abstract Class** - 0% to 100% abstraction

### Abstract Class Syntax

```java
abstract class Car {
    // Abstract method - no implementation
    abstract void pressBrake();
    
    // Abstract method - no implementation
    abstract void pressClutch();
    
    // Concrete method - has implementation
    void getNumberOfWheels() {
        return 4;
    }
}
```

### Key Points

1. **Can Have Both Abstract and Concrete Methods:**
   - Abstract methods: Only declaration, no implementation
   - Concrete methods: Full implementation

2. **Cannot Create Objects:**
   ```java
   // ❌ Error - cannot create object of abstract class
   Car car = new Car();
   ```

3. **Child Classes Must Implement Abstract Methods:**
   ```java
   class Audi extends Car {
       // Must implement all abstract methods
       void pressBrake() {
           // Implementation
       }
       
       void pressClutch() {
           // Implementation
       }
   }
   ```

4. **Child Can Also Be Abstract:**
   ```java
   abstract class LuxuryCar extends Car {
       // Can add more abstraction
       abstract void pressDualBrakeSystem();
       
       // Can provide implementation of parent abstract methods
       void pressBrake() {
           // Implementation
       }
       // pressClutch() still abstract
   }
   ```

5. **Can Store Reference in Parent:**
   ```java
   Car car = new Audi();  // ✅ Valid - parent reference, child object
   ```

### Abstraction Levels

- **Interface:** 100% abstraction (all methods abstract)
- **Abstract Class:** 0% to 100% abstraction (mix of abstract and concrete methods)

**Example:**
```java
abstract class Car {
    abstract void pressBrake();        // Abstract
    abstract void pressClutch();       // Abstract
    void getNumberOfWheels() {        // Concrete
        return 4;
    }
}
// This achieves partial abstraction (some abstract, some concrete)
```

---

## Superclass and Subclass

### Definitions

- **Superclass (Parent Class):** The class from which another class is derived
- **Subclass (Child Class):** The class that is derived from another class

### Example

```java
class A {
    // Superclass
}

class B extends A {
    // Subclass (child of A)
}
```

**Terminology:**
- `A` is the **superclass** of `B`
- `B` is the **subclass** of `A`

### Important Interview Question

**Question:** What if a class doesn't extend anything?

**Answer:** Every class in Java is **implicitly a subclass of Object class**.

```java
class Person {
    // Doesn't extend anything explicitly
}
// But internally: class Person extends Object
```

**Object Class:**
- **Parent of all classes** in Java
- Every class is a child of Object (directly or indirectly)
- Provides common methods: `toString()`, `equals()`, `hashCode()`, `clone()`, `notify()`, `wait()`, etc.

### Object Class Hierarchy

```
Object (parent of all)
  ├── Person (implicitly extends Object)
  ├── A (implicitly extends Object)
  │   └── B (extends A, also extends Object indirectly)
  └── ... (all other classes)
```

### Using Object Class

**Example:**
```java
public class ObjectTest {
    public static void main(String[] args) {
        // Person is child of Object (implicitly)
        Object obj1 = new Person();  // ✅ Valid
        
        // Audi is also child of Object
        Object obj2 = new Audi();    // ✅ Valid
        
        // Get class name
        System.out.println(obj1.getClass());  // Prints: class Person
        System.out.println(obj2.getClass());  // Prints: class Audi
    }
}
```

**Use Cases:**
- Store objects of unknown type
- Use Object as a common reference type
- Use `getClass()` to determine actual class at runtime

### Common Object Class Methods

- `toString()` - String representation
- `equals()` - Compare objects
- `hashCode()` - Hash code for object
- `clone()` - Create copy
- `notify()`, `wait()` - Thread synchronization
- `getClass()` - Get class information

---

## Nested Classes

### Definition

A **nested class** is a class defined **inside another class**.

### When to Use Nested Classes?

**Use nested classes when:**
- A class will be used **only by one other class**
- Instead of creating a separate file, put it inside the class that uses it
- Helps group logically related classes in one file

**Example:**
- If `ClassA` is only used by `ClassB`
- Instead of `ClassA.java` (separate file)
- Create `ClassA` as nested class inside `ClassB`

### Types of Nested Classes

1. **Static Nested Class**
2. **Non-Static Nested Class (Inner Class)**
   - Member Inner Class
   - Local Inner Class
   - Anonymous Inner Class

### Important Note

**Real-World Usage:**
- Nested classes are **rarely used** in practice
- But **very important for interviews**
- Interviewers often ask about nested classes

---

## Static Nested Class

### Definition

A nested class declared with `static` keyword.

### Characteristics

1. **Associated with Class, Not Object:**
   - Like static methods/variables
   - Doesn't need object of outer class to create instance

2. **Can Only Access Static Members:**
   - Can access static variables of outer class
   - **Cannot** access instance variables of outer class

### Example

```java
class OuterClass {
    int instanceVariable = 10;        // Instance variable
    static int classVariable = 20;     // Static variable
    
    // Static nested class
    static class StaticNestedClass {
        void print() {
            // ✅ Can access static variable
            System.out.println(classVariable);
            
            // ❌ Cannot access instance variable
            // System.out.println(instanceVariable);  // Error!
        }
    }
}
```

### How to Create Instance

```java
// Don't need object of OuterClass
OuterClass.StaticNestedClass nestedObj = new OuterClass.StaticNestedClass();
nestedObj.print();
```

**Key Point:** Use **class name** (not object) to access static nested class.

### Access Modifiers for Nested Classes

**Important:** Nested classes **can** be `private`, `protected`, or `public` (unlike outer classes).

```java
class OuterClass {
    // ✅ Valid - nested class can be private
    private static class PrivateNestedClass {
        void print() {
            System.out.println("Private nested class");
        }
    }
    
    // Method to access private nested class
    public void accessPrivateNested() {
        PrivateNestedClass obj = new PrivateNestedClass();
        obj.print();
    }
}
```

**Access Rules:**
- `private` nested class: Only accessible within outer class
- `public` nested class: Accessible from anywhere
- `protected` nested class: Accessible in same package and subclasses

---

## Non-Static Nested Class (Inner Class)

### Definition

A nested class **without** `static` keyword. Also called **Inner Class**.

### Characteristics

1. **Associated with Object:**
   - Needs object of outer class to create instance
   - Each inner class instance is associated with outer class instance

2. **Can Access All Members:**
   - Can access **both** static and instance variables
   - Can access **both** static and instance methods

### Example

```java
class OuterClass {
    int instanceVariable = 10;
    static int classVariable = 20;
    
    // Inner class (non-static)
    class InnerClass {
        void print() {
            // ✅ Can access static variable
            System.out.println(classVariable);
            
            // ✅ Can access instance variable
            System.out.println(instanceVariable);
        }
    }
}
```

### How to Create Instance

```java
// First create object of OuterClass
OuterClass outerObj = new OuterClass();

// Then create object of InnerClass using outer object
OuterClass.InnerClass innerObj = outerObj.new InnerClass();
innerObj.print();
```

**Key Point:** Need **object of outer class** to create inner class instance.

### Types of Inner Classes

#### 1. Member Inner Class

**Definition:** Inner class defined at the **member level** of outer class (same level as methods and variables).

**Example:**
```java
class OuterClass {
    class MemberInnerClass {  // Member inner class
        void print() {
            System.out.println("Member inner class");
        }
    }
}
```

**Access Modifiers:** Can be `private`, `public`, `protected`, or default.

#### 2. Local Inner Class

**Definition:** Inner class defined **inside a method, block, loop, or condition**.

**Example:**
```java
class OuterClass {
    void display() {
        // Local inner class - inside method
        class LocalInnerClass {
            void print() {
                System.out.println("Local inner class");
            }
        }
        
        // Can only create instance within this method
        LocalInnerClass localObj = new LocalInnerClass();
        localObj.print();
    }
}
```

**Characteristics:**
- **Cannot be declared as private, protected, or public**
- Only **default** access modifier
- **Cannot be instantiated outside the block** where it's defined
- Life span is same as the method/block scope

**Why These Restrictions?**
- Scope is limited to the block
- After block ends, class is destroyed
- No point in access modifiers (it's local to the block)

#### 3. Anonymous Inner Class

**Definition:** An inner class **without a name**.

### When to Use Anonymous Inner Class?

When you want to **override method behavior** without creating a separate subclass.

### Example

```java
abstract class Car {
    abstract void pressBrake();
}

public class Test {
    public static void main(String[] args) {
        // Anonymous inner class
        Car audiCar = new Car() {
            @Override
            void pressBrake() {
                System.out.println("Audi brake pressed");
            }
        };
        
        audiCar.pressBrake();
    }
}
```

### How It Works Behind the Scenes

**What Actually Happens:**
1. Compiler creates a **subclass** with auto-generated name (e.g., `Test$1`)
2. Subclass extends `Car`
3. Provides implementation of `pressBrake()`
4. Creates object of that subclass
5. Assigns reference to `audiCar`

**Compiled Code (Conceptual):**
```java
// Compiler generates (you don't see this):
class Test$1 extends Car {
    void pressBrake() {
        System.out.println("Audi brake pressed");
    }
}

// Your code becomes:
Car audiCar = new Test$1();
```

**Key Points:**
- No explicit class name
- Implementation provided inline
- Compiler generates class name automatically
- Useful for one-time implementations

---

## Inheritance in Nested Classes

### Can Nested Classes Be Inherited?

**Yes**, nested classes can be inherited, but it's **rarely used** in practice.

### Example 1: Inheritance Within Same Outer Class

```java
class OuterClass {
    class InnerClass1 {
        int value = 10;
        void display() {
            System.out.println("InnerClass1");
        }
    }
    
    class InnerClass2 extends InnerClass1 {
        int value2 = 20;
        void display() {
            System.out.println("InnerClass2");
            super.display();  // Call parent method
        }
    }
}

// Usage
OuterClass outerObj = new OuterClass();
OuterClass.InnerClass2 innerObj = outerObj.new InnerClass2();
innerObj.display();
```

### Example 2: Static Nested Class Inherited by Different Class

```java
class OuterClass {
    static class StaticNestedClass {
        void display() {
            System.out.println("Static nested class");
        }
    }
}

class SomeOtherClass extends OuterClass.StaticNestedClass {
    // Can extend static nested class
}

// Usage
SomeOtherClass obj = new SomeOtherClass();
obj.display();
```

### Example 3: Non-Static Inner Class Inherited by Different Class

```java
class OuterClass {
    class InnerClass {
        void display() {
            System.out.println("Inner class");
        }
    }
}

class SomeOtherClass extends OuterClass.InnerClass {
    // Need constructor to handle outer class object
    SomeOtherClass(OuterClass outerObj) {
        outerObj.super();  // Call parent (inner class) constructor
    }
}

// Usage
OuterClass outerObj = new OuterClass();
SomeOtherClass obj = new SomeOtherClass(outerObj);
obj.display();
```

**Why Constructor Needed?**
- Inner class is associated with outer class object
- Child class needs to know which outer class object to use
- Constructor passes outer class object and calls `super()`

---

## Summary

### Key Takeaways

1. **Concrete Class:**
   - Can create instances with `new`
   - All methods have implementation
   - Class access: `public` or default only

2. **Abstract Class:**
   - Cannot create instances
   - Can have abstract and concrete methods
   - Used for abstraction (0-100%)
   - Child classes must implement abstract methods

3. **Superclass/Subclass:**
   - Superclass: Parent class
   - Subclass: Child class
   - Every class is subclass of Object (implicitly)

4. **Object Class:**
   - Parent of all classes
   - Provides common methods
   - Can store any object reference

5. **Nested Classes:**
   - **Static Nested:** Associated with class, can only access static members
   - **Inner Class:** Associated with object, can access all members
   - **Member Inner:** Defined at member level
   - **Local Inner:** Defined inside method/block
   - **Anonymous Inner:** No name, compiler generates name

### Important Interview Points

- Difference between concrete and abstract class
- When to use abstract class vs interface
- Object class is parent of all classes
- How to create instances of nested classes
- Access modifiers for nested classes
- Inheritance in nested classes
- Anonymous inner class compilation process

---

## Related Topics

- **Methods** - How methods work in classes
- **Inheritance** - Parent-child relationships
- **Polymorphism** - Using abstract classes and interfaces
- **Generic Classes** - Part 2 of types of classes

