"""
Task data model.

Defines the Task entity with 4 fields:
- id: Unique sequential integer identifier
- title: Required task title (non-empty)
- description: Optional task details
- completed: Boolean completion status
"""

from dataclasses import dataclass
from ..utils.validators import validate_title, normalize_title, validate_description
from ..utils.exceptions import ValidationError


@dataclass
class Task:
    """
    Task entity representing a single todo item.

    Attributes:
        id (int): Unique auto-generated identifier (positive integer)
        title (str): Task title, required and non-empty
        description (str): Optional task details, defaults to empty string
        completed (bool): Completion status, defaults to False

    Example:
        >>> task = Task(id=1, title="Buy groceries", description="Milk, eggs", completed=False)
        >>> task.id
        1
        >>> task.title
        'Buy groceries'
        >>> task.completed
        False
    """

    id: int
    title: str
    description: str = ""
    completed: bool = False

    def __post_init__(self) -> None:
        """
        Validate and normalize task fields after initialization.

        This method runs automatically after dataclass __init__.

        Raises:
            ValidationError: If any field validation fails

        Validation Rules:
            - id: Must be positive integer
            - title: Must be non-empty string, gets normalized (trimmed, whitespace collapsed)
            - description: None converted to "", validated as string
            - completed: Must be strict boolean (True/False)
        """
        # Validate ID
        if not isinstance(self.id, int):
            raise ValidationError("ID must be an integer")
        if self.id <= 0:
            raise ValidationError("ID must be a positive integer")

        # Validate and normalize title
        validate_title(self.title)
        self.title = normalize_title(self.title)

        # Handle description None → ""
        if self.description is None:
            self.description = ""

        # Validate description
        validate_description(self.description)

        # Validate completed (strict boolean check)
        if not isinstance(self.completed, bool):
            raise ValidationError("Completed must be a boolean (True or False)")
