"""
User model for authentication.
Managed by Better Auth on the frontend, but defined here for database schema.
"""

from sqlmodel import SQLModel, Field
from datetime import datetime, timezone
from typing import Optional
import uuid


class User(SQLModel, table=True):
    """
    User entity for authentication.

    Note: Better Auth handles user creation, password hashing, and authentication.
    This model defines the database schema for users.

    Fields:
        id: Unique user identifier (UUID)
        email: User's email address (unique, used for sign-in)
        password_hash: Hashed password (bcrypt, never plaintext)
        created_at: Account creation timestamp
    """

    __tablename__ = "users"

    id: str = Field(
        default_factory=lambda: str(uuid.uuid4()),
        primary_key=True,
        description="Unique user identifier (UUID)"
    )

    email: str = Field(
        unique=True,
        index=True,
        max_length=255,
        description="User's email address (used for sign-in)"
    )

    password_hash: str = Field(
        max_length=255,
        description="Hashed password (bcrypt)"
    )

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
        description="Account creation timestamp"
    )

    class Config:
        json_schema_extra = {
            "example": {
                "id": "abc123-uuid-here",
                "email": "user@example.com",
                "password_hash": "$2b$12$hashedpassword...",
                "created_at": "2025-12-24T10:00:00Z"
            }
        }
