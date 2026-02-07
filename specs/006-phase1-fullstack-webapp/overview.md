# Todo Full-Stack Web Application — Phase 1

## Purpose

Transform the existing Todo system into a multi-user full-stack web application with persistent storage and authentication, using Claude Code + Spec-Kit Plus.

## Current Phase

**Phase 1 — Core Web Application (Basic Level)**

## In Scope

- **Task CRUD Operations**
  - Add task
  - View task list
  - Update task (title, description)
  - Delete task
  - Mark task complete/incomplete

- **User Authentication**
  - User registration (signup)
  - User sign-in
  - JWT-based session management
  - Secure password storage

- **REST API**
  - RESTful endpoints for task operations
  - JWT authentication on all protected routes
  - User data isolation

- **Persistent Storage**
  - Database-backed task storage
  - User account management
  - Automatic timestamps (created_at, updated_at)

- **User-Scoped Data Isolation**
  - Users can only access their own tasks
  - JWT verification ensures request authenticity
  - Backend enforces user_id matching

## Out of Scope

The following features are planned for future phases and MUST NOT be implemented in Phase 1:

- **Search and Discovery** (Phase 2)
  - Search tasks by keyword
  - Advanced filtering (by status, date, etc.)
  - Sorting options (alphabetical, by date, etc.)

- **Organization Features** (Phase 2+)
  - Priority levels (low/medium/high)
  - Tags or categories
  - Task groups or projects

- **Advanced Features** (Phase 3)
  - Recurring tasks
  - Due dates and deadlines
  - Notifications and reminders
  - Task assignments or sharing

- **Intelligence Features** (Phase 3+)
  - AI-powered task suggestions
  - Chatbot interface
  - Automated task generation
  - Smart scheduling

## Tech Stack

### Frontend
- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript
- **Authentication**: Better Auth (client-side)
- **Styling**: Responsive UI (framework TBD during planning)

### Backend
- **Framework**: FastAPI (Python)
- **ORM**: SQLModel
- **Authentication**: JWT token validation
- **Validation**: Pydantic models

### Database
- **Provider**: Neon Serverless PostgreSQL
- **Schema Management**: SQLModel migrations

### Authentication
- **Frontend**: Better Auth (issues JWT tokens)
- **Backend**: JWT signature verification
- **Shared Secret**: BETTER_AUTH_SECRET environment variable

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                            │
│                  (Next.js 16 + TypeScript)                  │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Registration │  │   Sign-In    │  │ Task Manager │     │
│  │     Page     │  │     Page     │  │  Dashboard   │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│           │                │                │              │
│           └────────────────┴────────────────┘              │
│                          │                                 │
│                    Better Auth                             │
│                   (Issues JWT)                             │
└─────────────────────────┬───────────────────────────────────┘
                          │
                    Authorization: Bearer <JWT>
                          │
┌─────────────────────────▼───────────────────────────────────┐
│                      REST API                               │
│                    (FastAPI + Python)                       │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │          JWT Verification Middleware                 │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│  ┌────────────────────▼─────────────────────────────────┐  │
│  │           Task API Endpoints                         │  │
│  │  GET/POST /api/{user_id}/tasks                       │  │
│  │  GET/PUT/DELETE /api/{user_id}/tasks/{id}           │  │
│  │  PATCH /api/{user_id}/tasks/{id}/complete           │  │
│  └────────────────────┬─────────────────────────────────┘  │
│                       │                                     │
│                   SQLModel ORM                              │
└─────────────────────────┬───────────────────────────────────┘
                          │
┌─────────────────────────▼───────────────────────────────────┐
│              Neon Serverless PostgreSQL                     │
│                                                             │
│  ┌──────────────┐              ┌──────────────┐            │
│  │    users     │              │    tasks     │            │
│  ├──────────────┤              ├──────────────┤            │
│  │ id (PK)      │◄─────────────│ user_id (FK) │            │
│  │ email        │              │ id (PK)      │            │
│  │ password_hash│              │ title        │            │
│  │ created_at   │              │ description  │            │
│  └──────────────┘              │ completed    │            │
│                                │ created_at   │            │
│                                │ updated_at   │            │
│                                └──────────────┘            │
└─────────────────────────────────────────────────────────────┘
```

## Key Principles

1. **Spec-First Development**: No code without approved specification
2. **Phase-Bound Enforcement**: Only Phase 1 features may be implemented
3. **Security First**: All API endpoints require JWT authentication
4. **Data Isolation**: Users can only access their own data
5. **Agentic Workflow**: All code generated by Claude Code following spec → plan → tasks → implement
6. **Traceability**: Every line of code traces back to this specification

## Success Definition

Phase 1 is complete when:
- All 6 user stories (authentication, create, view, update, complete, delete) are implemented
- All 12 success criteria are met
- Security validation passes (JWT verification, data isolation)
- User acceptance testing confirms the system works as specified
- Documentation is complete (README, API docs, setup guide)

## Next Steps

1. **Specification Approval**: User reviews and approves this spec
2. **Planning** (`/sp.plan`): Design implementation architecture
3. **Task Breakdown** (`/sp.tasks`): Create granular, testable tasks
4. **Implementation** (`/sp.implement`): Execute tasks in order
5. **Quality Review**: Validate compliance with specification
