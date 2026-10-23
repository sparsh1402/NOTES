# Product of Array Except Self

**Topic:** Arrays & Hashing (Prefix/Suffix) · **Difficulty:** Medium · **Status:** Solved independently (1 guiding question)

---

## Quick Revision

| | |
|---|---|
| **Pattern** | `answer[i]` = (product of left) × (product of right); no division |
| **Core** | Pass 1 → `ans[i] = left; left *= nums[i]`. Pass 2 ← `ans[i] *= right; right *= nums[i]` |
| **Key insight** | Start both running products at **1**; zeros need no special case |
| **Complexity** | O(n) time, O(1) extra space (output array not counted) |
| **Traps** | Division is forbidden; state "output vs auxiliary space" explicitly |

---

## Code

```java
public int[] productExceptSelf(int[] nums) {
    int n = nums.length;
    int[] ans = new int[n];
    int left = 1;
    for (int i = 0; i < n; i++) { ans[i] = left; left *= nums[i]; }
    int right = 1;
    for (int i = n - 1; i >= 0; i--) { ans[i] *= right; right *= nums[i]; }
    return ans;
}
```
