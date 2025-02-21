// ReopenAssignment.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './ReopenAssignment.css';

const ReopenAssignment = () => {
  const [selectedAssignment, setSelectedAssignment] = useState('');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [reopenForAll, setReopenForAll] = useState(false);
  const [newDueDate, setNewDueDate] = useState('');
  const [reason, setReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Dummy data (replace with API calls)
  const assignments = [
    { id: 1, title: "Assignment 1 - Bubble Sort", dueDate: "2024-02-15", subject: "Data Structures" },
    { id: 2, title: "Assignment 2 - Prime Numbers", dueDate: "2024-02-20", subject: "Programming" },
    { id: 3, title: "Assignment 3 - Calculator", dueDate: "2024-02-25", subject: "Programming" }
  ];

  const students = [
    { id: 1, name: "John Doe", rollNo: "CS001", status: "Submitted Late" },
    { id: 2, name: "Jane Smith", rollNo: "CS002", status: "Not Submitted" },
    { id: 3, name: "Mike Johnson", rollNo: "CS003", status: "Not Submitted" },
    { id: 4, name: "Sarah Williams", rollNo: "CS004", status: "Submitted Late" }
  ];

  const handleStudentSelect = (studentId) => {
    if (reopenForAll) return; // Prevent selection if "Reopen for All" is checked
    
    setSelectedStudents(prev => {
      if (prev.includes(studentId)) {
        return prev.filter(id => id !== studentId);
      }
      return [...prev, studentId];
    });
  };

  const handleReopenForAllChange = (e) => {
    setReopenForAll(e.target.checked);
    if (e.target.checked) {
      setSelectedStudents([]);
    }
  };

  const filteredStudents = students.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.rollNo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const reopenData = {
      assignmentId: selectedAssignment,
      students: reopenForAll ? 'all' : selectedStudents,
      newDueDate,
      reason
    };
    console.log('Reopen request:', reopenData);
    // Add your API call here
  };

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">GradeFusion</div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/signup" className="nav-link signup-btn">Sign Up</Link>
          </div>
        </div>
      </nav>

      <div className="reopen-container">
        <h1 className="page-title">Reopen Assignment</h1>

        <form onSubmit={handleSubmit} className="reopen-form">
          <div className="form-group">
            <label htmlFor="assignment">Select Assignment</label>
            <select
              id="assignment"
              value={selectedAssignment}
              onChange={(e) => setSelectedAssignment(e.target.value)}
              required
            >
              <option value="">Choose an assignment</option>
              {assignments.map(assignment => (
                <option key={assignment.id} value={assignment.id}>
                  {assignment.title} - Due: {assignment.dueDate}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="newDueDate">New Due Date</label>
            <input
              type="datetime-local"
              id="newDueDate"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason for Reopening</label>
            <textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason for reopening the assignment"
              required
              rows="3"
            />
          </div>

          <div className="reopen-options">
            <div className="reopen-all-container">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={reopenForAll}
                  onChange={handleReopenForAllChange}
                />
                Reopen for All Students
              </label>
            </div>
          </div>

          {!reopenForAll && (
            <div className="student-selection-section">
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search students by name or roll number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="students-list">
                {filteredStudents.map(student => (
                  <div
                    key={student.id}
                    className={`student-card ${selectedStudents.includes(student.id) ? 'selected' : ''}`}
                    onClick={() => handleStudentSelect(student.id)}
                  >
                    <div className="student-info">
                      <h3>{student.name}</h3>
                      <p>Roll No: {student.rollNo}</p>
                    </div>
                    <div className="student-status">
                      <span className={`status-badge ${student.status.toLowerCase().replace(' ', '-')}`}>
                        {student.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Reopen Assignment
            </button>
            <button type="button" className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReopenAssignment;