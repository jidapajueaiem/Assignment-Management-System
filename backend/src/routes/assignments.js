import express from 'express';
import { verifyToken, requireRole } from '../middleware/auth.js';
import { uploadLimiter } from '../middleware/rateLimiter.js';
import { validateFileSize } from '../utils/validation.js';
import {
  addAssignment,
  getAssignmentsByStudent,
  getAssignmentsByTeacher,
  updateAssignmentStatus,
  findTeachers,
  findUserById
} from '../db/database.js';

const router = express.Router();

// Get teachers list
router.get('/teachers', verifyToken, (req, res, next) => {
  try {
    const teachers = findTeachers();
    res.json(teachers.map(t => ({ id: t.id, name: t.name })));
  } catch (err) {
    next(err);
  }
});

// Student: Submit assignment
router.post('/submit', verifyToken, requireRole('student'), uploadLimiter, async (req, res, next) => {
  try {
    const { teacherId, fileName, fileData } = req.body;

    // Validation
    if (!teacherId || !fileName || !fileData) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    if (!fileName.match(/\.(pdf|doc|docx|txt|jpg|jpeg|png|xlsx|xls)$/i)) {
      return res.status(400).json({ error: 'Invalid file type' });
    }

    // Check file size (rough estimate from base64)
    const fileSizeBytes = Buffer.byteLength(fileData, 'utf8');
    const fileValidation = validateFileSize(fileSizeBytes);
    if (!fileValidation.valid) {
      return res.status(400).json({ error: fileValidation.error });
    }

    const assignment = {
      id: `assign_${Date.now()}`,
      studentId: req.user.id,
      teacherId,
      fileName,
      fileData,
      status: 'submitted',
      submittedAt: new Date(),
      gradedAt: null,
      grade: null
    };

    addAssignment(assignment);
    res.status(201).json(assignment);
  } catch (err) {
    next(err);
  }
});

// Student: Get own assignments
router.get('/my-submissions', verifyToken, requireRole('student'), (req, res, next) => {
  try {
    const assignments = getAssignmentsByStudent(req.user.id);
    const enriched = assignments.map(a => ({
      ...a,
      teacherName: findUserById(a.teacherId)?.name
    }));
    res.json(enriched);
  } catch (err) {
    next(err);
  }
});

// Teacher: Get assignments for review
router.get('/to-review', verifyToken, requireRole('teacher'), (req, res, next) => {
  try {
    const assignments = getAssignmentsByTeacher(req.user.id);
    const enriched = assignments.map(a => ({
      ...a,
      studentName: findUserById(a.studentId)?.name
    }));
    res.json(enriched);
  } catch (err) {
    next(err);
  }
});

// Teacher: Download file
router.get('/download/:assignmentId', verifyToken, requireRole('teacher'), (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const assignments = getAssignmentsByTeacher(req.user.id);
    const assignment = assignments.find(a => a.id === assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    res.json({
      fileName: assignment.fileName,
      fileData: assignment.fileData
    });
  } catch (err) {
    next(err);
  }
});

// Teacher: Update assignment status
router.patch('/status/:assignmentId', verifyToken, requireRole('teacher'), (req, res, next) => {
  try {
    const { assignmentId } = req.params;
    const { status } = req.body;

    if (!['submitted', 'grading', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const assignments = getAssignmentsByTeacher(req.user.id);
    const assignment = assignments.find(a => a.id === assignmentId);

    if (!assignment) {
      return res.status(404).json({ error: 'Assignment not found' });
    }

    const updated = updateAssignmentStatus(assignmentId, status);
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

export default router;
