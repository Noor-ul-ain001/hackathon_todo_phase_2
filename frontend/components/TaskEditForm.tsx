import { useState, useEffect } from "react";

interface TaskEditFormProps {
  task: {
    id: number;
    title: string;
    description?: string;
  };
  onSubmit: (task: { title: string; description?: string }) => void;
  onCancel: () => void;
}

export default function TaskEditForm({ task, onSubmit, onCancel }: TaskEditFormProps) {
  const [formData, setFormData] = useState({
    title: task.title,
    description: task.description || "",
  });

  useEffect(() => {
    setFormData({
      title: task.title,
      description: task.description || "",
    });
  }, [task]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 bg-gray-50 rounded-md">
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="edit-title" className="block text-sm font-medium text-primary-dark">
            Title *
          </label>
          <input
            type="text"
            id="edit-title"
            name="title"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-accent focus:ring-primary-accent text-sm text-primary-dark"
            value={formData.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="edit-description" className="block text-sm font-medium text-primary-dark">
            Description
          </label>
          <input
            type="text"
            id="edit-description"
            name="description"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-accent focus:ring-primary-accent text-sm text-primary-dark"
            value={formData.description}
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="mt-4 flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
        <button
          type="submit"
          className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-accent hover:bg-primary-accent/90 transition-colors duration-200"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-primary-dark bg-white hover:bg-gray-50 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}