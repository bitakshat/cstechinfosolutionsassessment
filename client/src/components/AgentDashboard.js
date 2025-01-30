import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AgentDashboard = () => {
    const [agent, setAgent] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const storedAgent = localStorage.getItem("agentInfo");
        if (storedAgent) {
            setAgent(JSON.parse(storedAgent));
        } else {
            navigate("/agent-login"); // Redirect if not logged in
        }
    }, [navigate]);

    return (
        <div className="p-6">
            <h2 className="text-xl font-semibold">Welcome, {agent?.name}</h2>
            <button
                className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
                onClick={() => {
                    localStorage.removeItem("agentToken");
                    localStorage.removeItem("agentInfo");
                    navigate("/agent-login");
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default AgentDashboard;
