import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EditAssignment.css';

const EditAssignment = () => {
    const navigate = useNavigate();
    
    // Sample initial state - in real app, get this from props or route params
    const [assignment, setAssignment] = useState({
        title: "Data Structures Implementation",
        dueDate: "2025-03-15",
        status: "Active",
        category: "Programming",
        description: "Implement basic data structures including linked lists, stacks, and queues.",
        requirements: "Submit source code and documentation",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle update logic here
        navigate('/ViewAssignments');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssignment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="edit-assignment-container">
            <div className="edit-assignment-content">
                <header className="edit-header">
                    <h1>Edit Assignment</h1>
                    <button className="back-button" onClick={() => navigate('/ViewAssignments')}>
                        Back to Assignments
                    </button>
                </header>

                <form className="edit-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Assignment Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={assignment.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select
                                id="category"
                                name="category"
                                value={assignment.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="Programming">Programming</option>
                                <option value="Algorithms">Algorithms</option>
                                <option value="Databases">Databases</option>
                                <option value="Web Development">Web Development</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <select
                                id="status"
                                name="status"
                                value={assignment.status}
                                onChange={handleChange}
                                required
                            >
                                <option value="Active">Active</option>
                                <option value="Draft">Draft</option>
                                <option value="Completed">Completed</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="dueDate">Due Date</label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={assignment.dueDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={assignment.description}
                            onChange={handleChange}
                            rows="4"
                            required
                        ></textarea>
                    </div>

                    <div className="form-group">
                        <label htmlFor="requirements">Requirements</label>
                        <textarea
                            id="requirements"
                            name="requirements"
                            value={assignment.requirements}
                            onChange={handleChange}
                            rows="3"
                            required
                        ></textarea>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={() => navigate('/ViewAssignments')}>
                            Cancel
                        </button>
                        <button type="submit" className="save-button">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAssignment;