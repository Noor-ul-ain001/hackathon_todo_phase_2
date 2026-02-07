"""
Validation helper functions for task fields.

This module provides shared validation and normalization utilities:
- validate_title: Ensures title is non-empty and valid
- normalize_title: Cleans up title formatting
- validate_description: Ensures description is valid
"""

import re
from .exceptions import ValidationError


def validate_title(title: str) -> None:
    """
    Validate task title.

    Args:
        title: The title string to validate

    Raises:
        ValidationError: If title is invalid

    Rules:
        - Must be a string
        - Cannot be empty
        - Cannot be whitespace-only
    """
    if not isinstance(title, str):
        raise ValidationError("Title must be a string")

    if not title or not title.strip():
        raise ValidationError("Title is required and cannot be empty")


def normalize_title(title: str) -> str:
    """
    Normalize task title by trimming and collapsing whitespace.

    Args:
        title: The title string to normalize

    Returns:
        Normalized title with:
        - Leading/trailing whitespace removed
        - Multiple consecutive spaces collapsed to single space

    Example:
        >>> normalize_title("  Buy   groceries  ")
        'Buy groceries'
    """
    # Trim leading/trailing whitespace
    normalized = title.strip()

    # Collapse multiple spaces to single space
    normalized = re.sub(r'\s+', ' ', normalized)

    return normalized


def validate_description(description: str) -> None:
    """
    Validate task description.

    Args:
        description: The description string to validate

    Raises:
        ValidationError: If description is invalid

    Rules:
        - Must be a string (after None conversion)
        - Can be empty (unlike title)
    """
    if not isinstance(description, str):
        raise ValidationError("Description must be a string")
