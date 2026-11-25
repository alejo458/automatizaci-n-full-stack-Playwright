import { randomUUID } from 'crypto';
import { BookingPayload } from '../api/types';

export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const addDays = (d: Date, n: number) => new Date(d.getTime() + n * 86_400_000);

export function buildGuest() {
  const s = randomUUID().replace(/-/g, '').slice(0, 6);
  return {
    firstname: `Qa${s}`,                 // 3-18 chars
    lastname: `Synth${s}`,               // único: permite localizar el registro propio
    email: `qa.${s}@example.test`,
    phone: `07000${Math.floor(100000 + Math.random() * 899999)}`, // 11 dígitos
  };
}

export function buildBooking(roomid: number, checkin: string, checkout: string,
  overrides: Partial<BookingPayload> = {}): BookingPayload {
  return { roomid, depositpaid: true, ...buildGuest(), bookingdates: { checkin, checkout }, ...overrides };
}

/** Conjuntos para el escenario parametrizado (API exitosa). */
export const successDatasets = [
  { name: 'depósito pagado, 2 noches', depositpaid: true, nights: 2 },
  { name: 'sin depósito, 3 noches', depositpaid: false, nights: 3 },
];

/** Conjuntos para el escenario negativo (se espera 400). */
export const invalidDatasets = [
  { name: 'firstname ausente', mutate: (p: any) => { delete p.firstname; } },
  { name: 'email con formato inválido', mutate: (p: any) => { p.email = 'no-es-un-email'; } },
];
