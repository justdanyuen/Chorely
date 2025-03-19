import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router";
import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Profile from "./Profile";
import ScheduleView from "./ScheduleView";
import LoginPage from "./auth/LoginPage";
import RegisterPage from "./auth/RegisterPage";
import Logout from "./auth/Logout";
import { ProtectedRoute } from "./auth/ProtectedRoute";
import { Spinner } from "./Spinner";
import { Task } from "./types";
import { jwtDecode } from "jwt-decode";

interface AppProps {
    isAuthenticated: boolean;
    setAuthToken: (token: string | null) => void;
    isLoading: boolean;
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    roommates: string[];
    setRoommates: React.Dispatch<React.SetStateAction<string[]>>;
    darkMode: boolean;
    setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
    fetchData: () => Promise<void>; // ✅ Add fetchData to props
}

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!localStorage.getItem("authToken"));

    const setAuthToken = (token: string | null) => {
        if (token) {
            try {
                const decodedToken: { exp: number } = jwtDecode(token);
                const currentTime = Math.floor(Date.now() / 1000);
    
                if (decodedToken.exp < currentTime) {
                    console.warn("Token expired! Logging out...");
                    localStorage.removeItem("authToken");
                    setIsAuthenticated(false);
                    return;
                }
    
                localStorage.setItem("authToken", token);
                setIsAuthenticated(true);
            } catch (error) {
                console.error("Invalid token:", error);
                localStorage.removeItem("authToken");
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    };
    

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [roommates, setRoommates] = useState<string[]>([]);
    const [darkMode, setDarkMode] = useState<boolean>(() => localStorage.getItem("darkMode") === "true");

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", JSON.stringify(darkMode));
    }, [darkMode]);

    const fetchData = async () => {
        try {
            const authToken = localStorage.getItem("authToken");
            if (!authToken) {
                setIsLoading(false);
                return;
            }
    
            // Decode the token to extract username
            const decodedToken: { username: string } = jwtDecode(authToken);
            const createdBy = decodedToken.username;
    
            const headers = { Authorization: `Bearer ${authToken}` };
    
            // Fetch all roommates (debugging)
            // const allRoommatesResponse = await fetch(`/api/roommates`, { headers });
            // const allRoommatesData = await allRoommatesResponse.json();
            // console.log("All roommates in DB:", allRoommatesData);

            // const allTasksResponse = await fetch(`/api/tasks`, { headers });
            // const allTasksData = await allTasksResponse.json();
            // console.log("All tasks in DB:", allTasksData);
        
            // Fetch roommates **only** created by the logged-in user
            const roommatesResponse = await fetch(`/api/roommates?createdBy=${encodeURIComponent(createdBy)}`, { headers });
            console.log("Roommates API Response Status:", roommatesResponse.status); // Log status code
            const roommatesData = await roommatesResponse.json();
            console.log(`Roommates for createdBy="${createdBy}":`, roommatesData);
    

            if (!Array.isArray(roommatesData)) {
                console.error("ERROR: Expected an array but got:", roommatesData);
                throw new Error("Invalid data format for roommates");
            }

            const tasksResponse = await fetch(`/api/tasks?createdBy=${encodeURIComponent(createdBy)}`, { headers });
            console.log("Tasks API Response Status:", tasksResponse.status); // Log status code
            const tasksData = await tasksResponse.json();
            console.log(`Tasks for createdBy="${createdBy}":`, tasksData);
    
            if (!Array.isArray(tasksData)) {
                console.error("ERROR: Expected an array but got:", tasksData);
                throw new Error("Invalid data format for tasks");
            }

            if (roommatesData.length > 0) {
                console.log("Updating state - roommates:", roommatesData.map((r) => r.name));
                setRoommates(roommatesData.map((roommate: { name: string }) => roommate.name));
            } else {
                console.warn("No roommates found, skipping state update");
            }
    
            if (tasksData.length > 0) {
                console.log("Updating state - tasks:", tasksData);
                setTasks(tasksData);
            } else {
                console.warn("No tasks found, skipping state update");
            }
    
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching data:", error);
            setIsLoading(false);
        }
    };
    
    
    // useEffect(() => {
    //     console.log("Updated roommates state:", roommates);
    // }, [roommates]); // This runs AFTER state updates

    // useEffect(() => {
    //     console.log("Updated tasks state:", tasks);
    // },[tasks]);

    useEffect(() => {
        console.log("Checking authentication state:", isAuthenticated);
        console.log("Stored authToken:", localStorage.getItem("authToken"));
        fetchData();
    }, [isAuthenticated]);

    return (
        <Router>
            <AppContent 
                isAuthenticated={isAuthenticated} 
                setAuthToken={setAuthToken} 
                isLoading={isLoading} 
                tasks={tasks} 
                setTasks={setTasks} 
                roommates={roommates} 
                setRoommates={setRoommates} 
                darkMode={darkMode} 
                setDarkMode={setDarkMode} 
                fetchData={fetchData}
            />
        </Router>
    );
}

function AppContent({ isAuthenticated, setAuthToken, isLoading, tasks, setTasks, roommates, setRoommates, darkMode, setDarkMode, fetchData }: AppProps) {
    const location = useLocation();

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen`}>
            <Header darkMode={darkMode} setDarkMode={setDarkMode} isAuthenticated={isAuthenticated} />

            <div className="app-container">
                <div className="schedule-container p-6 flex flex-col gap-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Spinner className="text-gray-500 size-8" />
                        </div>
                    ) : (
                        <Routes>
                             <Route path="/login" element={<LoginPage setAuthToken={setAuthToken} />} />
                            <Route path="/register" element={<RegisterPage setAuthToken={setAuthToken} />} />
                            <Route 
                                path="/" 
                                element={
                                    <ProtectedRoute isAuthenticated={isAuthenticated}>
                                        <div className="flex">
                                            <Sidebar 
                                                tasks={tasks} 
                                                setTasks={setTasks} 
                                                roommates={roommates} 
                                                setRoommates={setRoommates} 
                                                isLoading={isLoading} 
                                                darkMode={darkMode} 
                                            />
                                            <ScheduleView 
                                                tasks={tasks} 
                                                roommates={roommates}
                                                darkMode={darkMode}
                                                fetchData={fetchData} 
                                            />
                                        </div>
                                    </ProtectedRoute>
                                } 
                            />                           
                            <Route path="/profile" element={<ProtectedRoute isAuthenticated={isAuthenticated}><Profile darkMode={darkMode} /></ProtectedRoute>} />
                            <Route path="/logout" element={<Logout setAuthToken={setAuthToken} />} />
                        </Routes>
                    )}
                </div>
            </div>
        </div>
    );
}
