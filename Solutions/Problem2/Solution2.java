import java.util.Arrays;

public class Solution2 {
    // User input
    public static int search(int[] nums, int target) {
        int left = 0;
        int right = nums.length - 1;
        
        while (left <= right) {
            int mid = left + (right - left) / 2;
            
            if (nums[mid] == target) {
                return mid;
            }
            
            if (nums[mid] < target) {
                left = mid + 1;
            } else {
                right = mid - 1;
            }
        }
        return -1;
    }
    // End of user input

    static class Checker {
        public static void check(int[] nums, int target, int expected) {
            int result = search(nums, target);
            if (result == expected) {
                System.out.printf("Test Case Passed: Result = %d, Expected = %d%n", 
                                result, expected);
            } else {
                System.out.printf("Failed Test Case: Result = %d, Expected = %d%n", 
                                result, expected);
            }
        }
    }

    private static int[] parseArray(String str) {
        str = str.substring(1, str.length() - 1); // Remove [ ]
        String[] parts = str.split(",");
        int[] nums = new int[parts.length];
        
        for (int i = 0; i < parts.length; i++) {
            nums[i] = Integer.parseInt(parts[i].trim());
        }
        return nums;
    }

    public static void main(String[] args) {
        if (args.length != 3) {
            System.err.printf("Usage: java Solution2 <array> <target> <expected>%n");
            System.exit(1);
        }

        int[] nums = parseArray(args[0]);
        int target = Integer.parseInt(args[1]);
        int expected = Integer.parseInt(args[2]);

        Checker.check(nums, target, expected);
    }
} 