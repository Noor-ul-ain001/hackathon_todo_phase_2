# Backend Rules - Agentic Todo

## Context
This is the **Backend** layer of the Agentic Todo full-stack application.

**Technology Stack**:
- FastAPI (Python 3.11+)
- SQLModel (ORM)
- PostgreSQL (Neon Serverless)
- python-jose (JWT verification)
- passlib (password hashing)
- uvicorn (ASGI server)

## Architecture Constraints

### 1. JWT Authentication on ALL Endpoints
- Every API endpoint (except health check) MUST require valid JWT
- Extract JWT from Authorization header: `Bearer <token>`
- Verify JWT signature using shared secret (`BETTER_AUTH_SECRET`)
- Extract user_id from JWT payload (`sub` claim)
- Return 401 Unauthorized if JWT is missing or invalid

### 2. User Data Isolation (CRITICAL SECURITY)
- ALL database queries MUST filter by authenticated user_id
- user_id in URL path MUST match user_id from JWT
- Return 403 Forbidden if user_id mismatch detected
- Example query: `SELECT * FROM tasks WHERE user_id = :authenticated_user_id`
- NEVER trust user_id from URL alone - always verify against JWT

### 3. Database Access Pattern
- Use SQLModel for all database operations
- Define models in `src/models/`
- Database connection utility in `src/database/connection.py`
- Initialize database tables in `src/database/init_db.py`
- Use async database operations where possible

### 4. API Contract Stability
**RESTful Endpoints** (all require JWT):
- `GET /api/{user_id}/tasks` - List user's tasks
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{id}` - Get specific task
- `PUT /api/{user_id}/tasks/{id}` - Update task
- `DELETE /api/{user_id}/tasks/{id}` - Delete task
- `PATCH /api/{user_id}/tasks/{id}/complete` - Toggle completion

**Request/Response Format**:
- Content-Type: application/json
- Error responses: `{"detail": "error message"}`
- Success responses: Task object or list of tasks

### 5. Phase 1 Scope Only
Implement ONLY Phase 1 features:
- User authentication (managed by Better Auth on frontend)
- Task CRUD operations
- Completion status toggle
- User data isolation enforcement

DO NOT implement:
- Search, filter, sort endpoints (Phase 2)
- Priority or tag fields (Phase 2)
- Due dates or recurring tasks (Phase 3)

### 6. File Organization
- **Main**: `main.py` - FastAPI app initialization
- **Models**: `src/models/` - SQLModel entities
  - `src/models/user.py` - User model (Better Auth managed)
  - `src/models/task.py` - Task model
- **API Routes**: `src/api/routes/` - Endpoint definitions
  - `src/api/routes/auth.py` - Authentication endpoints (if needed)
  - `src/api/routes/tasks.py` - Task CRUD endpoints
- **Auth**: `src/auth/` - JWT utilities
  - `src/auth/jwt_utils.py` - JWT decode/verify functions
  - `src/auth/dependencies.py` - FastAPI dependency for authentication
- **Database**: `src/database/` - Database utilities
  - `src/database/connection.py` - Database connection
  - `src/database/base.py` - SQLModel base configuration
  - `src/database/init_db.py` - Table initialization script

### 7. Security Rules
- NEVER store passwords in plaintext (use bcrypt via passlib)
- Validate all input data using Pydantic models
- Sanitize inputs to prevent SQL injection (SQLModel handles this)
- Use parameterized queries (never string concatenation)
- Set secure CORS policy (allow only frontend origin)
- Log security events (failed auth attempts, unauthorized access)

### 8. Error Handling
- 400 Bad Request: Invalid input data
- 401 Unauthorized: Missing or invalid JWT
- 403 Forbidden: user_id mismatch (access to another user's data)
- 404 Not Found: Task not found or doesn't belong to user
- 422 Unprocessable Entity: Pydantic validation failed
- 500 Internal Server Error: Unexpected errors

### 9. Data Validation
**Task Model Constraints**:
- `title`: Required, 1-200 characters
- `description`: Optional, max 1000 characters
- `completed`: Boolean, default false
- `user_id`: UUID, must match authenticated user
- `created_at`, `updated_at`: Timestamps (auto-managed)

## Development Workflow

1. **Read the spec**: `specs/006-phase1-fullstack-webapp/spec.md`
2. **Check the plan**: `specs/006-phase1-fullstack-webapp/plan.md`
3. **Follow tasks**: `specs/006-phase1-fullstack-webapp/tasks.md`
4. **Refer to data model**: `specs/006-phase1-fullstack-webapp/data-model.md`
5. **Check API contracts**: `specs/006-phase1-fullstack-webapp/api/rest-endpoints.md`

## Testing Checklist

Before marking a task complete:
- [ ] Endpoint responds with correct status codes
- [ ] JWT verification works (401 if missing/invalid)
- [ ] user_id matching enforced (403 if mismatch)
- [ ] Database queries filter by authenticated user
- [ ] Input validation works (Pydantic models)
- [ ] Error responses are clear and user-friendly
- [ ] CORS allows frontend origin
- [ ] No SQL injection vulnerabilities

## Common Pitfalls to Avoid

- ❌ Trusting user_id from URL without JWT verification
- ❌ Querying tasks without `WHERE user_id = authenticated_user` filter
- ❌ Returning 404 for authorization failures (use 403 instead)
- ❌ Storing passwords in plaintext
- ❌ Implementing Phase 2/3 features
- ❌ Missing JWT verification on endpoints
- ❌ Allowing CORS from all origins

## Environment Variables

Required in `backend/.env`:
```env
DATABASE_URL=postgresql://user:password@localhost:5432/agentic_todo
BETTER_AUTH_SECRET=<same-as-frontend>
ENVIRONMENT=development
LOG_LEVEL=debug
```

## Database Schema

**Users Table** (managed by Better Auth):
- `id` (UUID, primary key)
- `email` (unique, not null)
- `password_hash` (not null)
- `created_at` (timestamp)

**Tasks Table**:
- `id` (integer, primary key, auto-increment)
- `user_id` (UUID, foreign key → users.id, indexed)
- `title` (varchar 200, not null)
- `description` (varchar 1000, nullable)
- `completed` (boolean, default false)
- `created_at` (timestamp)
- `updated_at` (timestamp, auto-update)

## Code Quality Standards

- Use Python type hints for all functions
- Follow PEP 8 style guidelines
- Use Pydantic models for request/response validation
- Keep functions small and focused
- Add docstrings for complex logic
- Use async/await for database operations
- Handle exceptions gracefully

## JWT Payload Structure

Expected JWT payload from Better Auth:
```json
{
  "sub": "<user_id>",  // User identifier
  "email": "<user_email>",
  "iat": <issued_at_timestamp>,
  "exp": <expiration_timestamp>
}
```

Extract `sub` claim for user_id in all operations.

---

**Last Updated**: 2025-12-24
**Phase**: Phase 1 Full-Stack Web Application
