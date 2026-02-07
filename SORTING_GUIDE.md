# Sorting Guide - Task Organization

**Date:** 2025-12-23
**Status:** ✅ Fully Working

---

## Overview

The **sort** command allows you to organize your tasks by different criteria. View your tasks in the order that makes the most sense for your workflow!

---

## Sorting Options

### 1. Sort by ID 🔢

Sort tasks by their ID number.

```bash
# Ascending (1, 2, 3...)
todo> sort id asc
todo> sort id  # asc is default

# Descending (3, 2, 1...)
todo> sort id desc
```

**Use Case:** View tasks in the order they were created.

---

### 2. Sort by Title 🔤

Sort tasks alphabetically by title.

```bash
# Ascending (A-Z)
todo> sort title asc
todo> sort title  # asc is default

# Descending (Z-A)
todo> sort title desc
```

**Use Case:** Find tasks quickly by name, organize alphabetically.

**Example:**
```bash
todo> add "Zebra project"
todo> add "Apple meeting"
todo> add "Middle task"

todo> sort title asc
     ID |  Status  | Title              | Description
------- | -------- | ------------------ | ------------------------------------
      2 |   [ ]    | Apple meeting      |
      3 |   [ ]    | Middle task        |
      1 |   [ ]    | Zebra project      |
------- | -------- | ------------------ | ------------------------------------
```

---

### 3. Sort by Status 📊

Sort tasks by completion status.

```bash
# Ascending (incomplete first, then completed)
todo> sort status asc
todo> sort status  # asc is default

# Descending (completed first, then incomplete)
todo> sort status desc
```

**Use Cases:**
- **Incomplete first** - Focus on what needs to be done
- **Completed first** - Review what you've accomplished

**Example:**
```bash
todo> add "Task 1"
todo> add "Task 2"
todo> add "Task 3"
todo> complete 1
todo> complete 3

todo> sort status asc
     ID |  Status  | Title              | Description
------- | -------- | ------------------ | ------------------------------------
      2 |   [ ]    | Task 2             |  # Incomplete tasks first
      1 |   [X]    | Task 1             |
      3 |   [X]    | Task 3             |
------- | -------- | ------------------ | ------------------------------------
```

---

## Complete Examples

### Example Session

```bash
$ uv run main.py -i

todo> add "Write report"
todo> add "Buy groceries"
todo> add "Team meeting"
todo> add "Code review"
todo> complete 2
todo> complete 4

# View all tasks (default order by ID)
todo> list
     ID |  Status  | Title              | Description
------- | -------- | ------------------ | ------------------------------------
      1 |   [ ]    | Write report       |
      2 |   [X]    | Buy groceries      |
      3 |   [ ]    | Team meeting       |
      4 |   [X]    | Code review        |
------- | -------- | ------------------ | ------------------------------------

# Sort alphabetically
todo> sort title asc
🔄 SORTING  Tasks sorted by title (ascending)
     ID |  Status  | Title              | Description
------- | -------- | ------------------ | ------------------------------------
      2 |   [X]    | Buy groceries      |
      4 |   [X]    | Code review        |
      3 |   [ ]    | Team meeting       |
      1 |   [ ]    | Write report       |
------- | -------- | ------------------ | ------------------------------------

# Focus on incomplete tasks
todo> sort status asc
🔄 SORTING  Tasks sorted by status (ascending)
     ID |  Status  | Title              | Description
------- | -------- | ------------------ | ------------------------------------
      1 |   [ ]    | Write report       |  # Incomplete first
      3 |   [ ]    | Team meeting       |
      2 |   [X]    | Buy groceries      |  # Then completed
      4 |   [X]    | Code review        |
------- | -------- | ------------------ | ------------------------------------

# Back to ID order
todo> sort id
🔄 SORTING  Tasks sorted by id (ascending)
     ID |  Status  | Title              | Description
------- | -------- | ------------------ | ------------------------------------
      1 |   [ ]    | Write report       |
      2 |   [X]    | Buy groceries      |
      3 |   [ ]    | Team meeting       |
      4 |   [X]    | Code review        |
------- | -------- | ------------------ | ------------------------------------
```

---

## Syntax Reference

### Basic Syntax
```bash
sort <field> [order]
```

### Parameters
- **field** (required): `id`, `title`, or `status`
- **order** (optional): `asc` or `desc` (default: `asc`)

### Examples
```bash
sort id           # Sort by ID, ascending
sort id desc      # Sort by ID, descending
sort title        # Sort by title A-Z
sort title desc   # Sort by title Z-A
sort status       # Incomplete first
sort status desc  # Completed first
```

---

## Sort Help

Type `sort` without arguments to see detailed sorting options:

```bash
todo> sort

🔄 SORTING OPTIONS
════════════════════════════════════════════════════════════════════════

🔢  BY ID
────────────────────────────────────
  Sort by task ID number
  Options: asc (1, 2, 3...), desc (3, 2, 1...)
  Example: sort id asc

🔤  BY TITLE
────────────────────────────────────
  Alphabetical order A-Z or Z-A
  Options: asc (A-Z), desc (Z-A)
  Example: sort title asc

📊  BY STATUS
────────────────────────────────────
  Group by completion status
  Options: asc (incomplete first), desc (completed first)
  Example: sort status asc
```

---

## Combining with Other Commands

### Sort + Filter
```bash
# Filter completed tasks, then sort by title
todo> filter completed
todo> sort title
```

### Sort + Search
```bash
# Search for tasks, then sort results
todo> search meeting
todo> sort title
```

**Note:** Currently, sort displays all tasks. Filter and search results are separate views.

---

## Tips & Tricks

### 🎯 Workflow Tips

1. **Daily Review**
   ```bash
   sort status asc  # See incomplete tasks first
   ```

2. **Alphabetical Organization**
   ```bash
   sort title  # Find tasks by name
   ```

3. **Chronological View**
   ```bash
   sort id  # See tasks in creation order
   ```

4. **Celebrate Progress**
   ```bash
   sort status desc  # See completed tasks first
   ```

---

## Error Handling

### Invalid Sort Field
```bash
todo> sort priority
✗ ERROR Invalid sort field 'priority'
ℹ INFO Valid options: id, title, status
```

### Invalid Sort Order
```bash
todo> sort title xyz
⚠ WARNING Invalid order 'xyz'. Using 'asc' (ascending)
```

---

## Future Enhancements

Potential sorting features for future versions:
- 📅 Sort by due date
- 🎯 Sort by priority level
- 🕒 Sort by last modified date
- 🏷️ Sort by tags/categories
- 💾 Save preferred sort order

---

## Summary

✅ **Sort by ID** - Chronological order
✅ **Sort by Title** - Alphabetical order
✅ **Sort by Status** - Group by completion

**Command:** `sort <field> [asc|desc]`

**All sorting is working perfectly! 🎉**
