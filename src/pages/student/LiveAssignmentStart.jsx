import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LiveAssignmentStart.css';

const LiveAssignmentStart = () => {
    const navigate = useNavigate();
    const [isStarting, setIsStarting] = useState(false);

    // Sample assignment data (replace with actual data from your backend)
    const assignmentData = {
        title: "Data Structures and Algorithms",
        subject: "Computer Science",
        assignedBy: "Prof. Sarah Johnson",
        totalMarks: 100,
        duration: "2 hours",
        deadline: "2024-03-20 15:30",
        description: "This assignment focuses on implementing various data structures and analyzing their time complexity.",
        instructions: [
            "Read all questions carefully before starting",
            "You cannot pause the test once started",
            "Make sure you have stable internet connection",
            "Submit your code with proper comments and documentation"
        ],
        questionInfo: {
            totalQuestions: 3,
            difficulty: "Medium",
            typeOfQuestions: "Programming Implementation",
            languages: ["Python", "Java", "C++"]
        }
    };

    const handleStartTest = () => {
        setIsStarting(true);
        // Add a slight delay to show the animation
        setTimeout(() => {
            navigate('/assignment/live-test'); // Navigate to the actual test page
        }, 1000);
    };

    const getFormattedDateTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="live-assignment-container">
            <div className="assignment-header">
                <div className="title-section">
                    <h1>{assignmentData.title}</h1>
                    <span className="subject-tag">{assignmentData.subject}</span>
                </div>
                <div className="header-details">
                    <div className="detail-item">
                        <span className="detail-label">Assigned by:</span>
                        <span className="detail-value">{assignmentData.assignedBy}</span>
                    </div>
                    <div className="detail-item">
                        <span className="detail-label">Due Date:</span>
                        <span className="detail-value">{getFormattedDateTime(assignmentData.deadline)}</span>
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
                                <strong>{assignmentData.totalMarks}</strong>
                            </div>
                        </div>
                        <div className="overview-item">
                            <div className="overview-icon">⏱️</div>
                            <div className="overview-text">
                                <span>Duration</span>
                                <strong>{assignmentData.duration}</strong>
                            </div>
                        </div>
                        <div className="overview-item">
                            <div className="overview-icon">📝</div>
                            <div className="overview-text">
                                <span>Questions</span>
                                <strong>{assignmentData.questionInfo.totalQuestions}</strong>
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
                    <h2>Description</h2>
                    <p className="description-text">{assignmentData.description}</p>
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
            </div>
        </div>
    );
};

export default LiveAssignmentStart;