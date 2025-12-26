# Java Variables

## Table of Contents
1. [Introduction to Variables](#introduction-to-variables)
2. [Java as Static and Strong Typed Language](#java-as-static-and-strong-typed-language)
3. [Variable Naming Conventions](#variable-naming-conventions)
4. [Types of Variables](#types-of-variables)
5. [Primitive Data Types](#primitive-data-types)
6. [Type Conversions](#type-conversions)
7. [Kinds of Variables](#kinds-of-variables)
8. [Reference Data Types](#reference-data-types)
9. [Wrapper Classes](#wrapper-classes)
10. [Constant Variables](#constant-variables)

---

## Introduction to Variables

### What is a Variable?

A **variable is a container which holds a value**.

- Similar to how a container holds water, a variable in Java holds a value
- Variables are used to store data that can be used and manipulated in a program

### Variable Declaration Syntax

```java
data_type variable_name = value;
```

**Example:**
```java
int age = 32;
```

- `int` is the data type (integer)
- `age` is the variable name
- `32` is the value stored in the variable

---

## Java as Static and Strong Typed Language

### Static Typed Language

**Java is a static typed language.**

**What does this mean?**
- Every variable must have a **data type** defined at the time of declaration
- The data type tells what kind of data the variable can store
- Example: `int age` tells that `age` can store integer numbers (1, 2, 3, 4567, etc.)

**Key Point:** In Java, you must explicitly define the data type for every variable.

### Strong Typed Language

**Java is also a strong typed language.**

**What does this mean?**
- Each data type has a **specific range** of values it can store
- You cannot assign values outside the allowed range for a data type
- For example, you cannot assign a very large number like 1234567890123456 to an `int` variable

**Key Point:** Java enforces strict restrictions on what values can be assigned to each data type.

---

## Variable Naming Conventions

### Rules for Variable Names

1. **Case Sensitive**
   - `age` and `Age` are different variables
   - `int a` is different from `int A`

2. **Legal Identifiers**
   - Can contain Unicode letters and digits
   - Unicode supports characters from all languages (not just English)
   - Can contain: letters (a-z, A-Z), digits (0-9), dollar sign ($), underscore (_)

3. **Starting Characters**
   - Variable name can start with:
     - Letter (a-z, A-Z)
     - Dollar sign ($)
     - Underscore (_)
   - **Cannot start with a digit**
   - Examples:
     ```java
     int _age;      // ✅ Valid
     int $age;      // ✅ Valid
     int age;       // ✅ Valid
     int 9age;      // ❌ Invalid - cannot start with digit
     ```

4. **Reserved Words**
   - Cannot use Java reserved words (keywords) as variable names
   - Examples of reserved words: `new`, `class`, `for`, `while`, `int`, `float`, `char`, etc.
   - Example:
     ```java
     int int;      // ❌ Invalid - 'int' is a reserved word
     int integer;   // ✅ Valid
     ```

5. **Naming Style**
   - **Single word:** Use all lowercase
     ```java
     int jaipur = 2;
     ```
   - **Multiple words:** Use camelCase (start with lowercase, capitalize first letter of subsequent words)
     ```java
     int jaipurCity = 2;
     ```

6. **Constant Variables**
   - Constant variables should be in **ALL CAPITAL LETTERS**
   - Example:
     ```java
     static final int JAIPUR = 10;
     ```
   - (More details on constants in [Constant Variables](#constant-variables) section)

---

## Types of Variables

In Java, there are two main types of variables:

1. **Primitive Type** (8 types)
2. **Non-Primitive Type** (also called Reference Type)

---

## Primitive Data Types

Java has **8 primitive data types**:

1. `char` - Character
2. `byte` - Byte
3. `short` - Short integer
4. `int` - Integer
5. `long` - Long integer
6. `float` - Floating point
7. `double` - Double precision floating point
8. `boolean` - Boolean

### 1. Character (char)

- **Size:** 2 bytes (16 bits)
- **Range:** 0 to 65,535
- **Purpose:** Represents a single character (ASCII value representation)
- **Default Value:** `\u0000` (null character)

**Example:**
```java
char ch = 'a';        // Prints: a
char ch2 = 65;        // Prints: A (ASCII value 65 = 'A')
char ch3 = 97;        // Prints: a (ASCII value 97 = 'a')
```

**Key Points:**
- Can store integer values (0-65535), which represent characters
- Each number corresponds to a character in the ASCII/Unicode table

### 2. Byte

- **Size:** 1 byte (8 bits)
- **Type:** Signed two's complement
- **Range:** -128 to 127
- **Default Value:** 0
- **Purpose:** Stores small integer values

**Understanding Signed Two's Complement:**

Byte uses 8 bits. Since it's **signed**:
- The leftmost bit (MSB) represents the sign
  - `0` = positive
  - `1` = negative
- Uses two's complement representation for negative numbers

**How range is calculated:**
- 8 bits can represent 2^8 = 256 values
- Since it's signed, range is divided: -128 to 127
- Total: 128 negative + 128 positive = 256 values

**Example:**
```java
byte b = 10;
byte b2 = -50;
// byte b3 = 128;  // ❌ Error - exceeds range
```

**Default Value Example:**
```java
class Employee {
    byte age;  // Default value is 0 (only for class member variables)
    
    void dummy() {
        System.out.println(age);  // Prints: 0
    }
}
```

**Important:** Default values are **only assigned to class member variables**, not to local variables.

### 3. Short

- **Size:** 2 bytes (16 bits)
- **Type:** Signed two's complement
- **Range:** -32,768 to 32,767
- **Default Value:** 0
- **Purpose:** Stores medium-sized integer values

**Example:**
```java
short s = 200;
```

### 4. Integer (int)

- **Size:** 4 bytes (32 bits)
- **Type:** Signed two's complement
- **Range:** -2^31 to 2^31 - 1 (approximately -2.1 billion to 2.1 billion)
- **Default Value:** 0
- **Purpose:** Most commonly used integer type

**Example:**
```java
int age = 100;
int count = -50;
```

### 5. Long

- **Size:** 8 bytes (64 bits)
- **Type:** Signed two's complement
- **Range:** -2^63 to 2^63 - 1
- **Default Value:** 0
- **Purpose:** Stores very large integer values

**Example:**
```java
long l1 = 500;
long l2 = 100L;  // 'L' suffix indicates long literal
```

**Key Point:** Use `L` suffix to explicitly indicate a long literal.

### 6. Float

- **Size:** 4 bytes (32 bits)
- **Format:** IEEE 754 standard
- **Purpose:** Stores fractional/decimal numbers
- **Default Value:** 0.0f
- **Precision:** Single precision (approximately 7 decimal digits)

**Example:**
```java
float f1 = 63.20f;  // 'f' suffix is required
float f2 = 0.3f;
```

**⚠️ Important Warning:**
- **Never use float/double for currency or precise decimal calculations**
- Float and double can have precision issues
- Example:
  ```java
  float var1 = 0.3f;
  float var2 = 0.1f;
  float var3 = var1 - var2;
  System.out.println(var3);  // Output: 0.20000002 (not exactly 0.2!)
  ```
- **Solution:** Use `BigDecimal` for precise decimal calculations

**Memory Representation (IEEE 754):**
- **1 bit:** Sign (0 = positive, 1 = negative)
- **8 bits:** Exponent (with bias of 127)
- **23 bits:** Mantissa (significant digits)

*(See detailed explanation in [Float and Double Memory Representation](#float-and-double-memory-representation) section)*

### 7. Double

- **Size:** 8 bytes (64 bits)
- **Format:** IEEE 754 standard
- **Purpose:** Stores fractional/decimal numbers with higher precision
- **Default Value:** 0.0d
- **Precision:** Double precision (approximately 15-17 decimal digits)

**Example:**
```java
double d1 = 63.20;
double d2 = 0.3d;  // 'd' suffix is optional
```

**Memory Representation (IEEE 754):**
- **1 bit:** Sign
- **11 bits:** Exponent (with bias of 1023)
- **52 bits:** Mantissa

**⚠️ Same Warning:** Do not use for currency or precise calculations. Use `BigDecimal`.

### 8. Boolean

- **Size:** Conceptually 1 bit (implementation dependent)
- **Values:** Only `true` or `false`
- **Default Value:** `false`
- **Purpose:** Represents logical values

**Example:**
```java
boolean isActive = true;
boolean isComplete = false;
```

---

## Float and Double Memory Representation

### IEEE 754 Format

Float and double use the **IEEE 754 standard** for storing floating-point numbers in memory.

### Float (32-bit) Format

```
[Sign: 1 bit] [Exponent: 8 bits] [Mantissa: 23 bits]
```

**Example: Storing 4.125**

**Step 1: Convert to Binary**
- Integer part (4): `100`
- Fractional part (0.125): `0.001`
- Combined: `100.001`

**Step 2: Normalize to Scientific Notation**
- Move decimal point: `1.00001 × 2^2`
- Mantissa: `00001` (after the decimal point)
- Exponent: `2`

**Step 3: Add Bias to Exponent**
- Float bias: 127
- Stored exponent: 2 + 127 = 129

**Step 4: Store in Memory**
- Sign bit: `0` (positive)
- Exponent (8 bits): `10000001` (129 in binary)
- Mantissa (23 bits): `00001000000000000000000`

**Retrieving the Value:**
```
Value = (-1)^sign × (1 + mantissa) × 2^(exponent - 127)
```

### Why 0.7 Becomes 0.6999999...

**Problem:** Some decimal numbers cannot be exactly represented in binary.

**Example: 0.7**

1. **Convert 0.7 to binary:**
   - 0.7 × 2 = 1.4 → take 1, remainder 0.4
   - 0.4 × 2 = 0.8 → take 0, remainder 0.8
   - 0.8 × 2 = 1.6 → take 1, remainder 0.6
   - 0.6 × 2 = 1.2 → take 1, remainder 0.2
   - 0.2 × 2 = 0.4 → take 0, remainder 0.4 (repeats!)
   - Result: `0.1011001100110011...` (repeating pattern)

2. **Normalize:** `1.011001100110011... × 2^-1`

3. **Store in 23-bit mantissa:** The repeating pattern gets truncated, causing precision loss

4. **When retrieved:** The value becomes approximately 0.6999999... instead of exactly 0.7

**Solution:** Use `BigDecimal` for exact decimal representation.

### Double (64-bit) Format

```
[Sign: 1 bit] [Exponent: 11 bits] [Mantissa: 52 bits]
```

- Bias for double: 1023 (2^10 - 1)
- Same principles as float, but with more precision

---

## Type Conversions

### 1. Automatic Conversion (Widening)

**Also called:** Automatic conversion or widening

**When it happens:**
- Converting from a **lower data type to a higher data type**
- Lower → Higher: `byte` → `short` → `int` → `long` → `float` → `double`

**Example:**
```java
byte x = 10;
int intVar = x;  // ✅ Automatic conversion - no error
System.out.println(intVar);  // Prints: 10
```

**Why it works:**
- A higher data type can accommodate all values of a lower data type
- No data loss occurs

**Example with int to long:**
```java
int age = 10;
long longAge = age;  // ✅ Automatic conversion
```

### 2. Explicit Casting (Narrowing/Downcasting)

**Also called:** Explicit casting, narrowing, or downcasting

**When it happens:**
- Converting from a **higher data type to a lower data type**
- Requires explicit type casting using `(type)`

**Example:**
```java
int intVar = 10;
byte byteVar = (byte) intVar;  // ✅ Explicit casting required
System.out.println(byteVar);  // Prints: 10
```

**⚠️ Important Warning:**
- If the value exceeds the target type's range, unexpected results occur
- Example:
  ```java
  int intVar = 128;  // Exceeds byte range (-128 to 127)
  byte byteVar = (byte) intVar;
  System.out.println(byteVar);  // Prints: -128 (not 128!)
  ```
- **Why?** After 127, it wraps around to -128 (due to two's complement representation)

### 3. Promotion During Expression

**What is promotion?**
- When performing arithmetic operations, smaller data types are automatically promoted to larger types

**Example 1: Byte Overflow**
```java
byte a = 127;
byte b = 1;
byte sum = a + b;  // ❌ Compilation error!
```

**Why error?**
- During expression evaluation, `byte` values are promoted to `int`
- `127 + 1 = 128` (exceeds byte range)
- Result is `int`, cannot assign to `byte` without casting

**Solutions:**
```java
// Solution 1: Use int
int sum = a + b;  // ✅ Prints: 128

// Solution 2: Explicit cast (but beware of wrapping)
byte sum = (byte)(a + b);  // ✅ Prints: -128 (wraps around)
```

**Example 2: Mixed Data Types in Expression**
```java
int a = 34;
double d = 20.0;
int sum = a + d;  // ❌ Error - expression promoted to double
```

**Why error?**
- When an expression contains different data types, the **entire expression is promoted to the highest data type**
- `int + double` → entire expression becomes `double`
- Cannot assign `double` to `int` without casting

**Solutions:**
```java
// Solution 1: Use double
double sum = a + d;  // ✅ Prints: 54.0

// Solution 2: Explicit cast
int sum = (int)(a + d);  // ✅ Prints: 54 (truncates decimal)
```

**Key Rules:**
1. In expressions, `byte` and `short` are promoted to `int`
2. If expression contains different types, entire expression is promoted to the highest type
3. Result type must match the variable type, or explicit casting is required

---

## Kinds of Variables

Based on **where** and **how** variables are declared, there are different kinds:

### 1. Member Variable (Instance Variable)

**Definition:** Variables declared inside a class but outside any method

**Characteristics:**
- Each object has its **own copy** of member variables
- Default values are automatically assigned (0 for numbers, false for boolean, null for objects)
- Accessible throughout the class

**Example:**
```java
class Employee {
    int employeeId;  // Member variable
    
    void display() {
        System.out.println(employeeId);  // Uses member variable
    }
}
```

**Usage:**
```java
Employee obj1 = new Employee();
Employee obj2 = new Employee();

obj1.employeeId = 10;  // obj1 has its own copy
obj2.employeeId = 20;  // obj2 has its own copy (independent)
```

### 2. Local Variable

**Definition:** Variables declared inside a method

**Characteristics:**
- **Scope is limited to the method** where it's declared
- Created when method is called, destroyed when method ends
- **No default value** - must be initialized before use
- Cannot be accessed outside the method

**Example:**
```java
class Employee {
    void dummy() {
        byte localVar = 100;  // Local variable
        System.out.println(localVar);
    }
    // localVar is not accessible here
}
```

**Important:** Local variables must be initialized before use:
```java
void method() {
    int x;  // ❌ Error if used without initialization
    // int x = 10;  // ✅ Must initialize
    System.out.println(x);
}
```

### 3. Static Variable (Class Variable)

**Definition:** Variables declared with `static` keyword

**Characteristics:**
- **Only one copy exists** for the entire class (not per object)
- Shared by all objects of the class
- Belongs to the class, not to individual objects
- Accessed using **class name**, not object name
- Default values are automatically assigned

**Example:**
```java
class Employee {
    static int companyId = 100;  // Static variable
}
```

**Usage:**
```java
Employee obj1 = new Employee();
Employee obj2 = new Employee();

// Access via class name (recommended)
System.out.println(Employee.companyId);  // ✅ Correct

// Both objects share the same static variable
// If changed, affects all objects
```

**Key Points:**
- Static variables are associated with the **class**, not objects
- No matter how many objects you create, only one copy of static variable exists
- Changes to static variable are visible to all objects

### 4. Method Parameter

**Definition:** Variables declared in method signature (parameters)

**Characteristics:**
- Receives values from the caller
- Scope is limited to the method
- Acts as local variable within the method

**Example:**
```java
class Employee {
    int dummyMethod2(int a, int b) {  // a and b are method parameters
        return a + b;
    }
}
```

**Usage:**
```java
Employee obj = new Employee();
int result = obj.dummyMethod2(2, 5);  // a=2, b=5
```

### 5. Constructor Parameter

**Definition:** Variables declared in constructor signature

**Characteristics:**
- Used to initialize object state when object is created
- Similar to method parameters but used in constructors

**Example:**
```java
class Employee {
    int employeeId;
    
    // Default constructor (no parameters)
    Employee() {
        // Default constructor
    }
    
    // Parameterized constructor
    Employee(int id) {  // id is constructor parameter
        this.employeeId = id;
    }
}
```

**Usage:**
```java
Employee obj1 = new Employee();        // Calls default constructor
Employee obj2 = new Employee(10);      // Calls parameterized constructor
```

---

## Reference Data Types

**Also called:** Non-primitive data types

### What is a Reference?

A **reference** is a variable that holds the **address (reference) to an object** in memory, not the actual object itself.

**Key Concepts:**
- Objects are stored in **heap memory**
- Reference variables hold the **address** of the object
- Multiple references can point to the same object
- Java does **not** have pointers (like C/C++), but uses references

### Types of Reference Data Types

1. **Class**
2. **String**
3. **Interface**
4. **Array**

### 1. Class (User-Defined)

**How it works:**
- When you create an object using `new`, memory is allocated in **heap**
- The variable holds a **reference** to that memory location

**Example:**
```java
class Employee {
    int employeeId;
    
    void setEmployeeId(int id) {
        this.employeeId = id;
    }
    
    int getEmployeeId() {
        return employeeId;
    }
}
```

**Creating Objects:**
```java
Employee empObject = new Employee();  // Creates object in heap, empObject holds reference
empObject.setEmployeeId(10);
```

**Memory Representation:**
```
Heap Memory:
┌─────────────────┐
│ Employee Object │  ← Actual object stored here
│ employeeId: 10  │
└─────────────────┘
        ↑
        │ (reference/address)
        │
empObject  ← Reference variable (holds address)
```

**Pass by Value (Important Concept):**
- In Java, **everything is passed by value**
- For reference types, the **value being passed is the reference (address)**
- This allows methods to modify objects passed as parameters

**Example:**
```java
void modify(Employee emp) {
    emp.employeeId = 20;  // Modifies the actual object
}

Employee empObject = new Employee();
empObject.employeeId = 10;
modify(empObject);
System.out.println(empObject.employeeId);  // Prints: 20 (changed!)
```

**Why it works:**
- `empObject` holds reference to the object
- When passed to `modify()`, the reference (address) is copied
- Both `empObject` and `emp` parameter point to the same object
- Changes made through either reference affect the same object

**Multiple References:**
```java
Employee obj1 = new Employee();
Employee obj2 = obj1;  // obj2 also points to same object

obj2.employeeId = 30;
System.out.println(obj1.employeeId);  // Prints: 30 (same object!)
```

### 2. String

**Why String is Reference Type:**
- Even though `String` is built into Java, it's a **reference type**, not primitive
- String variables hold references to string objects

**Key Concepts:**

#### String Immutability
- **Strings are immutable** - once created, they cannot be changed
- When you "modify" a string, a new string object is created

#### String Constant Pool
- Java maintains a special area in heap called **String Constant Pool**
- String literals are stored in this pool
- If the same literal already exists, new variable points to the existing one (reuse)

**Example 1: String Literals**
```java
String s1 = "Hello";  // Creates "Hello" in string pool
String s2 = "Hello";  // Reuses existing "Hello" from pool

System.out.println(s1 == s2);      // true (same reference)
System.out.println(s1.equals(s2)); // true (same content)
```

**Example 2: Using new Keyword**
```java
String s1 = "Hello";
String s3 = new String("Hello");  // Creates new object in heap (not in pool)

System.out.println(s1 == s3);      // false (different references)
System.out.println(s1.equals(s3)); // true (same content)
```

**Memory Representation:**
```
String Constant Pool (in Heap):
┌─────────┐
│ "Hello" │  ← s1 and s2 point here
└─────────┘

Heap (outside pool):
┌─────────┐
│ "Hello" │  ← s3 points here (created with 'new')
└─────────┘
```

**String Comparison:**
- `==` compares **references** (memory addresses)
- `.equals()` compares **content** (actual string values)

**Example:**
```java
String s1 = "Hello";
String s2 = "Hello";
String s3 = new String("Hello");

s1 == s2;        // true (same reference in pool)
s1.equals(s2);   // true (same content)
s1 == s3;        // false (different references)
s1.equals(s3);   // true (same content)
```

**Immutability Example:**
```java
String s1 = "Hello";
s1 = "Hello World";  // Creates new string, doesn't modify "Hello"

// "Hello" still exists in pool (if other references point to it)
// s1 now points to "Hello World"
```

### 3. Interface

**Definition:** Interface is a reference type that defines a contract (methods) that implementing classes must follow

**Key Points:**
- **Cannot create objects of interface directly**
- Can create objects of classes that implement the interface
- Can store references to implementing class objects in interface type variables

**Example:**
```java
interface Person {
    String profession();
}

class Teacher implements Person {
    public String profession() {
        return "Teaching";
    }
}

class Engineer implements Person {
    public String profession() {
        return "Software Engineer";
    }
}
```

**Creating Objects:**
```java
// ✅ Valid - Create object of implementing class
Person person1 = new Engineer();   // Parent reference, child object
Person person2 = new Teacher();    // Parent reference, child object
Engineer eng = new Engineer();     // Same class reference
Teacher tch = new Teacher();       // Same class reference

// ❌ Invalid - Cannot create object of interface
Person person3 = new Person();  // Compilation error!
```

**Why interface is reference type:**
- Variables of interface type hold references to objects of implementing classes
- Similar to class references, but with polymorphism

### 4. Array

**Definition:** Array is a sequence of contiguous memory locations storing elements of the same data type

**Characteristics:**
- Arrays are reference types (stored in heap)
- Array variable holds reference to the array object
- Elements are stored in contiguous memory locations
- Index starts from 0

**One-Dimensional Array:**

**Declaration Methods:**
```java
// Method 1: Declare and allocate
int[] arr = new int[5];  // Creates array of 5 integers

// Method 2: Declare with initialization
int[] arr = {30, 20, 10, 40, 50};  // Size automatically determined
```

**Accessing Elements:**
```java
int[] arr = new int[5];
arr[0] = 10;  // Set value at index 0
arr[3] = 40;  // Set value at index 3

int value = arr[0];  // Get value at index 0
```

**Memory Representation:**
```
Heap:
┌─────────────────────────┐
│ Array Object            │
│ Index: 0  1  2  3  4    │
│ Value: 10 0  0  40 0    │  ← Default values (0 for int)
└─────────────────────────┘
        ↑
        │ (reference)
        │
arr  ← Reference variable
```

**Two-Dimensional Array:**

**Declaration:**
```java
// Method 1: Declare and allocate
int[][] arr2D = new int[5][4];  // 5 rows, 4 columns

// Method 2: Initialize with values
int[][] arr2D = {
    {1, 5, 7},
    {4, 2, 3}
};  // 2 rows, 3 columns
```

**Accessing Elements:**
```java
int[][] arr2D = new int[5][4];
arr2D[2][2] = 20;   // Row 2, Column 2
arr2D[1][3] = 30;   // Row 1, Column 3

int value = arr2D[1][2];  // Get value at row 1, column 2
```

**Memory Representation (2D):**
```
Heap:
┌─────────────────────────┐
│ 2D Array (5 rows × 4 cols)│
│ [0][0] [0][1] [0][2] [0][3]│
│ [1][0] [1][1] [1][2] [1][3]│
│ [2][0] [2][1] [2][2] [2][3]│  ← arr2D[2][2] = 20
│ [3][0] [3][1] [3][2] [3][3]│
│ [4][0] [4][1] [4][2] [4][3]│
└─────────────────────────┘
        ↑
        │ (reference)
        │
arr2D  ← Reference variable
```

**Why Array is Reference Type:**
- Array variable holds reference to array object in heap
- When you modify array elements, changes are reflected in the actual array object
- Multiple variables can reference the same array

---

## Wrapper Classes

### What are Wrapper Classes?

For each of the **8 primitive types**, Java provides a corresponding **wrapper class** (reference type):

| Primitive Type | Wrapper Class |
|---------------|---------------|
| `byte`        | `Byte`        |
| `short`       | `Short`       |
| `int`         | `Integer`     |
| `long`        | `Long`        |
| `float`       | `Float`       |
| `double`      | `Double`      |
| `char`        | `Character`   |
| `boolean`     | `Boolean`     |

### Why Do We Need Wrapper Classes?

**Two Main Reasons:**

#### 1. Reference Type Capabilities

Primitive types are stored in **stack memory** and are **passed by value**. When you pass a primitive to a method and modify it, the original value doesn't change:

```java
void modify(int x) {
    x = 20;  // Only changes local copy
}

int a = 10;
modify(a);
System.out.println(a);  // Prints: 10 (unchanged!)
```

Wrapper classes provide **reference type behavior**. Objects are stored in **heap memory** and hold references:

```java
void modify(Integer x) {
    x = 20;  // Changes the object (if properly implemented)
}

Integer a = 10;
modify(a);
// Can reflect changes (depending on implementation)
```

#### 2. Collections Requirement

**All Java Collections** (ArrayList, HashMap, HashSet, etc.) work **only with objects** (reference types), not primitives:

```java
// ❌ Cannot do this:
ArrayList<int> list = new ArrayList<>();  // Error!

// ✅ Must use wrapper class:
ArrayList<Integer> list = new ArrayList<>();  // Correct
list.add(10);
list.add(20);
```

### Autoboxing and Unboxing

**Autoboxing:** Automatic conversion from **primitive to wrapper class**

```java
int a = 10;
Integer a1 = a;  // ✅ Autoboxing - primitive to wrapper
```

**Unboxing:** Automatic conversion from **wrapper class to primitive**

```java
Integer x = 20;
int x1 = x;  // ✅ Unboxing - wrapper to primitive
```

**Examples:**
```java
// Autoboxing
int primitive = 10;
Integer wrapper = primitive;  // Autoboxing

// Unboxing
Integer wrapper = 20;
int primitive = wrapper;  // Unboxing

// In Collections
ArrayList<Integer> list = new ArrayList<>();
list.add(5);  // Autoboxing: int 5 → Integer 5
int value = list.get(0);  // Unboxing: Integer → int
```

---

## Constant Variables

### What is a Constant Variable?

A **constant variable** is a variable whose value **cannot be changed** after initialization.

### How to Create Constants

Use `static final` keywords together:

```java
class Employee {
    public static final int EMPLOYEE_ID = 10;
}
```

**Breaking it down:**
- `static`: Only one copy exists (shared by all objects)
- `final`: Value cannot be changed after initialization
- **Naming Convention:** Use ALL CAPITAL LETTERS with underscores

### Why Both static and final?

**static alone:**
```java
static int employeeId = 10;  // Can be changed!
```
- Only one copy exists
- But value can still be modified

**static + final:**
```java
static final int EMPLOYEE_ID = 10;  // Cannot be changed!
```
- Only one copy exists (`static`)
- Value cannot be modified (`final`)

### Example:

```java
class Employee {
    public static final int COMPANY_ID = 100;
    
    void test() {
        // COMPANY_ID = 200;  // ❌ Compilation error - cannot modify final
        System.out.println(COMPANY_ID);  // ✅ Can only read
    }
}
```

**Usage:**
```java
// Access via class name (since it's static)
System.out.println(Employee.COMPANY_ID);  // Prints: 100

// All objects share the same constant
Employee obj1 = new Employee();
Employee obj2 = new Employee();
// Both obj1 and obj2 see COMPANY_ID = 100
```

### Key Points:

1. **Naming:** Use ALL CAPS with underscores: `MAX_SIZE`, `DEFAULT_VALUE`
2. **Initialization:** Must be initialized when declared (or in static block)
3. **Access:** Access via class name (since it's static)
4. **Immutability:** Value cannot be changed after initialization
5. **Memory:** Only one copy exists for the entire class

---

## Summary

### Key Takeaways

1. **Variables** are containers that hold values
2. **Java is both static and strong typed** - requires explicit types and enforces value ranges
3. **8 Primitive Types:** char, byte, short, int, long, float, double, boolean
4. **Reference Types:** Class, String, Interface, Array - hold references to objects in heap
5. **Type Conversions:** Automatic (widening), Explicit (narrowing), Promotion (in expressions)
6. **Kinds of Variables:** Member, Local, Static, Method Parameter, Constructor Parameter
7. **Wrapper Classes:** Provide object versions of primitives for collections and reference behavior
8. **Constants:** Use `static final` for unchangeable values shared across all objects
9. **String Immutability:** Strings cannot be changed; modifications create new strings
10. **Float/Double Precision:** Never use for currency; use `BigDecimal` instead

### Important Interview Points

- Why Java is static and strong typed
- Default values (only for class member variables)
- Signed two's complement representation
- IEEE 754 format for float/double
- String constant pool and immutability
- Pass by value vs pass by reference (Java passes references by value)
- Autoboxing and unboxing
- Why wrapper classes are needed
- Difference between `==` and `.equals()` for strings

---

## Related Topics

- **Methods** - Functions that operate on variables
- **Memory Management** - How variables are stored (stack vs heap)
- **Garbage Collector** - How Java manages memory for objects

