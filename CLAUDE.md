# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Patient Post-Visit Medical Assistant** application consisting of:
- **Backend**: Express.js + TypeScript + PostgreSQL (port 3001)
- **Frontend**: Next.js + React + Tailwind CSS (port 3000)

The application allows patients to access their medical visit information through unique tokens and ask an AI assistant (Claude) questions about their diagnosis, medications, and care instructions.

## Architecture

### Backend Structure (`postvisit/backend/src/`)

- **`server.ts`**: Express app setup with CORS middleware, route registration, and health check endpoint
- **`config/database.ts`**: PostgreSQL connection pool using `pg` library
- **`config/schema.sql`**: Database schema with `visits` and `chat_messages` tables
- **`models/Visit.ts`**: Visit CRUD operations (create, fetch by token, fetch multiple for chat context)
- **`models/ChatMessage.ts`**: Chat message storage and retrieval
- **`routes/visit.ts`**: GET `/api/visit/:token` endpoint - retrieves visit data
- **`routes/chat.ts`**: POST `/api/chat` endpoint - handles chat messages, validates tokens, calls Claude API
- **`services/auth.ts`**: Token validation and extraction logic
- **`services/llm.ts`**: Claude API integration with `buildChatContext()`, `callClaude()`, and `extractSources()` functions
- **`types/index.ts`**: TypeScript interfaces (Visit, Medication, ChatMessage, etc.)
- **`middleware/errorHandler.ts`**: Global error handling and 404 responses

### Frontend Structure (`postvisit/frontend/src/`)

- **`pages/`**: Next.js pages
  - `index.tsx`: Homepage with landing page and link to demo visit
  - `visit/[token].tsx`: Dynamic route for visit pages - loads visit data and renders wizard
  - `404.tsx`: Custom 404 page
  - `_app.tsx`: Next.js app wrapper with VisitProvider

- **`components/`**: React components
  - **`VisitWizard/`**: Multi-step wizard for displaying visit information
    - `WizardLayout.tsx`: Main layout with step navigation
    - `StepDiagnosis.tsx`: Displays diagnosis and findings (step 1)
    - `StepMedication.tsx`: Displays medications (step 2)
    - `StepInstructions.tsx`: Displays care instructions (step 3)
    - `StepChat.tsx`: Chat interface (step 4)
  - **`ChatInterface/`**: Chat components
    - `ChatHistory.tsx`: Displays chat message history
    - `ChatInput.tsx`: Message input form
    - `ChatMessage.tsx`: Individual message display

- **`context/VisitContext.tsx`**: React Context for global state (visit data, chat messages, loading states)

- **`lib/api.ts`**: API client - `ApiClient` class with methods to fetch visits and send chat messages

- **`types/index.ts`**: TypeScript interfaces (mirrors backend types)

- **`styles/globals.css`**: Global styles

### Data Flow

1. User accesses `/visit/[token]` → Dynamic page component fetches visit data from backend via token
2. Visit data loaded into `VisitContext` and displayed through wizard steps
3. User navigates through steps (Diagnosis → Medications → Instructions → Chat)
4. On step 4, user can send messages → Frontend calls `/api/chat` endpoint with visitId, token, and message
5. Backend validates token, fetches visit + chat history, calls Claude API with context
6. Claude returns response → Backend persists message to DB and returns to frontend
7. Frontend displays assistant response in chat history

### Database Schema

- **`visits` table**: Stores visit records with patient info, diagnosis, medications (JSONB), and instructions
- **`chat_messages` table**: Stores chat history with role (user/assistant) and timestamps
- Indexes on `token`, `visit_id`, and `created_at` for query performance

## Common Development Commands

### Backend (`postvisit/backend/`)

```bash
# Install dependencies
npm install

# Development with auto-reload
npm run dev

# Build TypeScript
npm run build

# Start built application
npm start

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run specific test suite
npm test -- tests/unit/models.test.ts
npm test -- tests/integration/chat.test.ts
```

### Frontend (`postvisit/frontend/`)

```bash
# Install dependencies
npm install

# Development server with hot reload
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Running the Full Stack

```bash
# Terminal 1: Backend
cd postvisit/backend
npm run dev

# Terminal 2: Frontend
cd postvisit/frontend
npm run dev

# Access at http://localhost:3000
```

## Testing

### Backend Tests

Located in `postvisit/backend/tests/`:

- **Unit Tests** (`tests/unit/`):
  - `models.test.ts`: Visit model CRUD operations
  - `auth.test.ts`: Token validation
  - `llm.test.ts`: Context building and source extraction

- **Integration Tests** (`tests/integration/`):
  - `visit.test.ts`: GET `/api/visit/:token` endpoint with valid/invalid tokens
  - `chat.test.ts`: POST `/api/chat` endpoint with message persistence

### Frontend Testing

Manual testing documented in `postvisit/frontend/TESTING.md`. Key areas:
- Homepage and wizard navigation
- Chat interface interaction
- Error handling with invalid tokens
- Mobile responsiveness (375px, 768px, 1920px)
- Accessibility and performance

## Environment Variables

### Backend (`.env`)
- `DATABASE_URL`: PostgreSQL connection string
- `PORT`: Server port (defaults to 3001)
- `NODE_ENV`: "development", "test", or "production"
- `CLAUDE_API_KEY`: Anthropic API key for Claude

### Frontend (`.env.local`)
- `NEXT_PUBLIC_API_URL`: Backend API URL (for API calls from frontend)

## Key Implementation Details

### Path Aliases
- **Frontend**: `@PostVisit/*` → `./src/*` (defined in `tsconfig.json`)
- **Backend**: Uses standard imports

### TypeScript Configuration
- **Backend**: Targets ES2020, outputs to `dist/`, strict mode enabled
- **Frontend**: Targets ES5 with bundler module resolution (Next.js)

### API Response Format
All API responses follow this structure:
```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
```

### Chat Context Building
The `buildChatContext()` function in `services/llm.ts` constructs a detailed context string including:
- Patient info and visit date
- Diagnosis, symptoms, and findings
- Medications with dosage and frequency
- Care instructions and follow-up date
- Doctor's notes
- Conversation history

This context is passed to Claude with a system prompt emphasizing:
- Reference only visit data provided
- Use simple language
- Don't provide new diagnoses
- Cite visit sections in responses

### Token Validation
Tokens are 32-character strings generated from UUIDs. Every chat message request must include a valid token that matches the visit's token in the database.

## Testing Database with curl

```bash
# Create visit
curl -X POST http://localhost:3001/api/visit \
  -H "Content-Type: application/json" \
  -d '{...visit data...}'

# Fetch visit
curl http://localhost:3001/api/visit/{token}

# Send chat message
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"visitId": "{id}", "token": "{token}", "message": "..."}'
```

## Notes for Future Development

- Frontend uses Next.js dynamic routing with `[token]` parameter - ensure token validation happens in both backend and frontend
- Chat messages are persisted to the database for audit/history purposes
- The wizard is 4 steps total; adding new steps requires updating `StepChat.tsx` and `WizardLayout.tsx`
- Claude API calls are synchronous and include the full visit context to maintain quality responses
- CORS is currently open (`*`) - consider restricting to specific origins in production
