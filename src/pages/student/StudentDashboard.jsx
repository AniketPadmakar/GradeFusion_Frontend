// import { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import './StudentDashboard.css';

// const StudentDashboard = () => {
//     const [activeTab, setActiveTab] = useState('all');
//     const [animateNumbers, setAnimateNumbers] = useState(false);
    
//     // Sample data (replace with actual data from your backend)
//     const studentInfo = {
//         name: "John Doe",
//         batch: "Batch 2024-A",
//         completedCount: 15,
//         upcomingCount: 5,
//         liveCount: 3,
//         assignments: [
//             { id: 1, title: "Data Structures Assignment", deadline: "2024-03-20", status: "completed", progress: 100, subject: "Data Structures" },
//             { id: 2, title: "Algorithm Analysis", deadline: "2024-03-25", status: "upcoming", progress: 0, subject: "Algorithms" },
//             { id: 3, title: "Database Design", deadline: "2024-03-22", status: "live", progress: 30, subject: "Database" },
//             { id: 4, title: "Web Development Project", deadline: "2024-03-28", status: "live", progress: 45, subject: "Web Dev" },
//         ]
//     };

//     useEffect(() => {
//         setAnimateNumbers(true);
//     }, []);

//     const filteredAssignments = () => {
//         switch(activeTab) {
//             case 'completed':
//                 return studentInfo.assignments.filter(a => a.status === 'completed');
//             case 'upcoming':
//                 return studentInfo.assignments.filter(a => a.status === 'upcoming');
//             case 'live':
//                 return studentInfo.assignments.filter(a => a.status === 'live');
//             default:
//                 return studentInfo.assignments;
//         }
//     };

//     const getTimeRemaining = (deadline) => {
//         const now = new Date();
//         const deadlineDate = new Date(deadline);
//         const daysRemaining = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24));
//         return daysRemaining;
//     };

//     const getDetailsLink = (assignment) => {
//         if (assignment.status === 'live') {
//             return `/LiveAssignmentStart/${assignment.id}`;
//         }
//         return `/AssignmentDetails/${assignment.id}`;
//     };

//     return (
//         <>
//             <nav className="navbar">
//                 <div className="nav-content">
//                     <div className="logo">GradeFusion</div>
//                     <div className="nav-links">
//                         <Link to="/" className="nav-link active">Home</Link>
//                         <Link to="/about" className="nav-link">About</Link>
//                         <Link to="/contact" className="nav-link">Contact</Link>
//                         <Link to="/signup" className="nav-link signup-btn">Log out</Link>
//                     </div>
//                 </div>
//             </nav>

//             <div className="dashboard-container">
//                 <div className="welcome-section">
//                     <div className="welcome-content">
//                         <div className="user-avatar">
//                             {studentInfo.name.charAt(0)}
//                         </div>
//                         <div className="welcome-text">
//                             <h1>Welcome back, {studentInfo.name}</h1>
//                             <h2>{studentInfo.batch}</h2>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="stats-container">
//                     <div className="stat-box">
//                         <div className="stat-icon completed">✓</div>
//                         <div className="stat-content">
//                             <h3>Completed</h3>
//                             <p className={`stat-number ${animateNumbers ? 'animate' : ''}`}>
//                                 {studentInfo.completedCount}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="stat-box">
//                         <div className="stat-icon upcoming">!</div>
//                         <div className="stat-content">
//                             <h3>Upcoming</h3>
//                             <p className={`stat-number ${animateNumbers ? 'animate' : ''}`}>
//                                 {studentInfo.upcomingCount}
//                             </p>
//                         </div>
//                     </div>
//                     <div className="stat-box">
//                         <div className="stat-icon live">▶</div>
//                         <div className="stat-content">
//                             <h3>Live</h3>
//                             <p className={`stat-number ${animateNumbers ? 'animate' : ''}`}>
//                                 {studentInfo.liveCount}
//                             </p>
//                         </div>
//                     </div>
//                 </div>

//                 <div className="assignments-section">
//                     <div className="section-header">
//                         <h2>Your Assignments</h2>
//                         <div className="tab-container">
//                             <button 
//                                 className={`tab-button ${activeTab === 'all' ? 'active' : ''}`}
//                                 onClick={() => setActiveTab('all')}
//                             >
//                                 All Assignments
//                             </button>
//                             <button 
//                                 className={`tab-button ${activeTab === 'live' ? 'active' : ''}`}
//                                 onClick={() => setActiveTab('live')}
//                             >
//                                 Live
//                             </button>
//                             <button 
//                                 className={`tab-button ${activeTab === 'upcoming' ? 'active' : ''}`}
//                                 onClick={() => setActiveTab('upcoming')}
//                             >
//                                 Upcoming
//                             </button>
//                             <button 
//                                 className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
//                                 onClick={() => setActiveTab('completed')}
//                             >
//                                 Completed
//                             </button>
//                         </div>
//                     </div>

//                     <div className="assignments-list">
//                         {filteredAssignments().map((assignment) => (
//                             <div key={assignment.id} className="assignment-card">
//                                 <div className="assignment-header">
//                                     <span className="subject-badge">{assignment.subject}</span>
//                                     <span className={`status-badge ${assignment.status}`}>
//                                         {assignment.status}
//                                     </span>
//                                 </div>
//                                 <h3>{assignment.title}</h3>
//                                 <div className="assignment-progress">
//                                     <div className="progress-bar">
//                                         <div 
//                                             className="progress-fill"
//                                             style={{ width: `${assignment.progress}%` }}
//                                         ></div>
//                                     </div>
//                                     <span className="progress-text">{assignment.progress}% Complete</span>
//                                 </div>
//                                 <div className="assignment-footer">
//                                     <div className="deadline">
//                                         <span className="deadline-label">Due in:</span>
//                                         <span className="deadline-days">
//                                             {getTimeRemaining(assignment.deadline)} days
//                                         </span>
//                                     </div>
//                                     <Link to={getDetailsLink(assignment)}>
//                                         <button className="view-details">View Details →</button>
//                                     </Link>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 </div>
//             </div>
//         </>
//     );
// };

// export default StudentDashboard;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken,deleteToken } from "../../data/Token";
import hostURL from "../../data/URL";
import '../student/StudentDashboard.css';

const StudentDash = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                    throw new Error("Authentication required");
                }

                const response = await fetch(`${hostURL.link}/app/student/assignments-student`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch assignments");
                }

                const data = await response.json();
                setAssignments(data.assignments);
            } catch (err) {
                setError(err.message || 'Error fetching assignments');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    
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
                    <h2>Your Assignments</h2>
                    {loading ? (
                        <p className="loading-text">Loading assignments...</p>
                    ) : error ? (
                        <p className="error-message">{error}</p>
                    ) : assignments.length === 0 ? (
                        <p className="no-assignments">No assignments found.</p>
                    ) : (
                        <div className="assignments-list">
                            {assignments.map((assignment) => (
                                <div key={assignment._id} className="assignment-card">
                                    <h3>{assignment.assignment_name}</h3>
                                    <button className="view-details" onClick={() => navigate(`/ViewAssignment/${assignment._id}`)}>View Details →</button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default StudentDash;