"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import { useApp } from "@/contexts/AppContext";

export default function CalendarPage() {
  const router = useRouter();
  const { tasks, tasksLoading, refreshTasks, displayName } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  useEffect(() => {
    document.title = "Calendar - TaskFlow";

    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    // Refresh tasks when component mounts
    refreshTasks();
  }, [router, refreshTasks]);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const handlePreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (day: number | null) => {
    if (!day) return false;
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // Filter tasks for selected date
  const selectedDateTasks = tasks.filter(task => {
    if (!task.due_date) return false;
    const taskDate = new Date(task.due_date);
    return (
      taskDate.getDate() === selectedDate.getDate() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  // Get tasks for a specific day to show indicators
  const getTasksForDay = (day: number | null) => {
    if (!day) return [];
    return tasks.filter(task => {
      if (!task.due_date) return false;
      const taskDate = new Date(task.due_date);
      return (
        taskDate.getDate() === day &&
        taskDate.getMonth() === currentDate.getMonth() &&
        taskDate.getFullYear() === currentDate.getFullYear()
      );
    });
  };

  if (tasksLoading) {
    return (
      <div className="flex h-screen bg-[#0f172a]">
        <Sidebar />

        {/* Top Navigation Bar */}
        <div className="fixed top-0 left-64 right-80 h-16 bg-[#0f172a] border-b border-slate-700 z-30 flex items-center px-4 md:px-8">
          <div className="flex items-center justify-between w-full">
            <div className="text-lg font-bold text-white">Agentic Todo</div>
            <div className="flex items-center space-x-4">
              <button className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H6" />
                </svg>
              </button>
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                {displayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 md:ml-64 lg:mr-80 overflow-auto pt-16 md:pt-16">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
              <p className="mt-4 text-slate-400">Loading calendar...</p>
            </div>
          </div>
        </main>

        <RightSidebar tasks={[]} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0f172a]">
      <Sidebar />

      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-64 right-80 h-16 bg-[#0f172a] border-b border-slate-700 z-30 flex items-center px-4 md:px-8">
        <div className="flex items-center justify-between w-full">
          <div className="text-lg font-bold text-white">Agentic Todo</div>
          <div className="flex items-center space-x-4">
            <button className="text-slate-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H6" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold">
              {displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 md:ml-64 lg:mr-80 overflow-auto pt-16 md:pt-16 px-4 pb-4 md:px-6 md:pb-6 lg:p-8">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">Calendar</h1>
          <p className="mt-1 md:mt-2 text-sm md:text-base text-slate-400">Manage your tasks and events</p>
        </div>

        {/* Calendar Controls */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 gap-3 md:gap-0">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <button
                onClick={handleToday}
                className="px-3 py-1.5 md:px-4 md:py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm md:text-base rounded-lg transition-colors"
              >
                Today
              </button>
              <div className="flex space-x-2">
                <button
                  onClick={handlePreviousMonth}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Calendar Grid */}
          <div>
            {/* Day Headers */}
            <div className="grid grid-cols-7 gap-1 md:gap-2 mb-1 md:mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center py-2 md:py-3 font-semibold text-slate-300 text-xs md:text-sm">
                  {day.substring(0, 3)}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 gap-1 md:gap-2">
              {days.map((day, idx) => (
                <div
                  key={idx}
                  className={`
                    min-h-[60px] md:min-h-[80px] lg:min-h-[100px] p-1.5 md:p-2 lg:p-3 rounded-md md:rounded-lg border transition-all cursor-pointer
                    ${day === null
                      ? "bg-transparent border-transparent"
                      : isToday(day)
                        ? "bg-accent border-accent text-white font-bold"
                        : "bg-slate-900/50 border-slate-700 hover:border-accent/50 text-slate-300"
                    }
                  `}
                  onClick={() => day && setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
                >
                  {day && (
                    <>
                      <div className="text-xs md:text-sm font-semibold mb-1 md:mb-2">{day}</div>
                      {/* Task indicators */}
                      {getTasksForDay(day).length > 0 && (
                        <div className="space-y-0.5 md:space-y-1 hidden sm:block">
                          {getTasksForDay(day).slice(0, 2).map((task) => (
                            <div
                              key={task.id}
                              className="text-[0.6rem] md:text-xs bg-white/20 rounded px-1 md:px-2 py-0.5 md:py-1 truncate"
                              title={task.title}
                            >
                              {task.title.length > 10 ? task.title.substring(0, 10) + '...' : task.title}
                            </div>
                          ))}
                          {getTasksForDay(day).length > 2 && (
                            <div className="text-[0.6rem] md:text-xs text-white/60 px-1 md:px-2">
                              +{getTasksForDay(day).length - 2} more
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Date Events */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-semibold text-white mb-3 md:mb-4">
            Events for {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </h3>
          <div className="space-y-2 md:space-y-3">
            {selectedDateTasks.length > 0 ? (
              selectedDateTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 md:p-4 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-accent/50 transition-colors gap-2 sm:gap-0"
                >
                  <div className="flex items-start sm:items-center space-x-2 md:space-x-3 flex-1">
                    <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full mt-1 sm:mt-0 ${task.completed ? "bg-green-500" : "bg-amber-500"}`}></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm md:text-base text-white font-medium break-words">{task.title}</p>
                      {task.due_date && (
                        <p className="text-xs md:text-sm text-slate-400">
                          {new Date(task.due_date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      )}
                      {task.description && (
                        <p className="text-xs md:text-sm text-slate-500 mt-1 break-words">{task.description}</p>
                      )}
                    </div>
                  </div>
                  <span
                    className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[0.65rem] md:text-xs font-medium whitespace-nowrap ${
                      task.completed
                        ? "bg-green-500/20 text-green-400"
                        : "bg-amber-500/20 text-amber-400"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-center text-slate-400 py-6 md:py-8 text-sm md:text-base">No events scheduled for this date</p>
            )}
          </div>
        </div>
      </main>

      <RightSidebar tasks={tasks} />
    </div>
  );
}
