"""
Task service layer - CRUD operations for task management.

Provides business logic for creating, reading, updating, and deleting tasks.
Manages in-memory task storage and ID generation.
"""

from typing import Optional, List, Tuple
from ..models.task import Task
from .id_generator import IDGenerator
from ..utils.exceptions import ValidationError, TaskNotFoundError, InvalidOperationError


class TaskService:
    """
    Service layer for task management operations.

    This class provides the core business logic for managing tasks,
    including CRUD operations, ID generation, and in-memory storage.

    Attributes:
        _tasks (dict[int, Task]): Internal task storage (ID → Task mapping)
        _id_generator (IDGenerator): Sequential ID generator

    Example:
        >>> service = TaskService()
        >>> task = service.create_task("Buy groceries", "Milk, eggs")
        >>> task.id
        1
        >>> all_tasks = service.get_all_tasks()
        >>> len(all_tasks)
        1
    """

    def __init__(self) -> None:
        """
        Initialize service with empty task storage and ID generator.

        Creates:
            - Empty task dictionary for O(1) lookups
            - ID generator starting from 1
        """
        self._tasks: dict[int, Task] = {}
        self._id_generator = IDGenerator()

    def create_task(self, title: str, description: str = "") -> Task:
        """
        Create a new task with auto-generated unique ID.

        Args:
            title (str): Required task title, non-empty
            description (str): Optional task details, defaults to ""

        Returns:
            Task: Newly created task with:
                - Unique auto-generated ID
                - Provided title (normalized)
                - Provided description (or "")
                - completed = False

        Raises:
            ValidationError: If title is empty, whitespace-only, or invalid type

        Side Effects:
            - Increments ID generator
            - Adds task to internal storage
            - Task is retrievable immediately

        Constraints:
            - Title cannot be empty or whitespace-only
            - Title is normalized (trimmed, multiple spaces collapsed)
            - Description None converted to ""
            - ID is guaranteed unique (never reused)
            - completed always defaults to False

        Example:
            >>> service = TaskService()
            >>> task = service.create_task("Buy groceries", "Milk, eggs, bread")
            >>> task.id
            1
            >>> task.title
            'Buy groceries'
            >>> task.description
            'Milk, eggs, bread'
            >>> task.completed
            False

            >>> task2 = service.create_task("Write report")
            >>> task2.id
            2
            >>> task2.description
            ''
        """
        # Generate unique ID
        task_id = self._id_generator.generate()

        # Create Task instance (validation happens in Task.__post_init__)
        task = Task(
            id=task_id,
            title=title,
            description=description,
            completed=False
        )

        # Store task
        self._tasks[task_id] = task

        return task

    def get_task(self, task_id: int) -> Task:
        """
        Retrieve a single task by its unique ID.

        Args:
            task_id (int): Unique task identifier

        Returns:
            Task: The requested task object

        Raises:
            TaskNotFoundError: If task_id does not exist in storage

        Side Effects: None (read-only operation)

        Constraints:
            - Task ID must exist (not deleted)
            - Deleted tasks cannot be retrieved

        Example:
            >>> service = TaskService()
            >>> task = service.create_task("Buy groceries")
            >>> retrieved = service.get_task(1)
            >>> retrieved.id
            1
            >>> retrieved.title
            'Buy groceries'
        """
        task = self._tasks.get(task_id)
        if task is None:
            raise TaskNotFoundError(f"Task with ID {task_id} not found")
        return task

    def get_all_tasks(self) -> List[Task]:
        """
        Retrieve all tasks in the system, ordered by ID.

        Returns:
            List[Task]: All tasks, sorted by ID ascending. Empty list if no tasks.

        Raises: None

        Side Effects: None (read-only operation)

        Constraints:
            - Tasks are always sorted by ID (1, 2, 3, ...)
            - Deleted tasks do not appear in list
            - List is a copy (modifications don't affect storage)

        Example:
            >>> service = TaskService()
            >>> task1 = service.create_task("First task")
            >>> task2 = service.create_task("Second task")
            >>> tasks = service.get_all_tasks()
            >>> len(tasks)
            2
            >>> tasks[0].id
            1
            >>> tasks[1].id
            2
        """
        return sorted(self._tasks.values(), key=lambda t: t.id)

    def update_task(
        self,
        task_id: int,
        title: Optional[str] = None,
        description: Optional[str] = None
    ) -> Task:
        """
        Update task fields (title and/or description).

        Args:
            task_id (int): Task to update
            title (Optional[str]): New title (if provided)
            description (Optional[str]): New description (if provided)

        Returns:
            Task: Updated task with new field values

        Raises:
            TaskNotFoundError: If task_id does not exist
            ValidationError: If title is empty when provided
            InvalidOperationError: If neither title nor description provided

        Side Effects:
            - Replaces task in storage with updated version
            - ID and completed status remain unchanged

        Constraints:
            - At least one field (title or description) must be provided
            - ID cannot be changed
            - completed status cannot be changed (use toggle_completion)
            - Title validation same as create_task
            - Description validation same as create_task

        Example:
            >>> service = TaskService()
            >>> task = service.create_task("Buy groceries", "Milk, eggs")
            >>> updated = service.update_task(1, title="Buy groceries and supplies")
            >>> updated.title
            'Buy groceries and supplies'
        """
        # Check if task exists
        if task_id not in self._tasks:
            raise TaskNotFoundError(f"Task with ID {task_id} not found")

        # Check if at least one field is provided
        if title is None and description is None:
            raise InvalidOperationError("Must provide title or description to update")

        # Get current task
        current_task = self._tasks[task_id]

        # Use current values if not provided
        new_title = title if title is not None else current_task.title
        new_description = description if description is not None else current_task.description

        # Create updated task with new values
        updated_task = Task(
            id=current_task.id,
            title=new_title,
            description=new_description,
            completed=current_task.completed
        )

        # Store updated task
        self._tasks[task_id] = updated_task

        return updated_task

    def delete_task(self, task_id: int) -> None:
        """
        Permanently remove a task from storage. ID is never reused.

        Args:
            task_id (int): Task to delete

        Returns: None

        Raises:
            TaskNotFoundError: If task_id does not exist

        Side Effects:
            - Removes task from internal storage
            - Task is no longer retrievable
            - ID remains in ID generator (never reused)

        Constraints:
            - Operation is permanent (no undo)
            - Deleted IDs are never assigned to new tasks
            - Cannot delete same task twice (second attempt raises TaskNotFoundError)

        Example:
            >>> service = TaskService()
            >>> task = service.create_task("Buy groceries")
            >>> service.delete_task(1)
            >>> len(service.get_all_tasks())
            0
        """
        if task_id not in self._tasks:
            raise TaskNotFoundError(f"Task with ID {task_id} not found")

        # Remove task from storage
        del self._tasks[task_id]

    def toggle_completion(self, task_id: int, completed: bool) -> Task:
        """
        Mark task as complete or incomplete.

        Args:
            task_id (int): Task to update
            completed (bool): True for complete, False for incomplete

        Returns:
            Task: Updated task with new completed status

        Raises:
            TaskNotFoundError: If task_id does not exist

        Side Effects:
            - Updates completed field in storage
            - Other fields (ID, title, description) remain unchanged

        Constraints:
            - completed must be strict boolean (True/False)
            - Can toggle between complete and incomplete multiple times

        Example:
            >>> service = TaskService()
            >>> task = service.create_task("Buy groceries")
            >>> updated = service.toggle_completion(1, True)
            >>> updated.completed
            True
        """
        if task_id not in self._tasks:
            raise TaskNotFoundError(f"Task with ID {task_id} not found")

        current_task = self._tasks[task_id]

        # Create updated task with new completion status
        updated_task = Task(
            id=current_task.id,
            title=current_task.title,
            description=current_task.description,
            completed=completed
        )

        # Store updated task
        self._tasks[task_id] = updated_task

        return updated_task

    def get_task_count(self) -> Tuple[int, int]:
        """
        Get task statistics (total and completed counts).

        Returns:
            Tuple[int, int]: (total_tasks, completed_tasks)
                - First int: Total number of tasks
                - Second int: Number of completed tasks

        Raises: None

        Side Effects: None (read-only operation)

        Constraints:
            - Completed count never exceeds total count
            - Both counts are non-negative

        Example:
            >>> service = TaskService()
            >>> service.create_task("Task 1")
            >>> service.create_task("Task 2")
            >>> service.toggle_completion(1, True)
            >>> total, completed = service.get_task_count()
            >>> total
            2
            >>> completed
            1
        """
        total_count = len(self._tasks)
        completed_count = sum(1 for task in self._tasks.values() if task.completed)
        return total_count, completed_count
