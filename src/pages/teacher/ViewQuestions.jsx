import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import './ViewQuestions.css';

const ViewQuestions = () => {
    const navigate = useNavigate(); // Add this hook
    
    // Sample questions data - replace with your actual data
    const [questions] = useState([
        {
            id: 1,
            title: "Two Sum Problem",
            difficulty: "Easy",
            category: "Arrays",
            dateCreated: "2025-02-20"
        },
        {
            id: 2,
            title: "Binary Tree Traversal",
            difficulty: "Medium",
            category: "Trees",
            dateCreated: "2025-02-21"
        },
        {
            id: 3,
            title: "Dynamic Programming - Fibonacci",
            difficulty: "Medium",
            category: "Dynamic Programming",
            dateCreated: "2025-02-22"
        }
    ]);

    return (
        <div className="questions-container">
            <header className="questions-header">
                <h1>Coding Questions</h1>
                <button className="create-button" onClick={() => navigate('/CreateQuestion')}>
                    <span className="button-icon">+</span>
                    Create New Question
                </button>
            </header>

            <div className="questions-grid">
                {questions.map(question => (
                    <div key={question.id} className="question-card">
                        <div className="question-header">
                            <h2>{question.title}</h2>
                            <span className={`difficulty ${question.difficulty.toLowerCase()}`}>
                                {question.difficulty}
                            </span>
                        </div>
                        <div className="question-details">
                            <span className="category">{question.category}</span>
                            <span className="date">Created: {question.dateCreated}</span>
                        </div>
                        <div className="question-actions">
                        <button className="action-button edit" onClick={() => navigate("/EditQuestion")}>
      Edit
    </button>
                            <button className="action-button view">View</button>
                            <button className="action-button delete">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViewQuestions;