# Java Streams

## Table of Contents
- [What is Stream?](#what-is-stream)
- [Stream Pipeline - Three Steps](#stream-pipeline---three-steps)
- [Creating Streams](#creating-streams)
- [Intermediate Operations](#intermediate-operations)
- [Terminal Operations](#terminal-operations)
- [Lazy Evaluation](#lazy-evaluation)
- [Sequential vs Parallel Streams](#sequential-vs-parallel-streams)
- [Stream Properties](#stream-properties)
- [Summary](#summary)

---

## What is Stream?

### Definition

**Stream** is a **pipeline** through which data elements pass and can be processed.

**Key Concept:** Think of Stream as a **pipeline** where:
- **Data flows** through the pipeline
- **Operations** can be applied as data passes
- **Result** is obtained at the end

**Visual Representation:**
```
Stream Pipeline:
┌─────────────────────────────────────────────────────────┐
│  Data Source → [Operation1] → [Operation2] → [Result]  │
│  (Collection)    (Filter)      (Map)        (Output)    │
└─────────────────────────────────────────────────────────┘
```

**Key Points:**
- **Pipeline concept:** Data flows through operations
- **Bulk processing:** Real power for large datasets
- **Parallel processing:** Can process concurrently
- **Functional style:** Declarative programming

### Why Use Streams?

**Benefits:**
1. **Readable code:** Declarative style (what to do, not how)
2. **Parallel processing:** Automatic parallelization
3. **Lazy evaluation:** Operations executed only when needed
4. **Functional style:** Immutable, no side effects

**Example Comparison:**
```java
// Without Stream (Imperative)
List<Integer> salaries = Arrays.asList(3000, 4000, 10000, 1000, 3500);
int count = 0;
for (int salary : salaries) {
    if (salary > 3000) {
        count++;
    }
}

// With Stream (Declarative)
long count = salaries.stream()
    .filter(salary -> salary > 3000)
    .count();
```

---

## Stream Pipeline - Three Steps

### Overview

**Stream processing has three steps:**

1. **Create Stream** - Open stream from data source
2. **Intermediate Operations** - Transform stream (zero or more)
3. **Terminal Operation** - Produce result (exactly one)

**Visual Flow:**
```
Step 1: Create Stream
┌─────────────┐
│ Collection  │ → stream() → Stream
│   or Array  │
└─────────────┘

Step 2: Intermediate Operations (0 or more)
Stream → filter() → map() → sorted() → Stream

Step 3: Terminal Operation (exactly 1)
Stream → collect() → Result (List/Array/etc.)
```

### Step 1: Create Stream

**Purpose:** Convert data source (Collection/Array) into Stream.

**Example:**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
Stream<Integer> stream = numbers.stream();  // Create stream
```

### Step 2: Intermediate Operations

**Purpose:** Transform stream from one form to another.

**Characteristics:**
- **Input:** Stream
- **Output:** Stream (transformed)
- **Lazy:** Not executed until terminal operation
- **Chainable:** Can chain multiple operations

**Example:**
```java
stream
    .filter(x -> x > 3)    // Intermediate: filters
    .map(x -> x * 2)       // Intermediate: transforms
    .sorted()              // Intermediate: sorts
```

### Step 3: Terminal Operation

**Purpose:** Produce final result and close stream.

**Characteristics:**
- **Input:** Stream
- **Output:** Result (not a stream)
- **Eager:** Executes immediately
- **Closes stream:** Cannot use stream after terminal operation

**Example:**
```java
List<Integer> result = stream
    .filter(x -> x > 3)
    .collect(Collectors.toList());  // Terminal: produces result
```

### Complete Example

```java
import java.util.*;
import java.util.stream.*;

public class StreamExample {
    public static void main(String[] args) {
        List<Integer> salaries = Arrays.asList(3000, 4000, 10000, 1000, 3500);
        
        // Step 1: Create stream
        Stream<Integer> stream = salaries.stream();
        
        // Step 2: Intermediate operation (filter)
        Stream<Integer> filtered = stream.filter(salary -> salary > 3000);
        
        // Step 3: Terminal operation (count)
        long count = filtered.count();
        
        System.out.println("Total employees with salary > 3000: " + count);
        // Output: 3
        
        // Chained version (more common)
        long count2 = salaries.stream()
            .filter(salary -> salary > 3000)
            .count();
    }
}
```

**Key Points:**
- **Original data unchanged:** Stream operations don't modify source
- **New result:** Terminal operation produces new collection/result
- **Immutable:** Source collection remains unchanged

---

## Creating Streams

### Method 1: From Collection

**Using `stream()` method:**

```java
List<Integer> list = Arrays.asList(1, 2, 3, 4, 5);
Stream<Integer> stream = list.stream();  // Sequential stream

Set<String> set = new HashSet<>();
Stream<String> stream2 = set.stream();
```

**Note:** All Collection implementations have `stream()` method.

### Method 2: From Array

**Using `Arrays.stream()`:**

```java
int[] array = {1, 2, 3, 4, 5};
IntStream stream = Arrays.stream(array);  // Returns IntStream

String[] strArray = {"Hello", "World"};
Stream<String> stream2 = Arrays.stream(strArray);
```

**Note:** For primitive arrays, returns specialized stream (IntStream, LongStream, DoubleStream).

### Method 3: Using Stream.of()

**Static method with variable arguments:**

```java
Stream<Integer> stream = Stream.of(1, 2, 3, 4, 5);

Stream<String> stream2 = Stream.of("Hello", "World", "Java");
```

**Note:** Accepts variable arguments (varargs).

### Method 4: Using Stream.builder()

**Builder pattern:**

```java
Stream<Integer> stream = Stream.<Integer>builder()
    .add(1)
    .add(2)
    .add(3)
    .add(4)
    .build();
```

**Use case:** When you need to build stream dynamically.

### Method 5: Using Stream.iterate()

**Generate infinite stream (must use with limit):**

```java
// Generate: 1000, 6000, 11000, 16000, ...
Stream<Integer> stream = Stream.iterate(1000, n -> n + 5000)
    .limit(5);  // Must use limit to stop

// Result: [1000, 6000, 11000, 16000, 21000]
```

**How it works:**
- **First parameter:** Starting value (seed)
- **Second parameter:** Function to generate next value
- **limit():** Required to stop infinite generation

**Example:**
```java
Stream<Integer> stream = Stream.iterate(1, n -> n * 2)
    .limit(10);
// Generates: 1, 2, 4, 8, 16, 32, 64, 128, 256, 512
```

### Method 6: Using Stream.generate()

**Generate infinite stream with Supplier:**

```java
Stream<Double> randomStream = Stream.generate(Math::random)
    .limit(5);
// Generates 5 random numbers
```

---

## Intermediate Operations

### Overview

**Intermediate operations** transform one stream into another stream.

**Characteristics:**
- **Lazy:** Not executed until terminal operation
- **Chainable:** Can chain multiple operations
- **Return Stream:** Always return a new stream

### 1. filter()

**Purpose:** Filter elements based on condition.

**Signature:** `Stream<T> filter(Predicate<T> predicate)`

**Example:**
```java
List<String> names = Arrays.asList("Hello", "everybody", "How", "are", "you", "doing");

List<String> result = names.stream()
    .filter(name -> name.length() <= 3)  // Keep only length <= 3
    .collect(Collectors.toList());

// Result: ["How", "are", "you"]
```

**How it works:**
```
Input Stream: ["Hello", "everybody", "How", "are", "you", "doing"]
                ↓
            filter(length <= 3)
                ↓
Output Stream: ["How", "are", "you"]
```

### 2. map()

**Purpose:** Transform each element.

**Signature:** `Stream<R> map(Function<T, R> mapper)`

**Example:**
```java
List<String> names = Arrays.asList("Hello", "EVERYBODY", "HOW", "ARE", "YOU");

List<String> result = names.stream()
    .map(name -> name.toLowerCase())  // Transform to lowercase
    .collect(Collectors.toList());

// Result: ["hello", "everybody", "how", "are", "you"]
```

**How it works:**
```
Input Stream: ["Hello", "EVERYBODY", "HOW"]
                ↓
            map(toLowerCase)
                ↓
Output Stream: ["hello", "everybody", "how"]
```

**More Examples:**
```java
// Transform to length
List<Integer> lengths = names.stream()
    .map(String::length)
    .collect(Collectors.toList());

// Transform to square
List<Integer> numbers = Arrays.asList(1, 2, 3, 4);
List<Integer> squares = numbers.stream()
    .map(n -> n * n)
    .collect(Collectors.toList());
// Result: [1, 4, 9, 16]
```

### 3. flatMap()

**Purpose:** Flatten nested collections (list of lists → single list).

**Signature:** `Stream<R> flatMap(Function<T, Stream<R>> mapper)`

**Example:**
```java
List<List<String>> listOfLists = Arrays.asList(
    Arrays.asList("I", "love", "Java"),
    Arrays.asList("Concepts", "are", "clear"),
    Arrays.asList("It's", "very", "easy")
);

List<String> flattened = listOfLists.stream()
    .flatMap(list -> list.stream())  // Flatten nested lists
    .collect(Collectors.toList());

// Result: ["I", "love", "Java", "Concepts", "are", "clear", "It's", "very", "easy"]
```

**Visual Representation:**
```
Input: [[I, love, Java], [Concepts, are, clear], [It's, very, easy]]
         ↓
    flatMap(list -> list.stream())
         ↓
Output: [I, love, Java, Concepts, are, clear, It's, very, easy]
```

**With Additional Operations:**
```java
List<String> result = listOfLists.stream()
    .flatMap(list -> list.stream()
        .map(String::toLowerCase))  // Can add operations inside flatMap
    .collect(Collectors.toList());
```

### 4. distinct()

**Purpose:** Remove duplicate elements.

**Signature:** `Stream<T> distinct()`

**Example:**
```java
int[] numbers = {2, 1, 4, 2, 4, 7, 9};

int[] unique = Arrays.stream(numbers)
    .distinct()
    .toArray();

// Result: [2, 1, 4, 7, 9]  (duplicates removed)
```

### 5. sorted()

**Purpose:** Sort elements.

**Signature:** 
- `Stream<T> sorted()` - Natural ordering
- `Stream<T> sorted(Comparator<T> comparator)` - Custom ordering

**Example:**
```java
List<Integer> numbers = Arrays.asList(10, 1, 2, 24, 4, 5, 7, 9);

// Natural order (ascending)
List<Integer> sorted = numbers.stream()
    .sorted()
    .collect(Collectors.toList());
// Result: [1, 2, 4, 5, 7, 9, 10, 24]

// Custom order (descending)
List<Integer> descending = numbers.stream()
    .sorted((a, b) -> b - a)
    .collect(Collectors.toList());
// Result: [24, 10, 9, 7, 5, 4, 2, 1]
```

### 6. peek()

**Purpose:** Perform action on each element (for debugging/logging).

**Signature:** `Stream<T> peek(Consumer<T> action)`

**Example:**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6);

List<Integer> result = numbers.stream()
    .filter(x -> x > 2)
    .peek(x -> System.out.println("After filter: " + x))  // Debug output
    .map(x -> x * -1)
    .peek(x -> System.out.println("After negating: " + x))
    .collect(Collectors.toList());
```

**Note:** `peek()` is intermediate, `forEach()` is terminal.

### 7. limit()

**Purpose:** Truncate stream to specified size.

**Signature:** `Stream<T> limit(long maxSize)`

**Example:**
```java
List<Integer> numbers = Arrays.asList(2, 1, 3, 4, 5, 6);

List<Integer> result = numbers.stream()
    .limit(3)  // Keep only first 3 elements
    .collect(Collectors.toList());

// Result: [2, 1, 3]
```

### 8. skip()

**Purpose:** Skip first n elements.

**Signature:** `Stream<T> skip(long n)`

**Example:**
```java
List<Integer> numbers = Arrays.asList(2, 1, 3, 4, 5, 6);

List<Integer> result = numbers.stream()
    .skip(3)  // Skip first 3 elements
    .collect(Collectors.toList());

// Result: [4, 5, 6]
```

### 9. mapToInt(), mapToLong(), mapToDouble()

**Purpose:** Convert to primitive stream (for better performance).

**Signature:** `IntStream mapToInt(ToIntFunction<T> mapper)`

**Example:**
```java
// From String array to IntStream
String[] numbers = {"2", "1", "4", "7"};

int[] result = Arrays.stream(numbers)
    .mapToInt(Integer::parseInt)  // Convert String to int
    .toArray();

// Result: [2, 1, 4, 7]

// From List<Integer> to IntStream
List<Integer> list = Arrays.asList(1, 2, 3, 4);
IntStream intStream = list.stream()
    .mapToInt(x -> x);  // Convert to IntStream
```

**Why use primitive streams?**
- **Better performance:** No boxing/unboxing
- **Specialized methods:** sum(), average(), etc.
- **Memory efficient:** Primitive types use less memory

**Primitive Stream Methods:**
```java
IntStream stream = IntStream.of(1, 2, 3, 4, 5);

int sum = stream.sum();           // 15
OptionalDouble avg = stream.average();  // 3.0
int max = stream.max().getAsInt();     // 5
int min = stream.min().getAsInt();     // 1
```

### Summary of Intermediate Operations

| Operation | Purpose | Input | Output |
|-----------|---------|-------|--------|
| `filter()` | Filter elements | Predicate | Stream |
| `map()` | Transform elements | Function | Stream |
| `flatMap()` | Flatten nested collections | Function | Stream |
| `distinct()` | Remove duplicates | - | Stream |
| `sorted()` | Sort elements | Comparator (optional) | Stream |
| `peek()` | Perform action | Consumer | Stream |
| `limit()` | Truncate stream | long | Stream |
| `skip()` | Skip elements | long | Stream |
| `mapToInt()` | Convert to IntStream | ToIntFunction | IntStream |

---

## Terminal Operations

### Overview

**Terminal operations** produce final result and close the stream.

**Characteristics:**
- **Eager:** Execute immediately
- **Close stream:** Cannot reuse stream after terminal operation
- **Produce result:** Return value (not stream)

### 1. forEach()

**Purpose:** Perform action on each element.

**Signature:** `void forEach(Consumer<T> action)`

**Example:**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 10);

numbers.stream()
    .filter(x -> x >= 3)
    .forEach(x -> System.out.println(x));
// Output: 3, 4, 5, 6, 7, 10
```

**Note:** `forEach()` is terminal, `peek()` is intermediate.

### 2. toArray()

**Purpose:** Convert stream to array.

**Signature:**
- `Object[] toArray()` - Returns Object array
- `A[] toArray(IntFunction<A[]> generator)` - Returns typed array

**Example:**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// Object array
Object[] objArray = numbers.stream()
    .filter(x -> x > 2)
    .toArray();

// Typed array
Integer[] intArray = numbers.stream()
    .filter(x -> x > 2)
    .toArray(size -> new Integer[size]);  // Or: Integer[]::new
// Result: [3, 4, 5]
```

### 3. reduce()

**Purpose:** Perform reduction (aggregation) operation.

**Signature:** `Optional<T> reduce(BinaryOperator<T> accumulator)`

**Example:**
```java
List<Integer> numbers = Arrays.asList(2, 1, 4, 7, 10);

// Sum all elements
Optional<Integer> sum = numbers.stream()
    .reduce((a, b) -> a + b);

System.out.println(sum.get());  // 24

// How it works:
// Step 1: 2 + 1 = 3
// Step 2: 3 + 4 = 7
// Step 3: 7 + 7 = 14
// Step 4: 14 + 10 = 24
```

**More Examples:**
```java
// Product (multiplication)
Optional<Integer> product = numbers.stream()
    .reduce((a, b) -> a * b);
// Result: 2 * 1 * 4 * 7 * 10 = 560

// With identity (initial value)
Integer sum = numbers.stream()
    .reduce(0, (a, b) -> a + b);  // 0 is identity
// Result: 24 (same, but returns Integer not Optional)
```

**Associative Aggregation:**
- **Associative:** Order doesn't matter: (a + b) + c = a + (b + c)
- **Examples:** Sum, product, max, min

### 4. collect()

**Purpose:** Collect stream elements into collection.

**Signature:** `R collect(Collector<T, A, R> collector)`

**Example:**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// Collect to List
List<Integer> list = numbers.stream()
    .filter(x -> x > 2)
    .collect(Collectors.toList());

// Collect to Set
Set<Integer> set = numbers.stream()
    .collect(Collectors.toSet());

// Collect to Map
Map<Integer, String> map = numbers.stream()
    .collect(Collectors.toMap(
        x -> x,                    // Key mapper
        x -> "Value" + x           // Value mapper
    ));
```

**Common Collectors:**
```java
// To List
List<Integer> list = stream.collect(Collectors.toList());

// To Set
Set<Integer> set = stream.collect(Collectors.toSet());

// To Map
Map<Integer, String> map = stream.collect(Collectors.toMap(
    keyMapper, valueMapper
));

// Joining strings
String joined = stream.collect(Collectors.joining(", "));

// Grouping
Map<Integer, List<String>> grouped = stream.collect(
    Collectors.groupingBy(String::length)
);
```

### 5. min() and max()

**Purpose:** Find minimum or maximum element.

**Signature:** `Optional<T> min(Comparator<T> comparator)`

**Example:**
```java
List<Integer> numbers = Arrays.asList(4, 7, 10);

// Minimum (ascending order)
Optional<Integer> min = numbers.stream()
    .filter(x -> x >= 3)
    .min((a, b) -> a - b);  // Natural order
// Result: 4

// Maximum (descending order)
Optional<Integer> max = numbers.stream()
    .filter(x -> x >= 3)
    .max((a, b) -> b - a);  // Reverse order
// Result: 10
```

**Note:** `min()` and `max()` return first element in sorted order based on comparator.

### 6. count()

**Purpose:** Count number of elements.

**Signature:** `long count()`

**Example:**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 10);

long count = numbers.stream()
    .filter(x -> x >= 3)
    .count();

// Result: 6 (elements: 3, 4, 5, 6, 7, 10)
```

### 7. anyMatch(), allMatch(), noneMatch()

**Purpose:** Check if elements match condition.

**Signatures:**
- `boolean anyMatch(Predicate<T> predicate)` - Any element matches
- `boolean allMatch(Predicate<T> predicate)` - All elements match
- `boolean noneMatch(Predicate<T> predicate)` - No element matches

**Example:**
```java
List<Integer> numbers = Arrays.asList(2, 1, 4, 7, 10);

// anyMatch - At least one element matches
boolean anyGreater = numbers.stream()
    .anyMatch(x -> x > 3);
// Result: true (4, 7, 10 are > 3)

// allMatch - All elements match
boolean allGreater = numbers.stream()
    .allMatch(x -> x > 3);
// Result: false (2, 1 are not > 3)

// noneMatch - No element matches
boolean noneGreater = numbers.stream()
    .noneMatch(x -> x > 100);
// Result: true (no element > 100)
```

### 8. findFirst() and findAny()

**Purpose:** Find first or any element.

**Signatures:**
- `Optional<T> findFirst()` - First element
- `Optional<T> findAny()` - Any element (non-deterministic)

**Example:**
```java
List<Integer> numbers = Arrays.asList(2, 1, 4, 7, 10);

// findFirst - First element after filter
Optional<Integer> first = numbers.stream()
    .filter(x -> x >= 3)
    .findFirst();
// Result: 4 (first element >= 3)

// findAny - Any element (may vary in parallel)
Optional<Integer> any = numbers.stream()
    .filter(x -> x >= 3)
    .findAny();
// Result: Could be 4, 7, or 10 (non-deterministic)
```

**Note:** `findAny()` is useful for parallel streams (faster, but non-deterministic).

### Summary of Terminal Operations

| Operation | Purpose | Return Type |
|-----------|---------|-------------|
| `forEach()` | Perform action | void |
| `toArray()` | Convert to array | Object[] or T[] |
| `reduce()` | Aggregation | Optional<T> or T |
| `collect()` | Collect to collection | Collection/Map |
| `min()` | Find minimum | Optional<T> |
| `max()` | Find maximum | Optional<T> |
| `count()` | Count elements | long |
| `anyMatch()` | Any matches? | boolean |
| `allMatch()` | All match? | boolean |
| `noneMatch()` | None match? | boolean |
| `findFirst()` | First element | Optional<T> |
| `findAny()` | Any element | Optional<T> |

---

## Lazy Evaluation

### What is Lazy Evaluation?

**Lazy evaluation** means intermediate operations are **not executed** until a terminal operation is invoked.

**Key Point:** Stream operations are **lazy** - they wait for terminal operation to trigger execution.

### Example: Lazy Evaluation

```java
List<Integer> numbers = Arrays.asList(2, 1, 4, 7, 10);

// No terminal operation - nothing executes
numbers.stream()
    .filter(x -> x >= 3)
    .peek(x -> System.out.println("After filter: " + x));

// Output: (Nothing printed - stream not executed)

// With terminal operation - stream executes
long count = numbers.stream()
    .filter(x -> x >= 3)
    .peek(x -> System.out.println("After filter: " + x))
    .count();

// Output:
// After filter: 4
// After filter: 7
// After filter: 10
// count: 3
```

**Why Lazy?**
- **Performance:** Can optimize operations
- **Short-circuiting:** Can stop early (e.g., findFirst)
- **Efficiency:** Only process what's needed

### Sequential Processing

**How Stream Processes Elements:**

**Important:** Stream processes elements **one at a time** through the entire pipeline (not all at once).

**Example:**
```java
List<Integer> numbers = Arrays.asList(2, 1, 4, 7, 10);

numbers.stream()
    .filter(x -> x >= 3)
    .peek(x -> System.out.println("After filter: " + x))
    .map(x -> -x)
    .peek(x -> System.out.println("After negating: " + x))
    .sorted()
    .peek(x -> System.out.println("After sorted: " + x))
    .collect(Collectors.toList());
```

**Processing Flow:**
```
Element 2:
  filter(2 >= 3) → false → removed

Element 1:
  filter(1 >= 3) → false → removed

Element 4:
  filter(4 >= 3) → true → passes
  peek: "After filter: 4"
  map: -4
  peek: "After negating: -4"
  (sorted waits - needs all elements)

Element 7:
  filter(7 >= 3) → true → passes
  peek: "After filter: 7"
  map: -7
  peek: "After negating: -7"
  (sorted waits)

Element 10:
  filter(10 >= 3) → true → passes
  peek: "After filter: 10"
  map: -10
  peek: "After negating: -10"
  (sorted waits)

Now sorted executes (has all elements):
  sorted: [-10, -7, -4]
  peek: "After sorted: -10"
  peek: "After sorted: -7"
  peek: "After sorted: -4"
```

**Key Insight:**
- **Sequential processing:** One element at a time
- **Stateful operations:** Some operations (like `sorted()`) need all elements first
- **Stateless operations:** Operations like `filter()`, `map()` can process element-by-element

---

## Sequential vs Parallel Streams

### Sequential Stream

**Default behavior:** Processes elements one by one in sequence.

**Example:**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);

long startTime = System.currentTimeMillis();

numbers.stream()  // Sequential stream
    .map(x -> x * x)
    .forEach(x -> System.out.print(x + " "));

long endTime = System.currentTimeMillis();
System.out.println("\nSequential time: " + (endTime - startTime) + " ms");
```

### Parallel Stream

**Processes elements concurrently using multiple threads.**

**How to Create:**
```java
// Method 1: parallelStream()
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
Stream<Integer> parallelStream = numbers.parallelStream();

// Method 2: stream().parallel()
Stream<Integer> parallelStream2 = numbers.stream().parallel();
```

**Example:**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11);

long startTime = System.currentTimeMillis();

numbers.parallelStream()  // Parallel stream
    .map(x -> x * x)
    .forEach(x -> System.out.print(x + " "));

long endTime = System.currentTimeMillis();
System.out.println("\nParallel time: " + (endTime - startTime) + " ms");
```

### How Parallel Stream Works

**Fork-Join Pool Technique:**

**Step 1: Splitting (Fork)**
```
Original Collection: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

SplitIterator splits:
  [1, 2, 3, 4, 5]  |  [6, 7, 8, 9, 10]
  
Further split (if needed):
  [1, 2, 3] | [4, 5]  |  [6, 7, 8] | [9, 10]
```

**Step 2: Parallel Processing**
```
Thread 1: Process [1, 2, 3]
Thread 2: Process [4, 5]
Thread 3: Process [6, 7, 8]
Thread 4: Process [9, 10]

All threads work concurrently
```

**Step 3: Joining (Join)**
```
Combine results from all threads:
  Thread 1 result + Thread 2 result + Thread 3 result + Thread 4 result
```

**Visual Representation:**
```
Sequential:
[1,2,3,4,5,6,7,8,9,10] → Process → Result
     (one by one)

Parallel:
[1,2,3,4,5,6,7,8,9,10]
     ↓ (split)
[1,2,3] [4,5] [6,7,8] [9,10]
     ↓ (process concurrently)
Thread1 Thread2 Thread3 Thread4
     ↓ (join)
     Result
```

### When to Use Parallel Stream?

✅ **Use when:**
- **Large datasets** (millions of elements)
- **CPU-intensive operations** (complex calculations)
- **Independent operations** (no shared state)
- **Multi-core CPU** available

❌ **Don't use when:**
- **Small datasets** (overhead > benefit)
- **Order matters** (parallel may change order)
- **Shared mutable state** (thread-safety issues)
- **I/O operations** (blocking, not CPU-bound)

### Performance Comparison

**Example:**
```java
List<Integer> numbers = new ArrayList<>();
for (int i = 1; i <= 11; i++) {
    numbers.add(i);
}

// Sequential
long start1 = System.currentTimeMillis();
numbers.stream()
    .map(x -> x * x)
    .forEach(x -> {});
long seqTime = System.currentTimeMillis() - start1;

// Parallel
long start2 = System.currentTimeMillis();
numbers.parallelStream()
    .map(x -> x * x)
    .forEach(x -> {});
long parTime = System.currentTimeMillis() - start2;

System.out.println("Sequential: " + seqTime + " ms");
System.out.println("Parallel: " + parTime + " ms");
// Parallel is faster for large datasets
```

---

## Stream Properties

### 1. Stream Cannot Be Reused

**Once terminal operation is executed, stream is closed.**

**Example:**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
Stream<Integer> stream = numbers.stream()
    .filter(x -> x > 2);

// First terminal operation
stream.forEach(System.out::println);  // ✅ Works

// Try to use again
stream.collect(Collectors.toList());  // ❌ IllegalStateException
// Error: stream has already been operated upon or closed
```

**Solution:** Create new stream for each operation
```java
// Create new stream each time
numbers.stream().filter(x -> x > 2).forEach(System.out::println);
numbers.stream().filter(x -> x > 2).collect(Collectors.toList());
```

### 2. Original Collection Unchanged

**Stream operations don't modify source collection.**

**Example:**
```java
List<Integer> numbers = new ArrayList<>(Arrays.asList(1, 2, 3, 4, 5));

List<Integer> result = numbers.stream()
    .filter(x -> x > 2)
    .map(x -> x * 2)
    .collect(Collectors.toList());

System.out.println("Original: " + numbers);  // [1, 2, 3, 4, 5] (unchanged)
System.out.println("Result: " + result);     // [6, 8, 10] (new collection)
```

### 3. Intermediate Operations Are Lazy

**Not executed until terminal operation invoked.**

**Example:**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);

// No execution yet (lazy)
Stream<Integer> stream = numbers.stream()
    .filter(x -> {
        System.out.println("Filtering: " + x);  // Won't print yet
        return x > 2;
    });

// Now executes (terminal operation)
long count = stream.count();  // Now "Filtering: ..." will print
```

### 4. Short-Circuiting Operations

**Some operations can stop early (don't need all elements).**

**Short-Circuiting Intermediate:**
- `limit()` - Stops after n elements
- `findFirst()` - Stops after finding first

**Short-Circuiting Terminal:**
- `anyMatch()` - Stops after first match
- `allMatch()` - Stops after first non-match
- `noneMatch()` - Stops after first match
- `findFirst()` - Stops after finding first

**Example:**
```java
List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5, 6, 7, 8, 9, 10);

// Short-circuits after finding first element > 5
Optional<Integer> first = numbers.stream()
    .filter(x -> x > 5)
    .findFirst();
// Only processes: 1, 2, 3, 4, 5, 6 (stops at 6)
```

---

## Summary

### Stream Pipeline

**Three Steps:**
1. **Create Stream** - From collection/array
2. **Intermediate Operations** - Transform (0 or more)
3. **Terminal Operation** - Produce result (exactly 1)

### Key Concepts

1. **Lazy Evaluation:** Intermediate operations execute only when terminal operation invoked
2. **Immutable:** Original collection unchanged
3. **One-time use:** Stream cannot be reused after terminal operation
4. **Sequential Processing:** Elements processed one at a time
5. **Parallel Processing:** Can process concurrently for better performance

### Intermediate Operations

- `filter()` - Filter elements
- `map()` - Transform elements
- `flatMap()` - Flatten nested collections
- `distinct()` - Remove duplicates
- `sorted()` - Sort elements
- `peek()` - Debug/logging
- `limit()` - Truncate
- `skip()` - Skip elements
- `mapToInt()` - Convert to primitive stream

### Terminal Operations

- `forEach()` - Perform action
- `toArray()` - Convert to array
- `reduce()` - Aggregation
- `collect()` - Collect to collection
- `min()/max()` - Find min/max
- `count()` - Count elements
- `anyMatch()/allMatch()/noneMatch()` - Match conditions
- `findFirst()/findAny()` - Find elements

### Parallel Streams

- **Use `parallelStream()`** or `stream().parallel()`
- **Fork-Join Pool** technique
- **Faster for large datasets**
- **Use with caution** (order, thread-safety)

---

## Practice Exercises

1. Filter a list of numbers to find all even numbers greater than 10.

2. Transform a list of strings to uppercase and filter by length > 5.

3. Flatten a list of lists using flatMap.

4. Find sum of squares of all numbers in a list using reduce.

5. Group a list of strings by their length using collect.

6. Compare sequential vs parallel stream performance.

---

## Interview Questions

1. **What is Stream?**  
   Pipeline through which data flows and can be processed with operations.

2. **What are the three steps of Stream pipeline?**  
   Create stream, intermediate operations (0 or more), terminal operation (exactly 1).

3. **What is lazy evaluation?**  
   Intermediate operations don't execute until terminal operation is invoked.

4. **What is the difference between filter() and map()?**  
   filter() selects elements (Predicate), map() transforms elements (Function).

5. **What is flatMap()?**  
   Flattens nested collections (list of lists → single list).

6. **What is the difference between peek() and forEach()?**  
   peek() is intermediate (lazy), forEach() is terminal (eager).

7. **What is reduce()?**  
   Performs aggregation operation (sum, product, etc.) using associative function.

8. **Can you reuse a stream after terminal operation?**  
   No, stream is closed after terminal operation. Must create new stream.

9. **What is the difference between sequential and parallel stream?**  
   Sequential processes one by one, parallel processes concurrently using multiple threads.

10. **How does parallel stream work?**  
    Uses Fork-Join Pool: splits data, processes in parallel, joins results.

11. **What is the difference between findFirst() and findAny()?**  
    findFirst() returns first element, findAny() returns any element (non-deterministic, useful for parallel).

12. **What is mapToInt()?**  
    Converts stream to IntStream (primitive) for better performance.

13. **What operations are short-circuiting?**  
    limit(), findFirst(), anyMatch(), allMatch(), noneMatch().

14. **Does stream modify original collection?**  
    No, stream operations are immutable. Original collection remains unchanged.

15. **When to use parallel stream?**  
    Large datasets, CPU-intensive operations, independent operations, multi-core CPU available.

