import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AssignmentDetails.css';

const AssignmentDetails = () => {
    // Mock data - replace with actual API call
    const [assignment, setAssignment] = useState({
        title: "Data Structures Implementation",
        description: "Final Assignment for Data Structures Course - Spring 2025",
        totalMarks: 100,
        dueDate: "2025-03-15",
        teacherName: "Dr. Sarah Johnson",
        difficulty: "Medium",
        questions: [
            {
                id: 1,
                question: "Implement a binary search tree with insertion operation",
                marks: 30,
            },
            {
                id: 2,
                question: "Add deletion functionality to the BST implementation",
                marks: 35,
            },
            {
                id: 3,
                question: "Implement traversal methods (in-order, pre-order, post-order)",
                marks: 35,
            }
        ]
    });

    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setIsLoading(false);
        }, 1000);
    }, []);

    if (isLoading) {
        return (
            <>
                <nav className="navbar">
                    <div className="nav-content">
                        <div className="logo">GradeFusion</div>
                        <div className="nav-links">
                            <Link to="/" className="nav-link active">Home</Link>
                            <Link to="/about" className="nav-link">About</Link>
                            <Link to="/contact" className="nav-link">Contact</Link>
                            <Link to="/signup" className="nav-link signup-btn">Sign Up</Link>
                        </div>
                    </div>
                </nav>
                <div className="loading-spinner"></div>
            </>
        );
    }

    return (
        <>
            <nav className="navbar">
                <div className="nav-content">
                    <div className="logo">GradeFusion</div>
                    <div className="nav-links">
                        <Link to="/" className="nav-link active">Home</Link>
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/contact" className="nav-link">Contact</Link>
                        <Link to="/signup" className="nav-link signup-btn">Sign Up</Link>
                    </div>
                </div>
            </nav>
            
            <div className="assignment-details-container">
                <div className="assignment-header">
                    <h1>{assignment.title}</h1>
                    <div className="assignment-meta">
                        <span className="difficulty-badge">{assignment.difficulty}</span>
                        <span className="marks-badge">{assignment.totalMarks} Marks</span>
                    </div>
                </div>

                <div className="assignment-card description-card">
                    <h2>Description</h2>
                    <p>{assignment.description}</p>
                </div>

                <div className="assignment-grid">
                    <div className="assignment-card timeline-card">
                        <h2>Assignment Details</h2>
                        <div className="timeline-item">
                            <span className="timeline-label">Due Date:</span>
                            <span className="timeline-value">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="timeline-item">
                            <span className="timeline-label">Total Marks:</span>
                            <span className="timeline-value">{assignment.totalMarks}</span>
                        </div>
                    </div>

                    <div className="assignment-card teacher-card">
                        <h2>Teacher Information</h2>
                        <div className="timeline-item">
                            <span className="timeline-label">Name:</span>
                            <span className="timeline-value">{assignment.teacherName}</span>
                        </div>
                    </div>
                </div>

                <div className="assignment-card questions-card">
                    <h2>Questions</h2>
                    {assignment.questions.map((question) => (
                        <div key={question.id} className="timeline-item">
                            <div className="question-content">
                                <span className="question-number">Question {question.id}</span>
                                <p>{question.question}</p>
                            </div>
                            <span className="question-marks">{question.marks} marks</span>
                        </div>
                    ))}
                </div>

                <div className="action-buttons">
                    <button className="start-button">Start Assignment</button>
                </div>
            </div>
        </>
    );
};

export default AssignmentDetails;