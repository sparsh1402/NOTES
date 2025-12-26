# Java 17: Sealed Classes and Interfaces

## Table of Contents
- [The Problem](#the-problem)
- [What are Sealed Classes?](#what-are-sealed-classes)
- [How to Use Sealed Classes](#how-to-use-sealed-classes)
- [Permit Types Rules](#permit-types-rules)
- [Complete Example](#complete-example)
- [Summary](#summary)

---

## The Problem

### Lack of Control in Inheritance

**Problem:** No control over which classes can extend/implement a class or interface.

**Example:**
```java
// Interface Shape
public interface Shape {
    void draw();
}

// Any class can implement it
class Circle implements Shape { ... }
class Rectangle implements Shape { ... }
class Triangle implements Shape { ... }
class UnknownShape implements Shape { ... }  // ❌ Not planned, but allowed!

// Any class can extend Circle
class ColoredCircle extends Circle { ... }
class AnimatedCircle extends Circle { ... }
// No control - hierarchy can grow indefinitely
```

**Issues:**
1. **Unknown implementations** can be added (not planned)
2. **Hierarchy grows** without control
3. **Switch statements** need `default` case (handle unknown types)
4. **Code breaks silently** if new implementations added without handling

**Example Problem:**
```java
public void processShape(Shape shape) {
    if (shape instanceof Circle) {
        // Handle circle
    } else if (shape instanceof Rectangle) {
        // Handle rectangle
    } else {
        // ❌ Must handle unknown types (default case)
        // What if UnknownShape is added? Code breaks!
    }
}
```

---

## What are Sealed Classes?

### Definition

**Sealed Classes/Interfaces** allow you to **restrict** which classes can extend or implement them.

**Key Concept:** Use `sealed` keyword with `permits` clause to specify allowed subclasses.

**Syntax:**
```java
public sealed interface Shape permits Circle, Rectangle {
    void draw();
}
```

**Meaning:**
- **Shape** can be implemented/extended
- **Only** by classes listed in `permits` clause
- **No other classes** can implement/extend it

---

## How to Use Sealed Classes

### Basic Syntax

```java
// Sealed interface
public sealed interface Shape permits Circle, Rectangle {
    void draw();
}

// Allowed implementations
public final class Circle implements Shape {
    @Override
    public void draw() {
        System.out.println("Drawing circle");
    }
}

public final class Rectangle implements Shape {
    @Override
    public void draw() {
        System.out.println("Drawing rectangle");
    }
}

// ❌ Not allowed - not in permits list
// public class Triangle implements Shape { ... }  // Compilation error!
```

### Subclass Modifiers

**Each permitted subclass must choose one of three modifiers:**

1. **final** - No further subclasses allowed
2. **non-sealed** - Open to any number of subclasses
3. **sealed** - Further restricted (with its own permits clause)

**Example:**
```java
public sealed interface Shape permits Circle, Polygon, AbstractShape {
    void draw();
}

// 1. final - No subclasses
public final class Circle implements Shape {
    @Override
    public void draw() { ... }
}

// 2. non-sealed - Open to any subclasses
public non-sealed interface Polygon extends Shape {
    // Can have any number of implementations
}
class Hexagon implements Polygon { ... }
class Pentagon implements Polygon { ... }

// 3. sealed - Further restricted
public sealed abstract class AbstractShape implements Shape 
    permits Rectangle, Triangle {
    // Only Rectangle and Triangle can extend
}

public final class Rectangle extends AbstractShape {
    @Override
    public void draw() { ... }
}

public non-sealed class Triangle extends AbstractShape {
    // Can have subclasses
}
```

---

## Permit Types Rules

### Rule 1: Direct Subclass

**Permit types must be direct subclasses** of the sealed class/interface.

**✅ Valid:**
```java
public sealed interface Shape permits Circle, Rectangle { ... }

public final class Circle implements Shape { ... }  // Direct
public final class Rectangle implements Shape { ... }  // Direct
```

**❌ Invalid:**
```java
public sealed interface Shape permits Circle { ... }

public class BaseShape { ... }
public class Circle extends BaseShape implements Shape { ... }  
// ❌ Not direct - Circle extends BaseShape first
```

### Rule 2: Must Choose Modifier

**Each permit type must be:**
- `final`
- `sealed` (with its own permits)
- `non-sealed`

**Example:**
```java
public sealed interface Shape permits Circle, Rectangle { ... }

// ✅ Valid
public final class Circle implements Shape { ... }

// ✅ Valid
public non-sealed class Rectangle implements Shape { ... }

// ✅ Valid
public sealed class Polygon implements Shape permits Hexagon { ... }

// ❌ Invalid - must choose one modifier
public class Triangle implements Shape { ... }  // Compilation error!
```

### Rule 3: Implementation Must Exist

**All permit types must have implementations present** (cannot be future classes).

**✅ Valid:**
```java
public sealed interface Shape permits Circle, Rectangle { ... }

public final class Circle implements Shape { ... }  // Present
public final class Rectangle implements Shape { ... }  // Present
```

**❌ Invalid:**
```java
public sealed interface Shape permits Circle, Rectangle, Triangle { ... }

public final class Circle implements Shape { ... }
public final class Rectangle implements Shape { ... }
// ❌ Triangle not implemented - compilation error!
```

---

## Complete Example

### Hierarchical Sealed Classes

```java
// Top-level sealed interface
public sealed interface Shape 
    permits Circle, Polygon, AbstractShape {
    void draw();
}

// 1. Circle - final (no subclasses)
public final class Circle implements Shape {
    @Override
    public void draw() {
        System.out.println("Drawing circle");
    }
}

// 2. Polygon - non-sealed (open to any subclasses)
public non-sealed interface Polygon extends Shape {
    int getSides();
}

class Hexagon implements Polygon {
    @Override
    public void draw() {
        System.out.println("Drawing hexagon");
    }
    
    @Override
    public int getSides() {
        return 6;
    }
}

class Pentagon implements Polygon {
    @Override
    public void draw() {
        System.out.println("Drawing pentagon");
    }
    
    @Override
    public int getSides() {
        return 5;
    }
}

// 3. AbstractShape - sealed (further restricted)
public sealed abstract class AbstractShape implements Shape 
    permits Rectangle, Triangle {
    // Common implementation
}

// Rectangle - final (no subclasses)
public final class Rectangle extends AbstractShape {
    @Override
    public void draw() {
        System.out.println("Drawing rectangle");
    }
}

// Triangle - non-sealed (can have subclasses)
public non-sealed class Triangle extends AbstractShape {
    @Override
    public void draw() {
        System.out.println("Drawing triangle");
    }
}

// Triangle can have subclasses
class EquilateralTriangle extends Triangle { ... }
class IsoscelesTriangle extends Triangle { ... }
```

### Usage with Pattern Matching

**Sealed classes work great with pattern matching:**

```java
public void processShape(Shape shape) {
    switch (shape) {
        case Circle c -> System.out.println("Circle");
        case Rectangle r -> System.out.println("Rectangle");
        case Triangle t -> System.out.println("Triangle");
        // ✅ No default needed - compiler knows all cases covered!
    }
}
```

**Without sealed classes:**
```java
public void processShape(Shape shape) {
    switch (shape) {
        case Circle c -> System.out.println("Circle");
        case Rectangle r -> System.out.println("Rectangle");
        default -> System.out.println("Unknown");  // ❌ Required
    }
}
```

---

## Summary

### Key Concepts

1. **Sealed Classes/Interfaces:**
   - Use `sealed` keyword
   - Specify allowed subclasses with `permits`
   - **Control inheritance** hierarchy

2. **Subclass Modifiers:**
   - **final** - No further subclasses
   - **non-sealed** - Open to any subclasses
   - **sealed** - Further restricted

3. **Rules:**
   - Permit types must be **direct subclasses**
   - Must choose **one modifier** (final/sealed/non-sealed)
   - All permit types must have **implementations present**

4. **Benefits:**
   - **Control** over inheritance
   - **Exhaustive pattern matching** (no default needed)
   - **Prevent unknown implementations**
   - **Better code safety**

---

## Key Takeaways

1. **Sealed classes** = Controlled inheritance (restrict who can extend/implement)
2. **permits clause** = List of allowed subclasses
3. **Three modifiers:** final, sealed, non-sealed
4. **Direct subclasses only** - permit types must directly extend/implement
5. **Pattern matching** - Works great with sealed classes (exhaustive checking)
6. **Prevents unknown implementations** - Better code safety

---

## Interview Questions

1. **What are sealed classes?**  
   Classes/interfaces that restrict which classes can extend/implement them using `sealed` and `permits` keywords.

2. **Why were sealed classes introduced?**  
   To provide control over inheritance hierarchy, prevent unknown implementations, and enable exhaustive pattern matching.

3. **What are the three modifiers for permitted subclasses?**  
   `final` (no subclasses), `sealed` (further restricted), `non-sealed` (open to any subclasses).

4. **What is the permits clause?**  
   Lists the classes/interfaces that are allowed to extend/implement the sealed class/interface.

5. **Can a permitted subclass be non-sealed?**  
   Yes, `non-sealed` allows the subclass to be extended by any number of classes.

6. **What happens if a class tries to implement a sealed interface but is not in permits?**  
   Compilation error - only classes in permits list can implement/extend.

7. **How do sealed classes help with pattern matching?**  
   Compiler can verify exhaustive pattern matching (all cases covered) without needing default case.

8. **Can sealed classes implement interfaces?**  
   Yes, sealed classes can implement interfaces (but cannot extend other classes except Object).

9. **What is the difference between sealed and final?**  
   `final` means no subclasses at all. `sealed` means only specific subclasses (listed in permits) are allowed.

10. **Can a sealed class have sealed subclasses?**  
    Yes, a permitted subclass can itself be sealed with its own permits clause, creating a hierarchical restriction.

