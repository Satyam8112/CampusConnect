import mongoose from 'mongoose';
import Event from '../models/Event.js';
import { notifyUser, notifyUsers } from '../utils/notificationUtils.js';

// Helper to format event output with registration metrics
const formatEvent = (event, currentUserId = null) => {
  const doc = event.toObject ? event.toObject() : event;
  const registrations = doc.registrations || [];
  const registrationCount = registrations.length;
  const capacity = doc.capacity || 0;
  const remainingSeats = Math.max(0, capacity - registrationCount);
  const isFull = registrationCount >= capacity;
  const isRegistered = currentUserId
    ? registrations.some((id) => id.toString() === currentUserId.toString())
    : false;

  return {
    ...doc,
    registrationCount,
    remainingSeats,
    isFull,
    isRegistered
  };
};

// GET /api/events (Public - with search and category filters)
export const getEvents = async (req, res) => {
  try {
    const { category, search, organizer } = req.query;
    const filter = {};

    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (organizer && mongoose.Types.ObjectId.isValid(organizer)) {
      filter.organizer = organizer;
    }

    if (search && search.trim()) {
      const searchRegex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { location: searchRegex }
      ];
    }

    const events = await Event.find(filter)
      .populate('organizer', 'name email')
      .sort({ date: 1, startTime: 1 });

    const currentUserId = req.user ? req.user.id : null;
    const formattedEvents = events.map((e) => formatEvent(e, currentUserId));

    res.status(200).json({
      status: 'success',
      count: formattedEvents.length,
      data: formattedEvents
    });
  } catch (error) {
    console.error('[GET EVENTS ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve events' });
  }
};

// GET /api/events/:id (Public)
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid event ID format' });
    }

    const event = await Event.findById(id).populate('organizer', 'name email');
    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    const currentUserId = req.user ? req.user.id : null;
    res.status(200).json({
      status: 'success',
      data: formatEvent(event, currentUserId)
    });
  } catch (error) {
    console.error('[GET EVENT BY ID ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve event details' });
  }
};

// POST /api/events (Organizer only)
export const createEvent = async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ status: 'error', message: 'Organizer access required to create events' });
    }

    const {
      title,
      description,
      date,
      startTime,
      endTime,
      location,
      category,
      capacity,
      image
    } = req.body;

    if (!title || !description || !date || !startTime || !location || capacity === undefined) {
      return res.status(400).json({
        status: 'error',
        message: 'Title, description, date, start time, location, and capacity are required'
      });
    }

    const parsedCapacity = parseInt(capacity, 10);
    if (isNaN(parsedCapacity) || parsedCapacity < 1) {
      return res.status(400).json({ status: 'error', message: 'Capacity must be a positive number greater than 0' });
    }

    const parsedDate = new Date(typeof date === 'string' && date.includes('T') ? date : `${date}T00:00:00.000Z`);
    if (isNaN(parsedDate.getTime())) {
      return res.status(400).json({ status: 'error', message: 'Invalid event date format' });
    }

    const newEvent = await Event.create({
      title: title.trim(),
      description: description.trim(),
      date: parsedDate,
      startTime: startTime.trim(),
      endTime: endTime ? endTime.trim() : '',
      location: location.trim(),
      category: category ? category.trim() : 'Technical',
      capacity: parsedCapacity,
      organizer: req.user.id,
      registrations: [],
      image: image ? image.trim() : ''
    });

    const populatedEvent = await Event.findById(newEvent._id).populate('organizer', 'name email');

    res.status(201).json({
      status: 'success',
      message: 'Event created successfully',
      data: formatEvent(populatedEvent, req.user.id)
    });
  } catch (error) {
    console.error('[CREATE EVENT ERROR]', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to create event' });
  }
};

// PUT /api/events/:id (Organizer Owner only)
export const updateEvent = async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ status: 'error', message: 'Organizer access required' });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid event ID format' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ status: 'error', message: 'You are not authorized to edit this event' });
    }

    const previousRegistrations = [...(event.registrations || [])];
    const { title, description, date, startTime, endTime, location, category, capacity, image } = req.body;

    if (title !== undefined) event.title = title.trim();
    if (description !== undefined) event.description = description.trim();
    if (location !== undefined) event.location = location.trim();
    if (category !== undefined) event.category = category.trim();
    if (startTime !== undefined) event.startTime = startTime.trim();
    if (endTime !== undefined) event.endTime = endTime.trim();
    if (image !== undefined) event.image = image.trim();

    if (date !== undefined) {
      const parsedDate = new Date(typeof date === 'string' && date.includes('T') ? date : `${date}T00:00:00.000Z`);
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({ status: 'error', message: 'Invalid event date format' });
      }
      event.date = parsedDate;
    }

    if (capacity !== undefined) {
      const parsedCapacity = parseInt(capacity, 10);
      if (isNaN(parsedCapacity) || parsedCapacity < 1) {
        return res.status(400).json({ status: 'error', message: 'Capacity must be a positive number greater than 0' });
      }
      if (parsedCapacity < event.registrations.length) {
        return res.status(400).json({
          status: 'error',
          message: `Capacity cannot be less than current registrations count (${event.registrations.length})`
        });
      }
      event.capacity = parsedCapacity;
    }

    await event.save();
    const updatedEvent = await Event.findById(id).populate('organizer', 'name email');

    // Notify previously registered students of update
    if (previousRegistrations.length > 0) {
      await notifyUsers(previousRegistrations, {
        type: 'event_updated',
        title: 'Event Updated',
        message: `The event '${event.title}' has been updated by the organizer.`,
        event: event._id,
        actor: req.user.id
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Event updated successfully',
      data: formatEvent(updatedEvent, req.user.id)
    });
  } catch (error) {
    console.error('[UPDATE EVENT ERROR]', error);
    res.status(500).json({ status: 'error', message: error.message || 'Failed to update event' });
  }
};

// DELETE /api/events/:id (Organizer Owner only)
export const deleteEvent = async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ status: 'error', message: 'Organizer access required' });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid event ID format' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    if (event.organizer.toString() !== req.user.id) {
      return res.status(403).json({ status: 'error', message: 'You are not authorized to delete this event' });
    }

    const registeredStudentIds = [...(event.registrations || [])];
    const eventTitle = event.title;
    const organizerId = event.organizer;
    const eventId = event._id;

    // Send notifications BEFORE deletion so recipients retain event title and actor
    if (registeredStudentIds.length > 0) {
      await notifyUsers(registeredStudentIds, {
        type: 'event_cancelled',
        title: 'Event Cancelled',
        message: `The event '${eventTitle}' has been cancelled by the organizer.`,
        event: eventId,
        actor: organizerId
      });
    }

    await Event.findByIdAndDelete(id);

    res.status(200).json({
      status: 'success',
      message: 'Event deleted successfully'
    });
  } catch (error) {
    console.error('[DELETE EVENT ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Failed to delete event' });
  }
};

// POST /api/events/:id/register (Student only - Atomic)
export const registerForEvent = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ status: 'error', message: 'Only students can register for events' });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid event ID format' });
    }

    const existingEvent = await Event.findById(id);
    if (!existingEvent) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    if (existingEvent.registrations.some((userId) => userId.toString() === req.user.id)) {
      return res.status(400).json({ status: 'error', message: 'You are already registered for this event' });
    }

    if (existingEvent.registrations.length >= existingEvent.capacity) {
      return res.status(400).json({ status: 'error', message: 'Event is full. Capacity reached.' });
    }

    // Atomic update preventing duplicate registrations or capacity overflow
    const updatedEvent = await Event.findOneAndUpdate(
      {
        _id: id,
        registrations: { $ne: req.user.id },
        $expr: { $lt: [{ $size: '$registrations' }, '$capacity'] }
      },
      {
        $addToSet: { registrations: req.user.id }
      },
      { new: true }
    ).populate('organizer', 'name email');

    if (!updatedEvent) {
      const rechecked = await Event.findById(id);
      if (rechecked?.registrations.some((userId) => userId.toString() === req.user.id)) {
        return res.status(400).json({ status: 'error', message: 'You are already registered for this event' });
      }
      if (rechecked && rechecked.registrations.length >= rechecked.capacity) {
        return res.status(400).json({ status: 'error', message: 'Event is full. Capacity reached.' });
      }
      return res.status(400).json({ status: 'error', message: 'Unable to complete registration. Please try again.' });
    }

    const organizerId = updatedEvent.organizer?._id || updatedEvent.organizer;
    if (organizerId) {
      await notifyUser({
        recipient: organizerId,
        type: 'event_registration',
        title: 'New Event Registration',
        message: `A student has registered for your event: ${updatedEvent.title}.`,
        event: updatedEvent._id,
        actor: req.user.id
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Successfully registered for event',
      data: formatEvent(updatedEvent, req.user.id)
    });
  } catch (error) {
    console.error('[REGISTER FOR EVENT ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Failed to register for event' });
  }
};

// DELETE /api/events/:id/register (Student only - Atomic cancellation)
export const cancelRegistration = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ status: 'error', message: 'Only students can modify event registrations' });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ status: 'error', message: 'Invalid event ID format' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ status: 'error', message: 'Event not found' });
    }

    if (!event.registrations.some((userId) => userId.toString() === req.user.id)) {
      return res.status(400).json({ status: 'error', message: 'You are not registered for this event' });
    }

    const updatedEvent = await Event.findOneAndUpdate(
      { _id: id, registrations: req.user.id },
      { $pull: { registrations: req.user.id } },
      { new: true }
    ).populate('organizer', 'name email');

    const organizerId = updatedEvent.organizer?._id || updatedEvent.organizer;
    if (organizerId) {
      await notifyUser({
        recipient: organizerId,
        type: 'registration_cancelled',
        title: 'Event Registration Cancelled',
        message: `A student cancelled their registration for your event: ${updatedEvent.title}.`,
        event: updatedEvent._id,
        actor: req.user.id
      });
    }

    res.status(200).json({
      status: 'success',
      message: 'Registration cancelled successfully',
      data: formatEvent(updatedEvent, req.user.id)
    });
  } catch (error) {
    console.error('[CANCEL REGISTRATION ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Failed to cancel registration' });
  }
};

// GET /api/events/organizer/my-events (Organizer only)
export const getMyEvents = async (req, res) => {
  try {
    if (req.user.role !== 'organizer') {
      return res.status(403).json({ status: 'error', message: 'Organizer access required' });
    }

    const events = await Event.find({ organizer: req.user.id })
      .populate('organizer', 'name email')
      .sort({ date: 1, createdAt: -1 });

    res.status(200).json({
      status: 'success',
      count: events.length,
      data: events.map((e) => formatEvent(e, req.user.id))
    });
  } catch (error) {
    console.error('[GET MY EVENTS ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve your events' });
  }
};

// GET /api/events/student/my-registrations (Student only)
export const getMyRegistrations = async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ status: 'error', message: 'Student access required' });
    }

    const events = await Event.find({ registrations: req.user.id })
      .populate('organizer', 'name email')
      .sort({ date: 1 });

    res.status(200).json({
      status: 'success',
      count: events.length,
      data: events.map((e) => formatEvent(e, req.user.id))
    });
  } catch (error) {
    console.error('[GET MY REGISTRATIONS ERROR]', error);
    res.status(500).json({ status: 'error', message: 'Failed to retrieve your registered events' });
  }
};
