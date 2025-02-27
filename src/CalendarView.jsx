import React, { useState } from "react";
import { addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, format, eachDayOfInterval } from "date-fns";
import ScheduleView from "./ScheduleView";

export default function CalendarView({ tasks, roommates }) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handleDateClick = (day) => setSelectedDate(day);
    const handleCloseModal = () => setSelectedDate(null);

    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const weekStart = startOfWeek(monthStart);
    const weekEnd = endOfWeek(monthEnd);
    const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

    return (
        <div className="calendar-view p-8 bg-white rounded-lg shadow-lg w-full max-w-4xl">
            {/* Navigation */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={handlePrevMonth} className="p-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition">
                    ❮
                </button>
                <h2 className="text-2xl font-semibold text-black">{format(currentMonth, "MMMM yyyy")}</h2>
                <button onClick={handleNextMonth} className="p-3 bg-gray-300 rounded-lg hover:bg-gray-400 transition">
                    ❯
                </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 text-center font-semibold text-gray-600 border-b pb-2 mb-4 tracking-wide">
                {["S", "M", "T", "W", "TH", "F", "S"].map((day, index) => (
                    <div key={index} className="p-3 w-full flex justify-center">
                        {day}
                    </div>
                ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-4">
                {days.map(day => (
                    <div 
                        key={day} 
                        className={`
                            p-5 text-center rounded-lg cursor-pointer transition duration-200 text-lg
                            ${format(day, "MM") !== format(currentMonth, "MM") ? "text-gray-400" : "text-black"} 
                            ${format(day, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd") ? "bg-blue-300 text-white font-bold" : "hover:bg-gray-200"}
                        `}
                        onClick={() => handleDateClick(day)}
                    >
                        {format(day, "d")}
                    </div>
                ))}
            </div>

            {/* {selectedDate && (
                <div className="fixed inset-0 bg-black bg-opacity-20 flex justify-center items-center p-6">
                    <div className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-lg">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">
                                Schedule for {format(selectedDate, "MMMM d, yyyy")}
                            </h3>
                            <button 
                                onClick={handleCloseModal} 
                                className="p-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
                            >
                                ✕
                            </button>
                        </div>
                        <ScheduleView tasks={tasks || []} roommates={roommates || []} />
                    </div>
                </div>
            )} */}
        </div>
    );
}
