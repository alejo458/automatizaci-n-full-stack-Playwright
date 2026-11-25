export interface BookingDates { checkin: string; checkout: string }
export interface BookingPayload {
  roomid: number;
  firstname: string;
  lastname: string;
  depositpaid: boolean;
  email: string;
  phone: string;
  bookingdates: BookingDates;
}
export interface BookingRecord {
  bookingid: number;
  roomid: number;
  firstname: string;
  lastname: string;
  depositpaid: boolean;
  email?: string;
  phone?: string;
  bookingDates?: BookingDates;   // la API devuelve esta clave en lecturas (verificar)
  bookingdates?: BookingDates;
}
export interface Room { roomid: number; roomName: string; type?: string; roomPrice?: number }
