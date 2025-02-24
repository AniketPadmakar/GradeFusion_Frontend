import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewAssignments.css';

const ViewAssignments = () => {
    const navigate = useNavigate();
    
    // Sample assignments data - replace with your actual data
    const [assignments] = useState([
        {
            id: 1,
            title: "Data Structures Implementation",
            dueDate: "2025-03-15",
            status: "Active",
            category: "Programming",
            dateCreated: "2025-02-20"
        },
        {
            id: 2,
            title: "Algorithm Analysis Project",
            dueDate: "2025-03-20",
            status: "Draft",
            category: "Algorithms",
            dateCreated: "2025-02-21"
        },
        {
            id: 3,
            title: "Database Design Exercise",
            dueDate: "2025-03-25",
            status: "Active",
            category: "Databases",
            dateCreated: "2025-02-22"
        }
    ]);

    return (
        <div className="assignments-container">
            <header className="assignments-header">
                <h1>Assignments</h1>
                <button className="create-button" onClick={() => navigate('/CreateAssignment')}>
                    <span className="button-icon">+</span>
                    Create New Assignment
                </button>
            </header>

            <div className="assignments-grid">
                {assignments.map(assignment => (
                    <div key={assignment.id} className="assignment-card">
                        <div className="assignment-header">
                            <h2>{assignment.title}</h2>
                            <span className={`status ${assignment.status.toLowerCase()}`}>
                                {assignment.status}
                            </span>
                        </div>
                        <div className="assignment-details">
                            <div className="detail-row">
                                <span className="category">{assignment.category}</span>
                                <span className="date">Created: {assignment.dateCreated}</span>
                            </div>
                            <div className="detail-row">
                                <span className="due-date">Due: {assignment.dueDate}</span>
                            </div>
                        </div>
                        <div className="assignment-actions">
                        <button className="action-button edit" onClick={() => navigate("/EditAssignment")}>
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

export default ViewAssignments;