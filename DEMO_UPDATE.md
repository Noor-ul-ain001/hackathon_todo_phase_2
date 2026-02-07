# Update Command - Quick Demo

## ✅ Problem Solved!

You can now update tasks with a simpler syntax:

---

## Before (Old Way)

```bash
todo> update 1 title "Buy groceries and fruits"
```

Always required 3 arguments: `id`, `field`, `value`

---

## After (New Way)

```bash
# Simplified - just 2 arguments!
todo> update 1 "Buy groceries and fruits"
```

Defaults to updating the title - much faster!

---

## All Supported Syntaxes

### 1. Quick Title Update (Simplified)
```bash
# Just 2 arguments - updates title
update 1 "Buy groceries and fruits"
upd 1 "Buy groceries and fruits"  # Using alias
```

### 2. Explicit Title Update
```bash
# 3 arguments - explicitly specify field
update 1 title "Buy groceries and fruits"
```

### 3. Description Update
```bash
# 3 arguments - must specify 'description' field
update 1 description "Milk, eggs, bread, apples"
```

---

## Try It Yourself!

Start interactive mode:
```bash
uv run main.py -i
```

Then try:
```bash
todo> add "Buy groceries"
todo> update 1 "Buy groceries and fruits"
todo> update 1 description "Milk, eggs, bread, apples"
todo> list
todo> quit
```

---

## Full Example Session

```bash
$ uv run main.py -i

todo> add "Buy groceries"
[OK] Task created successfully: 1 - Buy groceries

todo> list
     ID |  Status  | Title              | Description
------- | -------- | ------------------ | ------------------------------------
      1 |   [ ]    | Buy groceries      |
------- | -------- | ------------------ | ------------------------------------
Total: 1 tasks (0 completed)

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

todo> quit
```

---

## Summary

✅ **Simplified syntax:** `update 1 "New title"` (2 args)
✅ **Explicit syntax:** `update 1 title "New title"` (3 args)
✅ **Description:** `update 1 description "New desc"` (3 args)
✅ **All aliases work:** Use `upd` instead of `update`
✅ **Backwards compatible:** Old commands still work!

**Your command now works perfectly! 🎉**
