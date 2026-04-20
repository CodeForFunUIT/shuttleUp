export class BookingCreatedEvent {
  constructor(
    public readonly bookingId: string,
    public readonly sessionId: string,
    public readonly hostId: string,
  ) {}
}

export class BookingCancelledEvent {
  constructor(
    public readonly bookingId: string,
    public readonly sessionId: string,
  ) {}
}
