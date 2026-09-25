import express from 'express';
import {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  cancelRegistration,
  getMyEvents,
  getMyRegistrations
} from '../controllers/eventController.js';
import authMiddleware, { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

// ==========================================
// Specific / Nested Protected Routes
// (Must be defined before parameterized :id)
// ==========================================

// Get events created by logged-in organizer
router.get('/organizer/my-events', authMiddleware, getMyEvents);

// Get events registered by logged-in student
router.get('/student/my-registrations', authMiddleware, getMyRegistrations);

// ==========================================
// Base & Dynamic Routes
// ==========================================

// Browse all events (Public, optional auth for isRegistered flag)
router.get('/', optionalAuth, getEvents);

// Create new event (Organizer only)
router.post('/', authMiddleware, createEvent);

// Get event by ID (Public, optional auth for isRegistered flag)
router.get('/:id', optionalAuth, getEventById);

// Update event (Organizer Owner only)
router.put('/:id', authMiddleware, updateEvent);

// Delete event (Organizer Owner only)
router.delete('/:id', authMiddleware, deleteEvent);

// Register for event (Student only)
router.post('/:id/register', authMiddleware, registerForEvent);

// Cancel registration for event (Student only)
router.delete('/:id/register', authMiddleware, cancelRegistration);

export default router;
