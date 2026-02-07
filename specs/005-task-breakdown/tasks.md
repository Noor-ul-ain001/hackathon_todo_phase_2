# Tasks: Phase I Unified Todo Application

**Input**: Design documents from `/specs/004-implementation-plan/`
**Prerequisites**: plan.md (architecture), spec.md (user stories), data-model.md (Task entity), contracts/ (service interface), research.md (technology decisions)

**Tests**: Tests are OPTIONAL for Phase I MVP - not included in this task breakdown unless explicitly requested

**Organization**: Tasks are grouped by user story (P1-P5) to enable independent implementation and testing of each story

---

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4, US5)
- Include exact file paths in descriptions

---

## Path Conventions

**Single project structure** (from plan.md):
- `src/` at repository root
- `src/models/` - Data model layer
- `src/services/` - Business logic layer
- `src/ui/` - User interface layer
- `src/utils/` - Shared utilities

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Create project directory structure: src/, src/models/, src/services/, src/ui/, src/utils/
- [X] T002 [P] Create empty __init__.py files in all package directories (src/, src/models/, src/services/, src/ui/, src/utils/)
- [X] T003 [P] Create pyproject.toml with Python 3.13+ specification and project metadata

**Checkpoint**: Project structure ready for implementation

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 [P] Create custom exception classes in src/utils/exceptions.py (ValidationError, TaskNotFoundError, InvalidOperationError)
- [X] T005 [P] Implement validation helper functions in src/utils/validators.py (validate_title, normalize_title, validate_description)
- [X] T006 Implement Task dataclass in src/models/task.py with 4 fields (id, title, description, completed) and __post_init__ validation
- [X] T007 Implement IDGenerator class in src/services/id_generator.py with sequential counter starting from 1

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Quick Task Capture (Priority: P1) 🎯 MVP

**Goal**: Enable users to create tasks with title and optional description, with auto-generated IDs

**Independent Test**: Launch CLI, add task with title, verify it appears in task list with unique ID

**User Story from Spec**: As a user, I need to quickly capture tasks that come to mind so I don't forget important things I need to do.

### Implementation for User Story 1

- [X] T008 [US1] Implement TaskService.create_task() method in src/services/task_service.py (title, description parameters)
- [X] T009 [US1] Implement TaskService.__init__() with empty tasks dict and IDGenerator instance in src/services/task_service.py
- [X] T010 [US1] Implement success message template for task creation in src/ui/messages.py (format: "✓ Task created successfully: {id} - {title}")
- [X] T011 [US1] Implement error message templates in src/ui/messages.py (ValidationError, empty title error)
- [X] T012 [US1] Implement 'add' command handler in src/ui/cli.py using argparse with title and optional description arguments
- [X] T013 [US1] Wire 'add' command to TaskService.create_task() in src/ui/cli.py with exception handling
- [X] T014 [US1] Create main.py entry point that initializes TaskService and CLI, handles command execution

**Checkpoint**: At this point, User Story 1 is fully functional - users can create tasks and see success/error messages

---

## Phase 4: User Story 2 - Task List Visibility (Priority: P2)

**Goal**: Display all tasks in a clean, aligned table format with status indicators

**Independent Test**: Add multiple tasks, execute list command, verify all tasks displayed with ID, status, title, description

**User Story from Spec**: As a user, I need to view all my tasks in a clear, organized format so I can see what needs to be done.

### Implementation for User Story 2

- [X] T015 [US2] Implement TaskService.get_all_tasks() method in src/services/task_service.py (returns list sorted by ID)
- [X] T016 [US2] Implement TaskService.get_task_count() method in src/services/task_service.py (returns tuple of total, completed counts)
- [X] T017 [P] [US2] Implement status indicator rendering in src/ui/formatter.py (✓ for completed, ✗ for incomplete, ASCII fallback [X]/[ ])
- [X] T018 [P] [US2] Implement table column formatting in src/ui/formatter.py (ID right-aligned, Status centered, Title/Description left-aligned)
- [X] T019 [US2] Implement text truncation with "..." in src/ui/formatter.py (title max 50 chars, description max 100 chars in list view)
- [X] T020 [US2] Implement table header and separator rendering in src/ui/formatter.py
- [X] T021 [US2] Implement TaskFormatter.format_task_list() method in src/ui/formatter.py (accepts list of tasks, returns formatted table string)
- [X] T022 [US2] Implement empty state message in src/ui/messages.py ("No tasks yet. Use 'add' to create your first task.")
- [X] T023 [US2] Implement task count summary message in src/ui/messages.py (format: "Total: {total} tasks ({completed} completed)")
- [X] T024 [US2] Implement 'list' command handler in src/ui/cli.py using argparse (with alias 'ls')
- [X] T025 [US2] Wire 'list' command to TaskService.get_all_tasks() and TaskFormatter in src/ui/cli.py

**Checkpoint**: At this point, User Story 2 is fully functional - users can view all tasks in formatted table with status indicators

---

## Phase 5: User Story 3 - Task Completion Tracking (Priority: P3)

**Goal**: Allow users to mark tasks as complete or incomplete, with status reflected in list view

**Independent Test**: Create task, mark complete, verify status changes to ✓, mark incomplete, verify status reverts to ✗

**User Story from Spec**: As a user, I need to mark tasks as complete or incomplete so I can track my progress and know what still needs attention.

### Implementation for User Story 3

- [X] T026 [US3] Implement TaskService.get_task() method in src/services/task_service.py (lookup by ID, raise TaskNotFoundError if not found)
- [X] T027 [US3] Implement TaskService.toggle_completion() method in src/services/task_service.py (accepts task_id and completed boolean)
- [X] T028 [US3] Implement success message for completion toggle in src/ui/messages.py (format: "✓ Task {id} marked as {complete/incomplete}")
- [X] T029 [US3] Implement 'complete' command handler in src/ui/cli.py with argparse (accepts task ID, with alias 'done')
- [X] T030 [US3] Wire 'complete' command to TaskService.toggle_completion(id, True) in src/ui/cli.py with error handling
- [X] T031 [US3] Implement 'incomplete' command handler in src/ui/cli.py with argparse (accepts task ID, with aliases 'undone', 'pending')
- [X] T032 [US3] Wire 'incomplete' command to TaskService.toggle_completion(id, False) in src/ui/cli.py with error handling

**Checkpoint**: At this point, User Story 3 is fully functional - users can toggle task completion and see status reflected in list

---

## Phase 6: User Story 4 - Task Modification (Priority: P4)

**Goal**: Allow users to update task title and/or description while preserving other attributes

**Independent Test**: Create task, update title, verify change reflected; update description, verify change reflected

**User Story from Spec**: As a user, I need to update task details (title and description) so I can correct mistakes or add more information as tasks evolve.

### Implementation for User Story 4

- [X] T033 [US4] Implement TaskService.update_task() method in src/services/task_service.py (accepts task_id, optional title, optional description)
- [X] T034 [US4] Add validation in TaskService.update_task() to require at least one field (raise InvalidOperationError if neither provided)
- [X] T035 [US4] Implement success message for task update in src/ui/messages.py (format: "✓ Task {id} updated successfully")
- [X] T036 [US4] Implement error message for InvalidOperationError in src/ui/messages.py ("Must provide title or description to update")
- [X] T037 [US4] Implement 'update' command handler in src/ui/cli.py with argparse (accepts task ID, field name, value)
- [X] T038 [US4] Add field validation in 'update' command handler to ensure field is 'title' or 'description'
- [X] T039 [US4] Wire 'update' command to TaskService.update_task() in src/ui/cli.py with error handling for TaskNotFoundError and ValidationError

**Checkpoint**: At this point, User Story 4 is fully functional - users can update task fields with validation

---

## Phase 7: User Story 5 - Task Deletion (Priority: P5)

**Goal**: Allow users to permanently delete tasks, with ID never reused

**Independent Test**: Create task, delete by ID, verify task no longer appears in list

**User Story from Spec**: As a user, I need to delete tasks that are no longer relevant so my task list stays clean and focused on what matters.

### Implementation for User Story 5

- [X] T040 [US5] Implement TaskService.delete_task() method in src/services/task_service.py (accepts task_id, removes from storage)
- [X] T041 [US5] Implement success message for task deletion in src/ui/messages.py (format: "✓ Task {id} deleted successfully")
- [X] T042 [US5] Implement 'delete' command handler in src/ui/cli.py with argparse (accepts task ID, with alias 'rm')
- [X] T043 [US5] Wire 'delete' command to TaskService.delete_task() in src/ui/cli.py with error handling for TaskNotFoundError

**Checkpoint**: At this point, User Story 5 is fully functional - users can delete tasks permanently

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Complete remaining CLI commands, documentation, and final touches

- [X] T044 [P] Implement 'help' command handler in src/ui/cli.py using argparse built-in help system
- [X] T045 [P] Add command aliases to argparse configuration in src/ui/cli.py (ls→list, rm→delete, done→complete, undone/pending→incomplete, quit/q→exit)
- [X] T046 [P] Implement 'exit' command handler in src/ui/cli.py (optional, for interactive mode)
- [X] T047 [P] Add terminal width detection in src/ui/formatter.py using shutil.get_terminal_size() with fallback to 80 columns
- [X] T048 [P] Implement TaskNotFoundError message template in src/ui/messages.py (format: "✗ Task with ID {id} not found")
- [X] T049 [P] Add consistent error output to stderr in src/ui/cli.py (use sys.stderr for all error messages)
- [X] T050 [P] Add consistent success output to stdout in src/ui/cli.py (use sys.stdout for all success/info messages)
- [X] T051 Create README.md with project overview, setup instructions (Python 3.13+), usage examples for all 8 commands
- [X] T052 Add command reference section to README.md with syntax and examples for each command
- [X] T053 Add Phase I limitations section to README.md (no persistence, no Phase II/III features)
- [X] T054 Verify constitution compliance: Phase I features only, no external dependencies, modular architecture

**Checkpoint**: All features complete, documented, and constitution-compliant

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-7)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4 → P5)
- **Polish (Phase 8)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - No dependencies on other stories (but naturally follows US1/US2 for testing)
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 5 (P5)**: Can start after Foundational (Phase 2) - No dependencies on other stories

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Models before services
- Services before UI components
- Core implementation before integration with CLI
- Story complete before moving to next priority

### Parallel Opportunities

- **Setup Phase**: All tasks can run in parallel (different files)
- **Foundational Phase**: T004, T005 can run in parallel; T006 depends on T004; T007 independent
- **Once Foundational completes**: All user stories (US1-US5) can start in parallel if team capacity allows
- **Within User Stories**: Tasks marked [P] can run in parallel (different files)
- **Polish Phase**: Most tasks marked [P] can run in parallel

---

## Parallel Execution Examples

### Foundational Phase (After Setup)

```bash
# Launch in parallel:
Task T004: Create exception classes in src/utils/exceptions.py
Task T005: Implement validators in src/utils/validators.py
Task T007: Implement IDGenerator in src/services/id_generator.py

# Then:
Task T006: Implement Task model (depends on T004 exceptions)
```

### User Story 1 Tasks

```bash
# Launch in parallel (after T008, T009 complete):
Task T010: Success message template in src/ui/messages.py
Task T011: Error message templates in src/ui/messages.py

# Sequential:
Task T008 → T009 → T012 → T013 → T014
```

### User Story 2 Tasks

```bash
# Launch in parallel (after T015, T016 complete):
Task T017: Status indicator rendering in src/ui/formatter.py
Task T018: Column formatting in src/ui/formatter.py
Task T022: Empty state message in src/ui/messages.py
Task T023: Task count summary in src/ui/messages.py
```

### All User Stories After Foundational

```bash
# If team has 5 developers, launch all stories in parallel:
Developer 1: User Story 1 (T008-T014) - Priority 1, MVP
Developer 2: User Story 2 (T015-T025) - Priority 2
Developer 3: User Story 3 (T026-T032) - Priority 3
Developer 4: User Story 4 (T033-T039) - Priority 4
Developer 5: User Story 5 (T040-T043) - Priority 5

# Each story completes independently and can be tested/demoed separately
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

**Minimum Viable Product approach**:

1. Complete Phase 1: Setup (T001-T003)
2. Complete Phase 2: Foundational (T004-T007) - **CRITICAL** blocks all stories
3. Complete Phase 3: User Story 1 (T008-T014)
4. **STOP and VALIDATE**: Test US1 independently
   - Can create tasks with title
   - Can create tasks with title and description
   - Empty title rejected with error
   - Success messages display correctly
5. Deploy/demo if ready

**This gives you a working task creation app immediately!**

### Incremental Delivery

**Progressive enhancement approach**:

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 (T008-T014) → Test independently → **MVP DEMO** ✅
3. Add User Story 2 (T015-T025) → Test independently → Can now view tasks ✅
4. Add User Story 3 (T026-T032) → Test independently → Can mark complete/incomplete ✅
5. Add User Story 4 (T033-T039) → Test independently → Can update task details ✅
6. Add User Story 5 (T040-T043) → Test independently → Can delete tasks ✅
7. Add Polish (T044-T054) → Full CRUD CLI complete ✅

**Each story adds value without breaking previous stories**

### Parallel Team Strategy

**With 3 developers**:

1. **Week 1**: Team completes Setup + Foundational together (T001-T007)
2. **Week 2**: Once Foundational is done:
   - Developer A: User Story 1 + User Story 2 (create + list)
   - Developer B: User Story 3 + User Story 4 (complete + update)
   - Developer C: User Story 5 + Polish (delete + docs)
3. Stories complete and integrate independently
4. Team validates all stories together

---

## Task Acceptance Criteria

Each task is considered complete when:

1. **Code Written**: Implementation matches spec requirements
2. **No Errors**: Code runs without exceptions for valid inputs
3. **Error Handling**: Invalid inputs produce appropriate error messages
4. **Type Hints**: All functions/methods have type annotations
5. **Imports Correct**: All imports resolve without errors
6. **Independent**: Task can be tested without unimplemented dependencies

### Example Acceptance for T008 (TaskService.create_task)

- [X] Method signature: `def create_task(self, title: str, description: str = "") -> Task`
- [X] Generates unique ID using IDGenerator
- [X] Creates Task instance with provided title, description
- [X] Sets completed=False by default
- [X] Stores task in self._tasks dict
- [X] Returns created Task instance
- [X] Raises ValidationError if title is empty (delegated to Task.__post_init__)

---

## Notes

- **Total Tasks**: 54 tasks across 8 phases
- **MVP Tasks**: 11 tasks (Setup + Foundational + US1) = minimum viable product
- **Parallel Opportunities**: 21 tasks marked [P] can run in parallel
- **No Tests Included**: Phase I MVP does not require tests - tests can be added in future
- **Each User Story Independently Testable**: Can demo/validate each story separately
- **Constitution Compliant**: Phase I features only, no external dependencies, modular architecture

**Stop Points for Validation**:
1. After Setup: Project structure exists
2. After Foundational: Core infrastructure ready
3. After Each User Story: Independent functionality testable
4. After Polish: Full application complete

---

## Task Count Summary

- **Phase 1 (Setup)**: 3 tasks
- **Phase 2 (Foundational)**: 4 tasks (blocks all stories)
- **Phase 3 (US1 - Quick Task Capture)**: 7 tasks → **MVP** 🎯
- **Phase 4 (US2 - Task List Visibility)**: 11 tasks
- **Phase 5 (US3 - Task Completion)**: 7 tasks
- **Phase 6 (US4 - Task Modification)**: 7 tasks
- **Phase 7 (US5 - Task Deletion)**: 4 tasks
- **Phase 8 (Polish)**: 11 tasks

**Total**: 54 atomic, executable tasks

**MVP Scope** (Setup + Foundational + US1): 14 tasks
**Full Phase I Scope**: 54 tasks
