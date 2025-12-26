# Java Pattern Matching: instanceof (Java 16) and Switch (Java 21)

## Table of Contents
- [Pattern Matching for instanceof (Java 16)](#pattern-matching-for-instanceof-java-16)
- [Pattern Matching for Switch (Java 21)](#pattern-matching-for-switch-java-21)
- [Guarded Patterns](#guarded-patterns)
- [Summary](#summary)

---

## Pattern Matching for instanceof (Java 16)

### The Problem

**Old Way:**
```java
Object obj = "Hello";

if (obj instanceof String) {
    String str = (String) obj;  // Manual typecasting
    System.out.println(str.length());
}
```

**Problems:**
- **Extra typecasting** required
- **Verbose** code
- **Error-prone** (wrong cast)

### The Solution

**New Way (Java 16):**
```java
Object obj = "Hello";

if (obj instanceof String str) {  // Pattern variable
    System.out.println(str.length());  // Direct use
}
```

**What happens:**
1. **Checks** if `obj instanceof String`
2. **If true:** Automatically typecasts to `String`
3. **Assigns** to pattern variable `str`
4. **Use directly** without manual cast

### Syntax

```java
if (object instanceof Type variableName) {
    // Use variableName directly (already typecast)
}
```

### Example

**Multiple Types:**
```java
Object obj = getObject();

if (obj instanceof String str) {
    System.out.println("String: " + str.length());
} else if (obj instanceof Integer i) {
    System.out.println("Integer: " + i);
} else if (obj instanceof User user) {
    System.out.println("User: " + user.getName());
}
```

**Key Points:**
- **Type safety:** Compiler ensures correct type
- **Scope:** Pattern variable only in the block
- **Each branch:** Gets its own pattern variable

### Combining with && Operator

**You can add additional conditions:**
```java
Object obj = 5;

if (obj instanceof Integer i && i < 10) {
    System.out.println("Small integer: " + i);
}
```

**How it works:**
1. **First:** Check `obj instanceof Integer` → typecast to `i`
2. **Then:** Check `i < 10`
3. **If both true:** Execute block

**Important:** Pattern variable must be used **after** instanceof check.

**❌ Invalid:**
```java
if (i < 10 && obj instanceof Integer i) {  // ❌ i not defined yet
    // ...
}
```

**✅ Valid:**
```java
if (obj instanceof Integer i && i < 10) {  // ✅ i defined first
    // ...
}
```

### Does NOT Work with || Operator

**❌ Invalid:**
```java
if (obj instanceof Integer i || obj instanceof String s) {
    // ❌ Cannot use i or s - no guarantee which type
    // Pattern matching doesn't work with OR
}
```

**Why?** With OR, compiler cannot guarantee which type `obj` is, so pattern variables cannot be safely used.

### Works with Interfaces

**Example:**
```java
interface Vehicle {
    void drive();
}

class TwoWheeler implements Vehicle {
    @Override
    public void drive() {
        System.out.println("Two wheeler driving");
    }
}

class FourWheeler implements Vehicle {
    @Override
    public void drive() {
        System.out.println("Four wheeler driving");
    }
}

// Usage
Object obj = new TwoWheeler();

if (obj instanceof Vehicle vehicle) {
    vehicle.drive();  // Calls TwoWheeler's drive() method
}
```

**Key Point:** Pattern matching works with interfaces - automatically casts to proper implementation.

---

## Pattern Matching for Switch (Java 21)

### What is Pattern Matching for Switch?

**Allows using objects** (classes, interfaces) in switch statements.

**Before Java 21:** Only primitives, enums, strings supported.

**After Java 21:** Objects, classes, interfaces supported.

### How It Works

**Internally uses `instanceof`** - converts switch to if-else chain.

**Important:** Pattern matching switch is **slower** than classic switch (no jump table optimization).

**Benefit:** Better **readability**, not performance.

### Basic Syntax

```java
Object obj = "Hello";

switch (obj) {
    case String s -> System.out.println("String: " + s);
    case Integer i -> System.out.println("Integer: " + i);
    case User user -> System.out.println("User: " + user.getName());
    default -> System.out.println("Unknown");
}
```

**What happens:**
1. **Checks** `obj instanceof String` → typecast to `s`
2. **If match:** Execute case block
3. **If no match:** Check next case

### Example

```java
Object obj = getObject();

switch (obj) {
    case String s -> {
        System.out.println("String length: " + s.length());
        System.out.println("Value: " + s);
    }
    case Integer i -> System.out.println("Integer: " + i);
    case Double d -> System.out.println("Double: " + d);
    default -> System.out.println("Unknown type");
}
```

### Scope of Pattern Variable

**Pattern variable scope is within the case block only.**

```java
switch (obj) {
    case String s -> {
        System.out.println(s);  // ✅ OK - in case block
    }
    case Integer i -> {
        System.out.println(s);  // ❌ Error - s not in scope
        System.out.println(i);  // ✅ OK
    }
    default -> {
        System.out.println(s);  // ❌ Error - s not in scope
    }
}
// System.out.println(s);  // ❌ Error - outside switch
```

### Pattern Matching with Inheritance

**Example:**
```java
abstract class Vehicle {
    abstract void drive();
}

class TwoWheeler extends Vehicle {
    @Override
    void drive() {
        System.out.println("Two wheeler");
    }
}

class Bike extends TwoWheeler { ... }
class Cycle extends TwoWheeler { ... }

class FourWheeler extends Vehicle {
    @Override
    void drive() {
        System.out.println("Four wheeler");
    }
}

// Usage
TwoWheeler twoWheeler = new Bike();

switch (twoWheeler) {
    case Bike b -> System.out.println("Bike");
    case Cycle c -> System.out.println("Cycle");
    case TwoWheeler tw -> System.out.println("Two wheeler");
    case Vehicle v -> System.out.println("Vehicle");
    // ❌ Cannot use FourWheeler - not a subclass of TwoWheeler
}
```

**Rules:**
- **Can use subclasses** of the switch variable type
- **Can use parent class** (Vehicle)
- **Cannot use unrelated classes** (FourWheeler)

**Duplicate Unconditional Pattern:**
```java
switch (twoWheeler) {
    case Bike b -> ...
    case Cycle c -> ...
    case TwoWheeler tw -> ...  // ✅ Can catch all TwoWheeler types
    case Vehicle v -> ...      // ❌ Duplicate - Vehicle also catches all
}
```

**Error:** "Duplicate unconditional pattern" - both `TwoWheeler` and `Vehicle` can catch all cases.

**Solution:** Use only one:
```java
switch (twoWheeler) {
    case Bike b -> ...
    case Cycle c -> ...
    case TwoWheeler tw -> ...  // Use this OR Vehicle, not both
}
```

### Pattern Matching with Enum

**Example:**
```java
enum Color { RED, GREEN, BLUE, YELLOW }

Object obj = Color.RED;

switch (obj) {
    case Color c -> System.out.println("Color: " + c.name());
    default -> System.out.println("Not a color");
}
```

**Simplified:**
```java
switch (obj) {
    case Color.RED -> System.out.println("Red");
    case Color.GREEN -> System.out.println("Green");
    case Color.BLUE -> System.out.println("Blue");
    default -> System.out.println("Other");
}
```

### Null Handling

**Pattern matching switch is null-safe.**

```java
Object obj = null;

switch (obj) {
    case String s -> System.out.println("String");
    case Integer i -> System.out.println("Integer");
    default -> System.out.println("Null or unknown");  // ✅ Handles null
}
```

**How it works:**
- `obj instanceof String` returns `false` for null
- No typecasting attempted (safe)
- Falls through to default

### Cannot Group Multiple Patterns

**❌ Invalid:**
```java
switch (obj) {
    case Circle c, Square s -> {  // ❌ Error
        // Cannot group patterns with variables
    }
}
```

**Why?** Cannot guarantee which type `obj` is, so cannot use both variables.

**✅ Valid (without variables):**
```java
switch (obj) {
    case String s -> System.out.println("String");
    case Integer i -> System.out.println("Integer");
    // Separate cases
}
```

---

## Guarded Patterns

### What are Guarded Patterns?

**Add additional conditions** to pattern matching using `when` clause.

**Syntax:**
```java
case Pattern variable when condition -> { ... }
```

### Example

**Without Guard:**
```java
switch (obj) {
    case String s -> {
        if (s.contains("h") || s.contains("H")) {
            System.out.println("Contains h");
        } else {
            // Handle other case
        }
    }
    default -> System.out.println("Not a string");
}
```

**With Guard:**
```java
switch (obj) {
    case String s when s.contains("h") || s.contains("H") -> {
        System.out.println("Contains h");
    }
    case String s -> {
        System.out.println("String without h");
    }
    default -> System.out.println("Not a string");
}
```

**How it works:**
1. **First:** Pattern match `obj instanceof String` → typecast to `s`
2. **Then:** Check guard condition `s.contains("h") || s.contains("H")`
3. **If both true:** Execute case block
4. **If pattern matches but guard fails:** Try next case

### Multiple Conditions

**You can add multiple conditions:**
```java
switch (obj) {
    case String s when s.length() > 5 && s.contains("a") -> {
        System.out.println("Long string with 'a'");
    }
    case String s when s.length() <= 5 -> {
        System.out.println("Short string");
    }
    case String s -> {
        System.out.println("String without 'a'");
    }
    default -> System.out.println("Not a string");
}
```

**Key Points:**
- **`when`** = Additional condition (AND logic)
- **Guard evaluated after** pattern matching
- **If guard fails:** Try next matching case

### Guarded Patterns with || Operator

**❌ Invalid:**
```java
switch (obj) {
    case String s when s.contains("h") || s.contains("H") -> {  // ✅ OK - in guard
        // ...
    }
    // But cannot use OR in pattern itself:
    case String s || Integer i -> {  // ❌ Invalid
        // ...
    }
}
```

**Key Point:** OR works in **guard condition**, not in **pattern matching**.

---

## Summary

### Pattern Matching for instanceof (Java 16)

- **Syntax:** `if (obj instanceof Type variable) { ... }`
- **Automatic typecasting** to pattern variable
- **Works with &&** (additional conditions)
- **Does NOT work with ||** (no type guarantee)
- **Scope:** Pattern variable only in the block

### Pattern Matching for Switch (Java 21)

- **Allows objects** in switch (classes, interfaces)
- **Internally uses instanceof** (slower than classic switch)
- **Scope:** Pattern variable only in case block
- **Null-safe:** Handles null gracefully
- **Cannot group patterns** with variables
- **Works with inheritance** (subclasses, parent classes)

### Guarded Patterns

- **Syntax:** `case Pattern variable when condition -> { ... }`
- **Adds additional conditions** after pattern matching
- **`when` = AND logic** (pattern match AND condition)
- **OR works in guard**, not in pattern

---

## Key Takeaways

1. **Pattern Matching instanceof** = Automatic typecasting (Java 16)
2. **Pattern Matching Switch** = Objects in switch (Java 21)
3. **Pattern variable** = Automatically typecast variable
4. **Scope** = Pattern variable only in block/case
5. **Guarded patterns** = Additional conditions with `when`
6. **Works with &&**, **NOT with ||** in pattern matching
7. **Null-safe** = Handles null without exception

---

## Interview Questions

1. **What is pattern matching for instanceof?**  
   Java 16 feature that automatically typecasts after instanceof check. Syntax: `if (obj instanceof String str) { ... }`

2. **What is pattern matching for switch?**  
   Java 21 feature that allows using objects (classes, interfaces) in switch statements with automatic typecasting.

3. **What is a pattern variable?**  
   Variable that receives the typecast value automatically (e.g., `str` in `instanceof String str`).

4. **Does pattern matching work with || operator?**  
   No, pattern matching doesn't work with OR operator (no type guarantee). Works with AND operator.

5. **What is the scope of pattern variable?**  
   Only within the block/case where it's defined. Cannot access outside.

6. **What are guarded patterns?**  
   Additional conditions added to pattern matching using `when` clause. Example: `case String s when s.length() > 5 -> { ... }`

7. **Is pattern matching switch faster than classic switch?**  
   No, it's slower. Internally uses instanceof (if-else chain), while classic switch uses jump table optimization.

8. **How does pattern matching handle null?**  
   Null-safe - `instanceof` returns false for null, so no typecasting attempted. Falls through to default case.

9. **Can you group multiple patterns with variables?**  
   No, cannot group patterns like `case Circle c, Square s ->`. Each pattern needs separate case.

10. **What is the difference between pattern matching and regular instanceof?**  
    Pattern matching automatically typecasts and assigns to variable. Regular instanceof requires manual typecasting.

