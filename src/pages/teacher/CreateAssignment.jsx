// CreateAssignment.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { getToken,deleteToken } from "../../data/Token";
import hostURL from "../../data/URL";
import "./CreateAssignment.css";

const CreateAssignment = () => {
  const [formData, setFormData] = useState({
    subject: "",
    class: "",
    batch: "",
    title: "",
    description: "",
    startDate: "",
    dueDate: "",
    maxMarks: "",
    selectedQuestions: [],
    attachments: [],
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
    let now = new Date();
    let istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
    let istTime = new Date(now.getTime() + istOffset);
    
    return istTime.toISOString().slice(0, 16); // Returns yyyy-MM-ddTHH:mm
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
 

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      attachments: [...e.target.files],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = getToken("token");
    if (!token) {
      alert("Authentication failed. Please log in again.");
      return;
    }

    // Convert the dates to formatted strings
    const startDate = new Date(formData.startDate);
    const dueDate = new Date(formData.dueDate);
    const formattedStartDate = startDate.toLocaleDateString("en-GB") + " :: " + startDate.toLocaleTimeString("en-GB");
    const formattedDueDate = dueDate.toLocaleDateString("en-GB") + " :: " + dueDate.toLocaleTimeString("en-GB");

    // Transform the data to match backend expectations
    const submissionData = {
      assignment_name: formData.title,
      questions: formData.selectedQuestions.map((q) => q.id),
      class_name: formData.class,
      batch: formData.batch,
      start_at: formattedStartDate,
      due_at: formattedDueDate,
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
                <div key={question.id} className="question-item">
                  <input
                    type="checkbox"
                    id={`question-${question.id}`}
                    value={question.id}
                    data-title={question.title}
                    checked={formData.selectedQuestions.some((q) => q.id === question.id)}
                    onChange={handleQuestionSelect}
                  />
                  <label htmlFor={`question-${question.id}`}>{question.title}</label>
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

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Enter assignment description"
              rows="4"
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

          <div className="form-group">
            <label htmlFor="attachments">Attachments</label>
            <div className="file-input-container">
              <input
                type="file"
                id="attachments"
                name="attachments"
                onChange={handleFileChange}
                multiple
                className="file-input"
              />
              <label htmlFor="attachments" className="file-input-label">
                Choose Files
              </label>
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
