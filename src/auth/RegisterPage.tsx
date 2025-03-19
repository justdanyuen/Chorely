import React from "react";
import { useNavigate } from "react-router";
import UsernamePasswordForm from "./UsernamePasswordForm";
import { sendPostRequest } from "./sendPostRequest";

interface RegisterPageProps {
    setAuthToken: (token: string) => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ setAuthToken }) => {
    const navigate = useNavigate();

    const handleRegister = async ({ username, password }: { username: string; password: string }) => {
        try {
            const response = await sendPostRequest<{ token?: string }>("/auth/register", { username, password });

            console.log("Raw response:", response);
            console.log("Status:", response.status);
            console.log("Content-Type:", response.headers.get("content-type"));

            if (response.ok) {
                console.log("Response was ok!");
                const data = await response.json();

                if (data.token) {
                    setAuthToken(data.token);
                } else {
                    console.warn("No token received from server.");
                }

                navigate("/");
                return { type: "success", message: "Registration successful!" };
            } else if (response.status === 400) {
                return { type: "error", message: "User already exists." };
            } else {
                return { type: "error", message: "Server error. Please try again later." };
            }
        } catch (error) {
            console.error("Error registering:", error);
            return { type: "error", message: "Network error. Please try again." };
        }
    };

    return (
        <div>
            <h2>Register a New Account</h2>
            <UsernamePasswordForm onSubmit={handleRegister} />
        </div>
    );
};

export default RegisterPage;
