# Java Lombok Library

## Table of Contents
- [What is Lombok?](#what-is-lombok)
- [Setup and Configuration](#setup-and-configuration)
- [Top 10 Lombok Features](#top-10-lombok-features)
- [Summary](#summary)

---

## What is Lombok?

### Definition

**Lombok** is a **Java library** that helps reduce **boilerplate code** using annotations.

**Key Points:**
- **Processes annotations** during compilation
- **Injects code** into Java classes automatically
- **Reduces unnecessary code** (getters, setters, constructors, etc.)
- **Compatible** with Java 6 and all later versions

### Purpose

**Problem:** Java requires writing a lot of boilerplate code (getters, setters, constructors, toString, equals, hashCode, etc.)

**Solution:** Lombok generates this code automatically using annotations.

**Example:**
```java
// Without Lombok (lots of boilerplate)
public class User {
    private String name;
    private int age;
    
    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    
    @Override
    public String toString() { ... }
    @Override
    public boolean equals(Object o) { ... }
    @Override
    public int hashCode() { ... }
}

// With Lombok (minimal code)
@Getter
@Setter
@ToString
@EqualsAndHashCode
@AllArgsConstructor
public class User {
    private String name;
    private int age;
}
```

---

## Setup and Configuration

### 1. Add Dependency (Maven)

**Add to `pom.xml`:**
```xml
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <version>1.18.30</version>
    <scope>provided</scope>
</dependency>
```

### 2. IDE Plugin Setup

**For IntelliJ IDEA:**
1. Go to **Settings** → **Plugins**
2. Search for **"Lombok"**
3. Install the plugin
4. Go to **Settings** → **Build, Execution, Deployment** → **Compiler** → **Annotation Processors**
5. Enable **"Annotation Processing"**

**Why needed?**
- IDE doesn't know what Lombok will generate at compile time
- Plugin helps IDE understand Lombok annotations
- Prevents false compilation errors in IDE

**Without Plugin:**
```java
val name = "Hello";  // ❌ IDE shows error (red line)
// But code compiles and runs fine!
```

**With Plugin:**
```java
val name = "Hello";  // ✅ No error, IDE understands
```

---

## Top 10 Lombok Features

### 1. val and var

**Purpose:** Type inference for local variables.

**val:**
- **Immutable** (makes variable `final`)
- **Type inferred** from initialization expression
- **Local variables only** (not fields or parameters)

**var:**
- **Mutable** (not final)
- **Type inferred** from initialization expression
- **Local variables only**

**Example:**
```java
public void example() {
    val name = "Hello";  // final String name = "Hello";
    // name = "World";  // ❌ Error: cannot assign to final variable
    
    var count = 10;  // int count = 10;
    count = 20;  // ✅ Allowed (not final)
    
    val list = new ArrayList<String>();  // final ArrayList<String> list
    list.add("Item");  // ✅ Allowed (list is final, but contents can change)
}
```

**Key Points:**
- **Only for local variables** (inside methods/blocks)
- **Cannot use for fields or parameters**
- **val** = final, **var** = mutable

---

### 2. @NonNull

**Purpose:** Generates null check and throws `NullPointerException` if value is null.

**Usage:** On method or constructor parameters.

**Example:**
```java
public void printName(@NonNull String name) {
    System.out.println(name);
}

// Generated code:
public void printName(String name) {
    if (name == null) {
        throw new NullPointerException("name is marked non-null but is null");
    }
    System.out.println(name);
}
```

**Key Points:**
- **Only on parameters** (method or constructor)
- **Throws NPE** with descriptive message
- **Compile-time safety** (prevents null values)

---

### 3. @Getter and @Setter

**Purpose:** Automatically generates getter and setter methods.

**Usage:** On fields or class level.

**Example - Field Level:**
```java
public class User {
    @Getter
    @Setter
    private String name;
    
    @Getter
    @Setter
    private boolean committeeMember;
}

// Generated:
// public String getName() { return name; }
// public void setName(String name) { this.name = name; }
// public boolean isCommitteeMember() { return committeeMember; }
// public void setCommitteeMember(boolean committeeMember) { ... }
```

**Example - Class Level:**
```java
@Getter
@Setter
public class User {
    private String name;
    private boolean committeeMember;
    private static int count;  // Static field - no getter/setter
    private final int id;  // Final field - no setter, only getter
}

// Generated:
// - getter/setter for name
// - getter/setter for committeeMember
// - getter for id (no setter - final)
// - No getter/setter for count (static)
```

**Access Level Control:**
```java
public class User {
    @Getter(AccessLevel.PRIVATE)
    @Setter(AccessLevel.PROTECTED)
    private String name;
    
    @Getter  // Default: PUBLIC
    @Setter  // Default: PUBLIC
    private boolean committeeMember;
}
```

**Exclude Fields:**
```java
@Getter
@Setter
public class User {
    @Setter(AccessLevel.NONE)  // No setter for name
    private String name;
    
    private boolean committeeMember;  // Both getter and setter
}
```

**Key Points:**
- **Class level:** Applied to all non-static fields
- **Setter:** Only for non-static, non-final fields
- **Getter:** For all non-static fields
- **Boolean getter:** Uses `is` prefix (e.g., `isCommitteeMember()`)

---

### 4. @ToString

**Purpose:** Generates `toString()` method.

**Example:**
```java
@ToString
public class User {
    private String name;
    private int age;
    private boolean committeeMember;
}

// Generated:
// public String toString() {
//     return "User(name=" + name + ", age=" + age + ", committeeMember=" + committeeMember + ")";
// }
```

**Exclude Fields:**
```java
@ToString(exclude = "committeeMember")
public class User {
    private String name;
    private int age;
    private boolean committeeMember;  // Excluded from toString
}
```

**Include Field Names:**
```java
@ToString(includeFieldNames = false)
public class User {
    private String name;
    private int age;
}
// Output: "User(John, 25)" instead of "User(name=John, age=25)"
```

**Explicit Include:**
```java
@ToString(onlyExplicitlyIncluded = true)
public class User {
    @ToString.Include
    private String name;  // Only this included
    
    private int age;  // Excluded
    private boolean committeeMember;  // Excluded
}
```

---

### 5. @NoArgsConstructor, @AllArgsConstructor, @RequiredArgsConstructor

**Purpose:** Generates constructors automatically.

**@NoArgsConstructor:**
- Generates **no-argument constructor**

**@AllArgsConstructor:**
- Generates constructor with **all fields** as parameters

**@RequiredArgsConstructor:**
- Generates constructor with **final and @NonNull fields** only

**Example:**
```java
@NoArgsConstructor
@AllArgsConstructor
@RequiredArgsConstructor
public class User {
    private String name;
    private boolean committeeMember;
    @NonNull
    private Integer age;
}

// Generated:
// 1. NoArgsConstructor: User() { }
// 2. AllArgsConstructor: User(String name, boolean committeeMember, Integer age) {
//        if (age == null) throw new NullPointerException("age is marked non-null but is null");
//        this.name = name;
//        this.committeeMember = committeeMember;
//        this.age = age;
//    }
// 3. RequiredArgsConstructor: User(Integer age) {
//        if (age == null) throw new NullPointerException("age is marked non-null but is null");
//        this.age = age;
//    }
```

**Key Points:**
- **@NonNull on field:** Adds null check in constructor
- **@RequiredArgsConstructor:** Only final and @NonNull fields
- **All constructors:** Include null checks for @NonNull fields

---

### 6. @EqualsAndHashCode

**Purpose:** Generates `equals()` and `hashCode()` methods.

**Default:** Uses all non-static, non-transient fields.

**Example:**
```java
@EqualsAndHashCode
public class User {
    private String name;
    private int age;
    private boolean committeeMember;
    private static int count;  // Excluded (static)
    private transient String temp;  // Excluded (transient)
}

// Generated equals() and hashCode() using name, age, committeeMember
```

**Exclude Fields:**
```java
@EqualsAndHashCode(exclude = "committeeMember")
public class User {
    private String name;
    private int age;
    private boolean committeeMember;  // Excluded
}
```

**Include Fields:**
```java
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class User {
    @EqualsAndHashCode.Include
    private String name;  // Only this included
    
    private int age;  // Excluded
}
```

**Key Points:**
- **Follows contract:** equals() and hashCode() contract maintained
- **Excludes:** Static and transient fields by default
- **Can exclude/include** specific fields

---

### 7. @Data

**Purpose:** **Shortcut** for multiple annotations.

**Equivalent to:**
- `@ToString`
- `@EqualsAndHashCode`
- `@Getter` (on all fields)
- `@Setter` (on all non-final fields)
- `@RequiredArgsConstructor`

**Example:**
```java
@Data
public class User {
    private String name;
    private final int age;
    @NonNull
    private String address;
}

// Generated:
// - toString()
// - equals() and hashCode()
// - getter for all fields (getName(), getAge(), getAddress())
// - setter for non-final fields (setName(), setAddress()) - no setter for age
// - RequiredArgsConstructor (age, address) with null check for address
```

**Key Points:**
- **All-in-one annotation** (reduces boilerplate significantly)
- **Most commonly used** in production code
- **Setters only** for non-final fields

---

### 8. @Value

**Purpose:** **Immutable version** of `@Data`.

**What it does:**
- Makes **all fields private and final**
- Makes **class final** (cannot be subclassed)
- Generates **getters** (no setters - fields are final)
- Generates **toString()**, **equals()**, **hashCode()**
- Generates **all-args constructor** (all fields are final)

**Example:**
```java
@Value
public class User {
    private String name;
    private int age;
    private String address;
}

// Generated:
// - final class User
// - private final String name;
// - private final int age;
// - private final String address;
// - AllArgsConstructor: User(String name, int age, String address)
// - Getters: getName(), getAge(), getAddress()
// - No setters (fields are final)
// - toString(), equals(), hashCode()
```

**Key Points:**
- **Immutable class** (all fields final)
- **No setters** (fields cannot be changed)
- **All-args constructor** (required to initialize all final fields)

---

### 9. @Builder

**Purpose:** Implements **Builder Pattern** automatically.

**What it does:**
- Creates **Builder class**
- Allows **step-by-step object creation**
- Helps achieve **immutability**

**Example:**
```java
@Builder
public class User {
    private String name;
    private int age;
    private String address;
}

// Usage:
User user = User.builder()
    .name("John")
    .age(25)
    .address("123 Street")
    .build();

// Generated Builder class:
// public static class UserBuilder {
//     private String name;
//     private int age;
//     private String address;
//     
//     public UserBuilder name(String name) { this.name = name; return this; }
//     public UserBuilder age(int age) { this.age = age; return this; }
//     public UserBuilder address(String address) { this.address = address; return this; }
//     public User build() { return new User(name, age, address); }
// }
```

**Key Points:**
- **Fluent API** (method chaining)
- **Immutable object** (no setters in User class)
- **Step-by-step construction**

---

### 10. @Cleanup

**Purpose:** Ensures **automatic resource cleanup** (like try-with-resources).

**Usage:** On local variables that need cleanup (e.g., FileInputStream, Connection).

**Example:**
```java
public void readFile() {
    @Cleanup FileInputStream fis = new FileInputStream("file.txt");
    // Read data
    // Automatically closed in finally block
}

// Generated:
// FileInputStream fis = new FileInputStream("file.txt");
// try {
//     // Read data
// } finally {
//     if (fis != null) {
//         fis.close();
//     }
// }
```

**Key Points:**
- **Automatic cleanup** in finally block
- **Prevents resource leaks**
- **Alternative to try-with-resources**

---

## Summary

### Lombok Features Summary

| Feature | Purpose | Key Point |
|---------|---------|-----------|
| **val/var** | Type inference | Local variables only, val is final |
| **@NonNull** | Null check | Throws NPE if null |
| **@Getter/@Setter** | Accessor methods | Can control access level |
| **@ToString** | toString() method | Can exclude/include fields |
| **@NoArgsConstructor** | No-arg constructor | - |
| **@AllArgsConstructor** | All-args constructor | - |
| **@RequiredArgsConstructor** | Required args constructor | Only final and @NonNull |
| **@EqualsAndHashCode** | equals() and hashCode() | Follows contract |
| **@Data** | All-in-one | Most commonly used |
| **@Value** | Immutable class | All fields final |
| **@Builder** | Builder pattern | Step-by-step construction |
| **@Cleanup** | Resource cleanup | Automatic finally block |

### Setup Requirements

1. **Add dependency** to `pom.xml`
2. **Install IDE plugin** (IntelliJ)
3. **Enable annotation processing** in IDE settings

### Best Practices

- **Use @Data** for POJOs (most common)
- **Use @Value** for immutable classes
- **Use @Builder** for complex object construction
- **Always enable IDE plugin** (better development experience)

---

## Key Takeaways

1. **Lombok** = Reduces boilerplate code using annotations
2. **Setup required:** Dependency + IDE plugin + annotation processing
3. **@Data** = Most commonly used (all-in-one)
4. **@Value** = Immutable version of @Data
5. **@Builder** = Builder pattern implementation
6. **val/var** = Type inference (local variables only)
7. **@NonNull** = Null safety on parameters

---

## Interview Questions

1. **What is Lombok?**  
   Java library that reduces boilerplate code using annotations. Processes annotations at compile time.

2. **How does Lombok work?**  
   Processes annotations during compilation and injects code (getters, setters, constructors, etc.) into classes.

3. **What setup is required for Lombok?**  
   Add dependency to pom.xml, install IDE plugin, enable annotation processing.

4. **What is the difference between @Data and @Value?**  
   @Data generates mutable class with getters/setters. @Value generates immutable class (all fields final, no setters).

5. **What is @Builder?**  
   Implements Builder pattern - allows step-by-step object construction with fluent API.

6. **What is val vs var?**  
   val makes variable final (immutable), var is mutable. Both infer type from initialization.

7. **What is @RequiredArgsConstructor?**  
   Generates constructor with only final and @NonNull fields as parameters.

8. **Can Lombok be used for fields and parameters?**  
   val/var only work for local variables. Other annotations work on fields/classes.

9. **What is @Cleanup?**  
   Ensures automatic resource cleanup (closes resources in finally block).

10. **Why use Lombok instead of writing code manually?**  
    Reduces boilerplate code significantly, improves readability, reduces errors, faster development.

