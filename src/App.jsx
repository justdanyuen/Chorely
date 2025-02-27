import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Profile from "./Profile";
import ScheduleView from "./ScheduleView";
import { Spinner } from "./Spinner"; // Import the Spinner component

export default function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [tasks, setTasks] = useState([]);
    const [roommates, setRoommates] = useState([]);

    // Global Dark Mode State
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", darkMode);
    }, [darkMode]);

    // Mock API Request - Simulates data loading
    useEffect(() => {
        setTimeout(() => {
            setTasks([
                { text: "Take out the trash", completed: false },
                { text: "Wash the dishes", completed: false },
                { text: "Vacuum the living room", completed: false }
            ]);
            setRoommates(["Alex", "Jamie", "Chris"]);
            setIsLoading(false);
        }, 2000);
    }, []);

    return (
        <Router>
            <AppContent 
                isLoading={isLoading} 
                tasks={tasks} 
                setTasks={setTasks} 
                roommates={roommates} 
                setRoommates={setRoommates} 
                darkMode={darkMode} 
                setDarkMode={setDarkMode} 
            />
        </Router>
    );
}

function AppContent({ isLoading, tasks, setTasks, roommates, setRoommates, darkMode, setDarkMode }) {
    const location = useLocation();

    return (
        <div className={`${darkMode ? "bg-gray-900 text-white" : "bg-white text-black"} min-h-screen`}>
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />

            <div className="app-container">
                {location.pathname !== "/profile" && (
                    <Sidebar 
                        tasks={tasks} 
                        setTasks={setTasks} 
                        roommates={roommates} 
                        setRoommates={setRoommates} 
                        isLoading={isLoading} 
                        darkMode={darkMode}
                    />
                )}

                <div className="schedule-container p-6 flex flex-col gap-6">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-full">
                            <Spinner className="text-gray-500 size-8" />
                        </div>
                    ) : (
                        <Routes>
                            <Route path="/" element={
                                <div className="flex flex-1 gap-6">
                                    <div className={`w-full p-4 rounded-lg shadow-md ${darkMode ? "bg-gray-800 text-white" : "bg-white text-black"}`}>
                                        <ScheduleView tasks={tasks} roommates={roommates} darkMode={darkMode} />
                                    </div>
                                </div>
                            } />
                            <Route path="/profile" element={
                                <div className="flex flex-1 p-6">
                                    <Profile darkMode = {darkMode} />
                                </div>
                            } />
                        </Routes>
                    )}
                </div>
            </div>
        </div>
    );
}
