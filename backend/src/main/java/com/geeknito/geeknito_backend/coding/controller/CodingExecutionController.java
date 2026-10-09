package com.geeknito.geeknito_backend.coding.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

/**
 * Small Judge0-compatible execution gateway. Student code is sent to Judge0,
 * never executed inside the LMS JVM.
 */
@RestController
@RequestMapping("/coding")
@CrossOrigin(origins = "*")
public class CodingExecutionController {
    private final RestTemplate restTemplate = new RestTemplate();
    private final String judge0ApiUrl;

    public CodingExecutionController(@Value("${JUDGE0_API_URL:${judge0.api-url:http://localhost:2358}}") String judge0ApiUrl) {
        this.judge0ApiUrl = judge0ApiUrl.replaceAll("/+$", "");
    }

    @PostMapping("/run")
    public ResponseEntity<?> runCode(@RequestBody Map<String, Object> request) {
        String sourceCode = asString(request.get("code"));
        String language = asString(request.get("language")).toLowerCase(Locale.ROOT);
        Object rawTests = request.get("testCases");

        if (sourceCode.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Write some code before running it."));
        }
        if (sourceCode.length() > 20000) {
            return ResponseEntity.badRequest().body(Map.of("message", "Code is too long (maximum 20,000 characters)."));
        }
        if (!(rawTests instanceof List<?> testCases) || testCases.isEmpty() || testCases.size() > 10) {
            return ResponseEntity.badRequest().body(Map.of("message", "Provide between 1 and 10 test cases."));
        }

        Integer languageId = languageId(language);
        if (languageId == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Unsupported language. Choose Python, Java, C++, C, or JavaScript."));
        }

        List<Map<String, Object>> results = new ArrayList<>();
        int passed = 0;
        try {
            for (int index = 0; index < testCases.size(); index++) {
                Object rawCase = testCases.get(index);
                if (!(rawCase instanceof Map<?, ?> testCase)) continue;
                String input = asString(testCase.get("input"));
                String expected = asString(testCase.get("expectedOutput"));
                if (input.length() > 5000 || expected.length() > 5000) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Each test case input/output must be at most 5,000 characters."));
                }

                Map<String, Object> judgeRequest = new HashMap<>();
                judgeRequest.put("source_code", sourceCode);
                judgeRequest.put("language_id", languageId);
                judgeRequest.put("stdin", input);
                Map<?, ?> judgeResponse = restTemplate.postForObject(
                    judge0ApiUrl + "/submissions?base64_encoded=false&wait=true",
                    judgeRequest,
                    Map.class
                );
                if (judgeResponse == null) throw new IllegalStateException("The code execution service returned an empty response.");

                Map<?, ?> status = judgeResponse.get("status") instanceof Map<?, ?> s ? s : Collections.emptyMap();
                String statusText = asString(status.get("description"));
                String stdout = asString(judgeResponse.get("stdout"));
                String stderr = firstNonBlank(judgeResponse.get("stderr"), judgeResponse.get("compile_output"), judgeResponse.get("message"));
                boolean passedCase = "Accepted".equalsIgnoreCase(statusText) && normalize(stdout).equals(normalize(expected));
                if (passedCase) passed++;

                Map<String, Object> result = new LinkedHashMap<>();
                result.put("testCase", index + 1);
                result.put("passed", passedCase);
                result.put("status", statusText.isBlank() ? "Execution failed" : statusText);
                result.put("output", stdout);
                result.put("expectedOutput", expected);
                result.put("error", stderr);
                results.add(result);
                // A compilation error affects every test, so don't submit the same invalid source repeatedly.
                if ("Compilation Error".equalsIgnoreCase(statusText)) break;
            }
        } catch (RestClientException | IllegalStateException ex) {
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY).body(Map.of(
                "message", "Could not reach Judge0. Start/configure the Judge0 service and check JUDGE0_API_URL.",
                "detail", Optional.ofNullable(ex.getMessage()).orElse("Unknown execution service error")
            ));
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("passed", passed);
        response.put("total", results.size());
        response.put("allPassed", !results.isEmpty() && passed == results.size());
        response.put("results", results);
        return ResponseEntity.ok(response);
    }

    private static Integer languageId(String language) {
        return switch (language) {
            case "python", "python3" -> 71;       // Python 3.8.1
            case "java" -> 62;                   // Java  openjdk
            case "cpp", "c++" -> 54;             // C++ 17
            case "c" -> 50;                      // C (GCC)
            case "javascript", "js" -> 63;      // Node.js
            default -> null;
        };
    }

    private static String asString(Object value) {
        return value == null ? "" : String.valueOf(value);
    }

    private static String firstNonBlank(Object... values) {
        for (Object value : values) {
            String text = asString(value);
            if (!text.isBlank()) return text;
        }
        return "";
    }

    private static String normalize(String value) {
        return value == null ? "" : value.trim().replaceAll("\\s+", " ");
    }
}
