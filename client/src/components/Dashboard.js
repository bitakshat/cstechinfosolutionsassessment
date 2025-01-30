import React, { useEffect, useState } from "react";
import axios from "axios";

const Dashboard = () => {
    const [agents, setAgents] = useState([]);
    const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

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
            const { data } = await axios.post("http://localhost:5001/api/agents/add", formData, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }
            });

            setSuccess("Agent added successfully!");
            setFormData({ name: "", email: "", phone: "" });
            fetchAgents(); // Refresh agent list
        } catch (error) {
            setError("Error adding agent. Ensure you're an admin.");
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Dashboard</h2>
            <h3>Add New Agent</h3>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {success && <p style={{ color: "green" }}>{success}</p>}
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
                <button type="submit">Add Agent</button>
            </form>
            <h3>Agent List</h3>
            <table border="1">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                    </tr>
                </thead>
                <tbody>
                    {console.log("UI Agents: ", agents)}
                    {agents.map(agent => (
                        <tr key={agent._id}>
                            <td>{agent.name}</td>
                            <td>{agent.email}</td>
                            <td>{agent.phone}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Dashboard;
