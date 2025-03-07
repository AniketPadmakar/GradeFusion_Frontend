import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import './LiveAssignmentPage.css';

const LiveAssignmentPage = () => {
    const { assignmentId } = useParams();
    const editorRef = useRef(null);
    const [isFullScreen, setIsFullScreen] = useState(true);

    // Request full screen on component mount
    useEffect(() => {
        const enterFullScreen = async () => {
            try {
                if (document.documentElement.requestFullscreen) {
                    await document.documentElement.requestFullscreen();
                } else if (document.documentElement.mozRequestFullScreen) {
                    await document.documentElement.mozRequestFullScreen();
                } else if (document.documentElement.webkitRequestFullscreen) {
                    await document.documentElement.webkitRequestFullscreen();
                } else if (document.documentElement.msRequestFullscreen) {
                    await document.documentElement.msRequestFullscreen();
                }
                setIsFullScreen(true);
            } catch (err) {
                console.error("Error attempting to enable fullscreen:", err);
            }
        };
        
        enterFullScreen();
        
        // Monitor for fullscreen changes
        const handleFullscreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
        document.addEventListener('mozfullscreenchange', handleFullscreenChange);
        document.addEventListener('MSFullscreenChange', handleFullscreenChange);
        
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
            document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
            document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
        };
    }, []);

    // Sample problem data (replace with actual API call)
    const problemData = {
        title: "k largest elements",
        marks: 4,
        description: "Given an array arr[] of positive integers and an integer k, Your task is to return k largest elements in decreasing order.",
        examples: [
            {
                input: "arr[] = [12, 5, 787, 1, 23], k = 2",
                output: "[787, 23]",
                explanation: "1st largest element in the array is 787 and second largest is 23."
            },
            {
                input: "arr[] = [1, 23, 12, 9, 30, 2, 50], k = 3",
                output: "[50, 30, 23]",
                explanation: "Three Largest elements in the array are 50, 30 and 23."
            }
        ]
    };

    const handleEditorDidMount = (editor, monaco) => {
        editorRef.current = editor;
    };

    const handleSubmit = () => {
        if (editorRef.current) {
            const code = editorRef.current.getValue();
            console.log("Submitted code:", code);
            // Add your submission logic here
        }
    };

    const handleRun = () => {
        if (editorRef.current) {
            const code = editorRef.current.getValue();
            console.log("Running code:", code);
            // Add your run logic here
        }
    };

    return (
        <div className="fullscreen-container">
            {!isFullScreen && (
                <div className="fullscreen-warning">
                    <div className="warning-message">
                        <h2>Fullscreen Required</h2>
                        <p>You must be in fullscreen mode to complete this assignment.</p>
                        <button 
                            className="enter-fullscreen-btn"
                            onClick={() => document.documentElement.requestFullscreen()}
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
                    <div className="timer">Time Remaining: <span id="time">45:00</span></div>
                </div>
            </div>

            <div className="main-assignment-container">
                <div className="problem-section">
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

                <div className="editor-section">
                    <div className="editor-header">
                        <select className="language-selector">
                            <option value="java">Java</option>
                            <option value="python">Python</option>
                            <option value="cpp">C++</option>
                        </select>
                        <button className="run-btn" onClick={handleRun}>Run Code</button>
                        <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                    </div>
                    <div className="editor-container">
                        <Editor
                            height="100%"
                            defaultLanguage="java"
                            defaultValue="// Write your code here"
                            theme="vs-dark"
                            onMount={handleEditorDidMount}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                                lineNumbers: "on",
                                automaticLayout: true,
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveAssignmentPage;