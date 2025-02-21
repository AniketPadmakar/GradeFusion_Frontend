// CreateAssignment.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import './CreateAssignment.css';

const CreateAssignment = () => {
  const [formData, setFormData] = useState({
    subject: '',
    class: '',
    batch: '',
    title: '',
    description: '',
    dueDate: '',
    maxMarks: '',
    selectedQuestions: [],
    attachments: []
  });

  // Hardcoded questions data (replace with API fetch later)
  const availableQuestions = [
    { id: 1, title: "Write a program to implement bubble sort" },
    { id: 2, title: "Create a function to check if a number is prime" },
    { id: 3, title: "Implement a simple calculator using functions" },
    { id: 4, title: "Write a program to find factorial of a number" },
    { id: 5, title: "Create a program to check if a string is palindrome" }
  ];

  const subjects = ['C', 'Python', 'Java'];
  const classes = ['First Year', 'Second Year', 'Third Year'];
  const batches = ['A1', 'A2', 'B1', 'B2'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuestionSelect = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => ({
      id: parseInt(option.value),
      title: option.text
    }));
    setFormData(prev => ({
      ...prev,
      selectedQuestions: selectedOptions
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({
      ...prev,
      attachments: [...e.target.files]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Add your submission logic here
  };

  return (
    <div className="page-wrapper">
      <nav className="navbar">
        <div className="nav-content">
          <div className="logo">GradeFusion</div>
          <div className="nav-links">
            <Link to="/" className="nav-link active">Home</Link>
            <Link to="/about" className="nav-link">About</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
            <Link to="/signup" className="nav-link signup-btn">Sign Up</Link>
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
              {subjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
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
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
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
                {batches.map(batch => (
                  <option key={batch} value={batch}>{batch}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="questions">Select Questions</label>
            <select 
              id="questions" 
              multiple 
              onChange={handleQuestionSelect}
              className="questions-select"
              required
            >
              {availableQuestions.map(question => (
                <option key={question.id} value={question.id}>
                  {question.title}
                </option>
              ))}
            </select>
            {formData.selectedQuestions.length > 0 && (
              <div className="selected-questions">
                <p>Selected Questions:</p>
                <ul>
                  {formData.selectedQuestions.map(q => (
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
              <label htmlFor="dueDate">Due Date</label>
              <input
                type="datetime-local"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
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