import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken,deleteToken } from "../../data/Token";
import { dateUtils } from '../../utils/dateUtils';
import hostURL from "../../data/URL";
import '../student/StudentDashboard.css';

const StudentDash = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [activeTab, setActiveTab] = useState('active');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getExpiredAssignmentsCount = () => {
        const now = new Date();
        return assignments.filter(assignment => {
            const dueDate = dateUtils.parseFromStandard(assignment.due_at);
            return !assignment.isSubmitted && dueDate < now;
        }).length;
    };

     // Add this function to handle logout
     const handleLogout = () => {
        // Delete the token from cookies
        deleteToken("token");
        // Redirect to home page
        navigate('/');
    };

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const token = getToken("token");
                if (!token) {
                    navigate('/Authen');
                    return;
                }

                const response = await fetch(`${hostURL.link}/app/student/assignments-student`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (response.status === 401) {
                    deleteToken("token");
                    navigate('/Authen');
                    return;
                }

                if (!response.ok) {
                    throw new Error("Failed to fetch assignments");
                }

                const data = await response.json();
                setAssignments(data.assignments.map(assignment => ({
                    ...assignment,
                    isSubmitted: assignment.isSubmitted || false
                })));
            } catch (err) {
                if (err.message.includes('Authentication')) {
                    navigate('/Authen');
                } else {
                    setError(err.message || 'Error fetching assignments');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, [navigate]);

    
    return (
        <>
            <nav className="navbar">
                <div className="nav-content">
                    <div className="logo">GradeFusion</div>
                    <div className="nav-links">
                        <button className="nav-link" onClick={() => navigate('/')}>Home</button>
                        <button className="nav-link" onClick={() => navigate('/about')}>About</button>
                        <button className="nav-link" onClick={() => navigate('/contact')}>Contact</button>
                        <button className="nav-link signup-btn" onClick={handleLogout}>Log out</button>
                    </div>
                </div>
            </nav>

            <div className="dashboard-container">
                <div className="welcome-section">
                    <h1>Welcome to Your Dashboard</h1>
                </div>

                <div className="assignments-section">
                    <div className="section-header">
                        <div className="header-with-count">
                            <h2>Your Assignments</h2>
                            <span className="assignment-count">
                                {activeTab === 'active' 
                                    ? `${assignments.filter(a => {
                                        const now = new Date();
                                        const dueDate = dateUtils.parseFromStandard(a.due_at);
                                        const startDate = dateUtils.parseFromStandard(a.start_at);
                                        return !a.isSubmitted && dueDate > now && startDate <= now;
                                    }).length} Active`
                                    : activeTab === 'expired'
                                    ? `${getExpiredAssignmentsCount()} Expired`
                                    : `${assignments.filter(a => a.isSubmitted).length} Submitted`
                                }
                            </span>
                        </div>
                        <div className="tab-container">
                            <button 
                                className={`tab-button ${activeTab === 'active' ? 'active' : ''}`}
                                onClick={() => setActiveTab('active')}
                            >
                                Active Assignments
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'submitted' ? 'active' : ''}`}
                                onClick={() => setActiveTab('submitted')}
                            >
                                Submission History
                            </button>
                            <button 
                                className={`tab-button ${activeTab === 'expired' ? 'active' : ''}`}
                                onClick={() => setActiveTab('expired')}
                            >
                                Expired ({getExpiredAssignmentsCount()})
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <p className="loading-text">Loading assignments...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : assignments.length === 0 ? (
                        <p className="no-assignments">No assignments found.</p>
                    ) : assignments.filter(assignment => {
                        const now = new Date();
                        const dueDate = dateUtils.parseFromStandard(assignment.due_at);
                        const startDate = dateUtils.parseFromStandard(assignment.start_at);
                        const isExpired = dueDate < now;
                        const hasStarted = startDate <= now;
                        
                        switch(activeTab) {
                            case 'active':
                                return !assignment.isSubmitted && !isExpired && hasStarted;
                            case 'expired':
                                return !assignment.isSubmitted && isExpired;
                            case 'submitted':
                                return assignment.isSubmitted;
                            default:
                                return false;
                        }
                    }).length === 0 ? (
                        <p className="no-assignments">
                            {activeTab === 'active' 
                                ? "No active assignments at the moment."
                                : activeTab === 'expired'
                                ? "No expired assignments."
                                : "No submitted assignments yet."
                            }
                        </p>
                    ) : (
                        <div className="assignments-list">
                            {assignments
                                .filter(assignment => {
                                    const now = new Date();
                                    const dueDate = dateUtils.parseFromStandard(assignment.due_at);
                                    const startDate = dateUtils.parseFromStandard(assignment.start_at);
                                    const isExpired = dueDate < now;
                                    const hasStarted = startDate <= now;
                                    
                                    if (activeTab === 'active') {
                                        return !assignment.isSubmitted && !isExpired && hasStarted;
                                    } else if (activeTab === 'expired') {
                                        return !assignment.isSubmitted && isExpired;
                                    } else {
                                        return assignment.isSubmitted;
                                    }
                                })
                                .map((assignment) => {
                                    const now = new Date();
                                    const dueDate = dateUtils.parseFromStandard(assignment.due_at);
                                    const startDate = dateUtils.parseFromStandard(assignment.start_at);
                                    const isExpired = dueDate < now;
                                    const hasStarted = startDate <= now;
                                    const isActive = hasStarted && !isExpired;
                                    return (
                                    <div key={assignment._id} className="assignment-card">
                                        <div className="assignment-header">
                                            <h3>{assignment.assignment_name}</h3>
                                            {assignment.isSubmitted ? (
                                                <span className="submitted-badge">Completed</span>
                                            ) : isExpired ? (
                                                <span className="expired-badge" style={{ backgroundColor: '#ff4444' }}>Expired</span>
                                            ) : !hasStarted ? (
                                                <span className="not-started-badge" style={{ backgroundColor: '#808080' }}>Not Started</span>
                                            ) : (
                                                <span className="active-badge">Active</span>
                                            )}
                                        </div>
                                    
                                    <div className="assignment-details">
                                        {assignment.course_id && (
                                            <div className="subject-info">
                                                <span className="label">Subject:</span>
                                                <span>{assignment.course_id.subject}</span>
                                            </div>
                                        )}
                                        <div className="deadline-info">
                                            <span className="label">Due Date:</span>
                                            <span>{dateUtils.formatForDisplay(assignment.due_at)}</span>
                                        </div>
                                    </div>

                                    {assignment.isSubmitted ? (
                                        <div className="submission-info">
                                            <div className="submission-date">
                                                <span className="label">Submitted on:</span>
                                                <span>{dateUtils.formatForDisplay(assignment.updated_at)}</span>
                                            </div>
                                            <button 
                                                className="view-submission" 
                                                onClick={() => navigate(`/AssignmentDetails/${assignment._id}`)}
                                                disabled
                                            >
                                                Submission Complete ✓
                                            </button>
                                        </div>
                                    ) : isExpired ? (
                                        <div className="expired-info">
                                            <div className="expiry-date">
                                                <span className="label">Expired on:</span>
                                                <span>{dateUtils.formatForDisplay(assignment.due_at)}</span>
                                            </div>
                                            <div className="expiry-action">
                                                <div className="missed-marks">
                                                    <span className="label">Missed Marks:</span>
                                                    <span>{assignment.marks}</span>
                                                </div>
                                                <button 
                                                    className="view-details" 
                                                    disabled
                                                    style={{ backgroundColor: '#ff4444', cursor: 'not-allowed' }}
                                                >
                                                    Assignment Expired
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button 
                                            className="view-details" 
                                            onClick={() => navigate(`/LiveAssignmentStart/${assignment._id}`)}
                                        >
                                            Start Assignment →
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default StudentDash;