# PostVisit - Patient Medical Assistant Chatbot

A full-stack web application that helps patients understand their medical visit information through an AI-powered chatbot.

## Overview

PostVisit provides patients with secure token-based access to their medical visit information and enables them to ask questions about their diagnosis, medications, and care instructions. The application uses Claude AI to provide clear, patient-friendly explanations.

**Key Features:**
- Secure token-based access to visit data
- AI-powered chat assistant for medical questions
- Responsive design for desktop, tablet, and mobile
- Multi-step wizard for organizing visit information
- Persistent chat history and message storage
- Built for healthcare providers (Puskesmas)

## Tech Stack

### Backend
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with connection pooling
- **LLM Integration**: Claude API (Anthropic)
- **Testing**: Jest with unit and integration tests
- **Port**: 3001

### Frontend
- **Framework**: Next.js 14 with React 18
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **TypeScript**: Full type safety
- **Port**: 3000

## Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+
- Claude API key from Anthropic

### Installation

```bash
# Clone repository
git clone https://github.com/DarrelBumika/PostVisit.git
cd PostVisit

# Backend setup
cd postvisit/backend
npm install
cp .env.example .env
# Edit .env with your DATABASE_URL and CLAUDE_API_KEY

# Frontend setup
cd ../frontend
npm install
cp .env.example .env.local
```

### Running the Application

**Terminal 1: Backend**
```bash
cd postvisit/backend
npm run dev
# Server runs on http://localhost:3001
```

**Terminal 2: Frontend**
```bash
cd postvisit/frontend
npm run dev
# Application runs on http://localhost:3000
```

Access the application at **http://localhost:3000**

## Project Structure

```
postvisit/
├── backend/
│   ├── src/
│   │   ├── config/           # Database configuration and schema
│   │   ├── models/           # Visit and ChatMessage models
│   │   ├── routes/           # API endpoints (visit, chat)
│   │   ├── services/         # Business logic (auth, llm)
│   │   ├── middleware/       # Express middleware
│   │   ├── types/            # TypeScript interfaces
│   │   └── server.ts         # Express app setup
│   ├── tests/
│   │   ├── unit/             # Unit tests
│   │   └── integration/      # Integration tests
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.js
│
└── frontend/
    ├── src/
    │   ├── pages/            # Next.js pages
    │   ├── components/       # React components
    │   │   ├── ChatInterface/
    │   │   └── VisitWizard/
    │   ├── context/          # React Context
    │   ├── lib/              # API client and utilities
    │   ├── types/            # TypeScript interfaces
    │   └── styles/           # CSS
    ├── package.json
    └── tsconfig.json
```

## API Endpoints

### Visit Endpoints
- **GET** `/api/visit/:token` - Retrieve visit data by token
  - Response: Visit object with patient information

### Chat Endpoints
- **POST** `/api/chat` - Send a chat message
  - Request: `{ visitId, token, message }`
  - Response: `{ messageId, content, sources, createdAt }`

## Database Schema

### visits table
- `id` (UUID) - Primary key
- `token` (VARCHAR) - Unique patient access token
- `patient_name` (VARCHAR) - Patient name
- `visit_date` (TIMESTAMP) - Date of visit
- `diagnosis` (TEXT) - Medical diagnosis
- `symptoms` (TEXT[]) - Array of symptoms
- `findings` (TEXT) - Clinical findings
- `medications` (JSONB) - Medications with dosage/frequency
- `instructions` (TEXT) - Care instructions
- `follow_up_date` (TIMESTAMP) - Follow-up appointment date
- `doctor_name` (VARCHAR) - Doctor name
- `notes` (TEXT) - Additional doctor notes
- `created_at` (TIMESTAMP) - Record creation time

### chat_messages table
- `id` (UUID) - Primary key
- `visit_id` (UUID) - Foreign key to visits
- `role` (VARCHAR) - 'user' or 'assistant'
- `content` (TEXT) - Message content
- `created_at` (TIMESTAMP) - Message creation time

## Testing

### Backend Tests
```bash
cd postvisit/backend
npm test                      # Run all tests
npm run test:watch            # Watch mode
npm test -- tests/unit        # Unit tests only
npm test -- tests/integration # Integration tests only
```

### Frontend Testing
Manual testing procedures documented in `postvisit/frontend/TESTING.md`

## Security

- Token-based access control for visit data
- Input validation and sanitization
- CORS enabled for API access
- Environment variable protection
- Chat context limited to authorized visits only

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/postvisit
PORT=3001
NODE_ENV=development
CLAUDE_API_KEY=your-api-key-here
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Documentation

- **[SETUP.md](./SETUP.md)** - Detailed setup and installation guide
- **[CLAUDE.md](./CLAUDE.md)** - Development guide with architecture details
- **[postvisit/backend/TESTING.md](./postvisit/backend/TESTING.md)** - Backend testing guide
- **[postvisit/frontend/TESTING.md](./postvisit/frontend/TESTING.md)** - Frontend testing guide

## Common Commands

### Backend
```bash
npm run dev          # Development server with auto-reload
npm run build        # Build TypeScript
npm start            # Start production build
npm test             # Run tests
npm run test:watch   # Tests in watch mode
```

### Frontend
```bash
npm run dev          # Development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
```

## Troubleshooting

**Database connection error:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database exists: `psql -l`

**Backend not starting:**
- Check Node.js version: `node -v` (needs 18+)
- Check port 3001 is not in use
- Review backend logs for errors

**Frontend connection errors:**
- Ensure backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Clear browser cache and restart frontend

**Claude API errors:**
- Verify `CLAUDE_API_KEY` is correct
- Check API usage at https://console.anthropic.com
- Ensure API key has appropriate permissions

## Git Workflow

This project uses feature branch development. When working on features:

```bash
# Create feature branch
git checkout -b feature/<feature-name>

# Make changes and commit
git add .
git commit -m "feat: Description of changes"

# Push to remote
git push -u origin feature/<feature-name>

# Create pull request on GitHub
```

## Build and Deployment

### Backend
```bash
cd postvisit/backend
npm run build
npm start
```

### Frontend
```bash
cd postvisit/frontend
npm run build
npm start
```

## Contributing

1. Create a feature branch from main
2. Make your changes with clear commit messages
3. Push to remote and create a pull request
4. Get reviewed and merge to main

## License

[Add license information]

## Status

Active Development

## Support

For issues, questions, or feedback, please open an issue on GitHub.

---

**Repository**: https://github.com/DarrelBumika/PostVisit
