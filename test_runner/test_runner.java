import java.io.*;
import java.util.*;
import org.json.*;

public class TestRunner {
    public static void main(String[] args) throws Exception {
        String jsonText = new String(java.nio.file.Files.readAllBytes(
                java.nio.file.Paths.get("testcases.json")));

        JSONObject obj = new JSONObject(jsonText);
        JSONArray cases = obj.getJSONArray("run");

        int passed = 0;

        for (int i = 0; i < cases.length(); i++) {
            JSONObject test = cases.getJSONObject(i);
            JSONObject input = test.getJSONObject("input");

            JSONArray numsJSON = input.getJSONArray("nums");
            int[] nums = new int[numsJSON.length()];
            for (int j = 0; j < nums.length; j++) nums[j] = numsJSON.getInt(j);

            int target = input.getInt("target");

            JSONArray expectedJSON = test.getJSONArray("output");
            int[] expected = new int[expectedJSON.length()];
            for (int j = 0; j < expected.length; j++) expected[j] = expectedJSON.getInt(j);

            Solution sol = new Solution();
            int[] result = sol.twoSum(nums, target);

            if (Arrays.equals(result, expected)) {
                System.out.println("✅ Test " + (i + 1) + " passed");
                passed++;
            } else {
                System.out.println("❌ Test " + (i + 1) + " failed");
                System.out.println("   Expected: " + Arrays.toString(expected));
                System.out.println("   Got     : " + Arrays.toString(result));
            }
        }

        System.out.println("\nSummary: " + passed + "/" + cases.length() + " tests passed.");
    }
}

