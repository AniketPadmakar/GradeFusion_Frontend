// AssignmentDetails.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './AssignmentDetails.css';

const AssignmentDetails = () => {
    // Mock data - replace with actual API call
    const [assignment, setAssignment] = useState({
        title: "Data Structures Implementation",
        description: "Implement a binary search tree with all basic operations including insertion, deletion, and traversal.",
        totalMarks: 100,
        scheduledDate: "2025-03-01",
        dueDate: "2025-03-15",
        timeLimit: "3 hours",
        instructorName: "Dr. Sarah Johnson",
        difficulty: "Medium",
        prerequisites: [
            "Basic understanding of trees",
            "Knowledge of recursive algorithms",
            "Proficiency in chosen programming language"
        ],
        resources: [
            "Lecture notes on BST",
            "Reference implementation guidelines",
            "Testing framework documentation"
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
                        <h2>Timeline</h2>
                        <div className="timeline-item">
                            <span className="timeline-label">Scheduled Date:</span>
                            <span className="timeline-value">{new Date(assignment.scheduledDate).toLocaleDateString()}</span>
                        </div>
                        <div className="timeline-item">
                            <span className="timeline-label">Due Date:</span>
                            <span className="timeline-value">{new Date(assignment.dueDate).toLocaleDateString()}</span>
                        </div>
                        <div className="timeline-item">
                            <span className="timeline-label">Time Limit:</span>
                            <span className="timeline-value">{assignment.timeLimit}</span>
                        </div>
                    </div>

                    <div className="assignment-card instructor-card">
                        <h2>Instructor</h2>
                        <p>{assignment.instructorName}</p>
                    </div>
                </div>

                <div className="assignment-grid">
                    <div className="assignment-card prerequisites-card">
                        <h2>Prerequisites</h2>
                        <ul>
                            {assignment.prerequisites.map((prereq, index) => (
                                <li key={index}>{prereq}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="assignment-card resources-card">
                        <h2>Resources</h2>
                        <ul>
                            {assignment.resources.map((resource, index) => (
                                <li key={index}>{resource}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="action-buttons">
                    <button className="start-button">Start Assignment</button>
                    <button className="save-button">Save for Later</button>
                </div>
            </div>
        </>
    );
};

export default AssignmentDetails;