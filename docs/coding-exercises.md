# Coding Exercises (free/open-source setup)

The Assignments attempt page now has a real code-runner flow instead of simulated success messages. The browser sends the student's code and visible test cases to `POST /api/v1/coding/run`; Spring Boot forwards each case to a Judge0-compatible execution service. Student code is not executed inside the LMS JVM.

## Free resources

- Judge0 Community Edition: https://github.com/judge0/judge0 (open source; self-host to avoid per-run API fees)
- React and TypeScript: already used by this project
- Existing Spring Boot API and PostgreSQL: reused; no paid API is required

## Local setup

1. Start the existing LMS database and backend as usual.
2. Start a self-hosted Judge0 Community Edition instance by following the official Judge0 repository's Docker Compose instructions: https://github.com/judge0/judge0. Enable `ENABLE_WAIT_RESULT=true` in the Judge0 server configuration because this first implementation uses Judge0's synchronous `wait=true` option.
3. Set `JUDGE0_API_URL` for the Spring Boot process to the Judge0 server URL. Use `http://localhost:2358` when the backend runs directly on your host and Judge0 exposes port 2358. If the backend runs inside Docker, use the Judge0 service name on the shared Docker network instead of `localhost`.
4. Restart the backend and set `VITE_USE_MOCK_API=false` in the frontend environment so assignment data uses the backend API.
5. Open a coding assignment, choose Python, Java, C, C++, or JavaScript, and select **Run Code**.

Judge0 Community Edition's exact setup requirements depend on the version you deploy. Follow its official configuration rather than exposing its worker or database ports publicly.

## Current scope and production notes

- The runner supports Python 3, Java, C, C++, and JavaScript (Node.js) through Judge0 language IDs.
- It accepts at most 10 test cases per run, code up to 20,000 characters, and input/expected output up to 5,000 characters per case.
- The teacher form can configure sample inputs and expected outputs. These are currently sent to the client for practice. Do not treat client-visible test cases as secret or use this initial runner alone for high-stakes grading.
- For secure HackerRank-style grading, store hidden test cases in the database and evaluate them server-side by question ID. The current legacy question API does not define a dedicated coding-test-case persistence model, so that is a separate schema/API migration before using hidden tests for marks.
- Judge0 is open source, but the server still needs CPU, memory, and disk resources. Running it locally is usually the no-hosting-cost development option; public deployment may have infrastructure costs.
