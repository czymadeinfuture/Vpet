export class AudioPlayer {
  private queueList: string[] = [];
  private current: string | null = null;
  private volume = 1;

  play(source: string): string {
    this.current = source;
    return this.current;
  }

  stop(): void {
    this.current = null;
  }

  setVolume(value: number): void {
    if (value < 0 || value > 1) throw new Error('volume must be between 0 and 1');
    this.volume = value;
  }

  queue(items: string[]): void {
    this.queueList.push(...items);
  }

  playNext(): string | null {
    const next = this.queueList.shift();
    if (!next) return null;
    this.current = next;
    return next;
  }

  snapshot() {
    return {
      current: this.current,
      queued: [...this.queueList],
      volume: this.volume
    };
  }
}
