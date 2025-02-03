import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     try {
    //         const { data } = await axios.post("http://localhost:5001/api/users/login", {
    //             email: email, // use dynamic email
    //             password: password // use dynamic password
    //         }, { headers: { 'Content-Type': 'application/json' } });

    //         localStorage.setItem("token", data.token);
    //         navigate("/dashboard");
    //     } catch (err) {
    //         setError("Invalid email or password");
    //     }
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Reset previous errors
        try {
            console.log("Attempting login...");

            const { data } = await axios.post(
                "http://localhost:5001/api/users/login",
                { email, password },
                { headers: { "Content-Type": "application/json" } }
            );

            if (data.token) {
                localStorage.setItem("token", data.token);
                console.log("Token saved, navigating to dashboard...");

                // Force a page refresh to ensure proper redirection
                setTimeout(() => {
                    navigate("/dashboard", { replace: true });
                    window.location.reload(); // Ensure React Router correctly updates the URL
                }, 200);
            } else {
                console.error("Token missing in response");
                setError("Authentication failed, please try again.");
            }
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            setError(err.response?.data?.message || "Invalid email or password");
        }
    };



    return (
        <div className="w-full h-screen flex justify-center items-center flex-col">
            {/* <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Login</button>
            </form> */}
            <div class="w-full bg-white rounded-lg shadow  md:mt-0 sm:max-w-md xl:p-0 border-gray-900">
                {error && <p className="text-[14px] text-red-500">{error}</p>}
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
                    <h1 class="text-xl text-center font-[300] leading-tight tracking-tight text-gray-600 md:text-2xl :text-white">
                        Login in to your <span className="font-[600] underline"> Admin </span>account
                    </h1>
                    <form class="space-y-4 md:space-y-6" action="#" onSubmit={handleSubmit}>
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

export default Login;
