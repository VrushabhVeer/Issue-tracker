import { Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import IssuesPage from "../pages/Issues";
import IssueDetails from "../pages/IssueDetails";
import CreateIssue from "../pages/CreateIssue";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/issues" element={<IssuesPage/>} />
            <Route path="/issues/details" element={<IssueDetails/>} />
            <Route path="/issues/new" element={<CreateIssue />} />
        </Routes>
    );
};

export default AppRoutes;
