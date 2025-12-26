# Java 14: Switch Enhancements

## Table of Contents
- [Problems with Old Switch Statement](#problems-with-old-switch-statement)
- [Java 14 Switch Features](#java-14-switch-features)
- [Switch Expression](#switch-expression)
- [Arrow Syntax](#arrow-syntax)
- [Yield Statement](#yield-statement)
- [Exhaustiveness Check](#exhaustiveness-check)
- [Scope Isolation](#scope-isolation)
- [Summary](#summary)

---

## Problems with Old Switch Statement

### 1. Multiple Lines for Case Stacking

**Old Way:**
```java
switch (day) {
    case MONDAY:
    case FRIDAY:
    case SUNDAY:
        System.out.println("6 characters");
        break;
    case TUESDAY:
        System.out.println("7 characters");
        break;
    case THURSDAY:
    case SATURDAY:
        System.out.println("8 characters");
        break;
}
```

**Problem:** Each case needs its own line (verbose).

---

### 2. Fall-Through by Default

**Problem:** Missing `break` causes fall-through to next case.

**Example:**
```java
switch (day) {
    case MONDAY:
    case FRIDAY:
    case SUNDAY:
        System.out.println("6");
        // ❌ Missing break - falls through!
    case TUESDAY:
        System.out.println("7");
        break;
}

// If day = FRIDAY, output: "6" and "7" (unintended!)
```

**Issue:** Easy to forget `break` → bugs.

---

### 3. No Value Return

**Old Way:**
```java
int count = 0;
switch (day) {
    case MONDAY:
    case FRIDAY:
    case SUNDAY:
        count = 6;
        break;
    case TUESDAY:
        count = 7;
        break;
    // ...
}
System.out.println(count);
```

**Problem:** Cannot return value directly from switch.

---

### 4. No Exhaustiveness Check

**Problem:** Compiler doesn't force covering all enum values.

**Example:**
```java
enum Day { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY }

int count = 0;
switch (day) {
    case MONDAY:
        count = 6;
        break;
    case TUESDAY:
        count = 7;
        break;
    // ❌ Missing other cases - no compiler error!
}
// If day = FRIDAY, count remains 0 (unintended default)
```

---

### 5. Shared Scope

**Problem:** All case blocks share the same scope.

**Example:**
```java
switch (day) {
    case MONDAY:
        String val = "Monday";  // Variable declared
        System.out.println(val);
        break;
    case TUESDAY:
        String val = "Tuesday";  // ❌ Error: variable already defined!
        System.out.println(val);
        break;
}
```

**Solution:** Need explicit blocks:
```java
switch (day) {
    case MONDAY: {
        String val = "Monday";
        System.out.println(val);
        break;
    }
    case TUESDAY: {
        String val = "Tuesday";  // ✅ OK - different scope
        System.out.println(val);
        break;
    }
}
```

---

## Java 14 Switch Features

### 1. Comma-Separated Case Labels

**New Way:**
```java
switch (day) {
    case MONDAY, FRIDAY, SUNDAY:
        System.out.println("6 characters");
        break;
    case TUESDAY:
        System.out.println("7 characters");
        break;
    case THURSDAY, SATURDAY:
        System.out.println("8 characters");
        break;
}
```

**Benefit:** Cleaner, less verbose.

---

## Arrow Syntax

### What is Arrow Syntax?

**New form of switch label:** `case label ->`

**Meaning:** Only execute code on the **right-hand side** of the arrow.

**Key Point:** **No fall-through** - automatically breaks.

### Syntax

**Old Way (Colon):**
```java
case MONDAY:
    System.out.println("Monday");
    break;  // Required
```

**New Way (Arrow):**
```java
case MONDAY -> System.out.println("Monday");
// No break needed - no fall-through!
```

### Example

**Old Way:**
```java
switch (day) {
    case MONDAY:
    case FRIDAY:
    case SUNDAY:
        System.out.println("6");
        break;  // Required
    case TUESDAY:
        System.out.println("7");
        break;  // Required
}
```

**New Way:**
```java
switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> System.out.println("6");
    case TUESDAY -> System.out.println("7");
    // No break needed!
}
```

### Multiple Statements with Arrow

**Use block `{}` for multiple statements:**
```java
switch (day) {
    case MONDAY -> {
        System.out.println("Monday");
        System.out.println("Weekday");
    }
    case TUESDAY -> System.out.println("Tuesday");
}
```

### Mixing Colon and Arrow

**You can mix both (but be careful):**

```java
switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> System.out.println("6");
    case TUESDAY:  // Colon - fall-through possible!
        System.out.println("7");
        break;  // Required with colon
    case WEDNESDAY -> System.out.println("9");
}
```

**Key Rules:**
- **Arrow (`->`):** No fall-through, no break needed
- **Colon (`:`):** Fall-through possible, break required

---

## Switch Expression

### What is Switch Expression?

**Switch can now return a value** (like an expression).

**Syntax:**
```java
int count = switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> 6;
    case TUESDAY -> 7;
    case THURSDAY, SATURDAY -> 8;
    case WEDNESDAY -> 9;
};
```

**Key Points:**
- **Returns value** (assigned to variable)
- **Semicolon required** (end of expression)
- **Each case must return** a value or throw exception

### Single Statement

**If single statement, value is automatically returned:**
```java
int count = switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> 6;  // Returns 6
    case TUESDAY -> 7;  // Returns 7
    case WEDNESDAY -> 9;  // Returns 9
};
```

### Multiple Statements (Block)

**Use `yield` keyword to return value:**
```java
int count = switch (day) {
    case MONDAY, FRIDAY, SUNDAY -> {
        if (day == Day.SUNDAY) {
            throw new IllegalArgumentException("Sunday is holiday");
        }
        yield 6;  // Return value
    }
    case TUESDAY -> 7;  // Single statement - auto return
    case THURSDAY, SATURDAY -> 8;
    case WEDNESDAY -> 9;
};
```

**Key Points:**
- **Block `{}`** needed for multiple statements
- **`yield`** keyword to return value
- **Each case must complete** (return or throw)

### Using Colon with Yield

**You can use colon syntax with `yield`:**
```java
int count = switch (day) {
    case MONDAY, FRIDAY, SUNDAY:
        yield 6;  // Return value
    case TUESDAY:
        yield 7;
    default:
        yield 0;
};
```

**Important:** With colon, you can use `yield` instead of `break` to return value.

---

## Yield Statement

### What is Yield?

**`yield`** is a keyword that **returns a value** from a switch expression.

**Usage:**
- **In blocks** with multiple statements
- **With colon syntax** (alternative to break)
- **Returns value** to the switch expression

### Examples

**Block with yield:**
```java
int count = switch (day) {
    case MONDAY -> {
        System.out.println("Monday");
        yield 6;  // Return 6
    }
    case TUESDAY -> 7;  // Auto return (single statement)
};
```

**Colon with yield:**
```java
int count = switch (day) {
    case MONDAY:
        yield 6;  // Return 6 (instead of break)
    case TUESDAY:
        yield 7;
    default:
        yield 0;
};
```

**Key Points:**
- **`yield`** = Return value from switch
- **`break`** = Exit switch (for statements)
- **Cannot use both** in same case

---

## Exhaustiveness Check

### What is Exhaustiveness?

**When using switch as expression**, compiler **forces** you to cover all possible cases.

### Example

**Enum:**
```java
enum Day { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY }
```

**Switch Statement (No Exhaustiveness Check):**
```java
switch (day) {
    case MONDAY:
        System.out.println("Monday");
        break;
    case TUESDAY:
        System.out.println("Tuesday");
        break;
    // ❌ Missing cases - no compiler error (statement)
}
```

**Switch Expression (Exhaustiveness Check):**
```java
int count = switch (day) {
    case MONDAY -> 6;
    case TUESDAY -> 7;
    // ❌ Compilation error: switch expression does not cover all possible input values
};
```

### Solutions

**1. Cover All Cases:**
```java
int count = switch (day) {
    case MONDAY -> 6;
    case TUESDAY -> 7;
    case WEDNESDAY -> 9;
    case THURSDAY -> 8;
    case FRIDAY -> 6;
    case SATURDAY -> 8;
    case SUNDAY -> 6;
};
```

**2. Use Default:**
```java
int count = switch (day) {
    case MONDAY -> 6;
    case TUESDAY -> 7;
    default -> 0;  // Handles all other cases
};
```

**3. Throw Exception in Default:**
```java
int count = switch (day) {
    case MONDAY -> 6;
    case TUESDAY -> 7;
    default -> throw new IllegalArgumentException("Not allowed");
};
```

**Key Point:** Exhaustiveness check **only applies to switch expressions**, not switch statements.

---

## Scope Isolation

### Problem Solved

**Old Switch:** All case blocks share the same scope.

**New Switch (Arrow):** Each case has **independent scope**.

### Example

**Old Way (Shared Scope):**
```java
switch (day) {
    case MONDAY:
        String val = "Monday";  // Variable
        System.out.println(val);
        break;
    case TUESDAY:
        String val = "Tuesday";  // ❌ Error: already defined
        System.out.println(val);
        break;
}
```

**New Way (Isolated Scope):**
```java
switch (day) {
    case MONDAY -> {
        String val = "Monday";  // Independent scope
        System.out.println(val);
    }
    case TUESDAY -> {
        String val = "Tuesday";  // ✅ OK - different scope
        System.out.println(val);
    }
}
```

**Key Point:** Arrow syntax provides **scope isolation** automatically.

---

## Summary

### Java 14 Switch Features

1. **Comma-Separated Cases:**
   - `case MONDAY, FRIDAY, SUNDAY ->` (cleaner)

2. **Arrow Syntax:**
   - `case label ->` (no fall-through, no break needed)

3. **Switch Expression:**
   - Can return value: `int count = switch (day) { ... }`

4. **Yield Statement:**
   - Returns value from switch: `yield 6;`

5. **Exhaustiveness Check:**
   - Compiler forces covering all cases (for expressions)

6. **Scope Isolation:**
   - Each case has independent scope (with arrow)

### Comparison

| Feature | Old Switch | New Switch |
|---------|------------|------------|
| **Case grouping** | Multiple lines | Comma-separated |
| **Fall-through** | Default (needs break) | No (arrow syntax) |
| **Return value** | ❌ No | ✅ Yes (expression) |
| **Exhaustiveness** | ❌ No check | ✅ Checked (expressions) |
| **Scope** | Shared | Isolated (arrow) |

---

## Key Takeaways

1. **Arrow syntax (`->`)** = No fall-through, no break needed
2. **Colon syntax (`:`)** = Fall-through possible, break required
3. **Switch expression** = Can return value
4. **`yield`** = Return value from switch (in blocks)
5. **Exhaustiveness** = Compiler checks all cases covered (expressions only)
6. **Scope isolation** = Each case has own scope (arrow syntax)

---

## Interview Questions

1. **What are the main improvements in Java 14 switch?**  
   Arrow syntax, switch expressions, comma-separated cases, yield statement, exhaustiveness check, scope isolation.

2. **What is the difference between arrow (`->`) and colon (`:`) in switch?**  
   Arrow has no fall-through (no break needed), colon has fall-through (break required).

3. **What is a switch expression?**  
   Switch that returns a value (can be assigned to variable).

4. **What is the `yield` keyword?**  
   Returns a value from switch expression (used in blocks or with colon syntax).

5. **What is exhaustiveness check?**  
   Compiler forces covering all possible cases (only for switch expressions, not statements).

6. **How does scope isolation work?**  
   Each case with arrow syntax has independent scope (variables don't conflict).

7. **Can you mix arrow and colon syntax?**  
   Yes, but be careful - colon allows fall-through, arrow doesn't.

8. **When do you need `yield`?**  
   When using blocks `{}` in switch expression or when using colon syntax to return value.

9. **What happens if you forget `break` with arrow syntax?**  
   Nothing - arrow syntax doesn't fall through, so break is not needed.

10. **What is the difference between switch statement and switch expression?**  
    Statement executes code, expression returns a value. Expression requires exhaustiveness check.

