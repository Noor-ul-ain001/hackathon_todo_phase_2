"use client";

import { useState } from "react";

interface RightSidebarProps {
  tasks: any[];
}

export default function RightSidebar({ tasks }: RightSidebarProps) {
  const [currentDate] = useState(new Date());

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    // Add the days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const days = getDaysInMonth(currentDate);
  const today = currentDate.getDate();
  const upcomingTasks = tasks.filter(t => !t.completed).slice(0, 4);

  return (
    <div className="hidden md:block fixed right-0 top-0 h-screen w-64 lg:w-80 bg-[#1e293b] border-l border-slate-700 overflow-y-auto p-4 lg:p-6">
      {/* Header with Month Navigation */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h3 className="text-base lg:text-lg font-semibold text-white">
          {monthNames[currentDate.getMonth()]}
        </h3>
        <div className="flex space-x-2">
          <button className="p-1 hover:bg-slate-700 rounded">
            <svg className="w-4 lg:w-5 h-4 lg:h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button className="p-1 hover:bg-slate-700 rounded">
            <svg className="w-4 lg:w-5 h-4 lg:h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Calendar */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 lg:p-4 mb-4 lg:mb-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-1 lg:gap-2 mb-1 lg:mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((day, idx) => (
            <div key={idx} className="text-center text-[0.6rem] lg:text-xs font-medium text-slate-400">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1 lg:gap-2">
          {days.map((day, idx) => (
            <div
              key={idx}
              className={`
                text-center text-[0.6rem] lg:text-sm py-1 rounded
                ${day === null ? "" : day === today
                  ? "bg-amber-500 text-white font-bold"
                  : "text-slate-300 hover:bg-slate-700 cursor-pointer"}
              `}
            >
              {day}
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="mb-4 lg:mb-6">
        <h3 className="text-xs lg:text-sm font-semibold text-white mb-3 lg:mb-4">Upcoming Tasks</h3>
        <div className="space-y-2 lg:space-y-3">
          {upcomingTasks.length > 0 ? (
            upcomingTasks.map((task, idx) => (
              <div
                key={task.id}
                className="flex items-start space-x-2 lg:space-x-3 p-2 lg:p-3 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-accent/50 transition-colors"
              >
                <div className="flex-shrink-0 mt-0.5">
                  <div className={`w-2 h-2 rounded-full ${
                    idx === 0 ? "bg-amber-500" :
                    idx === 1 ? "bg-blue-500" :
                    idx === 2 ? "bg-purple-500" : "bg-pink-500"
                  }`}></div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs lg:text-sm font-medium text-white truncate">
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-[0.6rem] lg:text-xs text-slate-400 truncate mt-0.5 lg:mt-1">
                      {task.description}
                    </p>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-xs lg:text-sm text-slate-400 text-center py-3 lg:py-4">
              No upcoming tasks
            </p>
          )}
        </div>
      </div>

      {/* Upgrade Card */}
      <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-lg p-4 lg:p-6 text-center">
        <div className="mb-2 lg:mb-3">
          <svg className="w-8 lg:w-12 h-8 lg:h-12 mx-auto text-white opacity-90" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </div>
        <h4 className="text-white font-bold text-base lg:text-lg mb-1 lg:mb-2">Get More Features</h4>
        <p className="text-indigo-100 text-xs lg:text-sm mb-2 lg:mb-4">with Pro</p>
        <button className="w-full py-1.5 lg:py-2 px-3 lg:px-4 bg-white text-purple-700 font-semibold rounded-lg hover:bg-indigo-50 transition-colors text-sm">
          Upgrade Plan
        </button>
      </div>
    </div>
  );
}
