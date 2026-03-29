# PostVisit - Patient Medical Assistant Chatbot Setup Guide

## Prerequisites

- Node.js 18+ and npm
- PostgreSQL 12+
- Claude API key from Anthropic

## Project Structure

```
postvisit/
├── backend/          # Express + TypeScript + PostgreSQL (port 3001)
├── frontend/         # Next.js + React + Tailwind (port 3000)
└── ...
```

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd postvisit/backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and fill in:
   - `DATABASE_URL=postgresql://user:password@localhost:5432/postvisit`
   - `PORT=3001`
   - `NODE_ENV=development`
   - `CLAUDE_API_KEY=your-api-key-here`

4. **Set up database:**
   ```bash
   psql -U postgres -d postgres -f src/config/schema.sql
   ```
   Or create the database first:
   ```bash
   createdb postvisit
   psql -U postgres -d postvisit -f src/config/schema.sql
   ```

5. **Run tests:**
   ```bash
   npm test              # Run all tests
   npm run test:watch    # Run tests in watch mode
   ```

6. **Start development server:**
   ```bash
   npm run dev
   ```
   Backend will run on http://localhost:3001

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd postvisit/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` if needed:
   - `NEXT_PUBLIC_API_URL=http://localhost:3001` (defaults to this)

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on http://localhost:3000

## Running Full Stack

**Terminal 1: Backend**
```bash
cd postvisit/backend
npm run dev
```

**Terminal 2: Frontend**
```bash
cd postvisit/frontend
npm run dev
```

Then open http://localhost:3000 in your browser.

## Access the Application

1. Open http://localhost:3000 in your browser
2. Click "View Sample Visit" to see a demo
3. Or create a test visit via backend API (see below)
4. Use the generated token to access the chatbot

## API Examples

### Create a Test Visit

```bash
curl -X POST http://localhost:3001/api/visit \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "John Doe",
    "visitDate": "2024-01-15",
    "diagnosis": "Hypertension",
    "symptoms": ["headache", "dizziness"],
    "findings": "BP 150/95",
    "medications": [{"name": "Amlodipine", "dosage": "5mg", "frequency": "daily", "duration": "30 days"}],
    "instructions": "Reduce salt intake and exercise regularly",
    "doctorName": "Dr. Smith"
  }'
```

Response will include a `token` - use this to access the visit.

### Fetch Visit Data

```bash
curl http://localhost:3001/api/visit/{token}
```

### Send Chat Message

```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "visitId": "{visitId}",
    "token": "{token}",
    "message": "What should I do about my high blood pressure?"
  }'
```

## Troubleshooting

**Database connection error:**
- Ensure PostgreSQL is running
- Check DATABASE_URL in `.env`
- Verify database exists: `psql -l`

**Backend not starting:**
- Check Node.js version: `node -v` (needs 18+)
- Check port 3001 is not in use: `netstat -an | grep 3001`
- Review backend logs for errors

**Frontend connection errors:**
- Ensure backend is running on port 3001
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Clear browser cache and restart frontend

**Claude API errors:**
- Verify `CLAUDE_API_KEY` is correct and not expired
- Check API usage at https://console.anthropic.com
- Ensure API key has appropriate permissions

**CORS errors:**
- Backend has CORS enabled for all origins by default
- Check both frontend and backend are running
- Verify correct API URL in frontend .env
