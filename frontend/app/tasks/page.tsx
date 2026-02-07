"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "@/lib/auth";
import { api } from "@/lib/api-client";
import TaskList from "@/components/TaskList";
import TaskForm from "@/components/TaskForm";
import TaskEditForm from "@/components/TaskEditForm";
import ConfirmDialog from "@/components/ConfirmDialog";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import VoiceChat, { VoiceChatHandle } from "@/components/voice/VoiceChat";
import { parseVoiceCommand, findTaskByVoice, extractTaskTitle } from "@/lib/voiceCommands";
import { useApp } from "@/contexts/AppContext";

export default function TasksPage() {
  const router = useRouter();
  const { displayName } = useApp();
  const voiceChatRef = useRef<VoiceChatHandle>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingTask, setEditingTask] = useState<any>(null);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Search, Filter, and Sort state
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "completed" | "incomplete">("all");
  const [sortBy, setSortBy] = useState<"id" | "title" | "status">("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Get user ID from localStorage and set page title
  useEffect(() => {
    // Set page title
    document.title = "Dashboard - Agentic Todo";

    const storedUserId = localStorage.getItem("user_id");
    const token = localStorage.getItem("auth_token");

    if (!token || !storedUserId) {
      // Redirect to sign-in if not authenticated
      router.push("/auth/signin");
      return;
    }

    setUserId(storedUserId);
    fetchTasks(storedUserId);
  }, [router]);

  const fetchTasks = async (userId: string) => {
    try {
      setLoading(true);
      const tasksData = await api.getTasks(userId);
      setTasks(tasksData);
    } catch (err: any) {
      setError(err.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: { title: string; description?: string }) => {
    if (!userId) return;

    try {
      const createdTask = await api.createTask(userId, taskData);
      setTasks([...tasks, createdTask]);
      setNewTask({ title: "", description: "" });

      // Trigger storage event to notify other pages/tabs
      localStorage.setItem('taskCreated', Date.now().toString());
    } catch (err: any) {
      setError(err.message || "Failed to create task");
    }
  };

  const handleUpdateTask = async (taskData: { title: string; description?: string }) => {
    if (!userId || !editingTask) return;

    try {
      const updatedTask = await api.updateTask(userId, editingTask.id, taskData);
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
      setEditingTask(null);

      // Trigger storage event to notify other pages/tabs
      localStorage.setItem('taskUpdated', Date.now().toString());
    } catch (err: any) {
      setError(err.message || "Failed to update task");
    }
  };

  const handleToggleComplete = async (taskId: number) => {
    if (!userId) return;

    try {
      const updatedTask = await api.toggleComplete(userId, taskId);
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));

      // Trigger storage event to notify other pages/tabs
      localStorage.setItem('taskUpdated', Date.now().toString());
    } catch (err: any) {
      setError(err.message || "Failed to update task");
    }
  };

  const handleDeleteTask = async () => {
    if (!userId || taskToDelete === null) return;

    try {
      await api.deleteTask(userId, taskToDelete);
      setTasks(tasks.filter(t => t.id !== taskToDelete));
      setTaskToDelete(null);

      // Trigger storage event to notify other pages/tabs
      localStorage.setItem('taskDeleted', Date.now().toString());
    } catch (err: any) {
      setError(err.message || "Failed to delete task");
    }
  };

  // Voice command handler - refreshes tasks after each action
  const handleVoiceCommand = async (commandType: string, transcript: string) => {
    if (!userId) return;

    const command = parseVoiceCommand(transcript);

    try {
      switch (command.action) {
        case 'add': {
          if (command.taskTitle) {
            const taskTitle = extractTaskTitle(transcript);

            // Create the task
            const createdTask = await api.createTask(userId, {
              title: taskTitle,
              description: ''
            });

            // Immediately update the UI
            setTasks(prevTasks => [...prevTasks, createdTask]);

            // Trigger storage event to notify other pages/tabs
            localStorage.setItem('taskCreated', Date.now().toString());

            voiceChatRef.current?.speak(`Task "${taskTitle}" has been added`);
          }
          break;
        }

        case 'complete': {
          if (command.taskTitle) {
            const task = findTaskByVoice(command.taskTitle, tasks);
            if (task) {
              // Toggle completion
              const updatedTask = await api.toggleComplete(userId, parseInt(task.id));

              // Immediately update the UI
              setTasks(prevTasks =>
                prevTasks.map(t => t.id === parseInt(task.id) ? updatedTask : t)
              );

              // Trigger storage event to notify other pages/tabs
              localStorage.setItem('taskUpdated', Date.now().toString());

              voiceChatRef.current?.speak(`Task "${task.title}" is now marked as complete`);
            } else {
              voiceChatRef.current?.speak('Sorry, I could not find that task');
            }
          }
          break;
        }

        case 'delete': {
          if (command.taskTitle) {
            const task = findTaskByVoice(command.taskTitle, tasks);
            if (task) {
              // Delete the task
              await api.deleteTask(userId, parseInt(task.id));

              // Immediately update the UI
              setTasks(prevTasks => prevTasks.filter(t => t.id !== parseInt(task.id)));

              // Trigger storage event to notify other pages/tabs
              localStorage.setItem('taskDeleted', Date.now().toString());

              voiceChatRef.current?.speak(`Task "${task.title}" has been deleted`);
            } else {
              voiceChatRef.current?.speak('Sorry, I could not find that task');
            }
          }
          break;
        }

        case 'list': {
          const totalTasks = tasks.length;
          const completedTasks = tasks.filter(t => t.completed).length;
          voiceChatRef.current?.speak(`You have ${totalTasks} tasks. ${completedTasks} completed and ${totalTasks - completedTasks} pending.`);
          break;
        }

        case 'incomplete': {
          if (command.taskTitle) {
            const task = findTaskByVoice(command.taskTitle, tasks);
            if (task) {
              // Only toggle if currently completed
              if (task.completed) {
                const updatedTask = await api.toggleComplete(userId, parseInt(task.id));

                // Immediately update the UI
                setTasks(prevTasks =>
                  prevTasks.map(t => t.id === parseInt(task.id) ? updatedTask : t)
                );

                // Trigger storage event to notify other pages/tabs
                localStorage.setItem('taskUpdated', Date.now().toString());

                voiceChatRef.current?.speak(`Task "${task.title}" is now marked as incomplete`);
              } else {
                voiceChatRef.current?.speak(`Task "${task.title}" is already incomplete`);
              }
            } else {
              voiceChatRef.current?.speak('Sorry, I could not find that task');
            }
          }
          break;
        }

        case 'update': {
          if (command.taskTitle) {
            const task = findTaskByVoice(command.taskTitle, tasks);
            if (task) {
              if (command.newContent) {
                // Update with new content
                const updatedTask = await api.updateTask(userId, parseInt(task.id), {
                  title: command.newContent,
                  description: task.description || ''
                });

                // Immediately update the UI
                setTasks(prevTasks =>
                  prevTasks.map(t => t.id === parseInt(task.id) ? updatedTask : t)
                );

                // Trigger storage event to notify other pages/tabs
                localStorage.setItem('taskUpdated', Date.now().toString());

                voiceChatRef.current?.speak(`Task updated to "${command.newContent}"`);
              } else {
                voiceChatRef.current?.speak(`What would you like to change the task to? Say "update task ${task.title} to new name"`);
              }
            } else {
              voiceChatRef.current?.speak('Sorry, I could not find that task');
            }
          }
          break;
        }

        case 'clear_completed': {
          const completedTasks = tasks.filter(t => t.completed);
          if (completedTasks.length === 0) {
            voiceChatRef.current?.speak('There are no completed tasks to clear');
          } else {
            // Delete all completed tasks
            for (const task of completedTasks) {
              await api.deleteTask(userId, task.id);
            }

            // Immediately update the UI
            setTasks(prevTasks => prevTasks.filter(t => !t.completed));

            // Trigger storage event to notify other pages/tabs
            localStorage.setItem('taskDeleted', Date.now().toString());

            voiceChatRef.current?.speak(`Cleared ${completedTasks.length} completed tasks`);
          }
          break;
        }

        case 'count': {
          const total = tasks.length;
          const completed = tasks.filter(t => t.completed).length;
          const pending = total - completed;
          voiceChatRef.current?.speak(`You have ${total} tasks in total. ${completed} completed and ${pending} pending.`);
          break;
        }

        case 'read': {
          if (tasks.length === 0) {
            voiceChatRef.current?.speak('You have no tasks');
          } else {
            const taskList = tasks.map((t, i) => `${i + 1}. ${t.title}`).join('. ');
            voiceChatRef.current?.speak(`Your tasks are: ${taskList}`);
          }
          break;
        }

        default:
          // Treat unknown commands as task input
          if (commandType === 'input' && transcript.trim()) {
            setNewTask({ title: transcript.trim(), description: '' });
          }
          break;
      }
    } catch (error) {
      console.error('Voice command error:', error);
      voiceChatRef.current?.speak('Sorry, there was an error processing your command');
      setError('Voice command failed. Please try again.');
    }
  };

  // Filter, search, and sort tasks
  const filteredAndSortedTasks = tasks
    .filter(task => {
      // Filter by status
      if (filterStatus === "completed" && !task.completed) return false;
      if (filterStatus === "incomplete" && task.completed) return false;

      // Search by keyword (case-insensitive, searches title and description)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const titleMatch = task.title?.toLowerCase().includes(query);
        const descMatch = task.description?.toLowerCase().includes(query);
        return titleMatch || descMatch;
      }

      return true;
    })
    .sort((a, b) => {
      let comparison = 0;

      // Sort by selected field
      if (sortBy === "id") {
        comparison = a.id - b.id;
      } else if (sortBy === "title") {
        comparison = (a.title || "").localeCompare(b.title || "");
      } else if (sortBy === "status") {
        comparison = (a.completed === b.completed) ? 0 : a.completed ? 1 : -1;
      }

      // Apply sort order
      return sortOrder === "asc" ? comparison : -comparison;
    });

  if (loading && tasks.length === 0) {
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
              <p className="mt-4 text-slate-400">Loading tasks...</p>
            </div>
          </div>
        </main>

        <RightSidebar tasks={[]} />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden">
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

      <main className="flex-1 md:ml-64 lg:mr-80 overflow-auto pt-16 md:pt-16 px-4 pb-4 md:p-8">
        {/* Dashboard Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-white">My Tasks Dashboard</h1>
          <p className="mt-1 md:mt-2 text-slate-400">
            Welcome back! Manage your tasks efficiently.
          </p>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-900/20 border border-red-500/50 p-4">
            <div className="text-sm text-red-400">{error}</div>
          </div>
        )}

        {/* Header with New Task Button */}
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <div className="flex-1"></div>
          <button className="px-3 py-1.5 md:px-4 md:py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-colors flex items-center space-x-2">
            <span className="text-sm md:text-base">+ New Task</span>
          </button>
        </div>

        {/* Task Statistics Cards */}
        <div className="grid grid-cols-1 gap-4 mb-4 md:mb-6">
          <div className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-lg p-4 md:p-6 relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <svg className="h-4 w-4 md:h-5 md:w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-white/80 text-xs md:text-sm">{tasks.filter(t => t.completed).length} Tasks</span>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-white/30 flex items-center justify-center">
                  <span className="text-white font-bold text-xs md:text-sm">
                    {tasks.length > 0 ? Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100) : 0}%
                  </span>
                </div>
              </div>
              <p className="text-white text-xl md:text-2xl font-bold">{tasks.filter(t => t.completed).length} Tasks</p>
              <p className="text-white/80 text-xs md:text-sm">Completed</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg p-4 md:p-6 relative overflow-hidden border border-slate-600">
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-amber-500/20 rounded-lg">
                    <svg className="h-4 w-4 md:h-5 md:w-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <span className="text-slate-300 text-xs md:text-sm">{tasks.filter(t => !t.completed).length} Tasks</span>
                </div>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-4 border-slate-600 flex items-center justify-center">
                  <span className="text-slate-300 font-bold text-xs md:text-sm">
                    {tasks.length > 0 ? Math.round((tasks.filter(t => !t.completed).length / tasks.length) * 100) : 0}%
                  </span>
                </div>
              </div>
              <p className="text-white text-xl md:text-2xl font-bold">{tasks.filter(t => !t.completed).length} Tasks</p>
              <p className="text-slate-400 text-xs md:text-sm">In Progress</p>
            </div>
          </div>
        </div>

        {/* Overview Chart */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 md:p-6 mb-4 md:mb-6">
          <div className="flex items-center justify-between mb-3 md:mb-4">
            <h2 className="text-base md:text-lg font-semibold text-white">Overview</h2>
            <button className="text-slate-400 hover:text-white">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            </button>
          </div>
          <div className="h-32 md:h-48 flex items-end justify-between space-x-1 md:space-x-2">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => {
              const height = Math.random() * 100 + 30;
              return (
                <div key={day} className="flex-1 flex flex-col items-center">
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      idx === 3 ? "bg-amber-500" : "bg-teal-500/50 hover:bg-teal-500"
                    }`}
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-[0.6rem] md:text-xs text-slate-400 mt-1 md:mt-2">{day}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-3 flex items-center justify-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-amber-500"></div>
              <span className="text-xs md:text-sm text-slate-400">22 Tasks Completed</span>
            </div>
          </div>
        </div>

        {/* Search, Filter, and Sort Controls */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 md:p-6 mb-4 md:mb-8">
          <div className="grid grid-cols-1 gap-4">
            {/* Search Bar */}
            <div>
              <label htmlFor="search" className="block text-xs md:text-sm font-medium text-slate-300 mb-2">
                Search Tasks
              </label>
              <div className="relative">
                <input
                  id="search"
                  type="text"
                  placeholder="Search by title or description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full px-3 py-1.5 md:px-4 md:py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-[var(--accent-primary)] focus:border-transparent text-sm"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-200"
                  >
                    <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Sort Controls */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-300 mb-2">
                Sort By
              </label>
              <div className="flex flex-col md:flex-row gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "id" | "title" | "status")}
                  className="flex-1 px-3 py-1.5 md:px-3 md:py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                >
                  <option value="id">ID</option>
                  <option value="title">Title</option>
                  <option value="status">Status</option>
                </select>
                <button
                  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                  className="px-3 py-1.5 md:px-3 md:py-2 border border-slate-700 rounded-lg hover:bg-slate-700 text-slate-300 focus:ring-2 focus:ring-accent text-sm"
                  title={sortOrder === "asc" ? "Ascending" : "Descending"}
                >
                  {sortOrder === "asc" ? (
                    <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 md:h-5 md:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Filter Buttons */}
            <div>
              <label className="block text-xs md:text-sm font-medium text-slate-300 mb-2">
                Filter by Status
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setFilterStatus("all")}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-colors text-sm ${
                    filterStatus === "all"
                      ? "bg-accent text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  All ({tasks.length})
                </button>
                <button
                  onClick={() => setFilterStatus("incomplete")}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-colors text-sm ${
                    filterStatus === "incomplete"
                      ? "bg-yellow-500 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  Pending ({tasks.filter(t => !t.completed).length})
                </button>
                <button
                  onClick={() => setFilterStatus("completed")}
                  className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-colors text-sm ${
                    filterStatus === "completed"
                      ? "bg-green-500 text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  Completed ({tasks.filter(t => t.completed).length})
                </button>
              </div>
            </div>

            {/* Active Filters Display */}
            {(searchQuery || filterStatus !== "all") && (
              <div className="mt-3 md:mt-4 flex flex-wrap items-center gap-2 text-xs md:text-sm text-slate-300">
                <span className="font-medium">Active filters:</span>
                {searchQuery && (
                  <span className="px-2 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded text-xs">
                    Search: "{searchQuery}"
                  </span>
                )}
                {filterStatus !== "all" && (
                  <span className="px-2 py-1 bg-purple-500/20 text-purple-400 border border-purple-500/30 rounded text-xs">
                    Status: {filterStatus}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("all");
                  }}
                  className="ml-2 text-accent hover:text-accent font-medium text-xs md:text-sm"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Create Task Form */}
        <div className="mb-4 md:mb-8 bg-slate-800/50 border border-slate-700 rounded-lg p-4 md:p-6">
          <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Create New Task</h2>
          <TaskForm
            onSubmit={handleCreateTask}
            initialData={newTask}
            submitText="Add Task"
          />
        </div>

        {/* Task List */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
          <div className="px-4 py-3 md:px-4 md:py-5 sm:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">
              Your Tasks
              {filteredAndSortedTasks.length !== tasks.length && (
                <span className="ml-2 text-xs md:text-sm font-normal text-slate-400">
                  (showing {filteredAndSortedTasks.length} of {tasks.length})
                </span>
              )}
            </h2>

            {tasks.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <p className="text-slate-400 text-sm md:text-base">No tasks yet. Create your first task above!</p>
              </div>
            ) : filteredAndSortedTasks.length === 0 ? (
              <div className="text-center py-8 md:py-12">
                <p className="text-slate-400 text-sm md:text-base">No tasks match your current filters.</p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setFilterStatus("all");
                  }}
                  className="mt-3 md:mt-4 text-accent hover:text-accent font-medium text-sm"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <TaskList
                tasks={filteredAndSortedTasks}
                onToggleComplete={handleToggleComplete}
                onEdit={setEditingTask}
                onDelete={setTaskToDelete}
              />
            )}
          </div>
        </div>

        {/* Edit Task Form */}
        {editingTask && (
          <div className="mt-4 md:mt-8 bg-slate-800/50 border border-slate-700 rounded-lg p-4 md:p-6">
            <h2 className="text-lg md:text-xl font-semibold text-white mb-3 md:mb-4">Edit Task</h2>
            <TaskEditForm
              task={editingTask}
              onSubmit={handleUpdateTask}
              onCancel={() => setEditingTask(null)}
            />
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmDialog
          isOpen={taskToDelete !== null}
          title="Confirm Deletion"
          message="Are you sure you want to delete this task? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onConfirm={handleDeleteTask}
          onCancel={() => setTaskToDelete(null)}
        />
      </main>

      {/* Right Sidebar */}
      <RightSidebar tasks={tasks} />

      {/* Voice Chat Assistant */}
      <VoiceChat
        ref={voiceChatRef}
        onCommand={handleVoiceCommand}
        onTranscriptChange={(transcript) => {
          // Optionally update UI with live transcript
        }}
      />
    </div>
  );
}