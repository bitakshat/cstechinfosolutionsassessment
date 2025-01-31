import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import { isAuthenticated } from "./utils/auth";
import AgentLogin from "./components/AgentLogin";
import AgentDashboard from "./components/AgentDashboard";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/agent-login" element={<AgentLogin />} />
        <Route path="/agent-dashboard" element={<AgentDashboard />} />
      </Routes>
    </Router>
  );
};

export default App;
