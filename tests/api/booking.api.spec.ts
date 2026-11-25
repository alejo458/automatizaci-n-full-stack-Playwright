import { test, expect } from '../../fixtures';
import { buildBooking, successDatasets, invalidDatasets } from '../../src/data/bookingData';

test.describe('API de reservas', () => {
  for (const ds of successDatasets) {
    test(`@smoke @regression crear y consultar reserva - ${ds.name}`, async ({ bookingApi, room, freeStay, track }) => {
      const stay = await freeStay(ds.nights);
      const payload = buildBooking(room.roomid, stay.checkin, stay.checkout, { depositpaid: ds.depositpaid });

      const create = await bookingApi.create(payload);
      expect(create.status(), 'contrato: creación exitosa -> 201').toBe(201);

      let created;

      await expect
        .poll(async () => {
          created = await bookingApi.findByLastname(
            room.roomid,
            payload.lastname
          );
          return created !== undefined;
        }, {
          timeout: 10000,
          message: 'la reserva creada debe aparecer en la API'
        })
        .toBe(true);

      track(created!.bookingid);

      const get = await bookingApi.get(created!.bookingid);

      console.log('bookingId:', created!.bookingid);
      console.log('status:', get.status());
      console.log('body:', await get.text());

      expect(get.status()).toBe(200);
      expect(get.status()).toBe(200);
      const b = await get.json();
      const dates = b.bookingDates ?? b.bookingdates;

      console.log('GET booking:', b);

      expect(b.bookingid).toBe(created!.bookingid);
      expect(b.roomid).toBe(room.roomid);
      expect(b.firstname).toBe(payload.firstname);
      expect(b.lastname).toBe(payload.lastname);
      expect(b.depositpaid).toBe(ds.depositpaid);
      expect(b.email).toBe(payload.email);
      expect(b.phone).toBe(payload.phone);
      expect(dates.checkin).toBe(stay.checkin);
      expect(dates.checkout).toBe(stay.checkout);
    });
  }

  for (const ds of invalidDatasets) {
    test(`@regression rechaza reserva inválida - ${ds.name}`, async ({ bookingApi, room, freeStay }) => {
      const stay = await freeStay(2);
      const payload: any = buildBooking(room.roomid, stay.checkin, stay.checkout);
      ds.mutate(payload);

      const res = await bookingApi.create(payload);
      expect(res.status(), 'contrato: datos inválidos -> 400').toBe(400);

      expect(await bookingApi.findByLastname(room.roomid, payload.lastname)).toBeUndefined();
    });
  }
});
