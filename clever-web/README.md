### Clever Web Images, by Jake Simon

A professional, responsive Next.js app that authenticates a user, fetches a list of photos from an API,
caches results for fast reloads, and lets users “like” photos with cached ratings.
Includes a lightweight toast notification system and basic Jest tests.

### .env.local

- created an env file and removed from gitignore for project

### Features:

- Authentication flow
- Login page with form validation
- Redirects to /dashboard on successful sign-in
- Guards dashboard route and redirects to /login when not signed in
- Sign out support
- Photo dashboard
- Fetches photos from an API endpoint
- Skeleton loading UI while data loads
- Displays photographer, description, dominant color, and portfolio link
- Like toggle per photo
- Client-side caching
- Photos are cached in localStorage for faster reloads
- Ratings cached in localStorage

### Toasts:

- Custom toast provider

Used for:

- login success/error
- liking/unliking actions
- sign out

### Responsive UI:

- Layout tuned for desktop + mobile spacing requirements

### Tests:

Jest + Testing Library tests for:

- photo caching/ratings utilities
- toast display

### Tech Stack:

- Next.js
- React
- TypeScript
- CSS Modules
- Jest

### Getting Started

1. Install dependencies
   npm install

2. Run the dev server
   npm run dev

App should be available at:

http://localhost:3000

### ---------------------------------------

### ---------------------------------------

### Ways that I can improve and take this to a full production-ready platform:

1. Authentication + Security

- What to improve

Move from client-side signed in checks to server-verified auth like firebase for example.

Use JWT instead of localStorage tokens.

Add middleware route protection for /dashboard so it never renders for unauthenticated users.

- This Matters because:

Prevents flash of protected content

Reduces attack surface

2. Data Fetching + Caching

- What to improve

Add pagination (cursor-based) to avoid pulling huge lists

Add “Refresh” and smarter cache invalidation

- Why it matters

When photos becomes 10k+ records, you don’t want to render/fetch everything

Reduces load and improves UX

3. Observability

- What to add

Error tracking: Sentry

Logging: structured logs on server/API routes

Basic analytics: page views, sign-in success/failure, API latency

4. UI poloshing that makes it look legit

5. Performance Improvments

6. A Db to record the likes on photos and record user login info
