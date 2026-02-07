# Quick

start Guide: Phase 1 Full-Stack Web Application

**Feature**: Phase 1 Full-Stack Web Application
**Created**: 2025-12-24
**For**: Developers setting up and testing the application

## Purpose

This guide provides step-by-step instructions for setting up the development environment and testing all Phase 1 features. Follow these steps to go from zero to a running full-stack authenticated task manager.

---

## Prerequisites

Before starting, ensure you have:

- **Node.js 18+** and **pnpm** (or npm) installed
- **Python 3.11+** and **UV** (Python package manager) installed
- **Docker** and **Docker Compose** installed (for local PostgreSQL)
- **Neon PostgreSQL** account (or use local PostgreSQL)
- **Git** for version control

**Check versions**:
```bash
node --version    # Should be 18+ or 20+
pnpm --version    # Should be 8+
python --version  # Should be 3.11+
uv --version      # Should be latest
docker --version  # Should be 20+
```

---

## Step 1: Clone and Setup Repository

```bash
# Navigate to project directory
cd "C:\Users\user\Desktop\todo\phase1 - Copy"

# Verify monorepo structure
ls
# Should see: frontend/, backend/, specs/, .specify/, docker-compose.yml
```

---

## Step 2: Configure Environment Variables

### Backend (.env)

Create `backend/.env` with:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/agentic_todo
# Or for Neon:
# DATABASE_URL=postgresql://user:password@ep-xxxxx.us-east-1.aws.neon.tech/agentic_todo?sslmode=require

# Authentication (MUST match frontend)
BETTER_AUTH_SECRET=your-super-secret-jwt-key-min-32-chars-long-change-in-production

# Application
ENVIRONMENT=development
LOG_LEVEL=debug
```

### Frontend (.env.local)

Create `frontend/.env.local` with:

```env
# API Base URL
NEXT_PUBLIC_API_URL=http://localhost:8000/api

# Better Auth (MUST match backend)
BETTER_AUTH_SECRET=your-super-secret-jwt-key-min-32-chars-long-change-in-production

# Application
NEXT_PUBLIC_ENVIRONMENT=development
```

**⚠️ CRITICAL**: `BETTER_AUTH_SECRET` MUST be identical in both files!

---

## Step 3: Start Database

### Option A: Local PostgreSQL with Docker Compose

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Verify it's running
docker-compose ps
```

### Option B: Use Neon PostgreSQL

1. Go to https://neon.tech
2. Create a new project: "agentic-todo"
3. Copy the connection string
4. Update `DATABASE_URL` in `backend/.env`

---

## Step 4: Setup Backend

```bash
cd backend

# Install dependencies with UV
uv sync

# Create database tables
uv run python -m src.database.init_db

# Start FastAPI server
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Verify backend is running**:
- Open http://localhost:8000/docs
- You should see FastAPI automatic documentation
- Check endpoints: /api/{user_id}/tasks, etc.

---

## Step 5: Setup Frontend

```bash
# Open new terminal
cd frontend

# Install dependencies
pnpm install
# Or: npm install

# Start Next.js development server
pnpm dev
# Or: npm run dev
```

**Verify frontend is running**:
- Open http://localhost:3000
- You should see the landing page or registration page

---

## Step 6: Test User Registration (User Story 1)

### Test Scenario 1: Create Account

1. **Navigate to**: http://localhost:3000/auth/register
2. **Fill form**:
   - Email: test@example.com
   - Password: Test1234! (min 8 chars)
3. **Submit registration**
4. **Expected Result**:
   - Account created
   - JWT token issued (check browser DevTools → Application → Local Storage or Cookies)
   - Redirected to http://localhost:3000/tasks (dashboard)
   - Empty task list displayed

**Validation**:
```bash
# Check database (if using Docker PostgreSQL)
docker-compose exec postgres psql -U user -d agentic_todo -c "SELECT id, email, created_at FROM users;"

# Should see: test@example.com with a UUID
```

### Test Scenario 2: Sign In with Existing Account

1. **Sign out** (if not already signed out)
2. **Navigate to**: http://localhost:3000/auth/signin
3. **Fill form**:
   - Email: test@example.com
   - Password: Test1234!
4. **Submit sign-in**
5. **Expected Result**:
   - JWT token issued
   - Redirected to http://localhost:3000/tasks
   - Previous session restored

### Test Scenario 3: Invalid Credentials

1. **Navigate to**: http://localhost:3000/auth/signin
2. **Fill form**:
   - Email: test@example.com
   - Password: WrongPassword
3. **Submit sign-in**
4. **Expected Result**:
   - Error message: "Invalid credentials" (does NOT reveal if email exists)
   - Stay on sign-in page

### Test Scenario 4: Session Persistence

1. **Sign in** as test@example.com
2. **Close browser completely**
3. **Reopen browser** and go to http://localhost:3000/tasks
4. **Expected Result**:
   - Session restored (if JWT still valid)
   - Tasks loaded automatically
   - OR: Redirected to sign-in if JWT expired

---

## Step 7: Test Task Creation (User Story 2)

### Test Scenario 1: Create Task with Title Only

1. **Sign in** as test@example.com
2. **Navigate to**: http://localhost:3000/tasks
3. **Click** "Add Task" or use task creation form
4. **Fill form**:
   - Title: "Buy groceries"
   - Description: (leave empty)
5. **Submit**
6. **Expected Result**:
   - Task appears in list immediately
   - Shows title: "Buy groceries"
   - Shows completed status: ✗ (incomplete)

**Validation**:
```bash
# Check database
docker-compose exec postgres psql -U user -d agentic_todo -c "SELECT id, title, description, completed FROM tasks;"

# Should see: "Buy groceries" with description=NULL, completed=false
```

### Test Scenario 2: Create Task with Title + Description

1. **Click** "Add Task"
2. **Fill form**:
   - Title: "Write report"
   - Description: "Due Friday at 5pm"
3. **Submit**
4. **Expected Result**:
   - Task appears in list
   - Both title and description displayed

### Test Scenario 3: Empty Task List

1. **Delete all tasks** (or use a new account)
2. **Expected Result**:
   - Empty state message displayed: "No tasks yet" or similar
   - Prompt to create first task

### Test Scenario 4: Task Persistence

1. **Create a task**: "Test persistence"
2. **Refresh page** (F5)
3. **Expected Result**:
   - Task remains in list (loaded from database)
   - No data loss

---

## Step 8: Test Task Completion (User Story 4)

### Test Scenario 1: Mark Task Complete

1. **Ensure you have** at least one incomplete task
2. **Click** completion toggle (checkbox or button)
3. **Expected Result**:
   - Visual indicator changes: ✗ → ✓ (or checkmark appears)
   - Task may show strikethrough or different styling
   - Updated immediately

**Validation**:
```bash
# Check database
docker-compose exec postgres psql -U user -d agentic_todo -c "SELECT id, title, completed FROM tasks;"

# Should see: completed=true for toggled task
```

### Test Scenario 2: Mark Task Incomplete

1. **Click** completion toggle on a completed task
2. **Expected Result**:
   - Visual indicator changes: ✓ → ✗
   - Strikethrough removed

### Test Scenario 3: Completion Persistence

1. **Toggle task** to complete
2. **Refresh page**
3. **Expected Result**:
   - Completion status persists (still shows ✓)

---

## Step 9: Test Task Update (User Story 3)

### Test Scenario 1: Update Task Title

1. **Click** edit button on a task
2. **Change title**: "Buy groceries" → "Buy groceries and fruits"
3. **Save changes**
4. **Expected Result**:
   - Updated title displayed immediately
   - updated_at timestamp refreshed

### Test Scenario 2: Update Task Description

1. **Click** edit button
2. **Change description**: "Due Friday" → "Due Friday at 5pm - urgent"
3. **Save changes**
4. **Expected Result**:
   - Updated description displayed

### Test Scenario 3: Cancel Edit

1. **Click** edit button
2. **Make changes** to title/description
3. **Click** cancel button (do NOT save)
4. **Expected Result**:
   - Changes discarded
   - Original values remain

### Test Scenario 4: Update Persistence

1. **Update a task** and save
2. **Refresh page**
3. **Expected Result**:
   - Updated values persist

---

## Step 10: Test Task Deletion (User Story 5)

### Test Scenario 1: Delete with Confirmation

1. **Click** delete button on a task
2. **See confirmation dialog**: "Are you sure you want to delete this task?"
3. **Click** "Confirm" or "Delete"
4. **Expected Result**:
   - Task removed from list immediately
   - No longer in database

**Validation**:
```bash
# Check database
docker-compose exec postgres psql -U user -d agentic_todo -c "SELECT COUNT(*) FROM tasks;"

# Should see: count decreased by 1
```

### Test Scenario 2: Cancel Deletion

1. **Click** delete button
2. **See confirmation dialog**
3. **Click** "Cancel"
4. **Expected Result**:
   - Task remains in list
   - No changes made

### Test Scenario 3: Deletion Persistence

1. **Delete a task**
2. **Refresh page**
3. **Expected Result**:
   - Task remains deleted (does not reappear)

---

## Step 11: Test User Data Isolation (User Story 6)

### Test Scenario 1: Multiple User Accounts

1. **Sign out** from test@example.com
2. **Register new account**: user2@example.com
3. **Create tasks** as user2:
   - "User 2 Task 1"
   - "User 2 Task 2"
4. **Sign out**
5. **Sign in** as test@example.com
6. **Expected Result**:
   - ONLY test@example.com's tasks visible
   - user2@example.com's tasks NOT visible

**Validation**:
```bash
# Check database
docker-compose exec postgres psql -U user -d agentic_todo -c "SELECT user_id, title FROM tasks ORDER BY user_id;"

# Should see: tasks grouped by user_id, different UUIDs
```

### Test Scenario 2: URL Manipulation (Security Test)

1. **Sign in** as test@example.com (user_id = abc123)
2. **Create a task** and note its ID (e.g., task_id = 5)
3. **Sign out** and sign in as user2@example.com (user_id = xyz789)
4. **Attempt to access** test@example.com's task via URL:
   - Try: http://localhost:8000/api/abc123/tasks/5
5. **Expected Result**:
   - **403 Forbidden** (user_id in URL ≠ JWT subject)
   - OR: Navigate via frontend to user2's task page → no access to task 5

### Test Scenario 3: API Direct Access (Security Test)

Using a tool like Postman or curl:

```bash
# Get user2's JWT token from browser DevTools
# Attempt to access user1's tasks

curl -H "Authorization: Bearer <user2_jwt>" \
  http://localhost:8000/api/<user1_id>/tasks

# Expected: 403 Forbidden (user_id mismatch)
```

---

## Step 12: End-to-End Full Journey Test

**Complete User Flow**:

1. ✅ Register account → JWT issued → redirect to dashboard
2. ✅ Create 3 tasks (varied titles/descriptions)
3. ✅ Mark 1 task complete
4. ✅ Update 1 task title
5. ✅ Delete 1 task
6. ✅ Refresh page → all changes persist
7. ✅ Sign out → sign in → tasks still there
8. ✅ Create second user → verify data isolation
9. ✅ Test on mobile viewport (320px) → responsive
10. ✅ Test on different browser (Chrome, Firefox, Safari, Edge)

---

## Troubleshooting

### Issue: "Cannot connect to database"

**Solution**:
```bash
# Check Docker container
docker-compose ps

# View logs
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Issue: "JWT verification failed"

**Solution**:
- Verify `BETTER_AUTH_SECRET` is identical in frontend/.env.local and backend/.env
- Check JWT token in browser DevTools → Application → Storage
- Try signing out and signing in again

### Issue: "Tasks not persisting"

**Solution**:
```bash
# Check database connection
docker-compose exec postgres psql -U user -d agentic_todo -c "\dt"

# Should see: users and tasks tables

# Check if tables exist
docker-compose exec postgres psql -U user -d agentic_todo -c "SELECT COUNT(*) FROM tasks;"
```

### Issue: "CORS errors in browser"

**Solution**:
- Ensure backend has CORS middleware configured
- Check `NEXT_PUBLIC_API_URL` in frontend/.env.local matches backend URL
- Restart both frontend and backend servers

### Issue: "Better Auth not issuing JWT"

**Solution**:
- Check Better Auth configuration in frontend/lib/auth.ts
- Verify JWT plugin is enabled
- Check browser console for errors
- Ensure BETTER_AUTH_SECRET is set

---

## Success Criteria Checklist

Use this checklist to verify Phase 1 is complete:

### Functional Completeness
- [ ] User registration works (creates account + issues JWT)
- [ ] User sign-in works (validates credentials + issues JWT)
- [ ] Tasks can be created (with title only or title + description)
- [ ] Tasks can be viewed (list displays all user's tasks)
- [ ] Tasks can be updated (title and/or description)
- [ ] Tasks can be deleted (with confirmation)
- [ ] Tasks can be marked complete/incomplete (toggle)
- [ ] All operations persist across page refreshes

### Security
- [ ] JWT verification works (401 for missing/invalid tokens)
- [ ] User data isolation works (users cannot see others' tasks)
- [ ] user_id matching enforced (403 for mismatched URL/JWT)
- [ ] Passwords hashed (never stored in plaintext)

### Performance
- [ ] Task list loads in < 2 seconds (up to 100 tasks)
- [ ] API responses < 500ms at p95
- [ ] UI is responsive (no lag on interactions)

### Usability
- [ ] Empty states displayed when no tasks
- [ ] Loading indicators present during API calls
- [ ] Error messages clear and user-friendly
- [ ] Responsive design works (320px to 1920px)

### Cross-Browser
- [ ] Works in Chrome
- [ ] Works in Firefox
- [ ] Works in Safari
- [ ] Works in Edge

---

## Next Steps

After verifying all tests pass:

1. **Document any issues** found during testing
2. **Create bug reports** for failed scenarios
3. **Request code review** from quality_reviewer agent
4. **Prepare for deployment** (production environment configuration)
5. **Plan Phase 2** (search, filter, sort features)

---

**Quickstart Guide Complete**: 2025-12-24
**Ready for**: Implementation (/sp.implement) and Testing
