"""
SQLModel base configuration.
Centralized configuration for all database models.
"""

from sqlmodel import SQLModel
from datetime import datetime, timezone


class TimestampMixin:
    """
    Mixin to add created_at and updated_at timestamps to models.
    """

    created_at: datetime
    updated_at: datetime

    @classmethod
    def __init_subclass__(cls, **kwargs):
        super().__init_subclass__(**kwargs)
        # Auto-set timestamps on model creation
        if not hasattr(cls, "created_at"):
            cls.created_at = datetime.now(timezone.utc)
        if not hasattr(cls, "updated_at"):
            cls.updated_at = datetime.now(timezone.utc)


# Re-export SQLModel for convenience
__all__ = ["SQLModel", "TimestampMixin"]
