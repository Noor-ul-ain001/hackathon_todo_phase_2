# Phase 1 Research & Technical Decisions

**Feature**: Phase 1 Full-Stack Web Application
**Created**: 2025-12-24
**Status**: Complete

## Purpose

This document consolidates all technical research and decisions made during Phase 0 planning for the Phase 1 Full-Stack Web Application. All "NEEDS CLARIFICATION" items from the technical context have been resolved.

---

## Decision 1: Frontend Framework Selection

**Question**: Which modern frontend framework should we use for the web application?

**Options Considered**:
1. **Next.js 16+ (App Router)** ← CHOSEN
2. Vite + React
3. Remix
4. Create React App (deprecated)

**Decision**: Next.js 16+ with App Router

**Rationale**:
- Modern React framework with server-side rendering (SSR) and static site generation (SSG)
- App Router provides improved routing, layouts, and data fetching
- Excellent TypeScript support out of the box
- Built-in optimization (image optimization, font optimization, code splitting)
- Large ecosystem and community support
- Better Auth integration well-documented
- Production-ready with Vercel deployment support

**Trade-offs**:
- Slightly steeper learning curve than Vite
- More opinionated (but beneficial for consistency)
- Larger bundle size than vanilla React (but better performance in practice)

**Alternatives Rejected**:
- **Vite + React**: Less mature ecosystem, no built-in SSR, requires more configuration
- **Remix**: Newer framework, smaller community, less documentation for Better Auth
- **Create React App**: Officially deprecated, no longer maintained

---

## Decision 2: Backend Framework Selection

**Question**: Which Python framework is best suited for building a REST API with JWT authentication?

**Options Considered**:
1. **FastAPI** ← CHOSEN
2. Django REST Framework
3. Flask
4. Express.js (Node.js alternative)

**Decision**: FastAPI

**Rationale**:
- Modern async Python framework built on ASGI
- Automatic OpenAPI documentation generation
- Excellent validation with Pydantic (type-safe)
- Fast performance (comparable to Node.js and Go)
- Native async/await support for database operations
- Straightforward JWT integration with python-jose
- Works seamlessly with SQLModel for database operations

**Trade-offs**:
- Smaller ecosystem than Django (but growing rapidly)
- Less built-in functionality (authentication not included)
- Requires more manual configuration for some features

**Alternatives Rejected**:
- **Django REST Framework**: Too heavy for this use case, includes admin panel and ORM we don't need, slower performance
- **Flask**: Less modern, no native async support, requires more boilerplate for validation
- **Express.js**: Different language (would split backend and lose Python benefits)

---

## Decision 3: Database Selection

**Question**: What database should we use for persistent storage with multi-user support?

**Options Considered**:
1. **Neon Serverless PostgreSQL** ← CHOSEN
2. Supabase (PostgreSQL + BaaS)
3. AWS RDS PostgreSQL
4. SQLite
5. MongoDB

**Decision**: Neon Serverless PostgreSQL

**Rationale**:
- Fully managed PostgreSQL-compatible database
- Serverless architecture with automatic scaling
- Developer-friendly with instant branching for testing
- Generous free tier for development
- PostgreSQL compatibility ensures data integrity (ACID compliance)
- SQLModel works perfectly with PostgreSQL
- No vendor lock-in (standard PostgreSQL)

**Trade-offs**:
- Newer service (less mature than AWS RDS)
- Limited to PostgreSQL (but that's what we need)
- Requires internet connection for development (can use local PostgreSQL alternative)

**Alternatives Rejected**:
- **Supabase**: Adds unnecessary features (auth, storage, realtime) - we use Better Auth
- **AWS RDS**: Requires more operational overhead, manual scaling, higher cost
- **SQLite**: Not suitable for multi-user production deployment, concurrency issues
- **MongoDB**: NoSQL not needed for this structured data model

---

## Decision 4: ORM Selection

**Question**: What ORM should we use for database interactions in FastAPI?

**Options Considered**:
1. **SQLModel** ← CHOSEN
2. SQLAlchemy (raw)
3. Tortoise ORM
4. Pony ORM

**Decision**: SQLModel

**Rationale**:
- Combines SQLAlchemy (mature ORM) with Pydantic (validation)
- Type-safe models that work for both database and API
- Created by the same author as FastAPI (Sebastian Ramirez)
- Seamless integration with FastAPI and Pydantic
- Less boilerplate than raw SQLAlchemy
- Supports async operations

**Trade-offs**:
- Newer library (less mature than SQLAlchemy)
- Smaller community than raw SQLAlchemy
- Some advanced SQLAlchemy features require dropping down to SQLAlchemy layer

**Alternatives Rejected**:
- **Raw SQLAlchemy**: More boilerplate, separate models for DB and API
- **Tortoise ORM**: Less mature, smaller community, incompatible with Pydantic
- **Pony ORM**: Different syntax, not compatible with FastAPI patterns

---

## Decision 5: Authentication Strategy

**Question**: How should we handle user authentication and JWT token management?

**Options Considered**:
1. **Better Auth (frontend) + Custom JWT verification (backend)** ← CHOSEN
2. NextAuth.js
3. Auth0
4. Clerk
5. Custom implementation (email/password + JWT)

**Decision**: Better Auth for frontend, custom JWT verification for backend

**Rationale**:
- **Better Auth** handles user registration, sign-in, and JWT issuance on frontend
- Custom verification gives full control over FastAPI backend integration
- No external service dependency (Auth0, Clerk cost money)
- Stateless JWT tokens enable horizontal scaling
- Shared secret (BETTER_AUTH_SECRET) ensures trust between frontend and backend
- Better Auth is modern, well-documented, and actively maintained

**Trade-offs**:
- Requires implementing JWT verification on backend (not built-in)
- Need to ensure frontend and backend share secret securely
- Token revocation requires additional work (can add in future phases)

**Alternatives Rejected**:
- **NextAuth.js**: Similar to Better Auth but less flexible for custom backends
- **Auth0**: External service adds cost, latency, and vendor lock-in
- **Clerk**: Same issues as Auth0 (cost and dependency)
- **Custom implementation**: Too much work, security risks, reinventing the wheel

---

## Decision 6: JWT Library Selection

**Question**: Which library should we use for JWT encoding/decoding in FastAPI?

**Options Considered**:
1. **python-jose** ← CHOSEN
2. PyJWT
3. authlib

**Decision**: python-jose

**Rationale**:
- Well-maintained and widely used in FastAPI ecosystem
- Supports multiple JWT algorithms (HS256, RS256, etc.)
- Integrates with FastAPI security examples
- Simple API for encoding/decoding tokens
- Cryptography library included

**Trade-offs**:
- Slightly larger dependency than PyJWT
- Not as feature-rich as authlib (but we don't need advanced features)

**Alternatives Rejected**:
- **PyJWT**: Similar functionality, but less commonly used with FastAPI
- **authlib**: Heavier library with OAuth/OpenID features we don't need

---

## Decision 7: Password Hashing

**Question**: Which password hashing algorithm should we use?

**Options Considered**:
1. **bcrypt (via passlib)** ← CHOSEN
2. argon2
3. scrypt

**Decision**: bcrypt via passlib library

**Rationale**:
- Industry standard for password hashing
- Secure against rainbow table and brute-force attacks
- Supported natively by Better Auth
- passlib provides easy interface for bcrypt
- Configurable work factor for future-proofing

**Trade-offs**:
- Slower than some alternatives (but that's a security feature)
- Requires C extensions (but included in passlib)

**Alternatives Rejected**:
- **argon2**: Newer algorithm, less tested in production, not default in Better Auth
- **scrypt**: Similar to bcrypt but slower, less widely adopted

---

## Decision 8: Styling Framework

**Question**: What styling approach should we use for the frontend?

**Options Considered**:
1. **Tailwind CSS** ← CHOSEN (can defer to vanilla CSS for Phase 1)
2. CSS Modules
3. styled-components
4. MUI (Material-UI)
5. Vanilla CSS

**Decision**: Tailwind CSS (with vanilla CSS as acceptable fallback for Phase 1)

**Rationale**:
- Utility-first CSS framework enables rapid development
- Responsive design built-in (mobile-first approach)
- Small bundle size (only used classes included)
- Excellent Next.js integration
- Consistent design tokens (colors, spacing, typography)
- Can defer to vanilla CSS if Tailwind adds complexity

**Trade-offs**:
- Requires learning utility class names
- HTML can look cluttered with many classes
- Not required for Phase 1 (can use vanilla CSS)

**Alternatives Rejected**:
- **CSS Modules**: More boilerplate, requires separate CSS files
- **styled-components**: Runtime overhead, less performant
- **MUI**: Heavy library, opinionated design, harder to customize
- **Vanilla CSS**: Acceptable for Phase 1, but slower development for future phases

---

## Decision 9: Package Manager Selection

**Question**: Which package managers should we use for frontend and backend?

**Options Considered**:
- **Frontend**: npm, yarn, **pnpm** ← CHOSEN
- **Backend**: pip, poetry, **UV** ← CHOSEN

**Decision**: pnpm (frontend), UV (backend)

**Rationale**:
- **pnpm**: Faster than npm, disk-efficient (uses symlinks), strict dependency resolution, lockfile compatibility with npm
- **UV**: Modern Python package manager, extremely fast (Rust-based), simple pyproject.toml configuration, replaces pip/virtualenv/poetry

**Trade-offs**:
- pnpm less common than npm (but growing adoption)
- UV newer tool (but officially recommended by Python community)

**Alternatives Rejected**:
- **npm**: Slower, disk-inefficient (node_modules duplication)
- **yarn**: Less modern than pnpm, classic version deprecated
- **pip**: Slower, requires manual virtualenv management
- **poetry**: Heavier, slower, more complex configuration

---

## Decision 10: Development Environment

**Question**: How should developers run the application locally?

**Options Considered**:
1. **Docker Compose** ← CHOSEN
2. Local services (separate PostgreSQL, frontend, backend)
3. Kubernetes (minikube)
4. Cloud development environment

**Decision**: Docker Compose for local development

**Rationale**:
- Single docker-compose.yml orchestrates all services
- Consistent environment across developers
- Can run local PostgreSQL or proxy to Neon
- Easy setup (docker-compose up)
- Environment variables managed in .env file
- Production-like environment locally

**Trade-offs**:
- Requires Docker installation
- Slightly slower than native execution (minimal impact)
- More memory usage (acceptable for modern machines)

**Alternatives Rejected**:
- **Local services**: Harder to reproduce, environment drift, manual setup
- **Kubernetes**: Overkill for local development, complex configuration
- **Cloud dev**: Requires internet, potential cost, latency

---

## Decision 11: Monorepo Structure

**Question**: How should we organize the codebase?

**Options Considered**:
1. **Monorepo (frontend + backend in same repo)** ← CHOSEN
2. Separate repositories (frontend, backend)
3. Monolithic structure (everything in one project)

**Decision**: Monorepo with frontend/ and backend/ separation

**Rationale**:
- Required by constitution (Principle VIII)
- Coordinated changes across frontend/backend in single commit
- Shared documentation (specs, README, CLAUDE.md)
- Easier to maintain API contracts (both sides in one place)
- Single git history for full-stack features

**Trade-offs**:
- Slightly more complex CI/CD (need to detect which layer changed)
- Larger repository size (but manageable)

**Alternatives Rejected**:
- **Separate repos**: Harder to coordinate changes, duplicated documentation, separate git histories
- **Monolithic**: No layer separation, violates constitution, harder to deploy independently

---

## Summary Table

| Decision Area | Chosen Solution | Key Reason |
|---------------|----------------|------------|
| Frontend Framework | Next.js 16+ | Modern React with SSR, App Router, TypeScript |
| Backend Framework | FastAPI | Async, type-safe, auto docs, Pydantic integration |
| Database | Neon PostgreSQL | Serverless, developer-friendly, PostgreSQL-compatible |
| ORM | SQLModel | Combines SQLAlchemy + Pydantic, FastAPI integration |
| Authentication | Better Auth + Custom JWT | Modern auth, JWT stateless, full control |
| JWT Library | python-jose | FastAPI ecosystem standard, multiple algorithms |
| Password Hashing | bcrypt (passlib) | Industry standard, Better Auth compatible |
| Styling | Tailwind CSS | Utility-first, responsive, fast development |
| Package Managers | pnpm + UV | Fast, efficient, modern tooling |
| Dev Environment | Docker Compose | Consistent, reproducible, easy setup |
| Code Organization | Monorepo | Constitution requirement, coordinated changes |

---

## Open Questions

**None** - All technical decisions resolved during Phase 0 research.

---

**Research Complete**: 2025-12-24
**Ready for**: Phase 1 Design (data-model.md, contracts/, quickstart.md)
