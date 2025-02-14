public class Solution5 {
    // User input
    public static int fibonacci(int n) {
        if (n <= 0) return 0;
        if (n == 1) return 1;
        
        int prev = 0, curr = 1;
        for (int i = 2; i <= n; i++) {
            int next = prev + curr;
            prev = curr;
            curr = next;
        }
        return curr;
    }
    // End of user input

    static class Checker {
        public static void check(int n, int expected) {
            int result = fibonacci(n);
            if (result == expected) {
                System.out.printf("Test Case Passed: Result = %d, Expected = %d%n", 
                                result, expected);
            } else {
                System.out.printf("Failed Test Case: Result = %d, Expected = %d%n", 
                                result, expected);
            }
        }
    }

    public static void main(String[] args) {
        if (args.length != 2) {
            System.err.printf("Usage: java Solution5 <n> <expected>%n");
            System.exit(1);
        }

        int n = Integer.parseInt(args[0]);
        int expected = Integer.parseInt(args[1]);

        Checker.check(n, expected);
    }
} 