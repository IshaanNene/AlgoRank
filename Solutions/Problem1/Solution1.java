public class Solution1 {
    // User input
    public static int sum(int a, int b) {
        return a + b;
    }
    // End of user input

    static class Checker {
        public static void check(int a, int b, int expected) {
            int result = sum(a, b);
            if (result == expected) {
                System.out.printf("Test Case Passed: %d + %d = %d%n", a, b, expected);
            } else {
                System.out.printf("Failed Test Case: %d + %d != %d%n", a, b, expected);
            }
        }
    }

    public static void main(String[] args) {
        if (args.length != 3) {
            System.err.printf("Usage: java Solution1 <a> <b> <expected>%n");
            System.exit(1);
        }

        int a = Integer.parseInt(args[0]);
        int b = Integer.parseInt(args[1]);
        int expected = Integer.parseInt(args[2]);

        Checker.check(a, b, expected);
    }
} 