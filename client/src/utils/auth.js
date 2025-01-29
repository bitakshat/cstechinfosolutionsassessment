import { jwtDecode } from "jwt-decode";

export const isAuthenticated = () => {
    const token = localStorage.getItem("token");
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 > Date.now();
    } catch {
        return false;
    }
};
