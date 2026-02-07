"""
Task model for todo items.
Each task belongs to exactly one user (enforced via foreign key).
"""

from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from typing import Optional
from enum import Enum


class RecurrenceType(str, Enum):
    """Recurrence pattern types"""
    NONE = "none"
    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"


class Task(SQLModel, table=True):
    """
    Task entity representing a todo item.

    Fields:
        id: Unique task identifier (auto-increment)
        user_id: Owner of the task (foreign key → users.id)
        title: Task title (required, 1-200 characters)
        description: Optional task description (max 1000 characters)
        completed: Completion status (default: false)
        due_date: When the task is due (optional)
        reminder_time: When to send a reminder (optional)
        recurrence_type: Type of recurrence (none, daily, weekly, monthly, yearly)
        recurrence_interval: Interval for recurrence (e.g., every 2 weeks)
        parent_task_id: Reference to the original task if this is a recurring instance
        created_at: Task creation timestamp
        updated_at: Last modification timestamp (auto-updated)

    Security:
        - All queries MUST filter by user_id
        - user_id MUST match authenticated user from JWT
    """

    __tablename__ = "tasks"

    id: Optional[int] = Field(
        default=None,
        primary_key=True,
        description="Unique task identifier (auto-increment)"
    )

    user_id: str = Field(
        foreign_key="users.id",
        index=True,
        description="Owner of the task (UUID)"
    )

    title: str = Field(
        min_length=1,
        max_length=200,
        description="Task title (required)"
    )

    description: Optional[str] = Field(
        default=None,
        max_length=1000,
        description="Optional task description"
    )

    completed: bool = Field(
        default=False,
        description="Completion status"
    )

    due_date: Optional[datetime] = Field(
        default=None,
        description="When the task is due"
    )

    reminder_time: Optional[datetime] = Field(
        default=None,
        description="When to send a reminder notification"
    )

    recurrence_type: str = Field(
        default=RecurrenceType.NONE.value,
        description="Type of recurrence (none, daily, weekly, monthly, yearly)"
    )

    recurrence_interval: Optional[int] = Field(
        default=1,
        description="Interval for recurrence (e.g., every 2 weeks means interval=2)"
    )

    parent_task_id: Optional[int] = Field(
        default=None,
        description="Reference to the original task if this is a recurring instance"
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Task creation timestamp"
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Last modification timestamp"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "id": 1,
                "user_id": "abc123-uuid-here",
                "title": "Buy groceries",
                "description": "Milk, eggs, bread",
                "completed": False,
                "due_date": "2025-12-25T18:00:00Z",
                "reminder_time": "2025-12-25T17:00:00Z",
                "recurrence_type": "weekly",
                "recurrence_interval": 1,
                "parent_task_id": None,
                "created_at": "2025-12-24T10:00:00Z",
                "updated_at": "2025-12-24T10:00:00Z"
            }
        }
