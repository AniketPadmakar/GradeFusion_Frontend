import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getToken } from "../../data/Token";
import hostURL from "../../data/URL";
import './LiveAssignmentStart.css';

const LiveAssignmentStart = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [isStarting, setIsStarting] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [assignmentData, setAssignmentData] = useState(null);

    useEffect(() => {
        const fetchAssignmentData = async () => {
            try {
                const token = getToken("token");
                if (!token) {
                    throw new Error("Authentication required");
                }

                const response = await fetch(`${hostURL.link}/app/student/assignments-student/${id}`, {
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
                
                // Convert date format
                const formatDate = (dateString) => {
                    const date = new Date(dateString);
                    if (isNaN(date.getTime())) return dateString; // Return original if invalid
                    
                    const day = date.getDate().toString().padStart(2, '0');
                    const month = (date.getMonth() + 1).toString().padStart(2, '0');
                    const year = date.getFullYear();
                    const hours = date.getHours().toString().padStart(2, '0');
                    const minutes = date.getMinutes().toString().padStart(2, '0');
                    const seconds = date.getSeconds().toString().padStart(2, '0');
                    
                    return `${day}/${month}/${year} :: ${hours}:${minutes}:${seconds}`;
                };

                setAssignmentData({
                    ...data,
                    due_at: formatDate(data.due_at),
                    start_at: data.start_at || formatDate(new Date().toISOString()),
                    instructions: [
                        "Read all questions carefully before starting",
                        "You cannot pause the test once started",
                        "Make sure you have stable internet connection",
                        "Submit your code with proper comments and documentation"
                    ],
                    questionInfo: {
                        totalQuestions: data.questions.length,
                        difficulty: "Medium",
                        typeOfQuestions: "Programming Implementation",
                        languages: ["Python", "Java", "C++"]
                    }
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignmentData();
    }, [id]);

    const handleStartTest = () => {
        setIsStarting(true);
        setTimeout(() => {
            navigate(`/LiveAssignmentPage/${id}`);
        }, 1000);
    };

    const getFormattedDateTime = (dateString) => {
        if (!dateString) {
            return 'Date not available';
        }
        try {
            // Split the date string (format: "DD/MM/YYYY :: HH:mm:ss")
            const [datePart, timePart] = dateString.split(" :: ");
            const [day, month, year] = datePart.split("/");
            const date = new Date(`${year}-${month}-${day}T${timePart}`);
            
            if (isNaN(date.getTime())) {
                return 'Invalid date format';
            }
            
            return date.toLocaleString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            console.error('Error formatting date:', error);
            return 'Invalid date format';
        }
    };

    const checkAssignmentAvailability = () => {
        const now = new Date();
        const startDate = parseDateTime(assignmentData.start_at);
        const dueDate = parseDateTime(assignmentData.due_at);
        
        if (now < startDate) {
            return { available: false, message: "Assignment has not started yet" };
        }
        if (now > dueDate) {
            return { available: false, message: "Assignment submission deadline has passed" };
        }
        return { available: true, message: "" };
    };

    const parseDateTime = (dateString) => {
        const [datePart, timePart] = dateString.split(" :: ");
        const [day, month, year] = datePart.split("/");
        return new Date(`${year}-${month}-${day}T${timePart}`);
    };

    if (loading) {
        return <div className="loading">Loading assignment details...</div>;
    }

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (!assignmentData) {
        return <div className="error">Assignment not found</div>;
    }

    return (
        <div className="live-assignment-container">
            <div className="assignment-header">
                <div className="title-section">
                    <h1>{assignmentData.assignment_name}</h1>
                </div>
                <div className="header-details">
                    <div className="detail-item">
                        <span className="detail-label">Assigned by:</span>
                        <span className="detail-value">{assignmentData.teacher_id?.firstName} {assignmentData.teacher_id?.lastName}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Start Date:</span>
                        <span className="detail-value">{getFormattedDateTime(assignmentData.start_at)}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Due Date:</span>
                        <span className="detail-value">{getFormattedDateTime(assignmentData.due_at)}</span>
                    </div>
                </div>
            </div>

            <div className="assignment-details">
                <div className="details-card">
                    <h2>Assignment Overview</h2>
                    <div className="overview-grid">
                        <div className="overview-item">
                            <div className="overview-icon">🎯</div>
                            <div className="overview-text">
                                <span>Total Marks</span>
                                <strong>{assignmentData.marks}</strong>
                            </div>
                        </div>
                        <div className="overview-item">
                            <div className="overview-icon">⏱️</div>
                            <div className="overview-text">
                                <span>Questions</span>
                                <strong>{assignmentData.questions.length}</strong>
                            </div>
                        </div>
                        <div className="overview-item">
                            <div className="overview-icon">📝</div>
                            <div className="overview-text">
                                <span>Type</span>
                                <strong>{assignmentData.questionInfo.typeOfQuestions}</strong>
                            </div>
                        </div>
                        <div className="overview-item">
                            <div className="overview-icon">📊</div>
                            <div className="overview-text">
                                <span>Difficulty</span>
                                <strong>{assignmentData.questionInfo.difficulty}</strong>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="details-card">
                    <h2>Languages Allowed</h2>
                    <div className="languages-list">
                        {assignmentData.questionInfo.languages.map((lang, index) => (
                            <span key={index} className="language-tag">{lang}</span>
                        ))}
                    </div>
                </div>

                <div className="details-card">
                    <h2>Important Instructions</h2>
                    <ul className="instructions-list">
                        {assignmentData.instructions.map((instruction, index) => (
                            <li key={index}>{instruction}</li>
                        ))}
                    </ul>
                </div>
            </div>

            <div className="start-section">
                {checkAssignmentAvailability().available ? (
                    <>
                        <button 
                            className={`start-button ${isStarting ? 'starting' : ''}`}
                            onClick={handleStartTest}
                            disabled={isStarting}
                        >
                            {isStarting ? 'Starting...' : 'Start Assignment'}
                        </button>
                        <p className="start-note">
                            Make sure you have read all instructions before starting the assignment
                        </p>
                    </>
                ) : (
                    <p className="error-message">{checkAssignmentAvailability().message}</p>
                )}
            </div>
        </div>
    );
};

export default LiveAssignmentStart;