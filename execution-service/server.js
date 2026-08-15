const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8081;
const SCRATCH_BASE_DIR = '/app/scratch';
const RUNNER_SRC_PATH = '/app/runner.py';

// Ensure scratch base dir exists
if (!fs.existsSync(SCRATCH_BASE_DIR)) {
  fs.mkdirSync(SCRATCH_BASE_DIR, { recursive: true });
}

app.post('/execute', (req, res) => {
  const { language, sourceCode, testCases } = req.body;

  if (!language || !sourceCode || !testCases) {
    return res.status(400).json({
      status: 'SYSTEM_ERROR',
      message: 'Missing required parameters: language, sourceCode, or testCases'
    });
  }

  const jobId = uuidv4();
  const containerJobDir = path.join(SCRATCH_BASE_DIR, jobId);
  
  // Ensure HOST_SCRATCH_DIR is configured for mounting sibling containers, defaulting to standard mapping
  const hostScratchDir = process.env.HOST_SCRATCH_DIR || SCRATCH_BASE_DIR;
  const hostJobDir = `${hostScratchDir}/${jobId}`;

  try {
    // 1. Create temporary directory inside the container
    fs.mkdirSync(containerJobDir, { recursive: true });

    // 2. Determine file name
    let fileName = '';
    const langLower = language.toLowerCase();
    if (langLower === 'java') fileName = 'Main.java';
    else if (langLower === 'python' || langLower === 'python3') fileName = 'solution.py';
    else if (langLower === 'cpp' || langLower === 'c++') fileName = 'solution.cpp';
    else if (langLower === 'c') fileName = 'solution.c';
    else {
      return res.status(400).json({ status: 'SYSTEM_ERROR', message: `Unsupported language: ${language}` });
    }

    // 3. Write student code and test cases JSON file
    fs.writeFileSync(path.join(containerJobDir, fileName), sourceCode, 'utf8');
    fs.writeFileSync(path.join(containerJobDir, 'testcases.json'), JSON.stringify(testCases), 'utf8');

    // 4. Copy the runner.py script into the job directory so the sandbox container can run it
    if (fs.existsSync(RUNNER_SRC_PATH)) {
      fs.copyFileSync(RUNNER_SRC_PATH, path.join(containerJobDir, 'runner.py'));
    } else {
      // Fallback if running locally outside docker image during test
      fs.copyFileSync(path.join(__dirname, 'runner.py'), path.join(containerJobDir, 'runner.py'));
    }

    // 5. Execute sibling Docker container via mapped docker socket
    // We limit: cpus=1.0, memory=256mb, pids-limit=100, read-only rootfs (writable only inside /sandbox mount), network=none
    const dockerCmd = `docker run --rm --network none --cpus 1.0 -m 256m --pids-limit 100 -v "${hostJobDir}:/sandbox" -w /sandbox lms-sandbox:latest python3 runner.py ${langLower}`;

    // Safety timeout of 30s for the entire batch execution process
    exec(dockerCmd, { timeout: 30000 }, (error, stdout, stderr) => {
      // Clean up the job directory asynchronously after execution
      fs.rm(containerJobDir, { recursive: true, force: true }, (rmErr) => {
        if (rmErr) console.error(`[ExecutionService] Failed to clean up ${containerJobDir}:`, rmErr);
      });

      if (error && !stdout) {
        console.error(`[ExecutionService] Docker command execution failed:`, stderr || error.message);
        return res.status(500).json({
          status: 'SYSTEM_ERROR',
          message: 'Failed to invoke sandbox container. Check if lms-sandbox:latest image is built.'
        });
      }

      // Parse JSON output from container's stdout
      try {
        const resultJson = JSON.parse(stdout.trim());
        return res.json(resultJson);
      } catch (parseErr) {
        console.error(`[ExecutionService] Failed to parse sandbox stdout:`, stdout, stderr);
        return res.status(500).json({
          status: 'SYSTEM_ERROR',
          message: 'Code runner returned unparseable output format.',
          details: stderr || stdout
        });
      }
    });

  } catch (err) {
    console.error(`[ExecutionService] System error:`, err);
    // Cleanup if folders were created
    if (fs.existsSync(containerJobDir)) {
      fs.rmSync(containerJobDir, { recursive: true, force: true });
    }
    return res.status(500).json({
      status: 'SYSTEM_ERROR',
      message: `Execution service internal crash: ${err.message}`
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`[ExecutionService] Listening on port ${PORT}...`);
});
