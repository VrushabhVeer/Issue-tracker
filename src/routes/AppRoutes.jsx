import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ProjectList from "../pages/projects/ProjectList";
import Board from "../pages/projects/Board";
import Backlog from "../pages/projects/Backlog";
import IssuesPage from "../pages/issues/Issues";
import IssueDetails from "../pages/issues/IssueDetails";
import CreateIssue from "../pages/issues/CreateIssue";
import Features from "../pages/static/Features";
import Pricing from "../pages/static/Pricing";
import Contact from "../pages/static/Contact";
import Reports from "../pages/reports/Reports";
import StaticContent from "../pages/static/StaticContent";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
    // Fetch company_id inside the component to ensure it's up-to-date
    const getCompanyId = () => localStorage.getItem("company_id");

    return (
        <Routes>
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/issues" element={<ProtectedRoute><IssuesPage /></ProtectedRoute>} />
            <Route path="/issues/details/:id" element={<ProtectedRoute><IssueDetails /></ProtectedRoute>} />
            <Route path="/issues/new" element={<ProtectedRoute><CreateIssue companyId={getCompanyId()} /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><ProjectList companyId={getCompanyId()} /></ProtectedRoute>} />
            <Route path="/projects/:id/board" element={<ProtectedRoute><Board /></ProtectedRoute>} />
            <Route path="/projects/:id/backlog" element={<ProtectedRoute><Backlog /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />

            {/* Static Pages */}
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/integrations" element={<StaticContent />} />
            <Route path="/roadmap" element={<StaticContent />} />
            <Route path="/documentation" element={<StaticContent />} />
            <Route path="/help-center" element={<StaticContent />} />
            <Route path="/community" element={<StaticContent />} />
        </Routes>
    );
};

export default AppRoutes;
