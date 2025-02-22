import React, { useState } from 'react';
import './CreateQuestion.css';

const CreateQuestion = () => {
    const [formData, setFormData] = useState({
        questionText: '',
        exampleInput: '',
        exampleOutput: '',
        marks: '',
        subject: '',
        testcases: [{ input: '', output: '' }]
    });

    const addTestCase = () => {
        setFormData(prev => ({
            ...prev,
            testcases: [...prev.testcases, { input: '', output: '' }]
        }));
    };

    const removeTestCase = (index) => {
        setFormData(prev => ({
            ...prev,
            testcases: prev.testcases.filter((_, i) => i !== index)
        }));
    };

    const handleTestCaseChange = (index, field, value) => {
        const updatedTestcases = formData.testcases.map((testcase, i) => {
            if (i === index) {
                return { ...testcase, [field]: value };
            }
            return testcase;
        });

        setFormData(prev => ({
            ...prev,
            testcases: updatedTestcases
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your submission logic here
        console.log(formData);
    };

    return (
        <div className="create-question-container">
            <div className="form-header">
                <h1>Create New Question</h1>
                <p>Design your coding challenge</p>
            </div>

            <form onSubmit={handleSubmit} className="question-form">
                <div className="form-section">
                    <label htmlFor="questionText">Question Text</label>
                    <textarea
                        id="questionText"
                        value={formData.questionText}
                        onChange={(e) => setFormData(prev => ({ ...prev, questionText: e.target.value }))}
                        placeholder="Enter the question description..."
                        required
                    />
                </div>

                <div className="form-row">
                    <div className="form-section">
                        <label htmlFor="exampleInput">Example Input</label>
                        <textarea
                            id="exampleInput"
                            value={formData.exampleInput}
                            onChange={(e) => setFormData(prev => ({ ...prev, exampleInput: e.target.value }))}
                            placeholder="Enter example input..."
                            required
                        />
                    </div>

                    <div className="form-section">
                        <label htmlFor="exampleOutput">Example Output</label>
                        <textarea
                            id="exampleOutput"
                            value={formData.exampleOutput}
                            onChange={(e) => setFormData(prev => ({ ...prev, exampleOutput: e.target.value }))}
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
                        <button type="button" onClick={addTestCase} className="add-testcase-btn">
                            Add Test Case
                        </button>
                    </div>

                    {formData.testcases.map((testcase, index) => (
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
                    <button type="submit" className="submit-btn">Create Question</button>
                </div>
            </form>
        </div>
    );
};

export default CreateQuestion;