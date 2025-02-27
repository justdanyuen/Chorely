import { useState } from "react";
import { FaPlus, FaTrash, FaCalendarAlt } from "react-icons/fa";
import CalendarView from "./CalendarView";
import { Spinner } from "./Spinner"; // Import the Spinner component

export default function Sidebar({ tasks, setTasks, roommates, setRoommates, isLoading }) {
    const [taskInput, setTaskInput] = useState("");
    const [roommateInput, setRoommateInput] = useState("");
    const [showCalendar, setShowCalendar] = useState(false);

    const addTask = () => {
        if (taskInput.trim()) {
            setTasks(prevTasks => [...prevTasks, { text: taskInput, completed: false }]);
            setTaskInput("");
        }
    };

    const deleteTask = (index) => {
        setTasks(prevTasks => prevTasks.filter((_, i) => i !== index));
    };

    const toggleTaskCompletion = (index) => {
        setTasks(prevTasks =>
            prevTasks.map((task, i) =>
                i === index ? { ...task, completed: !task.completed } : task
            )
        );
    };

    const addRoommate = () => {
        if (roommateInput.trim()) {
            setRoommates(prevRoommates => [...prevRoommates, roommateInput]);
            setRoommateInput("");
        }
    };

    const deleteRoommate = (index) => {
        setRoommates(prevRoommates => prevRoommates.filter((_, i) => i !== index));
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
                                className="p-3 bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center justify-center"
                            >
                                <FaPlus />
                            </button>
                        </div>
                        <ul className="space-y-2">
                            {roommates.length > 0 ? (
                                roommates.map((roommate, index) => (
                                    <li key={index} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                                        <span className="text-white text-center w-full">{roommate}</span>
                                        <button
                                            onClick={() => deleteRoommate(index)}
                                            className="p-2 bg-black-700 hover:bg-red-600 text-white rounded-lg"
                                        >
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
                                        <button 
                                            onClick={() => deleteTask(index)}
                                            className="p-2 bg-black-500 hover:bg-red-600 text-white rounded-lg"
                                        >
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
