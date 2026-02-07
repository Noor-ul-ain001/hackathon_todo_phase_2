"""
Command-line interface for the todo application.

Provides argument parsing and command routing using argparse.
Handles all CLI commands and error display.
"""

import argparse
import sys
from typing import Optional
from ..services.task_service import TaskService
from ..utils.exceptions import ValidationError, TaskNotFoundError, InvalidOperationError
from . import messages
from .formatter import TaskFormatter


class TodoCLI:
    """
    Command-line interface handler for the todo application.

    Uses argparse for command parsing and routing.
    Provides clean error handling and user-friendly output.

    Attributes:
        service (TaskService): The task service instance
        parser (ArgumentParser): Main argparse parser
        formatter (TaskFormatter): Task formatting utility
    """

    def __init__(self, service: TaskService) -> None:
        """
        Initialize CLI with a task service.

        Args:
            service: TaskService instance to use for operations
        """
        self.service = service
        self.formatter = TaskFormatter()
        self.parser = self._create_parser()

    def _create_parser(self) -> argparse.ArgumentParser:
        """
        Create and configure the argument parser.

        Returns:
            Configured ArgumentParser instance

        Commands configured:
            - add: Create new task
            - list: List all tasks
            - update: Update task title or description
            - complete: Mark task as complete
            - incomplete: Mark task as incomplete
            - delete: Delete a task
            - help: Show help (built-in argparse)
            - exit: Exit the application
        """
        parser = argparse.ArgumentParser(
            prog='todo',
            description='Agentic Todo Application - Phase I',
            epilog="Use 'todo <command> --help' for command-specific help"
        )

        subparsers = parser.add_subparsers(
            dest='command',
            help='Available commands'
        )

        # Add command
        add_parser = subparsers.add_parser(
            'add',
            help='Create a new task',
            aliases=['a']  # Add alias
        )
        add_parser.add_argument(
            'title',
            type=str,
            help='Task title (required, non-empty)'
        )
        add_parser.add_argument(
            'description',
            type=str,
            nargs='?',
            default='',
            help='Task description (optional)'
        )

        # List command
        list_parser = subparsers.add_parser(
            'list',
            help='List all tasks',
            aliases=['ls']  # Add alias
        )

        # Update command
        update_parser = subparsers.add_parser(
            'update',
            help='Update task title or description',
            aliases=['upd']  # Add alias
        )
        update_parser.add_argument(
            'id',
            type=int,
            help='Task ID to update'
        )
        update_parser.add_argument(
            'field_or_value',
            type=str,
            help='Field to update (title/description) or new title if only 2 args'
        )
        update_parser.add_argument(
            'value',
            type=str,
            nargs='?',
            default=None,
            help='New value (required if field is specified)'
        )

        # Complete command
        complete_parser = subparsers.add_parser(
            'complete',
            help='Mark task as complete',
            aliases=['done']  # Add alias
        )
        complete_parser.add_argument(
            'id',
            type=int,
            help='Task ID to mark complete'
        )

        # Incomplete command
        incomplete_parser = subparsers.add_parser(
            'incomplete',
            help='Mark task as incomplete',
            aliases=['undone', 'pending']  # Add aliases
        )
        incomplete_parser.add_argument(
            'id',
            type=int,
            help='Task ID to mark incomplete'
        )

        # Delete command
        delete_parser = subparsers.add_parser(
            'delete',
            help='Delete a task',
            aliases=['rm']  # Add alias
        )
        delete_parser.add_argument(
            'id',
            type=int,
            help='Task ID to delete'
        )

        return parser

    def _handle_add(self, args: argparse.Namespace) -> int:
        """
        Handle the 'add' command.

        Args:
            args: Parsed arguments containing title and description

        Returns:
            Exit code (0 for success, 1 for error)

        Side Effects:
            - Creates new task via TaskService
            - Prints success message to stdout
            - Prints error message to stderr on failure
        """
        try:
            task = self.service.create_task(args.title, args.description)
            print(messages.task_created(task.id, task.title))
            return 0
        except ValidationError as e:
            print(messages.error_validation(str(e)), file=sys.stderr)
            return 1

    def _handle_list(self, args: argparse.Namespace) -> int:
        """
        Handle the 'list' command.

        Args:
            args: Parsed arguments (none for list)

        Returns:
            Exit code (0 for success, 1 for error)

        Side Effects:
            - Prints formatted task list to stdout
            - Prints error message to stderr on failure
        """
        try:
            tasks = self.service.get_all_tasks()
            formatted_list = self.formatter.format_task_list(tasks)
            print(formatted_list)
            return 0
        except Exception as e:
            print(messages.error_validation(str(e)), file=sys.stderr)
            return 1

    def _handle_update(self, args: argparse.Namespace) -> int:
        """
        Handle the 'update' command.

        Args:
            args: Parsed arguments containing id, field_or_value, and optional value

        Returns:
            Exit code (0 for success, 1 for error)

        Side Effects:
            - Updates task via TaskService
            - Prints success message to stdout
            - Prints error message to stderr on failure

        Usage:
            update <id> <new_title>              # Updates title (shorthand)
            update <id> title <new_title>        # Updates title (explicit)
            update <id> description <new_desc>   # Updates description
        """
        try:
            # Prepare arguments for update_task
            update_kwargs = {}

            if args.value is None:
                # Shorthand: update <id> <new_title>
                update_kwargs['title'] = args.field_or_value
            else:
                # Explicit: update <id> <field> <value>
                field = args.field_or_value.lower()
                if field == 'title':
                    update_kwargs['title'] = args.value
                elif field == 'description':
                    update_kwargs['description'] = args.value
                else:
                    print(messages.error_validation(
                        f"Invalid field '{field}'. Use 'title' or 'description'"
                    ), file=sys.stderr)
                    return 1

            task = self.service.update_task(args.id, **update_kwargs)
            print(messages.task_updated(task.id))
            return 0
        except TaskNotFoundError:
            print(messages.error_task_not_found(args.id), file=sys.stderr)
            return 1
        except ValidationError as e:
            print(messages.error_validation(str(e)), file=sys.stderr)
            return 1
        except InvalidOperationError as e:
            print(messages.error_invalid_operation(str(e)), file=sys.stderr)
            return 1

    def _handle_complete(self, args: argparse.Namespace) -> int:
        """
        Handle the 'complete' command.

        Args:
            args: Parsed arguments containing task id

        Returns:
            Exit code (0 for success, 1 for error)

        Side Effects:
            - Marks task as complete via TaskService
            - Prints success message to stdout
            - Prints error message to stderr on failure
        """
        try:
            task = self.service.toggle_completion(args.id, True)
            print(messages.task_completed(task.id))
            return 0
        except TaskNotFoundError:
            print(messages.error_task_not_found(args.id), file=sys.stderr)
            return 1

    def _handle_incomplete(self, args: argparse.Namespace) -> int:
        """
        Handle the 'incomplete' command.

        Args:
            args: Parsed arguments containing task id

        Returns:
            Exit code (0 for success, 1 for error)

        Side Effects:
            - Marks task as incomplete via TaskService
            - Prints success message to stdout
            - Prints error message to stderr on failure
        """
        try:
            task = self.service.toggle_completion(args.id, False)
            print(messages.task_incomplete(task.id))
            return 0
        except TaskNotFoundError:
            print(messages.error_task_not_found(args.id), file=sys.stderr)
            return 1

    def _handle_delete(self, args: argparse.Namespace) -> int:
        """
        Handle the 'delete' command.

        Args:
            args: Parsed arguments containing task id

        Returns:
            Exit code (0 for success, 1 for error)

        Side Effects:
            - Deletes task via TaskService
            - Prints success message to stdout
            - Prints error message to stderr on failure
        """
        try:
            self.service.delete_task(args.id)
            print(messages.task_deleted(args.id))
            return 0
        except TaskNotFoundError:
            print(messages.error_task_not_found(args.id), file=sys.stderr)
            return 1

    def run(self, argv: Optional[list[str]] = None, interactive: bool = False) -> int:
        """
        Parse arguments and execute the requested command.

        Args:
            argv: Command-line arguments (defaults to sys.argv[1:])
            interactive: If True, prevents argparse from exiting on errors

        Returns:
            Exit code (0 for success, non-zero for error)

        Example:
            >>> cli = TodoCLI(service)
            >>> cli.run(['add', 'Buy groceries', 'Milk, eggs'])
            ✓ Task created successfully: 1 - Buy groceries
            0
        """
        # If no arguments provided, show help and usage information
        if argv is None and len(sys.argv) == 1:
            self._show_welcome_message()
            self.parser.print_help()
            return 0

        # In interactive mode, catch argparse errors to prevent app exit
        try:
            if interactive:
                # In interactive mode, suppress argparse's default error messages
                # and use our own friendly error message instead
                import io
                old_stderr = sys.stderr
                sys.stderr = io.StringIO()
                try:
                    args = self.parser.parse_args(argv)
                finally:
                    sys.stderr = old_stderr
            else:
                args = self.parser.parse_args(argv)
        except SystemExit as e:
            if interactive:
                # Don't exit in interactive mode, just show our custom error
                if e.code != 0:
                    print(messages.error_invalid_command(), file=sys.stderr)
                return 1
            else:
                # In non-interactive mode, allow normal exit
                raise

        # Route to command handler (handle both primary commands and aliases)
        if args.command in ['add', 'a']:
            return self._handle_add(args)
        elif args.command in ['list', 'ls']:
            return self._handle_list(args)
        elif args.command in ['update', 'upd']:
            return self._handle_update(args)
        elif args.command in ['complete', 'done']:
            return self._handle_complete(args)
        elif args.command in ['incomplete', 'undone', 'pending']:
            return self._handle_incomplete(args)
        elif args.command in ['delete', 'rm']:
            return self._handle_delete(args)
        elif args.command == 'help' or args.command is None:
            # Show help if requested or no command provided
            if args.command is None:
                self._show_welcome_message()
            self.parser.print_help()
            return 0
        else:
            # Unknown command (shouldn't happen with argparse, but defensive)
            print(messages.error_unknown_command(args.command), file=sys.stderr)
            return 1

    def _show_welcome_message(self) -> None:
        """
        Display a welcome message with usage instructions.
        """
        welcome_msg = """
+---------------------------------------------------------+
|                Agentic Todo Application                 |
|                    Phase I - MVP                        |
+---------------------------------------------------------+
|  A simple CLI-based task manager with core features:    |
|  • Add, list, update, complete, and delete tasks       |
|  • Clean table display with status indicators          |
|  • Error handling with user-friendly messages          |
|  • In-memory storage (tasks lost on exit)              |
+---------------------------------------------------------+
|  Quick Start:                                          |
|  • Add task: python -m src.main add "Title"            |
|  • List tasks: python -m src.main list                 |
|  • Complete: python -m src.main complete 1             |
|  • Help: python -m src.main --help                     |
+---------------------------------------------------------+
|  Commands: add, list, update, complete, incomplete,    |
|            delete, help (with aliases)                  |
|  Examples:                                             |
|  • python -m src.main add "Buy groceries"              |
|  • python -m src.main list                             |
|  • python -m src.main complete 1                       |
|  • python -m src.main update 1 title "New title"       |
+---------------------------------------------------------+
        """
        print(welcome_msg)

    def _show_interactive_mode(self) -> None:
        """
        Display interactive mode help.
        """
        interactive_help = """
Interactive Mode Commands:
  add "title" ["description"]         - Add a new task
  list, ls                           - List all tasks
  update id "new_title"              - Update task title (shorthand)
  update id title "new_title"        - Update task title (explicit)
  update id description "new_desc"   - Update task description
  complete id, done id               - Mark task as complete
  incomplete id, pending id          - Mark task as incomplete
  delete id, rm id                   - Delete a task
  help                               - Show this help
  quit, exit                         - Exit the application

Examples:
  > add "Buy groceries" "Milk, eggs, bread"
  > list
  > update 1 "Buy groceries and fruits"
  > update 1 description "Milk, eggs, bread, apples"
  > complete 1
  > quit
        """
        print(interactive_help)
