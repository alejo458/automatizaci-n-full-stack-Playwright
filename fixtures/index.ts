import { test as base, expect, request as pwRequest } from '@playwright/test';
import { AuthClient } from '../src/api/AuthClient';
import { BookingClient } from '../src/api/BookingClient';
import { RoomClient } from '../src/api/RoomClient';
import { Room } from '../src/api/types';
import { addDays, iso } from '../src/data/bookingData';
import { env } from '../src/config/env';

type Stay = { checkin: string; checkout: string; nights: number };

type TestFixtures = {
  bookingApi: BookingClient;
  room: Room;
  /** Fechas futuras sin solapamiento con reservas existentes de la habitación. */
  freeStay: (nights?: number) => Promise<Stay>;
  /** Registra ids creados para eliminarlos al terminar (aislamiento). */
  track: (id: number) => void;
};
type WorkerFixtures = { token: string };

export const test = base.extend<TestFixtures, WorkerFixtures>({
  token: [async ({}, use) => {
    const ctx = await pwRequest.newContext({ baseURL: env.baseUrl });
    const token = await new AuthClient(ctx).login(env.adminUser, env.adminPass);
    await use(token);
    await ctx.dispose();
  }, { scope: 'worker' }],

  bookingApi: async ({ request, token }, use) => use(new BookingClient(request, token)),

  room: async ({ request }, use) => {
    const rooms = await new RoomClient(request).list();
    expect(rooms.length, 'debe existir al menos una habitación').toBeGreaterThan(0);
    await use(rooms[0]);
  },

  freeStay: async ({ bookingApi, room }, use, testInfo) => {
    await use(async (nights = 2) => {
      for (let attempt = 0; attempt < 10; attempt++) {
        // ventana lejana + offset por worker + azar -> baja probabilidad de colisión en demo compartida
        const offset = 400 + testInfo.parallelIndex * 41 + Math.floor(Math.random() * 600);
        const checkin = iso(addDays(new Date(), offset));
        const checkout = iso(addDays(new Date(), offset + nights));
        const existing = await bookingApi.listByRoom(room.roomid);
        const overlaps = existing.some(b => {
          const d = b.bookingDates ?? b.bookingdates;
          return d && d.checkin < checkout && d.checkout > checkin;
        });
        if (!overlaps) return { checkin, checkout, nights };
      }
      throw new Error('No se encontraron fechas libres tras 10 intentos');
    });
  },

  track: async ({ bookingApi }, use) => {
    const ids: number[] = [];
    await use(id => ids.push(id));
    for (const id of ids) await bookingApi.delete(id); // limpieza propia
  },
});

export { expect };
