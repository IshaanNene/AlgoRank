import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class Solution9 {
    // User input
    public static List<List<Integer>> generatePascal(int numRows) {
        List<List<Integer>> triangle = new ArrayList<>();
        if (numRows <= 0) return triangle;
        
        triangle.add(Arrays.asList(1)); // First row
        
        for (int i = 1; i < numRows; i++) {
            List<Integer> row = new ArrayList<>();
            row.add(1); // First element
            
            List<Integer> prevRow = triangle.get(i-1);
            for (int j = 1; j < i; j++) {
                row.add(prevRow.get(j-1) + prevRow.get(j));
            }
            
            row.add(1); // Last element
            triangle.add(row);
        }
        return triangle;
    }
    // End of user input

    static class Checker {
        public static void check(int numRows, String expected) {
            List<List<Integer>> result = generatePascal(numRows);
            List<List<Integer>> expectedTriangle = parseTriangle(expected);
            boolean passed = result.equals(expectedTriangle);
            
            System.out.println(passed ? "Test Case Passed:" : "Failed Test Case:");
            System.out.println("Result = " + result);
            System.out.println("Expected = " + expectedTriangle);
        }
        
        private static List<List<Integer>> parseTriangle(String str) {
            List<List<Integer>> triangle = new ArrayList<>();
            str = str.substring(1, str.length() - 1); // Remove outer []
            
            if (str.isEmpty()) return triangle;
            
            String[] rows = str.split("\\],\\[");
            for (String row : rows) {
                row = row.replaceAll("\\[|\\]", "");
                if (row.isEmpty()) continue;
                
                List<Integer> nums = new ArrayList<>();
                for (String num : row.split(",")) {
                    nums.add(Integer.parseInt(num.trim()));
                }
                triangle.add(nums);
            }
            return triangle;
        }
    }

    public static void main(String[] args) {
        if (args.length != 2) {
            System.err.printf("Usage: java Solution9 <numRows> <expected>%n");
            System.exit(1);
        }

        int numRows = Integer.parseInt(args[0]);
        String expected = args[1];

        Checker.check(numRows, expected);
    }
} 