import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage/HomePage";
import Authen from './pages/admin/SigninSignup/AuthPages';
import StudentDash from './pages/student/StudentDashboard';
import TeacherDash from './pages/teacher/TeacherDashboard';
import CreateAssignment from './pages/teacher/CreateAssignment';
import ReopenAssignment from './pages/teacher/ReopenAssignment';
import StudentSubmissionView from './pages/teacher/StudentSubmissionView';
import AssignmentDetails from './pages/student/AssignmentDetails';
import LiveAssignmentStart from './pages/student/LiveAssignmentStart';
import LiveAssignmentPage from './pages/student/LiveAssignmentPage';
import ViewQuestions from './pages/teacher/ViewQuestions';
import CreateQuestion from './pages/teacher/CreateQuestion';
import ViewQuestionspecific from './pages/teacher/ViewQuestionspecific';

import ViewAssignments from './pages/teacher/ViewAssignments';
import EditQuestion from './pages/teacher/EditQuestion';
import EditAssignment from './pages/teacher/EditAssignment';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/Authen" element={<Authen />} />
        <Route path="/StudentDash" element={<StudentDash />} />
        <Route path="/TeacherDash" element={<TeacherDash />} />
        <Route path="/CreateAssignment" element={<CreateAssignment />} />
        <Route path="/ReopenAssignment" element={<ReopenAssignment />} />
        <Route path="/StudentSubmissionView" element={<StudentSubmissionView />} />
        <Route path="/AssignmentDetails" element={<AssignmentDetails />} />
        <Route path="/LiveAssignmentStart" element={<LiveAssignmentStart />} />
        <Route path="/LiveAssignmentPage" element={<LiveAssignmentPage />} />
        <Route path="/ViewQuestions" element={<ViewQuestions />} />
        <Route path="/view-question/:id" element={<ViewQuestionspecific />} />
        <Route path="/CreateQuestion" element={<CreateQuestion />} />
        <Route path="/ViewAssignments" element={<ViewAssignments />} />
        <Route path="/EditQuestion" element={<EditQuestion/>} />
        <Route path="/EditAssignment" element={<EditAssignment/>} />
      </Routes>
    </Router>
  );
}

export default App;