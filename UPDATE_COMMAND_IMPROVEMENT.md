# Update Command Improvement

**Date:** 2025-12-23
**Status:** ✅ Implemented and Tested

---

## Problem

The update command required users to always specify the field name, even for simple title updates:

```bash
# Old way - required 3 arguments
update 1 title "New title"
```

This was verbose and not intuitive for quick title updates.

---

## Solution

Added a simplified syntax that defaults to updating the title when only 2 arguments are provided:

```bash
# New simplified way - only 2 arguments
update 1 "New title"

# Explicit way still works for clarity
update 1 title "New title"

# Description updates still require explicit field
update 1 description "New description"
```

---

## How It Works

The update command now accepts arguments in two ways:

### 1. Simplified Syntax (New)
```bash
update <id> "new_title"
```
- **2 arguments:** ID + new title
- Automatically updates the title field
- Perfect for quick updates

**Example:**
```bash
uv run main.py update 1 "Buy groceries and fruits"
# Output: [OK] Task 1 updated successfully
```

### 2. Explicit Syntax (Still Supported)
```bash
update <id> <field> "new_value"
```
- **3 arguments:** ID + field + value
- Field can be "title" or "description"
- Provides explicit control

**Examples:**
```bash
# Update title explicitly
uv run main.py update 1 title "New title"

# Update description (requires explicit)
uv run main.py update 1 description "New description"
```

---

## Implementation Details

### Changes Made

1. **`src/ui/cli.py`** - Modified argument parser:
   - Changed `field` argument to `field_or_value`
   - Made `value` argument optional
   - Updated `_handle_update()` method to handle both cases

2. **Help Documentation Updated:**
   - Interactive mode help
   - README examples
   - Command documentation

### Logic

```python
if args.value is None:
    # Simplified: update <id> <new_title>
    update_kwargs['title'] = args.field_or_value
else:
    # Explicit: update <id> <field> <value>
    field = args.field_or_value.lower()
    if field == 'title':
        update_kwargs['title'] = args.value
    elif field == 'description':
        update_kwargs['description'] = args.value
```

---

## Testing

All test scenarios passed:

✅ **Simplified syntax:**
```bash
uv run main.py update 1 "Buy groceries and fruits"
# Result: [OK] Task 1 updated successfully
```

✅ **Explicit title update:**
```bash
uv run main.py update 1 title "Shopping list"
# Result: [OK] Task 1 updated successfully
```

✅ **Description update:**
```bash
uv run main.py update 1 description "Milk, eggs, bread, apples"
# Result: [OK] Task 1 updated successfully
```

✅ **Using alias 'upd':**
```bash
uv run main.py upd 1 "Quick update"
# Result: [OK] Task 1 updated successfully
```

---

## Usage Examples

### Interactive Mode

```bash
uv run main.py -i

todo> add "Buy groceries"
[OK] Task created successfully: 1 - Buy groceries

todo> update 1 "Buy groceries and fruits"
[OK] Task 1 updated successfully

todo> update 1 description "Milk, eggs, bread, apples, oranges"
[OK] Task 1 updated successfully

todo> list
     ID |  Status  | Title              | Description
------- | -------- | ------------------ | ------------------------------------
      1 |   [ ]    | Buy groceries a... | Milk, eggs, bread, apples, oranges
------- | -------- | ------------------ | ------------------------------------
Total: 1 tasks (0 completed)
```

### Command Line

```bash
# Create a task
uv run main.py add "Write report"

# Quick title update (new simplified way)
uv run main.py update 1 "Write quarterly report"

# Add description
uv run main.py update 1 description "Due Friday at 5pm"

# View result
uv run main.py list
```

---

## Backwards Compatibility

✅ **Fully backwards compatible**
- All existing commands still work
- Old 3-argument syntax (`update id field value`) continues to function
- No breaking changes

---

## Benefits

1. **Faster workflow** - Fewer keystrokes for common title updates
2. **More intuitive** - Matches user expectations
3. **Flexible** - Choose simplified or explicit based on needs
4. **Backwards compatible** - Existing scripts/commands still work

---

## Documentation Updated

✅ README.md - Added examples of both syntaxes
✅ Interactive help - Updated command reference
✅ Command aliases table - Added 'upd' alias
✅ Test suite - Verified all scenarios work

---

## Summary

The update command is now more user-friendly while maintaining full backwards compatibility. Users can choose:

- **Quick updates:** `update 1 "New title"` (2 args)
- **Explicit updates:** `update 1 title "New title"` (3 args)
- **Description updates:** `update 1 description "New desc"` (3 args)

All three syntaxes work perfectly! 🎉
