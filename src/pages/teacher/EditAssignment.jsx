import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from "../../data/Token";
import hostURL from "../../data/URL";
import './EditAssignment.css';

// Utility function to convert backend date format to input datetime-local format
const convertToInputDateTime = (backendDate) => {
    try {
        if (!backendDate) return '';
        
        // Handle if the date is already in ISO format
        if (backendDate.includes('T')) {
            const date = new Date(backendDate);
            if (!isNaN(date.getTime())) {
                return backendDate.slice(0, 16); // Get YYYY-MM-DDTHH:mm format
            }
        }

        const [datePart, timePart] = backendDate.split(' :: ');
        if (!datePart || !timePart) return '';

        const [day, month, year] = datePart.split('/');
        if (!day || !month || !year) return '';

        // Ensure all parts are padded correctly
        const paddedMonth = String(month).padStart(2, '0');
        const paddedDay = String(day).padStart(2, '0');
        
        return `${year}-${paddedMonth}-${paddedDay}T${timePart}`;
    } catch (error) {
        console.error('Error converting date:', error);
        return '';
    }
};

// Utility function to convert input datetime-local format to backend format
const convertToBackendDateTime = (inputDate) => {
    if (!inputDate) return '';
    const date = new Date(inputDate);
    return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()} :: ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;
};

const EditAssignment = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const [assignment, setAssignment] = useState({
        assignment_name: "",
        start_at: "",
        due_at: "",
        marks: "",
        description: "",
        requirements: "",
        class_name: "",
        batch: "",
    });

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
                console.log('Raw assignment data:', data); // Debug log
                
                // Ensure we're accessing the correct data structure
                const assignmentData = data.assignment || data;
                console.log('Assignment data structure:', assignmentData); // Debug log
                
                // Convert dates to input format when setting initial state
                // Extract class and batch from the first student if available
                const studentInfo = assignmentData.student_ids?.[0];
                console.log('Student Info:', studentInfo); // Debug log to see student structure
                
                const formattedAssignment = {
                    ...assignmentData,
                    assignment_name: assignmentData.assignment_name || '',
                    // Try to get class and batch from different possible locations in the data
                    class_name: studentInfo?.class_name || studentInfo?.class || assignmentData.class_name || '',
                    batch: studentInfo?.batch_name || studentInfo?.batch || assignmentData.batch || '',
                    marks: assignmentData.marks || '',
                    description: assignmentData.description || '',
                    requirements: assignmentData.requirements || '',
                    start_at: convertToInputDateTime(assignmentData.start_at),
                    due_at: convertToInputDateTime(assignmentData.due_at)
                };
                
                // Additional debug log for class and batch
                console.log('Class and batch info:', {
                    class: studentInfo?.class,
                    batch: studentInfo?.batch,
                    studentInfo
                });
                console.log('Formatted assignment:', formattedAssignment); // Debug log
                setAssignment(formattedAssignment);
            } catch (err) {
                setError(err.message || 'Error fetching assignment details');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignment();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = getToken("token");
            if (!token) {
                throw new Error("Authentication required");
            }

            // Convert dates back to backend format before sending
            const submissionData = {
                ...assignment,
                start_at: convertToBackendDateTime(assignment.start_at),
                due_at: convertToBackendDateTime(assignment.due_at)
            };

            const response = await fetch(`${hostURL.link}/app/teacher/update-assignments/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(submissionData)
            });

            if (!response.ok) {
                throw new Error("Failed to update assignment");
            }

            navigate('/ViewAssignments');
        } catch (err) {
            setError(err.message || 'Error updating assignment');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAssignment(prev => ({
            ...prev,
            [name]: value
        }));
    };

    if (loading) {
        return (
            <div className="edit-assignment-container">
                <p>Loading assignment details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="edit-assignment-container">
                <p className="error-message">{error}</p>
                <button className="back-button" onClick={() => navigate('/ViewAssignments')}>
                    Back to Assignments
                </button>
            </div>
        );
    }

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
                        <label htmlFor="assignment_name">Assignment Title</label>
                        <input
                            type="text"
                            id="assignment_name"
                            name="assignment_name"
                            value={assignment.assignment_name || ''}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="class_name">Class</label>
                            <select
                                id="class_name"
                                name="class_name"
                                value={assignment.class_name || ''}
                                onChange={handleChange}
                                required
                                className="dropdown-field"
                            >
                                <option value="">Select Class</option>
                                <option value="FE" selected={assignment.class_name === "FE"}>FE</option>
                                <option value="SE" selected={assignment.class_name === "SE"}>SE</option>
                                <option value="TE" selected={assignment.class_name === "TE"}>TE</option>
                                <option value="BE" selected={assignment.class_name === "BE"}>BE</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="batch">Batch</label>
                            <select
                                id="batch"
                                name="batch"
                                value={assignment.batch || ''}
                                onChange={handleChange}
                                required
                                className="dropdown-field"
                            >
                                <option value="">Select Batch</option>
                                <option value="A1" selected={assignment.batch === "A1"}>A1</option>
                                <option value="A2" selected={assignment.batch === "A2"}>A2</option>
                                <option value="B1" selected={assignment.batch === "B1"}>B1</option>
                                <option value="B2" selected={assignment.batch === "B2"}>B2</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="marks">Total Marks</label>
                            <input
                                type="number"
                                id="marks"
                                name="marks"
                                value={assignment.marks || ''}
                                onChange={handleChange}
                                required
                                min="0"
                            />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="start_at">Start Date</label>
                            <input
                                type="datetime-local"
                                id="start_at"
                                name="start_at"
                                value={assignment.start_at}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="due_at">Due Date</label>
                            <input
                                type="datetime-local"
                                id="due_at"
                                name="due_at"
                                value={assignment.due_at}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={() => navigate('/ViewAssignments')}>
                            Cancel
                        </button>
                        <button type="submit" className="save-button" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditAssignment;