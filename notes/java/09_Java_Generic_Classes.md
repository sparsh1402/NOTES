# Java Generic Classes

## Table of Contents
1. [Introduction](#introduction)
2. [Why Do We Need Generics?](#why-do-we-need-generics)
3. [What are Generic Classes?](#what-are-generic-classes)
4. [Generic Class Syntax](#generic-class-syntax)
5. [Inheritance with Generic Classes](#inheritance-with-generic-classes)
6. [Multiple Type Parameters](#multiple-type-parameters)
7. [Generic Methods](#generic-methods)
8. [Raw Types](#raw-types)
9. [Bounded Generics](#bounded-generics)
10. [Wildcards](#wildcards)
11. [Type Erasure](#type-erasure)
12. [Summary](#summary)

---

## Introduction

Generic classes are **very important** and will be used **very frequently** when working with Java. They help write type-safe, reusable code.

**Key Benefits:**
- Type safety at compile time
- Eliminates need for typecasting
- Code reusability
- Better code readability

---

## Why Do We Need Generics?

### Problem Without Generics

**Example: Using Object Class**

```java
class Print {
    private Object value;
    
    public void setPrintValue(Object value) {
        this.value = value;
    }
    
    public Object getPrintValue() {
        return value;
    }
}
```

**Usage:**
```java
Print printObj = new Print();
printObj.setPrintValue(1);  // Integer
Object result = printObj.getPrintValue();

// Problem: Need typecasting
int intValue = (int) result;  // Typecasting required

// Another problem: Can pass anything
printObj.setPrintValue("Hello");  // String - also works!
printObj.setPrintValue(new Person());  // Custom class - also works!

// How to know what type it is?
if (result instanceof Integer) {
    intValue = (int) result;
} else if (result instanceof String) {
    String strValue = (String) result;
}
```

**Problems:**
1. **Typecasting required** - Need to cast every time
2. **No type safety** - Can pass any type
3. **Runtime errors** - Wrong typecast causes runtime exception
4. **Code complexity** - Need instanceof checks

### Solution: Generic Classes

Generic classes solve all these problems by providing **compile-time type safety**.

---

## What are Generic Classes?

### Definition

A **generic class** is a class that can work with different types while maintaining type safety.

### Key Concept

Instead of using `Object` (which accepts anything), use a **type parameter** that gets replaced with a specific type at compile time.

---

## Generic Class Syntax

### Basic Syntax

```java
class ClassName<T> {
    // T is type parameter
    // Use T wherever you need the type
}
```

**Diamond Syntax:** `<T>` is called diamond syntax.

### Example: Converting to Generic Class

**Before (Using Object):**
```java
class Print {
    private Object value;
    
    public void setPrintValue(Object value) {
        this.value = value;
    }
    
    public Object getPrintValue() {
        return value;
    }
}
```

**After (Using Generics):**
```java
class Print<T> {
    private T value;
    
    public void setPrintValue(T value) {
        this.value = value;
    }
    
    public T getPrintValue() {
        return value;
    }
}
```

### Usage

```java
// Create Print for Integer type
Print<Integer> printObj = new Print<Integer>();
printObj.setPrintValue(1);  // ✅ Accepts Integer
int result = printObj.getPrintValue();  // ✅ No typecasting needed!

// Create Print for String type
Print<String> printObj2 = new Print<String>();
printObj2.setPrintValue("Hello");  // ✅ Accepts String
String result2 = printObj2.getPrintValue();  // ✅ No typecasting needed!

// Type safety
printObj.setPrintValue("Hello");  // ❌ Compile-time error!
```

### Key Points

1. **Type Parameter Naming:**
   - Common: `T` (Type), `E` (Element), `K` (Key), `V` (Value), `N` (Number)
   - Can use any capital letter: `A`, `B`, `C`, etc.

2. **Replacement:**
   - `T` can be replaced with **any non-primitive type**
   - Cannot use primitives: `int`, `double`, `boolean`, etc.
   - Can use: Classes, Interfaces, Abstract classes, Arrays

3. **Type Safety:**
   - Compile-time checking
   - No typecasting needed
   - Prevents wrong type assignments

### Type Parameter Replacement

**What can `T` be replaced with?**
- ✅ Any class: `Integer`, `String`, `Person`, etc.
- ✅ Any interface: `List`, `Map`, etc.
- ✅ Any abstract class
- ✅ Arrays: `int[]`, `String[]`, etc.
- ❌ Primitives: `int`, `double`, `boolean`, etc. (use wrapper classes)

---

## Inheritance with Generic Classes

### Non-Generic Subclass

**When child class is NOT generic:**

```java
class Print<T> {
    private T value;
    // ... methods
}

// Non-generic subclass
class ColorPrint extends Print<String> {
    // Must specify type at inheritance time
    // ColorPrint is specifically for String type
}
```

**Usage:**
```java
ColorPrint colorObj = new ColorPrint();
colorObj.setPrintValue("Red");  // Only String allowed
```

**Key Point:** Must specify type parameter when extending.

### Generic Subclass

**When child class IS generic:**

```java
class Print<T> {
    private T value;
    // ... methods
}

// Generic subclass
class ColorPrint<T> extends Print<T> {
    // Type parameter T is passed to parent
    // Type is determined at object creation time
}
```

**Usage:**
```java
ColorPrint<String> colorObj = new ColorPrint<String>();
colorObj.setPrintValue("Red");  // String type

ColorPrint<Integer> colorObj2 = new ColorPrint<Integer>();
colorObj2.setPrintValue(255);  // Integer type
```

**Key Point:** Type is determined when creating object, not at inheritance time.

---

## Multiple Type Parameters

### Syntax

```java
class ClassName<T1, T2, T3, ...> {
    // Can have as many type parameters as needed
}
```

### Example: Key-Value Pair

```java
class Pair<K, V> {
    private K key;
    private V value;
    
    public void put(K key, V value) {
        this.key = key;
        this.value = value;
    }
    
    public K getKey() {
        return key;
    }
    
    public V getValue() {
        return value;
    }
}
```

**Usage:**
```java
// Create Pair with String key and Integer value
Pair<String, Integer> pair = new Pair<String, Integer>();
pair.put("Age", 25);
String key = pair.getKey();      // String
Integer value = pair.getValue();  // Integer

// Create Pair with Integer key and String value
Pair<Integer, String> pair2 = new Pair<Integer, String>();
pair2.put(1, "One");
```

### Type Inference (Java 7+)

**Both syntaxes are valid:**

```java
// Explicit type on both sides
Pair<String, Integer> pair1 = new Pair<String, Integer>();

// Type inference - type on left side only
Pair<String, Integer> pair2 = new Pair<>();
// Compiler infers type from left side
```

**Key Point:** Java 7+ allows diamond operator `<>` for type inference.

---

## Generic Methods

### Definition

A **generic method** is a method that has its own type parameter, independent of the class.

### When to Use?

When you want to make **only specific methods** generic, not the entire class.

### Syntax

```java
public <T> returnType methodName(T parameter) {
    // Method body
}
```

**Key Points:**
1. Type parameter `<T>` comes **before return type**
2. Type parameter scope is **limited to that method only**
3. Can have multiple type parameters: `<T, U, V>`

### Example

**Non-Generic Method:**
```java
class Print {
    public void setValue(Bus busObj) {
        // Only accepts Bus
    }
}
```

**Generic Method:**
```java
class Print {
    public <T> void setValue(T obj) {
        // Accepts any type
    }
}
```

**Usage:**
```java
Print printObj = new Print();
printObj.setValue(new Bus());     // ✅ Works
printObj.setValue(new Car());     // ✅ Works
printObj.setValue("String");      // ✅ Works
printObj.setValue(123);           // ✅ Works
```

### Properties of Generic Methods

1. **Type parameter before return type:**
   ```java
   public <T> void method(T param) { }
   //      ↑ Type parameter comes first
   ```

2. **Scope limited to method:**
   - Type parameter `T` is only available within that method
   - Cannot be used in other methods (unless they also declare `T`)

### Example: Generic Method in Non-Generic Class

```java
class Print {
    // Generic method
    public <T> void setValue(T obj) {
        System.out.println("Value: " + obj);
    }
    
    // Another generic method with different type
    public <U> void processValue(U value) {
        // U is different from T above
    }
}
```

---

## Raw Types

### Definition

A **raw type** is a generic class used **without type parameters**.

### Example

```java
class Print<T> {
    private T value;
    // ... methods
}

// Parameterized type (with type parameter)
Print<String> printObj1 = new Print<String>();

// Raw type (without type parameter)
Print printObj2 = new Print();  // Raw type
```

### What Happens with Raw Types?

**Internally, compiler replaces `T` with `Object`:**

```java
Print printObj = new Print();  // Raw type
// Internally becomes: Print<Object> printObj = new Print<Object>();

printObj.setPrintValue(1);        // ✅ Works (Object accepts int)
printObj.setPrintValue("Hello");  // ✅ Works (Object accepts String)
```

**Key Points:**
- Raw types accept **any type** (like using Object)
- **Loses type safety** benefits of generics
- **Not recommended** - use parameterized types instead

### Why Raw Types Exist?

- **Backward compatibility** with pre-generics Java code
- Legacy code that doesn't use generics

---

## Bounded Generics

### Definition

**Bounded generics** restrict what types can be passed to a type parameter.

### Why Bounded Generics?

**Problem:** Without bounds, type parameter can accept **any type**:
```java
Print<Integer> printObj1 = new Print<Integer>();  // ✅
Print<String> printObj2 = new Print<String>();    // ✅
Print<Person> printObj3 = new Print<Person>();    // ✅
// Can pass anything!
```

**Solution:** Use bounds to restrict to specific types or their subclasses.

### Types of Bounds

1. **Upper Bound** - Restricts to a class and its subclasses
2. **Multi Bound** - Restricts to a class and multiple interfaces

---

## Upper Bound

### Syntax

```java
class ClassName<T extends UpperBoundClass> {
    // T can only be UpperBoundClass or its subclasses
}
```

### Example

```java
class Print<T extends Number> {
    private T value;
    // ...
}
```

**What This Means:**
- `T` can only be `Number` or its subclasses
- Subclasses of Number: `Integer`, `Double`, `Float`, `Long`, `BigDecimal`, `BigInteger`
- **Cannot** be `String`, `Person`, or other classes

**Usage:**
```java
Print<Integer> printObj1 = new Print<Integer>();  // ✅ Integer extends Number
Print<Double> printObj2 = new Print<Double>();    // ✅ Double extends Number
Print<String> printObj3 = new Print<String>();    // ❌ Error! String doesn't extend Number
```

### Important Note

**Don't confuse `extends` here with class inheritance:**
- In class: `class Child extends Parent` - inheritance
- In generics: `T extends Number` - upper bound (works for classes AND interfaces)

**For interfaces, still use `extends`:**
```java
class Print<T extends Comparable> {
    // T must implement Comparable interface
    // Still use 'extends', not 'implements'
}
```

---

## Multi Bound

### Definition

**Multi bound** restricts type parameter to:
1. A specific class (and its subclasses)
2. Multiple interfaces (must implement all)

### Syntax

```java
class ClassName<T extends ClassName & Interface1 & Interface2> {
    // T must extend ClassName AND implement Interface1 AND Interface2
}
```

**Rules:**
1. **First bound must be a class** (if class is needed)
2. **Subsequent bounds are interfaces** (can have multiple)
3. Use `&` to separate multiple bounds

### Why This Structure?

**Java Inheritance Rules:**
- Class can extend **only one** parent class
- Class can implement **multiple** interfaces

**Multi bound follows same pattern:**
- First: One class (or none)
- Rest: Multiple interfaces

### Example

```java
class Parent { }
interface Interface1 { }
interface Interface2 { }

class A extends Parent implements Interface1, Interface2 {
    // A extends Parent AND implements both interfaces
}

class Print<T extends Parent & Interface1 & Interface2> {
    // T must have same structure as A
}

// Usage
Print<A> printObj = new Print<A>();  // ✅ A meets all requirements

class B extends Parent implements Interface1 {
    // Only implements Interface1, not Interface2
}
Print<B> printObj2 = new Print<B>();  // ❌ Error! Doesn't implement Interface2
```

---

## Wildcards

### Definition

**Wildcards** (`?`) provide flexibility when working with generic types, especially with collections.

### The Problem

**Object vs Generic Type Behavior:**

```java
// This works - parent can hold child
Vehicle vehicleObj = new Bus();  // ✅ Valid

// This doesn't work - List<Vehicle> is NOT parent of List<Bus>
List<Vehicle> vehicleList = new ArrayList<Bus>();  // ❌ Error!
```

**Why?**
- `List<Vehicle>` can contain `Vehicle`, `Bus`, `Car`
- `List<Bus>` can only contain `Bus`
- If allowed, you could add `Car` to `List<Bus>` → type safety violation

### Solution: Wildcards

Wildcards allow more flexible type relationships.

### Types of Wildcards

1. **Upper Bound Wildcard** - `? extends Type`
2. **Lower Bound Wildcard** - `? super Type`
3. **Unbounded Wildcard** - `?`

---

## Upper Bound Wildcard

### Syntax

```java
? extends UpperBoundType
```

**Meaning:** Accepts the type and all its subclasses.

### Example

```java
class Print {
    public void setPrintValue(List<? extends Vehicle> vehicleList) {
        // Accepts List<Vehicle>, List<Bus>, List<Car>
    }
}
```

**Usage:**
```java
List<Vehicle> vehicleList = new ArrayList<>();
List<Bus> busList = new ArrayList<>();

Print printObj = new Print();
printObj.setPrintValue(vehicleList);  // ✅ Works
printObj.setPrintValue(busList);      // ✅ Works (Bus extends Vehicle)
```

---

## Lower Bound Wildcard

### Syntax

```java
? super LowerBoundType
```

**Meaning:** Accepts the type and all its superclasses.

### Example

```java
class Print {
    public void setPrintValue(List<? super Vehicle> vehicleList) {
        // Accepts List<Vehicle>, List<Object>
        // Vehicle and above (superclasses)
    }
}
```

**Usage:**
```java
List<Vehicle> vehicleList = new ArrayList<>();
List<Object> objectList = new ArrayList<>();
List<Bus> busList = new ArrayList<>();

Print printObj = new Print();
printObj.setPrintValue(vehicleList);  // ✅ Works
printObj.setPrintValue(objectList);    // ✅ Works (Object is superclass)
printObj.setPrintValue(busList);       // ❌ Error! Bus is below Vehicle
```

---

## Unbounded Wildcard

### Syntax

```java
?
```

**Meaning:** Accepts any type (like Object).

### When to Use?

When your method works with **Object class methods only**:
- Methods available in Object: `toString()`, `equals()`, `hashCode()`, etc.
- Don't know specific type
- Only need generic Object operations

### Example

```java
class Print {
    public void processList(List<?> list) {
        // Can accept List<Integer>, List<String>, List<Anything>
        // But can only use Object methods
        Object obj = list.get(0);  // Returns Object
        // Don't know specific type
    }
}
```

---

## Wildcards vs Generic Type Parameters

### Key Differences

| Aspect | Wildcard (`?`) | Generic Type (`<T>`) |
|--------|----------------|---------------------|
| **Flexibility** | More flexible (different types allowed) | Less flexible (same type required) |
| **Type Consistency** | Can have different types in parameters | All parameters must be same type |
| **Lower Bound** | Supports `? super Type` | Does NOT support `super` |
| **Multiple Parameters** | Only one `?` | Can have multiple: `<T, U, V>` |
| **Type Reference** | Cannot reference type | Can reference type `T` |

### Example: Flexibility Difference

**Wildcard (Flexible):**
```java
public void computeList(List<? extends Number> source, 
                        List<? extends Number> destination) {
    // source can be List<Integer>
    // destination can be List<Float>
    // Different types allowed
}
```

**Generic Type (Restrictive):**
```java
public <T extends Number> void computeList(List<T> source, 
                                            List<T> destination) {
    // source and destination MUST be same type
    // Both List<Integer> OR both List<Float>
    // Cannot mix types
}
```

### When to Use Which?

**Use Wildcard when:**
- Need flexibility (different types in parameters)
- Need lower bound (`? super Type`)
- Working with Object methods only

**Use Generic Type when:**
- Need type consistency (all parameters same type)
- Need to reference the type parameter
- Need multiple type parameters

---

## Type Erasure

### Definition

**Type erasure** is the process where Java compiler **removes all generic type information** and replaces it with actual types when generating bytecode.

### Why Type Erasure?

- **Backward compatibility** with pre-generics Java
- JVM doesn't understand generics
- Generics are compile-time feature

### How It Works

**Unbounded Type Parameter:**
```java
// Source code
class Print<T> {
    private T value;
}

// After compilation (bytecode)
class Print {
    private Object value;  // T replaced with Object
}
```

**Bounded Type Parameter:**
```java
// Source code
class Print<T extends Number> {
    private T value;
}

// After compilation (bytecode)
class Print {
    private Number value;  // T replaced with Number (upper bound)
}
```

**Generic Method:**
```java
// Source code
public <T> void method(T param) { }

// After compilation (bytecode)
public void method(Object param) { }  // T replaced with Object
```

**Bounded Generic Method:**
```java
// Source code
public <T extends Bus> void method(T param) { }

// After compilation (bytecode)
public void method(Bus param) { }  // T replaced with Bus
```

### Key Points

1. **Compile-time feature:** Generics exist only at compile time
2. **Runtime:** All generic information is erased
3. **Replacement:** Type parameters replaced with bounds or Object
4. **Bytecode:** Contains no generic information

---

## Summary

### Key Takeaways

1. **Why Generics?**
   - Eliminate typecasting
   - Provide type safety
   - Improve code readability

2. **Generic Class Syntax:**
   - `class Name<T> { }`
   - Type parameter can be any non-primitive type

3. **Inheritance:**
   - Non-generic subclass: Specify type at inheritance
   - Generic subclass: Specify type at object creation

4. **Multiple Type Parameters:**
   - `class Pair<K, V> { }`
   - Can have as many as needed

5. **Generic Methods:**
   - Type parameter before return type
   - Scope limited to method

6. **Raw Types:**
   - Generic class without type parameter
   - Loses type safety (becomes Object)

7. **Bounded Generics:**
   - Upper bound: `T extends Type`
   - Multi bound: `T extends Class & Interface1 & Interface2`

8. **Wildcards:**
   - Upper bound: `? extends Type`
   - Lower bound: `? super Type`
   - Unbounded: `?`

9. **Type Erasure:**
   - Generics removed at compile time
   - Replaced with bounds or Object

### Important Interview Points

- Difference between wildcards and generic type parameters
- When to use upper bound vs lower bound
- Type erasure and how it works
- Why generics are compile-time feature
- How to create generic classes and methods
- Bounded generics and multi bounds

---

## Related Topics

- **Collections** - Generics extensively used in collections
- **Type Safety** - How generics provide compile-time safety
- **Object Class** - Understanding type hierarchy
- **Inheritance** - How generics work with inheritance

