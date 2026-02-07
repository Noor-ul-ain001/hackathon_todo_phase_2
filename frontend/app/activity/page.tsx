"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import { useApp } from "@/contexts/AppContext";

interface ActivityItem {
  id: number;
  type: "created" | "completed" | "updated" | "deleted";
  taskTitle: string;
  timestamp: Date;
  description: string;
}

export default function ActivityPage() {
  const router = useRouter();
  const { tasks, tasksLoading, refreshTasks, displayName } = useApp();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [filterType, setFilterType] = useState<string>("all");

  useEffect(() => {
    document.title = "Activity - TaskFlow";

    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    // Refresh tasks when component mounts
    refreshTasks();
  }, [router, refreshTasks]);

  // Generate activities from tasks
  useEffect(() => {
    const generatedActivities: ActivityItem[] = tasks.map((task, index) => {
      // Use task creation/update timestamps if available, otherwise use relative times
      const baseTime = task.created_at ? new Date(task.created_at) : new Date(Date.now() - 1000 * 60 * 60 * index);

      if (task.completed) {
        return {
          id: task.id,
          type: "completed" as const,
          taskTitle: task.title,
          timestamp: task.updated_at ? new Date(task.updated_at) : baseTime,
          description: "You marked this task as completed"
        };
      } else {
        return {
          id: task.id,
          type: "created" as const,
          taskTitle: task.title,
          timestamp: baseTime,
          description: "You created a new task"
        };
      }
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort by most recent first

    setActivities(generatedActivities);
  }, [tasks]);

  const getActivityIcon = (type: ActivityItem["type"]) => {
    switch (type) {
      case "created":
        return (
          <div className="p-2 bg-blue-500/20 rounded-lg">
            <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
        );
      case "completed":
        return (
          <div className="p-2 bg-green-500/20 rounded-lg">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        );
      case "updated":
        return (
          <div className="p-2 bg-amber-500/20 rounded-lg">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
        );
      case "deleted":
        return (
          <div className="p-2 bg-red-500/20 rounded-lg">
            <svg className="w-5 h-5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </div>
        );
    }
  };

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return timestamp.toLocaleDateString();
  };

  const filteredActivities = filterType === "all"
    ? activities
    : activities.filter(a => a.type === filterType);

  const activityStats = {
    total: activities.length,
    created: activities.filter(a => a.type === "created").length,
    completed: activities.filter(a => a.type === "completed").length,
    updated: activities.filter(a => a.type === "updated").length,
    deleted: activities.filter(a => a.type === "deleted").length,
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
              <p className="mt-4 text-slate-400">Loading activity...</p>
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
          <h1 className="text-2xl md:text-3xl font-bold text-white">Activity</h1>
          <p className="mt-1 md:mt-2 text-sm md:text-base text-slate-400">Track your task history and progress</p>
        </div>

        {/* Activity Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6">
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm text-slate-400 mb-1">Total Activities</p>
            <p className="text-xl md:text-2xl font-bold text-white">{activityStats.total}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm text-slate-400 mb-1">Tasks Created</p>
            <p className="text-xl md:text-2xl font-bold text-blue-400">{activityStats.created}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm text-slate-400 mb-1">Tasks Completed</p>
            <p className="text-xl md:text-2xl font-bold text-green-400">{activityStats.completed}</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 md:p-4">
            <p className="text-xs md:text-sm text-slate-400 mb-1">Tasks Updated</p>
            <p className="text-xl md:text-2xl font-bold text-amber-400">{activityStats.updated}</p>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterType("all")}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg font-medium transition-colors ${
                filterType === "all"
                  ? "bg-accent text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              All ({activityStats.total})
            </button>
            <button
              onClick={() => setFilterType("created")}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg font-medium transition-colors ${
                filterType === "created"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Created ({activityStats.created})
            </button>
            <button
              onClick={() => setFilterType("completed")}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg font-medium transition-colors ${
                filterType === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Completed ({activityStats.completed})
            </button>
            <button
              onClick={() => setFilterType("updated")}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg font-medium transition-colors ${
                filterType === "updated"
                  ? "bg-amber-500 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Updated ({activityStats.updated})
            </button>
            <button
              onClick={() => setFilterType("deleted")}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg font-medium transition-colors ${
                filterType === "deleted"
                  ? "bg-red-500 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Deleted ({activityStats.deleted})
            </button>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-4 md:mb-6">Recent Activity</h2>

          <div className="space-y-3 md:space-y-4">
            {filteredActivities.map((activity, index) => (
              <div
                key={activity.id}
                className="flex items-start space-x-3 md:space-x-4 p-3 md:p-4 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-accent/50 transition-colors"
              >
                {getActivityIcon(activity.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1 gap-1">
                    <p className="text-sm md:text-base text-white font-medium break-words">{activity.taskTitle}</p>
                    <span className="text-xs md:text-sm text-slate-400 whitespace-nowrap">{getTimeAgo(activity.timestamp)}</span>
                  </div>
                  <p className="text-xs md:text-sm text-slate-400">{activity.description}</p>
                </div>
              </div>
            ))}

            {filteredActivities.length === 0 && (
              <div className="text-center py-8 md:py-12">
                <p className="text-sm md:text-base text-slate-400">No activities found for this filter</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <RightSidebar tasks={tasks} />
    </div>
  );
}
