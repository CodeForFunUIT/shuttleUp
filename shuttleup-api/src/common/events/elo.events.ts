export class EloMatchConfirmedEvent {
  constructor(
    public readonly matchId: string,
    public readonly sessionId: string | null,
    public readonly participantIds: string[],
  ) {}
}
