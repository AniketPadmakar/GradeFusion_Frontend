import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

const AuthPages = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    subject: "",
    studentClass: "",
    batch: "",
    role: "student", // Default role
  });
  const [isSignUp, setIsSignUp] = useState(true);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const url = isSignUp
        ? formData.role === "teacher"
          ? "/api/teacher/signup"
          : "/api/student/signup"
        : formData.role === "teacher"
        ? "/api/teacher/signin"
        : "/api/student/signin";

      const { data } = await axios.post(url, formData);
      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (formData.role === "teacher") {
        navigate("/teacher-dashboard");
      } else {
        navigate("/student-dashboard");
      }
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="auth-container">
      <h2>{isSignUp ? "Sign Up" : "Sign In"}</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        {isSignUp && (
          <>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={formData.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleChange}
              required
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        {isSignUp && (
          <>
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
            {formData.role === "teacher" && (
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            )}
            {formData.role === "student" && (
              <>
                <input
                  type="text"
                  name="studentClass"
                  placeholder="Class"
                  value={formData.studentClass}
                  onChange={handleChange}
                  required
                />
                <input
                  type="text"
                  name="batch"
                  placeholder="Batch"
                  value={formData.batch}
                  onChange={handleChange}
                  required
                />
              </>
            )}
          </>
        )}
        <button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>
      <p onClick={() => setIsSignUp(!isSignUp)}>
        {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
      </p>
    </div>
  );
};

const AuthWrapper = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPages />} />
      </Routes>
    </Router>
  );
};

export default AuthPages;

// Internal CSS styles
const styles = `
  .auth-container {
    width: 100%;
    max-width: 400px;
    margin: 50px auto;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    margin-left:530px
  }

  .auth-container h2 {
    text-align: center;
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }

  .auth-container form {
    display: flex;
    flex-direction: column;
  }

  .auth-container input,
  .auth-container select,
  .auth-container button {
    padding: 10px;
    margin: 10px 0;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 16px;
  }

  .auth-container input[type="email"],
  .auth-container input[type="password"],
  .auth-container input[type="text"],
  .auth-container select {
    width: 100%;
  }

  .auth-container button {
    background-color: #007bff;
    color: white;
    border: none;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  .auth-container button:hover {
    background-color: #0056b3;
  }

  .auth-container p {
    text-align: center;
    color: #007bff;
    cursor: pointer;
    font-size: 14px;
  }

  .auth-container p:hover {
    text-decoration: underline;
  }

  .error {
    color: red;
    font-size: 14px;
    text-align: center;
    margin-bottom: 15px;
  }
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);





// import React, { useState } from 'react';
// import { motion } from 'framer-motion';
// import { User, Mail, Lock, BookOpen, GraduationCap } from 'lucide-react';

// const AuthPages = () => {
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [activeTab, setActiveTab] = useState('student');
//   const [formData, setFormData] = useState({
//     email: '',
//     password: '',
//     name: '',
//     confirmPassword: ''
//   });

//   const handleInputChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log('Form submitted:', formData);
//   };

//   return (
//     <div className="auth-container">
//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="auth-card"
//       >
//         <div className="auth-content">
//           <div className="auth-header">
//             <h1>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
//             <p>{isSignUp ? 'Sign up to get started' : 'Sign in to continue'}</p>
//           </div>

//           {isSignUp && (
//             <div className="tab-container">
//               <motion.button
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setActiveTab('student')}
//                 className={`tab-button ${activeTab === 'student' ? 'active' : ''}`}
//               >
//                 <GraduationCap className="tab-icon" size={18} />
//                 <span>Student</span>
//               </motion.button>
//               <motion.button
//                 whileTap={{ scale: 0.95 }}
//                 onClick={() => setActiveTab('teacher')}
//                 className={`tab-button ${activeTab === 'teacher' ? 'active' : ''}`}
//               >
//                 <BookOpen className="tab-icon" size={18} />
//                 <span>Teacher</span>
//               </motion.button>
//             </div>
//           )}

//           <form onSubmit={handleSubmit} className="auth-form">
//             {isSignUp && (
//               <div className="form-group">
//                 <label>Full Name</label>
//                 <div className="input-container">
//                   <User className="input-icon" size={18} />
//                   <input
//                     type="text"
//                     name="name"
//                     value={formData.name}
//                     onChange={handleInputChange}
//                     placeholder="Enter your name"
//                     required
//                   />
//                 </div>
//               </div>
//             )}

//             <div className="form-group">
//               <label>Email</label>
//               <div className="input-container">
//                 <Mail className="input-icon" size={18} />
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleInputChange}
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>
//             </div>

//             <div className="form-group">
//               <label>Password</label>
//               <div className="input-container">
//                 <Lock className="input-icon" size={18} />
//                 <input
//                   type="password"
//                   name="password"
//                   value={formData.password}
//                   onChange={handleInputChange}
//                   placeholder="Enter your password"
//                   required
//                 />
//               </div>
//             </div>

//             {isSignUp && (
//               <div className="form-group">
//                 <label>Confirm Password</label>
//                 <div className="input-container">
//                   <Lock className="input-icon" size={18} />
//                   <input
//                     type="password"
//                     name="confirmPassword"
//                     value={formData.confirmPassword}
//                     onChange={handleInputChange}
//                     placeholder="Confirm your password"
//                     required
//                   />
//                 </div>
//               </div>
//             )}

//             <motion.button
//               whileHover={{ scale: 1.02 }}
//               whileTap={{ scale: 0.98 }}
//               type="submit"
//               className="submit-button"
//             >
//               {isSignUp ? 'Sign Up' : 'Sign In'}
//             </motion.button>
//           </form>

//           <div className="auth-footer">
//             <p>
//               {isSignUp ? 'Already have an account?' : "Don't have an account?"}
//               <button
//                 onClick={() => setIsSignUp(!isSignUp)}
//                 className="toggle-button"
//               >
//                 {isSignUp ? 'Sign In' : 'Sign Up'}
//               </button>
//             </p>
//           </div>
//         </div>
//       </motion.div>

//       <style jsx>{`
//         /* Base styles */
//         * {
//           box-sizing: border-box;
//           margin: 0;
//           padding: 0;
//         }

//         .auth-container {
//           min-height: 100vh;
//           width: 100vw;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           padding: clamp(1rem, 5vw, 2rem);
//           background: linear-gradient(135deg, #f0f4ff 0%, #e6e9ff 100%);
//           overflow-x: hidden;
//         }

//         .auth-card {
//           background: white;
//           border-radius: clamp(0.5rem, 2vw, 1rem);
//           box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
//           width: min(100%, 400px);
//           margin: auto;
//           animation: slideUp 0.5s ease-out;
//         }

//         .auth-content {
//           padding: clamp(1.5rem, 4vw, 2rem);
//         }

//         .auth-header {
//           text-align: center;
//           margin-bottom: clamp(1.5rem, 4vw, 2rem);
//         }

//         .auth-header h1 {
//           font-size: clamp(1.5rem, 5vw, 1.875rem);
//           font-weight: bold;
//           color: #1a1a1a;
//           margin-bottom: 0.5rem;
//           line-height: 1.2;
//         }

//         .auth-header p {
//           color: #666;
//           font-size: clamp(0.875rem, 2.5vw, 1rem);
//         }

//         /* Tab styles */
//         .tab-container {
//           display: flex;
//           background: #f5f5f5;
//           border-radius: 0.5rem;
//           padding: 0.25rem;
//           margin-bottom: 1.5rem;
//           gap: 0.25rem;
//         }

//         .tab-button {
//           flex: 1;
//           display: flex;
//           align-items: center;
//           justify-content: center;
//           gap: 0.5rem;
//           padding: clamp(0.5rem, 2vw, 0.75rem);
//           border: none;
//           background: none;
//           border-radius: 0.375rem;
//           cursor: pointer;
//           transition: all 0.3s ease;
//           font-size: clamp(0.875rem, 2.5vw, 1rem);
//         }

//         .tab-button.active {
//           background: white;
//           box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
//         }

//         .tab-icon {
//           flex-shrink: 0;
//         }

//         /* Form styles */
//         .form-group {
//           margin-bottom: clamp(1rem, 3vw, 1.5rem);
//         }

//         .form-group label {
//           display: block;
//           font-size: clamp(0.75rem, 2vw, 0.875rem);
//           font-weight: 500;
//           color: #4a4a4a;
//           margin-bottom: 0.5rem;
//         }

//         .input-container {
//           position: relative;
//           width: 100%;
//         }

//         .input-icon {
//           position: absolute;
//           left: clamp(0.5rem, 2vw, 0.75rem);
//           top: 50%;
//           transform: translateY(-50%);
//           color: #666;
//           pointer-events: none;
//         }

//         .input-container input {
//           width: 100%;
//           padding: clamp(0.5rem, 2vw, 0.75rem) clamp(2rem, 5vw, 2.5rem);
//           border: 1px solid #e0e0e0;
//           border-radius: 0.5rem;
//           font-size: clamp(0.875rem, 2.5vw, 1rem);
//           transition: all 0.3s ease;
//         }

//         .input-container input:focus {
//           outline: none;
//           border-color: #4a90e2;
//           box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
//         }

//         /* Button styles */
//         .submit-button {
//           width: 100%;
//           padding: clamp(0.75rem, 2.5vw, 1rem);
//           background: #4a90e2;
//           color: white;
//           border: none;
//           border-radius: 0.5rem;
//           font-size: clamp(0.875rem, 2.5vw, 1rem);
//           font-weight: 500;
//           cursor: pointer;
//           transition: background 0.3s ease;
//         }

//         .submit-button:hover {
//           background: #357abd;
//         }

//         .auth-footer {
//           margin-top: clamp(1rem, 3vw, 1.5rem);
//           text-align: center;
//           font-size: clamp(0.875rem, 2.5vw, 1rem);
//         }

//         .toggle-button {
//           background: none;
//           border: none;
//           color: #4a90e2;
//           font-weight: 500;
//           cursor: pointer;
//           margin-left: 0.5rem;
//           font-size: inherit;
//         }

//         .toggle-button:hover {
//           text-decoration: underline;
//         }

//         /* Animations */
//         @keyframes slideUp {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         /* Media Queries */
//         @media (max-width: 340px) {
//           .auth-content {
//             padding: 1rem;
//           }

//           .tab-button {
//             padding: 0.4rem;
//           }

//           .tab-button span {
//             font-size: 0.8rem;
//           }

//           .input-container input {
//             font-size: 0.8rem;
//           }
//         }

//         @media (min-width: 768px) {
//           .auth-card {
//             transform: scale(1.02);
//           }

//           .input-container input:hover {
//             border-color: #4a90e2;
//           }
//         }

//         @media (prefers-reduced-motion: reduce) {
//           .auth-card {
//             animation: none;
//           }

//           * {
//             transition: none !important;
//           }
//         }

//         /* High contrast mode */
//         @media (prefers-contrast: high) {
//           .submit-button {
//             background: #000;
//             border: 2px solid #000;
//           }

//           .input-container input {
//             border: 2px solid #000;
//           }

//           .toggle-button {
//             color: #000;
//             text-decoration: underline;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default AuthPages;