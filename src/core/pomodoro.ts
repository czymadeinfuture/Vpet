export type PomodoroPhase = 'focus' | 'break';
export type PomodoroState = 'idle' | 'running' | 'paused' | 'finished';

export interface PomodoroSnapshot {
  phase: PomodoroPhase;
  state: PomodoroState;
  focusMinutes: number;
  breakMinutes: number;
  remainingSeconds: number;
}

export class PomodoroTimer {
  private phase: PomodoroPhase = 'focus';
  private state: PomodoroState = 'idle';
  private remainingSeconds: number;

  constructor(private readonly focusMinutes = 25, private readonly breakMinutes = 5) {
    this.remainingSeconds = focusMinutes * 60;
  }

  start(): void {
    if (this.state === 'idle' || this.state === 'paused') this.state = 'running';
  }

  pause(): void {
    if (this.state === 'running') this.state = 'paused';
  }

  tick(seconds = 1): void {
    if (this.state !== 'running' || seconds <= 0) return;
    this.remainingSeconds = Math.max(0, this.remainingSeconds - seconds);
    if (this.remainingSeconds === 0) this.state = 'finished';
  }

  nextPhase(): void {
    if (this.state !== 'finished') return;
    this.phase = this.phase === 'focus' ? 'break' : 'focus';
    this.remainingSeconds = (this.phase === 'focus' ? this.focusMinutes : this.breakMinutes) * 60;
    this.state = 'idle';
  }

  snapshot(): PomodoroSnapshot {
    return {
      phase: this.phase,
      state: this.state,
      focusMinutes: this.focusMinutes,
      breakMinutes: this.breakMinutes,
      remainingSeconds: this.remainingSeconds
    };
  }
}
