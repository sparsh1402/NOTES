# Java Methods

## Table of Contents
1. [Introduction to Methods](#introduction-to-methods)
2. [What is a Method?](#what-is-a-method)
3. [Method Declaration Syntax](#method-declaration-syntax)
4. [Access Specifiers](#access-specifiers)
5. [Return Types](#return-types)
6. [Method Naming Conventions](#method-naming-conventions)
7. [Parameters/Arguments](#parametersarguments)
8. [Types of Methods](#types-of-methods)
9. [Static Methods](#static-methods)
10. [Final Methods](#final-methods)
11. [Abstract Methods](#abstract-methods)
12. [Variable Arguments (Varargs)](#variable-arguments-varargs)

---

## Introduction to Methods

Methods are fundamental building blocks in Java programming. They allow you to organize code into reusable, logical units that perform specific tasks.

**Related Topics:**
- After methods: **Constructors**
- After constructors: **Memory Management**

**Topics Covered in Separate Videos:**
- Exception handling and `throws` keyword (covered in Exception Handling video)
- Detailed class types (covered in Classes video)

---

## What is a Method?

### Definition

A **method is a collection of instructions that perform a specific task**.

### Characteristics

1. **Takes Input:** Methods can accept parameters/arguments
2. **Performs Task:** Executes a series of instructions
3. **Returns Output:** Methods can return a value (or void)

### Example

```java
public class Calculation {
    public int sum(int variable1, int variable2) {
        // Instruction 1: Add the two values
        int total = variable1 + variable2;
        
        // Instruction 2: Logging (printing to console)
        System.out.println("Sum calculated");
        
        // Instruction 3: Return the result
        return total;
    }
}
```

### Advantages of Methods

#### 1. **Code Reusability**

Instead of writing the same code multiple times, you can create a method once and reuse it:

```java
public class Calculation {
    public int sum(int variable1, int variable2) {
        return variable1 + variable2;
    }
    
    public int getPriceOfPen() {
        int capPrice = 2;
        int penBodyPrice = 5;
        // Reusing the sum method
        return sum(capPrice, penBodyPrice);  // Returns 7
    }
    
    public int getCombinedAge() {
        int youngerSisterAge = 2;
        int olderSisterAge = 5;
        // Reusing the same sum method again
        return sum(youngerSisterAge, olderSisterAge);  // Returns 7
    }
}
```

**Benefits:**
- Write code once, use it multiple times
- Reduces code duplication
- Easier maintenance (change once, affects all usages)

#### 2. **Code Readability**

- Method names describe what the method does
- Makes code self-documenting
- Easier to understand the program flow

---

## Method Declaration Syntax

### Complete Syntax

```java
[access_specifier] [static] [final] [abstract] return_type method_name([parameter_list]) [throws exception_list] {
    // method body
}
```

### Components Breakdown

1. **Access Specifier** (optional but recommended)
2. **Static keyword** (optional)
3. **Final keyword** (optional)
4. **Abstract keyword** (optional)
5. **Return Type** (required)
6. **Method Name** (required)
7. **Parameter List** (optional)
8. **Throws Exception** (optional)
9. **Method Body** (required, except for abstract methods)

---

## Access Specifiers

Access specifiers control **where a method can be accessed from**. There are **4 types** of access specifiers in Java.

### Understanding Packages

Before understanding access specifiers, you need to understand **packages**:

**Package:** A collection of logically related or similar classes grouped together.

**Example:**
```java
package salesDepartment;

class Invoice { }
class Order { }
```

```java
package humanResource;

class JobPortal { }
class Application { }
```

### 1. Public

**Access Level:** Can be accessed from **any class in any package** (global access).

**Example:**
```java
package salesDepartment;

public class Invoice {
    public void getInvoice() {
        System.out.println("Invoice details");
    }
}
```

**Accessing from different package:**
```java
package humanResource;

class JobPortal {
    void getInvoiceForJob() {
        Invoice invoiceObject = new Invoice();
        invoiceObject.getInvoice();  // ✅ Can access - public method
    }
}
```

**Summary:** Public = Global access (anywhere)

### 2. Private

**Access Level:** Can be accessed **only by methods in the same class**.

**Example:**
```java
package salesDepartment;

public class Invoice {
    private void getInvoice() {
        System.out.println("Invoice details");
    }
    
    // ✅ Can access - same class
    public void printInvoice() {
        getInvoice();  // Works fine
    }
}
```

**Accessing from different class (same package):**
```java
package salesDepartment;

class Order {
    void someMethod() {
        Invoice invoiceObject = new Invoice();
        invoiceObject.getInvoice();  // ❌ Error - cannot access private method
    }
}
```

**Summary:** Private = Only within the same class

### 3. Protected

**Access Level:** 
- Can be accessed by **other classes in the same package**
- Can be accessed by **subclasses (child classes) in different packages**

**Example:**
```java
package salesDepartment;

public class Invoice {
    protected void getInvoice() {
        System.out.println("Invoice details");
    }
}
```

**Accessing from same package:**
```java
package salesDepartment;

class Order {
    void someMethod() {
        Invoice invoiceObject = new Invoice();
        invoiceObject.getInvoice();  // ✅ Can access - same package
    }
}
```

**Accessing from different package (child class):**
```java
package humanResource;

class JobPortal extends Invoice {  // Child class
    void someMethod() {
        getInvoice();  // ✅ Can access - child class in different package
    }
}
```

**Accessing from different package (non-child class):**
```java
package humanResource;

class Application {  // Not a child class
    void someMethod() {
        Invoice invoiceObject = new Invoice();
        invoiceObject.getInvoice();  // ❌ Error - not a child class
    }
}
```

**Summary:** Protected = Same package OR child classes (even in different packages)

### 4. Default (Package-Private)

**Access Level:** Can be accessed **only by classes in the same package**.

**Note:** When you don't specify any access specifier, Java uses **default** access.

**Example:**
```java
package salesDepartment;

public class Invoice {
    // No access specifier = default
    void getInvoice() {
        System.out.println("Invoice details");
    }
}
```

**Accessing from same package:**
```java
package salesDepartment;

class Order {
    void someMethod() {
        Invoice invoiceObject = new Invoice();
        invoiceObject.getInvoice();  // ✅ Can access - same package
    }
}
```

**Accessing from different package (even if child class):**
```java
package humanResource;

class JobPortal extends Invoice {  // Child class
    void someMethod() {
        getInvoice();  // ❌ Error - default access doesn't allow child classes in different packages
    }
}
```

**Summary:** Default = Only same package (not even child classes in different packages)

### Access Specifier Summary Table

| Access Specifier | Same Class | Same Package | Child Class (Different Package) | Different Package (Non-Child) |
|-----------------|------------|--------------|----------------------------------|-------------------------------|
| **Public**      | ✅         | ✅           | ✅                               | ✅                            |
| **Protected**   | ✅         | ✅           | ✅                               | ❌                            |
| **Default**     | ✅         | ✅           | ❌                               | ❌                            |
| **Private**     | ✅         | ❌           | ❌                               | ❌                            |

**Memory Aid:**
- **Public:** Global (anywhere)
- **Private:** Only same class
- **Protected:** Same package + child classes (different packages)
- **Default:** Only same package

---

## Return Types

### What is Return Type?

The **return type** tells what value the method will return after performing its computation.

### Types of Return Types

#### 1. Void (No Return)

When a method doesn't return anything, use `void`:

```java
public void printInvoice() {
    System.out.println("Invoice details");
    // No return statement needed
}
```

**Using return in void methods:**
```java
public void printInvoice() {
    System.out.println("Invoice details");
    return;  // ✅ Valid - just exits the method, doesn't return a value
    // OR you can omit return statement entirely
}
```

**Invalid:**
```java
public void printInvoice() {
    return 5;  // ❌ Error - void cannot return a value
}
```

#### 2. Primitive Types

Return any primitive type: `int`, `double`, `boolean`, `char`, etc.

```java
public int getSum(int a, int b) {
    return a + b;  // Returns int
}

public boolean isActive() {
    return true;  // Returns boolean
}

public double calculateAverage(double a, double b) {
    return (a + b) / 2.0;  // Returns double
}
```

#### 3. Reference Types

Return objects, arrays, or any reference type:

```java
public String getName() {
    return "John Doe";  // Returns String
}

public int[] getNumbers() {
    return new int[]{1, 2, 3};  // Returns array
}

public Employee getEmployee() {
    return new Employee();  // Returns object
}
```

---

## Method Naming Conventions

### Rules for Method Names

1. **Should be a Verb (Action)**
   - Methods perform actions, so names should reflect actions
   - Examples: `getData()`, `printInvoice()`, `calculateSum()`, `setAge()`

2. **Start with Lowercase Letter**
   ```java
   // ✅ Correct
   public void getEmployeeDetails() { }
   
   // ❌ Wrong
   public void GetEmployeeDetails() { }  // Starts with capital
   ```

3. **Use CamelCase for Multiple Words**
   - Start with lowercase
   - Capitalize first letter of subsequent words
   - Examples:
     ```java
     getEmployeeDetails()  // ✅ Correct
     getemployeedetails()  // ❌ Wrong - all lowercase
     GetEmployeeDetails()  // ❌ Wrong - starts with capital
     ```

### Good Method Name Examples

```java
public int calculateTotal() { }
public void printReport() { }
public boolean isValid() { }
public String getName() { }
public void setAge(int age) { }
```

---

## Parameters/Arguments

### What are Parameters?

**Parameters** (also called **arguments**) are variables that a method accepts to perform its task. They form the **parameter list**.

### Example

```java
public class Calculation {
    public int sum(int variable1, int variable2) {
        // variable1 and variable2 are parameters
        return variable1 + variable2;
    }
}
```

### Characteristics

1. **List of Variables:** Parameters are variables used by the method
2. **Can be Multiple:** Methods can have multiple parameters
3. **Can be Empty:** Methods can have no parameters

**Example with multiple parameters:**
```java
public void printDetails(String name, int age, double salary) {
    System.out.println("Name: " + name);
    System.out.println("Age: " + age);
    System.out.println("Salary: " + salary);
}
```

**Example with no parameters:**
```java
public void printInvoice() {
    // No parameters needed
    System.out.println("Invoice details");
}
```

### Parameter Types

Parameters can be of any data type:
- Primitive types: `int`, `double`, `boolean`, etc.
- Reference types: `String`, objects, arrays, etc.

```java
public void processData(int number, String text, Employee emp, int[] numbers) {
    // Multiple parameter types
}
```

---

## Types of Methods

### 1. System Defined Methods

**Definition:** Methods that are **already defined and ready to use** in Java libraries.

**Example:**
```java
int variable = 25;
double result = Math.sqrt(variable);  // System defined method from java.lang.Math
```

**Key Points:**
- Provided by Java libraries (JDK/JRE)
- No need to write them yourself
- Examples: `System.out.println()`, `Math.sqrt()`, `String.length()`

**Question:** Which part (JDK, JRE, or JVM) provides these libraries?
- **Answer:** JDK (Java Development Kit) provides the libraries

### 2. User Defined Methods

**Definition:** Methods that **programmers create** based on program requirements.

**Example:**
```java
public class Calculation {
    // User defined method
    public int sum(int a, int b) {
        return a + b;
    }
}
```

**Key Points:**
- Created by the programmer
- Custom logic based on requirements
- Reusable within the program

### 3. Overloaded Methods

**Definition:** **More than one method with the same name** created in the **same class**, but with **different parameters**.

**Key Rules:**
1. **Same method name**
2. **Different parameters** (number, type, or order)
3. **Return type is NOT considered** for overloading

**Example:**
```java
public class Invoice {
    // Method 1: No parameters
    public void getInvoice() {
        System.out.println("Default invoice");
    }
    
    // Method 2: One parameter (String)
    public void getInvoice(String name) {
        System.out.println("Invoice for: " + name);
    }
    
    // Method 3: Two parameters (int, int)
    public void getInvoice(int a, int b) {
        System.out.println("Invoice calculation: " + (a + b));
    }
}
```

**Invalid Overloading (Same Parameters):**
```java
public class Invoice {
    public void getInvoice() { }
    
    // ❌ Error - same name, same parameters (even though return type is different)
    public int getInvoice() {
        return 10;
    }
}
```

**Why Invalid?**
- Overloaded methods are differentiated **only by parameters**
- Return type is **NOT considered** for overloading
- Java compiler cannot determine which method to call based on return type alone

**Valid Overloading (Different Parameters):**
```java
public class Invoice {
    public void getInvoice() { }
    
    // ✅ Valid - different parameters
    public int getInvoice(String z) {
        return 10;
    }
}
```

**Invoking Overloaded Methods:**
```java
Invoice invoiceObject = new Invoice();

invoiceObject.getInvoice();              // Calls method with no parameters
invoiceObject.getInvoice("Hello");      // Calls method with String parameter
invoiceObject.getInvoice(4, 8);          // Calls method with two int parameters
```

**Key Points:**
- Overloading is **compile-time binding** (static binding)
- Method selection is based on **arguments passed**
- Part of **polymorphism** (compile-time polymorphism)

### 4. Overridden Methods

**Definition:** When a **subclass (child class) has the same method** as the **parent class** with the **same signature** (name, parameters, return type, access specifier).

**Example:**
```java
// Parent class
class Person {
    public String profession() {
        return "I am a person class";
    }
}

// Child class
class Doctor extends Person {
    @Override  // Annotation (optional but recommended)
    public String profession() {
        return "I am a doctor class";
    }
}
```

**Key Points:**
1. **Same method signature:** Name, parameters, return type, access specifier all must match
2. **Different implementation:** Child class provides different implementation
3. **Runtime binding:** Overriding uses **dynamic binding** (runtime polymorphism)

**Invoking Overridden Methods:**
```java
// Parent reference, child object
Person object = new Doctor();
object.profession();  // Calls Doctor's profession() method (dynamic binding)
```

**How Dynamic Binding Works:**
1. At **runtime**, Java checks the **actual object type**
2. If child class has the method, it calls the child's version
3. If child class doesn't have the method, it calls the parent's version

**Example:**
```java
Person object = new Doctor();
object.profession();  
// Runtime checks: Is object actually a Doctor? Yes.
// Runtime checks: Does Doctor have profession()? Yes.
// Result: Calls Doctor.profession() → "I am a doctor class"
```

**Key Differences: Overloading vs Overriding**

| Aspect | Overloading | Overriding |
|--------|-------------|------------|
| **Location** | Same class | Parent and child classes |
| **Method Signature** | Different parameters | Same signature |
| **Return Type** | Can be different | Must be same |
| **Binding** | Compile-time (static) | Runtime (dynamic) |
| **Purpose** | Same method, different parameters | Same method, different implementation |

---

## Static Methods

### What is a Static Method?

A **static method** is a method that is **associated with the class**, not with individual objects.

### Key Characteristics

1. **Associated with Class:** Not with objects
2. **Common for All Objects:** Only one copy exists, shared by all objects
3. **Called with Class Name:** No object needed to call static methods

### Example

```java
class A {
    // Non-static method
    public void methodOne() {
        System.out.println("Method One");
    }
    
    // Static method
    public static void methodTwo() {
        System.out.println("Method Two");
    }
}
```

**Creating Objects:**
```java
A object1 = new A();
A object2 = new A();
```

**Accessing Methods:**
```java
// Non-static method - requires object
object1.methodOne();  // ✅ Correct
object2.methodOne();  // ✅ Correct

// Static method - use class name
A.methodTwo();  // ✅ Correct - no object needed
// object1.methodTwo();  // Works but not recommended
```

### Important Rules for Static Methods

#### Rule 1: Cannot Access Non-Static Instance Variables

**Why?**
- Static methods are associated with the **class**
- Non-static variables are associated with **individual objects**
- Static method doesn't know which object's variable to access

**Example:**
```java
class Calculation {
    int stockPrice = 20;        // Non-static (instance variable)
    static int carPrice = 40;   // Static (class variable)
    
    public static void getPriceOfPen() {
        // ✅ Can access static variable
        carPrice = 50;  // Works fine
        
        // ❌ Cannot access non-static variable
        stockPrice = 30;  // Error: Cannot make a static reference to non-static field
    }
}
```

**Explanation:**
- `stockPrice` exists in each object (object1 has its own, object2 has its own)
- Static method doesn't know which object's `stockPrice` to access
- `carPrice` is static (only one copy, associated with class), so it can be accessed

#### Rule 2: Cannot Access Non-Static Methods

**Why?**
- Non-static methods belong to **objects**
- Static method doesn't know which object's method to call

**Example:**
```java
class Calculation {
    // Non-static method
    public void print() {
        System.out.println("Printing");
    }
    
    public static void getPriceOfPen() {
        // ❌ Error - cannot access non-static method
        print();  // Error: Cannot make a static reference to non-static method
        
        // ✅ Solution: Need to specify which object
        Calculation obj = new Calculation();
        obj.print();  // Now it works
    }
}
```

**Why it works with object reference:**
- Now the static method knows which object's `print()` method to call

#### Rule 3: Static Methods Cannot Be Overridden

**Why?**
- Overriding uses **dynamic binding** (runtime) based on object type
- Static methods use **compile-time binding** (linked to class at compile time)
- No object is involved in calling static methods

**Example:**
```java
class Person {
    public static String profession() {
        return "I am a person class";
    }
}

class Doctor extends Person {
    // This is NOT overriding - it's method hiding
    public static String profession() {
        return "I am a doctor class";
    }
}
```

**Calling Static Methods:**
```java
Person.profession();  // Calls Person's version
Doctor.profession();  // Calls Doctor's version
```

**Key Point:** This is **method hiding**, not overriding. The method is linked to the class at compile time, not determined at runtime based on object type.

### When to Declare a Method Static?

**Guidelines:**

1. **Method does NOT modify object state**
2. **Method does NOT use instance variables**
3. **Method only performs computation using arguments**

**Good Example (Should be Static):**
```java
public static int sum(int a, int b) {
    int total = a + b;
    return total;
}
```

**Why static?**
- ✅ Doesn't use instance variables
- ✅ Doesn't modify object state
- ✅ Only computes using arguments
- ✅ Can be used by any object without affecting object state

**Bad Example (Should NOT be Static):**
```java
class Calculation {
    static int carPrice = 40;
    int stockPrice = 20;
    
    // ❌ Should NOT be static
    public static int sumTwo(int a, int b) {
        carPrice = carPrice + (a + b);  // Modifies static variable
        return carPrice;
    }
}
```

**Why NOT static?**
- ❌ Modifies state (changes `carPrice`)
- ❌ Uses instance variable (would use `stockPrice` if needed)
- ❌ Shared state can cause issues in multi-threaded environments

**Real-World Example: Factory Design Pattern**
- Factory methods are often static because they create objects based on arguments
- They don't depend on instance variables
- They don't modify object state

**Summary:**
- **Make static:** Methods that only compute using arguments, don't use instance variables, don't modify state
- **Don't make static:** Methods that use instance variables or modify object state

---

## Final Methods

### What is a Final Method?

A **final method** is a method that **cannot be overridden** by child classes.

### Purpose

When you don't want child classes to change the implementation of a parent class method, make it `final`.

### Example

```java
class Person {
    // Final method - cannot be overridden
    public final String profession() {
        return "I am a person class";
    }
}

class Doctor extends Person {
    // ❌ Error: Cannot override final method
    public String profession() {
        return "I am a doctor class";
    }
}
```

### Key Points

1. **Cannot be overridden:** Child classes cannot change the implementation
2. **Same implementation:** All child classes must use the parent's implementation
3. **No need to override:** If you can't change it, why override? Just use the parent's version

**When to use:**
- When the method implementation should remain constant across all subclasses
- When you want to prevent accidental overriding
- When the method is critical and shouldn't be modified

---

## Abstract Methods

### What is an Abstract Method?

An **abstract method** is a method that has **only declaration, no implementation**. The implementation is provided by child classes.

### Key Rules

1. **Must be in Abstract Class:** Abstract methods can only be defined in abstract classes
2. **Only Declaration:** No method body (no `{ }`)
3. **Implementation in Child:** Child classes must provide the implementation

### Example

```java
// Abstract class
abstract class Person {
    // Abstract method - only declaration
    public abstract void print();
}

// Child class must implement
class Doctor extends Person {
    // ✅ Must provide implementation
    @Override
    public void print() {
        System.out.println("I am a doctor");
    }
}
```

### Syntax

```java
abstract class ClassName {
    // Abstract method
    public abstract returnType methodName(parameters);
    // Note: No method body { }
}
```

### Key Points

1. **Abstract keyword required:** Method must be declared with `abstract`
2. **No body:** Cannot have implementation in abstract class
3. **Child responsibility:** Child classes must implement all abstract methods
4. **Cannot be instantiated:** Abstract classes cannot create objects directly

**Note:** Detailed coverage of abstract classes will be in the Classes video.

---

## Variable Arguments (Varargs)

### What are Variable Arguments?

**Variable arguments (varargs)** allow a method to accept a **variable number of arguments** of the same type.

### Problem Without Varargs

Without varargs, you would need to create multiple overloaded methods:

```java
// ❌ Bad approach - too many overloaded methods
public int sum(int a) { return a; }
public int sum(int a, int b) { return a + b; }
public int sum(int a, int b, int c) { return a + b + c; }
public int sum(int a, int b, int c, int d) { return a + b + c + d; }
// ... and so on
```

### Solution: Varargs

**Syntax:** Use three dots (`...`) after the data type

```java
public int sum(int... variables) {
    int output = 0;
    for (int variable : variables) {
        output = output + variable;
    }
    return output;
}
```

### How It Works

- The three dots (`...`) treat the parameters as an **array**
- You can iterate over them using a loop
- Can accept **zero or more** arguments

### Invoking Varargs Methods

```java
Calculation calc = new Calculation();

calc.sum();           // ✅ Valid - zero arguments
calc.sum(3);          // ✅ Valid - one argument
calc.sum(3, 8);       // ✅ Valid - two arguments
calc.sum(3, 8, 9, 10); // ✅ Valid - four arguments
calc.sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10); // ✅ Valid - many arguments
```

### Rules for Varargs

#### Rule 1: Only One Varargs Parameter

**Invalid:**
```java
// ❌ Error - cannot have two varargs
public void method(int... a, String... b) { }
```

**Valid:**
```java
// ✅ Correct - only one varargs
public void method(int... a) { }
```

#### Rule 2: Varargs Must Be Last Parameter

**Invalid:**
```java
// ❌ Error - varargs must be last
public void method(int... a, int b) { }
```

**Valid:**
```java
// ✅ Correct - varargs is last
public void method(int a, int... b) { }
```

**Why must it be last?**
- If varargs is first, Java doesn't know where to stop assigning values
- With varargs last, all initial parameters are assigned first, then remaining values go to varargs

**Example:**
```java
public void method(int a, int... b) {
    // a gets the first value
    // b gets all remaining values
}

method(1, 2, 3, 4, 5);
// a = 1
// b = [2, 3, 4, 5]
```

### Complete Example

```java
public class Calculation {
    public int sum(int... variables) {
        int output = 0;
        for (int variable : variables) {
            output = output + variable;
        }
        return output;
    }
}

// Usage
Calculation calc = new Calculation();
int result1 = calc.sum(2, 3, 4);      // Returns 9
int result2 = calc.sum(1, 5, 7, 9);   // Returns 22
int result3 = calc.sum();             // Returns 0
```

---

## Summary

### Key Takeaways

1. **Methods** are collections of instructions that perform specific tasks
2. **Access Specifiers** control where methods can be accessed:
   - **Public:** Global access
   - **Private:** Same class only
   - **Protected:** Same package + child classes
   - **Default:** Same package only
3. **Return Types** specify what the method returns (void, primitive, or reference type)
4. **Method Naming:** Start with lowercase, use camelCase, use verbs
5. **Types of Methods:**
   - System defined (library methods)
   - User defined (programmer created)
   - Overloaded (same name, different parameters)
   - Overridden (same signature in parent and child)
   - Static (associated with class)
   - Final (cannot be overridden)
   - Abstract (declaration only, implementation in child)
6. **Static Methods:**
   - Associated with class, not objects
   - Cannot access non-static variables/methods
   - Cannot be overridden (but can be hidden)
   - Use when method doesn't use instance variables or modify state
7. **Varargs:** Allow variable number of arguments using `...` syntax

### Important Interview Points

- Difference between overloading and overriding
- Static vs non-static methods
- Why static methods cannot access instance variables
- When to use static methods
- Access specifier visibility rules
- Varargs rules and usage

---

## Related Topics

- **Constructors** - Special methods for object initialization
- **Memory Management** - How methods and objects are stored in memory
- **Exception Handling** - How methods handle errors (throws keyword)
- **Classes** - Different types of classes (abstract, inner, nested, etc.)

