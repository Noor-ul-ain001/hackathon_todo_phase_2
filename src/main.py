"""
Agentic Todo Application - Phase I Entry Point

This module provides the main entry point for the command-line todo application.
It initializes the necessary services and runs the CLI interface.
"""

import sys
import argparse
from typing import List
from .services.task_service import TaskService
from .ui.cli import TodoCLI


def main(argv: List[str] = None) -> int:
    """
    Application Entry Point

    Initializes the TaskService and CLI, then executes the requested command.

    Args:
        argv: Command-line arguments (defaults to sys.argv[1:])

    Returns:
        Exit code (0 for success, non-zero for error)

    Example:
        $ python -m src.main add "Buy groceries"
        ✓ Task created successfully: 1 - Buy groceries
    """
    # Initialize services
    service = TaskService()
    cli = TodoCLI(service)

    # Parse arguments
    args = argv or sys.argv[1:]

    # Check for interactive mode
    interactive_mode = '--interactive' in args or '-i' in args

    # Remove interactive flag if present
    if '--interactive' in args:
        args.remove('--interactive')
    if '-i' in args:
        args.remove('-i')

    # If interactive mode or no args, launch interactive
    if interactive_mode or not args:
        if args:
            # Run initial command
            cli.run(args)

        return run_interactive_mode(service, cli)
    else:
        # Single command mode
        return cli.run(args)


def run_interactive_mode(service: TaskService, cli: TodoCLI) -> int:
    """
    Run Interactive Mode

    Provides a simple interactive interface for continuous task management.
    """
    print("Interactive mode - type 'help' for commands or 'quit' to exit")

    while True:
        try:
            # Print prompt
            user_input = input("todo> ").strip()

            # Handle empty input
            if not user_input:
                continue

            # Handle quit command
            if user_input.lower() in ['quit', 'exit', 'q']:
                return 0

            # Handle help command
            if user_input.lower() == 'help':
                cli.parser.print_help()
                continue

            # Parse and run command
            args = user_input.split()
            cli.run(args, interactive=True)

        except KeyboardInterrupt:
            print("\nUse 'quit' to exit")
            continue
        except EOFError:
            print("\nGoodbye!")
            return 0


if __name__ == '__main__':
    try:
        exit_code = main()
        sys.exit(exit_code)
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)
        sys.exit(1)