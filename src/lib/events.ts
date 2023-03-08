import { QueryResult } from "pg";

export type Event = {
    id: number;
    name: string;
    slug: string;
    location?: string;
    url?: string;
    description?: string;
    created: Date;
    updated: Date;
}

export function mapDbEventToEvent( input: unknown ): Event | null {
    return null;
}

export function mapDbEventsToEvents(input: QueryResult<any> | null): Array<Event> {
    if (!input) {
        return []
    }
    console.log('input :>>', input);
    const mappedEvents = input?.rows.map(mapDbEventToEvent);

    return mappedEvents.filter((i): i is Event => Boolean(i));
}