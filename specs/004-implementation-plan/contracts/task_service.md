# TaskService Contract

**Version**: Phase I
**Date**: 2025-12-23
**Purpose**: Define the interface contract for the TaskService class

---

## Overview

The `TaskService` class provides the business logic layer for task management. It sits between the UI layer (CLI) and the data model (Task), orchestrating CRUD operations and maintaining task storage.

**Responsibilities**:
- Create, read, update, delete tasks
- Generate unique sequential IDs
- Manage in-memory task storage
- Enforce business rules and validation
- Provide task statistics

**Dependencies**:
- `models.task.Task` - Task data model
- `services.id_generator.IDGenerator` - ID generation

**Exceptions**:
- `ValidationError` - Field validation failures (from Task model)
- `TaskNotFoundError` - Task ID not found
- `InvalidOperationError` - Invalid business operation

---

## Class Interface

```python
class TaskService:
    """
    Service layer for task management operations.

    This class provides the core business logic for managing tasks,
    including CRUD operations, ID generation, and in-memory storage.

    Attributes:
        _tasks (dict[int, Task]): Internal task storage (ID → Task mapping)
        _id_generator (IDGenerator): Sequential ID generator

    Example:
        service = TaskService()
        task = service.create_task("Buy groceries", "Milk, eggs")
        all_tasks = service.get_all_tasks()
    """

    def __init__(self) -> None:
        """Initialize service with empty task storage and ID generator."""

    def create_task(self, title: str, description: str = "") -> Task:
        """Create new task with auto-generated ID."""

    def get_task(self, task_id: int) -> Task:
        """Retrieve task by ID."""

    def get_all_tasks(self) -> list[Task]:
        """Retrieve all tasks ordered by ID."""

    def update_task(
        self,
        task_id: int,
        title: Optional[str] = None,
        description: Optional[str] = None
    ) -> Task:
        """Update task fields (title and/or description)."""

    def delete_task(self, task_id: int) -> None:
        """Permanently remove task."""

    def toggle_completion(self, task_id: int, completed: bool) -> Task:
        """Mark task as complete or incomplete."""

    def get_task_count(self) -> tuple[int, int]:
        """Return (total_count, completed_count)."""
```

---

## Method Contracts

### `__init__()`

**Signature**:
```python
def __init__(self) -> None
```

**Purpose**: Initialize service with empty task storage and ID generator.

**Parameters**: None

**Returns**: None

**Side Effects**:
- Creates empty internal task dictionary
- Initializes ID generator starting at 1

**Example**:
```python
service = TaskService()
# Service ready to create tasks with IDs starting from 1
```

---

### `create_task(title, description="")`

**Signature**:
```python
def create_task(self, title: str, description: str = "") -> Task
```

**Purpose**: Create a new task with auto-generated unique ID.

**Parameters**:
- `title` (str): Required task title, non-empty
- `description` (str): Optional task details, defaults to ""

**Returns**:
- `Task`: Newly created task with:
  - Unique auto-generated ID
  - Provided title (normalized)
  - Provided description (or "")
  - completed = False

**Raises**:
- `ValidationError`: If title is empty, whitespace-only, or invalid type

**Side Effects**:
- Increments ID generator
- Adds task to internal storage
- Task is retrievable immediately

**Constraints**:
- Title cannot be empty or whitespace-only
- Title is normalized (trimmed, multiple spaces collapsed)
- Description None converted to ""
- ID is guaranteed unique (never reused)
- completed always defaults to False

**Example**:
```python
# With description
task = service.create_task("Buy groceries", "Milk, eggs, bread")
assert task.id == 1
assert task.title == "Buy groceries"
assert task.description == "Milk, eggs, bread"
assert task.completed == False

# Without description
task2 = service.create_task("Write report")
assert task2.id == 2
assert task2.description == ""

# Error case
try:
    service.create_task("")  # Empty title
except ValidationError as e:
    print(e)  # "Title is required and cannot be empty"
```

---

### `get_task(task_id)`

**Signature**:
```python
def get_task(self, task_id: int) -> Task
```

**Purpose**: Retrieve a single task by its unique ID.

**Parameters**:
- `task_id` (int): Unique task identifier

**Returns**:
- `Task`: The requested task object

**Raises**:
- `TaskNotFoundError`: If task_id does not exist in storage

**Side Effects**: None (read-only operation)

**Constraints**:
- Task ID must exist (not deleted)
- Deleted tasks cannot be retrieved

**Example**:
```python
task = service.get_task(1)
print(f"{task.id}: {task.title}")

# Error case
try:
    service.get_task(999)  # Non-existent ID
except TaskNotFoundError:
    print("Task not found")
```

---

### `get_all_tasks()`

**Signature**:
```python
def get_all_tasks(self) -> list[Task]
```

**Purpose**: Retrieve all tasks in the system, ordered by ID.

**Parameters**: None

**Returns**:
- `list[Task]`: All tasks, sorted by ID ascending. Empty list if no tasks.

**Raises**: None

**Side Effects**: None (read-only operation)

**Constraints**:
- Tasks are always sorted by ID (1, 2, 3, ...)
- Deleted tasks do not appear in list
- List is a copy (modifications don't affect storage)

**Example**:
```python
tasks = service.get_all_tasks()
for task in tasks:
    status = "✓" if task.completed else "✗"
    print(f"{task.id} {status} {task.title}")

# Empty case
service = TaskService()
assert service.get_all_tasks() == []
```

---

### `update_task(task_id, title=None, description=None)`

**Signature**:
```python
def update_task(
    self,
    task_id: int,
    title: Optional[str] = None,
    description: Optional[str] = None
) -> Task
```

**Purpose**: Update task fields (title and/or description).

**Parameters**:
- `task_id` (int): Task to update
- `title` (Optional[str]): New title (if provided)
- `description` (Optional[str]): New description (if provided)

**Returns**:
- `Task`: Updated task with new field values

**Raises**:
- `TaskNotFoundError`: If task_id does not exist
- `ValidationError`: If title is empty when provided
- `InvalidOperationError`: If neither title nor description provided

**Side Effects**:
- Replaces task in storage with updated version
- ID and completed status remain unchanged

**Constraints**:
- At least one field (title or description) must be provided
- ID cannot be changed
- completed status cannot be changed (use toggle_completion)
- Title validation same as create_task
- Description validation same as create_task

**Example**:
```python
# Update title only
task = service.update_task(1, title="Buy groceries and supplies")
assert task.title == "Buy groceries and supplies"

# Update description only
task = service.update_task(1, description="Due today")
assert task.description == "Due today"

# Update both
task = service.update_task(1, title="New title", description="New desc")

# Error: No fields provided
try:
    service.update_task(1)  # Neither title nor description
except InvalidOperationError:
    print("Must provide at least one field to update")

# Error: Empty title
try:
    service.update_task(1, title="")
except ValidationError:
    print("Title is required and cannot be empty")
```

---

### `delete_task(task_id)`

**Signature**:
```python
def delete_task(self, task_id: int) -> None
```

**Purpose**: Permanently remove a task from storage. ID is never reused.

**Parameters**:
- `task_id` (int): Task to delete

**Returns**: None

**Raises**:
- `TaskNotFoundError`: If task_id does not exist

**Side Effects**:
- Removes task from internal storage
- Task is no longer retrievable
- ID remains in ID generator (never reused)

**Constraints**:
- Operation is permanent (no undo)
- Deleted IDs are never assigned to new tasks
- Cannot delete same task twice (second attempt raises TaskNotFoundError)

**Example**:
```python
# Delete task
service.delete_task(1)

# Verify deletion
try:
    service.get_task(1)
except TaskNotFoundError:
    print("Task successfully deleted")

# ID not reused
new_task = service.create_task("New task")
assert new_task.id != 1  # ID 1 is never reused

# Error: Task already deleted
try:
    service.delete_task(1)  # Already deleted
except TaskNotFoundError:
    print("Task not found")
```

---

### `toggle_completion(task_id, completed)`

**Signature**:
```python
def toggle_completion(self, task_id: int, completed: bool) -> Task
```

**Purpose**: Mark task as complete or incomplete.

**Parameters**:
- `task_id` (int): Task to update
- `completed` (bool): True for complete, False for incomplete

**Returns**:
- `Task`: Updated task with new completed status

**Raises**:
- `TaskNotFoundError`: If task_id does not exist

**Side Effects**:
- Updates completed field in storage
- Other fields (ID, title, description) remain unchanged

**Constraints**:
- completed must be strict boolean (True/False)
- Can toggle between complete and incomplete multiple times

**Example**:
```python
# Mark as complete
task = service.toggle_completion(1, True)
assert task.completed == True

# Mark as incomplete
task = service.toggle_completion(1, False)
assert task.completed == False

# Error: Task not found
try:
    service.toggle_completion(999, True)
except TaskNotFoundError:
    print("Task not found")
```

---

### `get_task_count()`

**Signature**:
```python
def get_task_count(self) -> tuple[int, int]
```

**Purpose**: Get task statistics (total and completed counts).

**Parameters**: None

**Returns**:
- `tuple[int, int]`: (total_tasks, completed_tasks)
  - First int: Total number of tasks
  - Second int: Number of completed tasks

**Raises**: None

**Side Effects**: None (read-only operation)

**Constraints**:
- Completed count never exceeds total count
- Both counts are non-negative

**Example**:
```python
# With tasks
service.create_task("Task 1")
service.create_task("Task 2")
service.create_task("Task 3")
service.toggle_completion(1, True)
service.toggle_completion(2, True)

total, completed = service.get_task_count()
assert total == 3
assert completed == 2

# Empty service
service2 = TaskService()
total, completed = service2.get_task_count()
assert total == 0
assert completed == 0

# Display
print(f"Total: {total} tasks ({completed} completed)")
# Output: Total: 3 tasks (2 completed)
```

---

## Exception Definitions

### ValidationError

**Source**: `models.task` (raised by Task dataclass)

**When Raised**:
- Title is empty or whitespace-only
- Title is not string type
- Description is not string type (after None conversion)
- completed is not strict boolean type

**Handling**:
```python
try:
    task = service.create_task("")
except ValidationError as e:
    print(f"✗ {e}", file=sys.stderr)
```

---

### TaskNotFoundError

**Source**: `services.task_service`

**When Raised**:
- `get_task()` with non-existent ID
- `update_task()` with non-existent ID
- `delete_task()` with non-existent ID
- `toggle_completion()` with non-existent ID

**Handling**:
```python
try:
    task = service.get_task(999)
except TaskNotFoundError:
    print(f"✗ Task with ID 999 not found", file=sys.stderr)
```

---

### InvalidOperationError

**Source**: `services.task_service`

**When Raised**:
- `update_task()` with neither title nor description provided

**Handling**:
```python
try:
    service.update_task(1)  # No fields
except InvalidOperationError:
    print("✗ Must provide title or description to update", file=sys.stderr)
```

---

## Usage Patterns

### Pattern 1: Create and List Tasks

```python
service = TaskService()

# Create tasks
service.create_task("Buy groceries", "Milk, eggs")
service.create_task("Write report")
service.create_task("Plan vacation")

# List all
tasks = service.get_all_tasks()
for task in tasks:
    print(f"{task.id}: {task.title}")
```

### Pattern 2: Complete Task Workflow

```python
# Create
task = service.create_task("Important task")

# Update
service.update_task(task.id, description="This is urgent")

# Complete
service.toggle_completion(task.id, True)

# Verify
updated_task = service.get_task(task.id)
assert updated_task.completed == True
```

### Pattern 3: Error Handling

```python
def safe_delete_task(service: TaskService, task_id: int) -> bool:
    """Safely delete task, return success status."""
    try:
        service.delete_task(task_id)
        return True
    except TaskNotFoundError:
        print(f"Task {task_id} not found", file=sys.stderr)
        return False
```

---

## Thread Safety

**Phase I**: Single-threaded operation assumed. No thread safety guarantees.

**Future Phases**: ID generator and storage will need locking for concurrent access.

---

## Performance Characteristics

| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| create_task | O(1) | O(1) per task |
| get_task | O(1) | O(1) |
| get_all_tasks | O(n log n) | O(n) |
| update_task | O(1) | O(1) |
| delete_task | O(1) | O(1) |
| toggle_completion | O(1) | O(1) |
| get_task_count | O(n) | O(1) |

**Notes**:
- `get_all_tasks()` requires sorting (O(n log n))
- `get_task_count()` iterates all tasks to count completed
- All other operations are O(1) due to dict-based storage

---

## Contract Guarantees

The `TaskService` contract guarantees:

1. **ID Uniqueness**: Every task has a unique ID, never reused
2. **ID Sequentiality**: IDs are sequential integers starting from 1
3. **Atomic Operations**: Each method call is atomic (no partial states)
4. **Data Integrity**: Tasks remain valid after all operations
5. **Immutable IDs**: Task IDs never change after creation
6. **Completed Default**: New tasks always start with completed=False
7. **Validation**: All field constraints enforced before storage
8. **Error Clarity**: Specific exceptions for each failure type

---

## Summary

The `TaskService` contract provides:
- **7 Public Methods**: Clear, focused responsibilities
- **3 Exception Types**: Specific error handling
- **Type Safety**: Full type hints for all signatures
- **O(1) Operations**: Fast CRUD for typical usage
- **Simple Storage**: In-memory dict for Phase I
- **Test-Friendly**: Easy to mock and test

This contract serves as the foundation for the CLI layer and ensures consistent behavior across all task management operations.
