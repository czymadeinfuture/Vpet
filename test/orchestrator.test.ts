import { describe, expect, it } from 'vitest';
import { VoiceOrchestrator } from '../src/audio/orchestrator';

describe('VoiceOrchestrator', () => {
  it('blocks repeated reminders in cooldown', () => {
    const v = new VoiceOrchestrator(1000);
    expect(v.shouldPlay({ category: 'reminder', message: 'a', priority: 1, timestampMs: 1000 })).toBe(true);
    expect(v.shouldPlay({ category: 'reminder', message: 'b', priority: 1, timestampMs: 1500 })).toBe(false);
  });

  it('always allows focus_done', () => {
    const v = new VoiceOrchestrator(1000);
    expect(v.shouldPlay({ category: 'focus_done', message: 'done1', priority: 10, timestampMs: 1000 })).toBe(true);
    expect(v.shouldPlay({ category: 'focus_done', message: 'done2', priority: 10, timestampMs: 1200 })).toBe(true);
  });
});
