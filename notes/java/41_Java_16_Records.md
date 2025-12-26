# Java 16: Records

## Table of Contents
- [The Problem](#the-problem)
- [What are Records?](#what-are-records)
- [Record Components](#record-components)
- [Constructors](#constructors)
- [Accessor Methods](#accessor-methods)
- [Other Methods](#other-methods)
- [Nested Records](#nested-records)
- [Local Records](#local-records)
- [Records vs Lombok](#records-vs-lombok)
- [Summary](#summary)

---

## The Problem

### Boilerplate Code for Immutable Classes

**Creating an immutable POJO requires a lot of code:**

```java
public final class User {
    private final String name;
    private final int age;
    private final String address;
    
    // Constructor
    public User(String name, int age, String address) {
        this.name = name;
        this.age = age;
        this.address = address;
    }
    
    // Getters (no setters - immutable)
    public String getName() {
        return name;
    }
    
    public int getAge() {
        return age;
    }
    
    public String getAddress() {
        return address;
    }
    
    // equals() and hashCode()
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return age == user.age &&
               Objects.equals(name, user.name) &&
               Objects.equals(address, user.address);
    }
    
    @Override
    public int hashCode() {
        return Objects.hash(name, age, address);
    }
    
    // toString()
    @Override
    public String toString() {
        return "User{" +
               "name='" + name + '\'' +
               ", age=" + age +
               ", address='" + address + '\'' +
               '}';
    }
}
```

**Problem:** Too much boilerplate code for a simple data carrier class.

---

## What are Records?

### Definition

**Records** are a special kind of class designed to be **transparent data carriers**.

**Purpose:** Reduce boilerplate code for **immutable data classes** (POJOs).

**Syntax:**
```java
public record User(String name, int age, String address) {
    // That's it! Everything else is generated automatically
}
```

**What gets generated automatically:**
- ✅ **Final class** (cannot be subclassed)
- ✅ **Private final fields** (for each component)
- ✅ **Canonical constructor** (takes all components)
- ✅ **Accessor methods** (getters, named after components)
- ✅ **equals()** and **hashCode()** methods
- ✅ **toString()** method

### Example

**Record Definition:**
```java
public record User(String name, int age, String address) {
}
```

**Usage:**
```java
User user = new User("John", 25, "123 Street");
System.out.println(user.name());  // "John" (accessor method)
System.out.println(user.age());   // 25
System.out.println(user.address()); // "123 Street"
System.out.println(user);  // User[name=John, age=25, address=123 Street]
```

**Generated Class (Conceptual):**
```java
public final class User extends java.lang.Record {
    private final String name;
    private final int age;
    private final String address;
    
    // Canonical constructor
    public User(String name, int age, String address) {
        this.name = name;
        this.age = age;
        this.address = address;
    }
    
    // Accessor methods
    public String name() { return name; }
    public int age() { return age; }
    public String address() { return address; }
    
    // equals(), hashCode(), toString() automatically generated
}
```

---

## Record Components

### What are Record Components?

**Record components** are the fields declared in the record header.

**Example:**
```java
public record User(String name, int age, String address) {
    // name, age, address are "record components"
}
```

### Rules for Record Components

1. **Cannot add instance fields** (only record components)
2. **Can add static fields**
3. **Record components** become `private final` fields automatically

**Why no instance fields?**
- Records are **transparent data carriers**
- All data should be visible in the header
- If you need more fields, add them as record components

**Example:**
```java
public record User(String name, int age) {
    // ❌ Cannot add instance field
    // private String email;  // Compilation error!
    
    // ✅ Can add static field
    private static int count = 0;
    
    // ✅ Can add static method
    public static int getCount() {
        return count;
    }
}
```

**Why static fields allowed?**
- Static fields belong to **class**, not instance
- Doesn't affect **object immutability**
- Each object remains immutable

---

## Constructors

### Canonical Constructor

**Automatically generated** constructor that takes all record components in order.

**Example:**
```java
public record User(String name, int age, String address) {
    // Canonical constructor automatically generated:
    // public User(String name, int age, String address) {
    //     this.name = name;
    //     this.age = age;
    //     this.address = address;
    // }
}
```

**Usage:**
```java
User user = new User("John", 25, "123 Street");
```

### Overriding Canonical Constructor

**You can override** to add validation or logic:

**Full Form:**
```java
public record User(String name, int age, String address) {
    public User(String name, int age, String address) {
        if (age < 0) {
            throw new IllegalArgumentException("Age cannot be negative");
        }
        this.name = name;
        this.age = age;
        this.address = address;
    }
}
```

**Compact Form (Shorthand):**
```java
public record User(String name, int age, String address) {
    public User {  // Compact constructor - no parameters listed
        if (age < 0) {
            throw new IllegalArgumentException("Age cannot be negative");
        }
        // this.name = name;  // Automatically added by compiler
        // this.age = age;    // Automatically added by compiler
        // this.address = address;  // Automatically added by compiler
    }
}
```

**Key Points:**
- **Compact constructor:** No parameter list (compiler adds automatically)
- **Assignment:** Automatically added by compiler (can omit)
- **Validation:** Add before automatic assignment

### Additional Constructors

**You can add more constructors**, but they **must call canonical constructor**:

```java
public record User(String name, int age, String address) {
    // Additional constructor
    public User(String name) {
        this(name, 0, "");  // Must call canonical constructor
    }
    
    public User(int age) {
        this("Unknown", age, "");  // Must call canonical constructor
    }
}
```

**Rule:** All constructors must **ultimately call canonical constructor** to ensure all fields are initialized.

### Constructor Access Level

**Must match or be more permissive** than record access level:

```java
// Public record
public record User(String name, int age) {
    public User(String name, int age) { ... }  // ✅ OK - public
    // private User(String name, int age) { ... }  // ❌ Error - cannot restrict
}

// Package-private record
record User(String name, int age) {
    User(String name, int age) { ... }  // ✅ OK - package-private
    public User(String name, int age) { ... }  // ✅ OK - can increase access
}
```

---

## Accessor Methods

### Automatic Generation

**Accessor methods** are automatically generated, **named after the component** (not `getXxx`).

**Example:**
```java
public record User(String name, int age) {
    // Automatically generated:
    // public String name() { return name; }
    // public int age() { return age; }
}
```

**Usage:**
```java
User user = new User("John", 25);
String name = user.name();  // Not getName()!
int age = user.age();       // Not getAge()!
```

**Key Point:** Accessor methods use **component name**, not `get` prefix.

### Overriding Accessor Methods

**You can override** accessor methods:

```java
public record User(String name, int age) {
    @Override
    public String name() {
        return name != null ? name.toUpperCase() : "UNKNOWN";
    }
}
```

---

## Other Methods

### equals(), hashCode(), toString()

**Automatically generated** using all record components.

**Example:**
```java
public record User(String name, int age) {
    // Automatically generated:
    // - equals() using name and age
    // - hashCode() using name and age
    // - toString() returns "User[name=John, age=25]"
}
```

**You can override** if needed:

```java
public record User(String name, int age) {
    @Override
    public String toString() {
        return "User: " + name + " (" + age + ")";
    }
}
```

### Adding Custom Methods

**You can add any methods** to records:

```java
public record User(String name, int age) {
    public boolean isAdult() {
        return age >= 18;
    }
    
    public String getDisplayName() {
        return name + " (" + age + ")";
    }
}
```

---

## Nested Records

### What are Nested Records?

**Records defined inside another record or class.**

**Key Rule:** Nested records are **always static** (cannot be non-static).

**Example:**
```java
public record User(String name, int age) {
    // Nested record (always static)
    record Address(String street, String city) {
        public void display() {
            System.out.println(street + ", " + city);
        }
    }
    
    // Nested class (can be static or non-static)
    static class StaticClass {
        public void display() {
            System.out.println("Static class");
        }
    }
    
    class NonStaticClass {
        public void display() {
            System.out.println("Non-static class");
        }
    }
}
```

**Usage:**
```java
// Nested record (static)
User.Address address = new User.Address("123 Street", "City");
address.display();

// Nested static class
User.StaticClass staticObj = new User.StaticClass();
staticObj.display();

// Nested non-static class (needs User instance)
User user = new User("John", 25);
User.NonStaticClass nonStaticObj = user.new NonStaticClass();
nonStaticObj.display();
```

### Why Only Static Records?

**Reason:** Records are **transparent data carriers**.

**If nested record were non-static:**
- Would need reference to outer record instance
- Would violate transparency (hidden data)
- **Solution:** Make all nested records static (no instance reference needed)

---

## Local Records

### What are Local Records?

**Records defined inside a method or block** (similar to local classes).

**Rules:**
- **No access modifiers** (public, private, protected) - scope is the block
- **Cannot be accessed** outside the block
- **Cannot be static** (belongs to block, not class)

**Example:**
```java
public class UserService {
    public void processUser(String name, int age) {
        // Local record
        record UserData(String name, int age) {
            public void display() {
                System.out.println(name + " - " + age);
            }
        }
        
        // Create and use local record
        UserData userData = new UserData(name, age);
        userData.display();
    }
}
```

**Key Points:**
- **Scope:** Only within the method/block
- **No access modifiers:** Scope is already limited
- **Cannot be static:** Belongs to block, not class

---

## Records vs Lombok

### Why Records When Lombok Exists?

**Lombok also reduces boilerplate code, so why use Records?**

### Comparison

| Aspect | Lombok | Records |
|--------|--------|---------|
| **Library** | External (add dependency) | Built-in Java (no dependency) |
| **Restrictions** | Can add setters (not enforced) | No setters (enforced by Java) |
| **Transparency** | Can hide fields | All data in header (transparent) |
| **Integration** | Works with other features | Native Java (works with sealed, pattern matching) |
| **Future enhancements** | Limited | Full Java language support |

### Key Advantages of Records

1. **No External Dependency:**
   - Records are **built into Java**
   - No need to add library to `pom.xml`

2. **Enforced Immutability:**
   - Lombok: Can still add setters manually
   - Records: **Cannot add setters** (enforced by language)

3. **Transparent Data Carrier:**
   - All data visible in header
   - Clear what data the record carries

4. **Language Integration:**
   - Works with **sealed classes**
   - Works with **pattern matching**
   - Future Java features will support records

5. **Better Tooling:**
   - IDE support built-in
   - Reflection API support
   - Better debugging

### When to Use Which?

**Use Records when:**
- Simple immutable data classes
- Want built-in Java feature
- Need transparency
- Working with sealed classes/pattern matching

**Use Lombok when:**
- Need mutable classes (with setters)
- Complex classes with business logic
- Already using Lombok in project
- Need more flexibility

---

## Summary

### Key Concepts

1. **Records:**
   - **Immutable data carrier** classes
   - **Minimal syntax:** `record Name(components) { }`
   - **Automatic generation:** Constructor, getters, equals, hashCode, toString

2. **Record Components:**
   - Fields declared in header
   - Become `private final` automatically
   - Cannot add instance fields (only static)

3. **Constructors:**
   - **Canonical constructor** (auto-generated)
   - Can override (full or compact form)
   - Additional constructors must call canonical

4. **Accessor Methods:**
   - Named after component (`name()`, not `getName()`)
   - Can override if needed

5. **Nested Records:**
   - Always static (cannot be non-static)
   - Similar to nested classes

6. **Local Records:**
   - Defined in method/block
   - No access modifiers
   - Scope limited to block

---

## Key Takeaways

1. **Records** = Immutable data carrier classes (Java 16)
2. **Minimal syntax** = `record Name(components) { }`
3. **Auto-generated** = Constructor, getters, equals, hashCode, toString
4. **Transparent** = All data visible in header
5. **No setters** = Enforced immutability
6. **Accessor methods** = Named after component (`name()`, not `getName()`)
7. **Nested records** = Always static
8. **Records vs Lombok** = Records are built-in, enforced immutability, better integration

---

## Interview Questions

1. **What are Records in Java?**  
   Special kind of class designed to be transparent data carriers. Reduces boilerplate code for immutable POJOs.

2. **What gets automatically generated in a Record?**  
   Final class, private final fields, canonical constructor, accessor methods, equals(), hashCode(), toString().

3. **What is a record component?**  
   Fields declared in the record header. They become private final fields automatically.

4. **Can you add instance fields to a record?**  
   No, only record components. Can add static fields.

5. **What is a canonical constructor?**  
   Constructor that takes all record components in order. Automatically generated, can be overridden.

6. **What is a compact constructor?**  
   Shorthand form of canonical constructor. No parameter list, compiler adds assignment automatically.

7. **How are accessor methods named in records?**  
   Named after the component (e.g., `name()`, not `getName()`).

8. **Can nested records be non-static?**  
   No, nested records are always static (to maintain transparency).

9. **What is the difference between Records and Lombok?**  
   Records are built-in Java (no dependency), enforced immutability. Lombok is external library, more flexible.

10. **Why use Records instead of Lombok?**  
    No external dependency, enforced immutability, better language integration (sealed classes, pattern matching), transparent data carrier.

