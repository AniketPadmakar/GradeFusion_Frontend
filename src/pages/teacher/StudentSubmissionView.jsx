import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dateUtils } from '../../utils/dateUtils';
import './StudentSubmissionView.css';
import { useNavigate } from "react-router-dom";
import { getToken,deleteToken } from "../../data/Token";


const StudentSubmissionView = () => {
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    class: 'all',
    batch: 'all',
    status: 'all',
    studentName: ''
  });

  const navigate = useNavigate();// Add this function to handle logout
  const handleLogout = () => {
   // Delete the token from cookies
   deleteToken("token");
   // Redirect to home page
   navigate('/');
};


  // Simulated data - Replace with actual API call
  useEffect(() => {
    setTimeout(() => {
      const mockSubmissions = [
        {
          id: 1,
          studentName: "John Doe",
          studentId: "ST001",
          class: "CS-101",
          batch: "1",
          submissionDate: "2025-02-18T10:30:00",
          questionTitle: "Array Implementation",
          codeSubmitted: `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr`,
          status: "evaluated",
          executionTime: "0.5s",
          testCasesPassed: "8/10",
          autoGrade: "80"
        },
        {
          id: 2,
          studentName: "Jane Smith",
          studentId: "ST002",
          class: "CS-102",
          batch: "2",
          submissionDate: "2025-02-18T11:30:00",
          questionTitle: "Linked List Implementation",
          codeSubmitted: `class Node:
    def __init__(self, data):
        self.data = data
        self.next = None`,
          status: "evaluated",
          executionTime: "0.3s",
          testCasesPassed: "10/10",
          autoGrade: "95"
        }
      ];
      setSubmissions(mockSubmissions);
      setFilteredSubmissions(mockSubmissions);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter submissions based on selected filters
  useEffect(() => {
    let result = [...submissions];

    if (filters.class !== 'all') {
      result = result.filter(sub => sub.class === filters.class);
    }

    if (filters.batch !== 'all') {
      result = result.filter(sub => sub.batch === filters.batch);
    }

    if (filters.status !== 'all') {
      result = result.filter(sub => sub.status === filters.status);
    }

    if (filters.studentName.trim()) {
      result = result.filter(sub => 
        sub.studentName.toLowerCase().includes(filters.studentName.toLowerCase()) ||
        sub.studentId.toLowerCase().includes(filters.studentName.toLowerCase())
      );
    }

    setFilteredSubmissions(result);
  }, [filters, submissions]);

  const handleSubmissionClick = (submission) => {
    setSelectedSubmission(submission);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      class: 'all',
      batch: 'all',
      status: 'all',
      studentName: ''
    });
  };

  if (loading) {
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
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading submissions...</p>
        </div>
      </>
    );
  }

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
      
      <div className="submissions-container">
        <div className="filters-section">
          <div className="search-filters">
            <div className="primary-filters">
              <div className="filter-group">
                <label htmlFor="classSelect">Class:</label>
                <select 
                  id="classSelect"
                  value={filters.class} 
                  onChange={(e) => handleFilterChange('class', e.target.value)}
                >
                  <option value="all">All Classes</option>
                  <option value="CS-101">FE</option>
                  <option value="CS-102">SE</option>
                  <option value="CS-103">TE</option>
                  <option value="CS-104">BE</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="batchSelect">Batch:</label>
                <select 
                  id="batchSelect"
                  value={filters.batch} 
                  onChange={(e) => handleFilterChange('batch', e.target.value)}
                  disabled={filters.class === 'all'}
                >
                  <option value="all">All Batches</option>
                  <option value="1">Batch 1</option>
                  <option value="2">Batch 2</option>
                  <option value="3">Batch 3</option>
                  <option value="4">Batch 4</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="statusSelect">Status:</label>
                <select 
                  id="statusSelect"
                  value={filters.status} 
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="evaluated">Evaluated</option>
                </select>
              </div>
            </div>

            <div className="search-group">
              <input
                type="text"
                placeholder="Search by student name or ID..."
                value={filters.studentName}
                onChange={(e) => handleFilterChange('studentName', e.target.value)}
                className="search-input"
              />
              <button onClick={clearFilters} className="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          </div>

          <div className="results-summary">
            <p>Showing {filteredSubmissions.length} submissions</p>
          </div>
        </div>

        <div className="submissions-grid">
          <div className="submissions-list">
            {filteredSubmissions.length > 0 ? (
              filteredSubmissions.map((submission) => (
                <div 
                  key={submission.id}
                  className={`submission-card ${selectedSubmission?.id === submission.id ? 'selected' : ''}`}
                  onClick={() => handleSubmissionClick(submission)}
                >
                  <div className="submission-header">
                    <h3>{submission.studentName}</h3>
                    <span className={`status-badge ${submission.status}`}>
                      {submission.status}
                    </span>
                  </div>
                  <div className="submission-details">
                    <p><strong>Student ID:</strong> {submission.studentId}</p>
                    <p><strong>Class:</strong> {submission.class}</p>
                    <p><strong>Batch:</strong> {submission.batch}</p>
                    <p><strong>Submitted:</strong> {dateUtils.formatForDisplay(submission.submissionDate)}</p>
                    <p><strong>Auto Grade:</strong> {submission.autoGrade}/100</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-results">
                <p>No submissions match your search criteria</p>
                <button onClick={clearFilters} className="clear-filters-btn">
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          <div className="submission-details-panel">
            {selectedSubmission ? (
              <div className="details-content">
                <h2>Submission Details</h2>
                <div className="student-info">
                  <h3>Student Information</h3>
                  <p><strong>Name:</strong> {selectedSubmission.studentName}</p>
                  <p><strong>ID:</strong> {selectedSubmission.studentId}</p>
                  <p><strong>Class:</strong> {selectedSubmission.class}</p>
                  <p><strong>Batch:</strong> {selectedSubmission.batch}</p>
                </div>

                <div className="submission-info">
                  <h3>Question Details</h3>
                  <p><strong>Title:</strong> {selectedSubmission.questionTitle}</p>
                  <p><strong>Submitted:</strong> {new Date(selectedSubmission.submissionDate).toLocaleString()}</p>
                  <p><strong>Execution Time:</strong> {selectedSubmission.executionTime}</p>
                  <p><strong>Test Cases:</strong> {selectedSubmission.testCasesPassed}</p>
                  <p><strong>Auto Grade:</strong> {selectedSubmission.autoGrade}/100</p>
                </div>

                <div className="code-preview">
                  <h3>Code Submission</h3>
                  <pre>{selectedSubmission.codeSubmitted}</pre>
                </div>
              </div>
            ) : (
              <div className="no-submission-selected">
                <p>Select a submission to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentSubmissionView;