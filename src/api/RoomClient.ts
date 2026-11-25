import { APIRequestContext, expect } from '@playwright/test';
import { Room } from './types';

export class RoomClient {
  constructor(private readonly request: APIRequestContext) {}

  async list(): Promise<Room[]> {
    const res = await this.request.get('/api/room');
    expect(res.status()).toBe(200);
    return (await res.json()).rooms as Room[];
  }
}
