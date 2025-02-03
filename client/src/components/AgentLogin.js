import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AgentLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await axios.post("http://localhost:5001/api/agents/login", { email, password }, { headers: { 'Content-Type': 'application/json' } });
            localStorage.setItem("agentToken", response.data.token);
            localStorage.setItem("agentInfo", JSON.stringify(response.data.agent));
            navigate("/agent-dashboard"); // Redirect to agent dashboard
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div class="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 border-gray-900">
                {error && <p className="text-[14px] text-red-500">{error}</p>}
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl font-bold text-center leading-tight tracking-tight text-gray-600 md:text-2xl :text-white">
                        Login in to your agent account
                    </h1>
                    <form class="space-y-4 md:space-y-6" action="#" onSubmit={handleLogin}>
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 :text-white">Your email</label>
                            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 :bg-gray-700 :border-gray-600 :placeholder-gray-400 :text-white :focus:ring-blue-500 :focus:border-blue-500" placeholder="name@company.com" required="" />
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 :text-white">Password</label>
                            <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 :bg-gray-700 :border-gray-600 :placeholder-gray-400 :text-white :focus:ring-blue-500 :focus:border-blue-500" required="" />
                        </div>
                        <div class="flex items-center justify-between">
                            <div class="flex items-start">
                                <div class="flex items-center h-5">
                                    <input id="remember" aria-describedby="remember" type="checkbox" class="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 :bg-gray-700 :border-gray-600 :focus:ring-primary-600 :ring-offset-gray-800" required="" />
                                </div>
                                <div class="ml-3 text-sm">
                                    <label for="remember" class="text-gray-500 :text-gray-300">Remember me</label>
                                </div>
                            </div>
                            <a href="#" class="text-sm font-medium text-primary-600 hover:underline :text-primary-500">Forgot password?</a>
                        </div>
                        <button type="submit" class="w-full text-white bg-blue-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center :bg-primary-600 :hover:bg-primary-700 :focus:ring-primary-800">Sign in</button>
                        <p class="text-sm font-light text-gray-500 :text-gray-400">
                            Don’t have an account yet? <a href="#" class="font-medium text-primary-600 hover:underline :text-primary-500">Sign up</a>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AgentLogin;
