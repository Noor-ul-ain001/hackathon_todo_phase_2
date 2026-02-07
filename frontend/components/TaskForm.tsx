import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TaskFormProps {
  onSubmit: (task: {
    title: string;
    description?: string;
    due_date?: Date | null;
    reminder_time?: Date | null;
    recurrence_type?: string;
    recurrence_interval?: number;
  }) => void;
  initialData?: {
    title: string;
    description?: string;
    due_date?: string | null;
    reminder_time?: string | null;
    recurrence_type?: string;
    recurrence_interval?: number;
  };
  submitText?: string;
}

export default function TaskForm({ onSubmit, initialData, submitText = "Add Task" }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    description: initialData?.description || "",
    recurrence_type: initialData?.recurrence_type || "none",
    recurrence_interval: initialData?.recurrence_interval || 1,
  });

  const [dueDate, setDueDate] = useState<Date | null>(
    initialData?.due_date ? new Date(initialData.due_date) : null
  );

  const [reminderTime, setReminderTime] = useState<Date | null>(
    initialData?.reminder_time ? new Date(initialData.reminder_time) : null
  );

  // Update form data when initialData changes
  useEffect(() => {
    setFormData({
      title: initialData?.title || "",
      description: initialData?.description || "",
      recurrence_type: initialData?.recurrence_type || "none",
      recurrence_interval: initialData?.recurrence_interval || 1,
    });
    setDueDate(initialData?.due_date ? new Date(initialData.due_date) : null);
    setReminderTime(initialData?.reminder_time ? new Date(initialData.reminder_time) : null);
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "recurrence_interval" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      due_date: dueDate,
      reminder_time: reminderTime,
    });
    // Reset form after submission if not using initial data
    if (!initialData) {
      setFormData({
        title: "",
        description: "",
        recurrence_type: "none",
        recurrence_interval: 1,
      });
      setDueDate(null);
      setReminderTime(null);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-slate-300">
            Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="mt-1 block w-full px-3 py-1.5 md:px-4 md:py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-300">
            Description
          </label>
          <input
            type="text"
            id="description"
            name="description"
            className="mt-1 block w-full px-3 py-1.5 md:px-4 md:py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
            value={formData.description}
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="due_date" className="block text-sm font-medium text-slate-300">
              Due Date
            </label>
            <DatePicker
              selected={dueDate}
              onChange={(date: Date | null) => setDueDate(date)}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="mt-1 block w-full px-3 py-1.5 md:px-4 md:py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
              placeholderText="Select due date"
              isClearable
            />
          </div>

          <div>
            <label htmlFor="reminder_time" className="block text-sm font-medium text-slate-300">
              Reminder Time
            </label>
            <DatePicker
              selected={reminderTime}
              onChange={(date: Date | null) => setReminderTime(date)}
              showTimeSelect
              dateFormat="MMMM d, yyyy h:mm aa"
              className="mt-1 block w-full px-3 py-1.5 md:px-4 md:py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
              placeholderText="Select reminder time"
              isClearable
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="recurrence_type" className="block text-sm font-medium text-slate-300">
              Recurrence
            </label>
            <select
              id="recurrence_type"
              name="recurrence_type"
              className="mt-1 block w-full px-3 py-1.5 md:px-4 md:py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
              value={formData.recurrence_type}
              onChange={handleChange}
            >
              <option value="none">None</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {formData.recurrence_type !== "none" && (
            <div>
              <label htmlFor="recurrence_interval" className="block text-sm font-medium text-slate-300">
                Repeat Every
              </label>
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="number"
                  id="recurrence_interval"
                  name="recurrence_interval"
                  min="1"
                  className="block w-20 px-3 py-1.5 md:px-4 md:py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:ring-2 focus:ring-accent focus:border-transparent text-sm"
                  value={formData.recurrence_interval}
                  onChange={handleChange}
                />
                <span className="text-slate-400 text-sm">
                  {formData.recurrence_type === "daily" && "day(s)"}
                  {formData.recurrence_type === "weekly" && "week(s)"}
                  {formData.recurrence_type === "monthly" && "month(s)"}
                  {formData.recurrence_type === "yearly" && "year(s)"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-4">
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 md:px-6 md:py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-accent hover:bg-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--accent-primary)] transition-colors duration-200"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}