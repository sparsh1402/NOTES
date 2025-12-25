# OOPs Concepts In Java

## OOPs Overview

* OOPs means **Object Oriented Programming**
* Here object means real world entity like Car, ATM, Bike etc.

### Procedural Programming vs OOPs

| Procedural Programming | OOPs |
| --- | --- |
| Program is divided into parts called functions. | Program is divided into objects |
| Doesn't provide a way to hide data, gives importance to function and data moves freely. | Objects provides data hiding, gives importance to data. |
| Overloading is not possible | Overloading is possible |
| Inheritance is not possible | Inheritance is possible |
| Code reusability does not present | Code reusability is present. |
| Eg: Pascal, C, Fortran etc. | Eg: Java, C#, Python, C++ etc. |

---

## Objects & Classes

* **Object** has 2 things:
  - **Properties or State**
  - **Behavior or Function**

### Examples:

**Dog is an object because:**
- **Properties** like: Age, colour, breed etc.
- **Behavior** like: Bark, sleep, eat etc.

**Car is an object because it has:**
- **Properties** like: Colour, Type, Brand, Weight etc.
- **Behavior** like: Apply brake, Drive, Increase speed etc.

* **Class** is a blueprint / skeleton of an object.
  - To create an object, a Class is required.
  - So, class provides the template or blueprint from which an object can be created
  - From class, we can create multiple objects.
  - To create a class, use keyword `class`.

### Example:

```java
class Student {
    int age;
    String name;
    String address;
    
    void updateAddress() {
        // Data Method
    }
    
    int getAge() {
        return age; // Data Method
    }
}
```

Now let's create an object of type Student:

```java
Student engstu = new Student();
```

---

## 1st Pillar of OOPs - Data Abstraction

* It hides the internal implementation and shows only essential functionality to the user.
* It can be achieved through **interface** and **abstract classes**.

### Examples:

- **Car**: we only show the BRAKE pedal, and if we press it, Car speed will reduce. But how? That is **ABSTRACTED** from us.
- **Cellphone**: how call is made that is **ABSTRACTED** to us.

### Advantages of Abstraction:

- It increases security & confidentiality

### Demo:

```java
interface Car {
    public void applyBrake();
    public void incSpeed();
    public void handbrake();
}

class CarImpl implements Car {
    public void applyBrake() {
        // step-1
        // step-2
        // step-3
    }
}
```

So when user calls `applyBrake()`, internally it's invoking step-1, step-2, step-3 -- but all that is hidden from the user but ultimately car stops.

So this improves security as user is not aware of the internal functionality and only knows about the result.

---

## 2nd Pillar of OOPs - Data Encapsulation

* Encapsulation bundles the data & code working on that data in a single unit.
* Also known as **DATA-HIDING**.
* Steps to achieve encapsulation:
  - Declare variable of a class as `private`
  - Provide public getters & setters to modify & view the values of the variables

### Advantages of encapsulation:

- Loosely coupled code
- Better access control & security

### Demo:

```java
class Dog {
    private String colour;
    
    String getColour() {
        return this.colour;
    }
    
    void setColour(String colour) {
        this.colour = colour;
    }
}
```

Now let's create an object of Dog type:

```java
Dog lab = new Dog();
lab.setColour("black");
lab.getColour(); // will return black
```

So here we haven't given the access of the variable `colour` of class dog. Instead we did it with the help of the getter & setter which in turn have the access of variable.

---

## 3rd Pillar of OOPs - Inheritance

* Capability of a class to inherit properties from their parent class.
* It can inherit both functions and variables so that we don't have to write them again in the child class.
* Can be achieved using `extends` keyword or through interface.
* Types of inheritance:
  - Single inheritance
  - Multilevel inheritance
  - Hierarchical inheritance
  - Multiple inheritance (Not actually supported by Java due to diamond problem but through interface, we can solve the diamond problem)

### Advantages Of Inheritance

- Code reusability
- We can achieve polymorphism using inheritance

### Example:

```java
class Vehicle {
    boolean engine;
    
    boolean getEngine() {
        return this.engine;
    }
}

class Car extends Vehicle {
    String type;
    
    String getCarType() {
        return this.type;
    }
}
```

Now let's create an object of Car:

```java
Car swift = new Car();
swift.getEngine(); // Works!

Vehicle vehicle = new Vehicle();
vehicle.getCarType(); // Should not work
```

So, since swift is an object of car which extends vehicle hence it can call `getEngine()` whereas vice versa isn't possible.

### Types of Inheritance:

**Single Inheritance:**
```
Class A
  ↓
Class B
```

**Multilevel Inheritance:**
```
Class A
  ↓
Class B
  ↓
Class C
```

**Hierarchical Inheritance:**
```
    Class A
      ↙  ↘
Class B  Class C
```

**Multiple Inheritance:**
```
Class A    Class B
    ↘      ↙
      Class C
```

This is not supported in Java due to diamond problem but there is a workaround for it using interfaces.

---

## 4th Pillar of OOPs - Polymorphism

* **Poly** means "Many" & **morphism** means "Form"
* A same method, behaves differently in different situation
* Examples:
  - A person can be father, husband, employee etc.
  - Water can be liquid, solid or gas.

* Types of polymorphism:
  - **Compile Time / Static Polymorphism / Method Overloading**
  - **Run Time / Dynamic Polymorphism / Method Overriding**

### Method Overloading Demo:

```java
class Sum {
    int doSum(int a, int b) {
        return a + b;
    }
    
    int doSum(int a, int b, int c) {
        return a + b + c;
    }
}
```

So this practice of creating methods with same name but different parameters is called **overloading**.
So the method will be called based on the parameters.

### Method Overriding Demo:

```java
class A {
    int getEngine() {
        return 1;
    }
}

class B extends A {
    int getEngine() {
        return 2;
    }
}
```

Now let's create an object of class B:

```java
B obj = new B();
obj.getEngine(); // This'll return 2
```

So which method to call is decided at runtime & this is called **method overriding**.
So, in overriding, everything i.e. arguments, return type, method name is same.

---

## Relationships in OOPs

### Is-A Relationship

- Achieved through Inheritance
- Example: **DOG is-a animal**
- Inheritance form an is-a relation between its parent child classes

### Has-A Relationship

- Whenever, an object is used in Other class, it's called HAS-A relationship.
- Relationship could be one-to-one, one-to-many, many-to-many
- Examples:
  - School has Students
  - Bike has engine
  - School has classes

### Types of Has-A Relationship:

**Association**: relationship between 2 different objects

**Aggregation**: Both objects can survive individually, means ending of one object will not end another object.

**Composition**: Ending of one object will end another object.

---

## Summary

OOPs in Java is built on four main pillars:

1. **Abstraction** - Hiding internal implementation details
2. **Encapsulation** - Bundling data and methods together with data hiding
3. **Inheritance** - Reusing code from parent classes
4. **Polymorphism** - Same method behaving differently in different contexts

These concepts help in writing maintainable, reusable, and secure code.

