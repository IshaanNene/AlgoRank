public class Solution4 {
    // User input
    public static String reverseString(String str) {
        return new StringBuilder(str).reverse().toString();
    }
    // End of user input

    static class Checker {
        public static void check(String input, String expected) {
            String result = reverseString(input);
            if (result.equals(expected)) {
                System.out.printf("Test Case Passed: Result = %s, Expected = %s%n", 
                                result, expected);
            } else {
                System.out.printf("Failed Test Case: Result = %s, Expected = %s%n", 
                                result, expected);
            }
        }
    }

    public static void main(String[] args) {
        if (args.length != 2) {
            System.err.printf("Usage: java Solution4 <string> <expected>%n");
            System.exit(1);
        }

        String input = args[0];
        String expected = args[1];

        Checker.check(input, expected);
    }
} 