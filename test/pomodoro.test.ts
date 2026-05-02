import { describe, expect, it } from 'vitest';
import { PomodoroTimer } from '../src/core/pomodoro';

describe('PomodoroTimer', () => {
  it('runs and finishes focus phase', () => {
    const timer = new PomodoroTimer(1, 1);
    timer.start();
    timer.tick(60);
    expect(timer.snapshot().state).toBe('finished');
  });

  it('switches to break after finish', () => {
    const timer = new PomodoroTimer(1, 1);
    timer.start();
    timer.tick(60);
    timer.nextPhase();
    const snap = timer.snapshot();
    expect(snap.phase).toBe('break');
    expect(snap.remainingSeconds).toBe(60);
    expect(snap.state).toBe('idle');
  });
});
