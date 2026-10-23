# Two Sum

**Topic:** Arrays & Hashing · **Difficulty:** Easy · **Status:** Solved independently

---

## Quick Revision

| | |
|---|---|
| **Pattern** | Hash map of value → index; look up the complement |
| **Core** | For each `i`: if map has `target - nums[i]` → return; else `put(nums[i], i)` |
| **Key insight** | Check *before* inserting → never pairs with itself; `[3,3]` still works |
| **Complexity** | O(n) time, O(n) space |
| **Traps** | `containsKey` (not `contains`); `target - nums[i]` ≤ 2×10⁹ fits in `int` |

---

## Code

```java
public int[] twoSum(int[] nums, int target) {
    Map<Integer, Integer> seen = new HashMap<>();
    for (int i = 0; i < nums.length; i++) {
        Integer j = seen.get(target - nums[i]);
        if (j != null) return new int[]{j, i};
        seen.put(nums[i], i);
    }
    throw new IllegalArgumentException("no solution");
}
```
