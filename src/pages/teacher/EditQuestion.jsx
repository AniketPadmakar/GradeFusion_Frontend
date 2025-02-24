import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditQuestion.css';

const EditQuestion = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const [question, setQuestion] = useState({
        title: '',
        difficulty: 'Easy',
        category: '',
        description: '',
        sampleInput: '',
        sampleOutput: '',
        constraints: ''
    });

    // Simulating fetching question data - replace with actual API call
    useEffect(() => {
        // Mock data - replace with your actual data fetching logic
        const mockQuestion = {
            title: "Two Sum Problem",
            difficulty: "Easy",
            category: "Arrays",
            description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
            sampleInput: "[2,7,11,15], target = 9",
            sampleOutput: "[0,1]",
            constraints: "2 <= nums.length <= 104\n-109 <= nums[i] <= 109\n-109 <= target <= 109"
        };
        setQuestion(mockQuestion);
    }, [id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setQuestion(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add your update logic here
        console.log('Updated question:', question);
        navigate('/ViewQuestions');
    };

    return (
        <div className="edit-container">
            <div className="edit-content">
                <header className="edit-header">
                    <h1>Edit Question</h1>
                    <button className="back-button" onClick={() => navigate('/ViewQuestions')}>
                        Back to Questions
                    </button>
                </header>

                <form className="edit-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="title">Question Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={question.title}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="difficulty">Difficulty</label>
                            <select
                                id="difficulty"
                                name="difficulty"
                                value={question.difficulty}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <input
                                type="text"
                                id="category"
                                name="category"
                                value={question.category}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={question.description}
                            onChange={handleInputChange}
                            required
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="sampleInput">Sample Input</label>
                        <textarea
                            id="sampleInput"
                            name="sampleInput"
                            value={question.sampleInput}
                            onChange={handleInputChange}
                            required
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="sampleOutput">Sample Output</label>
                        <textarea
                            id="sampleOutput"
                            name="sampleOutput"
                            value={question.sampleOutput}
                            onChange={handleInputChange}
                            required
                            rows="2"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="constraints">Constraints</label>
                        <textarea
                            id="constraints"
                            name="constraints"
                            value={question.constraints}
                            onChange={handleInputChange}
                            required
                            rows="3"
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="cancel-button" onClick={() => navigate('/ViewQuestions')}>
                            Cancel
                        </button>
                        <button type="submit" className="save-button">
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditQuestion;