# Java Operators

## Table of Contents
- [What is an Operator?](#what-is-an-operator)
- [Operand and Expression](#operand-and-expression)
- [Categories of Operators](#categories-of-operators)
- [Arithmetic Operators](#arithmetic-operators)
- [Relational Operators](#relational-operators)
- [Logical Operators](#logical-operators)
- [Unary Operators](#unary-operators)
  - [Increment and Decrement](#increment-and-decrement)
  - [Unary Plus and Minus](#unary-plus-and-minus)
  - [Logical NOT](#logical-not)
- [Assignment Operators](#assignment-operators)
- [Bitwise Operators](#bitwise-operators)
  - [Bitwise AND](#bitwise-and)
  - [Bitwise OR](#bitwise-or)
  - [Bitwise XOR](#bitwise-xor)
  - [Bitwise NOT](#bitwise-not)
- [Bitwise Shift Operators](#bitwise-shift-operators)
  - [Left Shift](#left-shift)
  - [Right Shift (Signed)](#right-shift-signed)
  - [Unsigned Right Shift](#unsigned-right-shift)
- [Ternary Operator](#ternary-operator)
- [Type Comparison Operator (instanceof)](#type-comparison-operator-instanceof)
- [Operator Precedence and Associativity](#operator-precedence-and-associativity)
- [Summary](#summary)

---

## What is an Operator?

An **operator** indicates what **action to perform** on operands.

**Example:**
```java
5 + 3
```
- `+` is the **operator** (indicates addition)
- `5` and `3` are **operands** (values on which action is performed)

**Operators indicate actions like:**
- Addition (`+`)
- Subtraction (`-`)
- Multiplication (`*`)
- Division (`/`)
- Comparison (`>`, `<`, `==`)
- Logical operations (`&&`, `||`)

---

## Operand and Expression

### Operand

**Operand** is the item on which an action is performed.

**Operands can be:**
- **Variables:** `a + b` (where `a` and `b` are variables)
- **Constants:** `5 + 3` (where `5` and `3` are constants)

**Example:**
```java
int a = 3;
int b = 4;
int result = a + b;  // a and b are operands (variables)
int sum = 5 + 3;     // 5 and 3 are operands (constants)
```

### Expression

An **expression** consists of:
- **One or more operands**
- **Zero or more operators**

**Examples:**
```java
5 + 3                    // Expression: 2 operands, 1 operator
a + b * c                // Expression: 3 operands, 2 operators
5                        // Expression: 1 operand, 0 operators
a > b && c < d           // Expression: 4 operands, 3 operators
```

---

## Categories of Operators

Java has **9 categories** of operators:

1. Arithmetic Operators
2. Relational Operators
3. Logical Operators
4. Unary Operators
5. Assignment Operators
6. Bitwise Operators
7. Bitwise Shift Operators
8. Ternary Operator
9. Type Comparison Operator (instanceof)

---

## Arithmetic Operators

**Purpose:** Perform mathematical operations.

**Operators:**
- `+` - Addition
- `-` - Subtraction
- `*` - Multiplication
- `/` - Division
- `%` - Modulus (remainder)

**Example:**
```java
public class ArithmeticExample {
    public static void main(String[] args) {
        int a = 5;
        int b = 2;
        
        System.out.println(a + b);  // 7 (Addition)
        System.out.println(a - b);  // 3 (Subtraction)
        System.out.println(a * b);  // 10 (Multiplication)
        System.out.println(a / b);  // 2 (Division - integer division)
        System.out.println(a % b);  // 1 (Modulus - remainder)
    }
}
```

**Output:**
```
7
3
10
2
1
```

**Key Points:**
- Integer division truncates (no decimal part)
- Modulus returns remainder after division
- Works with both integers and floating-point numbers

---

## Relational Operators

**Purpose:** Compare two operands and return **true** or **false**.

**Operators:**
- `==` - Equal to
- `!=` - Not equal to
- `>` - Greater than
- `<` - Less than
- `>=` - Greater than or equal to
- `<=` - Less than or equal to

**Example:**
```java
public class RelationalExample {
    public static void main(String[] args) {
        int a = 4;
        int b = 7;
        
        System.out.println(a == b);  // false (4 == 7)
        System.out.println(a != b);  // true  (4 != 7)
        System.out.println(a > b);   // false (4 > 7)
        System.out.println(a < b);   // true  (4 < 7)
        System.out.println(a >= b);  // false (4 >= 7)
        System.out.println(a <= b);  // true  (4 <= 7)
    }
}
```

**Key Points:**
- Always returns **boolean** (`true` or `false`)
- Used in conditions (if statements, loops)
- Compares the **relation** between two operands

---

## Logical Operators

**Purpose:** Combine two or more conditions and return **true** or **false**.

**Operators:**
- `&&` - Logical AND
- `||` - Logical OR
- `!` - Logical NOT (also considered unary)

### Logical AND (&&)

**Truth Table:**
```
A     B     A && B
true  true  true
true  false false
false true  false
false false false
```

**Rule:** Returns `true` only if **both** conditions are `true`.

**Short-Circuit Evaluation:**
- If first condition is `false`, second condition is **not evaluated**
- Returns `false` immediately

**Example:**
```java
int a = 4;
int b = 7;

// First condition: false
// Second condition: NOT evaluated (short-circuit)
boolean result1 = (a < 3) && (a != b);  // false

// First condition: true
// Second condition: evaluated
boolean result2 = (a > 3) && (a != b);  // true && true = true
```

### Logical OR (||)

**Truth Table:**
```
A     B     A || B
true  true  true
true  false true
false true  true
false false false
```

**Rule:** Returns `true` if **at least one** condition is `true`.

**Short-Circuit Evaluation:**
- If first condition is `true`, second condition is **not evaluated**
- Returns `true` immediately

**Example:**
```java
int a = 4;
int b = 7;

// First condition: false
// Second condition: evaluated (a != b is true)
boolean result1 = (a < 3) || (a != b);  // false || true = true

// First condition: true
// Second condition: NOT evaluated (short-circuit)
boolean result2 = (a > 3) || (a != b);  // true (immediately)
```

**Key Points:**
- Combines multiple conditions
- Uses short-circuit evaluation for performance
- Always returns boolean

---

## Unary Operators

**Purpose:** Operators that work on **single operand**.

**Types:**
1. Increment (`++`)
2. Decrement (`--`)
3. Unary Plus (`+`)
4. Unary Minus (`-`)
5. Logical NOT (`!`)

### Increment and Decrement

#### Postfix Increment (`a++`)

**Behavior:**
1. **Return** current value
2. **Then** increment by 1

**Example:**
```java
int a = 5;
System.out.println(a++);  // Prints: 5
System.out.println(a);   // Prints: 6 (incremented after)
```

**Step-by-step:**
```
a = 5
a++ → Returns 5, then a becomes 6
```

#### Prefix Increment (`++a`)

**Behavior:**
1. **First** increment by 1
2. **Then** return new value

**Example:**
```java
int a = 5;
System.out.println(++a);  // Prints: 6 (incremented first)
System.out.println(a);    // Prints: 6
```

**Step-by-step:**
```
a = 5
++a → a becomes 6, then returns 6
```

#### Postfix Decrement (`a--`)

**Behavior:**
1. **Return** current value
2. **Then** decrement by 1

**Example:**
```java
int a = 7;
System.out.println(a--);  // Prints: 7
System.out.println(a);    // Prints: 6 (decremented after)
```

#### Prefix Decrement (`--a`)

**Behavior:**
1. **First** decrement by 1
2. **Then** return new value

**Example:**
```java
int a = 7;
System.out.println(--a);  // Prints: 6 (decremented first)
System.out.println(a);    // Prints: 6
```

**Complete Example:**
```java
public class IncrementDecrementExample {
    public static void main(String[] args) {
        int a = 5;
        
        System.out.println(a++);  // 5 (postfix - return then increment)
        System.out.println(a);    // 6
        
        System.out.println(++a);  // 7 (prefix - increment then return)
        System.out.println(a);    // 7
        
        System.out.println(a--);  // 7 (postfix - return then decrement)
        System.out.println(a);    // 6
        
        System.out.println(--a);  // 5 (prefix - decrement then return)
        System.out.println(a);    // 5
    }
}
```

### Unary Plus and Minus

**Unary Plus (`+`):**
- Makes number positive (no change for positive numbers)

**Unary Minus (`-`):**
- Makes number negative (changes sign)

**Example:**
```java
int a = 5;
int b = -5;

System.out.println(+a);  // 5 (positive)
System.out.println(-a);  // -5 (negative)
System.out.println(+b);  // -5 (still negative)
System.out.println(-b);  // 5 (becomes positive)
```

### Logical NOT

**Purpose:** Inverts boolean value.

**Truth Table:**
```
A     !A
true  false
false true
```

**Example:**
```java
boolean flag = true;
System.out.println(!flag);  // false

boolean result = false;
System.out.println(!result);  // true
```

**Key Points:**
- Works on single operand (unary)
- Only works with boolean values
- Inverts true to false, false to true

---

## Assignment Operators

**Purpose:** Assign values to variables.

**Basic Assignment:**
```java
int a = 5;  // Assigns 5 to variable a
```

**Compound Assignment Operators:**
- `+=` - Add and assign
- `-=` - Subtract and assign
- `*=` - Multiply and assign
- `/=` - Divide and assign
- `%=` - Modulus and assign

**How They Work:**
```java
a += 4;  // Equivalent to: a = a + 4
a -= 3;  // Equivalent to: a = a - 3
a *= 5;  // Equivalent to: a = a * 5
a /= 2;  // Equivalent to: a = a / 2
a %= 3;  // Equivalent to: a = a % 3
```

**Example:**
```java
public class AssignmentExample {
    public static void main(String[] args) {
        int a = 5;
        int variable = 0;
        
        variable = a;              // variable = 5
        System.out.println(variable);  // 5
        
        variable += a;             // variable = variable + a = 5 + 5 = 10
        System.out.println(variable);  // 10
        
        variable -= 3;             // variable = variable - 3 = 10 - 3 = 7
        System.out.println(variable);  // 7
        
        variable *= a;             // variable = variable * a = 7 * 5 = 35
        System.out.println(variable);  // 35
        
        variable /= 5;             // variable = variable / 5 = 35 / 5 = 7
        System.out.println(variable);  // 7
    }
}
```

**Key Points:**
- Left side must be a variable
- Right side can be variable, constant, or expression
- Compound operators are shorthand for common operations

---

## Bitwise Operators

**Purpose:** Perform operations at **bit level** (0s and 1s).

**Why Important:**
- Very **fast** (processor directly supports bit operations)
- Used in **DSA problems**
- Efficient for certain algorithms

**Operators:**
- `&` - Bitwise AND
- `|` - Bitwise OR
- `^` - Bitwise XOR
- `~` - Bitwise NOT

### Bitwise AND

**Symbol:** `&`

**Truth Table:**
```
A  B  A & B
0  0   0
0  1   0
1  0   0
1  1   1
```

**Rule:** Returns `1` only when **both bits are 1**.

**Example:**
```java
int a = 4;  // Binary: 0100
int b = 6;  // Binary: 0110
int result = a & b;

// Step-by-step:
//   0100  (4)
// & 0110  (6)
// ------
//   0100  (4)
```

**Visual Representation:**
```
  4:  0 1 0 0
  6:  0 1 1 0
      -------
&     0 1 0 0  = 4
```

### Bitwise OR

**Symbol:** `|`

**Truth Table:**
```
A  B  A | B
0  0   0
0  1   1
1  0   1
1  1   1
```

**Rule:** Returns `1` if **at least one bit is 1**.

**Example:**
```java
int a = 4;  // Binary: 0100
int b = 6;  // Binary: 0110
int result = a | b;

// Step-by-step:
//   0100  (4)
// | 0110  (6)
// ------
//   0110  (6)
```

**Visual Representation:**
```
  4:  0 1 0 0
  6:  0 1 1 0
      -------
|     0 1 1 0  = 6
```

### Bitwise XOR

**Symbol:** `^`

**Truth Table:**
```
A  B  A ^ B
0  0   0
0  1   1
1  0   1
1  1   0
```

**Rule:** Returns `1` if bits are **different**, `0` if bits are **same**.

**Key Property:** `A ^ A = 0` and `A ^ 0 = A`

**Example:**
```java
int a = 4;  // Binary: 0100
int b = 6;  // Binary: 0110
int result = a ^ b;

// Step-by-step:
//   0100  (4)
// ^ 0110  (6)
// ------
//   0010  (2)
```

**Visual Representation:**
```
  4:  0 1 0 0
  6:  0 1 1 0
      -------
^     0 0 1 0  = 2
```

**Why XOR is Useful:**
- Used in encryption
- Finding unique elements
- Swapping without temporary variable

### Bitwise NOT

**Symbol:** `~`

**Purpose:** Inverts all bits (0 becomes 1, 1 becomes 0).

**Important:** In Java, integers are **signed**, so bitwise NOT can change positive to negative.

**Formula:** `~n = -(n + 1)`

**Example:**
```java
int a = 4;  // Binary: 0100 (assuming 4-bit for simplicity)
int result = ~a;  // Result: -5
```

**Step-by-Step Explanation:**

**Step 1: Represent 4 in binary**
```
4 in binary: 0100
(For 32-bit integer: 0000...0100)
```

**Step 2: Apply bitwise NOT**
```
Original:  0100
After ~:   1011
(All bits flipped: 0→1, 1→0)
```

**Step 3: Interpret result**

In Java, integers are **signed**. The **most significant bit (MSB)** is the sign bit:
- `0` = positive number
- `1` = negative number

Since MSB is `1`, this is a **negative number**.

**Step 4: Calculate decimal value**

For negative numbers, use **two's complement**:

```
1011 (after NOT)
```

To find decimal value:
- MSB = 1 (negative)
- Calculate: -8 + 0 + 2 + 1 = -5

**Or use formula:**
```
~4 = -(4 + 1) = -5
```

**Complete Example:**
```java
public class BitwiseNotExample {
    public static void main(String[] args) {
        int a = 4;
        System.out.println(~a);  // -5
        
        int b = 5;
        System.out.println(~b);  // -6
        
        // Formula: ~n = -(n + 1)
        // ~4 = -(4 + 1) = -5
        // ~5 = -(5 + 1) = -6
    }
}
```

**Verification (Two's Complement):**

To verify `-5` is `1011`:

**Step 1:** Start with `5` in binary: `0101`

**Step 2:** Find one's complement (flip bits): `1010`

**Step 3:** Add 1 (two's complement): `1010 + 1 = 1011`

**Step 4:** This matches our result from `~4`!

**Key Points:**
- Flips all bits (0→1, 1→0)
- Can convert positive to negative
- Formula: `~n = -(n + 1)`
- In Java, integers are signed (MSB is sign bit)

---

## Bitwise Shift Operators

**Purpose:** Shift bits **left** or **right** in a number.

**Types:**
1. **Left Shift** (`<<`)
2. **Right Shift** (`>>`) - Signed
3. **Unsigned Right Shift** (`>>>`)

**Note:** There is **no unsigned left shift** (explained below).

### Left Shift

**Symbol:** `<<`

**Behavior:**
- Shifts bits to the **left**
- **Fills rightmost bits with 0**
- Equivalent to **multiplying by 2** for each shift

**Visual Guide:**
```
<<  (arrow points left)
```

**Example:**
```java
int a = 4;  // Binary: 0100
int result = a << 1;  // Left shift by 1
```

**Step-by-Step:**
```
Original:  0 1 0 0  (4)
           ↓ ↓ ↓ ↓
Shift left: 1 0 0 0  (8)
            ↑
        Filled with 0
```

**Result:** `4 << 1 = 8` (4 × 2 = 8)

**Multiple Shifts:**
```java
int a = 4;
System.out.println(a << 1);  // 8  (4 × 2)
System.out.println(a << 2);  // 16 (4 × 4 = 4 × 2²)
System.out.println(a << 3);  // 32 (4 × 8 = 4 × 2³)
```

**General Formula:** `a << n = a × 2ⁿ`

**Why No Unsigned Left Shift?**
- Left shift always fills **least significant bits** (right side) with 0
- Sign bit (MSB) moves left, but new LSB is always 0
- No need for signed/unsigned distinction

### Right Shift (Signed)

**Symbol:** `>>`

**Behavior:**
- Shifts bits to the **right**
- **Fills leftmost bit with sign bit** (0 for positive, 1 for negative)
- Equivalent to **dividing by 2** for each shift (integer division)

**Visual Guide:**
```
>>  (arrow points right)
```

**Example with Positive Number:**
```java
int a = 4;  // Binary: 0100
int result = a >> 1;  // Right shift by 1
```

**Step-by-Step:**
```
Original:  0 1 0 0  (4)
           ↓ ↓ ↓ ↓
Shift right: 0 0 1 0  (2)
             ↑
        Filled with sign bit (0 for positive)
```

**Result:** `4 >> 1 = 2` (4 ÷ 2 = 2)

**Example with Negative Number:**
```java
int a = -5;  // Binary: 1011 (in 4-bit representation)
int result = a >> 1;  // Right shift by 1
```

**Step-by-Step:**
```
Original:  1 0 1 1  (-5)
           ↓ ↓ ↓ ↓
Shift right: 1 1 0 1  (-3)
             ↑
        Filled with sign bit (1 for negative)
```

**Result:** `-5 >> 1 = -3` (approximately -5 ÷ 2)

**Key Points:**
- Preserves sign (positive stays positive, negative stays negative)
- Fills with sign bit (MSB)
- Equivalent to dividing by 2ⁿ (with sign preservation)

### Unsigned Right Shift

**Symbol:** `>>>`

**Behavior:**
- Shifts bits to the **right**
- **Always fills leftmost bits with 0** (ignores sign)
- Can convert negative to positive

**Example:**
```java
int a = -5;  // Binary: 1011
int result = a >>> 1;  // Unsigned right shift by 1
```

**Step-by-Step:**
```
Original:  1 0 1 1  (-5)
           ↓ ↓ ↓ ↓
Shift right: 0 1 0 1  (5)
             ↑
        Always filled with 0 (ignores sign)
```

**Result:** `-5 >>> 1 = 5` (sign ignored, treated as unsigned)

**Comparison:**

| Operation | Positive Number | Negative Number |
|-----------|----------------|-----------------|
| `>>` (signed) | Preserves sign, fills with 0 | Preserves sign, fills with 1 |
| `>>>` (unsigned) | Fills with 0 | Fills with 0 (can become positive) |

**Complete Example:**
```java
public class ShiftExample {
    public static void main(String[] args) {
        int a = 4;
        
        // Left shift
        System.out.println(a << 1);  // 8  (4 × 2)
        System.out.println(a << 2);  // 16 (4 × 4)
        
        // Right shift (signed)
        System.out.println(a >> 1);  // 2  (4 ÷ 2)
        System.out.println(a >> 2);  // 1  (4 ÷ 4)
        
        // Unsigned right shift
        int b = -5;
        System.out.println(b >> 1);   // -3 (signed - preserves sign)
        System.out.println(b >>> 1);  // Large positive (unsigned - ignores sign)
    }
}
```

**Key Points:**
- Left shift: Multiply by 2ⁿ, fills with 0
- Right shift (signed): Divide by 2ⁿ, preserves sign
- Unsigned right shift: Divide by 2ⁿ, always fills with 0
- No unsigned left shift (not needed)

---

## Ternary Operator

**Purpose:** Mimics **if-else** condition in a single expression.

**Syntax:**
```java
condition ? expression1 : expression2
```

**How it works:**
- If `condition` is **true** → returns `expression1`
- If `condition` is **false** → returns `expression2`

**Visual Representation:**
```
condition ? true_value : false_value
    │           │            │
    │           │            └─ Return if false
    │           └─ Return if true
    └─ Evaluate this first
```

**Example:**
```java
int a = 4;
int b = 5;

// Using if-else
int max;
if (a > b) {
    max = a;
} else {
    max = b;
}

// Using ternary operator (equivalent)
int max = (a > b) ? a : b;
```

**Step-by-Step:**
```java
int a = 4;
int b = 5;
int max = (a > b) ? a : b;

// Step 1: Evaluate condition (a > b)
//         4 > 5 = false

// Step 2: Since false, return expression after colon (:)
//         Return b = 5

// Result: max = 5
```

**Nested Ternary:**
```java
int a = 4;
int b = 5;
int c = 3;

// Find maximum of three numbers
int max = (a > b) ? ((a > c) ? a : c) : ((b > c) ? b : c);
```

**Key Points:**
- Shorthand for if-else
- Returns a value (can be assigned)
- All three parts are expressions
- Can be nested (but avoid for readability)

---

## Type Comparison Operator (instanceof)

**Purpose:** Checks if an object is an **instance of** a particular class or interface.

**Syntax:**
```java
object instanceof ClassName
```

**Returns:** `true` or `false`

**Example:**
```java
class Parent {}
class Child1 extends Parent {}
class Child2 extends Parent {}

public class InstanceOfExample {
    public static void main(String[] args) {
        Child2 obj = new Child2();
        
        System.out.println(obj instanceof Child2);  // true
        System.out.println(obj instanceof Child1);  // false
        System.out.println(obj instanceof Parent);  // true (child is instance of parent)
        
        String str = "Hello";
        System.out.println(str instanceof String);  // true
        
        // With Object class
        Object unknownObj = new Child2();
        System.out.println(unknownObj instanceof Child2);  // true
        System.out.println(unknownObj instanceof Parent); // true
    }
}
```

**Common Use Cases:**

1. **Polymorphism - Finding actual type:**
```java
Parent obj = new Child2();  // Parent reference, Child2 object
if (obj instanceof Child2) {
    // Safe to cast
    Child2 child = (Child2) obj;
}
```

2. **Type checking before casting:**
```java
Object obj = getObject();  // Unknown type
if (obj instanceof String) {
    String str = (String) obj;  // Safe cast
}
```

**Key Points:**
- Returns boolean (`true` or `false`)
- Child object is instance of parent class
- Used for safe type checking before casting
- Can also be considered a relational operator (returns boolean, compares types)

---

## Operator Precedence and Associativity

### Operator Precedence

**Definition:** Determines which operator is evaluated **first** when multiple operators are present.

**Example:**
```java
5 + 2 * 3
```

**Which operation first?**
- If `+` first: `(5 + 2) * 3 = 21`
- If `*` first: `5 + (2 * 3) = 11`

**Answer:** `*` has **higher precedence** than `+`, so result is `11`.

### Operator Precedence Table

**High to Low Priority:**

| Precedence | Operator | Description | Associativity |
|------------|----------|-------------|---------------|
| **1 (Highest)** | `()`, `[]`, `.` | Parentheses, array access, member access | Left to Right |
| **2** | `++`, `--` | Postfix increment/decrement | Left to Right |
| **3** | `++`, `--`, `+`, `-`, `!`, `~` | Prefix increment/decrement, unary plus/minus, logical NOT, bitwise NOT | Right to Left |
| **4** | `*`, `/`, `%` | Multiplicative | Left to Right |
| **5** | `+`, `-` | Additive | Left to Right |
| **6** | `<<`, `>>`, `>>>` | Shift | Left to Right |
| **7** | `<`, `>`, `<=`, `>=`, `instanceof` | Relational | Left to Right |
| **8** | `==`, `!=` | Equality | Left to Right |
| **9** | `&` | Bitwise AND | Left to Right |
| **10** | `^` | Bitwise XOR | Left to Right |
| **11** | `\|` | Bitwise OR | Left to Right |
| **12** | `&&` | Logical AND | Left to Right |
| **13** | `\|\|` | Logical OR | Left to Right |
| **14** | `?:` | Ternary | Right to Left |
| **15 (Lowest)** | `=`, `+=`, `-=`, `*=`, `/=`, `%=` | Assignment | Right to Left |

### Associativity

**Definition:** When operators have the **same precedence**, associativity determines evaluation order.

**Types:**
- **Left to Right:** Evaluate from left to right
- **Right to Left:** Evaluate from right to left

**Example - Left to Right:**
```java
5 * 2 / 2
```

Both `*` and `/` have same precedence (multiplicative).

**Associativity:** Left to Right

**Evaluation:**
```
5 * 2 / 2
= (5 * 2) / 2  (left to right)
= 10 / 2
= 5
```

**Example - Right to Left:**
```java
int a, b, c;
a = b = c = 5;
```

Assignment operators have right to left associativity.

**Evaluation:**
```
a = b = c = 5
= a = b = (c = 5)  (right to left)
= a = (b = 5)
= (a = 5)
```

**Result:** All variables get value `5`.

### Complex Example

**Problem:**
```java
int a = 4;
int result = a++ + ++a * a-- / --a + a;
```

**Step 1: Replace operands with values (considering increment/decrement)**
```
a = 4

a++     → Returns 4, then a becomes 5
++a     → a becomes 6, then returns 6
a--     → Returns 6, then a becomes 5
--a     → a becomes 4, then returns 4
a       → Returns 4
```

**Step 2: Substitute values**
```
result = 4 + 6 * 6 / 4 + 4
```

**Step 3: Apply precedence**
```
Multiplication and division have higher precedence than addition
= 4 + (6 * 6) / 4 + 4
= 4 + 36 / 4 + 4
```

**Step 4: Continue with same precedence (left to right)**
```
= 4 + (36 / 4) + 4
= 4 + 9 + 4
```

**Step 5: Addition (left to right)**
```
= (4 + 9) + 4
= 13 + 4
= 17
```

**Final Answer:** `result = 17`, `a = 4`

**Practice Problem:**
```java
int x = 2;
int z = ++x + ++x / x++ - 1;
// What is the value of z?
// Hint: Follow precedence and associativity rules
```

---

## Summary

### Operator Categories

1. **Arithmetic:** `+`, `-`, `*`, `/`, `%`
2. **Relational:** `==`, `!=`, `>`, `<`, `>=`, `<=`
3. **Logical:** `&&`, `||`, `!`
4. **Unary:** `++`, `--`, `+`, `-`, `!`
5. **Assignment:** `=`, `+=`, `-=`, `*=`, `/=`, `%=`
6. **Bitwise:** `&`, `|`, `^`, `~`
7. **Bitwise Shift:** `<<`, `>>`, `>>>`
8. **Ternary:** `? :`
9. **Type Comparison:** `instanceof`

### Key Concepts

- **Operator:** Indicates action to perform
- **Operand:** Item on which action is performed
- **Expression:** One or more operands with zero or more operators
- **Precedence:** Which operator executes first
- **Associativity:** Order when precedence is same

### Important Points

- **Bitwise operators** are very fast and useful for DSA
- **Left shift** multiplies by 2ⁿ
- **Right shift** divides by 2ⁿ
- **Bitwise NOT** formula: `~n = -(n + 1)`
- **Postfix** (`a++`): Return then increment
- **Prefix** (`++a`): Increment then return
- **Short-circuit evaluation:** `&&` and `||` may not evaluate second operand

---

## Practice Exercises

1. Calculate: `int result = 5 + 3 * 2 - 1;`

2. What is the value of `a` after: `int a = 5; a = a++ + ++a;`

3. Perform bitwise operations: `int a = 12; int b = 10;` Find `a & b`, `a | b`, `a ^ b`, `~a`

4. Calculate: `int result = 8 << 2;` and `int result = 16 >> 3;`

5. Use ternary operator to find maximum of three numbers.

6. Solve: `int x = 2; int z = ++x + ++x / x++ - 1;` What is `z`?

---

## Interview Questions

1. **What is the difference between `++a` and `a++`?**  
   `++a` increments first then returns. `a++` returns first then increments.

2. **What is bitwise AND?**  
   Returns 1 only when both bits are 1. Symbol: `&`

3. **What is the result of `~5`?**  
   `-6` (using formula: `~n = -(n + 1)`)

4. **What is left shift equivalent to?**  
   Multiplication by 2ⁿ. `a << n = a × 2ⁿ`

5. **What is the difference between `>>` and `>>>`?**  
   `>>` is signed (preserves sign), `>>>` is unsigned (always fills with 0).

6. **What is short-circuit evaluation?**  
   When second operand is not evaluated if result can be determined from first operand (`&&`, `||`).

7. **What is operator precedence?**  
   Order in which operators are evaluated when multiple operators are present.

8. **What is associativity?**  
   Order of evaluation when operators have same precedence (left-to-right or right-to-left).

9. **What does `instanceof` do?**  
   Checks if object is instance of a class/interface. Returns boolean.

10. **What is ternary operator?**  
    Shorthand for if-else: `condition ? valueIfTrue : valueIfFalse`

11. **How to swap two numbers using XOR?**  
    `a = a ^ b; b = a ^ b; a = a ^ b;`

12. **What is the precedence of arithmetic operators?**  
    `*`, `/`, `%` have higher precedence than `+`, `-`.

13. **What happens in `a += 5`?**  
    Equivalent to `a = a + 5`.

14. **Why is there no unsigned left shift?**  
    Left shift always fills LSB with 0, so signed/unsigned distinction is not needed.

15. **What is the result of `5 / 2` in Java?**  
    `2` (integer division, truncates decimal part).

