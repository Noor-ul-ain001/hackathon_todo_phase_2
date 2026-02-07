"""
Task formatting utilities for displaying tasks in a table format.

Provides methods to format task lists with proper alignment, status indicators,
and text truncation for display in the CLI.
"""

import shutil
from typing import List
from ..models.task import Task
from . import messages


class TaskFormatter:
    """
    Formats tasks for display in a clean, aligned table format.

    Handles:
    - Status indicators (✓/✗ with ASCII fallback)
    - Column alignment (ID right-aligned, Status centered, Title/Desc left-aligned)
    - Text truncation with "..." for long content
    - Terminal width adaptation
    - Table header and separator rendering
    """

    def __init__(self) -> None:
        """
        Initialize formatter with default column widths and settings.
        """
        # Default column widths (will be adjusted based on terminal width)
        self.id_width = 4
        self.status_width = 8
        self.title_width = 30
        self.desc_width = 40

    def _get_terminal_width(self) -> int:
        """
        Get terminal width with fallback to 80 columns.

        Returns:
            int: Terminal width in columns, minimum 80
        """
        try:
            width = shutil.get_terminal_size().columns
            return max(width, 80)  # Minimum 80 columns
        except Exception:
            # Fallback to 80 columns if terminal width detection fails
            return 80

    def _get_status_indicator(self, completed: bool) -> str:
        """
        Get status indicator based on completion status.

        Args:
            completed: Boolean indicating if task is completed

        Returns:
            str: Status indicator with Unicode fallback handling
        """
        if completed:
            return "✓" if self._supports_unicode("✓") else "[X]"
        else:
            return "✗" if self._supports_unicode("✗") else "[ ]"

    def _supports_unicode(self, char: str) -> bool:
        """
        Check if the terminal supports a specific Unicode character.

        Args:
            char: Unicode character to test

        Returns:
            bool: True if character is supported, False otherwise
        """
        try:
            # Check both the character and the system encoding
            import sys
            encoding = sys.stdout.encoding or 'utf-8'
            char.encode(encoding)
            return True
        except UnicodeEncodeError:
            return False

    def _truncate(self, text: str, max_length: int) -> str:
        """
        Truncate text to max_length with "..." suffix if needed.

        Args:
            text: Text to truncate
            max_length: Maximum length for the text

        Returns:
            str: Truncated text with "..." if it was too long
        """
        if len(text) <= max_length:
            return text
        return text[:max_length - 3] + "..."

    def _calculate_column_widths(self, terminal_width: int) -> None:
        """
        Calculate optimal column widths based on terminal width.

        Args:
            terminal_width: Available terminal width in columns
        """
        # Reserve space for separators and padding
        reserved_space = 10  # Account for separators and spacing

        available_width = terminal_width - reserved_space
        if available_width < 50:
            # Minimum column widths if terminal is very narrow
            self.id_width = 4
            self.status_width = 6
            self.title_width = 15
            self.desc_width = 15
        else:
            # Calculate proportional widths based on available space
            self.id_width = max(4, min(8, available_width // 10))
            self.status_width = max(6, min(10, available_width // 8))
            remaining = available_width - self.id_width - self.status_width
            self.title_width = remaining // 3
            self.desc_width = remaining - self.title_width

    def format_task_list(self, tasks: List[Task]) -> str:
        """
        Format a list of tasks into a table string.

        Args:
            tasks: List of Task objects to format

        Returns:
            str: Formatted table string with tasks
        """
        if not tasks:
            return messages.empty_task_list()

        # Calculate optimal column widths based on terminal width
        terminal_width = self._get_terminal_width()
        self._calculate_column_widths(terminal_width)

        # Build the table
        lines = []

        # Header
        header = (
            f"{'ID':>{self.id_width}} | "
            f"{'Status':^{self.status_width}} | "
            f"{'Title':<{self.title_width}} | "
            f"{'Description':<{self.desc_width}}"
        )
        lines.append(header)

        # Separator
        separator = (
            f"{'-' * self.id_width} | "
            f"{'-' * self.status_width} | "
            f"{'-' * self.title_width} | "
            f"{'-' * self.desc_width}"
        )
        lines.append(separator)

        # Task rows
        for task in tasks:
            status = self._get_status_indicator(task.completed)
            title = self._truncate(task.title, self.title_width)
            description = self._truncate(task.description, self.desc_width)

            row = (
                f"{task.id:>{self.id_width}} | "
                f"{status:^{self.status_width}} | "
                f"{title:<{self.title_width}} | "
                f"{description:<{self.desc_width}}"
            )
            lines.append(row)

        # Separator at the bottom
        lines.append(separator)

        # Task count summary
        total = len(tasks)
        completed = sum(1 for task in tasks if task.completed)
        lines.append(messages.task_count_summary(total, completed))

        return "\n".join(lines)

    def format_single_task(self, task: Task) -> str:
        """
        Format a single task for display.

        Args:
            task: Task object to format

        Returns:
            str: Formatted task string
        """
        terminal_width = self._get_terminal_width()
        self._calculate_column_widths(terminal_width)

        status = self._get_status_indicator(task.completed)
        title = self._truncate(task.title, self.title_width)
        description = self._truncate(task.description, self.desc_width)

        return (
            f"{task.id:>{self.id_width}} | "
            f"{status:^{self.status_width}} | "
            f"{title:<{self.title_width}} | "
            f"{description:<{self.desc_width}}"
        )