import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { getToken,deleteToken } from "../../data/Token";
import hostURL from "../../data/URL";
import './ViewAssignments.css';

const ViewAssignments = () => {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

     // Add this function to handle logout
         const handleLogout = () => {
            // Delete the token from cookies
            deleteToken("token");
            // Redirect to home page
            navigate('/');
        };
    

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const token = getToken("token");
                if (!token) {
                    throw new Error("Authentication required");
                }

                const response = await fetch(`${hostURL.link}/app/teacher/fetch-assignments`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch assignments");
                }

                const data = await response.json();
                setAssignments(data.assignments);
            } catch (err) {
                setError(err.message || 'Error fetching assignments');
            } finally {
                setLoading(false);
            }
        };

        fetchAssignments();
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return "Not Set";
        
        // Try to parse as a standard JavaScript date first
        let date = new Date(dateString);
        
        // If it's not a valid date, try the DD/MM/YYYY :: HH:mm:ss format
        if (date.toString() === "Invalid Date") {
            const parts = dateString.split(" :: ");
            if (parts.length === 2) {
                const [datePart, timePart] = parts;
                const [day, month, year] = datePart.split("/");
                date = new Date(`${year}-${month}-${day}T${timePart}`);
            }
        }

        if (date.toString() === "Invalid Date") {
            return "Invalid Date";
        }

        // Format the date consistently
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');

        return `${day}/${month}/${year} :: ${hours}:${minutes}:${seconds}`;
    };

    const handleEdit = (id) => {
        navigate(`/EditAssignment/${id}`);
    };

    const handleView = (id) => {
        navigate(`/ViewAssignmentSpecific/${id}`);
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this assignment?")) return;

        try {
            const token = getToken("token");
            await fetch(`${hostURL.link}/app/teacher/delete-assignments/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setAssignments(assignments.filter((a) => a._id !== id));
        } catch (err) {
            alert("Error deleting assignment");
        }
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <>
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-content">
                    <div className="logo">GradeFusion</div>
                    <div className="hamburger" onClick={toggleMobileMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                    <div className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
                        <Link to="/" className="nav-link active">Home</Link>
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/contact" className="nav-link">Contact</Link>
                        <button className="nav-link signup-btn" onClick={handleLogout}>Log out</button>
                    </div>
                </div>
            </nav>

            <div className="assignments-container">
                <header className="assignments-header">
                    <h1>Assignments</h1>
                    <button className="create-button" onClick={() => navigate('/CreateAssignment')}>
                        <span className="button-icon">+</span> Create New Assignment
                    </button>
                </header>

                {loading ? (
                    <p className="loading-text">Loading assignments...</p>
                ) : error ? (
                    <p className="error-message">{error}</p>
                ) : assignments.length === 0 ? (
                    <p className="no-assignments">No assignments found.</p>
                ) : (
                    <div className="assignments-grid">
                        {assignments.map((assignment) => (
                            <div key={assignment._id} className="assignment-card">
                                <div className="assignment-header">
                                    <h2>{assignment.assignment_name}</h2>
                                </div>
                                <div className="assignment-details">
                                    <span className="date">Created: {formatDate(assignment.created_at)}</span>
                                    <span className="start-date">Starts: {formatDate(assignment.start_at)}</span>
                                    <span className="due-date">Due: {formatDate(assignment.due_at)}</span>
                                    <span className="marks">Marks: {assignment.marks}</span>
                                    <span className="students">Students Enrolled: {assignment.student_ids.length}</span>
                                </div>
                                <div className="assignment-actions">
                                    <button className="action-button edit" onClick={() => handleEdit(assignment._id)}>Edit</button>
                                    <button className="action-button view" onClick={() => handleView(assignment._id)}>View</button>
                                    <button className="action-button delete" onClick={() => handleDelete(assignment._id)}>Delete</button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default ViewAssignments;