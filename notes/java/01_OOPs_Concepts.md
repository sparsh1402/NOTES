# OOPs Concepts In Java

## Overview

**OOPs** stands for **Object Oriented Programming**. As the name suggests, it's oriented toward **objects**. Everything revolves around thinking from an object perspective.

When you get any project in the industry, you need to understand: **What are all the objects present in whatever task you are doing?**

This is the fundamental of everything - whether you learn Java, go through object-oriented principles, or work on Low Level Design. **OOPs knowledge is the base for all.**

### What is an Object?

An **object** is a **real-world entity** like Car, Bike, ATM, etc.

Every real-world entity has **two things**:
1. **Properties** (also known as **State**)
2. **Behavior** (also known as **Functionality**)

If any real-world entity has these two things, it can be considered as an object.

---

## Procedural Programming vs OOPs

### Procedural Programming

**How it works:**
- Program is divided into parts called **functions**
- You get one task → create function one
- Pass data from one function to another
- Data moves freely from one function to another

**Characteristics:**
- **Does not provide a proper way to hide data**
- **Tightly coupled** - functions are very dependent on each other
- Gives importance to **function over data**
- Data can be changed by anyone
- **No control over data**

**What is Tight Coupling?**
- You have one function which creates a variable
- You pass that variable to another function
- That variable moves around from one function to another
- Other functions are changing it and using it
- The function that created it doesn't have any information about what changes were made
- They are very tightly coupled because they are freely passing the data
- There is no way to hide the data

**Missing Features:**
- Overloading is not possible
- Inheritance is not possible
- Code reusability is not present

**Example Languages:** Pascal, C, Fortran

**Key Understanding:** Procedural programming focuses on functions, not on data. Data moves freely with no control.

### OOPs (Object Oriented Programming)

**How it works:**
- Program is divided into **objects**
- Binds function and data together
- Function works on specific data
- Class has **full control** over its data

**Characteristics:**
- **Provides data hiding**
- Gives importance to **data over function**
- **Loosely coupled** code
- Full control over who can access and modify data

**Features:**
- Overloading is possible
- Inheritance is possible
- Code reusability is present

**Example Languages:** Java, C#, Python, C++

**Key Understanding:** OOPs binds function and data together. If you want to manipulate data, you call a function. The class has full control over who can access and modify the data.

---

## Objects & Classes

### Objects

An **object** is a real-world entity that has:
1. **Properties/State** - Things you can observe just by looking at the object
2. **Behavior/Functionality** - Actions the object can perform

**Every object MUST have these two things.**

### Examples of Objects

#### Example 1: Dog

**Dog is an object because:**

**Properties (State):**
- Color (e.g., black)
- Height
- Breed
- Age (e.g., 6 years old)

You can tell these properties just by observing the dog.

**Behavior (Functionality):**
- Bark
- Sleep
- Eat

These are the functions which dogs perform.

#### Example 2: Car

**Car is an object because:**

**Properties (State):**
- Brand
- Type
- Color
- Weight

**Behavior (Functionality):**
- Apply brake
- Drive
- Increase speed

### Classes

A **class** is:
- A **blueprint** or **skeleton** of an object
- A **template** from which objects can be created
- Required to create an object
- Can create **multiple objects** from one class

**Keyword to create a class:** `class`

### Class Structure

A class contains:
1. **Data Variables** (Properties/State) - Also known as **data members** or **data variables**
2. **Data Methods** (Behavior/Functionality) - Functions that work on data variables

**Data methods** (which we earlier called functions) work on **data variables**.

### Example: Student Class

```java
class Student {
    // Data Variables (Properties)
    int age;
    String name;
    String address;
    
    // Data Methods (Behavior)
    void updateAddress() {
        // Method to update address
        // Example: Student moved from Jaipur, Rajasthan to another state
    }
    
    int getAge() {
        return age; // Returns the age
    }
    
    void setAge(int age) {
        this.age = age; // Sets the age
    }
}
```

**Understanding:**
- Class has two things: **data variables** (properties) and **functions** (methods)
- Methods work on data variables
- Any modification or retrieval can be done through functions

### Creating Objects

From one class, you can create multiple objects:

```java
// Creating objects from Student class
Student engineeringStudent = new Student();
Student mbaStudent = new Student();
Student caStudent = new Student();
Student csStudent = new Student();
```

**Key Points:**
- Each object has its **own properties** with **own values**
- Each object has access to all **data methods**
- Objects are independent of each other
- Same class structure, different values

**Example:**
- `engineeringStudent` might have: age = 23, address = "XYZ"
- `mbaStudent` might have: age = 25, address = "ABC"

Both objects have:
- Same data variables (age, name, address)
- Same data methods (updateAddress, getAge, setAge)
- But different values

**Important:** The `new` keyword is used to create objects. We'll go deeper into syntax in later sessions.

---

## 1st Pillar of OOPs - Data Abstraction

### Definition

**Data Abstraction** hides the internal implementation and shows only **essential functionality** to the user.

### Real-World Examples

#### Example 1: Car Brake Pedal

- **What you see:** Brake pedal
- **What you know:** If you press it, car speed will reduce
- **What you DON'T know:** How it reduces internally (the internal implementation)

The internal steps are **abstracted** (hidden) from you. You only care about what you have to do, not how it happened.

#### Example 2: Cell Phone Call

- **What you see:** Dial number and press green button
- **What you know:** Call will be made
- **What you DON'T know:** 
  - How data transfers
  - How it reaches the network
  - How it reaches the other person

All the internal implementation is **abstracted** from you. We only know the essential feature which is given to us.

### How to Achieve Data Abstraction

Data abstraction can be achieved through:
- **Interface**
- **Abstract Classes**

### Advantages of Data Abstraction

1. **Security & Confidentiality**
   - You can hide features you don't want to expose
   - Only expose what the user needs
   - Example: Car has many features, but you only want to expose: apply brake, press accelerator, press horn
   - Rest of the things (like mechanic features) you don't want to expose to the user

2. **Simplifies Client Code**
   - Client doesn't get bombarded with unnecessary information
   - If you expose all internal steps, client has to know about 10+ steps
   - Client doesn't care about internal steps
   - Client only wants: "Press brake → Car stops"
   - Client is only aware of: "I provide this input, give me this output"
   - How you will do it, client doesn't care

3. **Prevents Messing with Internal Implementation**
   - Users can't accidentally break internal functionality
   - Full control over what users can access

### Example: Car Interface

```java
interface Car {
    public void applyBrake();
    public void pressAccelerator();
    public void pressHorn();
}

class CarImpl implements Car {
    public void applyBrake() {
        // Step 1: Less battery use
        // Step 2: Stop petrol/diesel usage
        // Step 3: Apply brake mechanism
        // Step 4: Engine work
        // Step 5: Tools work
        // ... many more internal steps
        // Outcome: Speed reduced
    }
}
```

**From User Perspective:**
- User only knows: `applyBrake()` method exists
- User calls: `car.applyBrake()`
- User gets: Speed reduced
- User doesn't know: All the internal steps (Step 1, Step 2, Step 3, etc.)

**Why This is Important:**
- If you expose all internal steps, the client has to know about 10+ steps
- Client doesn't care about internal steps
- Client only wants: "Press brake → Car stops"
- This keeps the code simple and secure

---

## 2nd Pillar of OOPs - Data Encapsulation

### Definition

**Data Encapsulation** bundles the **data** and the **code working on that data** into a **single unit** (class).

It is also known as **Data Hiding**.

### How It Works

1. **Bundle Data and Methods Together**
   - Data variables (properties) and methods (functions) are grouped in the same class
   - Methods work on the data variables of that class

2. **Control Access Through Methods**
   - Declare variables as `private` (data hiding)
   - Provide `public` getters and setters to modify and view values
   - Class has **full control** over its data

### Advantages of Encapsulation

1. **Loosely Coupled Code**
   - Classes are independent
   - Changes in one class don't affect another
   - Better code organization
   - In procedural programming, data moves freely - any function can change data
   - Encapsulation solves this by giving class ownership of its data

2. **Better Access Control & Security**
   - Full control over who can access data
   - Full control over how data can be accessed
   - Prevents unauthorized access

3. **Brings Control**
   - Class takes ownership of its data
   - These are the functions available - use this function to update the variable
   - Class has full control over its members through its functions

### Example: Dog Class with Encapsulation

```java
class Dog {
    // Private data member (data hiding)
    private String colour;
    
    // Public getter method
    public String getColour() {
        return this.colour;
    }
    
    // Public setter method
    public void setColour(String colour) {
        this.colour = colour;
    }
}
```

### Creating and Using Objects

```java
// Create an object
Dog rottweiler = new Dog();

// Set color through method (encapsulation)
rottweiler.setColour("black");

// Get color through method (encapsulation)
String dogColor = rottweiler.getColour(); // Returns "black"
```

**Key Point:** You cannot directly access `colour` variable. You must use the methods (`getColour()` or `setColour()`). This gives the Dog class **full control** over its data.

### Access Specifiers

Access specifiers control how data can be accessed. There are **four types**:

1. **Private** - Only accessible within the same class
2. **Public** - Accessible from anywhere
3. **Protected** - Accessible within package and subclasses
4. **Default** - Accessible within the same package

#### Example with Access Specifiers

```java
class Dog {
    // Private - cannot be accessed directly from outside
    private String colour;
    
    // Public - can be accessed from anywhere
    public String getColour() {
        return this.colour; // Can access private member within same class
    }
    
    public void setColour(String colour) {
        this.colour = colour;
    }
}

class Cat {
    public void someMethod() {
        Dog rottweiler = new Dog();
        
        // ❌ This won't work - colour is private
        // rottweiler.colour = "black";
        
        // ✅ This works - method is public
        rottweiler.setColour("black");
        String color = rottweiler.getColour();
    }
}
```

### Understanding Control

**Question:** If another class (like Cat) can get the dog's color, isn't that against encapsulation?

**Answer:** No! Getting information is okay. The key is **who has ownership and control**:

- **Dog class** has ownership of maintaining dog properties
- **Cat class** can **get** the information but cannot **take ownership**
- Dog class controls **how** other classes can access its data:
  - If `colour` is `private` → Must use methods
  - If `colour` is `public` → Can access directly
  - Dog class decides the access level

**Important:** Getting information is required to run any program. Nobody is self-sufficient. Everybody needs information from other classes to perform certain tasks. But **who takes the ownership** to maintain that particular information is what we are talking about.

### Real-World Analogy

Think of a **medicine capsule**:
- The actual medicine (data) is inside the capsule
- The capsule (class) protects the medicine
- You can't directly access the medicine - you need to go through the capsule
- The capsule controls how the medicine is accessed

Similarly:
- Data is inside the class
- Class protects the data through access specifiers (private, public, protected, default)
- Other classes must go through methods to access data
- The class controls how data is accessed

---

## 3rd Pillar of OOPs - Inheritance

### Definition

**Inheritance** is the capability of a class to inherit properties from their parent class.

Just like in real life: Our parent has certain capabilities, and we (child) inherit from our parent. Child has its own capabilities plus all parent capabilities.

### Key Points

- Child class has the capability to inherit properties from the parent class
- It can inherit both **functions and variables** so we don't have to write them again in the child class
- Whatever the parent has, child will also have
- Child has its own properties plus parent's properties
- **Opposite is not true** - Parent cannot access child's properties

### Example: Vehicle and Car

```java
class Vehicle {
    boolean hasEngine;
    
    boolean getEngine() {
        return this.hasEngine;
    }
}

class Car extends Vehicle {
    String type; // e.g., "petrol", "diesel", "hatchback", "SUV", "sedan"
    
    String getCarType() {
        return this.type;
    }
}
```

**Creating Objects:**

```java
// Create Car object
Car swift = new Car();

// ✅ This works - Car can access parent's method
swift.getEngine(); // Valid - Car inherits from Vehicle

// Create Vehicle object
Vehicle vehicle = new Vehicle();

// ❌ This doesn't work - Vehicle cannot access child's method
vehicle.getCarType(); // Invalid - Vehicle doesn't have this method
```

**Understanding:**
- `swift` (Car object) can call `getEngine()` because Car extends Vehicle
- `vehicle` (Vehicle object) cannot call `getCarType()` because Vehicle is not a child of Car

### How to Achieve Inheritance

Inheritance can be achieved through:
- **`extends` keyword** (for classes)
- **`implements` keyword** (for interfaces)

### Types of Inheritance

#### 1. Single Inheritance

```
Class A
  ↓
Class B
```

#### 2. Multilevel Inheritance

```
Class A
  ↓
Class B
  ↓
Class C
```

Can go on multiple levels.

#### 3. Hierarchical Inheritance

```
    Class A
      ↙  ↘
Class B  Class C
```

Both B and C extend from A. This is **allowed**.

#### 4. Multiple Inheritance

```
Class A    Class B
    ↘      ↙
      Class C
```

**This is NOT allowed in Java** (but might be allowed in C++).

### Diamond Problem

**Why Multiple Inheritance is Not Allowed:**

This is known as the **Diamond Problem**.

**Example:**

```java
class A {
    int getEngine() {
        return 1;
    }
}

class B {
    int getEngine() {
        return 2;
    }
}

// This is NOT allowed in Java
class C extends A, B {  // ❌ Compilation Error
    // ...
}

// If it were allowed, what would happen?
C obj = new C();
obj.getEngine(); // Which one to call? A's getEngine() or B's getEngine()?
```

**The Problem:**
- Class C has access to both parent classes' `getEngine()` methods
- When `obj.getEngine()` is called, Java doesn't know which one to invoke
- This creates confusion and ambiguity

**Solution Through Interface:**

Multiple inheritance **can be achieved through interfaces**:

```java
interface A {
    int getEngine(); // Just definition, no implementation
}

interface B {
    int getEngine(); // Just definition, no implementation
}

class C implements A, B {
    // Must implement getEngine()
    int getEngine() {
        return 3; // Its own implementation
    }
}
```

**Why Interface Works:**
- In interface, you only provide method definition (no implementation)
- The class that implements the interface has the responsibility to write proper implementation
- So when `obj.getEngine()` is called, it calls the implementation in class C
- This solves the diamond problem

**Note:** We'll cover interfaces in detail later. For now, understand that multiple inheritance is not possible with classes due to diamond problem, but can be achieved through interfaces.

### Advantages of Inheritance

1. **Code Reusability**
   - Parent has certain code which you don't want to write again
   - You can reuse it

2. **Achieve Polymorphism**
   - We can achieve polymorphism using inheritance
   - (We'll see this in the next pillar)

---

## 4th Pillar of OOPs - Polymorphism

### Definition

**Poly** means "Many" and **morphism** means "Form".

**Polymorphism** means a same method has the capability to take many forms.

A same method behaves differently in different situations.

### Examples

- **Person:** A person can be a father, a husband, an employee (many forms)
- **Water:** Water can be in liquid, solid, or gas form (many forms)

### Types of Polymorphism

There are **two types** of polymorphism:

1. **Method Overloading** (also known as **Static Polymorphism** or **Compile Time Polymorphism**)
2. **Method Overriding** (also known as **Dynamic Polymorphism** or **Runtime Polymorphism**)

### 1. Method Overloading (Compile Time Polymorphism)

**Definition:** Same method name, but different parameters (number or type of parameters).

**Key Points:**
- Same method name
- Different parameters (different number or different types)
- Must be in the **same class**
- Return type can be different, but **overloading cannot be done only on the basis of return type**

**Example:**

```java
class Sum {
    // Method 1: Two integers
    int doSum(int a, int b) {
        return a + b;
    }
    
    // Method 2: Three integers (different number of parameters)
    int doSum(int a, int b, int c) {
        return a + b + c;
    }
    
    // Method 3: Two strings (different type of parameters)
    String doSum(String a, String b) {
        return a + b;
    }
}
```

**Using the Methods:**

```java
Sum calc = new Sum();

calc.doSum(5, 2);        // Calls method 1 (two integers)
calc.doSum(3, 4, 2);     // Calls method 2 (three integers)
calc.doSum("Hello", "World"); // Calls method 3 (two strings)
```

**Why It's Called Compile Time:**
- At compile time itself, Java knows which method to call
- Based on the arguments passed, it determines which method to invoke
- All information is available at compile time

**Important Rule - Return Type:**

```java
// ❌ This is NOT valid overloading
int doSum(int x, int y) {
    return x + y;
}

String doSum(int x, int y) {  // Same parameters, only return type differs
    return String.valueOf(x + y);
}
```

**Why This Doesn't Work:**
- During compile time, Java only checks the arguments you are going to pass
- It doesn't check the return type for binding
- If you call `calc.doSum(5, 2)`, Java doesn't know which one to call
- Both have same parameters, so it gets confused
- **Overloading cannot be done only on the basis of return type**

### 2. Method Overriding (Runtime Polymorphism)

**Definition:** Same method name, same parameters, same return type in parent and child class. Only the implementation differs.

**Key Points:**
- Same method name
- Same parameters (same number, same types)
- Same return type
- Must be in **parent and child classes** (through inheritance)
- Only the **internal implementation** can differ
- Which method to call is decided at **runtime** based on the object created

**Example:**

```java
class A {
    int getEngine(int a, int b) {
        // Some computation
        return 1; // Returns true (represented as 1)
    }
}

class B extends A {
    // Overriding the method
    int getEngine(int a, int b) {
        // Different computation
        return 2; // Returns false (represented as 2)
    }
}
```

**Using the Methods:**

```java
// Create object of class B
B bObj = new B();
bObj.getEngine(5, 2); // Calls B's getEngine() - returns 2

// Create object of class A
A aObj = new A();
aObj.getEngine(4, 2); // Calls A's getEngine() - returns 1
```

**How It Works:**
- When you create an object of class B and call `getEngine()`, it first checks in class B
- If the method is present in class B, it calls that one
- If not present, it checks in the parent class (class A)
- Which method to call depends on **which object you created** (runtime decision)

**Key Differences: Overloading vs Overriding**

| Method Overloading | Method Overriding |
|-------------------|-------------------|
| Same class | Parent and child classes |
| Same method name, **different parameters** | Same method name, **same parameters** |
| Different number or types of parameters | Same number and types of parameters |
| Return type can differ (but not the basis for overloading) | **Same return type** |
| Compile time decision | Runtime decision |
| Also called Static/Compile Time Polymorphism | Also called Dynamic/Runtime Polymorphism |

---

## Relationships in OOPs

### Is-A Relationship

**Definition:** Achieved through **Inheritance**.

**Examples:**
- Car **is-a** Vehicle
- Dog **is-a** Animal
- B **is-a** A (if B extends A)

**Understanding:**
- Inheritance forms an **is-a** relationship between parent and child classes
- If B extends A, we say "B is-a A"
- Whenever somebody asks about "is-a relationship", they are asking about **inheritance**

### Has-A Relationship

**Definition:** Whenever an object is used in another class, it's called **Has-A relationship**.

**Understanding:**
- You created a class A
- Inside class A, you have an object of class B
- So class A **has** an object of class B
- This is also known as a **data member** or **data variable**, but it's an object of another class

**Example:**

```java
class Student {
    int age;
    Course course; // Has-A relationship - Student has a Course object
}

class Course {
    String name;
}
```

**Types of Has-A Relationship:**

1. **One-to-One (1:1)**
   - A student has one course
   ```java
   class Student {
       Course course; // One course object
   }
   ```

2. **One-to-Many (1:Many)**
   - A student has many courses
   ```java
   class Student {
       List<Course> courses; // List of courses
   }
   ```

3. **Many-to-Many (Many:Many)**
   - A student has many courses
   - A course has many students
   ```java
   class Student {
       List<Course> courses;
   }
   
   class Course {
       List<Student> students;
   }
   ```

**More Examples:**
- Bike **has** an engine
- School **has** classes/rooms
- School **has** students

### Types of Has-A Relationship

Has-A relationship is of **two types**:

#### 1. Aggregation (Weak Relationship)

**Definition:** Both objects can survive independently. Ending of one object will **not** end another object.

**Example: School and Students**

```java
class School {
    List<Student> students;
}

class Student {
    String name;
}
```

**Understanding:**
- School has many students
- If you destroy/remove students, will school get destroyed? **No**
- If you destroy school, will students get destroyed? **No** (students can enroll in another school)
- Both are independent
- This is **weak relationship** - known as **Aggregation**

**Key Point:** Removing one object doesn't impact the other. Both can survive independently.

#### 2. Composition (Strong Relationship)

**Definition:** Ending of one object will **end** another object. They are strongly related.

**Example: School and Rooms**

```java
class School {
    List<Room> rooms;
}

class Room {
    int roomNumber;
}
```

**Understanding:**
- School has many rooms (e.g., 100 rooms)
- If you destroy school, will rooms get destroyed? **Yes** - rooms will also get destroyed
- They are strongly related
- This is **strong relationship** - known as **Composition**

**Key Point:** Removing one object impacts the other. They cannot survive independently.

**Important Note:** We're talking from **object perspective**, not class perspective. If you destroy a class itself, there will be compilation errors. But if you destroy an object, in aggregation the other object survives, in composition the other object also gets destroyed.

---

## Summary

### OOPs Fundamentals

1. **OOPs** = Object Oriented Programming (everything revolves around objects)

2. **Object** = Real-world entity with:
   - Properties/State
   - Behavior/Functionality

3. **Class** = Blueprint/template to create objects

4. **Four Pillars of OOPs:**
   - **Data Abstraction** - Hide implementation, show essential features
   - **Data Encapsulation** - Bundle data and methods, control access
   - **Inheritance** - Child class inherits from parent class
   - **Polymorphism** - Same method, different forms

### Key Concepts

- **Procedural Programming:** Focus on functions, data moves freely, tightly coupled
- **OOPs:** Focus on data, data is controlled, loosely coupled
- **Encapsulation:** Class has full control over its data through access specifiers
- **Abstraction:** User only sees what they need, internal details are hidden
- **Inheritance:** Code reusability, child gets parent's properties
- **Polymorphism:** Method overloading (compile time) and method overriding (runtime)
- **Is-A Relationship:** Inheritance
- **Has-A Relationship:** One class has object of another class (Aggregation or Composition)

### Interview Tips

**Common Question:** "Can you explain OOPs fundamentals like you're explaining to a 14-year-old child?"

**Answer Strategy:**
- Use simple, real-world examples (Car, Dog, Student, School)
- Avoid jargon
- Explain with examples they can relate to
- Make it clear and simple
- Focus on the four pillars with easy-to-understand analogies

**Important Interview Questions:**
1. Difference between Procedural and OOPs
2. Explain four pillars of OOPs
3. Difference between Abstraction and Encapsulation
4. Types of Inheritance and Diamond Problem
5. Method Overloading vs Method Overriding
6. Is-A vs Has-A relationship
7. Aggregation vs Composition

---

## Next Steps

- **Interfaces and Abstract Classes** (to be covered in detail)
- **Access Specifiers** (private, public, protected, default - in detail)
- **More on Polymorphism** (advanced concepts)
- **Design Patterns** (using OOPs principles)
