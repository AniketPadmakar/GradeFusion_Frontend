import React, { useState } from 'react';
import './CreateQuestion.css';
import { getToken } from "../../data/Token";
import hostURL from "../../data/URL";

const CreateQuestion = () => {
    
    const [formData, setFormData] = useState({
        question_text: '',
        example_input: '',
        example_output: '',
        marks: '',
        subject: '',
        test_cases: Array(5).fill({ input: '', output: '' }) // Default 5 test cases
    });

    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const API_URL = import.meta.env.VITE_GEMINI_API_URL;

    const fetchGeneratedTestCases = async () => {
        if (!formData.question_text || !formData.example_input || !formData.example_output) {
            setMessage("Please fill in the Question Text, Example Input, and Example Output before generating test cases.");
            return;
        }
    
        setLoading(true); // Show loading overlay
    
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{ 
                            text: `Go through the question text, understand it along with the example input and output, and generate 5 test cases in the format:
                            {
                                "test_cases": [
                                    { "input": "testcase1 input", "output": "testcase1 output" },
                                    { "input": "testcase2 input", "output": "testcase2 output" },
                                    { "input": "testcase3 input", "output": "testcase3 output" },
                                    { "input": "testcase4 input", "output": "testcase4 output" },
                                    { "input": "testcase5 input", "output": "testcase5 output" }
                                ]
                            }
    
                            The test cases should match the pattern observed in the example input and output. 
    
                            Question: ${formData.question_text}
                            Example Input: ${formData.example_input}
                            Example Output: ${formData.example_output}`
                        }]
                    }]
                })
            });
    
            const data = await response.json();
            
            if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                try {
                    // Extract JSON from API response
                    const jsonResponse = JSON.parse(data.candidates[0].content.parts[0].text.replace(/```json|```/g, "").trim());
    
                    // Check if response contains valid test cases
                    if (jsonResponse.test_cases && Array.isArray(jsonResponse.test_cases)) {
                        setFormData(prev => ({
                            ...prev,
                            test_cases: jsonResponse.test_cases
                        }));
                    } else {
                        setMessage("Invalid test case format received from API.");
                    }
                } catch (parseError) {
                    setMessage("Error parsing test cases from API response.");
                }
            } else {
                setMessage("No test cases received from API.");
            }
        } catch (error) {
            setMessage("Error fetching generated test cases.");
            console.error("Error:", error);
        } finally {
            setLoading(false); // Hide loading overlay
        }
    };


    // Remove test case
    const removeTestCase = (index) => {
        setFormData(prev => ({
            ...prev,
            test_cases: prev.test_cases.filter((_, i) => i !== index)
        }));
    };

    // Update test case values
    const handleTestCaseChange = (index, field, value) => {
        const updatedTestCases = formData.test_cases.map((testcase, i) =>
            i === index ? { ...testcase, [field]: value } : testcase
        );

        setFormData(prev => ({
            ...prev,
            test_cases: updatedTestCases
        }));
    };

    // Handle form submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        const payload = {
            question_text: formData.question_text,
            example_input_output: {
                input: formData.example_input,
                output: formData.example_output
            },
            marks: formData.marks,
            subject: formData.subject,
            test_cases: formData.test_cases.map(tc => ({
                input: tc.input,
                expected_output: tc.output  // Rename key
            }))
        };
        const token = getToken("token");
        if (!token) {
            setMessage('Authentication required.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${hostURL.link}/app/teacher/create-question`, {  // Fixed template literal
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });
            const data = await response.json();
            if (response.ok) {
                setMessage('Question created successfully!');
                setFormData({
                    question_text: '',
                    example_input: '',
                    example_output: '',
                    marks: '',
                    subject: '',
                    test_cases: [{ input: '', output: '' }]
                });
            } else {
                setMessage(data.message || 'Failed to create question.');
            }
        } catch (error) {
            setMessage('Error creating question.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        {loading && (
            <div className="loading-overlay">
                <div className="loading-spinner"></div>
                <p>Generating test cases, please wait...</p>
            </div>
        )}        
        <div className="create-question-container">
            <div className="form-header">
                <h1>Create New Question</h1>
                <p>Design your coding challenge</p>
            </div>

            {message && <p className="message">{message}</p>}

            <form onSubmit={handleSubmit} className="question-form">
                <div className="form-section">
                    <label htmlFor="question_text">Question Text</label>
                    <textarea
                        id="question_text"
                        value={formData.question_text}
                        onChange={(e) => setFormData(prev => ({ ...prev, question_text: e.target.value }))}
                        placeholder="Enter the question description..."
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-section">
                        <label htmlFor="example_input">Example Input</label>
                        <textarea
                            id="example_input"
                            value={formData.example_input}
                            onChange={(e) => setFormData(prev => ({ ...prev, example_input: e.target.value }))}
                            placeholder="Enter example input..."
                            required
                        />
                    </div>

                    <div className="form-section">
                        <label htmlFor="example_output">Example Output</label>
                        <textarea
                            id="example_output"
                            value={formData.example_output}
                            onChange={(e) => setFormData(prev => ({ ...prev, example_output: e.target.value }))}
                            placeholder="Enter example output..."
                            required
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-section">
                        <label htmlFor="marks">Marks</label>
                        <input
                            type="number"
                            id="marks"
                            value={formData.marks}
                            onChange={(e) => setFormData(prev => ({ ...prev, marks: e.target.value }))}
                            placeholder="Enter marks..."
                            required
                        />
                    </div>

                    <div className="form-section">
                        <label htmlFor="subject">Subject</label>
                        <select
                            id="subject"
                            value={formData.subject}
                            onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
                            required
                        >
                            <option value="">Select Subject</option>
                            <option value="algorithms">Algorithms</option>
                            <option value="data-structures">Data Structures</option>
                            <option value="programming">Programming Basics</option>
                            <option value="database">Database</option>
                        </select>
                    </div>
                </div>

                <div className="testcases-section">
                    <div className="testcases-header">
                        <h2>Test Cases</h2>
                        <button type="button" onClick={fetchGeneratedTestCases} className="add-testcase-btn" disabled={loading}>
    {loading ? 'Generating...' : 'Generate Test Cases'}
</button>

                    </div>

                    {formData.test_cases.map((testcase, index) => (
                        <div key={index} className="testcase-container">
                            <div className="testcase-header">
                                <h3>Test Case {index + 1}</h3>
                                {index > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => removeTestCase(index)}
                                        className="remove-testcase-btn"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                            <div className="testcase-inputs">
                                <div className="form-section">
                                    <label>Input</label>
                                    <textarea
                                        value={testcase.input}
                                        onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                                        placeholder="Enter test case input..."
                                        required
                                    />
                                </div>
                                <div className="form-section">
                                    <label>Expected Output</label>
                                    <textarea
                                        value={testcase.output}
                                        onChange={(e) => handleTestCaseChange(index, 'output', e.target.value)}
                                        placeholder="Enter expected output..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="form-actions">
                    <button type="button" className="cancel-btn">Cancel</button>
                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Question'}
                    </button>
                </div>
            </form>
        </div>
        </>
    );
};

export default CreateQuestion;
