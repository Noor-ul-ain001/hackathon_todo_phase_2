# Frontend Rules - Agentic Todo

## Context
This is the **Frontend** layer of the Agentic Todo full-stack application.

**Technology Stack**:
- Next.js 16+ with App Router
- TypeScript
- React 18+
- Tailwind CSS
- Better Auth (JWT authentication)

## Architecture Constraints

### 1. API Communication Only
- Frontend MUST NOT access the database directly
- All data operations go through REST API endpoints
- API base URL: `process.env.NEXT_PUBLIC_API_URL` (default: http://localhost:8000/api)

### 2. Authentication (Better Auth + JWT)
- Use Better Auth library for user registration and sign-in
- JWT tokens issued on successful authentication
- Store JWT in httpOnly cookies or localStorage (Better Auth handles this)
- Attach JWT to all API requests via Authorization header
- Handle 401 (unauthorized) and 403 (forbidden) responses by redirecting to sign-in

### 3. User Data Isolation
- All API calls MUST include authenticated user_id in URL path
- Example: `/api/{user_id}/tasks` where user_id comes from JWT
- Frontend MUST extract user_id from JWT token (Better Auth provides this)
- Never hardcode or allow manual user_id input

### 4. Phase 1 Scope Only
- Implement ONLY the features specified in Phase 1:
  - User registration and sign-in (US1)
  - Create and view tasks (US2)
  - Update task details (US3)
  - Mark tasks complete/incomplete (US4)
  - Delete tasks (US5)
  - Data isolation validation (US6)

- DO NOT implement:
  - Search, filter, or sort (Phase 2)
  - Priority levels or tags (Phase 2)
  - Due dates or recurring tasks (Phase 3)
  - Offline mode or sync (Phase 3)

### 5. File Organization
- **Pages**: `app/` directory (Next.js App Router)
  - `app/page.tsx` - Landing page
  - `app/auth/register/page.tsx` - Registration page
  - `app/auth/signin/page.tsx` - Sign-in page
  - `app/tasks/page.tsx` - Task dashboard (protected route)

- **Components**: `components/` directory
  - `components/TaskList.tsx` - Display list of tasks
  - `components/TaskForm.tsx` - Create new task
  - `components/TaskEditForm.tsx` - Edit existing task
  - `components/ConfirmDialog.tsx` - Confirmation dialogs

- **Utilities**: `lib/` directory
  - `lib/auth.ts` - Better Auth configuration
  - `lib/api-client.ts` - API request utility with JWT attachment

### 6. Error Handling
- Display user-friendly error messages
- Handle API errors gracefully:
  - 401 → Redirect to /auth/signin
  - 403 → Show "Access Denied" message
  - 404 → Show "Not Found" message
  - 500 → Show "Server Error" message
- Add loading states for all async operations
- Validate form inputs before submission

### 7. Responsive Design
- Support viewport widths from 320px to 1920px
- Mobile-first design approach
- Use Tailwind CSS utility classes for styling
- Test on Chrome, Firefox, Safari, Edge

### 8. Security
- Never expose sensitive data (passwords, JWT secrets) in frontend code
- Sanitize user input to prevent XSS attacks
- Use HTTPS in production
- Validate all user inputs before sending to API

## Development Workflow

1. **Read the spec first**: Check `specs/006-phase1-fullstack-webapp/spec.md`
2. **Follow the plan**: Reference `specs/006-phase1-fullstack-webapp/plan.md`
3. **Execute tasks**: Work through `specs/006-phase1-fullstack-webapp/tasks.md`
4. **Test manually**: Use browser-based testing (no automated tests for Phase 1)

## Testing Checklist

Before marking a task complete:
- [ ] Component renders without errors
- [ ] API integration works (check Network tab in DevTools)
- [ ] JWT token is attached to requests
- [ ] Error handling displays appropriate messages
- [ ] Loading states are visible during async operations
- [ ] Responsive design works on mobile and desktop
- [ ] No console errors or warnings

## Common Pitfalls to Avoid

- ❌ Hardcoding user_id in API calls
- ❌ Storing passwords in plaintext
- ❌ Implementing Phase 2/3 features
- ❌ Direct database access
- ❌ Skipping error handling
- ❌ Missing loading states
- ❌ Not validating user input

## Environment Variables

Required in `frontend/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
BETTER_AUTH_SECRET=<same-as-backend>
NEXT_PUBLIC_ENVIRONMENT=development
```

## Code Quality Standards

- Use TypeScript for type safety
- Follow Next.js conventions (Server Components, Client Components, etc.)
- Write concise, readable code
- Add comments only for complex logic
- Use Tailwind CSS utility classes (avoid custom CSS)
- Keep components small and focused (single responsibility)

---

**Last Updated**: 2025-12-24
**Phase**: Phase 1 Full-Stack Web Application
