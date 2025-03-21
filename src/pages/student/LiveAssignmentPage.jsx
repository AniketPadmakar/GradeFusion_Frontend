import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { useParams } from "react-router-dom";
import "./LiveAssignmentPage.css";

const LiveAssignmentPage = () => {
  const { assignmentId } = useParams();
  const editorRef = useRef(null);
  const [isFullScreen, setIsFullScreen] = useState(true); // Default to true to bypass warning
  const [activeTab, setActiveTab] = useState("testcase"); // 'testcase' or 'result'
  const [activeTestCase, setActiveTestCase] = useState(1);
  const [horizontalSplit, setHorizontalSplit] = useState(50); // Default 50% split between problem and editor
  const [verticalSplit, setVerticalSplit] = useState(70); // Default 70% editor, 30% testcase
  const containerRef = useRef(null);
  const [language, setLanguage] = useState("java");
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState({
    status: null,
    output: null,
    expectedOutput: null,
    message: null,
    passedTests: 0,
    totalTests: 0,
  });

  // Map language options to Judge0 language IDs
  const languageMap = {
    java: 62,
    python: 71,
    cpp: 54,
  };

  // Refs for resizing
  const isHorizontalResizing = useRef(false);
  const isVerticalResizing = useRef(false);
  const startHorizontalPos = useRef(0);
  const startVerticalPos = useRef(0);
  const startHorizontalSplit = useRef(horizontalSplit);
  const startVerticalSplit = useRef(verticalSplit);

  // Comment out fullscreen functionality
  /*
    useEffect(() => {
        const enterFullScreen = async () => {
            try {
                const elem = document.documentElement;
                
                if (elem.requestFullscreen) {
                    await elem.requestFullscreen();
                } else if (elem.mozRequestFullScreen) {
                    await elem.mozRequestFullScreen();
                } else if (elem.webkitRequestFullscreen) {
                    await elem.webkitRequestFullscreen();
                } else if (elem.msRequestFullscreen) {
                    await elem.msRequestFullscreen();
                }
            } catch (err) {
                console.error("Error attempting to enable fullscreen:", err);
            }
        };
        
        // Check and enforce fullscreen whenever visibility changes
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible' && !document.fullscreenElement) {
                enterFullScreen();
            }
        };
        
        // Monitor for fullscreen changes
        const handleFullscreenChange = () => {
            const isInFullScreen = !!document.fullscreenElement || 
                                   !!document.webkitFullscreenElement || 
                                   !!document.mozFullScreenElement || 
                                   !!document.msFullscreenElement;
            
            setIsFullScreen(isInFullScreen);
            
            // If exited fullscreen and document is visible, try to re-enter
            if (!isInFullScreen && document.visibilityState === 'visible') {
                enterFullScreen();
            }
        };
        
        // Initial fullscreen attempt
        enterFullScreen();
        
        // Set up event listeners
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Attempt to prevent keyboard shortcuts that exit fullscreen
        const handleKeyDown = (e) => {
            // Prevent F11, Esc, Alt+Tab combinations
            if (e.key === 'F11' || e.key === 'Escape' || 
                (e.altKey && e.key === 'Tab')) {
                e.preventDefault();
                return false;
            }
        };
        
        window.addEventListener('keydown', handleKeyDown, true);
        
        // Clean up
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('keydown', handleKeyDown, true);
        };
    }, []);

    // Attempt to reenter fullscreen periodically
    useEffect(() => {
        // If not in fullscreen, check every 2 seconds to try to reenter
        let intervalId;
        
        if (!isFullScreen) {
            intervalId = setInterval(() => {
                if (document.visibilityState === 'visible' && !document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(err => {
                        console.log("Couldn't automatically reenter fullscreen:", err);
                    });
                }
            }, 2000);
        }
        
        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isFullScreen]);
    */

  // Handle mouse events for resizing
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isHorizontalResizing.current) {
        const delta = e.clientX - startHorizontalPos.current;
        const containerWidth = document.querySelector(
          ".main-assignment-container"
        ).offsetWidth;
        const newSplit =
          startHorizontalSplit.current + (delta / containerWidth) * 100;

        // Limit resizing to reasonable bounds (10% to 90%)
        if (newSplit >= 10 && newSplit <= 90) {
          setHorizontalSplit(newSplit);
        }
      } else if (isVerticalResizing.current) {
        const delta = e.clientY - startVerticalPos.current;
        const editorSectionHeight =
          document.querySelector(".editor-section").offsetHeight;
        const newSplit =
          startVerticalSplit.current + (delta / editorSectionHeight) * 100;

        // Limit vertical resizing to reasonable bounds (20% to 90%)
        if (newSplit >= 20 && newSplit <= 90) {
          setVerticalSplit(newSplit);
        }
      }
    };

    const handleMouseUp = () => {
      isHorizontalResizing.current = false;
      isVerticalResizing.current = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startHorizontalResize = (e) => {
    isHorizontalResizing.current = true;
    startHorizontalPos.current = e.clientX;
    startHorizontalSplit.current = horizontalSplit;
    document.body.style.cursor = "ew-resize";
    document.body.style.userSelect = "none";
    e.preventDefault();
  };

  const startVerticalResize = (e) => {
    isVerticalResizing.current = true;
    startVerticalPos.current = e.clientY;
    startVerticalSplit.current = verticalSplit;
    document.body.style.cursor = "ns-resize";
    document.body.style.userSelect = "none";
    e.preventDefault();
  };

  const handleEnterFullScreen = async () => {
    // Commented out for now
    /*
        try {
            const elem = document.documentElement;
            
            if (elem.requestFullscreen) {
                await elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                await elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                await elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                await elem.msRequestFullscreen();
            }
        } catch (err) {
            console.error("Error attempting to enable fullscreen:", err);
        }
        */
    setIsFullScreen(true); // Just set to true for now
  };

  // Sample problem data (replace with actual API call)
  const problemData = {
    title: "k largest elements",
    marks: 4,
    description:
      "Given an array arr[] of positive integers and an integer k, Your task is to return k largest elements in decreasing order.",
    examples: [
      {
        input: "arr[] = [12, 5, 787, 1, 23], k = 2",
        output: "[787, 23]",
        explanation:
          "1st largest element in the array is 787 and second largest is 23.",
      },
      {
        input: "arr[] = [1, 23, 12, 9, 30, 2, 50], k = 3",
        output: "[50, 30, 23]",
        explanation: "Three Largest elements in the array are 50, 30 and 23.",
      },
    ],
  };

  // Sample test cases for palindrome checker
  const testCases = [
    {
      id: 1,
      nums: "racecar",
      target: "",
      expectedOutput: "true\n",
    },
    {
      id: 2,
      nums: "hello",
      target: "",
      expectedOutput: "false\n",
    },
    {
      id: 3,
      nums: "A man a plan a canal Panama",
      target: "",
      expectedOutput: "true\n",
    },
    {
      id: 4,
      nums: "level",
      target: "",
      expectedOutput: "true\n",
    },
    {
      id: 5,
      nums: "12321",
      target: "",
      expectedOutput: "true\n",
    },
    {
      id: 6,
      nums: "12345",
      target: "",
      expectedOutput: "false\n",
    },
  ];
  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
  };

  // Helper function to poll for results
  const pollForResults = async (tokens) => {
    const tokensParam = tokens.map((t) => t.token).join(",");
    const response = await fetch(
      `https://judge0-ce.p.rapidapi.com/submissions/batch?tokens=${tokensParam}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          "X-RapidAPI-Key":
            "87114658f6msh1cc13fef2b1a2dfp14a88djsn8810d5742a87",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch results");
    }

    const data = await response.json();

    // Check if all submissions are processed
    const allProcessed = data.submissions.every(
      (submission) => submission.status.id !== 1 && submission.status.id !== 2
    );

    if (allProcessed) {
      return data;
    }

    // If not all processed, wait and poll again
    await new Promise((resolve) => setTimeout(resolve, 1000));
    return pollForResults(tokens);
  };

  // Process the results and update the state
  // Change 1: Modify the processResults function to store all test case results
  const processResults = (data, testCases) => {
    const results = data.submissions;

    // Calculate how many tests passed
    let passedTests = 0;

    // Store all test case results
    const allResults = results.map((result, index) => {
      // Clean up the output (remove trailing newlines, etc.)
      const cleanOutput = result.stdout ? result.stdout.trim() : "";
      // Remove the trailing newline from expected output for comparison
      const expectedOutput = testCases[index].expectedOutput.trim();

      const isSuccess =
        result.status.id === 3 && cleanOutput === expectedOutput;
      if (isSuccess) {
        passedTests++;
      }

      return {
        id: testCases[index].id,
        status: result.status.description,
        output: cleanOutput,
        expectedOutput: expectedOutput,
        message: result.message || result.compile_output,
        isSuccess: isSuccess,
        input: testCases[index].nums,
      };
    });

    // Set the active test case result
    const activeResult = allResults.find((r) => r.id === activeTestCase);

    setTestResults({
      status: activeResult.status,
      output: activeResult.output,
      expectedOutput: activeResult.expectedOutput,
      message: activeResult.message,
      isSuccess: activeResult.isSuccess,
      passedTests,
      totalTests: testCases.length,
      allResults: allResults, // Store all results
    });

    setActiveTab("result");
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      console.log("Submitted code:", code);
      // You could implement additional logic for final submission
      // For now, we'll use the same run code functionality
      await handleRun();
    }
  };

  const handleRun = async () => {
    if (editorRef.current) {
      const code = editorRef.current.getValue();
      setIsLoading(true);

      try {
        // Prepare submissions for all test cases
        const submissions = testCases.map((testCase) => ({
          language_id: languageMap[language],
          source_code: code, // Send code as plain text instead of base64
          stdin: JSON.stringify(testCase.nums) + "\n" + testCase.target, // Plain text input with newlines
          expected_output: testCase.expectedOutput, // Plain text expected output
        }));

        // Send to Judge0 API
        const response = await fetch(
          "https://judge0-ce.p.rapidapi.com/submissions/batch",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              "X-RapidAPI-Key":
                "87114658f6msh1cc13fef2b1a2dfp14a88djsn8810d5742a87",
            },
            body: JSON.stringify({ submissions }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to submit code");
        }

        const data = await response.json();
        console.log("Submission response:", data);

        // Poll for results
        const results = await pollForResults(data);
        console.log("Results:", results);

        // Process and display results
        processResults(results, testCases);
      } catch (error) {
        console.error("Error running code:", error);
        setTestResults({
          status: "Error",
          output: null,
          expectedOutput: null,
          message: error.message,
          isSuccess: false,
          passedTests: 0,
          totalTests: testCases.length,
        });
        setActiveTab("result");
        setIsLoading(false);
      }
    }
  };

  const handleTestCaseChange = (caseId) => {
    setActiveTestCase(caseId);
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  // Track browser focus - commented out
  /*
    useEffect(() => {
        const handleFocus = () => {
            // Recheck fullscreen status whenever window regains focus
            if (!document.fullscreenElement) {
                handleEnterFullScreen();
            }
        };
        
        window.addEventListener('focus', handleFocus);
        
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, []);
    */

  // Handle browser navigation attempts - commented out
  /*
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            // Prevent navigation
            e.preventDefault();
            // Chrome requires returnValue to be set
            e.returnValue = '';
            return '';
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, []);
    */

  return (
    <div className="fullscreen-container" ref={containerRef}>
      {!isFullScreen && (
        <div className="fullscreen-warning">
          <div className="warning-message">
            <h2>Fullscreen Required</h2>
            <p>
              You must be in fullscreen mode to complete this assignment. Please
              enter fullscreen mode to continue.
            </p>
            <p className="warning-detail">
              This is required to maintain academic integrity during the
              assessment.
            </p>
            <button
              className="enter-fullscreen-btn"
              onClick={handleEnterFullScreen}
            >
              Enter Fullscreen
            </button>
          </div>
        </div>
      )}

      <div className="assignment-header">
        <div className="assignment-title">
          <h1>{problemData.title}</h1>
          <span className="marks-badge">Marks: {problemData.marks}</span>
        </div>
        <div className="header-controls">
          <div className="timer">
            Time Remaining: <span id="time">45:00</span>
          </div>
        </div>
      </div>

      <div className="main-assignment-container">
        <div
          className="problem-section"
          style={{ width: `${horizontalSplit}%` }}
        >
          <div className="problem-description">
            <h2>Problem Description</h2>
            <p>{problemData.description}</p>
          </div>

          <div className="examples">
            <h2>Examples</h2>
            {problemData.examples.map((example, index) => (
              <div key={index} className="example-box">
                <div className="example-input">
                  <strong>Input:</strong> {example.input}
                </div>
                <div className="example-output">
                  <strong>Output:</strong> {example.output}
                </div>
                <div className="example-explanation">
                  <strong>Explanation:</strong> {example.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div
          className="resizer horizontal-resizer"
          onMouseDown={startHorizontalResize}
          title="Drag to resize"
        ></div>

        <div
          className="editor-section"
          style={{ width: `${100 - horizontalSplit}%` }}
        >
          <div className="editor-header">
            <select
              className="language-selector"
              value={language}
              onChange={handleLanguageChange}
            >
              <option value="java">Java</option>
              <option value="python">Python</option>
              <option value="cpp">C++</option>
            </select>
            <button
              className={`run-btn ${isLoading ? "loading" : ""}`}
              onClick={handleRun}
              disabled={isLoading}
            >
              {isLoading ? "Running..." : "Run Code"}
            </button>
            <button
              className={`submit-btn ${isLoading ? "loading" : ""}`}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </div>
          <div
            className="editor-container"
            style={{ height: `${verticalSplit}%` }}
          >
            <Editor
              height="100%"
              defaultLanguage={language}
              defaultValue="// Write your code here"
              theme="vs-dark"
              onMount={handleEditorDidMount}
              language={language}
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                automaticLayout: true,
              }}
            />
          </div>

          <div
            className="resizer vertical-resizer"
            onMouseDown={startVerticalResize}
            title="Drag to resize"
          ></div>

          <div
            className="testcase-section"
            style={{ height: `${100 - verticalSplit}%` }}
          >
            <div className="testcase-tabs">
              <button
                className={`testcase-tab ${
                  activeTab === "testcase" ? "active" : ""
                }`}
                onClick={() => setActiveTab("testcase")}
              >
                Testcase
              </button>
              <button
                className={`testcase-tab ${
                  activeTab === "result" ? "active" : ""
                }`}
                onClick={() => setActiveTab("result")}
              >
                Test Result
              </button>
            </div>
            {activeTab === "testcase" && (
              <div className="testcase-content">
                <div className="testcase-selector">
                  {testCases.map((testCase) => (
                    <button
                      key={testCase.id}
                      className={`case-button ${
                        activeTestCase === testCase.id ? "active" : ""
                      }`}
                      onClick={() => handleTestCaseChange(testCase.id)}
                    >
                      Case {testCase.id}
                    </button>
                  ))}
                  <button className="add-case-button">+</button>
                </div>
                <div className="testcase-details">
                  {testCases.find((tc) => tc.id === activeTestCase) && (
                    <>
                      <div className="testcase-input">
                        <label>nums =</label>
                        <div className="input-field">
                          {JSON.stringify(
                            testCases.find((tc) => tc.id === activeTestCase)
                              .nums
                          )}
                        </div>
                      </div>
                      <div className="testcase-input">
                        <label>target =</label>
                        <div className="input-field">
                          {
                            testCases.find((tc) => tc.id === activeTestCase)
                              .target
                          }
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
            {/* Change 2: Update the result-content div to show all test case results */}
            {activeTab === "result" && (
              <div className="result-content">
                {isLoading ? (
                  <div className="loading-indicator">
                    <p>Running your code...</p>
                  </div>
                ) : testResults.status ? (
                  <>
                    <div className="test-summary">
                      <p
                        className={`result-status ${
                          testResults.isSuccess ? "success" : "error"
                        }`}
                      >
                        {testResults.status}
                      </p>
                      <p className="test-count">
                        Passed {testResults.passedTests} of{" "}
                        {testResults.totalTests} test cases
                      </p>
                    </div>

                    {/* Show active test case details */}
                    <div className="result-details">
                      <div className="result-header">
                        <h3>Test Case {activeTestCase} Details</h3>
                      </div>
                      <div className="result-row">
                        <span>Input:</span>
                        <span>
                          {testResults.allResults.find(
                            (r) => r.id === activeTestCase
                          )?.input || ""}
                        </span>
                      </div>
                      <div className="result-row">
                        <span>Your Output:</span>
                        <span>{testResults.output || "(empty)"}</span>
                      </div>
                      <div className="result-row">
                        <span>Expected:</span>
                        <span>{testResults.expectedOutput}</span>
                      </div>
                      {testResults.message && (
                        <div className="result-row error-message">
                          <span>Message:</span>
                          <span>{testResults.message}</span>
                        </div>
                      )}
                    </div>

                    {/* Add a new section for all test case results */}
                    <div className="all-results-section">
                      <h3>All Test Results</h3>
                      <div className="all-results-container">
                        {testResults.allResults &&
                          testResults.allResults.map((result) => (
                            <div
                              key={result.id}
                              className={`test-result-card ${
                                result.isSuccess ? "success" : "failure"
                              }`}
                              onClick={() => setActiveTestCase(result.id)}
                            >
                              <div className="test-card-header">
                                <span>Test Case {result.id}</span>
                                <span
                                  className={`status-indicator ${
                                    result.isSuccess ? "success" : "failure"
                                  }`}
                                >
                                  {result.isSuccess ? "PASS" : "FAIL"}
                                </span>
                              </div>
                              <div className="test-card-details">
                                <div className="test-card-row">
                                  <span>Input:</span>
                                  <span>{result.input}</span>
                                </div>
                                <div className="test-card-row">
                                  <span>Output:</span>
                                  <span>{result.output || "(empty)"}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <p>Run your code to see results</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveAssignmentPage;