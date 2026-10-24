# Subarray Sum Equals K

**Topic:** Arrays & Hashing (Prefix sums) · **Difficulty:** Medium · **Status:** Solved independently (several guiding questions)

---

## Quick Revision

| | |
|---|---|
| **Pattern** | Prefix sum + hash map of `sum → how many times seen`; count matches of `curSum - k` |
| **Core** | Map starts `{0: 1}`. For each x: `sum += x; ans += map.getOrDefault(sum - k, 0); map.merge(sum, 1, Integer::sum)` |
| **Key insight** | `{0: 1}` is the **empty prefix** (running sum before index 0), so subarrays starting at index 0 are counted |
| **Complexity** | O(n) time (average, hash map), O(n) space: one entry per distinct prefix sum |
| **Traps** | Sliding window fails with negatives; look up *before* inserting; store **counts**, not indices |

**Follow-up:** if every number is positive, a sliding window works in O(1) extra space: the sum only grows when you extend and only shrinks when you drop from the left.

---

## Code

```java
public int subarraySum(int[] nums, int k) {
    Map<Integer, Integer> seen = new HashMap<>();
    seen.put(0, 1); // empty prefix: running sum before index 0
    int sum = 0, count = 0;
    for (int x : nums) {
        sum += x;
        count += seen.getOrDefault(sum - k, 0);
        seen.merge(sum, 1, Integer::sum);
    }
    return count;
}
```
