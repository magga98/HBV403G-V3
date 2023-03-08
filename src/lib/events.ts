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
};

export function mapDbEventToEvent( input: unknown ): Event | null {

    const event: Event = {
        id: 1,
        name: '',
        slug: '',
        created: new Date(),
        updated: new Date(),
    };

    return event;
}

export function mapDbEventsToEvents( input: QueryResult<any> | null, ): Array<Event> {
    if (!input) {
        return [];
    }
    const mappedEvents = input?.rows.map(mapDbEventToEvent);

    return mappedEvents.filter((i): i is Event => Boolean(i));
}