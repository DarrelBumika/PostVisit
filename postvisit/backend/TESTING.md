# Backend Testing Guide

## Run All Tests
```bash
npm test
```

## Run Specific Test Suite
```bash
npm test -- tests/unit/models.test.ts
npm test -- tests/integration/visit.test.ts
npm test -- tests/integration/chat.test.ts
```

## Run Tests in Watch Mode
```bash
npm run test:watch
```

## Test Coverage

### Unit Tests
- **Visit Model** (`tests/unit/models.test.ts`)
  - Create visit
  - Get visit by token
  - Get visits for chat context

- **Auth Service** (`tests/unit/auth.test.ts`)
  - Token validation
  - Token extraction

- **LLM Service** (`tests/unit/llm.test.ts`)
  - Context building
  - Source extraction

### Integration Tests
- **Visit API** (`tests/integration/visit.test.ts`)
  - GET /api/visit/:token endpoint
  - Valid and invalid tokens

- **Chat API** (`tests/integration/chat.test.ts`)
  - POST /api/chat endpoint
  - Message persistence
  - Token validation

## Manual Testing

### 1. Create a Visit
```bash
curl -X POST http://localhost:3001/api/visit \
  -H "Content-Type: application/json" \
  -d '{
    "patientName": "Test Patient",
    "visitDate": "2024-01-20",
    "diagnosis": "Hypertension",
    "symptoms": ["headache"],
    "findings": "BP 150/95",
    "medications": [{"name": "Amlodipine", "dosage": "5mg", "frequency": "daily", "duration": "30 days"}],
    "instructions": "Reduce salt intake",
    "doctorName": "Dr. Test"
  }'
```

### 2. Fetch Visit Data
```bash
# Use token from create response
curl http://localhost:3001/api/visit/{token}
```

### 3. Send Chat Message
```bash
curl -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "visitId": "{visitId}",
    "token": "{token}",
    "message": "What should I do about my high blood pressure?"
  }'
```
