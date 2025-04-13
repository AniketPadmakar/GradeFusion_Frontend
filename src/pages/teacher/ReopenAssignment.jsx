import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';
import { getToken,deleteToken } from "../../data/Token";
import { dateUtils } from '../../utils/dateUtils';
import hostURL from "../../data/URL";
import './ReopenAssignment.css'; 

const ReopenAssignment = () => {
  const [selectedAssignment, setSelectedAssignment] = useState("");
  const [assignments, setAssignments] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [reopenForAll, setReopenForAll] = useState(false);
  const [newDueDate, setNewDueDate] = useState("");
  const [reason, setReason] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Add this function to handle logout
       const handleLogout = () => {
          // Delete the token from cookies
          deleteToken("token");
          // Redirect to home page
          navigate('/');
      };

  const getISTDateTime = () => {
    let now = new Date();
    let istOffset = 5.5 * 60 * 60 * 1000;
    let istTime = new Date(now.getTime() + istOffset);
    return istTime.toISOString().slice(0, 16);
  };

  const fetchAssignments = async () => {
    setIsFetching(true);
    setError("");

    const token = getToken("token");
    if (!token) {
      setError("Authentication failed. Please log in again.");
      setIsFetching(false);
      return;
    }

    try {
      const response = await fetch(
        `${hostURL.link}/app/teacher/fetch-assignments`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch assignments");
      }

      const data = await response.json();

      setAssignments(
        data.assignments.map((assignment) => ({
          id: assignment._id,
          name: assignment.assignment_name,
          students: assignment.student_ids.map(student => ({
            id: student._id,
            firstName: student.firstName,
            lastName: student.lastName,
            batchNo: student.batch,
            class: student.class
          }))
        }))
      );
    } catch (err) {
      setError("Error fetching assignments: " + err.message);
    } finally {
      setIsFetching(false);
    }
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudents((prev) => {
      if (prev.includes(studentId)) {
        return prev.filter((id) => id !== studentId);
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

  const filteredStudents = selectedAssignment
    ? assignments
        .find((a) => a.id === selectedAssignment)
        ?.students?.filter((student) =>
          `${student.firstName} ${student.lastName} ${student.batchNo} ${student.class}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        ) || []
    : [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = getToken("token");
  
    if (!token) {
      setError("Authentication failed. Please log in again.");
      return;
    }
  
    if (!reopenForAll && selectedStudents.length === 0) {
      setError("Please select at least one student or choose 'Reopen for All'");
      return;
    }
  
    setIsLoading(true);
    try {
      if (!reopenForAll) {
        for (const studentId of selectedStudents) {
          await axios.post(
            `${hostURL.link}/app/teacher/reopen-assignments/${selectedAssignment}`,
            {
              studentId: studentId,
              reopenForAll: false,
              newDueDate: newDueDate,
              reason: reason,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );
        }
        setSuccessMessage(`Assignment reopened for ${selectedStudents.length} selected student${selectedStudents.length > 1 ? 's' : ''}`);
      } else {
        await axios.post(
          `${hostURL.link}/app/teacher/reopen-assignments/${selectedAssignment}`,
          {
            reopenForAll: true,
            newDueDate: newDueDate,
            reason: reason,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setSuccessMessage("Assignment reopened for all students");
      }
  
      setShowSuccessModal(true);
      
      setSelectedAssignment("");
      setSelectedStudents([]);
      setReopenForAll(false);
      setNewDueDate("");
      setReason("");
      setError("");
    } catch (error) {
      console.error("Error details:", error.response?.data);
      setError(error.response?.data?.message || "Failed to reopen assignment");
    } finally {
      setIsLoading(false);
    }
  };

  const SuccessModal = ({ message, onClose }) => (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <div className="success-icon">✓</div>
          <h2 className="modal-title">Success!</h2>
        </div>
        <p className="modal-message">{message}</p>
        <button className="modal-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );

  const token = getToken("token");
  if (!token) {
    return <div className="error-message">Please log in to continue</div>;
  }

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">GradeFusion</div>
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <button className="nav-link signup-btn" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </nav>

      <div className="reopen-container">
        <h1 className="page-title">Reopen Assignment</h1>
        
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="reopen-form">
          <div className="form-group">
            <div className="assignment-select-container">
              <div className="select-wrapper">
                <label htmlFor="assignment">Select Assignment</label>
                <select
                  id="assignment"
                  value={selectedAssignment}
                  onChange={(e) => setSelectedAssignment(e.target.value)}
                  required
                  className="assignment-select"
                >
                  <option value="">Choose an assignment</option>
                  {assignments.map((assignment) => (
                    <option key={assignment.id} value={assignment.id}>
                      {assignment.name}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={fetchAssignments}
                disabled={isFetching}
                className="fetch-btn"
              >
                {isFetching ? "Fetching..." : "Fetch Assignments"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newDueDate">New Due Date</label>
            <input
              type="datetime-local"
              id="newDueDate"
              value={newDueDate}
              min={getISTDateTime()}
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

          {!reopenForAll && selectedAssignment && (
            <div className="student-selection-section">
              <h3>Select Students</h3>
              <div className="search-container">
                <input
                  type="text"
                  placeholder="Search students by name, batch, or class..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="students-list">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="student-card">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={() => handleStudentSelect(student.id)}
                      />
                      <span>{student.firstName} {student.lastName}</span>
                      <span className="student-details">
                        Class: {student.class} | Batch: {student.batchNo}
                      </span>
                    </label>
                  </div>
                ))}
                {filteredStudents.length === 0 && (
                  <div className="no-students-message">
                    No students found matching your search criteria
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="form-actions">
            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Reopening..." : "Reopen Assignment"}
            </button>
            <button type="button" className="cancel-btn" disabled={isLoading}>
              Cancel
            </button>
          </div>
        </form>
      </div>

      {showSuccessModal && (
        <SuccessModal
          message={successMessage}
          onClose={() => setShowSuccessModal(false)}
        />
      )}
    </div>
  );
};

export default ReopenAssignment;