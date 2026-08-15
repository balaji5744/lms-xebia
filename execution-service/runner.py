import sys
import os
import json
import subprocess
import time

# Attempt to import resource for memory tracking (only works on Unix/Linux)
try:
    import resource
except ImportError:
    resource = None

def normalize_output(text):
    if not text:
        return ""
    lines = [line.rstrip() for line in text.splitlines()]
    while lines and not lines[-1]:
        lines.pop()
    return "\n".join(lines)

def get_memory_usage():
    if resource:
        # ru_maxrss is in kilobytes on Linux
        return round(resource.getrusage(resource.RUSAGE_CHILDREN).ru_maxrss / 1024.0, 2)
    return 0.0

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"status": "SYSTEM_ERROR", "message": "Language argument missing"}))
        return

    lang = sys.argv[1].lower()
    
    # Read test cases from testcases.json
    try:
        with open("testcases.json", "r") as f:
            test_cases = json.load(f)
    except Exception as e:
        print(json.dumps({"status": "SYSTEM_ERROR", "message": f"Failed to load test cases: {str(e)}"}))
        return

    # Set file names and compilation flags
    source_file = ""
    compile_cmd = []
    run_cmd = []
    
    if lang == "java":
        source_file = "Main.java"
        compile_cmd = ["javac", "Main.java"]
        run_cmd = ["java", "Main"]
    elif lang == "python" or lang == "python3":
        source_file = "solution.py"
        run_cmd = ["python3", "solution.py"]
    elif lang == "cpp" or lang == "c++":
        source_file = "solution.cpp"
        compile_cmd = ["g++", "-O3", "solution.cpp", "-o", "solution"]
        run_cmd = ["./solution"]
    elif lang == "c":
        source_file = "solution.c"
        compile_cmd = ["gcc", "-O3", "solution.c", "-o", "solution"]
        run_cmd = ["./solution"]
    else:
        print(json.dumps({"status": "SYSTEM_ERROR", "message": f"Unsupported language: {lang}"}))
        return

    # Check if source file exists
    if not os.path.exists(source_file):
        print(json.dumps({"status": "SYSTEM_ERROR", "message": f"Source file {source_file} not found"}))
        return

    # Compile if required
    if compile_cmd:
        try:
            compile_proc = subprocess.run(
                compile_cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=10 # Compilation timeout of 10s
            )
            if compile_proc.returncode != 0:
                print(json.dumps({
                    "status": "COMPILATION_ERROR",
                    "compileError": compile_proc.stderr or compile_proc.stdout
                }))
                return
        except subprocess.TimeoutExpired:
            print(json.dumps({
                "status": "COMPILATION_ERROR",
                "compileError": "Compilation timed out (limit: 10s)"
            }))
            return
        except Exception as e:
            print(json.dumps({
                "status": "SYSTEM_ERROR",
                "message": f"Compilation crashed: {str(e)}"
            }))
            return

    # Run against test cases
    results = []
    for tc in test_cases:
        tc_id = tc.get("id")
        input_data = tc.get("input", "")
        expected_output = tc.get("expectedOutput", "")
        timeout = float(tc.get("timeout", 2000)) / 1000.0 # Convert ms to s
        
        # Start execution timer
        start_time = time.perf_counter()
        
        try:
            proc = subprocess.run(
                run_cmd,
                input=input_data,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                timeout=timeout
            )
            
            # End execution timer
            elapsed = int((time.perf_counter() - start_time) * 1000) # in ms
            memory_used = get_memory_usage()
            
            if proc.returncode != 0:
                results.append({
                    "id": tc_id,
                    "status": "Runtime Error",
                    "actualOutput": proc.stderr or f"Exit Code: {proc.returncode}",
                    "exitCode": proc.returncode,
                    "executionTime": elapsed,
                    "memoryUsed": memory_used
                })
            else:
                norm_actual = normalize_output(proc.stdout)
                norm_expected = normalize_output(expected_output)
                
                status = "Accepted" if norm_actual == norm_expected else "Wrong Answer"
                results.append({
                    "id": tc_id,
                    "status": status,
                    "actualOutput": proc.stdout,
                    "exitCode": 0,
                    "executionTime": elapsed,
                    "memoryUsed": memory_used
                })
                
        except subprocess.TimeoutExpired:
            elapsed = int((time.perf_counter() - start_time) * 1000)
            results.append({
                "id": tc_id,
                "status": "Time Limit Exceeded",
                "actualOutput": "Execution timed out.",
                "exitCode": -1,
                "executionTime": int(timeout * 1000),
                "memoryUsed": 0.0
            })
        except Exception as e:
            results.append({
                "id": tc_id,
                "status": "Runtime Error",
                "actualOutput": f"System execution crash: {str(e)}",
                "exitCode": -1,
                "executionTime": 0,
                "memoryUsed": 0.0
            })

    print(json.dumps({
        "status": "SUCCESS",
        "results": results
    }))

if __name__ == "__main__":
    main()
