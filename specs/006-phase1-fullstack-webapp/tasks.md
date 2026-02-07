# Tasks: Phase 1 Full-Stack Web Application

**Input**: Design documents from `/specs/006-phase1-fullstack-webapp/`
**Prerequisites**: spec.md (required), overview.md (required), api/rest-endpoints.md, database/schema.md, features/

**Tests**: Tests are OPTIONAL for Phase 1 - only manual validation via browser testing

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: `backend/src/`, `frontend/src/`, `frontend/app/`
- Monorepo structure with frontend and backend separation
- Shared config at root (docker-compose.yml, .env.example)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and monorepo structure

- [X] T001 Create monorepo directory structure (frontend/, backend/, specs/, docker-compose.yml)
- [X] T002 [P] Initialize Next.js 16 frontend with TypeScript in frontend/
- [X] T003 [P] Initialize FastAPI backend with UV package manager in backend/
- [X] T004 [P] Create .env.example with DATABASE_URL and BETTER_AUTH_SECRET placeholders
- [X] T005 [P] Create docker-compose.yml for local development (Neon PostgreSQL if needed)
- [X] T006 [P] Create frontend/CLAUDE.md with frontend-specific rules
- [X] T007 [P] Create backend/CLAUDE.md with backend-specific rules

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Setup Neon PostgreSQL database connection string in .env
- [X] T009 Install SQLModel and database dependencies in backend/pyproject.toml
- [X] T010 [P] Install Better Auth dependencies in frontend/package.json
- [X] T011 Create database connection utility in backend/src/database/connection.py
- [X] T012 Create base SQLModel configuration in backend/src/database/base.py
- [X] T013 Define User model (managed by Better Auth) in backend/src/models/user.py
- [X] T014 Define Task model with all Phase 1 fields in backend/src/models/task.py
- [X] T015 Create database tables via SQLModel.metadata.create_all() in backend/src/database/init_db.py
- [X] T016 [P] Create JWT utilities (decode, verify signature) in backend/src/auth/jwt_utils.py
- [X] T017 [P] Create FastAPI authentication dependency (get_current_user) in backend/src/auth/dependencies.py
- [X] T018 [P] Configure Better Auth with JWT plugin in frontend/lib/auth.ts
- [X] T019 [P] Create API client utility with JWT attachment in frontend/lib/api-client.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - User Registration and Authentication (Priority: P1) 🎯 MVP

**Goal**: Enable users to create accounts, sign in, and establish authenticated sessions with JWT tokens

**Independent Test**: Create an account, sign in, verify JWT token is issued, verify session persists across page refreshes

### Implementation for User Story 1

- [ ] T020 [P] [US1] Create registration page UI in frontend/app/auth/register/page.tsx
- [ ] T021 [P] [US1] Create sign-in page UI in frontend/app/auth/signin/page.tsx
- [ ] T022 [P] [US1] Integrate Better Auth registration flow in frontend/app/auth/register/page.tsx
- [ ] T023 [P] [US1] Integrate Better Auth sign-in flow in frontend/app/auth/signin/page.tsx
- [ ] T024 [US1] Create authentication middleware for protected routes in frontend/middleware.ts
- [ ] T025 [US1] Implement session restoration logic in frontend/app/layout.tsx
- [ ] T026 [US1] Add 401/403 error handling with redirect to sign-in in frontend/lib/api-client.ts
- [ ] T027 [P] [US1] Create user registration endpoint (if needed beyond Better Auth) in backend/src/api/routes/auth.py
- [ ] T028 [US1] Test registration flow: create account → auto sign-in → JWT issued
- [ ] T029 [US1] Test sign-in flow: valid credentials → JWT issued → redirect to dashboard
- [ ] T030 [US1] Test invalid credentials: error message without revealing email existence
- [ ] T031 [US1] Test session restoration: close browser → reopen → session restored if JWT valid
- [ ] T032 [US1] Test expired JWT: access protected page → redirected to sign-in

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

---

## Phase 4: User Story 2 - Create and View Tasks (Priority: P1) 🎯 MVP

**Goal**: Enable authenticated users to create tasks and view their task list

**Independent Test**: Sign in, create multiple tasks with titles and descriptions, verify they appear in the list and persist across page refreshes

### Implementation for User Story 2

- [ ] T033 [P] [US2] Create GET /api/{user_id}/tasks endpoint in backend/src/api/routes/tasks.py
- [ ] T034 [P] [US2] Create POST /api/{user_id}/tasks endpoint in backend/src/api/routes/tasks.py
- [ ] T035 [US2] Add user_id matching validation in both GET and POST endpoints in backend/src/api/routes/tasks.py
- [ ] T036 [US2] Filter tasks by authenticated user in GET endpoint query in backend/src/api/routes/tasks.py
- [ ] T037 [US2] Validate title (1-200 chars) and description (max 1000 chars) in POST endpoint in backend/src/api/routes/tasks.py
- [ ] T038 [US2] Associate new task with authenticated user_id in POST endpoint in backend/src/api/routes/tasks.py
- [ ] T039 [P] [US2] Create protected /tasks dashboard page in frontend/app/tasks/page.tsx
- [ ] T040 [P] [US2] Create TaskList component to display tasks in frontend/components/TaskList.tsx
- [ ] T041 [P] [US2] Create TaskForm component for creating tasks in frontend/components/TaskForm.tsx
- [ ] T042 [US2] Integrate GET /api/{user_id}/tasks in TaskList component in frontend/components/TaskList.tsx
- [ ] T043 [US2] Integrate POST /api/{user_id}/tasks in TaskForm component in frontend/components/TaskForm.tsx
- [ ] T044 [US2] Add empty state message when no tasks exist in frontend/components/TaskList.tsx
- [ ] T045 [US2] Add form validation for title length in frontend/components/TaskForm.tsx
- [ ] T046 [US2] Test task creation: provide title → task appears in list immediately
- [ ] T047 [US2] Test task creation with description: both fields saved and displayed
- [ ] T048 [US2] Test task creation with title only: task created successfully
- [ ] T049 [US2] Test task persistence: create task → refresh page → task remains
- [ ] T050 [US2] Test empty state: no tasks → helpful message displayed
- [ ] T051 [US2] Test multiple tasks: clear and organized display

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

---

## Phase 5: User Story 6 - User Data Isolation (Priority: P1) 🎯 CRITICAL SECURITY

**Goal**: Enforce that users can only see and manage their own tasks

**Independent Test**: Create two user accounts, add tasks to each, verify users cannot see or access each other's tasks

### Implementation for User Story 6

- [ ] T052 [US6] Verify user_id from JWT matches user_id in URL for all task endpoints in backend/src/api/routes/tasks.py
- [ ] T053 [US6] Return 403 Forbidden when user_id mismatch detected in backend/src/api/routes/tasks.py
- [ ] T054 [US6] Add WHERE user_id = authenticated_user filter to all task queries in backend/src/api/routes/tasks.py
- [ ] T055 [US6] Test data isolation: User A creates task → User B cannot see it
- [ ] T056 [US6] Test URL manipulation: User A attempts /api/user_b_id/tasks → 403 Forbidden
- [ ] T057 [US6] Test task association: new task associated with correct user_id
- [ ] T058 [US6] Test cross-user operations: attempt to update/delete another user's task → rejected

**Checkpoint**: Security validation complete - users cannot access each other's data

---

## Phase 6: User Story 4 - Mark Tasks Complete/Incomplete (Priority: P2)

**Goal**: Enable users to toggle task completion status to track progress

**Independent Test**: Create tasks, toggle completion status, verify visual indicator changes and persists

### Implementation for User Story 4

- [ ] T059 [P] [US4] Create PATCH /api/{user_id}/tasks/{id}/complete endpoint in backend/src/api/routes/tasks.py
- [ ] T060 [US4] Implement completion toggle logic (read current state, flip boolean) in backend/src/api/routes/tasks.py
- [ ] T061 [US4] Enforce user ownership verification in PATCH endpoint in backend/src/api/routes/tasks.py
- [ ] T062 [US4] Return 404 if task not found or doesn't belong to user in backend/src/api/routes/tasks.py
- [ ] T063 [P] [US4] Add completion toggle UI (checkbox or button) to TaskList component in frontend/components/TaskList.tsx
- [ ] T064 [US4] Integrate PATCH /api/{user_id}/tasks/{id}/complete in completion toggle handler in frontend/components/TaskList.tsx
- [ ] T065 [US4] Add visual indication of completion status (checkmark, strikethrough) in frontend/components/TaskList.tsx
- [ ] T066 [US4] Test toggle incomplete → complete: visual indicator appears
- [ ] T067 [US4] Test toggle complete → incomplete: visual indicator removed
- [ ] T068 [US4] Test completion persistence: toggle → refresh page → status persists
- [ ] T069 [US4] Test mixed tasks: easily distinguish complete from incomplete

**Checkpoint**: User Story 4 is independently functional

---

## Phase 7: User Story 3 - Update Task Details (Priority: P2)

**Goal**: Enable users to edit task titles and descriptions

**Independent Test**: Create a task, edit title and/or description, verify changes persist

### Implementation for User Story 3

- [ ] T070 [P] [US3] Create PUT /api/{user_id}/tasks/{id} endpoint in backend/src/api/routes/tasks.py
- [ ] T071 [US3] Implement update logic for title and description fields in backend/src/api/routes/tasks.py
- [ ] T072 [US3] Validate title (1-200 chars) and description (max 1000 chars) in PUT endpoint in backend/src/api/routes/tasks.py
- [ ] T073 [US3] Enforce user ownership verification in PUT endpoint in backend/src/api/routes/tasks.py
- [ ] T074 [US3] Update updated_at timestamp automatically in backend/src/api/routes/tasks.py
- [ ] T075 [P] [US3] Add edit button/mode to TaskList component in frontend/components/TaskList.tsx
- [ ] T076 [P] [US3] Create TaskEditForm component (or inline edit mode) in frontend/components/TaskEditForm.tsx
- [ ] T077 [US3] Integrate PUT /api/{user_id}/tasks/{id} in edit form submit handler in frontend/components/TaskEditForm.tsx
- [ ] T078 [US3] Add cancel button to discard changes in frontend/components/TaskEditForm.tsx
- [ ] T079 [US3] Test update title: edit → save → updated title displayed
- [ ] T080 [US3] Test update description: edit → save → new description saved
- [ ] T081 [US3] Test cancel edit: cancel → original values remain
- [ ] T082 [US3] Test update persistence: edit → refresh page → updated values persist

**Checkpoint**: User Story 3 is independently functional

---

## Phase 8: User Story 5 - Delete Tasks (Priority: P3)

**Goal**: Enable users to permanently delete tasks

**Independent Test**: Create a task, delete it with confirmation, verify it no longer appears

### Implementation for User Story 5

- [ ] T083 [P] [US5] Create DELETE /api/{user_id}/tasks/{id} endpoint in backend/src/api/routes/tasks.py
- [ ] T084 [US5] Implement task deletion with user ownership verification in backend/src/api/routes/tasks.py
- [ ] T085 [US5] Return 204 No Content on successful deletion in backend/src/api/routes/tasks.py
- [ ] T086 [US5] Return 404 if task not found or doesn't belong to user in backend/src/api/routes/tasks.py
- [ ] T087 [P] [US5] Add delete button to TaskList component in frontend/components/TaskList.tsx
- [ ] T088 [US5] Create confirmation dialog component in frontend/components/ConfirmDialog.tsx
- [ ] T089 [US5] Integrate DELETE /api/{user_id}/tasks/{id} in delete handler in frontend/components/TaskList.tsx
- [ ] T090 [US5] Show confirmation dialog before deletion in frontend/components/TaskList.tsx
- [ ] T091 [US5] Test delete with confirmation: confirm → task removed immediately
- [ ] T092 [US5] Test delete persistence: delete → refresh page → task remains deleted
- [ ] T093 [US5] Test cancel deletion: cancel → task still present

**Checkpoint**: All user stories should now be independently functional

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T094 [P] Add loading states to all forms and lists in frontend/components/
- [ ] T095 [P] Add error messages for API failures in frontend/components/
- [ ] T096 [P] Improve responsive design for mobile screens (320px-1920px) in frontend/app/globals.css
- [ ] T097 [P] Add CORS configuration if frontend/backend on different domains in backend/src/main.py
- [ ] T098 [P] Add input sanitization for XSS prevention in backend/src/api/routes/tasks.py
- [ ] T099 [P] Create README.md with setup instructions in root
- [ ] T100 [P] Create deployment documentation in docs/deployment.md
- [ ] T101 Test full user journey: register → sign in → create tasks → edit → complete → delete
- [ ] T102 Verify all 12 success criteria from spec.md are met
- [ ] T103 Test on multiple browsers (Chrome, Firefox, Safari, Edge)
- [ ] T104 Test on mobile devices or responsive mode

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order: US1 → US2 → US6 → US4 → US3 → US5
- **Polish (Phase 9)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1 - Authentication)**: Can start after Foundational (Phase 2) - BLOCKS all other stories
- **User Story 2 (P1 - Create/View)**: Depends on US1 (authentication required) - Core MVP
- **User Story 6 (P1 - Data Isolation)**: Depends on US1 and US2 - Critical security
- **User Story 4 (P2 - Complete/Incomplete)**: Depends on US1 and US2 - Independent from US3 and US5
- **User Story 3 (P2 - Update)**: Depends on US1 and US2 - Can run in parallel with US4 and US5
- **User Story 5 (P3 - Delete)**: Depends on US1 and US2 - Can run in parallel with US3 and US4

### Within Each User Story

- Backend endpoints before frontend integration
- UI components can be built in parallel with backend if API contracts are defined
- Validation after implementation
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks (T002-T007) marked [P] can run in parallel
- All Foundational infrastructure tasks (T009-T010, T016-T019) can run in parallel after database setup
- Within each user story, tasks marked [P] can run in parallel
- Once US1, US2, US6 are complete, US3, US4, US5 can be worked on in parallel by different team members

---

## Parallel Example: User Story 2

```bash
# Launch backend endpoints together:
Task T033: "Create GET /api/{user_id}/tasks endpoint"
Task T034: "Create POST /api/{user_id}/tasks endpoint"

# Launch frontend components together (after endpoints defined):
Task T039: "Create protected /tasks dashboard page"
Task T040: "Create TaskList component"
Task T041: "Create TaskForm component"
```

---

## Implementation Strategy

### MVP First (User Stories 1, 2, 6 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Authentication)
4. Complete Phase 4: User Story 2 (Create/View Tasks)
5. Complete Phase 5: User Story 6 (Data Isolation)
6. **STOP and VALIDATE**: Test authentication, task creation, and security
7. Deploy/demo if ready - this is the MINIMUM VIABLE PRODUCT

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Auth works!)
3. Add User Story 2 → Test independently → Deploy/Demo (MVP - can manage tasks!)
4. Add User Story 6 → Test independently → Deploy/Demo (Secure!)
5. Add User Story 4 → Test independently → Deploy/Demo (Can track completion)
6. Add User Story 3 → Test independently → Deploy/Demo (Can edit tasks)
7. Add User Story 5 → Test independently → Deploy/Demo (Full CRUD complete)
8. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Developer A completes User Story 1 (Authentication - BLOCKS others)
3. Once US1 is done:
   - Developer A: User Story 2 (Create/View)
   - Developer B: User Story 6 (Data Isolation - depends on US2 API)
4. Once US1, US2, US6 are done:
   - Developer A: User Story 4 (Complete/Incomplete)
   - Developer B: User Story 3 (Update)
   - Developer C: User Story 5 (Delete)
5. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Tests are manual for Phase 1 (browser-based validation)
- All API endpoints require JWT authentication
- All database queries must filter by authenticated user_id
- Frontend uses Better Auth for JWT issuance
- Backend uses custom JWT verification utility
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
