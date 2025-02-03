import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

const Dashboard = () => {
    const [agents, setAgents] = useState([]);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [file, setFile] = useState(null);
    const navigate = useNavigate();
    const [distributedTasks, setDistributedTasks] = useState([]);

    // Fetch agents on component mount
    useEffect(() => {
        fetchAgents();
        fetchDistributedTasks();
    }, []);

    const fetchDistributedTasks = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get("http://localhost:5001/api/agents/with-tasks", {
                headers: { Authorization: `Bearer ${token}` }
            });

            setDistributedTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    const handleFileUpload = (e) => {
        const selectedFile = e.target.files[0];
        const validExtensions = ["csv", "xlsx", "xls"];
        const fileExtension = selectedFile.name.split(".").pop().toLowerCase();

        if (!validExtensions.includes(fileExtension)) {
            setError("Invalid file format. Please upload a CSV, XLSX, or XLS file.");
            return;
        }
        setFile(selectedFile);
        setError("");
    };

    const processFile = async () => {
        if (!file) {
            setError("Please upload a file first.");
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            const data = new Uint8Array(event.target.result);
            const workbook = XLSX.read(data, { type: "array" });
            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            const parsedData = XLSX.utils.sheet_to_json(sheet);

            if (!parsedData.every(row => row.FirstName && row.Phone && row.Notes)) {
                setError("Invalid file format. Ensure it contains FirstName, Phone, and Notes.");
                return;
            }

            distributeTasks(parsedData);
        };
        reader.readAsArrayBuffer(file);
    };

    const distributeTasks = async (tasks) => {
        if (agents.length === 0) {
            setError("No agents available to distribute tasks.");
            return;
        }

        let distributedTasks = {};
        for (let i = 0; i < agents.length; i++) {
            distributedTasks[agents[i]._id] = [];
        }

        tasks.forEach((task, index) => {
            const agentId = agents[index % agents.length]._id;
            distributedTasks[agentId].push(task);
        });

        try {
            const token = localStorage.getItem("token");
            await axios.post("http://localhost:5001/api/tasks/distribute", { distributedTasks }, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            });
            setSuccess("Tasks distributed successfully!");
        } catch (error) {
            console.log("error distributing tasks: ", error)
            setError("Error distributing tasks.");
        }
    };

    const fetchAgents = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get("http://localhost:5001/api/agents", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAgents(data);
        } catch (error) {
            console.error("Error fetching agents:", error);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setError("Authentication token missing. Please log in again.");
                return;
            }

            const { data } = await axios.post(
                "http://localhost:5001/api/agents/add",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );
            setSuccess("Agent added successfully!");
            setFormData({ name: "", email: "", phone: "", password: "" });
            fetchAgents(); // Refresh agent list
        } catch (error) {
            if (error.response && error.response.status === 403) {
                setError("Access denied. You are not authorized.");
            } else if (error.response && error.response.status === 401) {
                setError("Session expired. Please log in again.");
                localStorage.removeItem("token");
                navigate("/login");
            } else {
                setError("Error adding agent. Ensure you're an admin.");
            }
            console.error("xxxxxx: ", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
            {/* Dashboard Header */}
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">Dashboard</h2>

            {/* Add Agent Form */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Add New Agent</h3>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        required
                    />
                    <button
                        type="submit"
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                    >
                        Add Agent
                    </button>
                </form>
            </div>

            {/* file upload   */}
            <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-4xl">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Upload Task File</h3>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}

                <input type="file" onChange={handleFileUpload} className="mb-4" />
                <button onClick={processFile} className="bg-blue-600 text-white py-2 px-4 rounded-lg">Process File</button>
            </div>

            {/* Agent List Table */}
            <div className="w-full max-w-4xl mt-8">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Agent List</h3>
                <div className="overflow-x-auto">
                    <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
                        <thead className="bg-blue-600 text-white">
                            <tr>
                                <th className="p-3 text-left">Name</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Phone</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agents.length > 0 ? (
                                agents.map((agent) => (
                                    <tr key={agent._id} className="border-b">
                                        <td className="p-3">{agent.name}</td>
                                        <td className="p-3">{agent.email}</td>
                                        <td className="p-3">{agent.phone}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="p-3 text-center text-gray-500">
                                        No agents found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    <div className="w-full max-w-4xl mt-8">
                        <h3 className="text-xl font-semibold text-gray-700">Assigned Tasks</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full bg-white shadow-md !rounded-lg">
                                <thead className="bg-blue-600 text-white">
                                    <tr>
                                        <th className="p-3 text-left">Agent</th>
                                        <th className="p-3 text-left">Tasks Assigned</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {distributedTasks.map((agent, index) => (
                                        <tr key={agent._id} className="border-b">
                                            <td className="p-3">{index + 1}&#x29; {agent.name}</td>
                                            <td className="p-3">
                                                {agent.tasks && agent.tasks.length > 0 ? (
                                                    <ul className="list-disc pl-4">
                                                        {agent.tasks.map((task, index) => (
                                                            <li key={index} className="mb-2">
                                                                <div className="font-semibold">{task.FirstName}</div>
                                                                <div className="text-sm text-gray-600">
                                                                    Phone: {task.Phone}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    Notes: {task.Notes}
                                                                </div>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                ) : (
                                                    <span className="text-gray-500">No tasks assigned</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>

            {/* Logout Button */}
            <button
                className="mt-6 bg-red-500 text-white py-2 px-6 rounded-lg hover:bg-red-600 transition"
                onClick={() => {
                    localStorage.removeItem("token");
                    navigate("/login");
                }}
            >
                Logout
            </button>
        </div>
    );
};

export default Dashboard;