"""
Sequential ID generator for tasks.

Provides unique, sequential integer IDs starting from 1.
IDs are never reused, even after task deletion.
"""


class IDGenerator:
    """
    Generates unique sequential IDs for tasks.

    Uses a simple counter that increments on each ID generation.
    Thread-safe operations are NOT guaranteed in Phase I.

    Attributes:
        _counter (int): Current ID counter (next ID to be generated)

    Example:
        >>> gen = IDGenerator()
        >>> gen.generate()
        1
        >>> gen.generate()
        2
        >>> gen.generate()
        3
    """

    def __init__(self) -> None:
        """
        Initialize ID generator with counter starting at 1.
        """
        self._counter: int = 1

    def generate(self) -> int:
        """
        Generate the next unique sequential ID.

        Returns:
            int: Next sequential ID (starting from 1)

        Guarantees:
            - IDs are sequential: 1, 2, 3, ...
            - IDs are unique: never duplicated
            - IDs are never reused: counter only increments

        Example:
            >>> gen = IDGenerator()
            >>> first_id = gen.generate()
            >>> second_id = gen.generate()
            >>> first_id < second_id
            True
        """
        current_id = self._counter
        self._counter += 1
        return current_id

    def current(self) -> int:
        """
        Get the current counter value (next ID that will be generated).

        Returns:
            int: Current counter value

        Note:
            This does NOT generate a new ID, just returns what the next ID will be.

        Example:
            >>> gen = IDGenerator()
            >>> gen.current()
            1
            >>> gen.generate()
            1
            >>> gen.current()
            2
        """
        return self._counter
