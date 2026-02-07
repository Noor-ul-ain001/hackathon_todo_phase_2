interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative mx-auto p-4 border w-11/12 max-w-md shadow-xl rounded-lg bg-white">
        <div className="mt-3 text-center">
          <h3 className="text-lg font-medium text-primary-dark">{title}</h3>
          <div className="mt-2 px-4 py-3">
            <p className="text-sm text-gray-600">
              {message}
            </p>
          </div>
          <div className="items-center px-4 py-3 flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-primary-dark bg-white hover:bg-gray-100 transition-colors duration-200 w-full sm:w-auto"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 bg-primary-accent text-base font-medium rounded-md text-white hover:bg-primary-accent/90 transition-colors duration-200 w-full sm:w-auto"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}