import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './TeacherDashboard.css';
import { getToken,deleteToken } from "../../data/Token";

const TeacherDashboard = () => {
    const [showNewAssignment, setShowNewAssignment] = useState(false);
    const teacherName = "Dr. Sarah Johnson";
    const navigate = useNavigate();

     // Add this function to handle logout
         const handleLogout = () => {
            // Delete the token from cookies
            deleteToken("token");
            // Redirect to home page
            navigate('/');
        };
    

    return (
        <>
            <nav className="navbar">
                <div className="nav-content">
                    <div className="logo">GradeFusion</div>
                    <div className="nav-links">
                        <Link to="/" className="nav-link active">Home</Link>
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/contact" className="nav-link">Contact</Link>
                        <button className="nav-link signup-btn" onClick={handleLogout}>Log out</button>
                    </div>
                </div>
            </nav>
            <div className="dashboard-container">
                <header className="dashboard-header">
                    <h1 className="welcome-text">Welcome, {teacherName}</h1>
                    <div className="header-stats">
                        <div className="stat-box">
                            <h3>Active Assignments</h3>
                            <p>12</p>
                        </div>
                        <div className="stat-box">
                            <h3>Pending Reviews</h3>
                            <p>25</p>
                        </div>
                        <div className="stat-box">
                            <h3>Total Students</h3>
                            <p>150</p>
                        </div>
                    </div>
                </header>
                <main className="dashboard-main">
                    <section className="quick-actions">
                        <button className="action-button create-btn" onClick={() => navigate('/ViewAssignments')}>
                        View Assignment
                        </button>
                        <button className="action-button view-btn" onClick={() => navigate('/StudentSubmissionView')}>
                            View Student Responses
                        </button>
                        <button className="action-button analytics-btn" onClick={() => navigate('/ReopenAssignment')}>
                            Reopen Assignment
                        </button>
                        <button className="action-button question-btn" onClick={() => navigate('/ViewQuestions')}>
                            View Questions
                        </button>
                    </section>
                    <section className="recent-activity">
                        <h2>Recent Activity</h2>
                        <div className="activity-list">
                            <div className="activity-item">
                                <span className="activity-icon">📝</span>
                                <div className="activity-content">
                                    <h3>Data Structures Assignment Submitted</h3>
                                    <p>5 new submissions from Batch 2024 A</p>
                                    <small>2 hours ago</small>
                                </div>
                            </div>
                            <div className="activity-item">
                                <span className="activity-icon">✨</span>
                                <div className="activity-content">
                                    <h3>New Assignment Created</h3>
                                    <p>Algorithm Analysis - Due next week</p>
                                    <small>5 hours ago</small>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
};

export default TeacherDashboard;
