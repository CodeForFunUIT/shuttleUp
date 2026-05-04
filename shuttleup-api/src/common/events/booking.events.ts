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

export class BookingRequestedEvent {
  constructor(
    public readonly bookingId: string,
    public readonly sessionId: string,
    public readonly hostId: string,
    public readonly requesterName: string,
    public readonly sessionTitle: string,
  ) {}
}

export class BookingApprovedEvent {
  constructor(
    public readonly bookingId: string,
    public readonly sessionId: string,
    public readonly userId: string | null,
  ) {}
}

export class BookingRejectedEvent {
  constructor(
    public readonly bookingId: string,
    public readonly sessionId: string,
    public readonly userId: string | null,
  ) {}
}
