# Phase 0: Research & Technology Decisions

**Date**: 2025-12-23
**Feature**: Phase I Unified Todo Application
**Purpose**: Document technology choices and rationale for implementation

---

## Research Objectives

1. CLI Framework Selection
2. Data Modeling Approach
3. ID Generation Strategy
4. Table Formatting Approach
5. Error Handling Pattern
6. Storage Strategy

---

## Decision 1: CLI Framework

**Question**: Which CLI framework should we use for command parsing?

**Options Evaluated**:
1. `argparse` (standard library)
2. `click` (external library)
3. `typer` (external library)
4. Manual parsing

**Decision**: **argparse (standard library)**

**Rationale**:
- ✅ No external dependencies (Phase I constitution constraint)
- ✅ Built-in to Python 3.13+
- ✅ Sufficient for 8 commands with simple arguments
- ✅ Well-documented and widely used
- ✅ Handles help generation automatically
- ✅ Subcommand support for command routing

**Alternatives Rejected**:
- `click`: External dependency, violates Phase I constraint
- `typer`: External dependency, overkill for simple CLI
- Manual parsing: Error-prone, reinventing the wheel, poor help system

**Best Practices**:
- Use subparsers for each command (add, list, update, etc.)
- Centralize argument definitions for consistency
- Leverage built-in help formatting

---

## Decision 2: Task Model Implementation

**Question**: How should we implement the Task data structure?

**Options Evaluated**:
1. `dataclasses.dataclass`
2. `Pydantic BaseModel`
3. Custom class with `@property` decorators
4. Plain dictionary

**Decision**: **dataclasses.dataclass with `__post_init__` validation**

**Rationale**:
- ✅ Standard library (no dependencies)
- ✅ Clean, readable syntax
- ✅ Type hints integrated
- ✅ `__post_init__` supports field validation
- ✅ Immutability option for ID enforcement (future)
- ✅ Auto-generated `__repr__`, `__eq__`

**Alternatives Rejected**:
- `Pydantic`: External dependency, overkill for 4 fields
- Custom class: More boilerplate, harder to maintain
- Dictionary: No type safety, no validation, error-prone

**Best Practices**:
- Use `__post_init__` for validation
- Raise custom `ValidationError` exceptions
- Use type hints for all fields
- Default values via field defaults

---

## Decision 3: ID Generation Strategy

**Question**: How should we generate unique, sequential task IDs?

**Options Evaluated**:
1. Simple counter with class-level state
2. UUID (random unique identifiers)
3. Database sequence
4. Timestamp-based IDs

**Decision**: **Simple counter with class-level state in `IDGenerator`**

**Rationale**:
- ✅ Sequential IDs starting from 1 (user-friendly)
- ✅ Never reuses IDs (counter only increments)
- ✅ Simple, deterministic, fast (<1ms)
- ✅ No threading concerns (single-threaded Phase I)
- ✅ Easy to implement and test
- ✅ Python int has unlimited precision (no overflow)

**Alternatives Rejected**:
- UUID: Not user-friendly (huge IDs like `550e8400-e29b-41d4-a716-446655440000`)
- Database sequence: No database in Phase I
- Timestamp: Not guaranteed unique, confusing ordering

**Best Practices**:
- Separate ID generation from Task creation
- Encapsulate counter in dedicated class
- Make thread-safe for future (use lock in Phase II+)

---

## Decision 4: Table Formatting Approach

**Question**: How should we format the task list table output?

**Options Evaluated**:
1. Custom formatter with string padding
2. `tabulate` library
3. `rich` library
4. Manual string concatenation

**Decision**: **Custom formatter with string padding and alignment**

**Rationale**:
- ✅ Full control over column widths and alignment
- ✅ Handles truncation with "..." easily
- ✅ Adapts to terminal width
- ✅ No external dependencies
- ✅ Unicode indicators with ASCII fallback
- ✅ Simple implementation (~50 lines)

**Alternatives Rejected**:
- `tabulate`: External dependency, limited customization
- `rich`: External dependency, adds color complexity
- Manual concatenation: Error-prone, hard to maintain alignment

**Best Practices**:
- Use `str.ljust()`, `str.rjust()`, `str.center()` for alignment
- Detect terminal width via `shutil.get_terminal_size()`
- Provide sensible defaults (80 columns if detection fails)
- Truncate long text with "..." suffix

**Implementation Sketch**:
```python
def format_table(tasks: list[Task]) -> str:
    # Column widths
    id_width = 4
    status_width = 6
    title_width = 30
    desc_width = remaining

    # Header
    header = f"{'ID':>{id_width}} | {'Status':^{status_width}} | {'Title':<{title_width}} | Description"

    # Rows
    for task in tasks:
        status = "✓" if task.completed else "✗"
        title = truncate(task.title, title_width)
        desc = truncate(task.description, desc_width)
        row = f"{task.id:>{id_width}} | {status:^{status_width}} | {title:<{title_width}} | {desc}"
```

---

## Decision 5: Error Handling Pattern

**Question**: How should we handle and propagate errors?

**Options Evaluated**:
1. Exception hierarchy with user-friendly messages at UI
2. Return codes/tuples (error, result)
3. Generic exceptions only
4. Silent failures with logging

**Decision**: **Custom exception hierarchy with user-friendly messages at UI boundary**

**Rationale**:
- ✅ Pythonic (exceptions are the standard)
- ✅ Clear separation: technical exceptions in lower layers, user messages in UI
- ✅ Easy to propagate context (exception chaining)
- ✅ CLI can catch all and display appropriately
- ✅ Errors to stderr, successes to stdout (FR-025 from spec 003)

**Exception Hierarchy**:
```
Exception
└── TodoAppError (base)
    ├── ValidationError (from model layer)
    ├── TaskNotFoundError (from service layer)
    └── InvalidOperationError (from service layer)
```

**Alternatives Rejected**:
- Return codes/tuples: Less Pythonic, harder to propagate context, verbose
- Generic exceptions: Less specific, harder to handle appropriately at UI
- Silent failures: Terrible UX, violates spec requirements

**Best Practices**:
- Raise specific exceptions in model/service layers
- Catch all `TodoAppError` in CLI layer
- Map technical exceptions to user-friendly messages
- Include context in exception messages
- Use exception chaining (`raise TaskNotFoundError(...) from e`)

**Error Message Mapping** (from spec 003):
```python
try:
    service.get_task(task_id)
except TaskNotFoundError:
    print(f"✗ Task with ID {task_id} not found", file=sys.stderr)
except ValidationError as e:
    print(f"✗ {e}", file=sys.stderr)
```

---

## Decision 6: Storage Strategy

**Question**: How should we store tasks in memory?

**Options Evaluated**:
1. Dictionary mapping ID → Task
2. List of Task objects
3. SQLite in-memory database
4. Custom data structure (e.g., OrderedDict)

**Decision**: **In-memory dictionary (ID → Task mapping) + ID generator**

**Rationale**:
- ✅ Fast O(1) lookup by ID
- ✅ Maintains insertion order (Python 3.7+)
- ✅ Simple to implement
- ✅ No persistence needed (Phase I constraint)
- ✅ Easy to iterate for list command
- ✅ Direct ID indexing for updates/deletes

**Alternatives Rejected**:
- List of tasks: O(n) lookup, no natural ID indexing, inefficient for large lists
- SQLite in-memory: Overkill for Phase I, adds complexity, not needed until persistence (Phase II)
- OrderedDict: No benefit over dict (Python 3.7+ dicts are ordered)

**Best Practices**:
- Initialize as empty dict in `TaskService.__init__`
- Use `dict.get(id)` for safe retrieval
- Keep ID generator separate from storage
- Return sorted list for `get_all_tasks()` (by ID)

**Implementation Sketch**:
```python
class TaskService:
    def __init__(self):
        self._tasks: dict[int, Task] = {}
        self._id_generator = IDGenerator()

    def create_task(self, title: str, description: str = "") -> Task:
        task_id = self._id_generator.next_id()
        task = Task(id=task_id, title=title, description=description)
        self._tasks[task_id] = task
        return task

    def get_task(self, task_id: int) -> Task:
        task = self._tasks.get(task_id)
        if task is None:
            raise TaskNotFoundError(f"Task with ID {task_id} not found")
        return task

    def get_all_tasks(self) -> list[Task]:
        return sorted(self._tasks.values(), key=lambda t: t.id)
```

---

## Decision 7: Testing Approach

**Question**: How should we structure tests (when requested)?

**Options Evaluated**:
1. Pytest with unit/integration/contract separation
2. Unittest (standard library)
3. Pytest with fixtures and parameterization
4. No tests (defer to Phase II)

**Decision**: **Pytest with three-tier test structure (optional for Phase I MVP)**

**Rationale**:
- ✅ Pytest is industry standard
- ✅ Better test discovery than unittest
- ✅ Fixtures reduce boilerplate
- ✅ Parameterization for edge cases
- ✅ Clear output and failure reporting
- ⚠️ External dependency (but standard for testing)
- ⚠️ Tests are optional for Phase I MVP

**Test Structure**:
```
tests/
├── unit/               # Isolated component tests
│   ├── test_task.py              # Task model validation
│   ├── test_task_service.py      # Service CRUD operations
│   └── test_validators.py        # Validation helpers
├── integration/        # Multi-component tests
│   └── test_cli_integration.py   # End-to-end CLI flows
└── contract/           # API contract tests
    └── test_service_contract.py  # Service interface contracts
```

**Best Practices**:
- One test file per source file (unit tests)
- Use fixtures for common setup (TaskService instance, sample tasks)
- Parametrize tests for edge cases
- Test both success and failure paths
- Verify error messages match spec 003 requirements

---

## Summary

All technology decisions prioritize:
1. **No External Dependencies** (Phase I constraint)
2. **Python Standard Library** (argparse, dataclasses, typing)
3. **Simplicity** (avoid over-engineering)
4. **Type Safety** (type hints throughout)
5. **Testability** (clean separation of concerns)
6. **Constitution Compliance** (modular architecture, clean Python design)

**Key Technologies**:
- Language: Python 3.13+
- CLI: argparse (standard library)
- Data Model: dataclasses (standard library)
- Storage: dict (built-in)
- Testing: pytest (optional, when tests requested)
- Formatting: custom (string methods)
- Error Handling: custom exception hierarchy

**No External Dependencies Required** for Phase I MVP.
