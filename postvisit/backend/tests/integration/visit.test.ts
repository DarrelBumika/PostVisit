import request from 'supertest';
import { app } from '../../src/server';
import { createVisit } from '../../src/models/Visit';

describe('Visit API Endpoint', () => {
  const mockVisit = {
    patientName: 'Jane Smith',
    visitDate: new Date('2024-01-20'),
    diagnosis: 'Hypertension',
    symptoms: ['headache', 'dizziness'],
    findings: 'BP 150/95',
    medications: [
      {
        name: 'Amlodipine',
        dosage: '5mg',
        frequency: 'Once daily',
        duration: '30 days',
        instructions: 'Take in morning',
      },
    ],
    instructions: 'Reduce salt intake, exercise regularly',
    doctorName: 'Dr. Johnson',
    notes: 'Check BP weekly',
  };

  test('GET /api/visit/:token should return visit data for valid token', async () => {
    const visit = await createVisit(mockVisit);

    const response = await request(app).get(`/api/visit/${visit.token}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.patientName).toBe(mockVisit.patientName);
    expect(response.body.data.diagnosis).toBe(mockVisit.diagnosis);
  });

  test('GET /api/visit/:token should return 404 for invalid token', async () => {
    const response = await request(app).get('/api/visit/invalid-token-xyz');

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  test('GET /api/visit/:token should return 400 if token is missing', async () => {
    const response = await request(app).get('/api/visit/');

    expect(response.status).toBeGreaterThanOrEqual(400);
  });
});
