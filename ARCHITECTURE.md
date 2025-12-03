# Architecture Documentation - CV Builder Pro

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Browser    │  │   Mobile     │  │   Tablet     │      │
│  │   (Desktop)  │  │   Browser    │  │   Browser    │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                       │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              React Components (UI)                    │  │
│  │  • Landing Page  • Dashboard  • CV Builder           │  │
│  │  • Auth Pages    • Admin Panel                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                            │                                 │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              API Routes (Backend)                     │  │
│  │  • /api/auth/*   • /api/cv/*   • /api/templates/*    │  │
│  │  • /api/admin/*                                       │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   External Services                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   MongoDB    │  │    Google    │  │   GitHub     │      │
│  │    Atlas     │  │    OAuth     │  │    OAuth     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

## Technology Stack

### Frontend Architecture

**Framework:** Next.js 14 (App Router)
- Server-side rendering (SSR)
- Static site generation (SSG)
- API routes for backend
- File-based routing
- Automatic code splitting

**UI Layer:**
- React 18 with hooks
- TypeScript for type safety
- TailwindCSS for styling
- Radix UI for accessible components
- @dnd-kit for drag-and-drop

**State Management:**
- React Context (SessionProvider)
- Local component state (useState)
- Server state via API calls
- No global state management needed (kept simple)

### Backend Architecture

**API Layer:**
- Next.js API Routes (serverless functions)
- RESTful API design
- Middleware for authentication
- Route protection

**Authentication:**
- NextAuth.js v4
- Multiple providers (Google, GitHub, LinkedIn, Credentials)
- JWT-based sessions
- Secure cookie storage

**Database:**
- MongoDB (NoSQL)
- Mongoose ODM
- Connection pooling
- Indexed queries

## Data Flow

### Authentication Flow

```
User → Sign In Page → NextAuth
                        ↓
              Check Credentials
                        ↓
         ┌──────────────┴──────────────┐
         ▼                              ▼
    OAuth Provider              MongoDB (Users)
         │                              │
         └──────────────┬───────────────┘
                        ▼
                  Generate JWT
                        ▼
                  Set Session Cookie
                        ▼
                Redirect to Dashboard
```

### CV Creation Flow

```
User → Dashboard → "Create CV" Button
                        ↓
                  CV Builder Page
                        ↓
              Drag & Drop Components
                        ↓
                  Edit Content
                        ↓
                  Click "Save"
                        ↓
              POST /api/cv
                        ↓
              Validate Session
                        ↓
              Save to MongoDB
                        ↓
              Return CV Object
                        ↓
              Redirect to Dashboard
```

### Template Approval Flow

```
User → Upload Template → POST /api/templates
                              ↓
                    Save with isApproved: false
                              ↓
                    Admin → Admin Panel
                              ↓
                    View Pending Templates
                              ↓
                    Approve/Reject
                              ↓
              PATCH /api/admin/templates/:id/approve
                              ↓
                    Update isApproved field
                              ↓
                    Template visible to users
```

## Component Architecture

### Page Components

```
app/
├── page.tsx                    # Landing page
├── layout.tsx                  # Root layout with providers
├── auth/
│   ├── signin/page.tsx        # Sign in page
│   └── signup/page.tsx        # Sign up page
├── dashboard/page.tsx         # User dashboard
├── builder/
│   └── new/page.tsx           # CV builder
└── admin/page.tsx             # Admin panel
```

### Reusable Components

```
components/
├── ui/
│   ├── button.tsx             # Button component
│   └── input.tsx              # Input component
└── cv-builder/
    ├── DragDropEditor.tsx     # Main editor
    ├── SortableItem.tsx       # Draggable item
    └── ComponentToolbar.tsx   # Component palette
```

## Database Schema Design

### Users Collection

```javascript
{
  _id: ObjectId,
  name: String,
  email: String (unique, indexed),
  password: String (hashed),
  image: String,
  role: String (enum: ['user', 'admin']),
  provider: String,
  emailVerified: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `email` (unique)
- `role`

### CVs Collection

```javascript
{
  _id: ObjectId,
  title: String,
  userId: ObjectId (ref: 'User', indexed),
  templateId: ObjectId (ref: 'Template'),
  content: {
    components: [{
      id: String,
      type: String,
      content: Mixed,
      position: { x: Number, y: Number },
      size: { width: Number, height: Number }
    }]
  },
  isPublic: Boolean,
  shareableLink: String (unique, sparse indexed),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `userId`
- `shareableLink` (unique, sparse)
- `updatedAt` (for sorting)

### Templates Collection

```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  thumbnail: String,
  structure: {
    components: [...]
  },
  category: String (indexed),
  isPremium: Boolean,
  isApproved: Boolean (indexed),
  createdBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `category`
- `isApproved`
- `createdBy`

## Security Architecture

### Authentication Security

1. **Password Security:**
   - bcrypt hashing (10 rounds)
   - No plain text storage
   - Secure password requirements

2. **Session Security:**
   - JWT tokens
   - HTTP-only cookies
   - Secure flag in production
   - CSRF protection

3. **OAuth Security:**
   - State parameter validation
   - Secure redirect URIs
   - Token verification

### Authorization

1. **Role-Based Access Control (RBAC):**
   ```typescript
   User Roles:
   - user: Basic access (own CVs)
   - admin: Full access (all users, templates)
   ```

2. **Route Protection:**
   - Middleware checks authentication
   - API routes validate sessions
   - Admin routes check role

3. **Data Access:**
   - Users can only access own CVs
   - Admins can access all data
   - Public CVs accessible via shareable link

### API Security

1. **Input Validation:**
   - Zod schemas for validation
   - Type checking with TypeScript
   - Sanitization of user input

2. **Rate Limiting:**
   - (To be implemented)
   - Recommended: 100 req/min per IP

3. **Error Handling:**
   - Generic error messages
   - No sensitive data in errors
   - Logging for debugging

## Performance Optimizations

### Frontend Performance

1. **Code Splitting:**
   - Automatic with Next.js
   - Dynamic imports for heavy components
   - Route-based splitting

2. **Image Optimization:**
   - Next.js Image component
   - Lazy loading
   - Responsive images

3. **Caching:**
   - Static page caching
   - API response caching
   - Browser caching headers

### Backend Performance

1. **Database Optimization:**
   - Indexed queries
   - Connection pooling
   - Lean queries (select only needed fields)

2. **API Optimization:**
   - Efficient queries
   - Pagination (to be implemented)
   - Response compression

3. **Serverless Optimization:**
   - Cold start mitigation
   - Function size optimization
   - Edge caching

## Scalability Considerations

### Horizontal Scaling

1. **Stateless Architecture:**
   - No server-side sessions
   - JWT for authentication
   - Can scale to multiple instances

2. **Database Scaling:**
   - MongoDB Atlas auto-scaling
   - Read replicas for read-heavy operations
   - Sharding for large datasets

3. **CDN Integration:**
   - Static assets on CDN
   - Edge caching
   - Global distribution

### Vertical Scaling

1. **Database:**
   - Upgrade MongoDB cluster tier
   - Increase connection pool size
   - Add indexes for slow queries

2. **Application:**
   - Increase serverless function memory
   - Optimize bundle size
   - Code optimization

## Deployment Architecture

### Production Environment

```
┌─────────────────────────────────────────┐
│           Vercel Edge Network            │
│  ┌────────────────────────────────────┐ │
│  │      CDN (Static Assets)           │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │   Serverless Functions (API)       │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────┐
│         MongoDB Atlas Cluster            │
│  ┌────────────────────────────────────┐ │
│  │      Primary Node (Write)          │ │
│  └────────────────────────────────────┘ │
│  ┌────────────────────────────────────┐ │
│  │    Secondary Nodes (Read)          │ │
│  └────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### CI/CD Pipeline

```
GitHub Push → Vercel Build
                  ↓
            Run Tests
                  ↓
            Build Next.js
                  ↓
            Deploy to Edge
                  ↓
            Health Check
                  ↓
            Production Live
```

## Monitoring & Logging

### Application Monitoring

1. **Error Tracking:**
   - Sentry integration (recommended)
   - Error boundaries in React
   - API error logging

2. **Performance Monitoring:**
   - Vercel Analytics
   - Core Web Vitals
   - API response times

3. **User Analytics:**
   - Google Analytics
   - User behavior tracking
   - Conversion funnels

### Logging Strategy

1. **Application Logs:**
   - Console logs in development
   - Structured logging in production
   - Log levels (error, warn, info, debug)

2. **Audit Logs:**
   - User actions (create, update, delete)
   - Admin actions
   - Authentication events

## Future Architecture Enhancements

### Phase 2

1. **Microservices:**
   - Separate PDF generation service
   - Image processing service
   - Email notification service

2. **Caching Layer:**
   - Redis for session storage
   - Cache frequently accessed templates
   - API response caching

3. **Message Queue:**
   - Background job processing
   - Email notifications
   - PDF generation queue

### Phase 3

1. **Real-time Features:**
   - WebSocket for collaborative editing
   - Live preview updates
   - Real-time notifications

2. **Advanced Analytics:**
   - Data warehouse integration
   - Business intelligence dashboards
   - User behavior analysis

3. **Global Distribution:**
   - Multi-region deployment
   - Data replication
   - Edge computing

## Development Workflow

### Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Set up environment
cp .env.example .env.local

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### Code Quality

1. **Linting:**
   - ESLint configuration
   - TypeScript strict mode
   - Pre-commit hooks (recommended)

2. **Testing:**
   - Unit tests (Jest)
   - Integration tests
   - E2E tests (Playwright recommended)

3. **Code Review:**
   - Pull request reviews
   - Automated checks
   - Security scanning

## Conclusion

This architecture provides a solid foundation for a scalable, secure, and maintainable CV builder application. The modular design allows for easy extension and modification as requirements evolve.

Key strengths:
- Serverless architecture for easy scaling
- Type-safe with TypeScript
- Secure authentication and authorization
- Modern React patterns
- Production-ready deployment

Areas for future improvement:
- Add comprehensive testing
- Implement rate limiting
- Add caching layer
- Enhance monitoring and logging
- Implement CI/CD pipeline
