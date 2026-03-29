import { Router, Request, Response } from 'express';
import { validateToken } from '../services/auth';
import { ApiResponse } from '../types';

const router = Router();

/**
 * GET /api/visit
 * Retrieve visit data by token provided in the Authorization header
 */
router.get('/', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;

    if (!token) {
      const error: ApiResponse<null> = {
        success: false,
        error: 'Token is required',
      };
      return res.status(400).json(error);
    }

    const visit = await validateToken(token);

    if (!visit) {
      const error: ApiResponse<null> = {
        success: false,
        error: 'Invalid token',
      };
      return res.status(404).json(error);
    }

    const response: ApiResponse<any> = {
      success: true,
      data: {
        id: visit.id,
        patientName: visit.patientName,
        visitDate: visit.visitDate,
        diagnosis: visit.diagnosis,
        symptoms: visit.symptoms,
        findings: visit.findings,
        medications: visit.medications,
        instructions: visit.instructions,
        followUpDate: visit.followUpDate,
        doctorName: visit.doctorName,
        notes: visit.notes,
      },
    };

    res.status(200).json(response);
  } catch (error: any) {
    console.error('Error fetching visit:', error);
    const response: ApiResponse<null> = {
      success: false,
      error: 'Internal server error',
    };
    res.status(500).json(response);
  }
});

export default router;
