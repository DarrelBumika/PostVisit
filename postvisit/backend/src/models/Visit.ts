import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/database';
import { Visit, Medication } from '../types';

/**
 * Create a new visit record with a unique token
 */
export async function createVisit(visitData: Omit<Visit, 'id' | 'token' | 'createdAt'>): Promise<Visit> {
  const token = generateUniqueToken();
  const medicationsJson = JSON.stringify(visitData.medications);

  const result = await query(
    `INSERT INTO visits (
      token, patient_name, visit_date, diagnosis, symptoms, findings,
      medications, instructions, follow_up_date, doctor_name, notes
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING id, token, patient_name, visit_date, diagnosis, symptoms, findings,
              medications, instructions, follow_up_date, doctor_name, notes, created_at`,
    [
      token,
      visitData.patientName,
      visitData.visitDate,
      visitData.diagnosis,
      visitData.symptoms || [],
      visitData.findings,
      medicationsJson,
      visitData.instructions,
      visitData.followUpDate || null,
      visitData.doctorName,
      visitData.notes || null,
    ]
  );

  return parseVisitRow(result.rows[0]);
}

/**
 * Retrieve a visit by its unique token
 */
export async function getVisitByToken(token: string): Promise<Visit | null> {
  const result = await query(
    `SELECT id, token, patient_name, visit_date, diagnosis, symptoms, findings,
            medications, instructions, follow_up_date, doctor_name, notes, created_at
     FROM visits WHERE token = $1`,
    [token]
  );

  if (result.rows.length === 0) {
    return null;
  }

  return parseVisitRow(result.rows[0]);
}

/**
 * Retrieve multiple visits by their IDs (for multi-visit chat context)
 */
export async function getAllVisitsForChat(visitIds: string[]): Promise<Visit[]> {
  if (visitIds.length === 0) {
    return [];
  }

  const placeholders = visitIds.map((_, i) => `$${i + 1}`).join(',');
  const result = await query(
    `SELECT id, token, patient_name, visit_date, diagnosis, symptoms, findings,
            medications, instructions, follow_up_date, doctor_name, notes, created_at
     FROM visits WHERE id = ANY(ARRAY[${placeholders}])
     ORDER BY visit_date DESC`,
    visitIds
  );

  return result.rows.map(parseVisitRow);
}

/**
 * Generate a unique token for a visit link
 */
function generateUniqueToken(): string {
  return uuidv4().replace(/-/g, '').substring(0, 32);
}

/**
 * Parse a database row into a Visit object
 */
function parseVisitRow(row: any): Visit {
  return {
    id: row.id,
    token: row.token,
    patientName: row.patient_name,
    visitDate: new Date(row.visit_date),
    diagnosis: row.diagnosis,
    symptoms: row.symptoms || [],
    findings: row.findings,
    medications: JSON.parse(row.medications),
    instructions: row.instructions,
    followUpDate: row.follow_up_date ? new Date(row.follow_up_date) : undefined,
    doctorName: row.doctor_name,
    notes: row.notes,
    createdAt: new Date(row.created_at),
  };
}
