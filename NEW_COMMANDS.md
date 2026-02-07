# New Commands Added - Search, Filter, Stats

**Date:** 2025-12-23
**Status:** ✅ Fully Implemented and Tested

---

## Overview

Three powerful new commands have been added to enhance task management:
1. **search** - Find tasks by keyword
2. **filter** - Filter tasks by completion status
3. **stats** - View task statistics
4. **theme** - Change theme (visual feedback only)

---

## 1. SEARCH Command 🔍

Search for tasks by keyword in title or description.

### Syntax
```bash
search <query>
```

### Usage
```bash
# In interactive mode
todo> search groceries
todo> search report
todo> s meeting  # Using alias

# Direct command
uv run main.py  # then use search in interactive mode
```

### Examples
```bash
todo> add "Buy groceries" "Milk, eggs, bread"
todo> add "Write report" "Quarterly financial report"
todo> add "Meeting with team"

todo> search buy
🔍 SEARCH RESULTS FOR 'buy'
     ID |  Status  | Title              | Description
------- | -------- | ------------------ | ------------------------------------
      1 |   [ ]    | Buy groceries      | Milk, eggs, bread
------- | -------- | ------------------ | ------------------------------------
Total: 1 tasks (0 completed)

todo> search report
🔍 SEARCH RESULTS FOR 'report'
     ID |  Status  | Title              | Description
------- | -------- | ------------------ | ------------------------------------
      2 |   [ ]    | Write report       | Quarterly financial report
------- | -------- | ------------------ | ------------------------------------
Total: 1 tasks (0 completed)
```

### Features
- **Case-insensitive** - Matches regardless of capitalization
- **Searches both** title and description
- **Partial matching** - "buy" matches "Buy groceries"
- **No results message** - Clear feedback when nothing found

---

## 2. FILTER Command ⚡

Filter tasks by completion status.

### Syntax
```bash
filter <status>
```

### Status Options
- `completed` - Show only completed tasks
- `incomplete` - Show only incomplete tasks
- `all` - Show all tasks (same as `list`)

### Usage
```bash
# In interactive mode
todo> filter completed
todo> filter incomplete
todo> filter all
todo> f completed  # Using alias
```

### Examples
```bash
todo> add "Task 1"
todo> add "Task 2"
todo> add "Task 3"
todo> complete 1
todo> complete 3

todo> filter completed
⚡ FILTERED TASKS: COMPLETED
     ID |  Status  | Title              | Description
------- | -------- | ------------------ | ------------------------------------
      1 |   [X]    | Task 1             |
      3 |   [X]    | Task 3             |
------- | -------- | ------------------ | ------------------------------------
Total: 2 tasks (2 completed)

todo> filter incomplete
⚡ FILTERED TASKS: INCOMPLETE
     ID |  Status  | Title              | Description
------- | -------- | ------------------ | ------------------------------------
      2 |   [ ]    | Task 2             |
------- | -------- | ------------------ | ------------------------------------
Total: 1 tasks (0 completed)
```

### Features
- **Clean display** - Shows only matching tasks
- **Visual header** - Clear indication of filter applied
- **Count summary** - Shows how many tasks match

---

## 3. STATS Command 📊

Display comprehensive task statistics.

### Syntax
```bash
stats
```

### Usage
```bash
# In interactive mode
todo> stats
```

### Example Output
```bash
todo> add "Task 1"
todo> add "Task 2"
todo> add "Task 3"
todo> complete 1

todo> stats
📊 TASK STATISTICS
════════════════════════════════════════════════════════════════════════
Total Tasks: 3
Completed: 1
Incomplete: 2
Completion Rate: 33.3%
════════════════════════════════════════════════════════════════════════
```

### Metrics Shown
- **Total Tasks** - Total number of tasks in the system
- **Completed** - Number of completed tasks
- **Incomplete** - Number of incomplete tasks
- **Completion Rate** - Percentage of tasks completed

### Features
- **Real-time** - Always up-to-date statistics
- **Percentage** - Automatic completion rate calculation
- **Colorful** - Color-coded for easy reading

---

## 4. THEME Command 🎨

Change theme setting (currently visual feedback only).

### Syntax
```bash
theme <light|dark>
```

### Usage
```bash
# In interactive mode
todo> theme dark
ℹ INFO  Theme changed to: dark

todo> theme light
ℹ INFO  Theme changed to: light
```

### Note
This command currently provides visual feedback only. Full theme switching will be implemented in a future update.

---

## Command Aliases

| Command | Aliases | Description |
|---------|---------|-------------|
| search | s, find, lookup | Search for tasks |
| filter | f, fl | Filter tasks by status |
| stats | stat, info, status | Show statistics |

---

## Integration with Existing Commands

### Combined Workflows

**Search then Complete:**
```bash
todo> search groceries
# Find task ID
todo> complete 1
```

**Filter then Delete:**
```bash
todo> filter completed
# See completed tasks
todo> delete 1
todo> delete 2
```

**Add, Search, Update:**
```bash
todo> add "Buy milk"
todo> search milk
todo> update 1 "Buy milk and eggs"
```

---

## Technical Implementation

### Backend (TaskService)
```python
def search_tasks(self, query: str) -> List[Task]:
    """Search tasks by keyword (case-insensitive)"""

def filter_tasks(self, status: str) -> List[Task]:
    """Filter tasks by completion status"""

def get_task_count(self) -> Tuple[int, int]:
    """Get (total, completed) task counts"""
```

### Interactive Mode Handlers
- Search: Displays formatted results with header
- Filter: Shows filtered list with status header
- Stats: Calculates and displays metrics

---

## Error Handling

### Search
```bash
todo> search
✗ ERROR Provide a search query
ℹ INFO Example: search groceries
```

### Filter
```bash
todo> filter
✗ ERROR  Specify filter: completed, incomplete, or all
```

### No Results
```bash
todo> search xyz123
⚠ WARNING No tasks found matching 'xyz123'
```

---

## Performance

- **Search**: O(n) - linear scan through all tasks
- **Filter**: O(n) - linear scan through all tasks
- **Stats**: O(n) - single pass through tasks
- All operations are fast for typical task lists (< 1000 tasks)

---

## Future Enhancements

Potential improvements for future versions:
- 🎯 **Advanced search**: Regular expressions, multiple keywords
- 🏷️ **Tag filtering**: Filter by custom tags
- 📈 **Extended stats**: Charts, trends, productivity metrics
- 🎨 **Real theme support**: Actual color scheme switching
- 💾 **Export filtered results**: Save search/filter results

---

## Examples in Interactive Mode

```bash
$ uv run main.py -i

todo> add "Buy groceries" "Milk, eggs, bread"
[OK] Task created successfully: 1 - Buy groceries

todo> add "Write report" "Quarterly review"
[OK] Task created successfully: 2 - Write report

todo> add "Team meeting" "Discuss roadmap"
[OK] Task created successfully: 3 - Team meeting

todo> complete 1
[OK] Task 1 marked as complete

todo> search buy
🔍 SEARCH RESULTS FOR 'buy'
     ID |  Status  | Title              | Description
------- | -------- | ------------------ | ------------------------------------
      1 |   [X]    | Buy groceries      | Milk, eggs, bread
------- | -------- | ------------------ | ------------------------------------

todo> filter completed
⚡ FILTERED TASKS: COMPLETED
     ID |  Status  | Title              | Description
------- | -------- | ------------------ | ------------------------------------
      1 |   [X]    | Buy groceries      | Milk, eggs, bread
------- | -------- | ------------------ | ------------------------------------

todo> stats
📊 TASK STATISTICS
════════════════════════════════════════════════════════════════════════
Total Tasks: 3
Completed: 1
Incomplete: 2
Completion Rate: 33.3%
════════════════════════════════════════════════════════════════════════

todo> quit
```

---

## Summary

✅ **search** - Find tasks quickly by keyword
✅ **filter** - Focus on completed or incomplete tasks
✅ **stats** - Track your productivity
✅ **theme** - Visual theme feedback

All commands are **fully tested** and **ready to use**! 🎉
