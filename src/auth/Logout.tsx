import { useEffect } from "react";
import { useNavigate } from "react-router";

interface LogoutProps {
    setAuthToken: (token: string | null) => void;
}

export default function Logout({ setAuthToken }: LogoutProps) {
    const navigate = useNavigate();

    useEffect(() => {
        console.log("Logging out...");
        localStorage.removeItem("authToken");
        sessionStorage.clear();
        document.cookie.split(";").forEach((cookie) => { 
            document.cookie = cookie.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        setAuthToken(null);

        navigate("/login");// Redirect user to login page
    }, [setAuthToken, navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <p className="text-gray-600 text-xl">Logging out...</p>
        </div>
    );
}
