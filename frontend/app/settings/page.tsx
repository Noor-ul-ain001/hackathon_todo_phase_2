"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import { useApp } from "@/contexts/AppContext";

type TabType = "profile" | "security" | "notifications" | "appearance";

export default function SettingsPage() {
  const router = useRouter();
  const { theme, accentColor, setTheme, setAccentColor, tasks, tasksLoading, refreshTasks, displayName: contextDisplayName, setDisplayName: setContextDisplayName, userEmail } = useApp();
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);

  // Security settings state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  // Notification settings state
  const [taskReminders, setTaskReminders] = useState(true);
  const [weeklySummary, setWeeklySummary] = useState(true);
  const [collaborationUpdates, setCollaborationUpdates] = useState(false);
  const [taskDueSoon, setTaskDueSoon] = useState(true);
  const [newMessages, setNewMessages] = useState(true);
  const [doNotDisturbStart, setDoNotDisturbStart] = useState("21:00");
  const [doNotDisturbEnd, setDoNotDisturbEnd] = useState("07:00");

  // Appearance settings state (local state for non-context settings)
  const [fontSize, setFontSize] = useState(14);
  const [compactMode, setCompactMode] = useState(false);
  const [sidebarPosition, setSidebarPosition] = useState("left");

  useEffect(() => {
    document.title = "Settings - TaskFlow";

    const token = localStorage.getItem("auth_token");

    if (!token) {
      router.push("/auth/signin");
      return;
    }

    // Initialize from context
    if (userEmail) {
      setEmail(userEmail);
    }
    if (contextDisplayName) {
      setDisplayName(contextDisplayName);
    }

    // Refresh tasks for dynamic stats
    refreshTasks();

    // Initialize settings from localStorage or set defaults
    const savedSettings = localStorage.getItem("user_settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      if (settings.twoFactorEnabled !== undefined) setTwoFactorEnabled(settings.twoFactorEnabled);
      if (settings.taskReminders !== undefined) setTaskReminders(settings.taskReminders);
      if (settings.weeklySummary !== undefined) setWeeklySummary(settings.weeklySummary);
      if (settings.collaborationUpdates !== undefined) setCollaborationUpdates(settings.collaborationUpdates);
      if (settings.taskDueSoon !== undefined) setTaskDueSoon(settings.taskDueSoon);
      if (settings.newMessages !== undefined) setNewMessages(settings.newMessages);
      if (settings.doNotDisturbStart) setDoNotDisturbStart(settings.doNotDisturbStart);
      if (settings.doNotDisturbEnd) setDoNotDisturbEnd(settings.doNotDisturbEnd);
      if (settings.fontSize) setFontSize(settings.fontSize);
      if (settings.compactMode !== undefined) setCompactMode(settings.compactMode);
      if (settings.sidebarPosition) setSidebarPosition(settings.sidebarPosition);
    } else {
      // Set default values if no settings are saved
      setTwoFactorEnabled(false);
      setTaskReminders(true);
      setWeeklySummary(true);
      setCollaborationUpdates(false);
      setTaskDueSoon(true);
      setNewMessages(true);
      setDoNotDisturbStart("21:00");
      setDoNotDisturbEnd("07:00");
      setFontSize(14);
      setCompactMode(false);
      setSidebarPosition("left");
    }

    setLoading(false);
  }, [router, refreshTasks]);

  const handleSaveChanges = () => {
    // Save settings to localStorage
    const settings = {
      twoFactorEnabled,
      taskReminders,
      weeklySummary,
      collaborationUpdates,
      taskDueSoon,
      newMessages,
      doNotDisturbStart,
      doNotDisturbEnd,
      fontSize,
      compactMode,
      sidebarPosition
    };

    localStorage.setItem("user_settings", JSON.stringify(settings));

    // In a real app, this would make an API call
    if (activeTab === "profile") {
      // Save profile settings - update displayName in context
      setContextDisplayName(displayName);
      alert("Profile settings saved successfully!");
    } else if (activeTab === "security") {
      // Save security settings
      alert("Security settings saved successfully!");
    } else if (activeTab === "notifications") {
      // Save notification settings
      alert("Notification preferences saved successfully!");
    } else if (activeTab === "appearance") {
      // Appearance settings (theme and accent color) are auto-saved via context
      alert("Appearance settings saved successfully!");
    }
  };

  const tabs = [
    {
      id: "profile" as TabType,
      name: "Profile",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      ),
    },
    {
      id: "security" as TabType,
      name: "Security",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
      ),
    },
    {
      id: "notifications" as TabType,
      name: "Notifications",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
      ),
    },
    {
      id: "appearance" as TabType,
      name: "Appearance",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
          />
        </svg>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex h-screen bg-[#0f172a]">
        <Sidebar />

        {/* Top Navigation Bar */}
        <div className="fixed top-0 left-64 right-0 h-16 bg-[#0f172a] border-b border-slate-700 z-30 flex items-center px-4 md:px-8">
          <div className="flex items-center justify-between w-full">
            <div className="text-lg font-bold text-white">Agentic Todo</div>
            <div className="flex items-center space-x-4">
              <button className="text-slate-400 hover:text-white">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H6" />
                </svg>
              </button>
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold">
                {contextDisplayName?.charAt(0).toUpperCase() || 'U'}
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 md:ml-64 overflow-auto pt-16 md:pt-16">
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
              <p className="mt-4 text-slate-400">Loading settings...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0f172a]">
      <Sidebar />

      {/* Top Navigation Bar */}
      <div className="fixed top-0 left-64 right-0 h-16 bg-[#0f172a] border-b border-slate-700 z-30 flex items-center px-4 md:px-8">
        <div className="flex items-center justify-between w-full">
          <div className="text-lg font-bold text-white">Agentic Todo</div>
          <div className="flex items-center space-x-4">
            <button className="text-slate-400 hover:text-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H6" />
              </svg>
            </button>
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-white font-bold">
              {contextDisplayName?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 overflow-auto">
        <div className="pt-16 md:pt-16 px-4 pb-4 md:px-6 md:pb-6 lg:p-8">
          {/* Header */}
          <div className="mb-6 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-white">Settings</h1>
            <p className="mt-1 md:mt-2 text-sm md:text-base text-slate-400">Manage your account settings and preferences</p>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
            {/* Left Panel - Tabs */}
            <div className="lg:col-span-4">
              <div className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible space-x-2 lg:space-x-0 lg:space-y-2 pb-2 lg:pb-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 md:space-x-3 px-3 md:px-4 py-2 md:py-3 rounded-lg transition-all duration-200 whitespace-nowrap lg:w-full text-sm md:text-base ${
                      activeTab === tab.id
                        ? "bg-accent-light text-accent border border-accent/30"
                        : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    {tab.icon}
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Panel - Content */}
            <div className="lg:col-span-8">
              <div className="bg-slate-800/50 rounded-lg border border-slate-700 p-4 md:p-6">
                {activeTab === "profile" && (
                  <div>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-bold">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
                        <p className="text-sm text-slate-400">
                          Manage your personal information and account details
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Display Name */}
                      <div>
                        <label htmlFor="displayName" className="block text-sm font-medium text-slate-300 mb-2">
                          Display Name
                        </label>
                        <input
                          type="text"
                          id="displayName"
                          value={displayName}
                          onChange={(e) => setDisplayName(e.target.value)}
                          className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                        />
                      </div>

                      {/* Email Address */}
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          disabled
                          className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
                        />
                        <p className="mt-2 text-xs text-slate-500">
                          Contact support to change your email address
                        </p>
                      </div>

                      {/* Task Statistics */}
                      <div className="border-t border-slate-700 pt-6">
                        <h3 className="text-lg font-medium text-white mb-4">Your Activity</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                            <p className="text-sm text-slate-400 mb-1">Total Tasks</p>
                            <p className="text-2xl font-bold text-white">{tasks.length}</p>
                          </div>
                          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                            <p className="text-sm text-slate-400 mb-1">Completed</p>
                            <p className="text-2xl font-bold text-green-400">{tasks.filter(t => t.completed).length}</p>
                          </div>
                          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                            <p className="text-sm text-slate-400 mb-1">Pending</p>
                            <p className="text-2xl font-bold text-amber-400">{tasks.filter(t => !t.completed).length}</p>
                          </div>
                        </div>

                        {/* Completion Rate */}
                        {tasks.length > 0 && (
                          <div className="mt-4 bg-slate-900/50 border border-slate-700 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm text-slate-400">Completion Rate</p>
                              <p className="text-sm font-semibold text-accent">
                                {Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100)}%
                              </p>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                              <div
                                className="bg-accent h-2 rounded-full transition-all duration-500"
                                style={{
                                  width: `${(tasks.filter(t => t.completed).length / tasks.length) * 100}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={handleSaveChanges}
                          className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Security Settings</h2>
                    <p className="text-sm text-slate-400 mb-6">
                      Manage your password and security preferences
                    </p>

                    <div className="space-y-6">
                      {/* Change Password */}
                      <div className="border-b border-slate-700 pb-6">
                        <h3 className="text-lg font-medium text-white mb-4">Change Password</h3>

                        <div className="space-y-4">
                          <div>
                            <label htmlFor="currentPassword" className="block text-sm font-medium text-slate-300 mb-2">
                              Current Password
                            </label>
                            <input
                              type="password"
                              id="currentPassword"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                              placeholder="Enter your current password"
                            />
                          </div>

                          <div>
                            <label htmlFor="newPassword" className="block text-sm font-medium text-slate-300 mb-2">
                              New Password
                            </label>
                            <input
                              type="password"
                              id="newPassword"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                              placeholder="Enter your new password"
                            />
                          </div>

                          <div>
                            <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-slate-300 mb-2">
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              id="confirmNewPassword"
                              value={confirmNewPassword}
                              onChange={(e) => setConfirmNewPassword(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                              placeholder="Confirm your new password"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Two-Factor Authentication */}
                      <div className="border-b border-slate-700 pb-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium text-white">Two-Factor Authentication</h3>
                            <p className="text-sm text-slate-400 mt-1">
                              Add an extra layer of security to your account
                            </p>
                          </div>
                          <button
                            onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                            className={`px-4 py-2 ${
                              twoFactorEnabled
                                ? "bg-red-600 hover:bg-red-700"
                                : "bg-accent hover:bg-accent-hover"
                            } text-white text-sm font-medium rounded-lg transition-colors duration-200`}
                          >
                            {twoFactorEnabled ? "Disable" : "Enable"}
                          </button>
                        </div>
                      </div>

                      {/* Session Management */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Active Sessions</h3>
                        <div className="bg-slate-900/50 rounded-lg border border-slate-700 p-4">
                          <div className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                            <div>
                              <p className="text-white font-medium">Current Session</p>
                              <p className="text-sm text-slate-400">Your current browser session</p>
                            </div>
                            <span className="px-2 py-1 bg-accent-light text-accent text-xs rounded">Active</span>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                            <div>
                              <p className="text-white font-medium">Chrome on Windows</p>
                              <p className="text-sm text-slate-400">New York, NY • 2 hours ago</p>
                            </div>
                            <button className="text-slate-400 hover:text-slate-200 text-sm">
                              Revoke
                            </button>
                          </div>
                          <div className="flex items-center justify-between py-3 border-b border-slate-700 last:border-0">
                            <div>
                              <p className="text-white font-medium">Firefox on Mac</p>
                              <p className="text-sm text-slate-400">San Francisco, CA • 1 day ago</p>
                            </div>
                            <button className="text-slate-400 hover:text-slate-200 text-sm">
                              Revoke
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={handleSaveChanges}
                          className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Notification Preferences</h2>
                    <p className="text-sm text-slate-400 mb-6">
                      Control how you receive notifications
                    </p>

                    <div className="space-y-6">
                      {/* Email Notifications */}
                      <div className="border-b border-slate-700 pb-6">
                        <h3 className="text-lg font-medium text-white mb-4">Email Notifications</h3>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">Task reminders</p>
                              <p className="text-sm text-slate-400">Receive email notifications for upcoming tasks</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={taskReminders}
                                onChange={() => setTaskReminders(!taskReminders)}
                              />
                              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">Weekly summary</p>
                              <p className="text-sm text-slate-400">Get a weekly summary of your tasks and progress</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={weeklySummary}
                                onChange={() => setWeeklySummary(!weeklySummary)}
                              />
                              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">Collaboration updates</p>
                              <p className="text-sm text-slate-400">Receive notifications when others interact with your tasks</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={collaborationUpdates}
                                onChange={() => setCollaborationUpdates(!collaborationUpdates)}
                              />
                              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Push Notifications */}
                      <div className="border-b border-slate-700 pb-6">
                        <h3 className="text-lg font-medium text-white mb-4">Push Notifications</h3>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">Task due soon</p>
                              <p className="text-sm text-slate-400">Get push notifications for tasks due within 2 hours</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={taskDueSoon}
                                onChange={() => setTaskDueSoon(!taskDueSoon)}
                              />
                              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                            </label>
                          </div>

                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">New messages</p>
                              <p className="text-sm text-slate-400">Get notified when you receive new messages</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={newMessages}
                                onChange={() => setNewMessages(!newMessages)}
                              />
                              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Notification Schedule */}
                      <div className="border-b border-slate-700 pb-6">
                        <h3 className="text-lg font-medium text-white mb-4">Notification Schedule</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Do not disturb start</label>
                            <input
                              type="time"
                              value={doNotDisturbStart}
                              onChange={(e) => setDoNotDisturbStart(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Do not disturb end</label>
                            <input
                              type="time"
                              value={doNotDisturbEnd}
                              onChange={(e) => setDoNotDisturbEnd(e.target.value)}
                              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end pt-4">
                        <button
                          onClick={handleSaveChanges}
                          className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "appearance" && (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-2">Appearance Settings</h2>
                    <p className="text-sm text-slate-400 mb-6">
                      Customize the look and feel of your interface
                    </p>

                    <div className="space-y-6">
                      {/* Accent Color Selection */}
                      <div className="border-b border-slate-700 pb-6">
                        <h3 className="text-lg font-medium text-white mb-4">Accent Color</h3>
                        <p className="text-sm text-slate-400 mb-4">Choose your preferred accent color - changes apply instantly</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                          <div
                            onClick={() => setAccentColor("teal")}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              accentColor === "teal" ? "border-accent bg-accent-light" : "border-slate-700 hover:border-slate-600"
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-500 to-emerald-500"></div>
                              <p className="text-white font-medium text-sm">Teal</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setAccentColor("blue")}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              accentColor === "blue" ? "border-blue-500 bg-blue-500/10" : "border-slate-700 hover:border-slate-600"
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600"></div>
                              <p className="text-white font-medium text-sm">Blue</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setAccentColor("purple")}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              accentColor === "purple" ? "border-purple-500 bg-purple-500/10" : "border-slate-700 hover:border-slate-600"
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-purple-600"></div>
                              <p className="text-white font-medium text-sm">Purple</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setAccentColor("pink")}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              accentColor === "pink" ? "border-pink-500 bg-pink-500/10" : "border-slate-700 hover:border-slate-600"
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-pink-600"></div>
                              <p className="text-white font-medium text-sm">Pink</p>
                            </div>
                          </div>

                          <div
                            onClick={() => setAccentColor("orange")}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                              accentColor === "orange" ? "border-orange-500 bg-orange-500/10" : "border-slate-700 hover:border-slate-600"
                            }`}
                          >
                            <div className="flex flex-col items-center space-y-2">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600"></div>
                              <p className="text-white font-medium text-sm">Orange</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Dark/Light Mode */}
                      <div className="border-b border-slate-700 pb-6">
                        <h3 className="text-lg font-medium text-white mb-4">Theme Mode</h3>
                        <p className="text-sm text-slate-400 mb-4">Choose your preferred theme mode - changes apply instantly</p>

                        <div className="flex flex-wrap gap-4">
                          <button
                            onClick={() => setTheme("dark")}
                            className={`px-6 py-3 rounded-lg border font-medium transition-colors ${
                              theme === "dark"
                                ? "bg-slate-800 border-accent text-accent"
                                : "border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600"
                            }`}
                          >
                            🌙 Dark Mode
                          </button>
                          <button
                            onClick={() => setTheme("light")}
                            className={`px-6 py-3 rounded-lg border font-medium transition-colors ${
                              theme === "light"
                                ? "bg-slate-800 border-accent text-accent"
                                : "border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600"
                            }`}
                          >
                            ☀️ Light Mode
                          </button>
                          <button
                            onClick={() => setTheme("system")}
                            className={`px-6 py-3 rounded-lg border font-medium transition-colors ${
                              theme === "system"
                                ? "bg-slate-800 border-accent text-accent"
                                : "border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600"
                            }`}
                          >
                            💻 System
                          </button>
                        </div>
                      </div>

                      {/* Font Size */}
                      <div className="border-b border-slate-700 pb-6">
                        <h3 className="text-lg font-medium text-white mb-4">Font Size</h3>

                        <div className="flex items-center space-x-4">
                          <span className="text-slate-400 text-sm">Smaller</span>
                          <div className="flex-1">
                            <input
                              type="range"
                              min="12"
                              max="18"
                              value={fontSize}
                              onChange={(e) => setFontSize(parseInt(e.target.value))}
                              className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:bg-accent [&::-moz-range-thumb]:bg-accent"
                              style={{
                                accentColor: 'var(--accent-primary)'
                              }}
                            />
                          </div>
                          <span className="text-slate-400 text-sm">Larger</span>
                        </div>
                      </div>

                      {/* Compact Mode */}
                      <div className="border-b border-slate-700 pb-6">
                        <h3 className="text-lg font-medium text-white mb-4">Interface Density</h3>

                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-white font-medium">Compact Mode</p>
                              <p className="text-sm text-slate-400">Use more compact spacing in lists and forms</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={compactMode}
                                onChange={() => setCompactMode(!compactMode)}
                              />
                              <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* Sidebar Position */}
                      <div>
                        <h3 className="text-lg font-medium text-white mb-4">Sidebar Position</h3>

                        <div className="flex space-x-4">
                          <button
                            onClick={() => setSidebarPosition("left")}
                            className={`px-6 py-3 rounded-lg border font-medium transition-colors ${
                              sidebarPosition === "left"
                                ? "bg-slate-800 border-accent text-accent"
                                : "border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600"
                            }`}
                          >
                            Left
                          </button>
                          <button
                            onClick={() => setSidebarPosition("right")}
                            className={`px-6 py-3 rounded-lg border font-medium transition-colors ${
                              sidebarPosition === "right"
                                ? "bg-slate-800 border-accent text-accent"
                                : "border-slate-700 text-slate-400 hover:bg-slate-800 hover:border-slate-600"
                            }`}
                          >
                            Right
                          </button>
                        </div>
                      </div>

                      {/* Save Button */}
                      <div className="flex justify-end pt-6">
                        <button
                          onClick={handleSaveChanges}
                          className="px-6 py-3 bg-accent hover:bg-accent-hover text-white font-medium rounded-lg transition-colors duration-200 flex items-center space-x-2"
                        >
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>Save Changes</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
      </main>
    </div>
  );
}
