# Java Threading - Part 7: Future, Callable, and CompletableFuture

## Table of Contents
- [Future Interface](#future-interface)
- [Callable vs Runnable](#callable-vs-runnable)
- [CompletableFuture](#completablefuture)
- [CompletableFuture Methods](#completablefuture-methods)
- [Summary](#summary)

---

## Future Interface

### What is Future?

**Future** represents the **result of an asynchronous task**.

**Purpose:** Allows caller to:
- **Check status** of async task
- **Get result** when task completes
- **Cancel** task if needed
- **Handle exceptions**

### Problem Without Future

**Without Future:**
```java
ExecutorService executor = Executors.newFixedThreadPool(1);
executor.submit(() -> {
    // Long-running task
    Thread.sleep(5000);
    System.out.println("Task completed");
});

// Main thread continues immediately
// No way to know task status or result
```

**With Future:**
```java
ExecutorService executor = Executors.newFixedThreadPool(1);
Future<?> future = executor.submit(() -> {
    Thread.sleep(5000);
    return "Task completed";
});

// Can check status, get result, cancel
if (future.isDone()) {
    String result = (String) future.get();
}
```

### Future Methods

**1. cancel(boolean mayInterruptIfRunning):**
```java
boolean cancelled = future.cancel(true);
// Attempts to cancel task
// Returns true if cancelled, false if already completed
```

**2. isCancelled():**
```java
boolean isCancelled = future.isCancelled();
// Returns true if task was cancelled
```

**3. isDone():**
```java
boolean isDone = future.isDone();
// Returns true if task completed (normally, exception, or cancelled)
```

**4. get():**
```java
Object result = future.get();
// Blocks until task completes
// Returns result
// Throws InterruptedException, ExecutionException
```

**5. get(long timeout, TimeUnit unit):**
```java
Object result = future.get(3, TimeUnit.SECONDS);
// Waits maximum 3 seconds
// Throws TimeoutException if not completed
```

### Future Example

```java
import java.util.concurrent.*;

public class FutureExample {
    public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(1);
        
        Future<?> future = executor.submit(() -> {
            System.out.println("Task started");
            Thread.sleep(7000);
            return "Task completed";
        });
        
        // Check status
        System.out.println("Is done: " + future.isDone());  // false
        
        // Wait with timeout
        try {
            String result = (String) future.get(2, TimeUnit.SECONDS);
            System.out.println("Result: " + result);
        } catch (TimeoutException e) {
            System.out.println("Timeout - task not completed in 2 seconds");
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        // Wait indefinitely
        try {
            String result = (String) future.get();
            System.out.println("Result: " + result);
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        // Check final status
        System.out.println("Is done: " + future.isDone());  // true
        System.out.println("Is cancelled: " + future.isCancelled());  // false
        
        executor.shutdown();
    }
}
```

**Output:**
```
Task started
Is done: false
Timeout - task not completed in 2 seconds
Result: Task completed
Is done: true
Is cancelled: false
```

---

## Callable vs Runnable

### Runnable Interface

**Runnable:**
- **No return value** (`void`)
- **Cannot throw checked exceptions**
- **Functional interface:** `@FunctionalInterface`

```java
@FunctionalInterface
public interface Runnable {
    void run();
}
```

### Callable Interface

**Callable:**
- **Returns value** (generic type)
- **Can throw checked exceptions**
- **Functional interface:** `@FunctionalInterface`

```java
@FunctionalInterface
public interface Callable<V> {
    V call() throws Exception;
}
```

### Three Flavors of submit()

**1. submit(Runnable):**
```java
Future<?> future = executor.submit(() -> {
    System.out.println("Task");
    // No return value
});
// Future<?> - wildcard (unknown type, always null)
```

**2. submit(Runnable, T result):**
```java
List<Integer> result = new ArrayList<>();
Future<List<Integer>> future = executor.submit(() -> {
    result.add(100);  // Modify shared object
}, result);
// Returns provided result object
```

**3. submit(Callable<T>):**
```java
Future<String> future = executor.submit(() -> {
    return "Task completed";  // Return value
});
// Future<String> - typed return value
```

### Example: Runnable vs Callable

**Runnable (No Return):**
```java
ExecutorService executor = Executors.newFixedThreadPool(1);

Future<?> future = executor.submit(() -> {
    System.out.println("Processing...");
    Thread.sleep(2000);
    // No return value
});

Object result = future.get();
System.out.println("Result: " + result);  // null
```

**Callable (Returns Value):**
```java
ExecutorService executor = Executors.newFixedThreadPool(1);

Future<String> future = executor.submit(() -> {
    System.out.println("Processing...");
    Thread.sleep(2000);
    return "Task completed";  // Return value
});

String result = future.get();
System.out.println("Result: " + result);  // "Task completed"
```

### When to Use Which?

**Use Runnable when:**
- Task doesn't need to return value
- Simple fire-and-forget tasks

**Use Callable when:**
- Task needs to return value
- Need result for further processing
- Cleaner than workaround with shared objects

---

## CompletableFuture

### What is CompletableFuture?

**CompletableFuture** is an **advanced version of Future** introduced in Java 8.

**Key Features:**
- **All Future capabilities** (status, result, cancel)
- **Chaining operations** (thenApply, thenCompose, etc.)
- **Combining futures** (thenCombine)
- **Better async programming**

**Inheritance:**
```java
CompletableFuture<T> implements Future<T>, CompletionStage<T>
```

### Why CompletableFuture?

**Future Limitations:**
- **No chaining:** Can't chain multiple async operations
- **No composition:** Can't combine multiple futures easily
- **Blocking:** `get()` blocks (no non-blocking callbacks)

**CompletableFuture Advantages:**
- **Chaining:** Chain multiple async operations
- **Composition:** Combine multiple futures
- **Non-blocking:** Callbacks instead of blocking

---

## CompletableFuture Methods

### 1. supplyAsync()

**Purpose:** Initiate async operation.

**Signature:**
```java
static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier)
static <U> CompletableFuture<U> supplyAsync(Supplier<U> supplier, Executor executor)
```

**Example:**
```java
ExecutorService executor = Executors.newFixedThreadPool(5);

CompletableFuture<String> future = CompletableFuture.supplyAsync(() -> {
    System.out.println("Thread: " + Thread.currentThread().getName());
    try {
        Thread.sleep(5000);
    } catch (InterruptedException e) {
        e.printStackTrace();
    }
    return "Task completed";
}, executor);

String result = future.get();
System.out.println("Result: " + result);
```

**Key Points:**
- **Uses ForkJoinPool** if executor not provided
- **Returns CompletableFuture** with result type
- **Non-blocking:** Returns immediately

### 2. thenApply() and thenApplyAsync()

**Purpose:** Apply function to result of previous async operation.

**Signature:**
```java
<U> CompletableFuture<U> thenApply(Function<? super T, ? extends U> fn)
<U> CompletableFuture<U> thenApplyAsync(Function<? super T, ? extends U> fn)
```

**Difference:**
- **thenApply:** Uses **same thread** (synchronous)
- **thenApplyAsync:** Uses **new thread** (asynchronous)

**Example:**
```java
CompletableFuture<String> future = CompletableFuture
    .supplyAsync(() -> {
        System.out.println("SupplyAsync: " + Thread.currentThread().getName());
        return "Hello";
    }, executor)
    .thenApply(str -> {
        System.out.println("ThenApply: " + Thread.currentThread().getName());
        return str + " World";
    })
    .thenApplyAsync(str -> {
        System.out.println("ThenApplyAsync: " + Thread.currentThread().getName());
        return str + "!";
    }, executor);

String result = future.get();
System.out.println("Result: " + result);  // "Hello World!"
```

**Output:**
```
SupplyAsync: pool-1-thread-1
ThenApply: pool-1-thread-1  (same thread)
ThenApplyAsync: pool-1-thread-2  (different thread)
Result: Hello World!
```

### 3. thenCompose() and thenComposeAsync()

**Purpose:** Chain **dependent** async operations (maintains ordering).

**Signature:**
```java
<U> CompletableFuture<U> thenCompose(Function<? super T, ? extends CompletionStage<U>> fn)
<U> CompletableFuture<U> thenComposeAsync(Function<? super T, ? extends CompletionStage<U>> fn)
```

**Difference from thenApply:**
- **thenApply:** Works on **value** (T → U)
- **thenCompose:** Works on **CompletableFuture** (T → CompletableFuture<U>)

**Example:**
```java
CompletableFuture<String> future = CompletableFuture
    .supplyAsync(() -> "Hello", executor)
    .thenCompose(str -> 
        CompletableFuture.supplyAsync(() -> str + " World", executor)
    )
    .thenCompose(str -> 
        CompletableFuture.supplyAsync(() -> str + "!", executor)
    );

String result = future.get();
System.out.println("Result: " + result);  // "Hello World!"
```

**Key Point:** **Ordering guaranteed** - second operation starts only after first completes.

### 4. thenAccept() and thenAcceptAsync()

**Purpose:** End stage in chain (consumes result, no return).

**Signature:**
```java
CompletableFuture<Void> thenAccept(Consumer<? super T> action)
CompletableFuture<Void> thenAcceptAsync(Consumer<? super T> action)
```

**Example:**
```java
CompletableFuture<Void> future = CompletableFuture
    .supplyAsync(() -> "Hello World", executor)
    .thenAccept(result -> {
        System.out.println("Result: " + result);
        // No return value
    });

future.get();  // Wait for completion
```

**Key Point:** Returns `CompletableFuture<Void>` (cannot chain further with thenApply).

### 5. thenCombine() and thenCombineAsync()

**Purpose:** Combine results of **two independent** CompletableFutures.

**Signature:**
```java
<U, V> CompletableFuture<V> thenCombine(
    CompletionStage<? extends U> other,
    BiFunction<? super T, ? super U, ? extends V> fn
)
```

**Example:**
```java
CompletableFuture<Integer> future1 = CompletableFuture
    .supplyAsync(() -> 10, executor);

CompletableFuture<String> future2 = CompletableFuture
    .supplyAsync(() -> "K", executor);

CompletableFuture<String> combined = future1.thenCombine(future2, 
    (num, str) -> num + str
);

String result = combined.get();
System.out.println("Result: " + result);  // "10K"
```

**Key Point:** Combines **two independent** futures into one result.

### Complete Example

```java
import java.util.concurrent.*;

public class CompletableFutureExample {
    public static void main(String[] args) {
        ExecutorService executor = Executors.newFixedThreadPool(5);
        
        CompletableFuture<String> future = CompletableFuture
            .supplyAsync(() -> {
                System.out.println("Step 1: " + Thread.currentThread().getName());
                return "Hello";
            }, executor)
            .thenApply(str -> {
                System.out.println("Step 2: " + Thread.currentThread().getName());
                return str + " World";
            })
            .thenCompose(str -> 
                CompletableFuture.supplyAsync(() -> {
                    System.out.println("Step 3: " + Thread.currentThread().getName());
                    return str + "!";
                }, executor)
            )
            .thenAccept(result -> {
                System.out.println("Final: " + result);
            });
        
        try {
            future.get();
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        executor.shutdown();
    }
}
```

---

## Summary

### Future Interface

- **Represents** result of async task
- **Methods:** `get()`, `isDone()`, `cancel()`, `isCancelled()`
- **Blocks** on `get()` until completion

### Callable vs Runnable

- **Runnable:** No return value, no checked exceptions
- **Callable:** Returns value, can throw checked exceptions
- **Use Callable** when you need return value

### CompletableFuture

- **Advanced Future** with chaining capabilities
- **Methods:** `supplyAsync()`, `thenApply()`, `thenCompose()`, `thenAccept()`, `thenCombine()`
- **Chaining:** Chain multiple async operations
- **Composition:** Combine multiple futures

### Key Methods

- **supplyAsync():** Initiate async operation
- **thenApply():** Transform result (same thread)
- **thenApplyAsync():** Transform result (new thread)
- **thenCompose():** Chain dependent async operations
- **thenAccept():** Consume result (end of chain)
- **thenCombine():** Combine two independent futures

---

## Key Takeaways

1. **Future** = Represents async task result
2. **Callable** = Runnable with return value
3. **CompletableFuture** = Advanced Future with chaining
4. **supplyAsync()** = Start async operation
5. **thenApply()** = Transform result (synchronous)
6. **thenApplyAsync()** = Transform result (asynchronous)
7. **thenCompose()** = Chain dependent operations (ordering)
8. **thenAccept()** = End of chain (consume result)
9. **thenCombine()** = Combine two futures

---

## Interview Questions

1. **What is Future?**  
   Interface representing result of async task. Allows checking status, getting result, canceling.

2. **What is the difference between Runnable and Callable?**  
   Runnable returns void, Callable returns value. Callable can throw checked exceptions.

3. **What is CompletableFuture?**  
   Advanced Future with chaining capabilities. Allows composing multiple async operations.

4. **What is the difference between thenApply and thenApplyAsync?**  
   thenApply uses same thread (synchronous), thenApplyAsync uses new thread (asynchronous).

5. **What is thenCompose?**  
   Chains dependent async operations, maintains ordering. Second operation starts only after first completes.

6. **What is thenCombine?**  
   Combines results of two independent CompletableFutures into one result.

7. **What is thenAccept?**  
   End stage in chain that consumes result without returning value. Returns CompletableFuture<Void>.

8. **What is supplyAsync?**  
   Static method to initiate async operation. Returns CompletableFuture with result.

9. **When to use CompletableFuture vs Future?**  
   Use CompletableFuture when you need chaining, composition, or non-blocking callbacks.

10. **What executor does supplyAsync use by default?**  
    ForkJoinPool.commonPool() if executor not provided.

