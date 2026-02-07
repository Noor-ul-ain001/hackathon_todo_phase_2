# Phase I Agentic Todo Application - Quickstart Guide

**Version**: Phase I (Core Essentials)
**Last Updated**: 2025-12-23
**Status**: Implementation Planning Complete

---

## Prerequisites

- **Python**: 3.13 or higher
- **Environment Manager**: UV (recommended) or pip
- **Terminal**: Any standard terminal (Windows CMD/PowerShell, macOS Terminal, Linux shell)
- **Terminal Width**: Minimum 40 columns (80+ recommended)

---

## Setup

### 1. Clone Repository

```bash
git clone <repo-url>
cd todo/phase1
```

### 2. Verify Python Version

```bash
python --version
# Should output: Python 3.13.x or higher
```

If Python 3.13+ is not installed, download from [python.org](https://www.python.org/downloads/).

### 3. No External Dependencies Needed

Phase I uses only Python standard library. No `pip install` or virtual environment required.

---

## Running the Application

### Single Command Mode (Recommended)

Execute one command and exit:

```bash
python src/main.py <command> [arguments]
```

**Examples**:
```bash
python src/main.py add "Buy groceries"
python src/main.py list
python src/main.py complete 1
python src/main.py help
```

### Interactive Mode (If Implemented - Optional)

Stay in application and enter multiple commands:

```bash
python src/main.py
> add "Buy groceries"
> list
> exit
```

*Note: Interactive mode is optional for Phase I. Single command mode is sufficient.*

---

## Command Reference

### add - Create New Task

**Syntax**:
```bash
python src/main.py add "<title>" ["<description>"]
```

**Examples**:
```bash
# Task with title only
python src/main.py add "Buy groceries"

# Task with title and description
python src/main.py add "Buy groceries" "Milk, eggs, bread"

# Single-word title (quotes optional)
python src/main.py add Meeting
```

**Output**:
```
✓ Task created successfully: 1 - Buy groceries
```

---

### list - Display All Tasks

**Syntax**:
```bash
python src/main.py list
# or
python src/main.py ls
```

**Output** (with tasks):
```
ID | Status | Title                | Description
---|--------|---------------------|---------------------------
1  | ✗      | Buy groceries       | Milk, eggs, bread
2  | ✓      | Write report        | Quarterly sales analysis
3  | ✗      | Plan vacation       |
---
Total: 3 tasks (1 completed)
```

**Output** (empty):
```
No tasks yet. Use 'add' to create your first task.
```

---

### update - Modify Task

**Syntax**:
```bash
python src/main.py update <id> <field> "<value>"
```

**Fields**: `title` or `description`

**Examples**:
```bash
# Update title
python src/main.py update 1 title "Buy groceries and supplies"

# Update description
python src/main.py update 2 description "Due Friday at 5pm"
```

**Output**:
```
✓ Task 1 updated successfully
```

---

### complete - Mark Task Complete

**Syntax**:
```bash
python src/main.py complete <id>
# or
python src/main.py done <id>
```

**Examples**:
```bash
python src/main.py complete 1
python src/main.py done 2
```

**Output**:
```
✓ Task 1 marked as complete
```

---

### incomplete - Mark Task Incomplete

**Syntax**:
```bash
python src/main.py incomplete <id>
# or
python src/main.py undone <id>
# or
python src/main.py pending <id>
```

**Examples**:
```bash
python src/main.py incomplete 1
python src/main.py pending 2
```

**Output**:
```
✓ Task 1 marked as incomplete
```

---

### delete - Remove Task

**Syntax**:
```bash
python src/main.py delete <id>
# or
python src/main.py rm <id>
```

**Examples**:
```bash
python src/main.py delete 1
python src/main.py rm 5
```

**Output**:
```
✓ Task 1 deleted successfully
```

*Note: Deleted task IDs are never reused.*

---

### help - Show Usage Information

**Syntax**:
```bash
# Show all commands
python src/main.py help

# Show specific command help
python src/main.py help <command>
```

**Examples**:
```bash
python src/main.py help
python src/main.py help add
python src/main.py help update
```

---

### exit - Quit Application

**Syntax**:
```bash
python src/main.py exit
# or
python src/main.py quit
```

*Note: Only needed in interactive mode. Single command mode exits automatically.*

---

## Complete Example Session

```bash
# Start with empty task list
$ python src/main.py list
No tasks yet. Use 'add' to create your first task.

# Add first task
$ python src/main.py add "Buy groceries" "Milk, eggs, bread"
✓ Task created successfully: 1 - Buy groceries

# Add second task
$ python src/main.py add "Write report"
✓ Task created successfully: 2 - Write report

# Add third task with unicode
$ python src/main.py add "Plan vacation ✈️"
✓ Task created successfully: 3 - Plan vacation ✈️

# View all tasks
$ python src/main.py list
ID | Status | Title                | Description
---|--------|---------------------|---------------------------
1  | ✗      | Buy groceries       | Milk, eggs, bread
2  | ✗      | Write report        |
3  | ✗      | Plan vacation ✈️    |
---
Total: 3 tasks (0 completed)

# Complete first task
$ python src/main.py complete 1
✓ Task 1 marked as complete

# Update second task description
$ python src/main.py update 2 description "Q4 sales analysis due Friday"
✓ Task 2 updated successfully

# View updated list
$ python src/main.py list
ID | Status | Title                | Description
---|--------|---------------------|---------------------------
1  | ✓      | Buy groceries       | Milk, eggs, bread
2  | ✗      | Write report        | Q4 sales analysis due Friday
3  | ✗      | Plan vacation ✈️    |
---
Total: 3 tasks (1 completed)

# Delete third task
$ python src/main.py delete 3
✓ Task 3 deleted successfully

# Final list
$ python src/main.py list
ID | Status | Title                | Description
---|--------|---------------------|---------------------------
1  | ✓      | Buy groceries       | Milk, eggs, bread
2  | ✗      | Write report        | Q4 sales analysis due Friday
---
Total: 2 tasks (1 completed)
```

---

## Troubleshooting

### Error: "Title is required and cannot be empty"

**Cause**: Attempting to create or update a task with empty or whitespace-only title.

**Solution**:
```bash
# Bad
python src/main.py add ""

# Good
python src/main.py add "My task"
```

---

### Error: "Task with ID X not found"

**Cause**: Referencing a task ID that doesn't exist (never created or already deleted).

**Solution**:
1. Run `python src/main.py list` to see existing task IDs
2. Use a valid ID from the list
3. Remember: Deleted IDs are never reused

```bash
# Check existing tasks first
python src/main.py list

# Use valid ID
python src/main.py update 1 title "New title"
```

---

### Error: "Unknown command 'xyz'"

**Cause**: Typo or invalid command name.

**Solution**:
```bash
# See all valid commands
python src/main.py help

# Common typos
ad → add
lst → list
dlete → delete
```

---

### Error: "Field must be 'title' or 'description'"

**Cause**: Using `update` command with invalid field name.

**Solution**:
```bash
# Bad
python src/main.py update 1 name "New name"

# Good
python src/main.py update 1 title "New title"
python src/main.py update 1 description "New description"
```

---

### Terminal Display Issues

**Symptom**: Table columns misaligned or special characters (✓/✗) not displaying.

**Solutions**:

1. **Narrow Terminal**: Widen terminal to at least 40 columns (80+ recommended)
2. **Unicode Issues**: Application provides ASCII fallback `[X]`/`[ ]` if unicode unavailable
3. **Font Issues**: Use monospace font (Consolas, Courier New, Monaco, etc.)

---

## Phase I Limitations

⚠️ **Important**: Phase I is a minimal viable product. The following features are NOT available:

### Not Available in Phase I

- ❌ **Persistence**: Tasks are lost when application exits (in-memory only)
- ❌ **Search**: No search by keyword
- ❌ **Filter**: No filtering by status, priority, or tags
- ❌ **Sort**: Tasks always displayed by ID ascending
- ❌ **Priority**: No task priorities (low/medium/high)
- ❌ **Tags**: No task categories or tags
- ❌ **Due Dates**: No deadlines or date tracking
- ❌ **Recurring Tasks**: No repeating tasks
- ❌ **Reminders**: No notifications
- ❌ **Multi-User**: Single user per session only
- ❌ **Web Interface**: CLI only, no browser access
- ❌ **Mobile App**: Desktop terminal only

### Coming in Future Phases

- **Phase II**: Priority, tags, search, filter, sort, persistent storage
- **Phase III**: Due dates, recurring tasks, reminders, notifications

---

## Tips & Best Practices

### 1. Use Quotes for Multi-Word Titles

```bash
# Without quotes (error-prone)
python src/main.py add Buy groceries  # May only capture "Buy"

# With quotes (recommended)
python src/main.py add "Buy groceries"
```

### 2. Check Task List Regularly

```bash
# Quick alias (if supported by shell)
alias todo="python src/main.py"

# Now use
todo list
todo add "New task"
```

### 3. Use Command Aliases

```bash
# These are equivalent
python src/main.py list
python src/main.py ls

python src/main.py delete 1
python src/main.py rm 1

python src/main.py complete 1
python src/main.py done 1
```

### 4. Preserve Special Characters

```bash
# Unicode works
python src/main.py add "Plan vacation ✈️"

# Quotes in title
python src/main.py add 'Meeting about "Project X"'

# Newlines in description (use shell escaping)
python src/main.py add "Task" "Line 1\nLine 2"
```

### 5. Data Loss Warning

⚠️ **All tasks are lost when the application closes.** Phase I does not save to disk.

**Workaround**: Keep important tasks in a separate file or use Phase II when available.

---

## Development & Testing

### Running Tests (When Available)

```bash
# Install pytest (if tests are created)
pip install pytest

# Run all tests
pytest

# Run specific test file
pytest tests/unit/test_task.py

# Run with verbose output
pytest -v
```

### Project Structure

```
src/
├── main.py              # Entry point
├── models/
│   └── task.py          # Task data model
├── services/
│   ├── task_service.py  # CRUD operations
│   └── id_generator.py  # ID generation
├── ui/
│   ├── cli.py           # Command-line interface
│   ├── formatter.py     # Table formatting
│   └── messages.py      # Message templates
└── utils/
    └── validators.py    # Validation helpers
```

---

## Getting Help

### Built-In Help

```bash
# General help
python src/main.py help

# Command-specific help
python src/main.py help add
python src/main.py help list
python src/main.py help update
```

### Documentation

- **README.md**: Project overview and architecture
- **CLAUDE.md**: Agent workflow rules
- **Constitution**: Project principles and phase boundaries
- **Specifications**: Detailed requirements (specs/001, 002, 003)

### Reporting Issues

If you encounter bugs or have suggestions:
1. Check this guide for common issues
2. Review specifications for expected behavior
3. Report issues with:
   - Command executed
   - Expected behavior
   - Actual behavior
   - Error message (if any)

---

## Quick Command Reference

| Command | Alias | Arguments | Example |
|---------|-------|-----------|---------|
| add | - | title [description] | `add "Buy milk"` |
| list | ls | - | `list` |
| update | - | id field value | `update 1 title "New"` |
| complete | done | id | `complete 1` |
| incomplete | undone, pending | id | `incomplete 1` |
| delete | rm | id | `delete 1` |
| help | - | [command] | `help add` |
| exit | quit | - | `exit` |

---

## Success!

You're now ready to use the Agentic Todo Application Phase I. Start by adding your first task:

```bash
python src/main.py add "Learn Phase I Todo App"
python src/main.py list
```

Happy task managing! 🎯
