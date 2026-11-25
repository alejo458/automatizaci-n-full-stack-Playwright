import { APIRequestContext, APIResponse } from '@playwright/test';
import { BookingPayload, BookingRecord } from './types';

export class BookingClient {
  constructor(private readonly request: APIRequestContext, private readonly token: string) { }

  private get auth() { return { Cookie: `token=${this.token}` }; }

  /** Devuelve la respuesta cruda: cada test decide qué validar. */
  create(payload: Partial<BookingPayload> | Record<string, unknown>): Promise<APIResponse> {
    return this.request.post('/api/booking', { data: payload });
  }

  get(id: number): Promise<APIResponse> {
    return this.request.get(`/api/booking/${id}`);
  }

  async listByRoom(roomid: number): Promise<BookingRecord[]> {
    const res = await this.request.get(`/api/booking?roomid=${roomid}`, { headers: this.auth });
    if (res.status() !== 200) throw new Error(`listByRoom -> ${res.status()}`);
    return (await res.json()).bookings as BookingRecord[];
  }

  async findByLastname(roomid: number, lastname: string): Promise<BookingRecord | undefined> {
    return (await this.listByRoom(roomid)).find(b => b.lastname === lastname);
  }

  delete(id: number): Promise<APIResponse> {
    return this.request.delete(`/api/booking/${id}`, { headers: this.auth });
  }
}
