import express, { Request, Response, NextFunction } from 'express';
import { query } from '../lib/db.js';
import { mapDbEventsToEvents, eventMapper, mapDbEventToEvent } from '../lib/events.js';

export const router = express.Router();

export async function index(req: Request, res: Response, next: NextFunction) {
  const eventsResult = await query('SELECT * FROM events;');

  const events = mapDbEventsToEvents(eventsResult);
  console.log('events :>>', events);

  res.json(events);
}

export async function event(req: Request, res: Response, next: NextFunction) {
  const { slug } = req.params;
  const eventsResult = await query('SELECT * FROM events WHERE slug = $1;', [ slug, ]);

  const event = mapDbEventToEvent(eventsResult);

  if (!event) {
    return next();
  }

  res.json(event);
}

router.get('/', index);
router.get('/:slug', event);
