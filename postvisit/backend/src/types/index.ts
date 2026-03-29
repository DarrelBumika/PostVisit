export interface Visit {
  id: string;
  token: string;
  patientName: string;
  visitDate: Date;
  diagnosis: string;
  symptoms: string[];
  findings: string;
  medications: Medication[];
  instructions: string;
  followUpDate?: Date;
  doctorName: string;
  notes?: string;
  createdAt: Date;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

export interface ChatMessage {
  id: string;
  visitId: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface ChatRequest {
  visitId: string;
  token: string;
  message: string;
}

export interface ChatResponse {
  messageId: string;
  content: string;
  sources: string[];
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
}
