import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from "../../data/Token";
import hostURL from "../../data/URL";
import './ViewQuestion.css';

const ViewQuestionspecific = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [question, setQuestion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const token = getToken("token");
                if (!token) {
                    throw new Error("Authentication required");
                }

                const response = await fetch(`${hostURL.link}/app/teacher/fetch-question/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch question details");
                }

                const data = await response.json();
                setQuestion(data);
            } catch (err) {
                setError(err.message || 'Error fetching question details');
            } finally {
                setLoading(false);
            }
        };

        fetchQuestion();
    }, [id]);

    return (
        <div className="full-page-container">
        <div className="question-details-wrapper">
            <div className="question-details-container">
                <header className="details-header">
                    <h1>Question Details</h1>
                    <button className="back-button" onClick={() => navigate('/ViewQuestions')}>Back</button>
                </header>

                {loading ? (
                    <p className="loading-text">Loading...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : question ? (
                    <div className="question-card">
                        <h2 className="question-text">{question.question_text}</h2>

                        <div className="details-section">
                            <h3>Example Input</h3>
                            {question.example_input_output.length > 0 && (
                                <pre className="example-box">{question.example_input_output[0].input}</pre>
                            )}
                        </div>

                        <div className="details-section">
                            <h3>Example Output</h3>
                            {question.example_input_output.length > 0 && (
                                <pre className="example-box">{question.example_input_output[0].output}</pre>
                            )}
                        </div>

                        <div className="details-section">
                            <h3>Marks</h3>
                            <p>{question.marks}</p>
                        </div>

                        <div className="details-section">
                            <h3>Subject</h3>
                            <p>{question.subject}</p>
                        </div>

                        <div className="details-section">
                            <h3>Test Cases</h3>
                            {question.test_cases.map((testcase, index) => (
                                <div key={index} className="test-case">
                                    <h4>Test Case {index + 1}</h4>
                                    <pre><strong>Input:</strong> {testcase.input}</pre>
                                    <pre><strong>Expected Output:</strong> {testcase.expected_output ? testcase.expected_output : "N/A"}</pre>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="error-message">Question not found.</p>
                )}
            </div>
        </div>
    </div>
    );
};

export default ViewQuestionspecific;
