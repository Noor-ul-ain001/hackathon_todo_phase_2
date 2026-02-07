# Data Model: Phase 1 Full-Stack Web Application

**Feature**: Phase 1 Full-Stack Web Application
**Created**: 2025-12-24
**Status**: Complete

## Purpose

This document defines the data entities, relationships, and validation rules for Phase 1 of the Todo Full-Stack Web Application. All entities are derived from the feature specification and support the 6 user stories.

---

## Entity Diagram

```
┌──────────────────────────┐
│         User             │
│ (Better Auth Managed)    │
├──────────────────────────┤
│ id: string (PK)          │
│ email: string (UNIQUE)   │
│ password_hash: string    │
│ created_at: timestamp    │
└────────────┬─────────────┘
             │
             │ 1:N (one user has many tasks)
             │ CASCADE DELETE
             │
┌────────────▼─────────────┐
│         Task             │
├──────────────────────────┤
│ id: integer (PK)         │
│ user_id: string (FK)     │◄── INDEXED
│ title: string            │
│ description: text        │
│ completed: boolean       │
│ created_at: timestamp    │
│ updated_at: timestamp    │
└──────────────────────────┘
```

---

## Entity 1: User

**Purpose**: Represents an authenticated user of the system

**Managed By**: Better Auth (authentication library)

**Source**: User Story 1 (User Registration and Authentication)

### Fields

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | string (UUID) | PRIMARY KEY, NOT NULL | Generated | Unique user identifier |
| email | string (varchar 255) | UNIQUE, NOT NULL | - | User's email address (used for sign-in) |
| password_hash | string (varchar 255) | NOT NULL | - | Hashed password (bcrypt, never plaintext) |
| created_at | timestamp | NOT NULL | NOW() | Account creation timestamp |

### Validation Rules

1. **email**:
   - MUST be valid email format (validated by Better Auth)
   - MUST be unique across all users
   - Case-insensitive for uniqueness checks
   - Example: user@example.com

2. **password** (before hashing):
   - MUST be minimum 8 characters (validated by Better Auth)
   - Recommended: Include uppercase, lowercase, numbers, symbols
   - MUST be hashed with bcrypt before storage

3. **id**:
   - Generated as UUID by Better Auth
   - Immutable after creation

### Relationships

- **User → Tasks**: One-to-Many
  - One user can have zero to many tasks
  - Foreign key: Task.user_id → User.id
  - Cascade delete: When user is deleted, all their tasks are deleted

### State Transitions

- **Created**: User registers → email + password_hash + created_at recorded
- **Authenticated**: User signs in → JWT token issued (stateless, no DB update)
- **Deleted**: User account deleted → all tasks cascade deleted (future phase)

### Indexes

- PRIMARY KEY on `id`
- UNIQUE INDEX on `email` (enforces uniqueness, improves lookup performance)

### Security Notes

- Password is NEVER stored in plaintext
- Better Auth handles hashing automatically
- JWT contains user.id as subject for backend verification

---

## Entity 2: Task

**Purpose**: Represents a todo item owned by a user

**Source**: User Stories 2-6 (Create/View, Update, Complete/Incomplete, Delete, Data Isolation)

### Fields

| Field | Type | Constraints | Default | Description |
|-------|------|-------------|---------|-------------|
| id | integer | PRIMARY KEY, AUTO_INCREMENT, NOT NULL | Auto | Unique task identifier |
| user_id | string (UUID) | FOREIGN KEY → users.id, NOT NULL, INDEXED | - | Owner of the task |
| title | string (varchar 200) | NOT NULL, LENGTH(1-200) | - | Task title (required) |
| description | text (varchar 1000) | NULLABLE, MAX_LENGTH(1000) | NULL | Optional task description |
| completed | boolean | NOT NULL | FALSE | Completion status |
| created_at | timestamp | NOT NULL | NOW() | Task creation timestamp |
| updated_at | timestamp | NOT NULL | NOW() ON UPDATE NOW() | Last modification timestamp |

### Validation Rules

1. **title**:
   - MUST be between 1 and 200 characters (inclusive)
   - MUST NOT be empty string
   - Examples: "Buy groceries", "Write report"

2. **description**:
   - OPTIONAL (can be NULL or empty)
   - MUST NOT exceed 1000 characters if provided
   - Examples: "Milk, eggs, bread", "Due Friday at 5pm"

3. **completed**:
   - MUST be boolean (true or false)
   - Defaults to false on creation
   - Toggled via PATCH endpoint

4. **user_id**:
   - MUST be valid UUID matching an existing user
   - Immutable after creation (cannot change task owner)
   - Set automatically from JWT on creation

5. **updated_at**:
   - Automatically updated by database on any UPDATE operation
   - Used for conflict resolution (last write wins)

### Relationships

- **Task → User**: Many-to-One
  - Each task belongs to exactly one user
  - Foreign key: Task.user_id → User.id
  - ON DELETE CASCADE: If user is deleted, tasks are deleted

### State Transitions

```
[Created (completed=false)]
         │
         ├─→ [Completed (completed=true)] ──┐
         │                                   │
         │   ┌───────────────────────────────┘
         │   │
         └───▼ [Updated (title/description changed)]
         │   │
         │   │
         └───▼ [Deleted (removed from database)]
```

1. **Created**: POST /tasks → title + description + user_id → completed=false
2. **Completed**: PATCH /tasks/{id}/complete → completed=true
3. **Uncompleted**: PATCH /tasks/{id}/complete → completed=false (toggle)
4. **Updated**: PUT /tasks/{id} → title and/or description changed → updated_at refreshed
5. **Deleted**: DELETE /tasks/{id} → removed from database permanently

### Indexes

- PRIMARY KEY on `id`
- INDEX on `user_id` (CRITICAL for performance - all queries filter by user)
- COMPOSITE INDEX on `(user_id, completed)` (optional optimization for filtering complete/incomplete tasks)

### Query Patterns

All task queries MUST filter by authenticated user:

```sql
-- List user's tasks
SELECT * FROM tasks WHERE user_id = :authenticated_user_id;

-- Get specific task
SELECT * FROM tasks WHERE id = :task_id AND user_id = :authenticated_user_id;

-- Create task
INSERT INTO tasks (user_id, title, description, completed, created_at, updated_at)
VALUES (:authenticated_user_id, :title, :description, false, NOW(), NOW());

-- Update task
UPDATE tasks
SET title = :title, description = :description, updated_at = NOW()
WHERE id = :task_id AND user_id = :authenticated_user_id;

-- Delete task
DELETE FROM tasks
WHERE id = :task_id AND user_id = :authenticated_user_id;

-- Toggle completion
UPDATE tasks
SET completed = NOT completed, updated_at = NOW()
WHERE id = :task_id AND user_id = :authenticated_user_id;
```

**Critical**: The `AND user_id = :authenticated_user_id` clause in WHERE is MANDATORY for all operations except INSERT.

### Security Constraints

1. **User Data Isolation**:
   - Every query MUST filter by authenticated user_id
   - Backend MUST extract user_id from JWT, NOT from URL parameter alone
   - URL user_id MUST match JWT subject (403 if mismatch)

2. **Ownership Enforcement**:
   - User can only access tasks where user_id matches their JWT identity
   - Attempting to access another user's task → 404 (as if it doesn't exist)
   - Attempting to access another user_id URL → 403 Forbidden

3. **Immutable Fields**:
   - `id`: Cannot be changed after creation
   - `user_id`: Cannot be changed after creation (no task transfers)
   - `created_at`: Cannot be changed after creation

---

## Data Integrity Rules

### Foreign Key Constraints

```sql
ALTER TABLE tasks
ADD CONSTRAINT fk_task_user
FOREIGN KEY (user_id) REFERENCES users(id)
ON DELETE CASCADE;
```

- If a user is deleted, all their tasks are automatically deleted
- Cannot create a task with user_id that doesn't exist

### Check Constraints

```sql
ALTER TABLE tasks
ADD CONSTRAINT chk_title_length
CHECK (LENGTH(title) >= 1 AND LENGTH(title) <= 200);

ALTER TABLE tasks
ADD CONSTRAINT chk_description_length
CHECK (description IS NULL OR LENGTH(description) <= 1000);
```

### Unique Constraints

- Users: `email` must be unique (case-insensitive)
- Tasks: No uniqueness constraint (users can have multiple tasks with same title)

---

## Example Data

### Users Table

| id | email | password_hash | created_at |
|----|-------|---------------|------------|
| abc123-uuid | alice@example.com | $2b$12$hashedpassword... | 2025-12-24 09:00:00 |
| xyz789-uuid | bob@example.com | $2b$12$hashedpassword... | 2025-12-24 09:30:00 |

### Tasks Table

| id | user_id | title | description | completed | created_at | updated_at |
|----|---------|-------|-------------|-----------|------------|------------|
| 1 | abc123-uuid | Buy groceries | Milk, eggs, bread | false | 2025-12-24 10:00:00 | 2025-12-24 10:00:00 |
| 2 | abc123-uuid | Write report | NULL | true | 2025-12-23 15:30:00 | 2025-12-24 09:00:00 |
| 3 | xyz789-uuid | Call dentist | Schedule appointment | false | 2025-12-24 11:00:00 | 2025-12-24 11:00:00 |

**Data Isolation Example**:
- Alice (abc123-uuid) can see tasks 1 and 2
- Bob (xyz789-uuid) can see task 3
- Alice CANNOT see task 3 (belongs to Bob)
- Bob CANNOT see tasks 1 and 2 (belong to Alice)

---

## Schema Evolution (Future Phases)

**Phase 1 ONLY** supports the fields defined above. Future phases MAY add:

- **Phase 2**: `priority` (enum), `tags` (array), `sort_order` (integer)
- **Phase 3**: `due_date` (timestamp), `recurring_rule` (string), `parent_task_id` (foreign key)

**Rules for Schema Evolution**:
- New fields MUST be nullable or have defaults (backward compatibility)
- NO fields may be removed (only deprecated)
- Foreign keys MUST include ON DELETE/ON UPDATE clauses
- Database migrations MUST be tested on sample data first

---

**Data Model Complete**: 2025-12-24
**Entities**: 2 (User, Task)
**Relationships**: 1 (User → Tasks one-to-many)
**Ready for**: Contract generation (API endpoints)
