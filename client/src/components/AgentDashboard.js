// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";

// const AgentDashboard = () => {
//     const [agent, setAgent] = useState(null);
//     const navigate = useNavigate();

//     useEffect(() => {
//         const storedAgent = localStorage.getItem("agentInfo");
//         if (storedAgent) {
//             setAgent(JSON.parse(storedAgent));
//         } else {
//             navigate("/agent-login"); // Redirect if not logged in
//         }
//     }, [navigate]);

//     return (
//         <div className="p-6">
//             <h2 className="text-xl font-semibold">Welcome, {agent?.name}</h2>
//             <button
//                 className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
//                 onClick={() => {
//                     localStorage.removeItem("agentToken");
//                     localStorage.removeItem("agentInfo");
//                     navigate("/agent-login");
//                 }}
//             >
//                 Logout
//             </button>
//         </div>
//     );
// };

// export default AgentDashboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AgentDashboard = () => {
    const [agent, setAgent] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const storedAgent = localStorage.getItem("agentInfo");
        if (storedAgent) {
            setAgent(JSON.parse(storedAgent));
        } else {
            navigate("/agent-login");
        }
    }, [navigate]);

    const fetchAgentTasks = async () => {
        if (!agent || !agent._id) {
            console.error("Agent ID is missing, skipping API call.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const token = localStorage.getItem("agentToken");
            console.log("Agent Dashboard token: ", token)
            const { data } = await axios.get(
                `http://localhost:5001/api/tasks/agent/${agent._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            console.log("Fetched tasks:", data);
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
            setError("Failed to fetch your tasks");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (agent) {
            fetchAgentTasks();
        }
    }, [agent]);

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            const token = localStorage.getItem("agentToken");
            await axios.put(
                `http://localhost:5001/api/tasks/${taskId}/status`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            // Refresh tasks after update
            fetchAgentTasks();
        } catch (error) {
            console.error("Error updating task status:", error);
            setError("Failed to update task status");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                Welcome, {agent?.name}
                            </h2>
                            <p className="text-gray-600 mt-1">{agent?.email}</p>
                        </div>
                        <button
                            className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition"
                            onClick={() => {
                                localStorage.removeItem("agentToken");
                                localStorage.removeItem("agentInfo");
                                navigate("/agent-login");
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>

                {/* Tasks Section */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                        Your Assigned Tasks
                    </h3>

                    {loading ? (
                        <div className="text-center py-4">Loading tasks...</div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-4">{error}</div>
                    ) : tasks.length === 0 ? (
                        <div className="text-gray-500 text-center py-4">
                            No tasks assigned yet
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {tasks.map((task) => (
                                <div
                                    key={task._id}
                                    className="border rounded-lg p-4 hover:bg-gray-50"
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h4 className="font-semibold text-lg">
                                                {task.FirstName}
                                            </h4>
                                            <p className="text-gray-600">
                                                Phone: {task.Phone}
                                            </p>
                                            <p className="text-gray-600 mt-2">
                                                Notes: {task.Notes}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className={`px-3 py-1 rounded-full text-sm ${task.status === 'completed'
                                                ? 'bg-green-100 text-green-800'
                                                : task.status === 'in_progress'
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-blue-100 text-blue-800'
                                                }`}>
                                                {task.status}
                                            </span>
                                            <div className="mt-2 space-x-2">
                                                <select
                                                    className="border rounded p-1 text-sm"
                                                    value={task.status}
                                                    onChange={(e) =>
                                                        updateTaskStatus(task._id, e.target.value)
                                                    }
                                                >
                                                    <option value="assigned">Assigned</option>
                                                    <option value="in_progress">In Progress</option>
                                                    <option value="completed">Completed</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
