import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { dateUtils } from '../../utils/dateUtils';
import hostURL from '../../data/URL';
import { getToken, deleteToken } from '../../data/Token';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import './StudentSubmissionView.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const StudentSubmissionView = () => {
  // State declarations
  const [submissions, setSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    class: 'all',
    batch: 'all',
    status: 'all',
    studentName: ''
  });
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: []
  });
  const [chartOptions, setChartOptions] = useState({});

  // New state for charts
  const [chartConfig, setChartConfig] = useState({
    numBins: 5,
    showLegend: true,
    chartType: 'bar', // 'bar' or 'pie'
    groupBy: 'batch', // 'batch' or 'class'
    scoreType: 'total', // 'total', 'scenario1', 'scenario2', 'scenario3'
  });

  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    deleteToken("token");
    navigate('/');
  };

  const retryFetch = async (url, options, maxRetries = 3) => {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, options);
        return response;
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))); // Exponential backoff
      }
    }
  };

  // Fetch submissions from backend
  const fetchSubmissions = React.useCallback(async (batchFilter) => {
    try {
      const token = getToken("token");
      if (!token) {
        navigate('/login');
        throw new Error("Authentication required");
      }

      const response = await retryFetch(
        `${hostURL.link}/app/teacher/response-Teacher/fetch-batch-responses?batch=${
          batchFilter === 'all' ? 'A1' : batchFilter
        }`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Server error");
      }

      const { responses } = await response.json();
      // Transform responses into required format
      const transformedSubmissions = responses.map(response => ({
        id: response._id,
        studentName: response.student_id?.name || 'Unknown Student',
        studentId: response.student_id?._id || 'Unknown ID',
        class: response.student_id?.class || 'Unknown Class',
        batch: response.student_id?.batch || 'Unknown Batch',
        email: response.student_id?.email || 'No Email',
        submissionDate: response.submitted_at || response.created_at || 'No Date',
        assignmentName: response.assignment_id?.assignment_name || 'Unknown Assignment',
        questionTitle: response.question_id?.question_text || 'Unknown Question',
        response_text: response.response_text || 'No Code Submitted',
        status: response.status || 'unknown',
        time_taken: response.time_taken || 0,
        submitted_at: response.submitted_at || 'Not submitted',
        created_at: response.created_at || 'Unknown',
        updated_at: response.updated_at || 'Unknown',
        marks_obtained: response.marks_obtained || 0,
        marks: response.marks || {
          scenario1Marks: '0.00',
          scenario2Marks: '0.00',
          scenario3Marks: '0.00'
        },
        testResults: {
          passedTests: response.test_results?.passedTests || 0,
          totalTests: response.test_results?.totalTests || 0,
          allResults: response.test_results?.allResults?.map(result => ({
            ...result,
            isSuccess: result.status === "Accepted"
          })) || []
        }
      }));

      setSubmissions(transformedSubmissions);
      setFilteredSubmissions(transformedSubmissions);
      setError(null);
    } catch (error) {
      console.error("Error fetching submissions:", error.message);
      setError(error.message === "Failed to fetch" ? "Network connection error. Please check your internet connection." : error.message);
      setSubmissions([]);
      setFilteredSubmissions([]);
      if (error.message.includes("Authentication")) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchSubmissions(filters.batch);
  }, [fetchSubmissions, filters.batch]);

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

  // Chart data processing functions
  const processChartData = () => {
    if (!filteredSubmissions.length) return null;

    const groupField = chartConfig.groupBy;
    const groups = {};
    
    filteredSubmissions.forEach(submission => {
      const groupKey = submission[groupField] || 'Unknown';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      let score;
      switch (chartConfig.scoreType) {
        case 'scenario1':
          score = parseFloat(submission.marks?.scenario1Marks || '0');
          break;
        case 'scenario2':
          score = parseFloat(submission.marks?.scenario2Marks || '0');
          break;
        case 'scenario3':
          score = parseFloat(submission.marks?.scenario3Marks || '0');
          break;
        default:
          score = submission.marks_obtained || 0;
      }
      
      if (!isNaN(score)) {
        groups[groupKey].push(score);
      }
    });

    // Calculate statistics for each group
    const labels = Object.keys(groups).sort();
    const data = labels.map(label => {
      const scores = groups[label];
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      return avg.toFixed(2);
    });

    return {
      labels,
      datasets: [{
        label: `Average ${chartConfig.scoreType} Score by ${chartConfig.groupBy}`,
        data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      }],
    };
  };

  const processHistogramData = (scores, numBins) => {
    if (!scores.length) return { bins: [], labels: [] };
    
    // Always use 0-10 range for scores since that's our score scale
    const min = 0;
    const max = 10;
    const binWidth = (max - min) / numBins;
    
    const bins = Array(numBins).fill(0);
    const labels = [];
    
    for (let i = 0; i < numBins; i++) {
      const binStart = min + (i * binWidth);
      const binEnd = binStart + binWidth;
      labels.push(`${binStart.toFixed(1)}-${binEnd.toFixed(1)}`);
      
      scores.forEach(score => {
        if (score >= binStart && (score < binEnd || (i === numBins - 1 && score <= binEnd))) {
          bins[i]++;
        }
      });
    }
    
    return { bins, labels };
  };

  const getChartData = () => {
    if (!filteredSubmissions.length) return null;

    const groupField = chartConfig.groupBy;
    const groups = {};
    
    // Group submissions by batch or class
    filteredSubmissions.forEach(submission => {
      const groupKey = submission[groupField] || 'Unknown';
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      
      let score = 0;
      switch (chartConfig.scoreType) {
        case 'scenario1':
          score = parseFloat(submission.marks?.scenario1Marks || '0');
          break;
        case 'scenario2':
          score = parseFloat(submission.marks?.scenario2Marks || '0');
          break;
        case 'scenario3':
          score = parseFloat(submission.marks?.scenario3Marks || '0');
          break;
        default:
          score = submission.marks_obtained || 0;
      }
      
      if (!isNaN(score)) {
        groups[groupKey].push(score);
      }
    });

    // Process data based on chart type
    if (chartConfig.chartType === 'bar') {
      const labels = Object.keys(groups).sort();
      const data = labels.map(label => {
        const scores = groups[label];
        const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
        return avg.toFixed(2);
      });

      return {
        labels,
        datasets: [{
          label: `Average ${chartConfig.scoreType} Score by ${chartConfig.groupBy}`,
          data,
          backgroundColor: 'rgba(54, 162, 235, 0.5)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        }]
      };
    } else {
      // For pie chart, use distribution of scores in bins
      const allScores = filteredSubmissions.map(sub => {
        let score;
        switch (chartConfig.scoreType) {
          case 'scenario1':
            score = parseFloat(sub.marks?.scenario1Marks || '0');
            break;
          case 'scenario2':
            score = parseFloat(sub.marks?.scenario2Marks || '0');
            break;
          case 'scenario3':
            score = parseFloat(sub.marks?.scenario3Marks || '0');
            break;
          default:
            score = sub.marks_obtained || 0;
        }
        return !isNaN(score) ? score : 0;
      }).filter(score => score !== null);

      const { bins, labels } = processHistogramData(allScores, chartConfig.numBins);

      return {
        labels,
        datasets: [{
          data: bins,
          backgroundColor: [
            'rgba(255, 99, 132, 0.5)',
            'rgba(54, 162, 235, 0.5)',
            'rgba(255, 206, 86, 0.5)',
            'rgba(75, 192, 192, 0.5)',
            'rgba(153, 102, 255, 0.5)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
          borderWidth: 1,
        }]
      };
    }
  };

  const getChartOptions = () => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: chartConfig.showLegend,
        position: 'top',
      },
      title: {
        display: true,
        text: chartConfig.chartType === 'bar' 
          ? `Average ${chartConfig.scoreType} Scores by ${chartConfig.groupBy}`
          : `Score Distribution (${chartConfig.scoreType})`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            if (chartConfig.chartType === 'pie') {
              return `Count: ${context.raw} submissions`;
            }
            const score = parseFloat(context.raw);
            const groupName = context.label;
            const scoreType = chartConfig.scoreType === 'total' ? 'Total' : `Scenario ${chartConfig.scoreType.slice(-1)}`;
            return `${groupName}: ${score.toFixed(2)}/10 (${scoreType})`;
          }
        }
      }
    },
    scales: chartConfig.chartType === 'bar' ? {
      y: {
        beginAtZero: true,
        max: 10, // Set max to 10 since that's our score scale
        title: {
          display: true,
          text: 'Average Score (0-10)'
        },
        ticks: {
          stepSize: 1
        }
      },
      x: {
        title: {
          display: true,
          text: chartConfig.groupBy === 'batch' ? 'Batch' : 'Class'
        }
      }
    } : undefined
  });

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

  const renderSubmissionDetails = (submission) => {
    return (
      <div className="submission-detail-content">
        <div className="detail-header">
          <h2>{submission.questionTitle}</h2>
          <div className="status-info">
            <span className={`status-badge ${submission.status}`}>
              {submission.status}
            </span>
            <span className="execution-time">
              Execution Time: {submission.time_taken}s
            </span>
          </div>
        </div>

        <div className="assignment-info">
          <h3>Assignment Details</h3>
          <p><strong>Assignment Name:</strong> {submission.assignmentName}</p>
          <p><strong>Question:</strong> {submission.questionTitle}</p>
        </div>

        <div className="student-info">
          <h3>Student Information</h3>
          <p><strong>Name:</strong> {submission.studentName}</p>
          <p><strong>Email:</strong> {submission.email}</p>
          <p><strong>Class:</strong> {submission.class}</p>
          <p><strong>Batch:</strong> {submission.batch}</p>
        </div>

        <div className="test-results">
          <h3>Test Results</h3>
          <div className="test-summary">
            <div className="test-summary-card">
              <strong>Passed Tests</strong>
              <span>{submission.testResults.passedTests} / {submission.testResults.totalTests}</span>
            </div>
            <div className="test-summary-card score">
              <strong>Auto Grade</strong>
              <span>{submission.marks_obtained.toFixed(2)}/10</span>
            </div>
            <div className="test-summary-card">
              <strong>Time Taken</strong>
              <span>{submission.time_taken}s</span>
            </div>
          </div>
          
          <div className="marks-breakdown">
            <h4>Marks Breakdown</h4>
            <div className="scenario-grid">
              <div className="scenario-card">
                <strong>Scenario 1</strong>
                <span>{submission.marks.scenario1Marks}</span>
              </div>
              <div className="scenario-card">
                <strong>Scenario 2</strong>
                <span>{submission.marks.scenario2Marks}</span>
              </div>
              <div className="scenario-card">
                <strong>Scenario 3</strong>
                <span>{submission.marks.scenario3Marks}</span>
              </div>
            </div>
          </div>

          <div className="detailed-results">
            <h4>Test Case Details</h4>
            {submission.testResults.allResults.map((result, index) => (
              <div key={index} className={`test-case ${result.isSuccess ? 'passed' : 'failed'}`}>
                <p><strong>Test Case {index + 1}:</strong> {result.status}</p>
                <p><strong>Input:</strong> <span>{result.input}</span></p>
                <p><strong>Expected Output:</strong> <span>{result.expectedOutput}</span></p>
                <p><strong>Actual Output:</strong> <span>{result.output}</span></p>
                {result.message && <p><strong>Message:</strong> <span>{result.message}</span></p>}
              </div>
            ))}
          </div>
        </div>

        <div className="code-section">
          <h3>Submitted Code</h3>
          <pre className="code-block">
            <code>{submission.response_text}</code>
          </pre>
        </div>

        <div className="submission-timestamps">
          <h3>Submission Timeline</h3>
          <p><strong>Submitted At:</strong> {submission.submitted_at}</p>
          <p><strong>Created At:</strong> {submission.created_at}</p>
          <p><strong>Last Updated:</strong> {submission.updated_at}</p>
        </div>
      </div>
    );
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

  const processedChartData = processChartData();

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
                  <option value="FE">FE</option>
                  <option value="SE">SE</option>
                  <option value="TE">TE</option>
                  <option value="BE">BE</option>
                </select>
              </div>

              <div className="filter-group">
                <label htmlFor="batchSelect">Batch:</label>
                <select 
                  id="batchSelect"
                  value={filters.batch} 
                  onChange={(e) => handleFilterChange('batch', e.target.value)}
                >
                  <option value="all">All Batches</option>
                  {['A1', 'A2', 'B1', 'B2'].map(batch => (
                    <option key={batch} value={batch}>{batch}</option>
                  ))}
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
                  <option value="submitted">Submitted</option>
                  <option value="reopened">Reopened</option>
                  <option value="resubmitted">Resubmitted</option>
                  <option value="graded">Graded</option>
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

        <div className="stats-and-analytics">
          <div className="chart-controls">
            <div className="chart-options">
              <div className="control-group">
                <label htmlFor="chartType">Chart Type:</label>
                <select
                  id="chartType"
                  value={chartConfig.chartType}
                  onChange={(e) => setChartConfig(prev => ({ ...prev, chartType: e.target.value }))}
                >
                  <option value="bar">Bar Chart</option>
                  <option value="pie">Pie Chart</option>
                </select>
              </div>

              <div className="control-group">
                <label htmlFor="groupBy">Group By:</label>
                <select
                  id="groupBy"
                  value={chartConfig.groupBy}
                  onChange={(e) => setChartConfig(prev => ({ ...prev, groupBy: e.target.value }))}
                >
                  <option value="batch">Batch</option>
                  <option value="class">Class</option>
                </select>
              </div>

              <div className="control-group">
                <label htmlFor="scoreType">Score Type:</label>
                <select
                  id="scoreType"
                  value={chartConfig.scoreType}
                  onChange={(e) => setChartConfig(prev => ({ ...prev, scoreType: e.target.value }))}
                >
                  <option value="total">Total Score</option>
                  <option value="scenario1">Scenario 1</option>
                  <option value="scenario2">Scenario 2</option>
                  <option value="scenario3">Scenario 3</option>
                </select>
              </div>

              {chartConfig.chartType === 'pie' && (
                <div className="control-group">
                  <label htmlFor="numBins">Number of Bins:</label>
                  <select
                    id="numBins"
                    value={chartConfig.numBins}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, numBins: parseInt(e.target.value) }))}
                  >
                    <option value="3">3</option>
                    <option value="5">5</option>
                    <option value="7">7</option>
                    <option value="10">10</option>
                  </select>
                </div>
              )}

              <div className="control-group">
                <label>
                  <input
                    type="checkbox"
                    checked={chartConfig.showLegend}
                    onChange={(e) => setChartConfig(prev => ({ ...prev, showLegend: e.target.checked }))}
                  />
                  Show Legend
                </label>
              </div>
            </div>

            <div className="chart-container">
              {filteredSubmissions.length > 0 ? (
                chartConfig.chartType === 'bar' ? (
                  <Bar data={getChartData()} options={getChartOptions()} />
                ) : (
                  <Pie data={getChartData()} options={getChartOptions()} />
                )
              ) : (
                <p className="no-data">No data available for visualization</p>
              )}
            </div>
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
                    <p><strong>Auto Grade:</strong> {submission.autoGrade}/10</p>
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
            {selectedSubmission ? renderSubmissionDetails(selectedSubmission) : (
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