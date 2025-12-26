# Java Annotations

## Table of Contents
- [What is Annotation?](#what-is-annotation)
- [Types of Annotations](#types-of-annotations)
- [Annotations Used on Java Code](#annotations-used-on-java-code)
  - [@Deprecated](#deprecated)
  - [@Override](#override)
  - [@SuppressWarnings](#suppresswarnings)
  - [@FunctionalInterface](#functionalinterface)
  - [@SafeVarargs](#safevarargs)
- [Meta Annotations](#meta-annotations)
  - [@Target](#target)
  - [@Retention](#retention)
  - [@Documented](#documented)
  - [@Inherited](#inherited)
  - [@Repeatable](#repeatable)
- [Custom Annotations](#custom-annotations)
  - [Creating Simple Annotation](#creating-simple-annotation)
  - [Annotation with Members](#annotation-with-members)
  - [Annotation with Default Values](#annotation-with-default-values)
- [Summary](#summary)

---

## What is Annotation?

An **annotation** is a form of **metadata** that can be added to Java code.

**Key Points:**
- Denoted using `@` symbol (e.g., `@Override`)
- Provides **metadata** (data about data)
- **Optional** - code works without annotations
- Can be accessed at **runtime** using reflection
- Can be applied to: classes, methods, interfaces, fields, parameters, etc.

**Purpose:**
- Provide information to compiler, JVM, or tools
- Add logic based on metadata at runtime
- Used by frameworks (Spring, Hibernate, JUnit)

**Example:**
```java
interface Bird {
    void fly();
}

class Eagle implements Bird {
    @Override  // Annotation - metadata
    public void fly() {
        System.out.println("Eagle flies");
    }
}
```

**How to Access Annotations:**
- Using **reflection** (covered in previous notes)
- Annotations are metadata, reflection accesses metadata

---

## Types of Annotations

There are **two main types** of annotations:

1. **Predefined Annotations** - Already provided by Java
2. **Custom Annotations** - User-defined annotations

**Predefined Annotations have two categories:**
1. **Used on Java Code** - Applied to classes, methods, fields, etc.
2. **Meta Annotations** - Applied to other annotations

---

## Annotations Used on Java Code

### @Deprecated

**Purpose:** Marks a class, method, or field as **deprecated** (no longer recommended for use).

**Usage:**
```java
public class Mobile {
    @Deprecated
    public void oldMethod() {
        System.out.println("This method is deprecated");
    }
    
    public void newMethod() {
        System.out.println("Use this method instead");
    }
}
```

**Effect:**
- Compiler shows **warning** when deprecated code is used
- Indicates that no further development will happen on deprecated code
- Suggests using alternative if available

**Example:**
```java
public class Test {
    public static void main(String[] args) {
        Mobile mobile = new Mobile();
        mobile.oldMethod();  // Warning: Using deprecated method
        mobile.newMethod();  // No warning
    }
}
```

**Can be used on:**
- Constructor
- Field
- Local variable
- Method
- Package
- Parameter
- Type (class, interface, enum)

### @Override

**Purpose:** Indicates that a method is **overriding** a method from parent class or interface.

**Usage:**
```java
interface Bird {
    void fly();
}

class Eagle implements Bird {
    @Override
    public void fly() {
        System.out.println("Eagle flies");
    }
}
```

**Effect:**
- Compiler checks that method signature matches parent/interface
- If signature doesn't match, **compilation error** occurs
- Makes code more readable and prevents mistakes

**Example:**
```java
class Parent {
    void method() {
        System.out.println("Parent method");
    }
}

class Child extends Parent {
    @Override
    void method() {  // Correct - matches parent
        System.out.println("Child method");
    }
    
    @Override
    void wrongMethod() {  // ERROR: No such method in parent
        // Compilation error
    }
}
```

**Can be used on:** Methods only

### @SuppressWarnings

**Purpose:** Tells compiler to **ignore** compile-time warnings.

**Usage:**
```java
@SuppressWarnings("deprecation")
public void method() {
    Mobile mobile = new Mobile();
    mobile.oldMethod();  // No warning shown
}
```

**Common Warning Types:**
- `"deprecation"` - Suppress deprecation warnings
- `"unused"` - Suppress unused variable/method warnings
- `"all"` - Suppress all warnings

**Example:**
```java
@SuppressWarnings("deprecation")
public class Test {
    public static void main(String[] args) {
        Mobile mobile = new Mobile();
        mobile.oldMethod();  // No deprecation warning
    }
}

// Suppress all warnings
@SuppressWarnings("all")
public class Test2 {
    // All warnings suppressed
}
```

**Can be used on:**
- Field
- Method
- Parameter
- Constructor
- Local variable
- Type (class, interface, enum)

**Warning:** Use carefully - warnings can help catch potential bugs!

### @FunctionalInterface

**Purpose:** Indicates that an interface is a **functional interface** (has exactly one abstract method).

**Usage:**
```java
@FunctionalInterface
interface Bird {
    void fly();  // Only one abstract method
    
    // If you try to add another:
    // void eat();  // Compilation error!
}
```

**Effect:**
- Compiler ensures interface has exactly one abstract method
- Prevents accidentally adding more abstract methods
- Makes intent clear

**Can be used on:** Type (class, interface, enum) - typically interfaces

### @SafeVarargs

**Purpose:** Suppresses **heap pollution warnings** for methods/constructors with variable arguments.

**What is Heap Pollution?**
- When an object of one type stores reference of another type
- Example: `List<Integer>` storing `List<String>`

**Why with Variable Arguments?**
- Variable arguments are internally converted to arrays
- Using `Object[]` can cause type confusion
- Compiler warns about possible heap pollution

**Usage:**
```java
@SafeVarargs
public static void printValues(List<Integer>... logNumberList) {
    // Process variable arguments
    for (List<Integer> list : logNumberList) {
        System.out.println(list);
    }
}
```

**Rules:**
- Can only be used on methods/constructors with **variable arguments**
- Method must be **static** or **final** (or **private** from Java 9)
- Suppresses heap pollution warning

**Example:**
```java
public class Test {
    @SafeVarargs
    public static void process(List<String>... lists) {
        // Without @SafeVarargs, compiler shows warning:
        // "Possible heap pollution from parameterized vararg type"
    }
}
```

**Can be used on:** Methods and constructors with variable arguments

---

## Meta Annotations

Meta annotations are annotations **applied to other annotations**. They define how annotations behave.

### @Target

**Purpose:** Specifies **where** an annotation can be applied.

**Element Types:**
- `ElementType.TYPE` - Class, interface, enum
- `ElementType.FIELD` - Field (member variable declaration)
- `ElementType.METHOD` - Method
- `ElementType.PARAMETER` - Parameter (method/constructor parameters)
- `ElementType.CONSTRUCTOR` - Constructor
- `ElementType.LOCAL_VARIABLE` - Local variable (inside methods)
- `ElementType.ANNOTATION_TYPE` - Annotation (for meta annotations)
- `ElementType.PACKAGE` - Package
- `ElementType.TYPE_PARAMETER` - Type parameter (generics, e.g., `<T>`)
- `ElementType.TYPE_USE` - Type use (Java 8+) - wherever a type is used

**Example:**
```java
@Target(ElementType.METHOD)
@interface MyAnnotation {
    // This annotation can only be used on methods
}

// Usage
class Test {
    @MyAnnotation  // OK - on method
    public void method() {
    }
    
    // @MyAnnotation  // ERROR - cannot use on class
    // class Test2 {
    // }
}
```

**Multiple Targets:**
```java
@Target({ElementType.METHOD, ElementType.CONSTRUCTOR})
@interface MyAnnotation {
    // Can be used on methods and constructors
}
```

**How Java Uses It:**
```java
@Target(ElementType.METHOD)
public @interface Override {
    // Override can only be used on methods
}

@Target({ElementType.CONSTRUCTOR, ElementType.METHOD})
public @interface SafeVarargs {
    // SafeVarargs can be used on constructors and methods
}
```

**ElementType.ANNOTATION_TYPE - Making Meta Annotations:**

When you want to create a **meta annotation** (annotation that can be applied to other annotations), you use `ElementType.ANNOTATION_TYPE`.

**Example:**
```java
// @Target itself is a meta annotation
@Target(ElementType.ANNOTATION_TYPE)  // Can be applied to annotations
@Retention(RetentionPolicy.RUNTIME)
public @interface Target {
    ElementType[] value();
}

// Now @SafeVarargs can be applied to annotations
@Target(ElementType.ANNOTATION_TYPE)
@interface MyMetaAnnotation {
}

// Usage on another annotation
@MyMetaAnnotation  // OK - applied to annotation
@Target(ElementType.METHOD)
@interface MyAnnotation {
}
```

**ElementType.TYPE_USE (Java 8+):**

Allows annotation wherever a type is used (not just declared).

**Example:**
```java
@Target(ElementType.TYPE_USE)
@interface NonNull {
}

class Test {
    @NonNull String name;  // On field type
    List<@NonNull String> items;  // On generic type parameter
    @NonNull String method(@NonNull String param) {  // On return type and parameter
        return param;
    }
}
```

### @Retention

**Purpose:** Specifies **how long** an annotation is retained (stored).

**Retention Policies:**
1. **SOURCE** - Discarded by compiler, not in `.class` file
2. **CLASS** - Stored in `.class` file, but ignored by JVM at runtime
3. **RUNTIME** - Stored in `.class` file and available at runtime (can be accessed via reflection)

**Detailed Explanation:**

**SOURCE Retention:**
- Annotation is **discarded by compiler** after using it
- **Not recorded** in `.class` file
- Used only by compiler for compile-time checks
- Example: `@Override` - compiler checks override, then discards annotation

**Example:**
```java
// Java file: Eagle.java
class Eagle {
    @Override  // SOURCE retention
    public void fly() {
    }
}

// After compilation: Eagle.class
// @Override annotation is NOT in .class file
// Only the method remains
```

**CLASS Retention:**
- Annotation is **recorded in `.class` file**
- But **ignored by JVM** at runtime
- Cannot access via reflection
- Used by tools that process `.class` files

**RUNTIME Retention:**
- Annotation is **recorded in `.class` file**
- **Available at runtime** via reflection
- Can be accessed using `getAnnotation()` method
- Used when you need to process annotations at runtime

**Example:**
```java
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface MyAnnotation {
}

@MyAnnotation
class Test {
}

// Accessing annotation at runtime
public class Main {
    public static void main(String[] args) {
        Class<?> clazz = Test.class;
        MyAnnotation annotation = clazz.getAnnotation(MyAnnotation.class);
        
        if (annotation != null) {
            System.out.println("Annotation found!");
        } else {
            System.out.println("Annotation not found (null)");
        }
    }
}
```

**Without RUNTIME Retention:**
```java
// Missing @Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE)
@interface MyAnnotation {
}

@MyAnnotation
class Test {
}

// Accessing at runtime
MyAnnotation annotation = Test.class.getAnnotation(MyAnnotation.class);
// Returns null - annotation not available at runtime!
```

**How Java Uses It:**
```java
@Retention(RetentionPolicy.SOURCE)
public @interface Override {
    // Only used by compiler, discarded after compilation
}

@Retention(RetentionPolicy.RUNTIME)
public @interface SafeVarargs {
    // Available at runtime for reflection
}
```

**Key Point:** If you want to access annotations using reflection, you **must** use `@Retention(RetentionPolicy.RUNTIME)`.

### @Documented

**Purpose:** Indicates that annotation should be included in **JavaDoc** documentation.

**Default Behavior:**
- By default, annotations are **ignored** when JavaDoc is generated
- `@Documented` makes annotation appear in generated JavaDoc

**Example Without @Documented:**
```java
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.SOURCE)
public @interface Override {
}

class Eagle {
    @Override
    public void fly() {
    }
}
```

**Generated JavaDoc:**
```
public void fly()
```
- `@Override` annotation **does not appear** in JavaDoc

**Example With @Documented:**
```java
@Documented
@Target({ElementType.CONSTRUCTOR, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface SafeVarargs {
}

class Test {
    @SafeVarargs
    public static void process(List<String>... lists) {
    }
}
```

**Generated JavaDoc:**
```
@SafeVarargs
public static void process(List<String>... lists)
```
- `@SafeVarargs` annotation **appears** in JavaDoc

**Usage:**
- Use `@Documented` when you want annotations to be visible in generated documentation
- Helps other developers understand what annotations are applied
- Tools like IntelliJ IDEA and Eclipse can generate JavaDoc

**Example:**
```java
@Documented
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
@interface MyAnnotation {
    String value();
}

class Test {
    @MyAnnotation("Example")
    public void method() {
    }
}
```

**Generated JavaDoc will show:**
```
@MyAnnotation("Example")
public void method()
```

### @Inherited

**Purpose:** Indicates that annotation on a parent class should be **inherited** by child classes.

**Default Behavior:**
- By default, annotations applied on a parent class are **not available** to child classes
- `@Inherited` makes annotation available to child classes

**Example With @Inherited:**
```java
@Inherited
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface MyAnnotation {
}

@MyAnnotation
class Parent {
}

class Child extends Parent {
    // Child class does NOT have @MyAnnotation written here
    // But it inherits it from Parent
}

// Accessing annotation
public class Main {
    public static void main(String[] args) {
        Class<?> childClass = Child.class;
        MyAnnotation annotation = childClass.getAnnotation(MyAnnotation.class);
        
        if (annotation != null) {
            System.out.println("Annotation inherited from parent!");
            // Output: Annotation inherited from parent!
        }
    }
}
```

**Example Without @Inherited:**
```java
// Missing @Inherited
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface MyAnnotation {
}

@MyAnnotation
class Parent {
}

class Child extends Parent {
    // Child does NOT inherit annotation
}

// Accessing annotation
MyAnnotation annotation = Child.class.getAnnotation(MyAnnotation.class);
// Returns null - annotation not inherited!
```

**Key Points:**
- Only works for **class inheritance** (not interfaces)
- Only works for annotations applied to **classes** (not methods or fields)
- Child class can access parent's annotation via reflection if `@Inherited` is present
- If child class has its own annotation, it doesn't override inherited one (both exist)

**Important:** If you want child classes to automatically have parent's annotation, use `@Inherited`.

### @Repeatable

**Purpose:** Allows using the **same annotation multiple times** at the same place (Java 8+).

**Problem Without @Repeatable:**
```java
@interface Category {
    String name();
}

// Cannot repeat annotation
@Category(name = "Bird")
@Category(name = "LivingThing")  // ERROR: Duplicate annotation
class Eagle {
}
```

**Why Need Repetition?**
Sometimes you want to apply the same annotation multiple times with different values.

**Example Use Case:**
```java
// Eagle belongs to multiple categories
@Category(name = "Bird")
@Category(name = "LivingThing")
@Category(name = "Carnivorous")
class Eagle {
}
```

**Solution with @Repeatable (Two Steps):**

**Step 1: Create Container Annotation**
```java
// Container annotation - holds array of repeatable annotation
@interface Categories {
    Category[] value();  // Array of Category annotations
}
```

**Step 2: Make Annotation Repeatable**
```java
@Repeatable(Categories.class)  // Specify container
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface Category {
    String name();  // Annotation member
}
```

**Step 3: Use Multiple Times**
```java
@Category(name = "Bird")
@Category(name = "LivingThing")
@Category(name = "Carnivorous")
class Eagle {
}
```

**How It Works Internally:**
- When you use `@Category` multiple times, Java stores them in the `Categories` container
- Internally, it's like: `@Categories({@Category("Bird"), @Category("LivingThing"), @Category("Carnivorous")})`

**Accessing Repeated Annotations:**
```java
public class Main {
    public static void main(String[] args) {
        Class<?> clazz = Eagle.class;
        
        // Use getAnnotationsByType() to get all repeated annotations
        Category[] categories = clazz.getAnnotationsByType(Category.class);
        
        for (Category category : categories) {
            System.out.println("Category: " + category.name());
        }
        // Output:
        // Category: Bird
        // Category: LivingThing
        // Category: Carnivorous
    }
}
```

**Complete Example:**
```java
// Container annotation
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface Categories {
    Category[] value();  // Must be named 'value' and return array
}

// Repeatable annotation
@Repeatable(Categories.class)
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface Category {
    String name();
}

// Usage
@Category(name = "Bird")
@Category(name = "LivingThing")
@Category(name = "Carnivorous")
class Eagle {
}

// Accessing
Category[] categories = Eagle.class.getAnnotationsByType(Category.class);
for (Category cat : categories) {
    System.out.println(cat.name());
}
```

**Key Points:**
- Requires **two annotations**: repeatable annotation + container annotation
- Container must have method named `value()` returning array of repeatable type
- Container must have same `@Target` and `@Retention` as repeatable annotation
- Use `getAnnotationsByType()` (not `getAnnotation()`) to get all repeated annotations
- Available only from **Java 8+**

**Rules:**
1. Container annotation must have a method `value()` that returns an array
2. Container must have same or broader `@Target` than repeatable annotation
3. Container must have same or broader `@Retention` than repeatable annotation

---

## Custom Annotations

### Creating Simple Annotation

**Syntax:**
```java
@interface AnnotationName {
    // Empty body
}
```

**Example:**
```java
@interface MyAnnotation {
}

// Usage
@MyAnnotation
class Test {
}
```

**Adding Meta Annotations:**
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface MyAnnotation {
}

@MyAnnotation
class Test {
}
```

### Annotation with Members

Annotations can have **members** (like fields) to store additional information.

**Syntax:**
```java
@interface AnnotationName {
    DataType memberName();  // No parameters, no body
}
```

**Rules for Members:**
- Return type must be: **primitive**, **String**, **Class**, **enum**, **annotation**, or **array** of these
- Cannot have parameters
- Cannot have body (no implementation)
- Looks like a method but acts like a field
- Also called "annotation members" or "annotation elements"

**Example:**
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface MyAnnotation {
    String name();      // Member (looks like method, acts like field)
    int value();        // Member
}

// Usage
@MyAnnotation(name = "Test", value = 10)
class TestClass {
}
```

**Accessing Members:**
```java
@MyAnnotation(name = "Test", value = 10)
class TestClass {
}

public class Main {
    public static void main(String[] args) {
        Class<?> clazz = TestClass.class;
        MyAnnotation annotation = clazz.getAnnotation(MyAnnotation.class);
        
        if (annotation != null) {
            System.out.println("Name: " + annotation.name());  // "Test"
            System.out.println("Value: " + annotation.value());  // 10
        }
    }
}
```

**Multiple Members:**
```java
@interface MyAnnotation {
    String name();
    int value();
    boolean enabled();
}

// Usage
@MyAnnotation(name = "Test", value = 10, enabled = true)
class TestClass {
}
```

**Allowed Return Types:**
- Primitives: `int`, `long`, `double`, `float`, `boolean`, `byte`, `short`, `char`
- `String`
- `Class<?>` (e.g., `Class<?> clazz()`)
- Enum types
- Other annotations
- Arrays of above types: `String[]`, `int[]`, `Class<?>[]`, etc.

**Example with Different Types:**
```java
enum Status { ACTIVE, INACTIVE }

@interface MyAnnotation {
    String name();
    int count();
    Class<?> type();
    Status status();
    String[] tags();
}
```

### Annotation with Default Values

Members can have **default values**, making them optional when using the annotation.

**Syntax:**
```java
@interface AnnotationName {
    String name() default "DefaultValue";
}
```

**Example:**
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@interface MyAnnotation {
    String name() default "Hello";
}

// Usage without providing value (uses default)
@MyAnnotation  // name = "Hello" (default)
class Test1 {
}

// Usage with custom value (overrides default)
@MyAnnotation(name = "World")  // name = "World"
class Test2 {
}

// Usage with explicit default (same as not providing)
@MyAnnotation(name = "Hello")  // Same as @MyAnnotation
class Test3 {
}
```

**Multiple Members with Defaults:**
```java
@interface MyAnnotation {
    String name() default "Default";
    int value() default 0;
}

// All defaults
@MyAnnotation  // name = "Default", value = 0
class Test1 {
}

// Custom name, default value
@MyAnnotation(name = "Custom")  // name = "Custom", value = 0
class Test2 {
}

// Custom value, default name
@MyAnnotation(value = 100)  // name = "Default", value = 100
class Test3 {
}

// All custom
@MyAnnotation(name = "Custom", value = 100)  // name = "Custom", value = 100
class Test4 {
}
```

**Accessing Default Values:**
```java
@MyAnnotation  // Using default
class Test {
}

MyAnnotation annotation = Test.class.getAnnotation(MyAnnotation.class);
System.out.println(annotation.name());  // Prints: "Hello" (default value)
```

**Key Points:**
- Default values are used when member is not specified
- Can mix default and custom values
- Default values must be compile-time constants
- Makes annotations more flexible and easier to use

---

## Summary

### What is Annotation?
- Form of **metadata** added to Java code
- Denoted with `@` symbol
- **Optional** - code works without them
- Can be accessed at runtime using reflection

### Predefined Annotations (On Code)
- **@Deprecated** - Marks code as deprecated
- **@Override** - Indicates method override
- **@SuppressWarnings** - Suppresses compiler warnings
- **@FunctionalInterface** - Marks functional interface
- **@SafeVarargs** - Suppresses heap pollution warnings

### Meta Annotations (On Annotations)
- **@Target** - Where annotation can be applied
- **@Retention** - How long annotation is retained (SOURCE, CLASS, RUNTIME)
- **@Documented** - Include in JavaDoc
- **@Inherited** - Inherit from parent class
- **@Repeatable** - Allow multiple uses (Java 8+)

### Custom Annotations
- Created using `@interface`
- Can have members (like fields)
- Members can have default values
- Use meta annotations to configure behavior

### Key Points
- Annotations are **metadata** - optional information
- Accessible via **reflection** at runtime (if retention is RUNTIME)
- Used extensively by **frameworks** (Spring, Hibernate)
- **Meta annotations** control annotation behavior
- **Custom annotations** allow creating your own metadata

---

## Practice Exercises

1. Create a custom annotation `@Author` with a member `name()` and apply it to a class.

2. Create an annotation `@Version` with members `major()` and `minor()` with default values.

3. Create a repeatable annotation `@Tag` that can be used multiple times on a class.

4. Create an annotation with `@Retention(RetentionPolicy.RUNTIME)` and access it using reflection.

5. Create an annotation that can only be used on methods using `@Target(ElementType.METHOD)`.

---

## Interview Questions

1. **What is an annotation?**  
   A form of metadata that can be added to Java code. Denoted with `@` symbol, optional, can be accessed at runtime.

2. **What is @Override?**  
   Indicates method is overriding parent/interface method. Compiler checks signature matches.

3. **What is @Deprecated?**  
   Marks code as deprecated. Compiler shows warning when deprecated code is used.

4. **What are meta annotations?**  
   Annotations applied to other annotations. Examples: @Target, @Retention, @Documented, @Inherited, @Repeatable.

5. **What is @Target?**  
   Specifies where an annotation can be applied (TYPE, METHOD, FIELD, etc.).

6. **What is @Retention?**  
   Specifies how long annotation is retained: SOURCE (discarded), CLASS (in .class file), RUNTIME (accessible at runtime).

7. **What is @Repeatable?**  
   Allows using same annotation multiple times. Requires container annotation with array of repeatable annotation.

8. **How to create custom annotation?**  
   Use `@interface` keyword. Can add members, default values, and meta annotations.

9. **What is heap pollution?**  
   When object of one type stores reference of another type. Can occur with variable arguments.

10. **Can annotations have methods?**  
    Annotations have members (look like methods but act like fields). Return type restricted to primitives, String, Class, enum, annotation, or arrays.



