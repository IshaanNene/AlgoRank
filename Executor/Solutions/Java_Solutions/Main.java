public class Main {
    // User input
    public static int findMax(int a, int b) {
        return (a > b) ? a : b;
    }
    // End of user input

    static class Checker {
        public static void check(int a, int b, int expected) {
            int result = findMax(a, b);
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
        if (args.length != 3) {
            System.err.printf("Usage: java Main <a> <b> <expected>%n");
            System.exit(1);
        }

        int a = Integer.parseInt(args[0]);
        int b = Integer.parseInt(args[1]);
        int expected = Integer.parseInt(args[2]);

        Checker.check(a, b, expected);
    }
} 