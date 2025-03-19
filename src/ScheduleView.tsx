import React, { useState, useEffect } from "react";
import { startOfWeek, addWeeks, subWeeks, format, differenceInWeeks } from "date-fns";
import { Task } from "./types";

type ScheduleViewProps= {
    tasks: Task[];
    roommates: string[];
    darkMode: boolean;
    fetchData: () => Promise<void>; // ✅ Add fetchData
    };

export default function ScheduleView({ tasks = [], roommates = [], darkMode, fetchData }: ScheduleViewProps) {
    const [currentWeek, setCurrentWeek] = useState<Date>(startOfWeek(new Date()));
    const [assignedTasks, setAssignedTasks] = useState<Record<string, string[]>>({});

    useEffect(() => {
        // If no tasks or roommates, reset assignments
        if (!tasks.length || !roommates.length) {
            setAssignedTasks({});
            return;
        }

        const taskMap: Record<string, string[]> = {};
        const sortedRoommates = [...roommates]; // Keep roommate order fixed
        const weekOffset = differenceInWeeks(currentWeek, startOfWeek(new Date()));

        // Rotate the tasks based on the current week offset
        const rotatedTasks = tasks.map((_, i) => tasks[(i + weekOffset) % tasks.length]);

        // Initialize the task map
        sortedRoommates.forEach(roommate => {
            taskMap[roommate] = [];
        });

        // Assign rotated tasks to roommates
        rotatedTasks.forEach((task, index) => {
            const assignedRoommate = sortedRoommates[index % sortedRoommates.length];
            taskMap[assignedRoommate].push(task.text);
        });

        setAssignedTasks(taskMap);
    }, [tasks, roommates, currentWeek]);

    return (
        <div className="schedule-view p-6 rounded-lg shadow-md transition duration-300"
            style={{
                backgroundColor: "var(--background-color)",
                color: "var(--text-color)",
                border: "1px solid var(--secondary-color)"
            }}
        >
            <h2 className="text-xl font-semibold mb-4">Weekly Task Schedule</h2>
            <p className="mb-4 transition duration-300" style={{ color: "var(--secondary-color)" }}>
                Week of {format(currentWeek, "MMMM d, yyyy")}
            </p>

            {Object.keys(assignedTasks).length > 0 ? (
                <ul style={{ borderTop: "1px solid var(--secondary-color)" }}>
                    {Object.entries(assignedTasks).map(([roommate, taskList]) => (
                        <li key={roommate} className="py-2">
                            <span style={{ fontWeight: "bold", color: "var(--accent-color)" }}>
                                {roommate}
                            </span>
                            <ul className="ml-4 list-disc">
                                {taskList.map((task, idx) => (
                                    <li key={idx} style={{ color: "var(--text-color)" }}>
                                        {task}
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            ) : (
                <p style={{ color: "var(--hover-color)" }}>No tasks assigned.</p>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 mt-4">
                <button
                    onClick={() => setCurrentWeek(subWeeks(currentWeek, 1))}
                    className="p-2 rounded transition duration-300"
                    style={{
                        backgroundColor: "var(--secondary-color)",
                        color: "var(--white)",
                        border: "1px solid var(--hover-color)"
                    }}
                    disabled={currentWeek <= startOfWeek(new Date())}
                    aria-label="Previous week"
                >
                    ← Previous Week
                </button>

                <button
                    onClick={() => setCurrentWeek(addWeeks(currentWeek, 1))}
                    className="p-2 rounded transition duration-300"
                    style={{
                        backgroundColor: "var(--accent-color)",
                        color: "var(--white)",
                        border: "1px solid var(--hover-color)"
                    }}
                    aria-label="Next week"
                >
                    Next Week →
                </button>
            </div>
        </div>
    );
}
