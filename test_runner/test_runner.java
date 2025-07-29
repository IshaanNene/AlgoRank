import java.nio.file.*;
import java.util.concurrent.*;
import java.util.stream.*;
import org.json.*;
import java.util.*;

public class TestRunner {
    private static final Solution solution = new Solution();
    
    private static boolean areEqual(Object actual, Object expected) {
        if (actual instanceof int[] && expected instanceof int[]) {
            Arrays.sort((int[])actual);
            Arrays.sort((int[])expected);
            return Arrays.equals((int[])actual, (int[])expected);
        }
        return Objects.equals(actual, expected);
    }

    private static CompletableFuture<Boolean> runTestAsync(JSONObject testCase, int index) {
        return CompletableFuture.supplyAsync(() -> {
            try {
                Object result = solution.getClass()
                    .getMethod(testCase.getString("function_name"))
                    .invoke(solution, testCase.get("input"));
                boolean passed = areEqual(result, testCase.get("output"));
                System.out.printf("Test %d: %s%n", index + 1, passed ? "✓" : "✗");
                return passed;
            } catch (Exception e) {
                System.out.printf("Test %d: ✗ (Error: %s)%n", index + 1, e.getMessage());
                return false;
            }
        });
    }

    public static void main(String[] args) throws Exception {
        String jsonText = new String(Files.readAllBytes(Paths.get("testcases.json")));
        JSONObject data = new JSONObject(jsonText);
        JSONArray cases = data.getJSONArray("test_cases_run");

        List<CompletableFuture<Boolean>> futures = IntStream.range(0, cases.length())
            .mapToObj(i -> runTestAsync(cases.getJSONObject(i), i))
            .collect(Collectors.toList());

        long passed = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
            .thenApply(v -> futures.stream()
                .map(CompletableFuture::join)
                .filter(Boolean::booleanValue)
                .count())
            .get();

        System.out.printf("%nSummary: %d/%d tests passed%n", passed, cases.length());
        System.exit(passed == cases.length() ? 0 : 1);
    }
}