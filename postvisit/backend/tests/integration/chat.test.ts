import request from 'supertest';
import { app } from '../../src/server';
import { createVisit } from '../../src/models/Visit';
import { getChatHistory } from '../../src/models/ChatMessage';

describe('Chat API Endpoint', () => {
  const mockVisit = {
    patientName: 'Alice Brown',
    visitDate: new Date('2024-01-25'),
    diagnosis: 'Diabetes Type 2',
    symptoms: ['fatigue', 'thirst'],
    findings: 'Blood sugar 180 mg/dL',
    medications: [
      {
        name: 'Metformin',
        dosage: '1000mg',
        frequency: '2x daily',
        duration: 'Long-term',
        instructions: 'With meals',
      },
    ],
    instructions: 'Monitor blood sugar, eat low glycemic foods',
    doctorName: 'Dr. Lee',
    notes: 'Recheck in 3 months',
  };

  test('POST /api/chat should return assistant response for valid token', async () => {
    const visit = await createVisit(mockVisit);

    const response = await request(app).post('/api/chat').send({
      visitId: visit.id,
      token: visit.token,
      message: 'What should I eat?',
    });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.messageId).toBeDefined();
    expect(response.body.data.content).toBeDefined();
    expect(response.body.data.sources).toBeDefined();
  });

  test('POST /api/chat should reject invalid token', async () => {
    const response = await request(app).post('/api/chat').send({
      visitId: 'some-id',
      token: 'invalid-token',
      message: 'What should I eat?',
    });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test('POST /api/chat should store messages in database', async () => {
    const visit = await createVisit(mockVisit);

    const response1 = await request(app).post('/api/chat').send({
      visitId: visit.id,
      token: visit.token,
      message: 'What is my diagnosis?',
    });

    expect(response1.status).toBe(200);

    // Verify user message was stored in database
    let chatHistory = await getChatHistory(visit.id);
    expect(chatHistory.length).toBeGreaterThanOrEqual(1);
    expect(chatHistory[chatHistory.length - 2]?.content).toBe('What is my diagnosis?');
    expect(chatHistory[chatHistory.length - 2]?.role).toBe('user');
    expect(chatHistory[chatHistory.length - 1]?.role).toBe('assistant');

    // Second request should have context from first
    const response2 = await request(app).post('/api/chat').send({
      visitId: visit.id,
      token: visit.token,
      message: 'What should I do about it?',
    });

    expect(response2.status).toBe(200);
    expect(response2.body.data.content).toBeDefined();

    // Verify both messages are persisted in database
    chatHistory = await getChatHistory(visit.id);
    expect(chatHistory.length).toBeGreaterThanOrEqual(4);
    const messages = chatHistory.map(m => m.content);
    expect(messages).toContain('What is my diagnosis?');
    expect(messages).toContain('What should I do about it?');
  });
});
