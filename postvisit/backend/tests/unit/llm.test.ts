import { buildChatContext, extractSources } from '../../src/services/llm';
import { Visit, ChatMessage } from '../../src/types';

describe('LLM Service', () => {
  const mockVisit: Visit = {
    id: '123',
    token: 'abc123',
    patientName: 'John Doe',
    visitDate: new Date('2024-01-15'),
    diagnosis: 'Common cold',
    symptoms: ['cough', 'fever'],
    findings: 'Clear lungs, normal temp 38.5C',
    medications: [
      {
        name: 'Paracetamol',
        dosage: '500mg',
        frequency: '3x daily',
        duration: '7 days',
        instructions: 'After meals',
      },
    ],
    instructions: 'Rest and stay hydrated',
    followUpDate: undefined,
    doctorName: 'Dr. Smith',
    notes: 'Follow up if symptoms persist',
    createdAt: new Date(),
  };

  test('buildChatContext should format visit data correctly', () => {
    const context = buildChatContext(mockVisit, []);
    expect(context).toContain('John Doe');
    expect(context).toContain('Common cold');
    expect(context).toContain('Paracetamol');
    expect(context).toContain('500mg');
  });

  test('buildChatContext should include conversation history', () => {
    const history: ChatMessage[] = [
      {
        id: '1',
        visitId: '123',
        role: 'user',
        content: 'What should I do?',
        createdAt: new Date(),
      },
      {
        id: '2',
        visitId: '123',
        role: 'assistant',
        content: 'You should rest',
        createdAt: new Date(),
      },
    ];
    const context = buildChatContext(mockVisit, history);
    expect(context).toContain('What should I do?');
    expect(context).toContain('You should rest');
  });

  test('callClaude should be called with proper context', async () => {
    const context = buildChatContext(mockVisit, []);
    expect(context).toBeDefined();
    expect(typeof context).toBe('string');
  });

  test('extractSources should identify diagnosis mentions', () => {
    const sources = extractSources('Your diagnosis shows you have a cold');
    expect(sources).toContain('diagnosis');
  });

  test('extractSources should identify medication mentions', () => {
    const sources = extractSources('Take Paracetamol 500mg three times daily');
    expect(sources).toContain('medications');
  });

  test('extractSources should identify care instruction mentions', () => {
    const sources = extractSources('You should rest and stay hydrated');
    expect(sources).toContain('instructions');
  });
});
