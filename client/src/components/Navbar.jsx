import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <nav className="bg-blue-600 p-4">
            <div className="container mx-auto flex justify-between items-center">
                {/* Brand Name */}
                <Link to="/" className="text-white text-lg font-bold">
                    Assessment
                </Link>

                {/* Login Links */}
                <div className="flex gap-4">
                    <Link to="/login" className="text-white hover:underline">
                        Admin Login
                    </Link>
                    <Link to="/agent-login" className="text-white hover:underline">
                        Agent Login
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
