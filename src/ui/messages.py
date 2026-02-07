"""
User-facing message templates for the CLI.

Provides consistent, formatted messages for success, errors, and information.
All messages use prefixes for easy visual scanning:
- ✓ Success messages (green check) or [OK] on ASCII-only terminals
- ✗ Error messages (red X) or [X] on ASCII-only terminals
- ℹ Info messages (blue info) or [i] on ASCII-only terminals
"""

import sys


def _get_success_prefix() -> str:
    """Get success prefix, with ASCII fallback for Windows console."""
    try:
        # Test if we can encode Unicode check mark
        "✓".encode(sys.stdout.encoding or 'utf-8')
        return "✓"
    except (UnicodeEncodeError, LookupError):
        return "[OK]"


def _get_error_prefix() -> str:
    """Get error prefix, with ASCII fallback for Windows console."""
    try:
        # Test if we can encode Unicode X mark
        "✗".encode(sys.stdout.encoding or 'utf-8')
        return "✗"
    except (UnicodeEncodeError, LookupError):
        return "[X]"


# Cache prefixes at module load time
_SUCCESS = _get_success_prefix()
_ERROR = _get_error_prefix()


def task_created(task_id: int, title: str) -> str:
    """
    Format success message for task creation.

    Args:
        task_id: The ID of the newly created task
        title: The title of the newly created task

    Returns:
        Formatted success message

    Example:
        >>> task_created(1, "Buy groceries")
        '[OK] Task created successfully: 1 - Buy groceries'
    """
    return f"{_SUCCESS} Task created successfully: {task_id} - {title}"


def task_updated(task_id: int) -> str:
    """
    Format success message for task update.

    Args:
        task_id: The ID of the updated task

    Returns:
        Formatted success message

    Example:
        >>> task_updated(1)
        '[OK] Task 1 updated successfully'
    """
    return f"{_SUCCESS} Task {task_id} updated successfully"


def task_deleted(task_id: int) -> str:
    """
    Format success message for task deletion.

    Args:
        task_id: The ID of the deleted task

    Returns:
        Formatted success message

    Example:
        >>> task_deleted(1)
        '[OK] Task 1 deleted successfully'
    """
    return f"{_SUCCESS} Task {task_id} deleted successfully"


def task_completed(task_id: int) -> str:
    """
    Format success message for marking task complete.

    Args:
        task_id: The ID of the completed task

    Returns:
        Formatted success message

    Example:
        >>> task_completed(1)
        '[OK] Task 1 marked as complete'
    """
    return f"{_SUCCESS} Task {task_id} marked as complete"


def task_incomplete(task_id: int) -> str:
    """
    Format success message for marking task incomplete.

    Args:
        task_id: The ID of the task marked incomplete

    Returns:
        Formatted success message

    Example:
        >>> task_incomplete(1)
        '[OK] Task 1 marked as incomplete'
    """
    return f"{_SUCCESS} Task {task_id} marked as incomplete"


def empty_task_list() -> str:
    """
    Format message for empty task list.

    Returns:
        Friendly message suggesting how to add first task

    Example:
        >>> empty_task_list()
        "No tasks yet. Use 'add' to create your first task."
    """
    return "No tasks yet. Use 'add' to create your first task."


def task_count_summary(total: int, completed: int) -> str:
    """
    Format task count summary line.

    Args:
        total: Total number of tasks
        completed: Number of completed tasks

    Returns:
        Formatted summary message

    Example:
        >>> task_count_summary(3, 1)
        'Total: 3 tasks (1 completed)'
    """
    return f"Total: {total} tasks ({completed} completed)"


def error_validation(message: str) -> str:
    """
    Format validation error message.

    Args:
        message: The validation error details

    Returns:
        Formatted error message

    Example:
        >>> error_validation("Title is required and cannot be empty")
        '[X] Title is required and cannot be empty'
    """
    return f"{_ERROR} {message}"


def error_task_not_found(task_id: int) -> str:
    """
    Format task not found error message.

    Args:
        task_id: The ID that was not found

    Returns:
        Formatted error message

    Example:
        >>> error_task_not_found(999)
        '[X] Task with ID 999 not found'
    """
    return f"{_ERROR} Task with ID {task_id} not found"


def error_invalid_operation(message: str) -> str:
    """
    Format invalid operation error message.

    Args:
        message: The operation error details

    Returns:
        Formatted error message

    Example:
        >>> error_invalid_operation("Must provide title or description to update")
        '[X] Must provide title or description to update'
    """
    return f"{_ERROR} {message}"


def error_unknown_command(command: str) -> str:
    """
    Format unknown command error message.

    Args:
        command: The unrecognized command

    Returns:
        Formatted error message

    Example:
        >>> error_unknown_command("xyz")
        "[X] Unknown command 'xyz'. Use 'help' to see available commands."
    """
    return f"{_ERROR} Unknown command '{command}'. Use 'help' to see available commands."


def error_invalid_command() -> str:
    """
    Format invalid command error message for interactive mode.

    Returns:
        Formatted error message with helpful hint

    Example:
        >>> error_invalid_command()
        "[X] Invalid command or arguments. Type 'help' to see available commands."
    """
    return f"{_ERROR} Invalid command or arguments. Type 'help' to see available commands."
