# Cornerstones: Full-Stack Developer Reference Guide

A comprehensive guide covering system design, development, deployment, and monitoring for full-stack applications using React/Next.js, Node.js/NestJS, and PostgreSQL.

---

## 1. System Design & Architecture

**📺 :**
- [System Design Interview Playlist by ByteByteGo](https://www.youtube.com/watch?v=bUHFg8CZFws&list=PLCRMIe5FDPsd0gVs500xeOewfySTsmEjf) - Comprehensive system design concepts
- [System Design by Gaurav Sen](https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX) - Popular system design playlist

### What to Study
- Microservices vs Monolithic architectures and when to use each
- RESTful API design principles and HTTP methods
- API versioning strategies (URL path, headers, query parameters)
- Authentication flows (JWT, OAuth2, session-based)
- Caching strategies (Redis, in-memory, CDN)
- Load balancing concepts (round-robin, least connections)
- Message queues and event-driven architecture (RabbitMQ, Kafka)
- Scalability patterns (horizontal vs vertical scaling)
- CAP theorem and eventual consistency
- Rate limiting and throttling mechanisms

### What You Must Do
- Design APIs before implementation using OpenAPI/Swagger specifications
- Define clear service boundaries and responsibilities
- Plan for authentication and authorization from the start
- Create system architecture diagrams documenting data flow
- Define error handling strategies across all layers
- Establish API contracts between frontend and backend teams
- Plan database schema before writing code
- Consider security implications at the design phase

### What You Should Do
- Use API gateway pattern for complex microservices
- Implement circuit breaker patterns for external dependencies
- Design for horizontal scalability from the beginning
- Consider CQRS (Command Query Responsibility Segregation) for complex domains
- Plan for feature flags to enable gradual rollouts
- Document architectural decisions with ADRs (Architecture Decision Records)
- Design with observability in mind (logging, metrics, tracing)

### What to Avoid
- Premature optimization without performance data
- Over-engineering solutions for simple problems
- Tight coupling between services or layers
- Ignoring backward compatibility in API changes
- Designing without considering failure scenarios
- Creating god services that do everything
- Skipping the design phase and coding directly

---

## 2. Database Design (PostgreSQL)

**📺 Recommended Learning:**
- [PostgreSQL Tutorial for Beginners by freeCodeCamp](https://www.youtube.com/watch?v=qw--VYLpxG4) - Complete PostgreSQL course (4+ hours)
- [Database Design Course by freeCodeCamp](https://www.youtube.com/watch?v=ztHopE5Wnpc) - Database design fundamentals
- [SQL Optimization by Hussein Nasser](https://www.youtube.com/playlist?list=PLQnljOFTspQXjD0HOzN7P2tgzu7scWpl2) - Advanced PostgreSQL optimization

### What to Study
- Normalization forms (1NF, 2NF, 3NF, BCNF) and when to denormalize
- Indexing strategies (B-tree, Hash, GiST, GIN)
- Query execution plans and EXPLAIN ANALYZE
- Transaction isolation levels (Read Committed, Serializable)
- ACID properties and their importance
- Connection pooling mechanisms
- Database sharding and partitioning strategies
- Replication (master-slave, multi-master)
- JSON/JSONB data types for semi-structured data
- Full-text search capabilities in PostgreSQL
- Common Table Expressions (CTEs) and window functions

### What You Must Do
- Always use migrations for schema changes (never manual DDL in production)
- Define foreign key constraints to maintain referential integrity
- Add NOT NULL constraints where appropriate
- Create indexes on foreign keys and frequently queried columns
- Use connection pooling (PgBouncer or application-level)
- Implement database backups with regular testing of restoration
- Use transactions for operations that must be atomic
- Version control all database schemas and migrations
- Set up proper user roles and permissions (principle of least privilege)
- Add created_at and updated_at timestamps to tables

### What You Should Do
- Use UUIDs for distributed systems, serial IDs for single-instance apps
- Implement soft deletes (deleted_at column) for audit trails
- Add database-level constraints beyond application validation
- Use JSONB for flexible, schema-less data when appropriate
- Implement row-level security for multi-tenant applications
- Create composite indexes for multi-column queries
- Use materialized views for expensive, frequently-run queries
- Implement database-level audit logging for sensitive tables
- Consider read replicas for read-heavy workloads
- Use enum types for fields with fixed set of values

### What to Avoid
- Storing large files directly in the database (use object storage)
- Using SELECT * in application queries
- Creating indexes on every column without analysis
- Ignoring query performance until problems arise
- Running migrations without testing rollback procedures
- Using ORMs without understanding generated SQL
- Over-normalizing to the point of complex joins everywhere
- Storing sensitive data without encryption
- Missing indexes on foreign keys
- Using VARCHAR without length limits unnecessarily

### Best Practices
```sql
-- Example: Well-designed table with constraints
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'user',
  is_active BOOLEAN NOT NULL DEFAULT true,
  email_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  deleted_at TIMESTAMP,
  CONSTRAINT email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_active ON users(is_active) WHERE deleted_at IS NULL;

-- Update trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

## 3. Backend Development (Node.js & NestJS)

**📺 Recommended Learning:**
- [Node.js Full Course by freeCodeCamp](https://www.youtube.com/watch?v=Oe421EPjeBE) - Complete Node.js tutorial
- [NestJS Course for Beginners by freeCodeCamp](https://www.youtube.com/watch?v=GHTA143_b-s) - Full NestJS course
- [Node.js Best Practices by Tech With Tim](https://www.youtube.com/playlist?list=PLzMcBGfZo4-kqyzTzJWCV6lyK-ZMYECbd) - Backend best practices
- [NestJS Crash Course by Traversy Media](https://www.youtube.com/watch?v=2n3xS89TJMI) - Quick NestJS overview

### What to Study
- Event loop and asynchronous programming in Node.js
- Promises, async/await, and error handling patterns
- Streams and buffers for handling large data
- Dependency injection and inversion of control
- NestJS decorators and their purposes
- Middleware, guards, interceptors, and pipes in NestJS
- DTO (Data Transfer Object) pattern for validation
- Repository pattern for database abstraction
- JWT token generation and validation
- Password hashing with bcrypt or argon2
- Environment variable management
- Error handling and custom exception filters
- API documentation with Swagger/OpenAPI
- Testing strategies (unit, integration, e2e)

### What You Must Do
- Validate all incoming data using class-validator and DTOs
- Implement proper error handling with custom exceptions
- Use environment variables for all configuration (never hardcode)
- Hash passwords before storing (bcrypt, argon2)
- Implement rate limiting on public endpoints
- Log errors with proper context and stack traces
- Use TypeScript strict mode for type safety
- Implement CORS properly with specific origins
- Sanitize user input to prevent injection attacks
- Use parameterized queries to prevent SQL injection
- Implement request timeouts to prevent hanging requests
- Handle uncaught exceptions and unhandled rejections

### What You Should Do
- Use dependency injection throughout the application
- Implement request validation at the controller level
- Create separate modules for distinct features
- Use guards for authentication and authorization
- Implement pagination for list endpoints
- Use interceptors for response transformation and logging
- Create custom decorators for common patterns
- Implement health check endpoints
- Use pipes for data transformation and validation
- Set up request logging middleware
- Implement graceful shutdown handlers
- Use compression middleware for responses
- Implement API versioning from the start

### What to Avoid
- Blocking the event loop with synchronous operations
- Storing sensitive data in logs
- Using `any` type in TypeScript
- Catching errors without proper handling
- Running database queries in loops (N+1 problem)
- Exposing internal error details to clients
- Missing error handling in async functions
- Using global variables for state
- Implementing business logic in controllers
- Directly accessing request/response in services

### Best Practices
```typescript
// Example: Well-structured NestJS controller with validation
import { 
  Controller, Post, Body, Get, Param, UseGuards, 
  ParseUUIDPipe, HttpCode, HttpStatus 
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('api/v1/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new user' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user by ID' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }
}

// DTO with validation
import { IsEmail, IsString, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'john_doe', minLength: 3, maxLength: 50 })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ example: 'SecurePass123!', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;
}

// Service with proper error handling
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    const user = this.usersRepository.create({
      ...createUserDto,
      password: hashedPassword,
    });
    
    return this.usersRepository.save(user);
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    
    return user;
  }
}
```

---

## 4. Frontend Development (HTML, CSS, JS/TS)

**📺 Recommended Learning:**
- [HTML & CSS Full Course by SuperSimpleDev](https://www.youtube.com/watch?v=G3e-cpL7ofc) - Modern HTML & CSS (6+ hours)
- [JavaScript Full Course by freeCodeCamp](https://www.youtube.com/watch?v=jS4aFq5-91M) - Complete JavaScript tutorial
- [TypeScript Course by freeCodeCamp](https://www.youtube.com/watch?v=30LWjhZzg50) - TypeScript fundamentals
- [CSS Grid & Flexbox by Kevin Powell](https://www.youtube.com/playlist?list=PL4-IK0AVhVjPv5tfS82UF_iQgFp4Bl998) - Modern CSS layouts
- [Web Accessibility by freeCodeCamp](https://www.youtube.com/watch?v=e2nkq3h1P68) - Accessibility best practices

### What to Study
- Semantic HTML5 elements and accessibility (ARIA)
- CSS Box model, Flexbox, and Grid layouts
- CSS custom properties (variables) and calc()
- Responsive design principles and mobile-first approach
- CSS preprocessors (SASS/SCSS) if needed
- Modern JavaScript (ES6+): destructuring, spread, modules
- TypeScript basics: types, interfaces, generics
- DOM manipulation and event handling
- Fetch API and handling HTTP requests
- Local storage and session storage
- Web performance metrics (FCP, LCP, CLS, TTI)
- Browser rendering pipeline and reflows
- Cross-browser compatibility issues

### What You Must Do
- Write semantic HTML with proper heading hierarchy
- Make websites keyboard navigable and screen-reader friendly
- Use HTTPS for all production deployments
- Implement proper form validation (client and server-side)
- Sanitize user-generated content to prevent XSS
- Use alt text for all images
- Implement proper error boundaries and fallbacks
- Test on multiple browsers and devices
- Optimize images (use WebP, lazy loading)
- Minify and bundle assets for production
- Use Content Security Policy headers

### What You Should Do
- Use CSS Grid for complex layouts, Flexbox for simpler ones
- Implement dark mode support with CSS variables
- Use CSS modules or styled-components for scoping
- Leverage browser caching with proper cache headers
- Implement skeleton screens for loading states
- Use web fonts efficiently (font-display: swap)
- Implement responsive images with srcset
- Use intersection observer for lazy loading
- Debounce or throttle expensive operations
- Use semantic versioning for releases

### What to Avoid
- Using tables for layout (use for tabular data only)
- Inline styles except for dynamic values
- Deeply nested CSS selectors (keep specificity low)
- Blocking scripts in the head without defer/async
- Using !important unnecessarily in CSS
- Ignoring accessibility considerations
- Over-relying on JavaScript for basic functionality
- Memory leaks from event listeners not being cleaned up
- Storing sensitive data in localStorage

### Best Practices
```html
<!-- Semantic HTML with accessibility -->
<header role="banner">
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="#home">Home</a></li>
      <li><a href="#about">About</a></li>
    </ul>
  </nav>
</header>

<main role="main">
  <article>
    <h1>Article Title</h1>
    <p>Content here...</p>
  </article>
</main>

<footer role="contentinfo">
  <p>&copy; 2024 Company Name</p>
</footer>
```

```css
/* Modern CSS with custom properties */
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
  --spacing-unit: 8px;
  --border-radius: 4px;
}

.card {
  padding: calc(var(--spacing-unit) * 2);
  border-radius: var(--border-radius);
  background-color: var(--primary-color);
}

/* Mobile-first responsive design */
.container {
  width: 100%;
  padding: 0 16px;
}

@media (min-width: 768px) {
  .container {
    max-width: 720px;
    margin: 0 auto;
  }
}

@media (min-width: 1024px) {
  .container {
    max-width: 960px;
  }
}
```

```typescript
// TypeScript with proper typing
interface User {
  id: string;
  email: string;
  name: string;
}

async function fetchUser(userId: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${userId}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: User = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw error;
  }
}
```

---

## 5. React Development

**📺 Recommended Learning:**
- [React Course by freeCodeCamp](https://www.youtube.com/watch?v=bMknfKXIFA8) - Full React course (12+ hours)
- [React Hooks Course by Codevolution](https://www.youtube.com/playlist?list=PLC3y8-rFHvwisvxhZ135pogtX7_Oe3Q3A) - Complete hooks tutorial
- [React Advanced Patterns by Jack Herrington](https://www.youtube.com/playlist?list=PLNqp92_EXZBJs6rKouX05silon8wVzLtp) - Advanced React patterns
- [React TypeScript by Ben Awad](https://www.youtube.com/watch?v=Z5iWr6Srsj8) - React with TypeScript

### What to Study
- Component lifecycle and React hooks (useState, useEffect, etc.)
- Props vs state and when to use each
- Controlled vs uncontrolled components
- Context API for state management
- React.memo, useMemo, useCallback for optimization
- Error boundaries for error handling
- Custom hooks for reusable logic
- Component composition patterns
- Code splitting and lazy loading
- React DevTools for debugging
- Virtual DOM and reconciliation
- Keys in lists and why they matter

### What You Must Do
- Use functional components with hooks (avoid class components)
- Keep components small and focused on single responsibility
- Lift state up to common ancestors when sharing between components
- Clean up effects with return functions (event listeners, timers)
- Use keys properly in lists (stable, unique identifiers)
- Handle loading and error states in components
- Validate props with TypeScript interfaces or PropTypes
- Implement error boundaries at appropriate levels
- Use React.StrictMode in development
- Avoid mutating state directly (always use setState)

### What You Should Do
- Create custom hooks for reusable stateful logic
- Use Context API for global state (theme, auth, locale)
- Implement code splitting with React.lazy and Suspense
- Memoize expensive computations with useMemo
- Memoize callbacks with useCallback when passing to children
- Use composition over inheritance
- Keep business logic separate from presentation
- Implement proper TypeScript types for props and state
- Use React DevTools Profiler to identify performance issues
- Create a component library for consistent UI

### What to Avoid
- Prop drilling more than 2-3 levels (use Context or state management)
- Calling hooks conditionally or in loops
- Storing derived state (calculate from existing state instead)
- Using indexes as keys in dynamic lists
- Fetching data in render (use useEffect instead)
- Creating new objects/arrays in render without memoization
- Over-using Context (causes unnecessary re-renders)
- Premature optimization with memo/useMemo/useCallback
- Deeply nested component trees

### Best Practices
```typescript
// Example: Well-structured React component
import React, { useState, useEffect, useCallback } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserProfileProps {
  userId: string;
  onUserLoad?: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  userId, 
  onUserLoad 
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`/api/users/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      
      const data = await response.json();
      setUser(data);
      onUserLoad?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [userId, onUserLoad]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="user-profile">
      <h2>{user.name}</h2>
      <p>{user.email}</p>
    </div>
  );
};

// Custom hook for data fetching
function useUser(userId: string) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        
        if (!cancelled) {
          setUser(data);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
          setLoading(false);
        }
      }
    };

    fetchUser();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { user, loading, error };
}
```

---

## 6. Next.js Development

**📺 Recommended Learning:**
- [Next.js 14 Full Course by freeCodeCamp](https://www.youtube.com/watch?v=wm5gMKuwSYk) - Complete Next.js 14 tutorial
- [Next.js App Router Course by Vercel](https://www.youtube.com/watch?v=gSSsZReIFRk) - Official App Router tutorial
- [Next.js 13/14 Crash Course by Traversy Media](https://www.youtube.com/watch?v=Y6KDk5iyrYE) - Quick Next.js overview
- [Next.js Full Stack App by JavaScript Mastery](https://www.youtube.com/watch?v=wm5gMKuwSYk) - Full-stack Next.js project

### What to Study
- Pages router vs App router (choose based on project needs)
- Static generation (SSG) vs Server-side rendering (SSR) vs ISR
- File-based routing and dynamic routes
- API routes for backend functionality
- Image optimization with next/image
- Font optimization with next/font
- Middleware for request interception
- Environment variables in Next.js
- Data fetching methods (getServerSideProps, getStaticProps, fetch)
- Route handlers in App Router
- Server components vs Client components
- Metadata API for SEO

### What You Must Do
- Use next/image for all images (automatic optimization)
- Implement proper meta tags for SEO and social sharing
- Use environment variables for API URLs and keys
- Configure CSP (Content Security Policy) headers
- Implement proper error pages (404, 500)
- Use TypeScript for type safety
- Configure proper redirects and rewrites
- Set up proper caching strategies
- Use next/link for client-side navigation
- Implement loading states and skeletons

### What You Should Do
- Use Static Generation (SSG) when possible for better performance
- Implement Incremental Static Regeneration (ISR) for dynamic content
- Use Server Components by default in App Router
- Mark Client Components explicitly with 'use client'
- Implement route groups for better organization
- Use parallel routes and intercepting routes when appropriate
- Implement proper sitemap.xml and robots.txt
- Use next/font for automatic font optimization
- Implement analytics and monitoring (Vercel Analytics, etc.)
- Use middleware for authentication checks
- Implement proper Open Graph and Twitter Card tags

### What to Avoid
- Fetching data client-side when it can be done server-side
- Using external image hosts without configuration
- Not optimizing images (always use next/image)
- Client-side routing to external URLs (use <a> instead)
- Mixing Pages Router and App Router patterns
- Over-using Server-Side Rendering (impacts performance)
- Not implementing proper loading and error states
- Ignoring bundle size (check with next/bundle-analyzer)

### Best Practices
```typescript
// App Router: Server Component with data fetching
import { notFound } from 'next/navigation';

interface Post {
  id: string;
  title: string;
  content: string;
}

async function getPost(id: string): Promise<Post | null> {
  try {
    const res = await fetch(`https://api.example.com/posts/${id}`, {
      next: { revalidate: 3600 } // ISR: revalidate every hour
    });
    
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    return null;
  }
}

export async function generateMetadata({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  
  if (!post) return { title: 'Post Not Found' };
  
  return {
    title: post.title,
    description: post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160),
      type: 'article',
    },
  };
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id);
  
  if (!post) {
    notFound();
  }
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}

// Client Component for interactivity
'use client';

import { useState } from 'react';

export function LikeButton({ postId }: { postId: string }) {
  const [liked, setLiked] = useState(false);
  
  const handleLike = async () => {
    await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
    setLiked(true);
  };
  
  return (
    <button onClick={handleLike} disabled={liked}>
      {liked ? 'Liked!' : 'Like'}
    </button>
  );
}

// API Route Handler (App Router)
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const post = await fetch(`https://api.example.com/posts/${params.id}`);
    const data = await post.json();
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch post' },
      { status: 500 }
    );
  }
}
```

---

## 7. DevOps: Deployment & CI/CD

**📺 Recommended Learning:**
- [Docker Tutorial for Beginners by TechWorld with Nana](https://www.youtube.com/watch?v=3c-iBn73dDE) - Complete Docker course (3+ hours)
- [Docker Compose Tutorial by freeCodeCamp](https://www.youtube.com/watch?v=HG6yIjZapSA) - Docker Compose in depth
- [GitHub Actions Tutorial by freeCodeCamp](https://www.youtube.com/watch?v=R8_veQiYBjI) - CI/CD with GitHub Actions
- [DevOps for Developers by TechWorld with Nana](https://www.youtube.com/playlist?list=PLy7NrYWoggjwPggqtFsI_zMAwvG0SqYCb) - Complete DevOps playlist
- [Kubernetes Tutorial by TechWorld with Nana](https://www.youtube.com/watch?v=X48VuDVv0do) - Kubernetes fundamentals

### What to Study
- Docker fundamentals: images, containers, volumes, networks
- Docker Compose for multi-container applications
- CI/CD concepts and pipelines
- GitHub Actions or GitLab CI workflows
- Environment management (dev, staging, production)
- Blue-green deployments and canary releases
- Infrastructure as Code (Terraform, CloudFormation)
- Container orchestration basics (Kubernetes, Docker Swarm)
- Cloud platforms (AWS, GCP, Azure basics)
- Reverse proxies (Nginx, Traefik)
- SSL/TLS certificates and HTTPS setup
- Secrets management (environment variables, vaults)

### What You Must Do
- Containerize all applications with Docker
- Use multi-stage builds to minimize image size
- Never commit secrets to version control
- Use environment variables for configuration
- Implement health check endpoints in applications
- Set up automated testing in CI pipeline
- Implement database migration automation
- Use .dockerignore to exclude unnecessary files
- Tag Docker images with version numbers or commit SHAs
- Set up proper logging before deploying
- Implement automated backups for databases
- Use HTTPS in production always

### What You Should Do
- Implement CI/CD pipelines for automated deployment
- Use separate environments for dev, staging, and production
- Implement rolling deployments to minimize downtime
- Set up automatic rollback mechanisms
- Use infrastructure as code for reproducibility
- Implement container health checks
- Use secret management tools (AWS Secrets Manager, HashiCorp Vault)
- Set up monitoring before launching
- Implement rate limiting at the reverse proxy level
- Use CDN for static assets
- Implement automated security scanning in CI

### What to Avoid
- Running containers as root user
- Using latest tag for production images
- Exposing unnecessary ports
- Storing secrets in Docker images
- Deploying directly to production without staging
- Running database migrations manually
- Skipping automated tests in CI
- Using same credentials across environments
- Ignoring container resource limits

### Best Practices
```dockerfile
# Multi-stage Dockerfile for Next.js
FROM node:20-alpine AS base

# Dependencies stage
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

```dockerfile
# NestJS Backend Dockerfile
FROM node:20-alpine AS development

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine AS production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY --from=development /app/dist ./dist

RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001

USER nestjs

EXPOSE 3000

CMD ["node", "dist/main"]
```

```yaml
# docker-compose.yml for development
version: '3.8'

services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: myapp_dev
      POSTGRES_USER: devuser
      POSTGRES_PASSWORD: devpassword
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U devuser"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: development
    ports:
      - "3001:3000"
    environment:
      DATABASE_URL: postgresql://devuser:devpassword@postgres:5432/myapp_dev
      NODE_ENV: development
    volumes:
      - ./backend:/app
      - /app/node_modules
    depends_on:
      postgres:
        condition: service_healthy
    command: npm run start:dev

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: development
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3001
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    command: npm run dev

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

```yaml
# GitHub Actions CI/CD pipeline
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

env:
  NODE_VERSION: '20'

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: testpassword
          POSTGRES_DB: test_db
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: postgresql://postgres:testpassword@localhost:5432/test_db
      
      - name: Run build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2
      
      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: my-app
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
```

---

## 8. Monitoring & Logging

**📺 Recommended Learning:**
- [Application Monitoring Tutorial by freeCodeCamp](https://www.youtube.com/watch?v=Tog09FmFN8g) - Prometheus & Grafana
- [Logging Best Practices by Hussein Nasser](https://www.youtube.com/watch?v=GXDjk7tDFD0) - Production logging strategies
- [Observability Engineering by Honeycomb](https://www.youtube.com/watch?v=x6F4VGFJdA4) - Modern observability practices

### What to Study
- The three pillars of observability: logs, metrics, traces
- Log levels (DEBUG, INFO, WARN, ERROR, FATAL) and when to use each
- Structured logging vs unstructured logging
- APM (Application Performance Monitoring) tools
- Metrics collection (Prometheus, CloudWatch, Datadog)
- Distributed tracing concepts (Jaeger, Zipkin)
- Error tracking (Sentry, Rollbar, Bugsnag)
- Log aggregation (ELK stack, Loki, CloudWatch Logs)
- Alerting strategies and thresholds
- SLIs, SLOs, and SLAs
- Performance monitoring and profiling
- Real User Monitoring (RUM)

### What You Must Do
- Implement structured logging with consistent format (JSON recommended)
- Include correlation IDs to trace requests across services
- Log all errors with sufficient context (stack traces, request data)
- Set up error tracking before production launch
- Monitor application performance metrics (response time, throughput)
- Monitor infrastructure metrics (CPU, memory, disk, network)
- Set up alerts for critical errors and threshold breaches
- Log security-relevant events (authentication, authorization failures)
- Implement health check endpoints for monitoring
- Set up uptime monitoring for production services
- Rotate and archive logs to manage storage costs
- Implement request/response logging for API endpoints

### What You Should Do
- Use centralized logging to aggregate logs from all services
- Implement distributed tracing for microservices architectures
- Set up dashboards for key metrics and business KPIs
- Monitor database query performance and slow queries
- Track error rates and set up alerting thresholds
- Implement custom metrics for business-critical operations
- Use log sampling for high-traffic applications
- Set up anomaly detection for unusual patterns
- Monitor third-party API calls and external dependencies
- Implement user session tracking for debugging
- Create runbooks for common alerts
- Set up on-call rotation and escalation policies

### What to Avoid
- Logging sensitive data (passwords, tokens, PII)
- Over-logging (excessive DEBUG logs in production)
- Under-logging (missing critical error context)
- Ignoring log storage costs and retention policies
- Setting up alerts without clear action items
- Alert fatigue from too many non-critical alerts
- Not testing alerting mechanisms before production
- Logging without proper log levels
- Synchronous logging that blocks application code
- Missing correlation between frontend and backend errors

### Best Practices

```typescript
// Structured logging with Winston (NestJS)
import { Logger } from '@nestjs/common';
import * as winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { 
    service: 'api-service',
    environment: process.env.NODE_ENV 
  },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    }),
  ],
});

// Request logging middleware
export function requestLogger(req, res, next) {
  const correlationId = req.headers['x-correlation-id'] || generateUUID();
  req.correlationId = correlationId;
  
  logger.info('Incoming request', {
    correlationId,
    method: req.method,
    url: req.url,
    userAgent: req.headers['user-agent'],
    ip: req.ip,
  });
  
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('Request completed', {
      correlationId,
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration,
    });
  });
  
  next();
}

// Error logging
try {
  await someOperation();
} catch (error) {
  logger.error('Operation failed', {
    correlationId: req.correlationId,
    error: error.message,
    stack: error.stack,
    context: {
      userId: req.user?.id,
      operation: 'someOperation',
    },
  });
  throw error;
}
```

```typescript
// Custom metrics with Prometheus (NestJS)
import { Counter, Histogram, Registry } from 'prom-client';

const register = new Registry();

const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

const httpRequestTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register],
});

const databaseQueryDuration = new Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table'],
  registers: [register],
});

// Middleware to track metrics
export function metricsMiddleware(req, res, next) {
  const startTime = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - startTime) / 1000;
    const route = req.route?.path || req.path;
    
    httpRequestDuration.observe(
      {
        method: req.method,
        route,
        status_code: res.statusCode,
      },
      duration
    );
    
    httpRequestTotal.inc({
      method: req.method,
      route,
      status_code: res.statusCode,
    });
  });
  
  next();
}

// Expose metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
```

```typescript
// Sentry integration for error tracking
import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new ProfilingIntegration(),
  ],
  tracesSampleRate: 0.1, // Sample 10% of transactions
  profilesSampleRate: 0.1,
});

// Use in error handling
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// Error handler
app.use(Sentry.Handlers.errorHandler());

// Manual error capture with context
Sentry.captureException(error, {
  tags: {
    section: 'payment',
  },
  user: {
    id: user.id,
    email: user.email,
  },
  extra: {
    orderId: order.id,
    amount: order.amount,
  },
});
```

```yaml
# docker-compose with monitoring stack
version: '3.8'

services:
  # Your application services...
  
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml
      - prometheus_data:/prometheus
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--storage.tsdb.path=/prometheus'

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3002:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
      - ./grafana/dashboards:/etc/grafana/provisioning/dashboards
    depends_on:
      - prometheus

  loki:
    image: grafana/loki:latest
    ports:
      - "3100:3100"
    volumes:
      - ./loki-config.yml:/etc/loki/local-config.yaml
      - loki_data:/loki

  promtail:
    image: grafana/promtail:latest
    volumes:
      - /var/log:/var/log
      - ./promtail-config.yml:/etc/promtail/config.yml
    command: -config.file=/etc/promtail/config.yml

volumes:
  prometheus_data:
  grafana_data:
  loki_data:
```

---

## Quick Reference Checklist

### Before Starting Development
- [ ] Design system architecture and create diagrams
- [ ] Design database schema with proper normalization
- [ ] Define API contracts and endpoints
- [ ] Set up version control repository
- [ ] Configure development environment
- [ ] Set up linting and code formatting rules
- [ ] Plan authentication and authorization strategy

### During Development
- [ ] Write tests alongside feature development
- [ ] Document code with clear comments
- [ ] Follow consistent naming conventions
- [ ] Implement proper error handling
- [ ] Validate all user inputs
- [ ] Use environment variables for configuration
- [ ] Commit code frequently with meaningful messages
- [ ] Review code before merging to main branch

### Before Deployment
- [ ] Run all tests and ensure they pass
- [ ] Perform security audit and vulnerability scanning
- [ ] Optimize database queries and add indexes
- [ ] Set up monitoring and logging
- [ ] Configure production environment variables
- [ ] Set up automated backups
- [ ] Create deployment documentation
- [ ] Test deployment in staging environment
- [ ] Prepare rollback plan

### After Deployment
- [ ] Monitor application performance and errors
- [ ] Set up alerts for critical issues
- [ ] Monitor resource usage (CPU, memory, disk)
- [ ] Check logs for errors and warnings
- [ ] Verify all features work as expected
- [ ] Monitor user feedback and bug reports
- [ ] Plan for scaling based on traffic patterns
- [ ] Regular security updates and patches

---

## Additional Resources

### Documentation
- [MDN Web Docs](https://developer.mozilla.org/) - HTML, CSS, JavaScript reference
- [React Documentation](https://react.dev/) - Official React docs
- [Next.js Documentation](https://nextjs.org/docs) - Official Next.js docs
- [NestJS Documentation](https://docs.nestjs.com/) - Official NestJS docs
- [PostgreSQL Documentation](https://www.postgresql.org/docs/) - Official PostgreSQL docs
- [Docker Documentation](https://docs.docker.com/) - Official Docker docs
- [TypeScript Handbook](https://www.typescriptlang.org/docs/) - Official TypeScript docs

### Community & Learning
- [Stack Overflow](https://stackoverflow.com/) - Q&A for developers
- [GitHub](https://github.com/) - Code hosting and collaboration
- [Dev.to](https://dev.to/) - Developer community and articles
- [freeCodeCamp](https://www.freecodecamp.org/) - Free coding curriculum
- [Frontend Mentor](https://www.frontendmentor.io/) - Frontend challenges
- [LeetCode](https://leetcode.com/) - Algorithm practice

### Tools & Utilities
- [Can I Use](https://caniuse.com/) - Browser compatibility tables
- [Regex101](https://regex101.com/) - Regular expression testing
- [JSON Formatter](https://jsonformatter.org/) - JSON validation and formatting
- [SQL Fiddle](http://sqlfiddle.com/) - SQL query testing
- [Postman](https://www.postman.com/) - API testing and documentation
- [draw.io](https://draw.io/) - Diagram creation tool

---

**Remember:** This guide represents best practices and recommendations. Always adapt these principles to your specific project requirements, team size, and constraints. Technology choices should serve your goals, not dictate them.