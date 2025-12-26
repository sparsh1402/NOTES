# Java Reflection

## Table of Contents
- [What is Reflection?](#what-is-reflection)
- [Class Class](#class-class)
  - [What is Class Class?](#what-is-class-class)
  - [How to Get Class Object](#how-to-get-class-object)
- [Reflection of Classes](#reflection-of-classes)
  - [Getting Class Information](#getting-class-information)
  - [Getting Fields](#getting-fields)
  - [Getting Methods](#getting-methods)
  - [Getting Constructors](#getting-constructors)
- [Reflection of Methods](#reflection-of-methods)
  - [Getting Method Information](#getting-method-information)
  - [Invoking Methods](#invoking-methods)
- [Reflection of Fields](#reflection-of-fields)
  - [Getting Field Information](#getting-field-information)
  - [Setting Field Values](#setting-field-values)
  - [Accessing Private Fields](#accessing-private-fields)
- [Reflection of Constructors](#reflection-of-constructors)
  - [Getting Constructor Information](#getting-constructor-information)
  - [Creating Objects Using Reflection](#creating-objects-using-reflection)
  - [How Reflection Breaks Singleton](#how-reflection-breaks-singleton)
- [Advantages and Disadvantages](#advantages-and-disadvantages)
- [Summary](#summary)

---

## What is Reflection?

**Reflection** is a feature in Java that allows you to:
1. **Examine** classes, methods, fields, interfaces at **runtime**
2. **Change the behavior** of classes by modifying field values at runtime
3. **Access metadata** about classes when the program is running

**Key Capabilities:**
- Know what methods a class has
- Know what fields a class has
- Know what constructors a class has
- Know modifiers, return types, parameters
- **Invoke methods** dynamically
- **Change field values** (even private fields)
- **Create objects** using constructors (even private constructors)

**Example Use Cases:**
- Frameworks (Spring, Hibernate) use reflection
- IDEs use reflection for code completion
- Testing frameworks use reflection
- Serialization/Deserialization

**Important:** Reflection is used **very rarely** in day-to-day programming but is important for interviews and understanding how frameworks work.

---

## Class Class

### What is Class Class?

The `Class` class (note: the class name is `Class`) represents classes and interfaces at runtime.

**Key Points:**
- For each class loaded by JVM, there is **one Class object** created
- This Class object contains **metadata** about the class
- JVM creates this object automatically when class is loaded
- You don't create it manually - JVM does it

**Metadata Includes:**
- Methods in the class
- Fields in the class
- Constructors in the class
- Modifiers (public, private, etc.)
- Return types, parameters
- Interfaces implemented
- Parent class

### How to Get Class Object

There are **three ways** to get the Class object:

#### 1. Using `Class.forName()`

```java
Class<?> clazz = Class.forName("com.example.Eagle");
```

**Example:**
```java
try {
    Class<?> eagleClass = Class.forName("Eagle");
    System.out.println(eagleClass.getName());  // Prints: Eagle
} catch (ClassNotFoundException e) {
    e.printStackTrace();
}
```

#### 2. Using `.class`

```java
Class<?> clazz = Eagle.class;
```

**Example:**
```java
Class<?> eagleClass = Eagle.class;
System.out.println(eagleClass.getName());  // Prints: Eagle
```

#### 3. Using `.getClass()`

```java
Eagle eagle = new Eagle();
Class<?> clazz = eagle.getClass();
```

**Example:**
```java
Eagle eagle = new Eagle();
Class<?> eagleClass = eagle.getClass();
System.out.println(eagleClass.getName());  // Prints: Eagle
```

**All three return the same Class object** for a given class.

---

## Reflection of Classes

### Getting Class Information

Once you have the Class object, you can get various information about the class.

**Example Class:**
```java
public class Eagle {
    public String breed;
    private boolean canSwim;
    
    public void fly() {
        System.out.println("Eagle flies");
    }
    
    private void eat() {
        System.out.println("Eagle eats");
    }
}
```

**Getting Class Information:**
```java
Class<?> eagleClass = Eagle.class;

// Get class name
String className = eagleClass.getName();
System.out.println(className);  // Prints: Eagle

// Get modifiers
int modifiers = eagleClass.getModifiers();
System.out.println(Modifier.toString(modifiers));  // Prints: public

// Get package
Package pkg = eagleClass.getPackage();
System.out.println(pkg.getName());
```

### Getting Fields

**Get All Public Fields:**
```java
Class<?> eagleClass = Eagle.class;
Field[] fields = eagleClass.getFields();  // Only public fields

for (Field field : fields) {
    System.out.println("Field: " + field.getName());
    System.out.println("Type: " + field.getType());
    System.out.println("Modifier: " + Modifier.toString(field.getModifiers()));
}
// Output:
// Field: breed
// Type: class java.lang.String
// Modifier: public
```

**Get All Fields (Public + Private):**
```java
Field[] allFields = eagleClass.getDeclaredFields();  // All fields

for (Field field : allFields) {
    System.out.println("Field: " + field.getName());
    System.out.println("Type: " + field.getType());
    System.out.println("Modifier: " + Modifier.toString(field.getModifiers()));
}
// Output:
// Field: breed (public)
// Field: canSwim (private)
```

**Difference:**
- `getFields()` - Returns only **public** fields (including inherited)
- `getDeclaredFields()` - Returns **all** fields (public + private) of **this class only**

### Getting Methods

**Get All Public Methods:**
```java
Class<?> eagleClass = Eagle.class;
Method[] methods = eagleClass.getMethods();  // Only public methods

for (Method method : methods) {
    System.out.println("Method: " + method.getName());
    System.out.println("Return Type: " + method.getReturnType());
    System.out.println("Declaring Class: " + method.getDeclaringClass());
}
// Output includes: fly(), and all public methods from Object class
```

**Get All Methods (Public + Private):**
```java
Method[] allMethods = eagleClass.getDeclaredMethods();  // All methods

for (Method method : allMethods) {
    System.out.println("Method: " + method.getName());
    System.out.println("Return Type: " + method.getReturnType());
}
// Output: fly(), eat() (only methods in Eagle class)
```

**Difference:**
- `getMethods()` - Returns **public** methods (including inherited from Object)
- `getDeclaredMethods()` - Returns **all** methods (public + private) of **this class only**

### Getting Constructors

```java
Class<?> eagleClass = Eagle.class;
Constructor<?>[] constructors = eagleClass.getDeclaredConstructors();

for (Constructor<?> constructor : constructors) {
    System.out.println("Constructor: " + constructor.getName());
    System.out.println("Modifier: " + Modifier.toString(constructor.getModifiers()));
}
```

---

## Reflection of Methods

### Getting Method Information

**Example:**
```java
public class Eagle {
    public void fly(int height, boolean canFly, String name) {
        System.out.println("Eagle flies at height: " + height);
    }
}
```

**Getting Method Information:**
```java
Class<?> eagleClass = Eagle.class;

// Get specific method
try {
    Method flyMethod = eagleClass.getMethod("fly", int.class, boolean.class, String.class);
    
    System.out.println("Method Name: " + flyMethod.getName());
    System.out.println("Return Type: " + flyMethod.getReturnType());
    System.out.println("Parameters: " + Arrays.toString(flyMethod.getParameterTypes()));
    System.out.println("Modifiers: " + Modifier.toString(flyMethod.getModifiers()));
} catch (NoSuchMethodException e) {
    e.printStackTrace();
}
```

### Invoking Methods

You can **invoke methods** using reflection.

**Example:**
```java
public class Eagle {
    public void fly(int height, boolean canFly, String name) {
        System.out.println("Eagle " + name + " flies at height: " + height);
    }
}
```

**Invoking Method:**
```java
try {
    // Step 1: Get Class object
    Class<?> eagleClass = Class.forName("Eagle");
    
    // Step 2: Create object instance
    Object eagleObject = eagleClass.newInstance();  // Calls default constructor
    
    // Step 3: Get method
    Method flyMethod = eagleClass.getMethod("fly", int.class, boolean.class, String.class);
    
    // Step 4: Invoke method
    flyMethod.invoke(eagleObject, 100, true, "Golden Eagle");
    // Output: Eagle Golden Eagle flies at height: 100
    
} catch (Exception e) {
    e.printStackTrace();
}
```

**Key Points:**
- `newInstance()` - Creates object using default constructor
- `getMethod()` - Gets method by name and parameter types
- `invoke()` - Calls the method on the object with parameters

---

## Reflection of Fields

### Getting Field Information

```java
Class<?> eagleClass = Eagle.class;

// Get specific field
try {
    Field breedField = eagleClass.getDeclaredField("breed");
    
    System.out.println("Field Name: " + breedField.getName());
    System.out.println("Field Type: " + breedField.getType());
    System.out.println("Modifiers: " + Modifier.toString(breedField.getModifiers()));
} catch (NoSuchFieldException e) {
    e.printStackTrace();
}
```

### Setting Field Values

**Setting Public Field:**
```java
public class Eagle {
    public String breed;
}

// Setting value using reflection
try {
    Class<?> eagleClass = Eagle.class;
    
    // Get field
    Field breedField = eagleClass.getDeclaredField("breed");
    
    // Create object
    Eagle eagle = new Eagle();
    
    // Set value
    breedField.set(eagle, "Eagle Brown Breed");
    
    // Verify
    System.out.println(eagle.breed);  // Prints: Eagle Brown Breed
    
} catch (Exception e) {
    e.printStackTrace();
}
```

### Accessing Private Fields

**Problem:** Private fields cannot be accessed directly.

```java
public class Eagle {
    private boolean canSwim;
}

// This will throw IllegalAccessException
try {
    Class<?> eagleClass = Eagle.class;
    Field canSwimField = eagleClass.getDeclaredField("canSwim");
    
    Eagle eagle = new Eagle();
    canSwimField.set(eagle, true);  // ERROR: IllegalAccessException
    
} catch (Exception e) {
    e.printStackTrace();
}
```

**Solution:** Use `setAccessible(true)`

```java
try {
    Class<?> eagleClass = Eagle.class;
    Field canSwimField = eagleClass.getDeclaredField("canSwim");
    
    // Make it accessible
    canSwimField.setAccessible(true);  // IMPORTANT!
    
    Eagle eagle = new Eagle();
    canSwimField.set(eagle, true);  // Now works!
    
    // Get value
    boolean value = (boolean) canSwimField.get(eagle);
    System.out.println(value);  // Prints: true
    
} catch (Exception e) {
    e.printStackTrace();
}
```

**Important:**
- `setAccessible(true)` bypasses access control
- This **breaks encapsulation** - one of the disadvantages of reflection
- Private fields can be accessed and modified

---

## Reflection of Constructors

### Getting Constructor Information

```java
Class<?> eagleClass = Eagle.class;
Constructor<?>[] constructors = eagleClass.getDeclaredConstructors();

for (Constructor<?> constructor : constructors) {
    System.out.println("Constructor: " + constructor.getName());
    System.out.println("Modifiers: " + Modifier.toString(constructor.getModifiers()));
    System.out.println("Parameters: " + Arrays.toString(constructor.getParameterTypes()));
}
```

### Creating Objects Using Reflection

**Example Class:**
```java
public class Eagle {
    private Eagle() {  // Private constructor
        System.out.println("Eagle constructor called");
    }
    
    public void fly() {
        System.out.println("Eagle flies");
    }
}
```

**Creating Object Using Reflection:**
```java
try {
    // Step 1: Get Class object
    Class<?> eagleClass = Eagle.class;
    
    // Step 2: Get constructor
    Constructor<?> constructor = eagleClass.getDeclaredConstructor();
    
    // Step 3: Make it accessible (if private)
    constructor.setAccessible(true);
    
    // Step 4: Create object
    Object eagleObject = constructor.newInstance();
    
    // Step 5: Use object
    Method flyMethod = eagleClass.getMethod("fly");
    flyMethod.invoke(eagleObject);
    
} catch (Exception e) {
    e.printStackTrace();
}
```

### How Reflection Breaks Singleton

**Singleton Class:**
```java
public class DbConnection {
    private static DbConnection instance;
    
    private DbConnection() {  // Private constructor
        System.out.println("DbConnection created");
    }
    
    public static DbConnection getInstance() {
        if (instance == null) {
            instance = new DbConnection();
        }
        return instance;
    }
    
    public void connect() {
        System.out.println("Connected to database");
    }
}
```

**Breaking Singleton with Reflection:**
```java
try {
    // Normal way - works as expected
    DbConnection conn1 = DbConnection.getInstance();
    DbConnection conn2 = DbConnection.getInstance();
    System.out.println(conn1 == conn2);  // true (same instance)
    
    // Using reflection - breaks singleton!
    Class<?> dbClass = DbConnection.class;
    Constructor<?> constructor = dbClass.getDeclaredConstructor();
    constructor.setAccessible(true);  // Access private constructor
    
    DbConnection conn3 = (DbConnection) constructor.newInstance();
    DbConnection conn4 = (DbConnection) constructor.newInstance();
    
    System.out.println(conn1 == conn3);  // false (different instances!)
    System.out.println(conn3 == conn4);  // false (different instances!)
    
} catch (Exception e) {
    e.printStackTrace();
}
```

**How to Prevent:**
```java
public class DbConnection {
    private static DbConnection instance;
    
    private DbConnection() {
        // Prevent reflection from creating multiple instances
        if (instance != null) {
            throw new RuntimeException("Use getInstance() method");
        }
        System.out.println("DbConnection created");
    }
    
    public static DbConnection getInstance() {
        if (instance == null) {
            instance = new DbConnection();
        }
        return instance;
    }
}
```

---

## Advantages and Disadvantages

### Advantages

1. **Dynamic Behavior:** Can examine and modify behavior at runtime
2. **Framework Support:** Used by frameworks (Spring, Hibernate)
3. **IDE Features:** Code completion, debugging
4. **Testing:** Testing frameworks use reflection
5. **Flexibility:** Can work with classes not known at compile time

### Disadvantages

1. **Breaks Encapsulation:** Can access private fields and methods
2. **Performance:** Slower than direct access (runtime resolution)
3. **Security:** Can bypass access controls
4. **Complexity:** Makes code harder to understand
5. **No Compile-time Checks:** Errors only appear at runtime

**When to Use:**
- **Rarely** in day-to-day programming
- Frameworks and libraries
- Tools and utilities
- When you need dynamic behavior

**When NOT to Use:**
- Regular application code
- Performance-critical code
- When direct access is possible

---

## Summary

### What is Reflection?
- Feature to examine and modify classes, methods, fields at **runtime**
- Access **metadata** about classes
- Change behavior dynamically

### Class Object
- Represents class metadata at runtime
- JVM creates one Class object per class
- Three ways to get: `Class.forName()`, `.class`, `.getClass()`

### Reflection Capabilities
- **Examine:** Methods, fields, constructors, modifiers
- **Invoke:** Call methods dynamically
- **Modify:** Change field values (even private)
- **Create:** Create objects using constructors (even private)

### Key Methods
- `getFields()` / `getDeclaredFields()` - Get fields
- `getMethods()` / `getDeclaredMethods()` - Get methods
- `getConstructors()` / `getDeclaredConstructors()` - Get constructors
- `invoke()` - Call methods
- `set()` / `get()` - Set/get field values
- `setAccessible(true)` - Access private members
- `newInstance()` - Create objects

### Important Points
- Reflection **breaks encapsulation** (can access private members)
- Reflection is **slower** than direct access
- Reflection can **break singleton** pattern
- Use **sparingly** - only when necessary

---

## Practice Exercises

1. Use reflection to get all methods of a class and print their names and return types.

2. Use reflection to invoke a method with parameters.

3. Use reflection to set the value of a private field.

4. Use reflection to create an object using a private constructor.

5. Demonstrate how reflection can break singleton pattern.

6. Create a utility method that uses reflection to print all information about a class.

---

## Interview Questions

1. **What is reflection?**  
   A feature to examine and modify classes, methods, fields at runtime. Allows access to metadata and dynamic behavior.

2. **How to get Class object?**  
   Three ways: `Class.forName()`, `.class`, `.getClass()`.

3. **What is the difference between getFields() and getDeclaredFields()?**  
   `getFields()` returns only public fields (including inherited). `getDeclaredFields()` returns all fields (public + private) of the class only.

4. **Can reflection access private members?**  
   Yes, using `setAccessible(true)`, but this breaks encapsulation.

5. **How does reflection break singleton?**  
   By accessing private constructor using `setAccessible(true)` and creating new instances, bypassing the singleton pattern.

6. **What are the disadvantages of reflection?**  
   Breaks encapsulation, slower performance, security issues, complexity, no compile-time checks.

7. **When should you use reflection?**  
   Rarely in regular code. Used in frameworks, tools, when dynamic behavior is needed.

8. **How to invoke a method using reflection?**  
   Get Method object, then call `method.invoke(object, parameters)`.

9. **What is setAccessible()?**  
   Method to bypass access control, allowing access to private members.

10. **Is reflection fast?**  
    No, reflection is slower than direct access because it resolves everything at runtime.

