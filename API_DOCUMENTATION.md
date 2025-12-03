# API Documentation - CV Builder Pro

## Base URL
```
Development: http://localhost:3000/api
Production: https://your-domain.com/api
```

## Authentication

All protected routes require authentication via NextAuth session.

### Headers
```
Content-Type: application/json
Cookie: next-auth.session-token=<token>
```

---

## Authentication Endpoints

### Register User
```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (201):**
```json
{
  "message": "User created successfully",
  "userId": "507f1f77bcf86cd799439011"
}
```

**Errors:**
- `400` - Missing required fields
- `400` - User already exists
- `500` - Internal server error

---

### Sign In
```http
POST /api/auth/signin
```

Handled by NextAuth. Use the UI at `/auth/signin` or call via `signIn()` from `next-auth/react`.

---

## CV Endpoints

### Get All User CVs
```http
GET /api/cv
```

**Authentication:** Required

**Response (200):**
```json
{
  "cvs": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Software Engineer Resume",
      "userId": "507f191e810c19729de860ea",
      "templateId": "507f191e810c19729de860eb",
      "content": {
        "components": [...]
      },
      "isPublic": false,
      "shareableLink": null,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T14:20:00.000Z"
    }
  ]
}
```

**Errors:**
- `401` - Unauthorized
- `500` - Internal server error

---

### Create CV
```http
POST /api/cv
```

**Authentication:** Required

**Request Body:**
```json
{
  "title": "My Resume",
  "content": {
    "components": [
      {
        "id": "comp-1",
        "type": "heading",
        "content": {
          "text": "John Doe",
          "fontSize": 32
        },
        "position": { "x": 0, "y": 0 },
        "size": { "width": 100, "height": 50 }
      }
    ]
  },
  "templateId": "507f191e810c19729de860eb",
  "isPublic": false
}
```

**Response (201):**
```json
{
  "cv": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My Resume",
    "userId": "507f191e810c19729de860ea",
    "content": {...},
    "isPublic": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Errors:**
- `400` - Missing required fields
- `401` - Unauthorized
- `500` - Internal server error

---

### Get CV by ID
```http
GET /api/cv/:id
```

**Parameters:**
- `id` - CV ID

**Response (200):**
```json
{
  "cv": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "My Resume",
    "content": {...},
    "isPublic": true,
    "shareableLink": "abc123xyz789"
  }
}
```

**Errors:**
- `404` - CV not found
- `500` - Internal server error

---

### Update CV
```http
PUT /api/cv/:id
```

**Authentication:** Required (must be CV owner)

**Request Body:**
```json
{
  "title": "Updated Resume Title",
  "content": {
    "components": [...]
  },
  "isPublic": true
}
```

**Response (200):**
```json
{
  "cv": {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Updated Resume Title",
    "isPublic": true,
    "shareableLink": "abc123xyz789",
    "updatedAt": "2024-01-15T15:45:00.000Z"
  }
}
```

**Errors:**
- `401` - Unauthorized
- `404` - CV not found
- `500` - Internal server error

---

### Delete CV
```http
DELETE /api/cv/:id
```

**Authentication:** Required (must be CV owner)

**Response (200):**
```json
{
  "message": "CV deleted successfully"
}
```

**Errors:**
- `401` - Unauthorized
- `404` - CV not found
- `500` - Internal server error

---

## Template Endpoints

### Get All Templates
```http
GET /api/templates
```

**Authentication:** Optional (admins see all, users see approved only)

**Response (200):**
```json
{
  "templates": [
    {
      "_id": "507f191e810c19729de860eb",
      "name": "Modern Professional",
      "description": "Clean and modern template for professionals",
      "thumbnail": "https://example.com/thumb.jpg",
      "structure": {...},
      "category": "professional",
      "isPremium": false,
      "isApproved": true,
      "createdBy": "507f191e810c19729de860ea",
      "createdAt": "2024-01-10T08:00:00.000Z"
    }
  ]
}
```

**Errors:**
- `500` - Internal server error

---

### Create Template
```http
POST /api/templates
```

**Authentication:** Required

**Request Body:**
```json
{
  "name": "Creative Designer",
  "description": "Bold template for creative professionals",
  "thumbnail": "https://example.com/creative-thumb.jpg",
  "structure": {
    "components": [...]
  },
  "category": "creative",
  "isPremium": false
}
```

**Response (201):**
```json
{
  "template": {
    "_id": "507f191e810c19729de860ec",
    "name": "Creative Designer",
    "isApproved": false,
    "createdBy": "507f191e810c19729de860ea",
    "createdAt": "2024-01-15T16:00:00.000Z"
  }
}
```

**Note:** Templates created by non-admin users require admin approval.

**Errors:**
- `400` - Missing required fields
- `401` - Unauthorized
- `500` - Internal server error

---

## Admin Endpoints

### Get All Users
```http
GET /api/admin/users
```

**Authentication:** Required (admin only)

**Response (200):**
```json
{
  "users": [
    {
      "_id": "507f191e810c19729de860ea",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "provider": "google",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Errors:**
- `401` - Unauthorized (not admin)
- `500` - Internal server error

---

### Approve/Reject Template
```http
PATCH /api/admin/templates/:id/approve
```

**Authentication:** Required (admin only)

**Parameters:**
- `id` - Template ID

**Request Body:**
```json
{
  "isApproved": true
}
```

**Response (200):**
```json
{
  "template": {
    "_id": "507f191e810c19729de860ec",
    "name": "Creative Designer",
    "isApproved": true,
    "updatedAt": "2024-01-15T17:00:00.000Z"
  }
}
```

**Errors:**
- `401` - Unauthorized (not admin)
- `404` - Template not found
- `500` - Internal server error

---

## Data Models

### User Model
```typescript
{
  _id: ObjectId
  name: string
  email: string (unique)
  password?: string (hashed)
  image?: string
  role: 'user' | 'admin'
  provider?: 'google' | 'github' | 'linkedin' | 'credentials'
  emailVerified?: Date
  createdAt: Date
  updatedAt: Date
}
```

### CV Model
```typescript
{
  _id: ObjectId
  title: string
  userId: ObjectId (ref: User)
  templateId?: ObjectId (ref: Template)
  content: {
    components: Array<CVComponent>
  }
  isPublic: boolean
  shareableLink?: string (unique)
  createdAt: Date
  updatedAt: Date
}
```

### CVComponent
```typescript
{
  id: string
  type: 'text' | 'heading' | 'image' | 'contact' | 'experience' | 'education' | 'skills'
  content: any
  position: { x: number, y: number }
  size: { width: number, height: number }
}
```

### Template Model
```typescript
{
  _id: ObjectId
  name: string
  description: string
  thumbnail: string
  structure: {
    components: Array<CVComponent>
  }
  category: string
  isPremium: boolean
  isApproved: boolean
  createdBy: ObjectId (ref: User)
  createdAt: Date
  updatedAt: Date
}
```

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message description"
}
```

### Common HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

---

## Rate Limiting

Currently no rate limiting is implemented. Consider adding rate limiting for production:

- Authentication endpoints: 5 requests per minute
- CV operations: 30 requests per minute
- Template operations: 20 requests per minute

---

## Webhooks (Future)

Planned webhook events:
- `cv.created`
- `cv.updated`
- `cv.deleted`
- `template.submitted`
- `template.approved`

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// Create CV
const response = await fetch('/api/cv', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'My Resume',
    content: { components: [] },
    isPublic: false,
  }),
});

const data = await response.json();
```

### cURL

```bash
# Get all CVs
curl -X GET http://localhost:3000/api/cv \
  -H "Cookie: next-auth.session-token=<token>"

# Create CV
curl -X POST http://localhost:3000/api/cv \
  -H "Content-Type: application/json" \
  -H "Cookie: next-auth.session-token=<token>" \
  -d '{
    "title": "My Resume",
    "content": {"components": []},
    "isPublic": false
  }'
```

---

## Changelog

### v1.0.0 (2024-01-15)
- Initial API release
- Authentication endpoints
- CV CRUD operations
- Template management
- Admin endpoints
