"""
Task CRUD API endpoints.
All endpoints require JWT authentication and enforce user data isolation.
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session, select
from typing import List
from datetime import datetime, timezone, timedelta
from dateutil.relativedelta import relativedelta

from src.database.connection import get_session
from src.models.task import Task
from src.auth.dependencies import get_current_user, verify_user_id_match
from pydantic import BaseModel, Field

router = APIRouter(prefix="/api", tags=["tasks"])


# Helper functions
def calculate_next_due_date(current_due_date: datetime, recurrence_type: str, recurrence_interval: int) -> datetime:
    """Calculate the next due date based on recurrence pattern."""
    if recurrence_type == "daily":
        return current_due_date + timedelta(days=recurrence_interval)
    elif recurrence_type == "weekly":
        return current_due_date + timedelta(weeks=recurrence_interval)
    elif recurrence_type == "monthly":
        return current_due_date + relativedelta(months=recurrence_interval)
    elif recurrence_type == "yearly":
        return current_due_date + relativedelta(years=recurrence_interval)
    else:
        return current_due_date


def calculate_next_reminder_time(current_reminder: datetime, recurrence_type: str, recurrence_interval: int) -> datetime:
    """Calculate the next reminder time based on recurrence pattern."""
    return calculate_next_due_date(current_reminder, recurrence_type, recurrence_interval)


# Request/Response models
class TaskCreate(BaseModel):
    """Request model for creating a task."""
    title: str = Field(min_length=1, max_length=200, description="Task title")
    description: str | None = Field(default=None, max_length=1000, description="Optional description")
    due_date: datetime | None = Field(default=None, description="When the task is due")
    reminder_time: datetime | None = Field(default=None, description="When to send a reminder")
    recurrence_type: str = Field(default="none", description="Type of recurrence (none, daily, weekly, monthly, yearly)")
    recurrence_interval: int = Field(default=1, description="Interval for recurrence (e.g., every 2 weeks)")


class TaskUpdate(BaseModel):
    """Request model for updating a task."""
    title: str = Field(min_length=1, max_length=200, description="Updated title")
    description: str | None = Field(default=None, max_length=1000, description="Updated description")
    due_date: datetime | None = Field(default=None, description="When the task is due")
    reminder_time: datetime | None = Field(default=None, description="When to send a reminder")
    recurrence_type: str = Field(default="none", description="Type of recurrence (none, daily, weekly, monthly, yearly)")
    recurrence_interval: int = Field(default=1, description="Interval for recurrence (e.g., every 2 weeks)")


class TaskResponse(BaseModel):
    """Response model for a task."""
    id: int
    user_id: str
    title: str
    description: str | None
    completed: bool
    due_date: datetime | None
    reminder_time: datetime | None
    recurrence_type: str
    recurrence_interval: int
    parent_task_id: int | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# GET /api/{user_id}/tasks - List all tasks for user
@router.get("/{user_id}/tasks", response_model=List[TaskResponse])
def get_tasks(
    user_id: str,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    """
    Get all tasks for the authenticated user.

    Security:
    - Requires valid JWT token
    - user_id in URL must match authenticated user from JWT
    """
    # Verify user_id matches authenticated user
    verify_user_id_match(user_id, current_user)

    # Query tasks filtered by authenticated user
    statement = select(Task).where(Task.user_id == current_user)
    tasks = session.exec(statement).all()

    return tasks


# POST /api/{user_id}/tasks - Create new task
@router.post("/{user_id}/tasks", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(
    user_id: str,
    task_data: TaskCreate,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    """
    Create a new task for the authenticated user.

    Security:
    - Requires valid JWT token
    - user_id in URL must match authenticated user from JWT
    - Task is automatically associated with authenticated user
    """
    # Verify user_id matches authenticated user
    verify_user_id_match(user_id, current_user)

    # Create task associated with authenticated user
    task = Task(
        user_id=current_user,
        title=task_data.title,
        description=task_data.description,
        completed=False,
        due_date=task_data.due_date,
        reminder_time=task_data.reminder_time,
        recurrence_type=task_data.recurrence_type,
        recurrence_interval=task_data.recurrence_interval,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


# GET /api/{user_id}/tasks/{task_id} - Get specific task
@router.get("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def get_task(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    """
    Get a specific task by ID.

    Security:
    - Requires valid JWT token
    - user_id in URL must match authenticated user from JWT
    - Task must belong to authenticated user (returns 404 if not)
    """
    # Verify user_id matches authenticated user
    verify_user_id_match(user_id, current_user)

    # Query task with user_id filter for security
    statement = select(Task).where(Task.id == task_id, Task.user_id == current_user)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    return task


# PUT /api/{user_id}/tasks/{task_id} - Update task
@router.put("/{user_id}/tasks/{task_id}", response_model=TaskResponse)
def update_task(
    user_id: str,
    task_id: int,
    task_data: TaskUpdate,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    """
    Update task title and/or description.

    Security:
    - Requires valid JWT token
    - user_id in URL must match authenticated user from JWT
    - Task must belong to authenticated user (returns 404 if not)
    """
    # Verify user_id matches authenticated user
    verify_user_id_match(user_id, current_user)

    # Query task with user_id filter for security
    statement = select(Task).where(Task.id == task_id, Task.user_id == current_user)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Update fields
    task.title = task_data.title
    task.description = task_data.description
    task.due_date = task_data.due_date
    task.reminder_time = task_data.reminder_time
    task.recurrence_type = task_data.recurrence_type
    task.recurrence_interval = task_data.recurrence_interval
    task.updated_at = datetime.now(timezone.utc)

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


# PATCH /api/{user_id}/tasks/{task_id}/complete - Toggle completion
@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskResponse)
def toggle_complete(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    """
    Toggle task completion status.

    Security:
    - Requires valid JWT token
    - user_id in URL must match authenticated user from JWT
    - Task must belong to authenticated user (returns 404 if not)
    """
    # Verify user_id matches authenticated user
    verify_user_id_match(user_id, current_user)

    # Query task with user_id filter for security
    statement = select(Task).where(Task.id == task_id, Task.user_id == current_user)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    # Toggle completion status
    task.completed = not task.completed
    task.updated_at = datetime.now(timezone.utc)

    # If marking as complete and task is recurring, create next instance
    if task.completed and task.recurrence_type != "none" and task.due_date:
        next_due_date = calculate_next_due_date(
            task.due_date,
            task.recurrence_type,
            task.recurrence_interval
        )

        next_reminder_time = None
        if task.reminder_time:
            next_reminder_time = calculate_next_reminder_time(
                task.reminder_time,
                task.recurrence_type,
                task.recurrence_interval
            )

        # Create new task instance for next occurrence
        next_task = Task(
            user_id=current_user,
            title=task.title,
            description=task.description,
            completed=False,
            due_date=next_due_date,
            reminder_time=next_reminder_time,
            recurrence_type=task.recurrence_type,
            recurrence_interval=task.recurrence_interval,
            parent_task_id=task.id,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc)
        )
        session.add(next_task)

    session.add(task)
    session.commit()
    session.refresh(task)

    return task


# DELETE /api/{user_id}/tasks/{task_id} - Delete task
@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    user_id: str,
    task_id: int,
    session: Session = Depends(get_session),
    current_user: str = Depends(get_current_user)
):
    """
    Delete a task permanently.

    Security:
    - Requires valid JWT token
    - user_id in URL must match authenticated user from JWT
    - Task must belong to authenticated user (returns 404 if not)
    """
    # Verify user_id matches authenticated user
    verify_user_id_match(user_id, current_user)

    # Query task with user_id filter for security
    statement = select(Task).where(Task.id == task_id, Task.user_id == current_user)
    task = session.exec(statement).first()

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )

    session.delete(task)
    session.commit()

    return None
