public class Solution7 {
    // User input
    public static int findMax(int[] arr) {
        if (arr.length == 0) {
            throw new IllegalArgumentException("Array is empty");
        }
        
        int max = arr[0];
        for (int i = 1; i < arr.length; i++) {
            if (arr[i] > max) {
                max = arr[i];
            }
        }
        return max;
    }
    // End of user input

    static class Checker {
        public static void check(int[] arr, int expected) {
            int result = findMax(arr);
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
        int[] arr = new int[parts.length];
        
        for (int i = 0; i < parts.length; i++) {
            arr[i] = Integer.parseInt(parts[i].trim());
        }
        return arr;
    }

    public static void main(String[] args) {
        if (args.length != 2) {
            System.err.printf("Usage: java Solution7 <array> <expected>%n");
            System.exit(1);
        }

        int[] arr = parseArray(args[0]);
        int expected = Integer.parseInt(args[1]);

        Checker.check(arr, expected);
    }
} 