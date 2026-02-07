"""
Custom exception classes for the todo application.

This module defines specific exceptions for different error scenarios:
- ValidationError: Field validation failures
- TaskNotFoundError: Task ID not found in storage
- InvalidOperationError: Invalid business operations
"""


class ValidationError(ValueError):
    """
    Raised when task field validation fails.

    Examples:
        - Empty or whitespace-only title
        - Invalid field types
        - Field constraint violations
    """
    pass


class TaskNotFoundError(KeyError):
    """
    Raised when attempting to access a non-existent task ID.

    Examples:
        - get_task() with invalid ID
        - update_task() with invalid ID
        - delete_task() with invalid ID
        - toggle_completion() with invalid ID
    """
    pass


class InvalidOperationError(RuntimeError):
    """
    Raised when attempting an invalid business operation.

    Examples:
        - update_task() with neither title nor description provided
        - Operations that violate business rules
    """
    pass
