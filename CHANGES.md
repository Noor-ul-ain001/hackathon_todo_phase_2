# Recent Changes

## Interactive Mode Error Handling (2025-12-23)

### Problem
When users entered invalid commands in interactive mode, the app would exit instead of showing a warning and continuing.

### Solution
Updated the CLI error handling to:
1. Catch `SystemExit` exceptions from argparse in interactive mode
2. Suppress default argparse error messages in interactive mode
3. Show a friendly custom error message
4. Continue the loop instead of exiting

### Files Modified
- `src/ui/cli.py` - Added `interactive` parameter to `run()` method
- `src/ui/messages.py` - Added `error_invalid_command()` function
- `src/main.py` - Pass `interactive=True` when running in interactive mode

### New Behavior
```
todo> invalidcommand
✗ Invalid command or arguments. Type 'help' to see available commands.
────────────────────────────────────────────────────────────────────────
[prompt appears again]

todo> add
✗ Invalid command or arguments. Type 'help' to see available commands.
────────────────────────────────────────────────────────────────────────
[prompt appears again]

todo> add "Test task"
✓ Task created successfully: 1 - Test task
‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧‧
[prompt appears again]
```

### Testing
Run the app in interactive mode and try:
```bash
uv run main.py -i
```

Then test invalid commands:
- `invalidcommand`
- `add` (missing required argument)
- `xyz 123`

All should show warnings and continue, not exit.
