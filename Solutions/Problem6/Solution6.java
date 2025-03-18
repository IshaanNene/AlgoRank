public class Solution6 {
    // User input
    public static boolean isPalindrome(String str) {
        int left = 0;
        int right = str.length() - 1;
        
        while (left < right) {
            while (left < right && !Character.isLetterOrDigit(str.charAt(left))) left++;
            while (left < right && !Character.isLetterOrDigit(str.charAt(right))) right--;
            
            if (Character.toLowerCase(str.charAt(left)) != 
                Character.toLowerCase(str.charAt(right))) {
                return false;
            }
            left++;
            right--;
        }
        return true;
    }
    // End of user input

    static class Checker {
        public static void check(String input, boolean expected) {
            boolean result = isPalindrome(input);
            if (result == expected) {
                System.out.printf("Test Case Passed: Result = %b, Expected = %b%n", 
                                result, expected);
            } else {
                System.out.printf("Failed Test Case: Result = %b, Expected = %b%n", 
                                result, expected);
            }
        }
    }

    public static void main(String[] args) {
        if (args.length != 2) {
            System.err.printf("Usage: java Solution6 <string> <expected>%n");
            System.exit(1);
        }

        String input = args[0];
        boolean expected = Boolean.parseBoolean(args[1]);

        Checker.check(input, expected);
    }
} 