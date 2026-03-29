import { createVisit, getVisitByToken, getAllVisitsForChat } from '../../src/models/Visit';
import { createChatMessage, getChatHistory } from '../../src/models/ChatMessage';
import { validateToken } from '../../src/services/auth';
import { Medication } from '../../src/types';

// Shared fixtures to reduce duplication
const mockMedications: Medication[] = [
  {
    name: 'Paracetamol',
    dosage: '500mg',
    frequency: '3x daily',
    duration: '7 days',
    instructions: 'After meals',
  },
];

const mockVisit = {
  patientName: 'John Doe',
  visitDate: new Date('2024-01-15'),
  diagnosis: 'Common cold',
  symptoms: ['cough', 'fever'],
  findings: 'Clear lungs, normal temp 38.5C',
  medications: mockMedications,
  instructions: 'Rest and stay hydrated',
  doctorName: 'Dr. Smith',
  notes: 'Follow up if symptoms persist',
};

describe('Visit Model', () => {
  test('createVisit should return a visit with token', async () => {
    const visit = await createVisit(mockVisit);
    expect(visit.id).toBeDefined();
    expect(visit.token).toBeDefined();
    expect(visit.patientName).toBe(mockVisit.patientName);
  });

  test('getVisitByToken should return visit data', async () => {
    const created = await createVisit(mockVisit);
    const retrieved = await getVisitByToken(created.token);
    expect(retrieved).toBeDefined();
    expect(retrieved!.patientName).toBe(mockVisit.patientName);
  });

  test('getVisitByToken should return null for invalid token', async () => {
    const result = await getVisitByToken('invalid-token-12345');
    expect(result).toBeNull();
  });

  test('getAllVisitsForChat should return multiple visits', async () => {
    const visit1 = await createVisit(mockVisit);
    const visit2 = await createVisit({
      ...mockVisit,
      patientName: 'Jane Doe',
      visitDate: new Date('2024-01-10'),
    });
    const visits = await getAllVisitsForChat([visit1.id, visit2.id]);
    expect(visits).toHaveLength(2);
  });
});

describe('ChatMessage Model', () => {
  test('createChatMessage should store user and assistant messages', async () => {
    const visit = await createVisit(mockVisit);

    const userMsg = await createChatMessage(visit.id, 'user', 'What should I do?');
    expect(userMsg.role).toBe('user');
    expect(userMsg.content).toBe('What should I do?');

    const assistantMsg = await createChatMessage(visit.id, 'assistant', 'Rest and drink water');
    expect(assistantMsg.role).toBe('assistant');
  });

  test('getChatHistory should return messages in order', async () => {
    const visit = await createVisit(mockVisit);
    await createChatMessage(visit.id, 'user', 'Message 1');
    await createChatMessage(visit.id, 'assistant', 'Response 1');
    await createChatMessage(visit.id, 'user', 'Message 2');

    const history = await getChatHistory(visit.id);
    expect(history).toHaveLength(3);
    expect(history[0].content).toBe('Message 1');
    expect(history[1].content).toBe('Response 1');
  });
});

describe('Auth Service', () => {
  test('validateToken should return visit for valid token', async () => {
    const visit = await createVisit(mockVisit);
    const result = await validateToken(visit.token);
    expect(result).toBeDefined();
    expect(result!.id).toBe(visit.id);
  });

  test('validateToken should return null for invalid token', async () => {
    const result = await validateToken('invalid-token-xyz');
    expect(result).toBeNull();
  });
});
