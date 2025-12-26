# Java Control Flow Statements

## Table of Contents
- [Introduction](#introduction)
- [Decision Making Statements](#decision-making-statements)
  - [Simple If Statement](#simple-if-statement)
  - [If-Else Statement](#if-else-statement)
  - [If-Else-If Ladder](#if-else-if-ladder)
  - [Nested If Statement](#nested-if-statement)
  - [Switch Statement](#switch-statement)
  - [Switch Expression (Java 12+)](#switch-expression-java-12)
- [Iterative Statements](#iterative-statements)
  - [For Loop](#for-loop)
  - [Nested For Loop](#nested-for-loop)
  - [While Loop](#while-loop)
  - [Do-While Loop](#do-while-loop)
  - [For-Each Loop (Enhanced For Loop)](#for-each-loop-enhanced-for-loop)
- [Branching Statements](#branching-statements)
  - [Break Statement](#break-statement)
  - [Continue Statement](#continue-statement)
- [Summary](#summary)

---

## Introduction

**Control Flow Statements** control the **order of execution** of statements in a program.

**Three Types:**
1. **Decision Making Statements** - Choose which code to execute (if, if-else, switch)
2. **Iterative Statements** - Repeat code execution (for, while, do-while, for-each)
3. **Branching Statements** - Alter flow of loops (break, continue)

---

## Decision Making Statements

### Simple If Statement

**Purpose:** Execute code block **only if condition is true**.

**Syntax:**
```java
if (condition) {
    // Code to execute if condition is true
}
// Code after if block (always executes)
```

**Flow Diagram:**
```
Start
  │
  ▼
Evaluate Condition
  │
  ├─ true ──► Execute if block ──► Continue
  │
  └─ false ──► Skip if block ──► Continue
```

**Example:**
```java
public class IfExample {
    public static void main(String[] args) {
        int value = 10;
        
        if (value > 8) {
            System.out.println("Value is greater than 8");
        }
        
        System.out.println("Rest of the code");
    }
}
```

**Output:**
```
Value is greater than 8
Rest of the code
```

**Key Points:**
- Condition must evaluate to `boolean` (true or false)
- If condition is `true`, if block executes
- If condition is `false`, if block is skipped
- Code after if block always executes

---

### If-Else Statement

**Purpose:** Execute one block if condition is true, another if false.

**Syntax:**
```java
if (condition) {
    // Code if condition is true
} else {
    // Code if condition is false
}
// Code after if-else (always executes)
```

**Flow Diagram:**
```
Start
  │
  ▼
Evaluate Condition
  │
  ├─ true ──► Execute if block ──► Continue
  │
  └─ false ──► Execute else block ──► Continue
```

**Example:**
```java
public class IfElseExample {
    public static void main(String[] args) {
        int value = 7;
        
        if (value > 8) {
            System.out.println("Value is greater than 8");
        } else {
            System.out.println("Value is less than or equal to 8");
        }
        
        System.out.println("Rest of the code");
    }
}
```

**Output:**
```
Value is less than or equal to 8
Rest of the code
```

**Key Points:**
- Exactly one block executes (if or else)
- Condition determines which block runs
- Code after if-else always executes

---

### If-Else-If Ladder

**Purpose:** Chain multiple conditions, execute first matching block.

**Syntax:**
```java
if (condition1) {
    // Code if condition1 is true
} else if (condition2) {
    // Code if condition2 is true
} else if (condition3) {
    // Code if condition3 is true
} else {
    // Code if all conditions are false (optional)
}
```

**Flow Diagram:**
```
Start
  │
  ▼
Check condition1
  │
  ├─ true ──► Execute block1 ──► Exit
  │
  └─ false ──► Check condition2
                │
                ├─ true ──► Execute block2 ──► Exit
                │
                └─ false ──► Check condition3
                              │
                              ├─ true ──► Execute block3 ──► Exit
                              │
                              └─ false ──► Execute else block ──► Exit
```

**Example:**
```java
public class IfElseIfExample {
    public static void main(String[] args) {
        int value = 13;
        
        if (value == 1) {
            System.out.println("Value is 1");
        } else if (value == 2) {
            System.out.println("Value is 2");
        } else if (value == 3) {
            System.out.println("Value is 3");
        } else {
            System.out.println("Value is " + value);
        }
    }
}
```

**Output:**
```
Value is 13
```

**Key Points:**
- Evaluates from **top to bottom**
- Executes **first matching condition**
- `else` block is **optional**
- Only **one block** executes (first match)

---

### Nested If Statement

**Purpose:** If-else statement **inside** another if-else block.

**Syntax:**
```java
if (condition1) {
    // Outer if block
    if (condition2) {
        // Inner if block
    } else {
        // Inner else block
    }
} else {
    // Outer else block
    if (condition3) {
        // Another inner if block
    }
}
```

**Flow Diagram:**
```
Start
  │
  ▼
Check condition1
  │
  ├─ true ──► Enter outer if block
  │           │
  │           ▼
  │      Check condition2
  │           │
  │           ├─ true ──► Execute inner if
  │           │
  │           └─ false ──► Execute inner else
  │
  └─ false ──► Enter outer else block
                │
                ▼
           Check condition3
                │
                ├─ true ──► Execute inner if
                │
                └─ false ──► Continue
```

**Example:**
```java
public class NestedIfExample {
    public static void main(String[] args) {
        int value = 13;
        
        if (value > 8) {
            System.out.println("Value is greater than 8");
            
            // Nested if-else
            if (value < 15) {
                System.out.println("Value is greater than 8, but less than 15");
            } else {
                System.out.println("Value is greater than or equal to 15");
            }
        } else {
            System.out.println("Value is less than or equal to 8");
        }
    }
}
```

**Output:**
```
Value is greater than 8
Value is greater than 8, but less than 15
```

**Key Points:**
- Can nest **any number of levels**
- Can nest in both `if` and `else` blocks
- Inner conditions evaluated only if outer condition is true
- Useful for complex conditional logic

---

## Switch Statement

**Purpose:** Similar to if-else-if ladder, but more efficient for multiple constant comparisons.

**Syntax:**
```java
switch (expression) {
    case value1:
        // Code for value1
        break;
    case value2:
        // Code for value2
        break;
    case value3:
        // Code for value3
        break;
    default:
        // Code if no case matches (optional)
        break;
}
```

**Flow Diagram:**
```
Start
  │
  ▼
Evaluate expression
  │
  ▼
Compare with case value1
  │
  ├─ Match ──► Execute case1 ──► break? ──► Exit switch
  │
  └─ No Match ──► Compare with case value2
                    │
                    ├─ Match ──► Execute case2 ──► break? ──► Exit switch
                    │
                    └─ No Match ──► Compare with case value3
                                      │
                                      ├─ Match ──► Execute case3 ──► break? ──► Exit switch
                                      │
                                      └─ No Match ──► Execute default ──► Exit switch
```

**Example:**
```java
public class SwitchExample {
    public static void main(String[] args) {
        int a = 1;
        int b = 2;
        int result = a + b;  // result = 3
        
        switch (result) {
            case 1:
                System.out.println("a + b is 1");
                break;
            case 2:
                System.out.println("a + b is 2");
                break;
            case 3:
                System.out.println("a + b is 3");
                break;
            default:
                System.out.println("a + b is " + result);
        }
    }
}
```

**Output:**
```
a + b is 3
```

### Important Points About Switch

#### 1. Break Statement

**Without Break:**
```java
int value = 3;

switch (value) {
    case 3:
        System.out.println("Value is 3");
        // No break - continues to next case
    case 4:
        System.out.println("Value is 4");
        // No break - continues to default
    default:
        System.out.println("Value is " + value);
}
```

**Output:**
```
Value is 3
Value is 4
Value is 3
```

**With Break:**
```java
int value = 3;

switch (value) {
    case 3:
        System.out.println("Value is 3");
        break;  // Exit switch
    case 4:
        System.out.println("Value is 4");
        break;
    default:
        System.out.println("Default");
}
```

**Output:**
```
Value is 3
```

**Key Point:** Without `break`, execution **falls through** to next cases.

#### 2. Default Can Be Anywhere

**Example:**
```java
int value = 3;

switch (value) {
    case 1:
        System.out.println("One");
        break;
    default:  // Default at top
        System.out.println("Default");
        break;
    case 2:
        System.out.println("Two");
        break;
    case 3:
        System.out.println("Three");
        break;
}
```

**Note:** If `default` is not at the end, use `break` (not optional).

#### 3. Combining Cases

**Multiple cases with same code:**

**Method 1: Separate cases, same code**
```java
String month = "March";

switch (month) {
    case "January":
    case "February":
    case "March":
        System.out.println("Month is in Quarter 1");
        break;
    case "April":
        System.out.println("Month is in Quarter 2");
        break;
}
```

**Method 2: Comma-separated (Java 14+)**
```java
String month = "March";

switch (month) {
    case "January", "February", "March":
        System.out.println("Month is in Quarter 1");
        break;
    case "April":
        System.out.println("Month is in Quarter 2");
        break;
}
```

#### 4. Rules for Switch Statement

**Rule 1: No Duplicate Case Values**
```java
switch (value) {
    case 1:
        // Code
        break;
    case 1:  // ❌ ERROR: Duplicate case value
        // Code
        break;
}
```

**Rule 2: Expression and Case Value Must Have Same Type**
```java
String month = "March";

switch (month) {
    case "January":  // ✅ OK - both String
        break;
    case 2:  // ❌ ERROR - String vs int
        break;
}
```

**Rule 3: Case Value Must Be Literal or Constant**
```java
int value = 1;
final int CONSTANT = 2;

switch (value) {
    case 1:  // ✅ OK - literal
        break;
    case CONSTANT:  // ✅ OK - constant (final)
        break;
    case value:  // ❌ ERROR - variable (not constant)
        break;
}
```

**Rule 4: All Cases Need Not Be Handled**
```java
enum Day { MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY }

Day day = Day.FRIDAY;
int output = 0;

switch (day) {
    case MONDAY:
        output = 1;
        break;
    case TUESDAY:
    case WEDNESDAY:
    case THURSDAY:
        output = 2;
        break;
    // FRIDAY, SATURDAY, SUNDAY not handled - no error
}
// output = 0 (default value)
```

**Rule 5: Nested Switch is Possible**
```java
int outer = 1;
int inner = 2;

switch (outer) {
    case 1:
        switch (inner) {
            case 1:
                System.out.println("Inner 1");
                break;
            case 2:
                System.out.println("Inner 2");
                break;
        }
        break;
}
```

#### 5. Supported Data Types

**Switch supports 10 data types:**

**Primitive Types:**
- `byte`
- `short`
- `int`
- `char`

**Wrapper Types:**
- `Byte`
- `Short`
- `Integer`
- `Character`

**Other Types:**
- `String` (Java 7+)
- `enum`

**Not Supported:**
- `float`, `double` (floating-point)
- `long` (too large)
- `boolean`

**Why?** Switch uses `==` comparison, which works best with these types.

#### 6. Return Not Possible in Switch Statement

**Problem:**
```java
// ❌ Cannot return from switch statement
String output = switch (value) {
    case 1:
        return "One";  // ERROR: return not allowed
    default:
        return "Other";
};
```

**Solution:** Use **switch expression** (Java 12+)

---

## Switch Expression (Java 12+)

**Purpose:** Switch that **returns a value** (expression, not just statement).

**Note:** Requires **Java 12 or higher**. If using older JDK, switch expression won't work.

### Arrow Syntax (->)

**Syntax:**
```java
String result = switch (expression) {
    case value1 -> "Result 1";
    case value2 -> "Result 2";
    case value3 -> "Result 3";
    default -> "Default result";
};
```

**Example:**
```java
public class SwitchExpressionExample {
    public static void main(String[] args) {
        int value = 1;
        
        String output = switch (value) {
            case 1 -> "One";
            case 2 -> "Two";
            case 3 -> "Three";
            default -> "Other";
        };
        
        System.out.println(output);  // Prints: "One"
    }
}
```

**Key Points:**
- **No break needed** - arrow automatically returns and exits
- **Returns value** - can assign to variable
- **All cases must be handled** (or use default)
- **Cleaner syntax** - less error-prone

### Yield Statement

**Purpose:** Return value from switch expression when using **code blocks**.

**Syntax:**
```java
String result = switch (expression) {
    case value1 -> {
        // Multiple statements
        // Some logic
        yield "Result 1";  // Return value
    }
    case value2 -> "Result 2";  // Single expression (no yield needed)
    default -> {
        // Block with logic
        yield "Default";
    }
};
```

**Example:**
```java
public class SwitchYieldExample {
    public static void main(String[] args) {
        int value = 1;
        
        String output = switch (value) {
            case 1 -> {
                System.out.println("Processing case 1");
                // Some logic
                yield "One";  // Return value
            }
            case 2 -> {
                System.out.println("Processing case 2");
                yield "Two";
            }
            default -> "Other";  // Single expression, no yield needed
        };
        
        System.out.println(output);
    }
}
```

**Key Points:**
- Use `yield` when you have a **code block** `{}`
- Single expression (no block) doesn't need `yield`
- `yield` returns value and exits switch
- All possible cases must be handled

### Differences: Switch Statement vs Switch Expression

| Feature | Switch Statement | Switch Expression |
|---------|------------------|-------------------|
| **Returns Value?** | ❌ No | ✅ Yes |
| **Break Required?** | ✅ Yes (to prevent fall-through) | ❌ No (arrow returns automatically) |
| **All Cases Must Be Handled?** | ❌ No | ✅ Yes (or use default) |
| **Can Use Blocks?** | ✅ Yes | ✅ Yes (with yield) |
| **Java Version** | All versions | Java 12+ |

---

## Iterative Statements

**Purpose:** Repeat code execution multiple times.

**Types:**
1. **For Loop**
2. **While Loop**
3. **Do-While Loop**
4. **For-Each Loop**

### For Loop

**Purpose:** Execute code block **fixed number of times**.

**Syntax:**
```java
for (initialization; condition; increment/decrement) {
    // Code to repeat
}
```

**Flow Diagram:**
```
Start
  │
  ▼
Initialize variable
  │
  ▼
Check condition
  │
  ├─ true ──► Execute loop body
  │           │
  │           ▼
  │      Increment/Decrement
  │           │
  │           └─► Check condition (again)
  │
  └─ false ──► Exit loop
```

**Example:**
```java
public class ForLoopExample {
    public static void main(String[] args) {
        for (int value = 1; value <= 10; value++) {
            System.out.println(value);
        }
    }
}
```

**Output:**
```
1
2
3
4
5
6
7
8
9
10
```

**Step-by-Step Execution:**
```
Iteration 1: value = 1, 1 <= 10 (true) → Print 1 → value++ → value = 2
Iteration 2: value = 2, 2 <= 10 (true) → Print 2 → value++ → value = 3
...
Iteration 10: value = 10, 10 <= 10 (true) → Print 10 → value++ → value = 11
Iteration 11: value = 11, 11 <= 10 (false) → Exit loop
```

**Key Points:**
- **Initialization:** Executes once at start
- **Condition:** Checked before each iteration
- **Increment/Decrement:** Executes after each iteration
- All three parts are **optional** (can be empty)

### Nested For Loop

**Purpose:** Loop inside another loop.

**Syntax:**
```java
for (outer initialization; outer condition; outer increment) {
    for (inner initialization; inner condition; inner increment) {
        // Inner loop code
    }
    // Outer loop code
}
```

**Flow Diagram:**
```
Start
  │
  ▼
Initialize outer variable
  │
  ▼
Check outer condition
  │
  ├─ true ──► Initialize inner variable
  │           │
  │           ▼
  │      Check inner condition
  │           │
  │           ├─ true ──► Execute inner body
  │           │           │
  │           │           ▼
  │           │      Inner increment
  │           │           │
  │           │           └─► Check inner condition (repeat)
  │           │
  │           └─ false ──► Outer increment
  │                         │
  │                         └─► Check outer condition (repeat)
  │
  └─ false ──► Exit
```

**Example:**
```java
public class NestedForLoopExample {
    public static void main(String[] args) {
        for (int x = 1; x <= 3; x++) {
            for (int y = 1; y <= 3; y++) {
                System.out.print("(" + x + "," + y + ") ");
            }
            System.out.println();
        }
    }
}
```

**Output:**
```
(1,1) (1,2) (1,3)
(2,1) (2,2) (2,3)
(3,1) (3,2) (3,3)
```

**Key Points:**
- **Inner loop completes** for each outer loop iteration
- Useful for **2D arrays/matrices**
- Outer loop = rows, Inner loop = columns

**Common Use Case - 2D Matrix:**
```java
int[][] matrix = {{1, 2, 3}, {4, 5, 6}, {7, 8, 9}};

for (int i = 0; i < matrix.length; i++) {        // Rows
    for (int j = 0; j < matrix[i].length; j++) {  // Columns
        System.out.print(matrix[i][j] + " ");
    }
    System.out.println();
}
```

### While Loop

**Purpose:** Execute code **while condition is true**.

**Syntax:**
```java
initialization;
while (condition) {
    // Code to repeat
    increment/decrement;
}
```

**Flow Diagram:**
```
Start
  │
  ▼
Initialize variable
  │
  ▼
Check condition
  │
  ├─ true ──► Execute loop body
  │           │
  │           ▼
  │      Increment/Decrement
  │           │
  │           └─► Check condition (again)
  │
  └─ false ──► Exit loop
```

**Example:**
```java
public class WhileLoopExample {
    public static void main(String[] args) {
        int value = 1;
        
        while (value <= 5) {
            System.out.println(value);
            value++;
        }
    }
}
```

**Output:**
```
1
2
3
4
5
```

**Key Points:**
- Condition checked **before** each iteration
- If condition is false initially, loop **never executes**
- Must manually increment/decrement inside loop
- Use when **number of iterations is unknown**

### Do-While Loop

**Purpose:** Execute code **at least once**, then repeat while condition is true.

**Syntax:**
```java
initialization;
do {
    // Code to repeat
    increment/decrement;
} while (condition);  // Note: semicolon required
```

**Flow Diagram:**
```
Start
  │
  ▼
Initialize variable
  │
  ▼
Execute loop body (at least once)
  │
  ▼
Increment/Decrement
  │
  ▼
Check condition
  │
  ├─ true ──► Execute loop body (again)
  │           │
  │           └─► Check condition (repeat)
  │
  └─ false ──► Exit loop
```

**Example:**
```java
public class DoWhileLoopExample {
    public static void main(String[] args) {
        int value = 1;
        
        do {
            System.out.println(value);
            value++;
        } while (value <= 5);
    }
}
```

**Output:**
```
1
2
3
4
5
```

**Difference: While vs Do-While**

| Feature | While Loop | Do-While Loop |
|---------|------------|---------------|
| **Condition Check** | Before iteration | After iteration |
| **Minimum Executions** | 0 (if condition false initially) | 1 (always executes at least once) |
| **Use Case** | When iterations may be zero | When need at least one execution |

**Example Showing Difference:**
```java
int value = 10;

// While loop - condition checked first
while (value <= 5) {
    System.out.println(value);  // Never executes
}

// Do-while loop - executes at least once
do {
    System.out.println(value);  // Executes once (prints 10)
    value++;
} while (value <= 5);
```

### For-Each Loop (Enhanced For Loop)

**Purpose:** Iterate over **arrays** or **collections** easily.

**Syntax:**
```java
for (dataType variable : array/collection) {
    // Code using variable
}
```

**Flow Diagram:**
```
Start
  │
  ▼
Get first element from array/collection
  │
  ▼
Assign to variable
  │
  ▼
Execute loop body
  │
  ▼
Get next element
  │
  ├─ More elements ──► Assign to variable ──► Execute body (repeat)
  │
  └─ No more elements ──► Exit loop
```

**Example with Array:**
```java
public class ForEachLoopExample {
    public static void main(String[] args) {
        int[] array = {1, 2, 3, 4, 5};
        
        for (int value : array) {
            System.out.println(value);
        }
    }
}
```

**Output:**
```
1
2
3
4
5
```

**How It Works:**
```
Iteration 1: value = array[0] = 1 → Print 1
Iteration 2: value = array[1] = 2 → Print 2
Iteration 3: value = array[2] = 3 → Print 3
Iteration 4: value = array[3] = 4 → Print 4
Iteration 5: value = array[4] = 5 → Print 5
No more elements → Exit
```

**Key Points:**
- **Simpler syntax** than traditional for loop
- **Automatically iterates** through all elements
- **Read-only** - cannot modify array/collection during iteration
- **No index access** - only element value

**Comparison: Traditional For vs For-Each**

```java
int[] array = {1, 2, 3, 4, 5};

// Traditional for loop
for (int i = 0; i < array.length; i++) {
    System.out.println(array[i]);  // Can access index
}

// For-each loop
for (int value : array) {
    System.out.println(value);  // Only element value
}
```

---

## Branching Statements

**Purpose:** Alter the **normal flow** of loops.

**Types:**
1. **Break** - Exit loop immediately
2. **Continue** - Skip current iteration, continue loop

### Break Statement

**Purpose:** **Exit the loop** immediately when encountered.

**Syntax:**
```java
for (initialization; condition; increment) {
    if (someCondition) {
        break;  // Exit loop immediately
    }
    // Rest of loop code
}
```

**Flow Diagram:**
```
Loop Start
  │
  ▼
Check condition
  │
  ├─ true ──► Execute loop body
  │           │
  │           ▼
  │      Check if condition
  │           │
  │           ├─ true ──► break ──► Exit loop immediately
  │           │
  │           └─ false ──► Continue loop body
  │
  └─ false ──► Exit loop (normal)
```

**Example:**
```java
public class BreakExample {
    public static void main(String[] args) {
        for (int value = 1; value <= 10; value++) {
            if (value == 3) {
                break;  // Exit loop when value is 3
            }
            System.out.println(value);
        }
        System.out.println("Loop ended");
    }
}
```

**Output:**
```
1
2
Loop ended
```

**Break in Nested Loops:**
```java
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        if (j == 2) {
            break;  // Breaks inner loop only
        }
        System.out.print("(" + i + "," + j + ") ");
    }
    System.out.println();
}
```

**Output:**
```
(1,1)
(2,1)
(3,1)
```

**Key Points:**
- Breaks **immediate loop** only (in nested loops)
- Skips remaining iterations
- Exits loop completely (doesn't just skip one iteration)

### Continue Statement

**Purpose:** **Skip current iteration**, continue with next iteration.

**Syntax:**
```java
for (initialization; condition; increment) {
    if (someCondition) {
        continue;  // Skip rest of loop body, go to next iteration
    }
    // Rest of loop code (skipped if continue executed)
}
```

**Flow Diagram:**
```
Loop Start
  │
  ▼
Check condition
  │
  ├─ true ──► Execute loop body
  │           │
  │           ▼
  │      Check if condition
  │           │
  │           ├─ true ──► continue ──► Skip rest, go to increment
  │           │                          │
  │           │                          └─► Check condition (next iteration)
  │           │
  │           └─ false ──► Continue loop body
  │
  └─ false ──► Exit loop
```

**Example:**
```java
public class ContinueExample {
    public static void main(String[] args) {
        for (int value = 1; value <= 10; value++) {
            if (value == 3) {
                continue;  // Skip iteration when value is 3
            }
            System.out.println(value);
        }
    }
}
```

**Output:**
```
1
2
4
5
6
7
8
9
10
```

**Note:** Value `3` is **skipped** (not printed), but loop continues.

**Continue in Nested Loops:**
```java
for (int i = 1; i <= 3; i++) {
    for (int j = 1; j <= 3; j++) {
        if (j == 2) {
            continue;  // Skips inner loop iteration only
        }
        System.out.print("(" + i + "," + j + ") ");
    }
    System.out.println();
}
```

**Output:**
```
(1,1) (1,3)
(2,1) (2,3)
(3,1) (3,3)
```

**Key Points:**
- Skips **current iteration** only
- Continues with **next iteration**
- Loop doesn't exit (unlike break)
- In nested loops, affects **immediate loop** only

### Comparison: Break vs Continue

| Feature | Break | Continue |
|---------|-------|----------|
| **Action** | Exits loop completely | Skips current iteration |
| **Remaining Iterations** | All skipped | Only current skipped |
| **Loop Status** | Loop ends | Loop continues |
| **Use Case** | Exit when condition met | Skip specific values |

**Visual Comparison:**
```
Loop: 1, 2, 3, 4, 5

Break at 3:
  1, 2, [EXIT]  ← Stops here

Continue at 3:
  1, 2, [SKIP 3], 4, 5  ← Continues
```

---

## Summary

### Decision Making Statements

1. **If:** Execute if condition true
2. **If-Else:** Execute one of two blocks
3. **If-Else-If:** Chain multiple conditions
4. **Nested If:** If inside if
5. **Switch:** Multiple constant comparisons
6. **Switch Expression:** Switch that returns value (Java 12+)

### Iterative Statements

1. **For Loop:** Fixed iterations, three-part structure
2. **Nested For:** Loop inside loop (2D arrays)
3. **While Loop:** Condition checked before iteration
4. **Do-While Loop:** Executes at least once
5. **For-Each Loop:** Iterate arrays/collections easily

### Branching Statements

1. **Break:** Exit loop immediately
2. **Continue:** Skip current iteration, continue loop

### Key Differences

**While vs Do-While:**
- While: May execute 0 times
- Do-While: Executes at least once

**Break vs Continue:**
- Break: Exits loop
- Continue: Skips iteration, continues loop

**Switch Statement vs Switch Expression:**
- Statement: No return value, break needed
- Expression: Returns value, no break needed (Java 12+)

---

## Practice Exercises

1. Write a program to check if a number is positive, negative, or zero using if-else-if.

2. Write a program using switch to print day name based on day number (1-7).

3. Write a program to print multiplication table using nested for loops.

4. Write a program using while loop to find sum of digits of a number.

5. Write a program using for-each loop to find maximum element in an array.

6. Write a program using break to exit loop when sum exceeds 100.

7. Write a program using continue to print only even numbers from 1 to 20.

8. Convert a switch statement to switch expression (Java 12+).

---

## Interview Questions

1. **What is the difference between while and do-while loop?**  
   While checks condition before iteration (may execute 0 times). Do-while checks after (executes at least once).

2. **What happens if break is not used in switch?**  
   Execution falls through to next cases (all subsequent cases execute until break or end).

3. **What is switch expression?**  
   Switch that returns a value. Available from Java 12+, uses arrow syntax (`->`), no break needed.

4. **What is the difference between break and continue?**  
   Break exits loop completely. Continue skips current iteration and continues with next.

5. **Can default be anywhere in switch?**  
   Yes, default can be at any position. If not at end, break is required.

6. **What data types are supported in switch?**  
   byte, short, int, char, their wrapper classes, String, and enum. Total 10 types.

7. **What is nested for loop?**  
   For loop inside another for loop. Inner loop completes for each outer loop iteration.

8. **What is for-each loop?**  
   Enhanced for loop to iterate arrays/collections. Simpler syntax, automatically iterates all elements.

9. **What is yield in switch expression?**  
   Used to return value from switch expression when using code blocks. Required when block `{}` is used.

10. **Can we use variables in switch case?**  
    Only if variable is `final` (constant). Otherwise, only literals are allowed.

11. **What is the purpose of continue statement?**  
    Skip current iteration of loop and continue with next iteration. Loop doesn't exit.

12. **How does switch expression differ from switch statement?**  
    Expression returns value, doesn't need break, all cases must be handled. Statement doesn't return, needs break.

13. **What is the flow of if-else-if ladder?**  
    Evaluates conditions from top to bottom. Executes first matching condition's block. Else block executes if none match.

14. **Can switch expression use blocks?**  
    Yes, with `yield` statement to return value from the block.

15. **What is the syntax of for-each loop?**  
    `for (dataType variable : array/collection) { }`

