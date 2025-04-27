// CreateAssignment.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getToken,deleteToken } from "../../data/Token";
import hostURL from "../../data/URL";
import { dateUtils } from "../../utils/dateUtils";
import "./CreateAssignment.css";

const CreateAssignment = () => {
  const [formData, setFormData] = useState({
    subject: "",
    class: "",
    batch: "",
    title: "",
    startDate: "",
    dueDate: "",
    maxMarks: "",
    selectedQuestions: []
  });

  const navigate = useNavigate();

  // Add this function to handle logout
  const handleLogout = () => {
    // Delete the token from cookies
    deleteToken("token");
    // Redirect to home page
    navigate('/');
};


  const getISTDateTime = () => {
    return dateUtils.toInputFormat(dateUtils.getCurrentDate());
  };

   
  

  // Replace the hardcoded availableQuestions with state
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const subjects = ["C", "Python", "Java"];
  const classes = ["FE", "SE", "TE", "BE"];
  const batches = ["A1", "A2", "B1", "B2"];

  const fetchQuestions = async () => {
    setIsLoading(true);
    setError("");

    const token = getToken("token");
    if (!token) {
      setError("Authentication failed. Please log in again.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${hostURL.link}/app/teacher/fetch-questions`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch questions");
      }

      const data = await response.json();
      setAvailableQuestions(
        data.questions.map((q) => ({
          id: q._id,
          title: q.title || q.question_text, // Adjust based on your question model
        }))
      );
    } catch (err) {
      setError("Error fetching questions: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleQuestionSelect = (e) => {
    const { value, checked } = e.target;
  
    setFormData((prev) => ({
      ...prev,
      selectedQuestions: checked
        ? [...prev.selectedQuestions, { id: value, title: e.target.dataset.title }]
        : prev.selectedQuestions.filter((q) => q.id !== value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken("token");
    if (!token) {
      alert("Authentication failed. Please log in again.");
      return;
    }

    // Convert and validate the dates using our standard format
    const standardizedStartDate = dateUtils.formatToStandard(formData.startDate);
    const standardizedDueDate = dateUtils.formatToStandard(formData.dueDate);

    if (!dateUtils.isValidDate(standardizedStartDate) || !dateUtils.isValidDate(standardizedDueDate)) {
      alert("Invalid date format. Please check the dates.");
      return;
    }

    // Transform the data to match backend expectations
    const submissionData = {
      assignment_name: formData.title,
      questions: formData.selectedQuestions.map((q) => q.id),
      class_name: formData.class,
      batch: formData.batch,
      start_at: standardizedStartDate,
      due_at: standardizedDueDate,
      marks: parseInt(formData.maxMarks),
    };

    try {
      const response = await fetch(
        `${hostURL.link}/app/teacher/create-assignments`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create assignment");
      }

      const data = await response.json();
      alert("Assignment created successfully!");
      console.log("Server Response:", data);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Error submitting assignment. Please try again.");
    }
  };

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">GradeFusion</div>
          <div className="nav-links">
            <Link to="/" className="nav-link active">
              Home
            </Link>
            <Link to="/about" className="nav-link">
              About
            </Link>
            <Link to="/contact" className="nav-link">
              Contact
            </Link>
            <button className="nav-link signup-btn" onClick={handleLogout}>Log out</button>
          </div>
        </div>
      </nav>

      <div className="assignment-container">
        <h1 className="page-title">Create New Assignment</h1>

        <form onSubmit={handleSubmit} className="assignment-form">
          <div className="form-group">
            <label htmlFor="subject">Subject</label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="class">Class</label>
              <select
                id="class"
                name="class"
                value={formData.class}
                onChange={handleChange}
                required
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="batch">Batch</label>
              <select
                id="batch"
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                required
              >
                <option value="">Select Batch</option>
                {batches.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="questions">Select Questions</label>
            <button
              type="button"
              onClick={fetchQuestions}
              className="fetch-questions-btn"
              disabled={isLoading}
            >
              {isLoading
                ? "Fetching Questions..."
                : "Fetch Available Questions"}
            </button>

            {error && <div className="error-message">{error}</div>}

            {availableQuestions.length > 0 && (
              <div className="questions-list">
                {availableQuestions.map((question) => (
                  <div key={question.id} className="question-item modern-checkbox">
                    <label htmlFor={`question-${question.id}`} className="checkbox-label">
                      <input
                        type="checkbox"
                        id={`question-${question.id}`}
                        value={question.id}
                        data-title={question.title}
                        checked={formData.selectedQuestions.some((q) => q.id === question.id)}
                        onChange={handleQuestionSelect}
                      />
                      <span className="custom-checkbox"></span>
                      {question.title}
                    </label>
                  </div>
                ))}
              </div>  
            )}

            {formData.selectedQuestions.length > 0 && (
              <div className="selected-questions">
                <p>Selected Questions:</p>
                <ul>
                  {formData.selectedQuestions.map((q) => (
                    <li key={q.id}>{q.title}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="title">Assignment Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter assignment title"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="datetime-local"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                step="1" // <-- Add this line to allow seconds precision
                min={getISTDateTime()} // Restrict to future date & time in IST
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                 step="1"
                min={getISTDateTime()} // Restrict to future date & time in IST
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="maxMarks">Maximum Marks</label>
              <input
                type="number"
                id="maxMarks"
                name="maxMarks"
                value={formData.maxMarks}
                onChange={handleChange}
                required
                placeholder="Enter max marks"
                min="0"
              />
            </div>
          </div>

          <button type="submit" className="submit-btn">
            Create Assignment
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAssignment;
