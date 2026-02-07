# Database Schema

## Overview

The database schema for Phase 1 consists of two primary tables:
1. **users** - Managed by Better Auth for authentication
2. **tasks** - User-owned todo items

## Schema Diagram

```
┌─────────────────────────┐          ┌─────────────────────────┐
│        users            │          │        tasks            │
├─────────────────────────┤          ├─────────────────────────┤
│ id (PK)       │ string  │◄─────────│ user_id (FK)  │ string  │
│ email         │ string  │          │ id (PK)       │ integer │
│ password_hash │ string  │          │ title         │ string  │
│ created_at    │ timestamp          │ description   │ text    │
└─────────────────────────┘          │ completed     │ boolean │
                                     │ created_at    │ timestamp
                                     │ updated_at    │ timestamp
                                     └─────────────────────────┘
```

## Table: users

**Purpose**: Store user accounts for authentication

**Managed By**: Better Auth (authentication library)

**Schema**:

| Column         | Type      | Constraints           | Description                    |
|----------------|-----------|-----------------------|--------------------------------|
| id             | string    | PRIMARY KEY           | Unique user identifier (UUID)  |
| email          | string    | UNIQUE, NOT NULL      | User's email address          |
| password_hash  | string    | NOT NULL              | Hashed password (never plaintext) |
| created_at     | timestamp | NOT NULL, DEFAULT NOW | Account creation timestamp     |

**Indexes**:
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email` (for fast lookup and uniqueness enforcement)

**Notes**:
- Better Auth may create additional columns for session management, tokens, etc.
- Password is always stored hashed (bcrypt, scrypt, or argon2)
- Email is case-insensitive for uniqueness checks

---

## Table: tasks

**Purpose**: Store todo items owned by users

**Schema**:

| Column         | Type      | Constraints                  | Description                              |
|----------------|-----------|------------------------------|------------------------------------------|
| id             | integer   | PRIMARY KEY, AUTO_INCREMENT  | Unique task identifier                   |
| user_id        | string    | FOREIGN KEY → users(id), NOT NULL, INDEXED | Owner of the task                        |
| title          | string    | NOT NULL, CHECK (length 1-200) | Task title                               |
| description    | text      | NULLABLE, CHECK (length ≤ 1000) | Optional task description                |
| completed      | boolean   | NOT NULL, DEFAULT FALSE      | Completion status                        |
| created_at     | timestamp | NOT NULL, DEFAULT NOW        | Task creation timestamp                  |
| updated_at     | timestamp | NOT NULL, DEFAULT NOW, ON UPDATE NOW | Last modification timestamp              |

**Indexes**:
- PRIMARY KEY on `id`
- INDEX on `user_id` (for fast filtering by user)
- COMPOSITE INDEX on `(user_id, completed)` (optional optimization for filtering complete/incomplete tasks)

**Foreign Keys**:
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE
  - When a user is deleted, all their tasks are automatically deleted

**Constraints**:
- `title` length must be between 1 and 200 characters
- `description` length must be ≤ 1000 characters if provided
- `completed` must be a boolean (true/false)

**Triggers** (handled by SQLModel/database):
- `updated_at` is automatically set to current timestamp on UPDATE

---

## Relationships

### users → tasks (One-to-Many)

- One user can have **many tasks** (0 to unlimited)
- Each task belongs to **exactly one user**
- Relationship enforced by `user_id` foreign key
- Cascade delete: when user is deleted, all their tasks are deleted

**SQL Representation**:
```sql
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
```

---

## Sample Data

### users table
| id      | email               | password_hash | created_at          |
|---------|---------------------|---------------|---------------------|
| abc123  | alice@example.com   | $2b$12$...   | 2025-12-24 09:00:00 |
| xyz789  | bob@example.com     | $2b$12$...   | 2025-12-24 09:30:00 |

### tasks table
| id | user_id | title            | description           | completed | created_at          | updated_at          |
|----|---------|------------------|-----------------------|-----------|---------------------|---------------------|
| 1  | abc123  | Buy groceries    | Milk, eggs, bread     | false     | 2025-12-24 10:00:00 | 2025-12-24 10:00:00 |
| 2  | abc123  | Write report     | null                  | true      | 2025-12-23 15:30:00 | 2025-12-24 09:00:00 |
| 3  | xyz789  | Call dentist     | Schedule appointment  | false     | 2025-12-24 11:00:00 | 2025-12-24 11:00:00 |

**Note**: Alice (abc123) can only see tasks 1 and 2. Bob (xyz789) can only see task 3.

---

## Data Isolation Rules

### Query Filtering
**All queries MUST filter by authenticated user_id**:

**Good** (secure):
```sql
SELECT * FROM tasks WHERE user_id = 'abc123' AND id = 1;
```

**Bad** (insecure - allows cross-user access):
```sql
SELECT * FROM tasks WHERE id = 1;
```

### API-Level Enforcement
- Backend extracts `user_id` from JWT
- All database queries include `WHERE user_id = <authenticated_user_id>`
- Even if task ID is guessed, query returns no results if user doesn't own it

### Example Scenarios

**Scenario 1: Alice tries to view her own task**
- JWT contains user_id = "abc123"
- Request: `GET /api/abc123/tasks/1`
- Query: `SELECT * FROM tasks WHERE user_id = 'abc123' AND id = 1`
- Result: **Success** (task 1 belongs to Alice)

**Scenario 2: Alice tries to view Bob's task**
- JWT contains user_id = "abc123"
- Request: `GET /api/abc123/tasks/3`
- Query: `SELECT * FROM tasks WHERE user_id = 'abc123' AND id = 3`
- Result: **404 Not Found** (task 3 doesn't belong to Alice)

**Scenario 3: Alice tries to manipulate URL**
- JWT contains user_id = "abc123"
- Request: `GET /api/xyz789/tasks/3`
- Validation: user_id in URL ("xyz789") ≠ JWT subject ("abc123")
- Result: **403 Forbidden** (before even querying database)

---

## Migration Strategy

### Initial Setup
1. Create `users` table (Better Auth handles this)
2. Create `tasks` table with foreign key to users
3. Create indexes for performance

### SQLModel Migration (Example)
```python
from sqlmodel import SQLModel, create_engine

# Define models (User, Task) in code
# Then create tables:
engine = create_engine(DATABASE_URL)
SQLModel.metadata.create_all(engine)
```

### Rollback Strategy
- For Phase 1, tables are created from scratch
- If rollback needed, drop `tasks` table first, then `users` table
- In production, use proper migration tools (Alembic, etc.)

---

## Performance Considerations

### Indexes
- `user_id` index on tasks table is **critical** for performance
- Without it, listing a user's tasks would require full table scan
- With it, query performance is O(log n) for lookup + O(m) for result set

### Scaling (Future)
- For large datasets, consider partitioning tasks table by user_id
- For high read load, implement caching layer (Redis)
- For high write load, use database connection pooling

### Query Optimization
- Always use parameterized queries (prevent SQL injection)
- Select only needed columns (avoid `SELECT *` in production)
- Use LIMIT/OFFSET for pagination (implement in Phase 2+)

---

## Security Considerations

### Password Storage
- **NEVER store plaintext passwords**
- Use strong hashing algorithm (bcrypt, scrypt, argon2)
- Salt is included automatically in hash
- Better Auth handles this correctly

### SQL Injection Prevention
- **Always use parameterized queries** via SQLModel ORM
- Never concatenate user input into SQL strings
- SQLModel/SQLAlchemy protects against this automatically

### Data Encryption
- Use **HTTPS/TLS** for data in transit
- Consider **encryption at rest** for sensitive data (future enhancement)
- Neon PostgreSQL supports encryption at rest

### Audit Trail (Future Enhancement)
- Track who modified what and when
- Store modification history
- Implement soft deletes (mark as deleted instead of removing)
