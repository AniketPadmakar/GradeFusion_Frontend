import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getToken } from "../../data/Token";
import hostURL from "../../data/URL";
import './ViewAssignmentspecific.css';

const ViewAssignmentSpecific = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [assignment, setAssignment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssignment = async () => {
            try {
                const token = getToken("token");
                if (!token) {
                    throw new Error("Authentication required");
                }

                const response = await fetch(`${hostURL.link}/app/teacher/fetch-single-assignment/${id}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch assignment details");
                }

                const data = await response.json();
                setAssignment(data.assignment); // Accessing the 'assignment' key in the response
            } catch (err) {
                setError(err.message || 'Error fetching assignment details');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignment();
    }, [id]);

    return (
        <div className="full-page-container">
            <div className="assignment-details-wrapper">
                <div className="assignment-details-container">
                    <header className="details-header">
                        <h1>Assignment Details</h1>
                        <button className="back-button" onClick={() => navigate('/ViewAssignments')}>Back</button>
                    </header>

                    {loading ? (
                        <p className="loading-text">Loading...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : assignment ? (
                        <div className="assignment-card">
                            <h2 className="assignment-name">{assignment.assignment_name}</h2>

                            <div className="details-section">
                                <h3>Due Date</h3>
                                <p>{assignment.due_at}</p>
                            </div>

                            <div className="details-section">
                                <h3>Total Marks</h3>
                                <p>{assignment.marks}</p>
                            </div>

                            <div className="details-section">
                                <h3>Questions</h3>
                                {assignment.questions.length > 0 ? (
                                    <ul>
                                        {assignment.questions.map((question) => (
                                            <li key={question._id}>
                                                <strong>Question:</strong> {question.question_text} <br />
                                                <strong>Marks:</strong> {question.marks} <br />
                                                <strong>Subject:</strong> {question.subject} <br />
                                                <strong>Example Input:</strong> {question.example_input_output[0]?.input || 'N/A'} <br />
                                                <strong>Example Output:</strong> {question.example_input_output[0]?.output || 'N/A'}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No questions assigned.</p>
                                )}
                            </div>

                            <div className="details-section">
                                <h3>Enrolled Students</h3>
                                {assignment.student_ids.length > 0 ? (
                                    <ul>
                                        {assignment.student_ids.map((student) => (
                                            <li key={student._id}>{student.firstName} {student.lastName} ({student.email})</li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No students enrolled.</p>
                                )}
                            </div>
                        </div>
                    ) : (
                        <p className="error-message">Assignment not found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewAssignmentSpecific;
