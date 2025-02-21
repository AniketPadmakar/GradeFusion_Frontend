import React, { useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';
import { useParams } from 'react-router-dom';
import './LiveAssignmentPage.css';

const LiveAssignmentPage = () => {
    const { assignmentId } = useParams();
    const editorRef = useRef(null);

    // Sample problem data (replace with actual API call)
    const problemData = {
        title: "k largest elements",
        difficulty: "Medium",
        accuracy: "53.56%",
        submissions: "182K+",
        points: 4,
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
        ],
        constraints: [
            "1 ≤ k ≤ arr.length ≤ 105",
            "1 ≤ arr[i] ≤ 106"
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

    return (
        <div className="live-assignment-container">
            <div className="problem-section">
                <div className="problem-header">
                    <h1>{problemData.title}</h1>
                    <div className="problem-stats">
                        <span className="difficulty">Difficulty: {problemData.difficulty}</span>
                        <span className="accuracy">Accuracy: {problemData.accuracy}</span>
                        <span className="submissions">Submissions: {problemData.submissions}</span>
                        <span className="points">Points: {problemData.points}</span>
                    </div>
                </div>

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

                <div className="constraints">
                    <h2>Constraints</h2>
                    <ul>
                        {problemData.constraints.map((constraint, index) => (
                            <li key={index}>{constraint}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="editor-section">
                <div className="editor-header">
                    <select className="language-selector">
                        <option value="java">Java</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                    </select>
                    <button className="run-btn">Run Code</button>
                    <button className="submit-btn" onClick={handleSubmit}>Submit</button>
                </div>
                <Editor
                    height="calc(100vh - 60px)"
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
    );
};

export default LiveAssignmentPage;