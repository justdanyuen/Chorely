import { useState } from "react";
import { FaPlus, FaTrash, FaCalendarAlt } from "react-icons/fa";
import CalendarView from "./CalendarView";
import { Spinner } from "./Spinner";
import { Task } from "./types";
import { jwtDecode } from "jwt-decode";

interface SidebarProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
    roommates: string[];
    setRoommates: React.Dispatch<React.SetStateAction<string[]>>;
    isLoading: boolean;
    darkMode: boolean;
}
export default function Sidebar({ tasks, setTasks, roommates, setRoommates, isLoading, darkMode }: SidebarProps) {
    const [taskInput, setTaskInput] = useState("");
    const [roommateInput, setRoommateInput] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);

    const authToken = localStorage.getItem("authToken");

    const addTask = async () => {
        if (taskInput.trim()) {
            try {
                const authToken = localStorage.getItem("authToken");
                if (!authToken) {
                    console.error("No auth token found, user not authenticated");
                    return;
                }
    
                // Decode the JWT token to get the username
                const decodedToken: { username: string } = jwtDecode(authToken);
                const createdBy = decodedToken.username; // Extract username from token
    
                const response = await fetch("/api/tasks", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({ text: taskInput, createdBy }), // Send extracted username
                });
    
                if (!response.ok) throw new Error("Failed to add task");
                const newTask = await response.json();
    
                setTasks((prevTasks) => [...prevTasks, newTask]);
                setTaskInput("");
            } catch (error) {
                console.error("Error adding task:", error);
            }
        }
    };
    
    const deleteTask = async (task: Task) => {
        try {
            if (!authToken) {
                console.error("No auth token found, user not authenticated");
                return;
            }
    
            // Decode JWT to get the username
            const decodedToken: { username: string } = jwtDecode(authToken);
            const createdBy = decodedToken.username;
    
            const response = await fetch(`/api/tasks`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ text: task.text, createdBy }), // Send task text and username
            });
    
            if (!response.ok) throw new Error("Failed to delete task");
    
            // Remove the task from the state
            setTasks((prevTasks) => prevTasks.filter((t) => t.text !== task.text));
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // frontend aesthetic only for now
    const toggleTaskCompletion = (index: number) => {
        setTasks(prevTasks =>
            prevTasks.map((task, i) =>
                i === index ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const addRoommate = async () => {
        if (roommateInput.trim()) {
            try {
                if (!authToken) {
                    console.error("No auth token found, user not authenticated");
                    return;
                }
    
                // Decode JWT to get the username
                const decodedToken: { username: string } = jwtDecode(authToken);
                const createdBy = decodedToken.username; // Extract username from token
    
                const response = await fetch("/api/roommates", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify({ name: roommateInput, createdBy }), // Send name and username
                });
    
                if (!response.ok) throw new Error("Failed to add roommate");
    
                const newRoommate = await response.json();
    
                setRoommates((prevRoommates) => [...prevRoommates, newRoommate.name]); // Update UI
                setRoommateInput("");
            } catch (error) {
                console.error("Error adding roommate:", error);
            }
        }
    };    

    const deleteRoommate = async (roommate: string) => {
        try {
            if (!authToken) {
                console.error("No auth token found, user not authenticated");
                return;
            }
    
            // Decode JWT to get the username
            const decodedToken: { username: string } = jwtDecode(authToken);
            const createdBy = decodedToken.username;
    
            const response = await fetch(`/api/roommates`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authToken}`,
                },
                body: JSON.stringify({ name: roommate, createdBy }), // Send name and username
            });
    
            if (!response.ok) throw new Error("Failed to delete roommate");
    
            setRoommates((prevRoommates) => prevRoommates.filter((r) => r !== roommate)); // Update UI
        } catch (error) {
            console.error("Error deleting roommate:", error);
        }
    };
    

    return (
        <aside className="sidebar bg-gray-800 text-white w-64 min-h-screen p-6 flex flex-col">
            {/* Roommates Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Roommates</h2>
                    {isLoading && <Spinner className="text-white w-4 h-4" />}
                    </div>

                {!isLoading && (
                    <>
                        <div className="mb-4 flex gap-2">
                            <input
                                type="text"
                                value={roommateInput}
                                onChange={(e) => setRoommateInput(e.target.value)}
                                className="flex-1 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Add Roommate"
                            />
                            <button
                                onClick={addRoommate}
                                className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center"
                            >
                                <FaPlus />
                            </button>
                        </div>
                        <ul className="space-y-2">
                            {roommates.length > 0 ? (
                                roommates.map((roommate, index) => (
                                    <li key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                        <span className="text-white text-center w-full">{roommate}</span>
                                        <button onClick={() => deleteRoommate(roommate)} className="p-2 bg-black-500 hover:bg-red-600 text-white rounded-lg">
                                            <FaTrash />
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-400">No roommates added.</p>
                            )}
                        </ul>
                    </>
                )}
            </div>

            {/* Task List Section */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-center">Task List</h2>
                    {isLoading && <Spinner className="text-white" />}
                </div>

                {!isLoading && (
                    <>
                        <div className="mb-4 flex gap-2 justify-center">
                            <input
                                type="text"
                                value={taskInput}
                                onChange={(e) => setTaskInput(e.target.value)}
                                className="flex-1 p-3 rounded-lg bg-gray-700 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                placeholder="Add Task"
                            />
                            <button
                                onClick={addTask}
                                className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center"
                            >
                                <FaPlus />
                            </button>
                        </div>
                        <ul className="space-y-2 overflow-auto max-h-64">
                            {tasks.length > 0 ? (
                                tasks.map((task, index) => (
                                    <li key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                        <span 
                                            className={`flex-1 cursor-pointer text-center w-full${task.completed ? 'line-through text-gray-400' : 'text-white'}`}
                                            onClick={() => toggleTaskCompletion(index)}
                                        >
                                            {task.text}
                                        </span>
                                        <button onClick={() => deleteTask(task)} className="p-2 bg-black-500 hover:bg-red-600 text-white rounded-lg">
                                            <FaTrash />
                                        </button>
                                    </li>
                                ))
                            ) : (
                                <p className="text-gray-400">No tasks added.</p>
                            )}
                        </ul>
                    </>
                )}
            </div>

            {/* Calendar Toggle Button */}
            <div className="mt-auto">
                <button
                    onClick={() => setShowCalendar(prev => !prev)}
                    className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
                >
                    <FaCalendarAlt />
                    {showCalendar ? "Hide Calendar" : "View Calendar"}
                </button>

                {/* Render CalendarView when showCalendar is true */}
                {showCalendar && (
                    <div className="bg-gray-700 p-4 rounded-lg shadow-md mt-4">
                        <h2 className="text-lg font-semibold mb-2 text-center">Calendar</h2>
                        <CalendarView tasks={tasks} roommates={roommates} />
                    </div>
                )}
            </div>
        </aside>
    );
}


// const addTask = () => {
    //     if (taskInput.trim()) {
    //         const newTask: Task = {
    //             _id: crypto.randomUUID(),  // Generate a temporary unique ID
    //             text: taskInput,
    //             completed: false,
    //             createdAt: new Date().toISOString(),
    //             createdBy: "current_user" // Replace with actual logged-in user
    //         };
    
    //         setTasks(prevTasks => [...prevTasks, newTask]);
    //         setTaskInput("");
    //     }
    // };

// const addRoommate = () => {
    //     if (roommateInput.trim()) {
    //         setRoommates(prevRoommates => [...prevRoommates, roommateInput]);
    //         setRoommateInput("");
    //     }
    // };