import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const title = document.querySelector('.title');
        title.classList.add('slide-in');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });                                                 
        });
                                                                 
        document.querySelectorAll('.feature, .language-card, .stats-item').forEach((el) => observer.observe(el));

        // Handle scroll for navbar effect
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <div className="container">
            <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
                <div className="nav-content">
                    <div className="logo">GradeFusion</div>
                    <div className={`nav-links ${mobileMenuOpen ? 'mobile-active' : ''}`}>
                        <Link to="/" className="nav-link active">Home</Link>
                        <Link to="/about" className="nav-link">About</Link>
                        <Link to="/contact" className="nav-link">Contact</Link>
                        <Link to="/authen" className="nav-link signup-btn">Sign Up</Link>
                    </div>
                    <div className="hamburger" onClick={toggleMobileMenu}>
                        <span className={mobileMenuOpen ? 'open' : ''}></span>
                        <span className={mobileMenuOpen ? 'open' : ''}></span>
                        <span className={mobileMenuOpen ? 'open' : ''}></span>
                    </div>
                </div>
            </nav>

            <main className="main-content">
                <div className="hero-section">
                    <h1 className="title">Welcome to GradeFusion</h1>
                    <p className="subtitle">Revolutionizing Coding Assessments for Educational Excellence</p>
                    <div className="hero-stats">
                        <div className="stats-item">
                            <span className="stats-number">3</span>
                            <span className="stats-text">Programming Languages</span>
                        </div>
                        <div className="stats-item">
                            <span className="stats-number">100%</span>
                            <span className="stats-text">Automated Grading</span>
                        </div>
                        <div className="stats-item">
                            <span className="stats-number">24/7</span>
                            <span className="stats-text">Available</span>
                        </div>
                    </div>
                </div>

                <div className="languages-container">
                    <h2 className="section-title">Supported Languages</h2>
                    <div className="languages-grid">
                        <div className="language-card">
                            <div className="language-icon">🐍</div>
                            <h3>Python</h3>
                            <p>Perfect for beginners and data science projects</p>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">☕</div>
                            <h3>Java</h3>
                            <p>Object-oriented programming with enterprise support</p>
                        </div>
                        <div className="language-card">
                            <div className="language-icon">⚙️</div>
                            <h3>C</h3>
                            <p>Low-level programming for system development</p>
                        </div>
                    </div>
                </div>

                <div className="features-container">
                    <h2 className="section-title">Why Choose GradeFusion?</h2>
                    <div className="features-grid">
                        <div className="feature">
                            <div className="feature-icon">🚀</div>
                            <h3>Automated Evaluation</h3>
                            <p>Save precious time with instant code assessment and detailed feedback generation</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">👥</div>
                            <h3>Batch Management</h3>
                            <p>Efficiently organize students and assignments with our intuitive batch system</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">📊</div>
                            <h3>Real-time Results</h3>
                            <p>Get immediate insights into student performance with detailed analytics</p>
                        </div>
                        <div className="feature">
                            <div className="feature-icon">✨</div>
                            <h3>Custom Assignments</h3>
                            <p>Create and manage programming tasks with our flexible assignment builder</p>
                        </div>
                    </div>
                </div>

                <div className="how-it-works">
                    <h2 className="section-title">How It Works</h2>
                    <div className="steps-container">
                        <div className="step">
                            <div className="step-number">1</div>
                            <h3>Teachers Create Assignments</h3>
                            <p>Upload test cases and problem statements for students</p>
                        </div>
                        <div className="step">
                            <div className="step-number">2</div>
                            <h3>Students Submit Solutions</h3>
                            <p>Code directly in the browser with syntax highlighting</p>
                        </div>
                        <div className="step">
                            <div className="step-number">3</div>
                            <h3>Automatic Evaluation</h3>
                            <p>Get instant feedback and detailed performance metrics</p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="footer">
                <div className="footer-content">
                    <div className="footer-info">
                        <div className="footer-logo">GradeFusion</div>
                        <p>A modern approach to coding education and assessment</p>
                    </div>
                    <div className="footer-links-container">
                        <div className="footer-links-column">
                            <h4>Platform</h4>
                            <a href="/features">Features</a>
                            <a href="/languages">Languages</a>
                            <a href="/pricing">Pricing</a>
                        </div>
                        <div className="footer-links-column">
                            <h4>Resources</h4>
                            <a href="/docs">Documentation</a>
                            <a href="/blog">Blog</a>
                            <a href="/tutorials">Tutorials</a>
                        </div>
                        <div className="footer-links-column">
                            <h4>Company</h4>
                            <a href="/about">About Us</a>
                            <a href="/contact">Contact</a>
                            <a href="/careers">Careers</a>
                        </div>
                        <div className="footer-links-column">
                            <h4>Legal</h4>
                            <a href="/privacy">Privacy Policy</a>
                            <a href="/terms">Terms of Service</a>
                        </div>
                    </div>
                </div>
                <div className="copyright">
                    <p>&copy; 2024 GradeFusion. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;