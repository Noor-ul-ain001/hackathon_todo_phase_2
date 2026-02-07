# Implementation Plan: Phase I Unified Todo Application

**Branch**: `004-implementation-plan` | **Date**: 2025-12-23 | **Spec**: [Multiple specs integrated]
**Input**: Unified Phase I implementation integrating CRUD operations, Task data model, and CLI interaction layer

**Integrated Specifications**:
- [001-phase1-core-crud](../001-phase1-core-crud/spec.md) - CRUD operations
- [002-task-model](../002-task-model/spec.md) - Task data structure
- [003-cli-interaction](../003-cli-interaction/spec.md) - CLI interface

**Note**: This plan integrates all three Phase I specifications into a cohesive architecture following constitution principles.

## Summary

Phase I delivers a minimal viable product (MVP) for task management through a command-line interface with in-memory storage. The implementation follows a three-layer architecture: **Data Model** (Task entity with validation), **Service Layer** (CRUD operations and business logic), and **Presentation Layer** (CLI interface with formatted output).

**Primary Requirements**:
- Create, read, update, delete, and toggle completion of tasks
- Auto-generated sequential IDs starting from 1
- Four task fields: id (integer), title (string), description (string), completed (boolean)
- Command-line interface with 8 commands (add, list, update, complete, incomplete, delete, help, exit)
- In-memory storage (no persistence between sessions)
- Human-readable table output with status indicators (✓/✗)

**Technical Approach**:
- **Language**: Python 3.13+ with type hints and dataclasses
- **Architecture**: Three-layer modular design (models → services → UI)
- **CLI Framework**: Python argparse (standard library, no external dependencies)
- **Validation**: Field-level validation in model layer, business rules in service layer
- **Error Handling**: Exception-based with user-friendly messages at UI layer
- **Testing**: Pytest for unit, integration, and contract tests (when tests are requested)

---

## Technical Context

**Language/Version**: Python 3.13+

**Primary Dependencies**: None (Python standard library only for Phase I)
- `dataclasses` - Task model structure
- `argparse` - CLI command parsing
- `typing` - Type hints and annotations
- `sys` - stdout/stderr handling

**Storage**: In-memory only (Python list/dict for task storage)

**Testing**: pytest (when tests are requested; not mandatory for Phase I MVP)

**Target Platform**: Cross-platform CLI (Windows, macOS, Linux terminals)

**Project Type**: Single project (CLI application)

**Performance Goals**:
- Task creation: <10ms per task
- List display: <1s for 100 tasks
- ID generation: <1ms

**Constraints**:
- No external dependencies beyond Python 3.13+ standard library
- No persistence layer (in-memory only)
- CLI-only interface (no web/GUI)
- Single-threaded execution
- No Phase II/III features

**Scale/Scope**:
- Target: 100-1000 tasks per session
- Memory: <100MB for reasonable usage
- Single user per session

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Specification First ✅
- **Status**: PASS
- **Evidence**: Three complete specifications (001, 002, 003) approved before planning

### Principle II: Phase-Bound Enforcement ✅
- **Status**: PASS
- **Phase I Only**:
  - ✅ CRUD operations only (no search/filter/sort)
  - ✅ 4 task fields only (id, title, description, completed)
  - ✅ In-memory storage only (no persistence)
  - ✅ CLI-only interface (no web/GUI)
- **Phase II Excluded**: ❌ No priority, tags, search, filter, sort, persistence
- **Phase III Excluded**: ❌ No due dates, recurring tasks, reminders

### Principle III: Agentic Workflow Only ✅
- **Status**: PASS
- **Evidence**: Following `/sp.specify` → `/sp.plan` → `/sp.tasks` → `/sp.implement` workflow

### Principle IV: Modular Architecture ✅
- **Status**: PASS
- **Modules**:
  - `src/models/task.py` - Data model (independent)
  - `src/services/task_service.py` - Business logic (depends on models)
  - `src/ui/cli.py` - User interface (depends on services)
  - `src/utils/validators.py` - Shared validation helpers

### Principle V: Clean Python Design ✅
- **Status**: PASS
- **Standards**:
  - Python 3.13+ with type hints
  - Dataclasses for Task model
  - PEP 8 compliance
  - Descriptive names, no magic numbers
  - Explicit error handling

### Principle VI: Test-Driven Development ⚠️
- **Status**: OPTIONAL FOR PHASE I MVP
- **Note**: Tests not mandatory but supported via pytest when requested

### Principle VII: Incremental Delivery ✅
- **Status**: PASS
- **Checkpoint**: Working CRUD CLI with in-memory storage

### Principle VIII: Reusable Intelligence ✅
- **Status**: PASS
- **Subagents**: spec_writer, planner_agent, task_designer, python_implementer

### Principle IX: Documentation Standards ✅
- **Status**: PASS
- **Docs**: README.md (to be created), CLAUDE.md (exists), constitution.md (exists), specs (complete)

**Overall Constitution Compliance**: ✅ PASS - All gates satisfied

---

## Project Structure

### Documentation (Phase I)

```text
specs/004-implementation-plan/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (technology decisions)
├── data-model.md        # Phase 1 output (Task entity design)
├── quickstart.md        # Phase 1 output (setup and usage guide)
└── contracts/           # Phase 1 output (internal API contracts)
    └── task_service.md  # Service layer interface contract
```

### Source Code (repository root)

```text
src/
├── __init__.py
├── main.py                      # Application entry point
├── models/
│   ├── __init__.py
│   └── task.py                  # Task dataclass with validation
├── services/
│   ├── __init__.py
│   ├── task_service.py          # CRUD operations and business logic
│   └── id_generator.py          # Sequential ID generation
├── ui/
│   ├── __init__.py
│   ├── cli.py                   # CLI argument parsing and command routing
│   ├── formatter.py             # Table formatting and status indicators
│   └── messages.py              # Error/success message templates
└── utils/
    ├── __init__.py
    └── validators.py            # Field validation helpers

tests/                           # Created when tests are requested
├── unit/
│   ├── test_task.py             # Task model unit tests
│   ├── test_task_service.py    # Service layer unit tests
│   └── test_validators.py      # Validator unit tests
├── integration/
│   └── test_cli_integration.py  # End-to-end CLI tests
└── contract/
    └── test_service_contract.py # Service layer contract tests

pyproject.toml                   # Python project configuration (UV)
README.md                        # Project documentation
CLAUDE.md                        # Agent workflow rules (exists)
.specify/                        # SpecKit Plus templates (exists)
```

**Structure Decision**: Single project structure selected. This is a CLI-only application with clear three-layer architecture:
1. **Models Layer** (`src/models/`) - Task entity and data structures
2. **Services Layer** (`src/services/`) - Business logic and CRUD operations
3. **UI Layer** (`src/ui/`) - CLI interface and user interaction

This structure aligns with constitution Principle IV (Modular Architecture) and supports independent testing of each layer.

---

## Complexity Tracking

> No constitution violations - this section is empty as all principles are satisfied.

---

## Phase 0: Research & Technology Decisions

### Research Objectives

1. **CLI Framework Selection**: Evaluate Python CLI options (argparse vs click vs typer)
2. **Data Modeling Approach**: Choose between dataclass, Pydantic, or custom classes
3. **ID Generation Strategy**: Determine sequential ID implementation
4. **Table Formatting**: Identify best approach for aligned terminal output
5. **Error Handling Pattern**: Define exception hierarchy and propagation strategy

### Decisions (to be documented in research.md)

**Decision 1: CLI Framework**
- **Chosen**: `argparse` (Python standard library)
- **Rationale**:
  - No external dependencies (Phase I constraint)
  - Built-in to Python 3.13+
  - Sufficient for 8 commands with simple arguments
  - Well-documented and widely used
- **Alternatives Considered**:
  - `click` - Rejected: external dependency
  - `typer` - Rejected: external dependency, overkill for Phase I
  - Manual parsing - Rejected: error-prone, reinventing the wheel

**Decision 2: Task Model Implementation**
- **Chosen**: `dataclasses.dataclass` with `__post_init__` validation
- **Rationale**:
  - Standard library (no dependencies)
  - Clean, readable syntax
  - Type hints integrated
  - `__post_init__` supports field validation
  - Immutable option via `frozen=True` for ID field enforcement
- **Alternatives Considered**:
  - `Pydantic` - Rejected: external dependency, overkill for Phase I
  - Custom class with `@property` - Rejected: more boilerplate than dataclass

**Decision 3: ID Generation**
- **Chosen**: Simple counter with class-level state in `IDGenerator`
- **Rationale**:
  - Sequential IDs starting from 1
  - Never reuses IDs (counter only increments)
  - Simple, deterministic, fast (<1ms)
  - No threading concerns (single-threaded Phase I)
- **Alternatives Considered**:
  - UUID - Rejected: overkill, not user-friendly (huge IDs)
  - Database sequence - Rejected: no database in Phase I

**Decision 4: Table Formatting**
- **Chosen**: Custom formatter with string padding and alignment
- **Rationale**:
  - Full control over column widths and alignment
  - Handles truncation with "..." easily
  - Adapts to terminal width
  - No external dependencies
- **Alternatives Considered**:
  - `tabulate` library - Rejected: external dependency
  - `rich` library - Rejected: external dependency, colors not required

**Decision 5: Error Handling**
- **Chosen**: Custom exception hierarchy with user-friendly messages at UI boundary
- **Rationale**:
  - Model layer raises `ValidationError`
  - Service layer raises `TaskNotFoundError`, `InvalidOperationError`
  - UI layer catches all exceptions and displays user-friendly messages
  - Errors to stderr, successes to stdout (FR-025)
- **Alternatives Considered**:
  - Return codes/tuples - Rejected: less Pythonic, harder to propagate context
  - Generic exceptions - Rejected: less specific, harder to handle appropriately

**Decision 6: Storage Strategy**
- **Chosen**: In-memory dictionary (ID → Task mapping) + ID generator
- **Rationale**:
  - Fast O(1) lookup by ID
  - Maintains insertion order (Python 3.7+)
  - Simple to implement
  - No persistence needed (Phase I constraint)
- **Alternatives Considered**:
  - List of tasks - Rejected: O(n) lookup, no natural ID indexing
  - SQLite in-memory - Rejected: overkill for Phase I

---

## Phase 1: Design & Contracts

### Data Model Design

**Entity: Task**

```python
from dataclasses import dataclass, field
from typing import Optional

@dataclass
class Task:
    """
    Represents a single to-do item.

    Fields:
        id: Unique positive integer (auto-generated, immutable)
        title: Required non-empty string
        description: Optional string (defaults to empty)
        completed: Boolean status (defaults to False)
    """
    id: int
    title: str
    description: str = ""
    completed: bool = False

    def __post_init__(self):
        """Validate task fields after initialization."""
        # ID validation
        if not isinstance(self.id, int) or self.id < 1:
            raise ValidationError("ID must be a positive integer")

        # Title validation
        if not isinstance(self.title, str):
            raise ValidationError("Title must be a string")
        if not self.title or self.title.isspace():
            raise ValidationError("Title is required and cannot be empty")

        # Description validation
        if self.description is None:
            self.description = ""
        if not isinstance(self.description, str):
            raise ValidationError("Description must be a string")

        # Completed validation
        if not isinstance(self.completed, bool):
            raise ValidationError("Completed status must be a boolean (true or false)")

        # Normalize title (trim whitespace, normalize spaces)
        self.title = " ".join(self.title.split())
```

**Validation Rules** (from spec 002):
- ID: positive integer (>= 1), unique, immutable
- Title: non-empty string, whitespace trimmed
- Description: string (None → ""), allows empty
- Completed: strict boolean (no truthy coercion)

**Default Values**:
- ID: auto-generated by service layer
- Title: no default (required)
- Description: "" (empty string)
- Completed: False

---

### Service Layer Design

**TaskService Class**

Responsibilities:
- CRUD operations (Create, Read, Update, Delete)
- ID generation and uniqueness enforcement
- Task storage management (in-memory dict)
- Business logic validation
- Task completion toggling

```python
class TaskService:
    """
    Service layer for task management operations.

    Responsibilities:
        - CRUD operations
        - ID generation
        - In-memory storage management
        - Business rule enforcement
    """

    def __init__(self):
        self._tasks: dict[int, Task] = {}
        self._id_generator = IDGenerator()

    def create_task(self, title: str, description: str = "") -> Task:
        """Create new task with auto-generated ID."""

    def get_task(self, task_id: int) -> Task:
        """Retrieve task by ID or raise TaskNotFoundError."""

    def get_all_tasks(self) -> list[Task]:
        """Retrieve all tasks ordered by ID."""

    def update_task(self, task_id: int, title: Optional[str] = None,
                   description: Optional[str] = None) -> Task:
        """Update task fields (title and/or description)."""

    def delete_task(self, task_id: int) -> None:
        """Permanently remove task."""

    def toggle_completion(self, task_id: int, completed: bool) -> Task:
        """Mark task as complete or incomplete."""

    def get_task_count(self) -> tuple[int, int]:
        """Return (total_count, completed_count)."""
```

---

### CLI Layer Design

**CLI Module Structure**

1. **cli.py**: Argument parsing and command routing
   - Uses `argparse` for command-line parsing
   - Routes commands to appropriate service methods
   - Handles exceptions and displays user-friendly errors

2. **formatter.py**: Output formatting
   - Table formatting with aligned columns
   - Status indicators (✓/✗ with ASCII fallback)
   - Text truncation with "..."
   - Terminal width adaptation

3. **messages.py**: Message templates
   - Success messages (with ✓ prefix)
   - Error messages (with ✗ prefix)
   - Info messages (with ℹ prefix)
   - Consistent formatting

**Command Mapping** (from spec 003):

| Command | Service Method | Arguments |
|---------|---------------|-----------|
| add | `create_task()` | title, description (optional) |
| list | `get_all_tasks()` | none |
| update | `update_task()` | task_id, field, value |
| complete | `toggle_completion()` | task_id, completed=True |
| incomplete | `toggle_completion()` | task_id, completed=False |
| delete | `delete_task()` | task_id |
| help | (built-in) | command (optional) |
| exit | (system exit) | none |

---

### Internal API Contracts

**TaskService Contract** (documented in `contracts/task_service.md`):

```text
## create_task(title: str, description: str = "") -> Task

Create a new task with auto-generated ID.

Parameters:
  - title (str): Required task title, non-empty
  - description (str): Optional task details, defaults to ""

Returns:
  - Task: Newly created task with unique ID and completed=False

Raises:
  - ValidationError: If title is empty or invalid type

Example:
  task = service.create_task("Buy groceries", "Milk, eggs, bread")
  # Returns: Task(id=1, title="Buy groceries", description="Milk, eggs, bread", completed=False)

---

## get_task(task_id: int) -> Task

Retrieve a single task by ID.

Parameters:
  - task_id (int): Unique task identifier

Returns:
  - Task: The requested task

Raises:
  - TaskNotFoundError: If task_id does not exist

Example:
  task = service.get_task(1)

---

## get_all_tasks() -> list[Task]

Retrieve all tasks ordered by ID.

Returns:
  - list[Task]: All tasks, ordered by ID ascending

Example:
  tasks = service.get_all_tasks()
  # Returns: [Task(id=1,...), Task(id=2,...), ...]

---

## update_task(task_id: int, title: Optional[str] = None, description: Optional[str] = None) -> Task

Update task fields. At least one field must be provided.

Parameters:
  - task_id (int): Task to update
  - title (Optional[str]): New title (if provided)
  - description (Optional[str]): New description (if provided)

Returns:
  - Task: Updated task

Raises:
  - TaskNotFoundError: If task_id does not exist
  - ValidationError: If title is empty when provided
  - InvalidOperationError: If neither title nor description provided

Example:
  task = service.update_task(1, title="Buy groceries and supplies")

---

## delete_task(task_id: int) -> None

Permanently remove a task. ID is never reused.

Parameters:
  - task_id (int): Task to delete

Returns:
  - None

Raises:
  - TaskNotFoundError: If task_id does not exist

Example:
  service.delete_task(1)

---

## toggle_completion(task_id: int, completed: bool) -> Task

Mark task as complete or incomplete.

Parameters:
  - task_id (int): Task to update
  - completed (bool): True for complete, False for incomplete

Returns:
  - Task: Updated task

Raises:
  - TaskNotFoundError: If task_id does not exist

Example:
  task = service.toggle_completion(1, True)  # Mark complete
  task = service.toggle_completion(1, False) # Mark incomplete

---

## get_task_count() -> tuple[int, int]

Get task statistics.

Returns:
  - tuple[int, int]: (total_tasks, completed_tasks)

Example:
  total, completed = service.get_task_count()
  # Returns: (5, 2) means 5 total tasks, 2 completed
```

---

### Quickstart Guide

**File**: `specs/004-implementation-plan/quickstart.md`

```markdown
# Phase I Agentic Todo Application - Quickstart

## Prerequisites

- Python 3.13 or higher
- UV environment manager (recommended) or pip

## Setup

1. Clone repository:
   ```bash
   git clone <repo-url>
   cd todo/phase1
   ```

2. Install Python 3.13+ (if needed):
   ```bash
   python --version  # Verify 3.13+
   ```

3. No external dependencies needed (Phase I uses Python standard library only)

## Running the Application

### Single Command Mode

```bash
python src/main.py add "Buy groceries"
python src/main.py list
python src/main.py complete 1
python src/main.py delete 1
```

### Interactive Mode (if implemented)

```bash
python src/main.py
> add "Buy groceries"
> list
> exit
```

## Common Commands

### Add Task
```bash
python src/main.py add "Task title"
python src/main.py add "Task title" "Optional description"
```

### List Tasks
```bash
python src/main.py list
# or
python src/main.py ls
```

### Update Task
```bash
python src/main.py update 1 title "New title"
python src/main.py update 1 description "New description"
```

### Complete/Incomplete Task
```bash
python src/main.py complete 1
python src/main.py done 1

python src/main.py incomplete 1
python src/main.py pending 1
```

### Delete Task
```bash
python src/main.py delete 1
python src/main.py rm 1
```

### Help
```bash
python src/main.py help
python src/main.py help add
```

## Example Session

```bash
$ python src/main.py add "Buy groceries" "Milk, eggs, bread"
✓ Task created successfully: 1 - Buy groceries

$ python src/main.py add "Write report"
✓ Task created successfully: 2 - Write report

$ python src/main.py list
ID | Status | Title                | Description
---|--------|---------------------|---------------------------
1  | ✗      | Buy groceries       | Milk, eggs, bread
2  | ✗      | Write report        |
---
Total: 2 tasks (0 completed)

$ python src/main.py complete 1
✓ Task 1 marked as complete

$ python src/main.py list
ID | Status | Title                | Description
---|--------|---------------------|---------------------------
1  | ✓      | Buy groceries       | Milk, eggs, bread
2  | ✗      | Write report        |
---
Total: 2 tasks (1 completed)
```

## Troubleshooting

**"Title is required and cannot be empty"**
- Ensure task title is not empty or whitespace-only
- Use quotes for multi-word titles: `add "My task"`

**"Task with ID X not found"**
- Verify task ID exists using `list` command
- IDs are never reused after deletion

**Command not recognized**
- Type `help` to see all available commands
- Check command spelling and syntax

## Phase I Limitations

- No persistence: Tasks are lost when application exits
- No search/filter/sort: Use `list` to see all tasks
- No priorities or tags: Phase II feature
- CLI only: No web or GUI interface
```

---

## Implementation Order

### Phase 1: Foundation (Data Model)
1. **Create project structure** (src/, tests/ directories)
2. **Implement Task model** (`src/models/task.py`)
   - Dataclass with 4 fields
   - `__post_init__` validation
   - Custom exceptions (ValidationError)
3. **Implement validators** (`src/utils/validators.py`)
   - Title validation helper
   - Description normalization helper
4. **Unit tests for Task** (if requested)

### Phase 2: Business Logic (Service Layer)
5. **Implement ID Generator** (`src/services/id_generator.py`)
   - Sequential counter
   - Thread-safe (for future)
6. **Implement TaskService** (`src/services/task_service.py`)
   - CRUD methods
   - In-memory storage (dict)
   - Exception handling
7. **Unit tests for TaskService** (if requested)

### Phase 3: User Interface (CLI Layer)
8. **Implement message templates** (`src/ui/messages.py`)
   - Success/error/info messages
   - Formatting helpers
9. **Implement table formatter** (`src/ui/formatter.py`)
   - Column alignment
   - Status indicators (✓/✗)
   - Truncation logic
10. **Implement CLI** (`src/ui/cli.py`)
    - Argparse setup
    - Command routing
    - Exception handling and display
11. **Implement main entry point** (`src/main.py`)
    - Initialize service
    - Parse arguments
    - Route to CLI
12. **Integration tests** (if requested)

### Phase 4: Documentation & Polish
13. **Create README.md**
    - Project overview
    - Setup instructions
    - Usage examples
14. **Create pyproject.toml**
    - Python version specification
    - Project metadata
15. **Verify constitution compliance**
    - Phase I only features
    - No external dependencies
    - Clean modular architecture

---

## Module Responsibilities

### `src/models/task.py`
**Purpose**: Define Task entity and validation
**Responsibilities**:
- Task dataclass structure
- Field validation in `__post_init__`
- Type enforcement
- Default value initialization
**Dependencies**: None (base layer)
**Exports**: `Task`, `ValidationError`

### `src/services/id_generator.py`
**Purpose**: Generate unique sequential IDs
**Responsibilities**:
- Maintain ID counter
- Never reuse IDs
- Thread-safe increment (for future)
**Dependencies**: None
**Exports**: `IDGenerator`

### `src/services/task_service.py`
**Purpose**: CRUD operations and business logic
**Responsibilities**:
- Create, read, update, delete tasks
- Manage in-memory storage
- Enforce business rules
- Generate IDs via IDGenerator
**Dependencies**: `models.task`, `services.id_generator`
**Exports**: `TaskService`, `TaskNotFoundError`, `InvalidOperationError`

### `src/utils/validators.py`
**Purpose**: Shared validation helpers
**Responsibilities**:
- Title validation (non-empty, whitespace)
- Description normalization
- Type checking helpers
**Dependencies**: None
**Exports**: Helper functions

### `src/ui/messages.py`
**Purpose**: User-facing message templates
**Responsibilities**:
- Success message formatting
- Error message formatting
- Info message formatting
- Consistent prefixes (✓, ✗, ℹ)
**Dependencies**: None
**Exports**: Message functions

### `src/ui/formatter.py`
**Purpose**: Table and output formatting
**Responsibilities**:
- Table layout with aligned columns
- Status indicator rendering (✓/✗)
- Text truncation with "..."
- Terminal width detection and adaptation
**Dependencies**: `models.task`
**Exports**: `TaskFormatter`

### `src/ui/cli.py`
**Purpose**: Command-line interface and routing
**Responsibilities**:
- Argparse setup (8 commands)
- Command routing to service methods
- Exception handling
- Display success/error messages
**Dependencies**: `services.task_service`, `ui.formatter`, `ui.messages`
**Exports**: `CLI`

### `src/main.py`
**Purpose**: Application entry point
**Responsibilities**:
- Initialize TaskService
- Create CLI instance
- Parse arguments and execute command
- Exit with appropriate code
**Dependencies**: All modules
**Exports**: None (entry point)

---

## Non-Functional Requirements

### Performance
- Task creation: <10ms (measured via success criteria SC-001 from spec 002)
- List display: <1s for 100 tasks (SC-004 from spec 001)
- ID generation: <1ms

### Reliability
- 100% data integrity within session (SC-006 from spec 002)
- Zero crashes from invalid input (SC-007 from spec 003)
- 95% error coverage with clear messages (SC-003 from spec 003)

### Usability
- First command within 30 seconds (SC-001 from spec 003)
- Identify incomplete tasks in 5 seconds (SC-002 from spec 003)
- Complete CRUD without help after one viewing (SC-006 from spec 003)

### Compatibility
- Cross-platform (Windows, macOS, Linux)
- Terminal width: 40-200 columns (SC-004 from spec 003)
- Unicode support with ASCII fallback

---

## Risk Analysis

### Technical Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Unicode rendering issues | Medium | Low | Provide ASCII fallback ([X]/[ ]) |
| Terminal width detection failure | Low | Low | Use sensible default (80 cols) |
| ID counter overflow | Very Low | Low | Python int has unlimited precision |
| Argparse learning curve | Low | Low | Well-documented standard library |

### Project Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Scope creep (Phase II features) | Medium | High | Constitution enforcement, code review |
| Over-engineering | Medium | Medium | Follow spec exactly, defer optimization |
| Inconsistent error messages | Low | Medium | Use messages.py templates consistently |
| Missing edge cases | Low | Medium | Reference spec 003 edge cases (7 documented) |

---

## Success Criteria Mapping

All success criteria from three specs mapped to implementation verification:

**From Spec 001 (CRUD)**:
- SC-001: Task creation <5s → Verify with timing
- SC-002: List 20 tasks single screen → Test output height
- SC-003: Complete CRUD without docs → User testing
- SC-004: Handle 100+ tasks <1s → Performance testing
- SC-005: 95% command success → Error handling coverage
- SC-006: Data integrity → State consistency tests
- SC-007: Identify complete/incomplete <2s → Visual indicator testing

**From Spec 002 (Task Model)**:
- SC-001: Creation <10ms → Timing measurement
- SC-002: 10,000 unique IDs → ID generator stress test
- SC-003: 100% invalid rejection → Validation test coverage
- SC-004: 100% valid acceptance → Positive test coverage
- SC-005: 100% character fidelity → Unicode/special char tests
- SC-006: 100% toggle accuracy → Completion state tests
- SC-007: 100% field update accuracy → Update isolation tests

**From Spec 003 (CLI)**:
- SC-001: First command <30s → User onboarding test
- SC-002: Identify incomplete <5s → Visual scanning test
- SC-003: 95% error coverage → Error message inventory
- SC-004: Terminal 40-200 cols → Width adaptation tests
- SC-005: 100% char preservation → Input/output fidelity
- SC-006: CRUD without help → Post-help execution test
- SC-007: Zero crashes → Error scenario testing

---

## Next Steps

After this planning phase:

1. **User Review**: Present this plan for approval
2. **`/sp.tasks`**: Generate task breakdown with dependencies
3. **`/sp.implement`**: Execute tasks in defined order
4. **Testing**: Run validation tests (if tests created)
5. **Documentation**: Finalize README.md
6. **Demo**: Execute quickstart example session
7. **Phase I Completion**: Verify all constitution gates pass

**Deliverables**:
- Working CLI application
- All CRUD operations functional
- Clean three-layer architecture
- Constitution-compliant Phase I implementation
- Ready for Phase II planning (when requested)
