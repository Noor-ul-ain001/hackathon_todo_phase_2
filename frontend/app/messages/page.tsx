"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import RightSidebar from "@/components/RightSidebar";
import { useApp } from "@/contexts/AppContext";

interface Message {
  id: number;
  sender: string;
  avatar: string;
  subject: string;
  preview: string;
  timestamp: Date;
  read: boolean;
  category: "task" | "team" | "system";
}

export default function MessagesPage() {
  const router = useRouter();
  const { tasks, tasksLoading, refreshTasks, displayName } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [filter, setFilter] = useState<"all" | "unread" | "task" | "team" | "system">("all");

  useEffect(() => {
    document.title = "Messages - TaskFlow";

    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/auth/signin");
      return;
    }

    // Refresh tasks when component mounts
    refreshTasks();
  }, [router, refreshTasks]);

  // Generate messages from tasks
  useEffect(() => {
    const generatedMessages: Message[] = tasks.map((task, index) => {
      const baseTime = task.created_at ? new Date(task.created_at) : new Date(Date.now() - 1000 * 60 * 60 * index);

      if (task.completed) {
        return {
          id: task.id,
          sender: "System",
          avatar: "SY",
          subject: `Task Completed: ${task.title}`,
          preview: `Great job! You've successfully completed the '${task.title}' task${task.description ? ': ' + task.description : ''}...`,
          timestamp: task.updated_at ? new Date(task.updated_at) : baseTime,
          read: true,
          category: "system" as const
        };
      } else if (task.due_date) {
        const dueDate = new Date(task.due_date);
        const isUpcoming = dueDate > new Date();
        return {
          id: task.id,
          sender: "System",
          avatar: "SY",
          subject: isUpcoming ? `Upcoming Task: ${task.title}` : `Overdue Task: ${task.title}`,
          preview: `${isUpcoming ? 'Reminder' : 'Alert'}: Task '${task.title}' is ${isUpcoming ? 'due on' : 'overdue since'} ${dueDate.toLocaleDateString()}${task.description ? '. ' + task.description : ''}...`,
          timestamp: baseTime,
          read: !isUpcoming, // Overdue tasks are unread
          category: "task" as const
        };
      } else {
        return {
          id: task.id,
          sender: "You",
          avatar: "ME",
          subject: `Task Created: ${task.title}`,
          preview: `You created a new task '${task.title}'${task.description ? ': ' + task.description : ''}...`,
          timestamp: baseTime,
          read: true,
          category: "task" as const
        };
      }
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()); // Sort by most recent first

    setMessages(generatedMessages);
  }, [tasks]);

  const getTimeAgo = (timestamp: Date) => {
    const seconds = Math.floor((new Date().getTime() - timestamp.getTime()) / 1000);

    if (seconds < 60) return "just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  const getCategoryColor = (category: Message["category"]) => {
    switch (category) {
      case "task": return "bg-blue-500";
      case "team": return "bg-purple-500";
      case "system": return "bg-slate-500";
    }
  };

  const filteredMessages = messages.filter(msg => {
    if (filter === "all") return true;
    if (filter === "unread") return !msg.read;
    return msg.category === filter;
  });

  const unreadCount = messages.filter(m => !m.read).length;

  const handleMessageClick = (message: Message) => {
    setSelectedMessage(message);
    // Mark as read
    setMessages(messages.map(m =>
      m.id === message.id ? { ...m, read: true } : m
    ));
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
              <p className="mt-4 text-slate-400">Loading messages...</p>
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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">Messages</h1>
              <p className="mt-1 md:mt-2 text-sm md:text-base text-slate-400">
                {unreadCount > 0 ? `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}` : 'All messages read'}
              </p>
            </div>
            <button className="px-3 md:px-4 py-1.5 md:py-2 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors flex items-center space-x-2 text-sm md:text-base">
              <svg className="w-4 md:w-5 h-4 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>Compose</span>
            </button>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 md:p-4 mb-4 md:mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg font-medium transition-colors ${
                filter === "all"
                  ? "bg-accent text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              All Messages
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg font-medium transition-colors ${
                filter === "unread"
                  ? "bg-amber-500 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Unread {unreadCount > 0 && `(${unreadCount})`}
            </button>
            <button
              onClick={() => setFilter("task")}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg font-medium transition-colors ${
                filter === "task"
                  ? "bg-blue-500 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Tasks
            </button>
            <button
              onClick={() => setFilter("team")}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg font-medium transition-colors ${
                filter === "team"
                  ? "bg-purple-500 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              Team
            </button>
            <button
              onClick={() => setFilter("system")}
              className={`px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm rounded-lg font-medium transition-colors ${
                filter === "system"
                  ? "bg-slate-500 text-white"
                  : "bg-slate-700 text-slate-300 hover:bg-slate-600"
              }`}
            >
              System
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Messages List */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
            <div className="p-3 md:p-4 border-b border-slate-700">
              <h2 className="text-base md:text-lg font-semibold text-white">Inbox</h2>
            </div>
            <div className="divide-y divide-slate-700 max-h-[400px] md:max-h-[500px] lg:max-h-[600px] overflow-y-auto">
              {filteredMessages.map((message) => (
                <div
                  key={message.id}
                  onClick={() => handleMessageClick(message)}
                  className={`p-3 md:p-4 cursor-pointer transition-colors ${
                    selectedMessage?.id === message.id
                      ? "bg-accent-light border-l-4 border-accent"
                      : message.read
                      ? "hover:bg-slate-700/50"
                      : "bg-slate-900/50 hover:bg-slate-700/50"
                  }`}
                >
                  <div className="flex items-start space-x-2 md:space-x-3">
                    <div className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full ${getCategoryColor(message.category)} flex items-center justify-center text-white font-bold text-xs md:text-sm`}>
                      {message.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`text-xs md:text-sm font-medium truncate ${message.read ? "text-slate-300" : "text-white"}`}>
                          {message.sender}
                        </p>
                        <span className="text-[0.65rem] md:text-xs text-slate-400 ml-2 whitespace-nowrap">{getTimeAgo(message.timestamp)}</span>
                      </div>
                      <p className={`text-xs md:text-sm mb-1 truncate ${message.read ? "text-slate-400" : "text-white font-semibold"}`}>
                        {message.subject}
                      </p>
                      <p className="text-xs md:text-sm text-slate-500 truncate">{message.preview}</p>
                      {!message.read && (
                        <span className="inline-block mt-1 md:mt-2 px-2 py-0.5 md:py-1 bg-amber-500/20 text-amber-400 text-[0.65rem] md:text-xs rounded-full">
                          New
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {filteredMessages.length === 0 && (
                <div className="p-12 text-center">
                  <p className="text-slate-400">No messages found</p>
                </div>
              )}
            </div>
          </div>

          {/* Message Detail */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden">
            {selectedMessage ? (
              <>
                <div className="p-6 border-b border-slate-700">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getCategoryColor(selectedMessage.category)} flex items-center justify-center text-white font-bold`}>
                      {selectedMessage.avatar}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{selectedMessage.subject}</h3>
                      <p className="text-sm text-slate-400">From: {selectedMessage.sender}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {selectedMessage.timestamp.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <div className="text-slate-300 space-y-4">
                    <p>{selectedMessage.preview}</p>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                      incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                      nostrud exercitation ullamco laboris.
                    </p>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                      eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                      in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                  <div className="mt-6 flex space-x-3">
                    <button className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg transition-colors">
                      Reply
                    </button>
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                      Forward
                    </button>
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors">
                      Archive
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full p-12">
                <div className="text-center">
                  <svg className="w-16 h-16 text-slate-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-slate-400">Select a message to read</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <RightSidebar tasks={tasks} />
    </div>
  );
}
