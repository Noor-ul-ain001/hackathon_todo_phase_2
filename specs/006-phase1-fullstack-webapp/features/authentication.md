# Feature: User Authentication

## Description

Authentication is handled on the frontend using Better Auth, which issues JWT (JSON Web Token) tokens upon successful login. The backend verifies users via JWT tokens on every API request to ensure secure, stateless authentication.

This enables multi-user support with secure data isolation while maintaining scalability through stateless session management.

## Auth Flow

### Registration Flow

1. **User signs up** on the frontend registration page
   - Provides email address
   - Provides password (minimum 8 characters)
   - Frontend validates format before submission

2. **Better Auth processes registration**
   - Validates email is unique
   - Hashes password securely
   - Creates user record in database
   - Issues a JWT token
   - Returns token to frontend

3. **Frontend stores JWT**
   - Stores token in browser (localStorage or httpOnly cookie)
   - Redirects user to task dashboard
   - User is now authenticated

### Sign-In Flow

1. **User signs in** on the frontend sign-in page
   - Provides email address
   - Provides password

2. **Better Auth validates credentials**
   - Looks up user by email
   - Verifies password hash matches
   - If valid: issues JWT token
   - If invalid: returns error (does not reveal which field was wrong)

3. **Frontend stores JWT**
   - Stores token securely
   - Redirects to task dashboard
   - User is now authenticated

### API Request Flow

1. **Frontend makes API request**
   - Attaches JWT to Authorization header: `Bearer <token>`
   - Sends request to backend API endpoint

2. **Backend validates JWT**
   - Extracts token from Authorization header
   - Verifies token signature using BETTER_AUTH_SECRET
   - Extracts user identity (user_id) from token payload
   - If valid: proceeds with request
   - If invalid/missing: returns 401 Unauthorized

3. **Backend enforces user context**
   - Uses user_id from JWT for all database queries
   - Verifies user_id in URL matches JWT subject (for user-scoped routes)
   - Ensures data isolation

4. **Backend returns response**
   - Sends requested data (filtered by user)
   - Or returns error if validation/authorization fails

## Rules

### Authentication Requirements
- **All API endpoints** require authentication (except public endpoints like /health if implemented)
- Missing JWT → **401 Unauthorized**
- Invalid JWT (bad signature, expired, malformed) → **401 Unauthorized**
- Valid JWT but accessing forbidden resource → **403 Forbidden**

### JWT Token Structure
- **Issuer**: Better Auth
- **Subject**: user_id (used to identify the user)
- **Expiration**: Recommended 24 hours (configurable)
- **Signature**: HMAC-SHA256 using BETTER_AUTH_SECRET

### User ID Validation
- **User ID from JWT MUST match** the user_id in the URL for user-scoped endpoints
- Example: If JWT contains user_id="abc123", only `/api/abc123/tasks` is allowed
- Attempting `/api/xyz789/tasks` with user_id="abc123" → **403 Forbidden**

### Password Security
- Passwords MUST be hashed before storage (never store plaintext)
- Minimum length: 8 characters
- Hash algorithm: bcrypt, scrypt, or argon2 (Better Auth default)
- Password validation failures must not reveal whether email exists

### Token Storage (Frontend)
- JWT should be stored securely (httpOnly cookie recommended)
- If using localStorage, be aware of XSS risks
- Token should be cleared on sign-out

## User Stories

### As a new user, I can create an account

**Acceptance Criteria**:
- I can provide my email address
- I can create a password (minimum 8 characters)
- My password is validated before submission
- I receive clear error messages for invalid input (e.g., "Email already in use")
- Upon successful registration, I am automatically signed in
- I am redirected to the task dashboard

### As an existing user, I can sign in

**Acceptance Criteria**:
- I can provide my email address
- I can provide my password
- If credentials are correct, I am authenticated and redirected to dashboard
- If credentials are incorrect, I see an error message (without revealing which field was wrong)
- My session persists until I sign out or the token expires

### As an authenticated user, my session is secure

**Acceptance Criteria**:
- My JWT token is signed and cannot be forged
- My password is never sent to the backend after registration/sign-in
- My session expires after a reasonable time (e.g., 24 hours)
- If my token expires, I am prompted to sign in again
- All my API requests include my JWT for verification

### As an authenticated user, I can only access my own data

**Acceptance Criteria**:
- I can only see tasks that belong to me
- I cannot access another user's tasks by manipulating URLs
- I cannot update or delete another user's tasks
- The backend enforces these rules even if the frontend is bypassed

## Error Scenarios

### 401 Unauthorized (Authentication Failed)
- **Trigger**: Missing JWT, invalid JWT, expired JWT
- **Response**: `{"error": "Unauthorized", "message": "Valid authentication required"}`
- **Frontend Action**: Redirect to sign-in page

### 403 Forbidden (Authorization Failed)
- **Trigger**: Valid JWT but accessing forbidden resource (e.g., another user's task)
- **Response**: `{"error": "Forbidden", "message": "You do not have permission to access this resource"}`
- **Frontend Action**: Display error message, do not grant access

### 400 Bad Request (Validation Failed)
- **Trigger**: Invalid registration/sign-in input (e.g., email format, short password)
- **Response**: `{"error": "Validation failed", "message": "Password must be at least 8 characters"}`
- **Frontend Action**: Display validation error near relevant field

## Security Considerations

### Phase 1 Scope
- Basic JWT authentication with email/password
- Password hashing
- Token signature verification
- User data isolation

### Future Enhancements (Out of Scope for Phase 1)
- Token refresh mechanism
- Token revocation/blacklist
- Multi-factor authentication (MFA)
- OAuth/SSO providers (Google, GitHub, etc.)
- Password reset flow
- Account lockout after failed attempts
- Session management dashboard
