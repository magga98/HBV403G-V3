import express, { Request, Response, NextFunction } from 'express';
import { query } from '../lib/db.js';
import { mapDbEventsToEvents } from '../lib/events.js';

export const router = express.Router();

export async function index(req: Request, res: Response, next: NextFunction) {
  const eventsResult = await query('SELECT * FROM events;');

  const events = mapDbEventsToEvents(eventsResult);
  console.log('events :>>', events);
  res.json(events);
}

export async function event(req: Request, res: Response, next: NextFunction) {
  const { id } = req.params;
  const eventsResult = await query('SELECT * FROM events WHERE id = $1;', [id]);

  const events = mapDbEventsToEvents(eventsResult);
  console.log('events :>>', events);
  res.json(events);
}

router.get('/', index);
router.get('/:slug', event);
