// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const Dashboard = () => {
//     const [agents, setAgents] = useState([]);
//     const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
//     const [error, setError] = useState("");
//     const [success, setSuccess] = useState("");
//     const navigate = useNavigate();

//     // Fetch agents on component mount
//     useEffect(() => {
//         fetchAgents();
//     }, []);

//     const fetchAgents = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             const { data } = await axios.get("http://localhost:5001/api/agents", {
//                 headers: { Authorization: `${token}` }
//             });
//             setAgents(data);
//         } catch (error) {
//             console.error("Error fetching agents:", error);
//         }
//     };

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setError("");
//         setSuccess("");

//         try {
//             const token = localStorage.getItem("token");
//             const { data } = await axios.post("http://localhost:5001/api/agents/add", formData, {
//                 headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
//             });

//             setSuccess("Agent added successfully!");
//             setFormData({ name: "", email: "", phone: "" });
//             fetchAgents(); // Refresh agent list
//         } catch (error) {
//             setError("Error adding agent. Ensure you're an admin.");
//             console.error(error);
//         }
//     };

//     return (
//         <div>
//             <h2>Dashboard</h2>
//             <h3>Add New Agent</h3>
//             {error && <p style={{ color: "red" }}>{error}</p>}
//             {success && <p style={{ color: "green" }}>{success}</p>}
//             <form onSubmit={handleSubmit}>
//                 <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
//                 <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
//                 <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
//                 <button type="submit">Add Agent</button>
//             </form>
//             <h3>Agent List</h3>
//             <table border="1">
//                 <thead>
//                     <tr>
//                         <th>Name</th>
//                         <th>Email</th>
//                         <th>Phone</th>
//                     </tr>
//                 </thead>
//                 <tbody>
//                     {console.log("UI Agents: ", agents)}
//                     {agents.map(agent => (
//                         <tr key={agent._id}>
//                             <td>{agent.name}</td>
//                             <td>{agent.email}</td>
//                             <td>{agent.phone}</td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>

//             <button
//                 className="mt-4 bg-red-500 text-white py-2 px-4 rounded"
//                 onClick={() => {
//                     localStorage.removeItem("token");
//                     navigate("/login");
//                 }}
//             >
//                 Logout
//             </button>
//         </div>
//     );
// };

// export default Dashboard;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const [agents, setAgents] = useState([]);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "", password: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    // Fetch agents on component mount
    useEffect(() => {
        fetchAgents();
    }, []);

    const fetchAgents = async () => {
        try {
            const token = localStorage.getItem("token");
            const { data } = await axios.get("http://localhost:5001/api/agents", {
                headers: { Authorization: `${token}` }
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
            console.error(error);
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
