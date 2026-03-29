export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface Visit {
  id: string;
  patientName: string;
  visitDate: string;
  diagnosis: string;
  symptoms: string[];
  findings: string;
  medications: Medication[];
  instructions: string;
  followUpDate?: string;
  doctorName: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}
