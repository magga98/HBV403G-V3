import express, { Request, Response, NextFunction } from 'express';
import { query } from '../lib/db';
import { mapDbEventsToEvents } from '../lib/events';

export const router = express.Router();

export async function index(req: Request, res: Response, next: NextFunction) {
  const eventsResult = await query('SELECT * FROM events;');

  const events = mapDbEventsToEvents(eventsResult);

  res.json(events);
}

router.get('/', index);
