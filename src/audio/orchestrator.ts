export interface VoiceEvent {
  category: 'chat' | 'reminder' | 'focus_done';
  message: string;
  priority: number;
  timestampMs: number;
}

export class VoiceOrchestrator {
  private lastPlayedAt = new Map<string, number>();
  constructor(private readonly cooldownMs = 10 * 60 * 1000) {}

  shouldPlay(event: VoiceEvent): boolean {
    const last = this.lastPlayedAt.get(event.category);
    if (last && event.timestampMs - last < this.cooldownMs && event.category !== 'focus_done') {
      return false;
    }
    this.lastPlayedAt.set(event.category, event.timestampMs);
    return true;
  }
}
