public class Solution8 {
    // User input
    public static void bubbleSort(int[] arr) {
        int n = arr.length;
        for (int i = 0; i < n - 1; i++) {
            for (int j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    // Swap arr[j] and arr[j+1]
                    int temp = arr[j];
                    arr[j] = arr[j + 1];
                    arr[j + 1] = temp;
                }
            }
        }
    }
    // End of user input

    static class Checker {
        public static void check(int[] arr, int[] expected) {
            bubbleSort(arr);
            boolean passed = true;
            if (arr.length != expected.length) {
                passed = false;
            } else {
                for (int i = 0; i < arr.length; i++) {
                    if (arr[i] != expected[i]) {
                        passed = false;
                        break;
                    }
                }
            }
            
            if (passed) {
                System.out.printf("Test Case Passed: Result = %s, Expected = %s%n", 
                                arrayToString(arr), arrayToString(expected));
            } else {
                System.out.printf("Failed Test Case: Result = %s, Expected = %s%n", 
                                arrayToString(arr), arrayToString(expected));
            }
        }
        
        private static String arrayToString(int[] arr) {
            StringBuilder sb = new StringBuilder("[");
            for (int i = 0; i < arr.length; i++) {
                sb.append(arr[i]);
                if (i < arr.length - 1) sb.append(",");
            }
            sb.append("]");
            return sb.toString();
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
            System.err.printf("Usage: java Solution8 <array> <expected>%n");
            System.exit(1);
        }

        int[] arr = parseArray(args[0]);
        int[] expected = parseArray(args[1]);

        Checker.check(arr, expected);
    }
} 