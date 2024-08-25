const express = require('express');
const { getRepository } = require('typeorm');
const { Event } = require('../entities/Event');
const { Session } = require('../entities/Session');
const { Participant } = require('../entities/Participant');
const { generateEventReport } = require('../services/pdfService');
const router = express.Router();

// Get all events
router.get('/events', async (req, res) => {
    const eventRepository = getRepository(Event);
    const events = await eventRepository.find({ relations: ["sessions", "participants"] });
    res.json(events);
});

// Create a new event
router.post('/events', async (req, res) => {
    const eventRepository = getRepository(Event);
    const event = eventRepository.create(req.body);
    await eventRepository.save(event);
    res.json(event);
});

// Get event by ID
router.get('/events/:id', async (req, res) => {
    const eventRepository = getRepository(Event);
    const event = await eventRepository.findOne(req.params.id, { relations: ["sessions", "participants"] });
    res.json(event);
});

// Update event by ID
router.put('/events/:id', async (req, res) => {
    const eventRepository = getRepository(Event);
    let event = await eventRepository.findOne(req.params.id);
    eventRepository.merge(event, req.body);
    event = await eventRepository.save(event);
    res.json(event);
});

// Delete event by ID
router.delete('/events/:id', async (req, res) => {
    const eventRepository = getRepository(Event);
    await eventRepository.delete(req.params.id);
    res.json({ message: "Event deleted successfully" });
});

// Add session to an event
router.post('/events/:id/sessions', async (req, res) => {
    const eventRepository = getRepository(Event);
    const sessionRepository = getRepository(Session);
    const event = await eventRepository.findOne(req.params.id);
    const session = sessionRepository.create({ ...req.body, event });
    await sessionRepository.save(session);
    res.json(session);
});

// Add speaker to an event (as part of a session)
router.post('/events/:id/speakers', async (req, res) => {
    const eventRepository = getRepository(Event);
    const sessionRepository = getRepository(Session);
    const event = await eventRepository.findOne(req.params.id);
    const session = await sessionRepository.findOne(req.body.sessionId, { where: { event } });
    session.speakers.push(req.body.speaker);
    await sessionRepository.save(session);
    res.json(session);
});

// Participant registration with validation
router.post('/events/:id/register', async (req, res) => {
    const eventRepository = getRepository(Event);
    const participantRepository = getRepository(Participant);
    const event = await eventRepository.findOne(req.params.id, { relations: ["participants"] });
    const maxParticipants = 100;

    if (event.participants.length >= maxParticipants) {
        return res.status(400).send('Event is fully booked');
    }

    const participant = participantRepository.create({ ...req.body, event });
    await participantRepository.save(participant);
    res.json(participant);
});

// Generate detailed event report
router.get('/events/:id/report', async (req, res) => {
    const eventRepository = getRepository(Event);
    const event = await eventRepository.findOne(req.params.id, { relations: ["sessions", "participants"] });
    res.json(event);
});

// Generate PDF report
router.get('/events/:id/report/pdf', async (req, res) => {
    const eventRepository = getRepository(Event);
    const event = await eventRepository.findOne(req.params.id, { relations: ["sessions", "participants"] });
    const doc = generateEventReport(event);
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);
});

module.exports = router;
