#!/usr/bin/env python3
"""
Comprehensive test script for all todo app commands.
Tests all functionality to ensure everything works correctly.
"""

from src.main import main
from src.services.task_service import TaskService
from src.ui.cli import TodoCLI
import sys

def test_all_commands():
    """Test all commands in sequence to verify functionality."""

    print("=" * 70)
    print("COMPREHENSIVE TODO APP COMMAND TEST")
    print("=" * 70)
    print()

    # Create service and CLI for testing
    service = TaskService()
    cli = TodoCLI(service)

    results = []

    # Test 1: ADD command
    print("TEST 1: Add task with description")
    print("-" * 70)
    result = cli.run(['add', 'Buy groceries', 'Milk, eggs, bread'])
    results.append(("Add with description", result == 0))
    print()

    # Test 2: ADD command without description
    print("TEST 2: Add task without description")
    print("-" * 70)
    result = cli.run(['add', 'Write report'])
    results.append(("Add without description", result == 0))
    print()

    # Test 3: ADD with alias
    print("TEST 3: Add with alias 'a'")
    print("-" * 70)
    result = cli.run(['a', 'Meeting at 3pm'])
    results.append(("Add alias 'a'", result == 0))
    print()

    # Test 4: LIST command
    print("TEST 4: List all tasks")
    print("-" * 70)
    result = cli.run(['list'])
    results.append(("List tasks", result == 0))
    print()

    # Test 5: LIST with alias
    print("TEST 5: List with alias 'ls'")
    print("-" * 70)
    result = cli.run(['ls'])
    results.append(("List alias 'ls'", result == 0))
    print()

    # Test 6: COMPLETE command
    print("TEST 6: Mark task 1 as complete")
    print("-" * 70)
    result = cli.run(['complete', '1'])
    results.append(("Complete task", result == 0))
    print()

    # Test 7: COMPLETE with alias
    print("TEST 7: Mark task 2 as complete with alias 'done'")
    print("-" * 70)
    result = cli.run(['done', '2'])
    results.append(("Complete alias 'done'", result == 0))
    print()

    # Test 8: LIST to verify completion
    print("TEST 8: List to verify completions")
    print("-" * 70)
    result = cli.run(['list'])
    results.append(("List after completion", result == 0))
    print()

    # Test 9: INCOMPLETE command
    print("TEST 9: Mark task 1 as incomplete")
    print("-" * 70)
    result = cli.run(['incomplete', '1'])
    results.append(("Mark incomplete", result == 0))
    print()

    # Test 10: INCOMPLETE with alias
    print("TEST 10: Mark task 2 as incomplete with alias 'undone'")
    print("-" * 70)
    result = cli.run(['undone', '2'])
    results.append(("Incomplete alias 'undone'", result == 0))
    print()

    # Test 11: UPDATE title
    print("TEST 11: Update task 1 title")
    print("-" * 70)
    result = cli.run(['update', '1', 'title', 'Buy groceries and supplies'])
    results.append(("Update title", result == 0))
    print()

    # Test 12: UPDATE description
    print("TEST 12: Update task 1 description")
    print("-" * 70)
    result = cli.run(['update', '1', 'description', 'Milk, eggs, bread, butter'])
    results.append(("Update description", result == 0))
    print()

    # Test 13: UPDATE with alias
    print("TEST 13: Update task 2 with alias 'upd'")
    print("-" * 70)
    result = cli.run(['upd', '2', 'title', 'Write quarterly report'])
    results.append(("Update alias 'upd'", result == 0))
    print()

    # Test 14: LIST to verify updates
    print("TEST 14: List to verify updates")
    print("-" * 70)
    result = cli.run(['list'])
    results.append(("List after updates", result == 0))
    print()

    # Test 15: DELETE command
    print("TEST 15: Delete task 3")
    print("-" * 70)
    result = cli.run(['delete', '3'])
    results.append(("Delete task", result == 0))
    print()

    # Test 16: DELETE with alias
    print("TEST 16: Delete task with alias 'rm' (should fail - task 3 deleted)")
    print("-" * 70)
    result = cli.run(['rm', '3'])
    results.append(("Delete non-existent (expected fail)", result != 0))
    print()

    # Test 17: LIST final state
    print("TEST 17: Final list")
    print("-" * 70)
    result = cli.run(['list'])
    results.append(("Final list", result == 0))
    print()

    # Test 18: Invalid command
    print("TEST 18: Invalid command (non-interactive mode)")
    print("-" * 70)
    try:
        result = cli.run(['invalidcommand'], interactive=False)
        results.append(("Invalid command handling", result != 0))
    except SystemExit:
        # In non-interactive mode, argparse calls sys.exit() for invalid commands
        # This is expected behavior
        results.append(("Invalid command handling", True))
        print("Caught SystemExit (expected for invalid command in non-interactive mode)")
    print()

    # Test 19: Task not found
    print("TEST 19: Update non-existent task")
    print("-" * 70)
    result = cli.run(['update', '999', 'title', 'Test'])
    results.append(("Task not found", result != 0))
    print()

    # Test 20: Empty task title validation
    print("TEST 20: Add task with empty title (should fail)")
    print("-" * 70)
    result = cli.run(['add', ''])
    results.append(("Empty title validation", result != 0))
    print()

    # Print summary
    print()
    print("=" * 70)
    print("TEST SUMMARY")
    print("=" * 70)

    passed = sum(1 for _, success in results if success)
    total = len(results)

    for test_name, success in results:
        status = "[PASS]" if success else "[FAIL]"
        print(f"{status}: {test_name}")

    print()
    print(f"Results: {passed}/{total} tests passed")
    print("=" * 70)

    return passed == total

if __name__ == '__main__':
    success = test_all_commands()
    sys.exit(0 if success else 1)
