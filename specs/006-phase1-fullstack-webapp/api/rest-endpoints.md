# REST API Specification

## Base URL

```
/api
```

All API endpoints are prefixed with `/api`.

## Authentication

**All requests require authentication** via JWT token in the Authorization header:

```
Authorization: Bearer <JWT_TOKEN>
```

**Missing or invalid token** → `401 Unauthorized`

## Endpoints

### GET /api/{user_id}/tasks

**Purpose**: List all tasks for the authenticated user

**URL Parameters**:
- `user_id` (string, required): User identifier - must match JWT subject

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response** (200 OK):
```json
{
  "tasks": [
    {
      "id": 1,
      "user_id": "abc123",
      "title": "Buy groceries",
      "description": "Milk, eggs, bread",
      "completed": false,
      "created_at": "2025-12-24T10:00:00Z",
      "updated_at": "2025-12-24T10:00:00Z"
    },
    {
      "id": 2,
      "user_id": "abc123",
      "title": "Write report",
      "description": null,
      "completed": true,
      "created_at": "2025-12-23T15:30:00Z",
      "updated_at": "2025-12-24T09:00:00Z"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: user_id does not match JWT subject

---

### POST /api/{user_id}/tasks

**Purpose**: Create a new task

**URL Parameters**:
- `user_id` (string, required): User identifier - must match JWT subject

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"  // optional
}
```

**Field Validation**:
- `title` (required): 1-200 characters
- `description` (optional): max 1000 characters

**Success Response** (201 Created):
```json
{
  "id": 3,
  "user_id": "abc123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2025-12-24T11:00:00Z",
  "updated_at": "2025-12-24T11:00:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input (missing title, title too long, description too long)
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: user_id does not match JWT subject

---

### GET /api/{user_id}/tasks/{id}

**Purpose**: Retrieve a specific task

**URL Parameters**:
- `user_id` (string, required): User identifier - must match JWT subject
- `id` (integer, required): Task identifier

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "user_id": "abc123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": false,
  "created_at": "2025-12-24T10:00:00Z",
  "updated_at": "2025-12-24T10:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: user_id does not match JWT subject
- `404 Not Found`: Task does not exist or does not belong to user

---

### PUT /api/{user_id}/tasks/{id}

**Purpose**: Update task title or description

**URL Parameters**:
- `user_id` (string, required): User identifier - must match JWT subject
- `id` (integer, required): Task identifier

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body** (provide fields to update):
```json
{
  "title": "Buy groceries and fruits",
  "description": "Milk, eggs, bread, apples, bananas"
}
```

**Field Validation**:
- `title` (optional in request): 1-200 characters if provided
- `description` (optional in request): max 1000 characters if provided

**Success Response** (200 OK):
```json
{
  "id": 1,
  "user_id": "abc123",
  "title": "Buy groceries and fruits",
  "description": "Milk, eggs, bread, apples, bananas",
  "completed": false,
  "created_at": "2025-12-24T10:00:00Z",
  "updated_at": "2025-12-24T11:30:00Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input (title too long, description too long)
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: user_id does not match JWT subject
- `404 Not Found`: Task does not exist or does not belong to user

---

### DELETE /api/{user_id}/tasks/{id}

**Purpose**: Delete a task permanently

**URL Parameters**:
- `user_id` (string, required): User identifier - must match JWT subject
- `id` (integer, required): Task identifier

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Success Response** (204 No Content):
```
(empty body)
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: user_id does not match JWT subject
- `404 Not Found`: Task does not exist or does not belong to user

---

### PATCH /api/{user_id}/tasks/{id}/complete

**Purpose**: Toggle task completion status

**URL Parameters**:
- `user_id` (string, required): User identifier - must match JWT subject
- `id` (integer, required): Task identifier

**Request Headers**:
```
Authorization: Bearer <JWT_TOKEN>
```

**Request Body** (optional - can toggle or set explicitly):
```json
{
  "completed": true  // optional: if omitted, toggles current state
}
```

**Success Response** (200 OK):
```json
{
  "id": 1,
  "user_id": "abc123",
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "completed": true,
  "created_at": "2025-12-24T10:00:00Z",
  "updated_at": "2025-12-24T12:00:00Z"
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid JWT
- `403 Forbidden`: user_id does not match JWT subject
- `404 Not Found`: Task does not exist or does not belong to user

---

## API Rules

### JWT Verification
- **Backend MUST** extract JWT from Authorization header
- **Backend MUST** verify JWT signature using BETTER_AUTH_SECRET
- **Backend MUST** extract user_id from JWT payload (subject claim)
- **Invalid/missing JWT** → return 401 Unauthorized

### User ID Matching
- **Backend MUST** verify that `user_id` in URL matches JWT subject
- **Mismatch** → return 403 Forbidden
- This prevents users from accessing other users' resources

### Query Filtering
- **All database queries MUST** filter by authenticated user_id
- **No cross-user data access** is permitted
- Even if frontend is bypassed, backend enforces isolation

### HTTP Status Codes
- `200 OK`: Successful GET/PUT/PATCH request
- `201 Created`: Successful POST request (task created)
- `204 No Content`: Successful DELETE request
- `400 Bad Request`: Validation error (invalid input)
- `401 Unauthorized`: Authentication failed (missing/invalid JWT)
- `403 Forbidden`: Authorization failed (valid JWT but forbidden resource)
- `404 Not Found`: Resource not found or doesn't belong to user
- `500 Internal Server Error`: Server error (database failure, etc.)

### Error Response Format

All error responses include a JSON body with error details:

```json
{
  "error": "Error Type",
  "message": "Human-readable description of the error"
}
```

**Examples**:

**400 Bad Request**:
```json
{
  "error": "Validation Error",
  "message": "Task title must be between 1 and 200 characters"
}
```

**401 Unauthorized**:
```json
{
  "error": "Unauthorized",
  "message": "Valid authentication required"
}
```

**403 Forbidden**:
```json
{
  "error": "Forbidden",
  "message": "You do not have permission to access this resource"
}
```

**404 Not Found**:
```json
{
  "error": "Not Found",
  "message": "Task not found"
}
```

### Content Type
- Requests with body MUST include `Content-Type: application/json`
- Responses return `Content-Type: application/json` (except 204 No Content)

### CORS (if applicable)
- If frontend and backend are on different domains, CORS must be configured
- Allow credentials (for cookies if using httpOnly cookies)
- Specify allowed origins (avoid wildcard `*` for security)

## Security Considerations

1. **Always verify JWT** - never trust client-sent user_id without validation
2. **Filter all queries by authenticated user** - prevent data leakage
3. **Use parameterized queries** - prevent SQL injection
4. **Validate all inputs** - prevent XSS and malicious data
5. **Rate limiting** (future enhancement) - prevent abuse
6. **HTTPS only** (production) - encrypt data in transit
