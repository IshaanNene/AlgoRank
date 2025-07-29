import java.nio.file.*;
import java.util.concurrent.*;
import java.util.stream.*;
import org.json.*;
import java.util.*;
import java.lang.reflect.*;

public class TestRunner {
    private static final Solution solution = new Solution();
    
    private static class TestResult {
        final boolean passed;
        final String error;
        final double timeMs;
        
        TestResult(boolean passed, String error, double timeMs) {
            this.passed = passed;
            this.error = error;
            this.timeMs = timeMs;
        }
    }
    
    private static boolean areEqual(Object actual, Object expected) {
        if (actual == null || expected == null) {
            return actual == expected;
        }
        
        if (actual instanceof int[]) {
            int[] a = (int[]) actual;
            int[] b = (int[]) expected;
            if (a.length != b.length) return false;
            a = Arrays.copyOf(a, a.length);
            b = Arrays.copyOf(b, b.length);
            Arrays.sort(a);
            Arrays.sort(b);
            return Arrays.equals(a, b);
        }
        
        if (actual instanceof List) {
            List<?> actualList = (List<?>) actual;
            List<?> expectedList = (List<?>) expected;
            if (actualList.size() != expectedList.size()) return false;
            
            // Sort if the lists contain comparable elements
            if (!actualList.isEmpty() && actualList.get(0) instanceof Comparable) {
                actualList = new ArrayList<>(actualList);
                expectedList = new ArrayList<>(expectedList);
                Collections.sort((List<Comparable>) actualList);
                Collections.sort((List<Comparable>) expectedList);
            }
            return actualList.equals(expectedList);
        }
        
        return actual.equals(expected);
    }

    private static CompletableFuture<TestResult> runTestAsync(JSONObject testCase, String functionName, int index) {
        return CompletableFuture.supplyAsync(() -> {
            long startTime = System.nanoTime();
            try {
                Method method = null;
                Object[] args = null;
                
                // Get input parameters
                Object input = testCase.get("input");
                if (input instanceof JSONObject) {
                    JSONObject inputObj = (JSONObject) input;
                    args = new Object[inputObj.length()];
                    Class<?>[] paramTypes = new Class<?>[inputObj.length()];
                    
                    int i = 0;
                    for (String key : inputObj.keySet()) {
                        args[i] = inputObj.get(key);
                        paramTypes[i] = args[i].getClass();
                        i++;
                    }
                    method = Solution.class.getMethod(functionName, paramTypes);
                } else {
                    args = new Object[]{input};
                    method = Solution.class.getMethod(functionName, input.getClass());
                }
                
                Object result = method.invoke(solution, args);
                boolean passed = areEqual(result, testCase.get("output"));
                double timeMs = (System.nanoTime() - startTime) / 1_000_000.0;
                
                System.out.printf("Test %2d: %s (%.2fms)%n", 
                    index + 1, 
                    passed ? "\u001B[32m✓\u001B[0m" : "\u001B[31m✗\u001B[0m",
                    timeMs);
                    
                return new TestResult(passed, null, timeMs);
                
            } catch (Exception e) {
                double timeMs = (System.nanoTime() - startTime) / 1_000_000.0;
                String error = e.getCause() != null ? e.getCause().getMessage() : e.getMessage();
                
                System.out.printf("Test %2d: \u001B[31m✗\u001B[0m (Error: %s) (%.2fms)%n", 
                    index + 1, error, timeMs);
                    
                return new TestResult(false, error, timeMs);
            }
        });
    }

    public static void main(String[] args) throws Exception {
        // Read test cases
        String jsonText = new String(Files.readAllBytes(Paths.get("testcases.json")));
        JSONObject data = new JSONObject(jsonText);
        JSONArray cases = data.getJSONArray("test_cases_run");
        String functionName = data.getString("function_name");
        
        System.out.printf("%nRunning tests for function: \u001B[36m%s\u001B[0m%n", functionName);
        System.out.printf("Number of test cases: %d%n%n", cases.length());

        long startTime = System.nanoTime();
        
        List<CompletableFuture<TestResult>> futures = IntStream.range(0, cases.length())
            .mapToObj(i -> runTestAsync(cases.getJSONObject(i), functionName, i))
            .collect(Collectors.toList());

        // Wait for all tests and collect results
        List<TestResult> results = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
            .thenApply(v -> futures.stream()
                .map(CompletableFuture::join)
                .collect(Collectors.toList()))
            .get();
        
        long passed = results.stream().filter(r -> r.passed).count();
        double totalTimeMs = results.stream().mapToDouble(r -> r.timeMs).sum();
        double totalElapsed = (System.nanoTime() - startTime) / 1_000_000.0;
        
        // Print summary
        System.out.println("\nSummary:");
        System.out.println("--------");
        System.out.printf("Passed: %s%d/%d (%.1f%%)%s%n",
            passed == cases.length() ? "\u001B[32m" : "\u001B[31m",
            passed, cases.length(),
            (passed * 100.0 / cases.length()),
            "\u001B[0m");
        System.out.printf("Total time: %.2fms%n", totalElapsed);
        System.out.printf("Average time per test: %.2fms%n", totalTimeMs / cases.length());
        
        System.exit(passed == cases.length() ? 0 : 1);
    }
}