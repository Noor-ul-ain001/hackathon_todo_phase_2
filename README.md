# Agentic Todo Application - Phase 1 Full-Stack Web Application

A modern, multi-user, full-stack web application with authentication and persistent storage. This represents Phase 1 of the full-stack evolution, focusing on core CRUD operations with user authentication and data isolation.

## Features

- **Multi-user support** with email/password authentication
- **Task CRUD operations** (Create, Read, Update, Delete, Toggle Completion)
- **JWT-based authentication** with secure token verification
- **User data isolation** - users can only access their own tasks
- **Responsive web interface** accessible from desktop and mobile
- **Persistent storage** with Neon Serverless PostgreSQL
- **RESTful API** with proper error handling

## Architecture

The application follows a three-tier architecture:

1. **Frontend**: Next.js 16+ with TypeScript, React, and Tailwind CSS
2. **Backend**: FastAPI with Python 3.11+, SQLModel ORM, and JWT authentication
3. **Database**: Neon Serverless PostgreSQL with secure data isolation

## Prerequisites

- Python 3.11+
- Node.js 18+ (for frontend development)
- PostgreSQL (or Neon Serverless PostgreSQL account)
- UV package manager (for backend)

## Installation and Setup

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies with UV
uv sync

# Set up environment variables
cp .env.example .env
# Edit .env with your DATABASE_URL and BETTER_AUTH_SECRET
```

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your NEXT_PUBLIC_API_URL
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://username:password@localhost:5432/agentic_todo
BETTER_AUTH_SECRET=your-super-secret-jwt-key-here
ENVIRONMENT=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

## Running the Application

### Backend (API Server)

```bash
# In the backend directory
cd backend

# Run the development server
uv run uvicorn main:app --reload --port 8000
```

### Frontend (Next.js Server)

```bash
# In the frontend directory
cd frontend

# Run the development server
npm run dev
# or
pnpm dev

# The frontend will be available at http://localhost:3000
```

## API Endpoints

All API endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User sign-in

### Task Endpoints
- `GET /api/{user_id}/tasks` - Get all tasks for user
- `POST /api/{user_id}/tasks` - Create new task
- `GET /api/{user_id}/tasks/{task_id}` - Get specific task
- `PUT /api/{user_id}/tasks/{task_id}` - Update task
- `PATCH /api/{user_id}/tasks/{task_id}/complete` - Toggle completion
- `DELETE /api/{user_id}/tasks/{task_id}` - Delete task

### Security
- All endpoints require valid JWT token
- User ID in URL must match authenticated user from JWT
- Return 403 Forbidden for user ID mismatch
- Return 401 Unauthorized for invalid/missing tokens

## Development

### Backend Development
- All backend code is in the `src/` directory
- Models are in `src/models/`
- API routes are in `src/api/routes/`
- Authentication logic is in `src/auth/`
- Database utilities are in `src/database/`

### Frontend Development
- Next.js App Router in `app/` directory
- Components in `components/` directory
- API client in `lib/api-client.ts`
- Authentication utilities in `lib/auth.ts`
- Protected routes handled by middleware

## Database Schema

### Users Table
- `id`: UUID (Primary Key)
- `email`: VARCHAR (Unique, Indexed)
- `password_hash`: VARCHAR (bcrypt hash)
- `created_at`: TIMESTAMP

### Tasks Table
- `id`: INTEGER (Auto-increment, Primary Key)
- `user_id`: UUID (Foreign Key → users.id, Indexed)
- `title`: VARCHAR (1-200 chars, Required)
- `description`: TEXT (Optional, Max 1000 chars)
- `completed`: BOOLEAN (Default: false)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## Testing

Manual browser-based testing for all user stories:
1. Registration → JWT issued → redirect to dashboard
2. Sign-in → JWT issued → load tasks
3. Create task → appears in list → persists on refresh
4. Toggle completion → visual update → persists
5. Update task → changes saved → persists
6. Delete task → confirmation → removed permanently
7. Cross-user test → User A cannot access User B's tasks

## Security Features

- JWT-based authentication on all API endpoints
- User data isolation enforced at the backend layer
- Passwords hashed with bcrypt before storage
- SQL injection prevention via SQLModel ORM
- Input validation and sanitization
- Proper CORS configuration

## Performance Goals

- Task list loads in under 2 seconds (up to 100 tasks)
- API responses < 500ms at p95
- Support 100+ concurrent authenticated users
- Responsive UI on screen sizes from 320px to 1920px

## Phase 1 Limitations

⚠️ **Important**: Phase 1 is a minimal viable product. The following features are NOT available:

- ❌ **Search**: No search by keyword
- ❌ **Filter**: No filtering by status, priority, or tags
- ❌ **Sort**: No sorting options (tasks display by creation order)
- ❌ **Priority**: No task priorities (low/medium/high)
- ❌ **Tags**: No task categories or tags
- ❌ **Due Dates**: No deadlines or date tracking
- ❌ **Recurring Tasks**: No repeating tasks
- ❌ **Reminders**: No notifications
- ❌ **Advanced UI**: No dark mode, themes, or advanced styling

## Deployment

For production deployment:
1. Set up Neon Serverless PostgreSQL
2. Configure environment variables
3. Build the frontend: `npm run build`
4. Deploy the backend and frontend to your preferred platform

## License

MIT