# SOLID Principles (Applied to a Spring Boot Service)

## Quick Revision

| Principle | One-line rule | Smell that tells you it's broken | Standard fix |
|---|---|---|---|
| **S** – Single Responsibility | A class has one **reason to change** | One class talks to the DB, a mail client, S3 and holds business rules | Split by who would request a change; keep a thin orchestrator |
| **O** – Open/Closed | Add behaviour by **adding code**, not editing working code | A growing `if/else` or `switch` on a type | Strategy pattern + Spring `List<Strategy>` → `EnumMap` |
| **L** – Liskov Substitution | A subclass must keep the parent's **contract** | Override throws `UnsupportedOperationException`, or silently changes behaviour | Split the hierarchy by capability (`Withdrawable`) |
| **I** – Interface Segregation | Clients depend only on methods they use | Implementers write fake or throwing methods | Small **role** interfaces, split by which clients use them together |
| **D** – Dependency Inversion | Business logic depends on abstractions **it owns** | A service holds a vendor SDK or concrete repository class | Domain interface + infrastructure adapter |

**How to answer any SOLID question in an interview (three beats):**
1. **The concrete failure**: what goes wrong, with an example ("area is 16, the assert fails").
2. **The principle** it breaks, and *why* (which promise or which reason to change).
3. **The fix** you'd defend, ideally in code.

Avoid filler like "it's not clean", "it's more maintainable" or "so yeah". Say the consequence instead.

---

## S – Single Responsibility Principle

**A class should have one reason to change.** The test: *who could ask for a change to this class?* If several different teams or concerns could, it has several responsibilities.

SRP is **not** about the number of methods. A single `generateInvoice()` that calculates GST, builds a PDF, uploads to S3 and emails the customer has four reasons to change:

| Responsibility | Who asks for the change |
|---|---|
| GST calculation | Finance / tax law changes |
| PDF layout | Product / design |
| Storage | Infrastructure (S3 → GCS) |
| Notification | Adding SMS or WhatsApp |

### Example

```java
// Before: OrderService prices, saves and emails = three reasons to change

// After: OrderService only coordinates
@Service
class OrderService {
    private final OrderPricer pricer;
    private final OrderRepository repo;
    private final OrderNotifier notifier;

    Order place(OrderRequest req) {
        Order order = Order.from(req, pricer.price(req));
        repo.save(order);
        notifier.orderPlaced(order);
        return order;
    }
}
```

### Why the split helps (the concrete benefits)

- **Isolated tests:** `OrderPricer` is pure logic, so it's a plain unit test with no DB, mail server or mocks. Each piece is tested with only its own dependencies.
- **Contained changes:** a change to email templates can't break pricing. Smaller blast radius.
- **Parallel work, fewer merge conflicts:** different developers edit different files.
- **Reuse:** the cart page can show a price preview with `OrderPricer` without pulling in DB or email code.

> **Interview line:** "Each piece can be tested in isolation with only its own dependencies, changes in one area can't break another, and the pieces can be reused, like pricing for a cart preview."

---

## O – Open/Closed Principle

**Open for extension, closed for modification.** New behaviour = new class. Working, tested code isn't edited.

### The smell

```java
BigDecimal applyDiscount(Order o) {
    if (o.type() == FESTIVE) return ...;
    else if (o.type() == PRIME) return ...;
    else if (o.type() == FIRST_ORDER) return ...;
    return o.total();
}
```

### Concrete risks of "just add another `case`"

1. **Regression risk:** every new type edits code that already works in production. A typo or missing `break` breaks a type nobody meant to touch, so everything needs retesting and redeploying.
2. **Scattered switches:** the same `switch` usually lives in several methods (`send()`, `validate()`, `rateLimit()`, `format()`). Miss one and the new type silently falls into `default`.
3. **Merge conflicts:** two developers adding two types edit the same method.

### The fix: Strategy pattern, wired by Spring

```java
public interface DiscountStrategy {
    DiscountType type();                  // each strategy declares the type it handles
    BigDecimal apply(Order order);
}

@Component
class FestiveDiscount implements DiscountStrategy {
    public DiscountType type() { return DiscountType.FESTIVE; }
    public BigDecimal apply(Order o) { return o.total().multiply(new BigDecimal("0.80")); }
}

@Service
class OrderPricer {
    private final Map<DiscountType, DiscountStrategy> strategies;

    OrderPricer(List<DiscountStrategy> all) {          // Spring injects every @Component strategy
        this.strategies = all.stream().collect(Collectors.toMap(
                DiscountStrategy::type,
                Function.identity(),
                (a, b) -> { throw new IllegalStateException("Duplicate strategy for " + a.type()); },
                () -> new EnumMap<>(DiscountType.class)));
    }

    BigDecimal price(Order order) {
        DiscountStrategy s = strategies.get(order.discountType());
        return s == null ? order.total() : s.apply(order);   // or throw: decide on purpose
    }
}
```

**What makes this SDE-2 level:**
- **Zero changes to add a discount:** one new `@Component`.
- **Fails fast:** duplicate strategies crash at startup, not in production.
- **Missing key is a deliberate choice:** for money, an explicit exception is usually safer than silently charging the wrong amount.
- **`EnumMap`:** array-backed, fast, ordered by enum.
- `Map<String, DiscountStrategy>` keyed by bean name also works but ties business keys to class names, which is fragile.

### Common mistakes

- **"Inject the strategy into the `Order`":** `Order` is an entity created with `new` or loaded by JPA. It isn't a Spring bean, and Spring injects once at startup, so it can't give each order a different strategy. It also mixes service logic into the domain data.
- **"The caller passes the right strategy":** then the caller needs the `if/else`. The problem has only moved. The registry (`Map<Type, Strategy>`) is what removes it.
- **`double` for money:** always use `BigDecimal` (`0.1 + 0.2 = 0.30000000000000004`).

> **Interview line:** "I'd use the Strategy pattern: one `DiscountStrategy` per type as a Spring bean, collected into an `EnumMap` by type at startup. A new discount is one new class, and duplicates fail at boot."

---

## L – Liskov Substitution Principle

**Anywhere code uses a parent type, any subclass must work without the caller noticing.** A subclass can't:
- demand **more** from the caller (stricter inputs / preconditions),
- give back **less** (weaker guarantees / postconditions),
- throw **new kinds of exceptions** the parent's contract doesn't allow.

LSP is about **behaviour**, not just signatures. Code can compile fine and still break it.

### Example 1: Fixed deposit account

```java
class FixedDepositAccount extends Account {
    @Override
    void withdraw(BigDecimal amount) {
        throw new UnsupportedOperationException("FD can't be withdrawn before maturity");
    }
}
// TransferService(Account from, ...) crashes at runtime when handed an FD.
```

**Fix: model what each account can do, not just what it is.**

```java
abstract class Account {
    protected BigDecimal balance;
    BigDecimal balance() { return balance; }
    void deposit(BigDecimal amount) { balance = balance.add(amount); }
}

interface Withdrawable {
    void withdraw(BigDecimal amount);   // contract: may throw InsufficientFundsException, nothing else
}

class SavingsAccount extends Account implements Withdrawable { ... }
class FixedDepositAccount extends Account { void closeOnMaturity() { ... } }

@Service
class TransferService {
    void transfer(Withdrawable from, Account to, BigDecimal amount) { ... }  // FD is now a compile error
}
```

- Passing an FD to `transfer` is a **compile-time error**, not a production crash.
- No `instanceof` or `canWithdraw()` flags in callers. Needing those is itself an LSP smell.

### Example 2: Square extends Rectangle

```java
r.setWidth(5);
r.setHeight(4);
assert r.area() == 20;   // with a Square: area is 16, the assert fails
```

- `Square.setWidth(5)` sets both sides to 5, then `setHeight(4)` sets both to 4, so area is **16**.
- `Rectangle.setWidth()` has an implicit postcondition: *only the width changes, the height stays as it was*. `Square` breaks it.
- "A square IS-A rectangle" in maths doesn't mean it should be a subclass in code.
- **Fix:** make `Rectangle` and `Square` siblings implementing `Shape { area(); }`, or make shapes **immutable** (no setters, no promise to break).

### Example 3: `Collections.unmodifiableList` — does the JDK break LSP?

**Technically no, in spirit yes.**
- `List.add()` is documented as an *"optional operation"* that may throw `UnsupportedOperationException`, so the contract allows it.
- But that makes the contract so weak that you can't safely call `add()` on any `List` you receive. A common production bug: a method returns `List.of(...)`, and the caller tries to add to it.
- **Why the JDK did it:** the alternative was doubling the interfaces (`ReadOnlyList` / `MutableList`). Kotlin made the opposite choice, with `List` vs `MutableList`.
- **Practical rule:** if you'll modify a list you received, copy it first with `new ArrayList<>(input)`.

> **Interview line:** "LSP breaks when a subclass can't keep the parent's contract, like throwing an exception the parent never declared. I'd pull `withdraw` into a `Withdrawable` capability interface, so only accounts that really support it can be passed, and the compiler enforces it."

---

## I – Interface Segregation Principle

**Clients shouldn't be forced to depend on methods they don't use.** Prefer small, role-based interfaces.

### The smell

```java
interface PaymentProcessor {
    ChargeResult charge(Money amount, PaymentDetails d);
    RefundResult refund(String txnId, Money amount);
    void saveCardForFutureUse(CardDetails card);
    Subscription createRecurringMandate(MandateRequest r);
}
// CashOnDeliveryProcessor can only charge.
```

### Concrete consequences

1. **Fake implementations:** they either throw `UnsupportedOperationException` (an **LSP break**) or do nothing and return `null`, which fails silently. A refund that "succeeds" without refunding is a real money bug.
2. **A misleading API:** the type claims the object can refund and save cards.
3. **Unnecessary coupling:** a change to `MandateRequest` forces COD to be recompiled, retested and redeployed.
4. **Heavier tests:** every mock has to stub all four methods.

### The fix: split by capability

```java
interface Chargeable        { ChargeResult charge(Money amount, PaymentDetails d); }
interface Refundable        { RefundResult refund(String txnId, Money amount); }
interface CardVault         { void saveCardForFutureUse(CardDetails card); }
interface RecurringPayments { Subscription createRecurringMandate(MandateRequest r); }

class CashOnDeliveryProcessor implements Chargeable { ... }
class CardProcessor implements Chargeable, Refundable, CardVault, RecurringPayments { ... }
class UpiProcessor  implements Chargeable, Refundable, RecurringPayments { ... }

@Service
class RefundService {
    RefundService(List<Refundable> all) { ... }   // COD can never reach this service
}
```

"Refund a COD order online" becomes **impossible by construction**, not guarded by an `if`.

### Split by role, then use a strategy within a role

A fat `ReportGenerator` with `generatePdf()`, `generateExcel()`, `generateCsv()` and `emailReport()` hides two problems:
- `emailReport()` is **delivery**, not formatting. That's a different reason to change (SRP inside ISP).
- PDF, Excel and CSV are the same job done different ways, so use **one strategy interface** rather than one interface per format.

```java
interface ReportFormatter {
    ReportFormat format();          // PDF, EXCEL, CSV
    byte[] render(Report report);
}

interface ReportDelivery {
    void deliver(byte[] file, Recipient to);
}
// AuditLogExporter depends on the CSV ReportFormatter (via Map<ReportFormat, ReportFormatter>) and never sees email.
```

**Trap:** don't split *too* far. ISP is driven by clients. If every client that charges also refunds, one interface is fine.

> **Interview line:** "I'd split by role into `Chargeable`, `Refundable`, `CardVault` and `RecurringPayments`. Each processor implements only what it supports, and each service depends only on the role it needs, so COD can never reach `RefundService`."

---

## D – Dependency Inversion Principle

**High-level modules shouldn't depend on low-level modules. Both depend on abstractions, and the high-level (domain) side owns the abstraction.**

### The smell

```java
@Service
class OrderService {
    private final MySqlOrderRepository repo;   // concrete class
    private final RazorpayClient razorpay;      // vendor SDK
}
```

This uses DI (constructor injection) but **breaks DIP**:
- Razorpay's request/response types, error codes and exceptions spread through business logic, so moving to Stripe means rewriting `OrderService`.
- Unit tests have to mock a vendor SDK class (sometimes `final`, with awkward constructors).
- Same problem with `MySqlOrderRepository`: changing the store or adding a cache touches `OrderService`.

### The fix: domain interface + infrastructure adapter

```java
// Domain layer owns these, in business terms, with no vendor types
public interface PaymentGateway {
    PaymentResult charge(Money amount, PaymentDetails details);
}
public interface OrderRepository {
    Order save(Order order);
    Optional<Order> findById(String id);
}

// Infrastructure layer: the adapter translates domain <-> vendor
@Component
class RazorpayPaymentGateway implements PaymentGateway {
    private final RazorpayClient client;
    public PaymentResult charge(Money amount, PaymentDetails d) {
        // map to Razorpay's request, call it, map the response and errors back
    }
}

@Service
class OrderService {
    private final OrderRepository repo;
    private final PaymentGateway gateway;   // depends only on abstractions it owns
}
```

Moving to Stripe = one new `StripePaymentGateway`. `OrderService` and its tests don't change.

### Same pattern for Kafka

```java
// Domain layer: no Kafka, no topics, no JSON
public interface OrderEventPublisher {
    void publish(OrderPlaced event);
}

// Infrastructure layer
@Component
class KafkaOrderEventPublisher implements OrderEventPublisher {
    private final KafkaTemplate<String, String> kafka;
    private final ObjectMapper mapper;

    public void publish(OrderPlaced e) {
        kafka.send("order-events", e.orderId(), mapper.writeValueAsString(e)); // key = orderId keeps one order's events in order
    }
}
```

Topic name, serialization and partition key live only in the adapter. SQS later, or an in-memory fake in tests, is one new class. Also prefer **constructor injection** over `@Autowired` on a field.

**SDE-2 bonus:** saving to MySQL then sending to Kafka is a **dual write**. A crash between them loses the event. The fix is the **transactional outbox**: write the event to an outbox table in the same DB transaction, and publish from that table.

### Why it's called "inversion"

- Without DIP: business logic → vendor (the arrow points down to the details).
- With DIP: the vendor adapter → the business layer's interface (the arrow is inverted).

### DI vs DIP

> "DI is a **technique**: something outside the class supplies its dependencies, like Spring constructor injection. DIP is a **design rule** about which way dependencies point: business logic depends on abstractions it owns, not on concrete details. A Spring app can use DI everywhere and still break DIP when what's injected is a concrete vendor class."

---

## How the principles connect

- **ISP and LSP** are often fixed together: small capability interfaces prevent subclasses that can't keep their contract (`Withdrawable`, `Refundable`).
- **OCP** is usually achieved through **DIP + Strategy**: depend on an interface, add implementations.
- **SRP** violations often hide inside ISP ones (`emailReport` inside a formatter interface).

---

## Practice questions (from my quiz)

1. *"`InvoiceService` has one method, so it follows SRP."* → No. SRP counts reasons to change, not methods. GST, PDF layout, storage and notification are four.
2. *"Just add two more `case` branches for WhatsApp and Push."* → Breaks OCP. Risks: regression on working channels, scattered switches falling into `default`, merge conflicts. Fix: a `NotificationChannel` strategy.
3. *`Square extends Rectangle`, set width 5 then height 4, assert area 20?* → Area is 16, the assert fails. A broken postcondition, so LSP. Fix: siblings under `Shape`, or immutable shapes.
4. *Fat `ReportGenerator`, `AuditLogExporter` needs only CSV.* → ISP. Fakes or throws (which breaks LSP). Split formatting (one `ReportFormatter` strategy) from delivery (`ReportDelivery`).
5. *`OrderService` uses `KafkaTemplate` directly.* → Breaks DIP. Domain-owned `OrderEventPublisher.publish(OrderPlaced)`, implemented by a Kafka adapter in infrastructure.

---

## My gaps to watch (quiz score 5.0/10)

| What I did | Strong answer |
|---|---|
| Named the principle and stopped | Concrete failure → principle → fix |
| "Code modification is not a good thing", "not clean" | Regression risk, silent `default`, merge conflicts |
| Couldn't apply DIP to `KafkaTemplate` | Domain interface + infrastructure adapter, every time |
| Treated `emailReport` as just another format | Delivery is a separate responsibility (SRP inside ISP) |
| Injected a strategy into the `Order` entity | Entities aren't beans; use a `Map<Type, Strategy>` registry in a service |
| Ended answers with "so yeah" | End on the strongest point |
