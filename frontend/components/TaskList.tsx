"use client";

import { useState } from "react";

interface Task {
  id: number;
  title: string;
  description?: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (id: number) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskList({ tasks, onToggleComplete, onEdit, onDelete }: TaskListProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null);
  const [expandedTask, setExpandedTask] = useState<number | null>(null);

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No tasks yet. Create your first task!</p>
      </div>
    );
  }

  return (
    <div>
      <ul className="divide-y divide-slate-700">
        {tasks.map((task) => (
          <li key={task.id} className="py-3 md:py-4 hover:bg-slate-800/30 transition-colors duration-200 px-3 md:px-4 rounded-lg">
            <div className="flex flex-col md:flex-row items-start gap-3 md:gap-4">
              {/* Task Content */}
              <div className="flex items-start flex-1 min-w-0">
                <button
                  onClick={() => onToggleComplete(task.id)}
                  className={`h-5 w-5 md:h-6 md:w-6 rounded-full border-2 mr-2 md:mr-3 flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                    task.completed
                      ? "bg-teal-500 border-accent hover:bg-teal-600"
                      : "border-slate-500 hover:border-teal-400"
                  }`}
                  title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {task.completed && (
                    <svg className="h-3 w-3 md:h-4 md:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mb-1">
                    <p className={`text-base md:text-lg font-medium ${task.completed ? "line-through text-slate-500" : "text-white"}`}>
                      {task.title}
                    </p>
                    {task.completed && (
                      <span className="px-2 py-0.5 bg-accent-light text-accent text-xs font-medium rounded-full border border-accent/30">
                        Completed
                      </span>
                    )}
                  </div>
                  {task.description && (
                    <p className={`text-xs md:text-sm ${task.completed ? "line-through text-slate-600" : "text-slate-400"} ${expandedTask === task.id ? "" : "line-clamp-2"}`}>
                      {task.description}
                    </p>
                  )}
                  {task.description && task.description.length > 100 && (
                    <button
                      onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                      className="text-xs text-accent hover:text-accent mt-1"
                    >
                      {expandedTask === task.id ? "Show less" : "Show more"}
                    </button>
                  )}
                </div>
              </div>

              {/* Action Buttons - Responsive Layout */}
              <div className="flex flex-wrap gap-2 w-full md:w-auto">
                {/* Complete/Uncomplete Button */}
                <button
                  onClick={() => onToggleComplete(task.id)}
                  className={`px-2 py-1.5 md:px-3 md:py-1.5 text-xs md:text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-1.5 ${
                    task.completed
                      ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                      : "bg-teal-600 hover:bg-teal-700 text-white"
                  }`}
                  title={task.completed ? "Mark as incomplete" : "Mark as complete"}
                >
                  {task.completed ? (
                    <>
                      <svg className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span className="hidden md:inline">Undo</span>
                      <span className="md:hidden">Undo</span>
                    </>
                  ) : (
                    <>
                      <svg className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="hidden md:inline">Complete</span>
                      <span className="md:hidden">Cmpl</span>
                    </>
                  )}
                </button>

                {/* View/Details Button */}
                <button
                  onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                  className="hidden md:flex px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 text-sm font-medium rounded-lg transition-colors duration-200 items-center gap-1.5"
                  title="View details"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View
                </button>

                {/* Update/Edit Button */}
                <button
                  onClick={() => onEdit(task)}
                  className="px-2 py-1.5 md:px-3 md:py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-1.5"
                  title="Edit task"
                >
                  <svg className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  <span className="hidden md:inline">Edit</span>
                  <span className="md:hidden">Edt</span>
                </button>

                {/* Delete Button */}
                <button
                  onClick={() => setShowDeleteConfirm(task.id)}
                  className="px-2 py-1.5 md:px-3 md:py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-medium rounded-lg transition-colors duration-200 flex items-center gap-1.5"
                  title="Delete task"
                >
                  <svg className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span className="hidden md:inline">Delete</span>
                  <span className="md:hidden">Del</span>
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
          <div className="relative mx-auto p-5 border border-slate-700 w-11/12 max-w-md shadow-xl rounded-lg bg-slate-800">
            <div className="mt-3 text-center">
              <h3 className="text-lg font-medium text-white">Confirm Deletion</h3>
              <div className="mt-2 px-7 py-3">
                <p className="text-sm text-slate-400">
                  Are you sure you want to delete this task? This action cannot be undone.
                </p>
              </div>
              <div className="items-center px-4 py-3 flex justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 border border-slate-600 text-base font-medium rounded-lg text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onDelete(showDeleteConfirm);
                    setShowDeleteConfirm(null);
                  }}
                  className="px-4 py-2 bg-red-600 text-base font-medium rounded-lg text-white hover:bg-red-700 transition-colors duration-200"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}