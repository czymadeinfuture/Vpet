import { describe, expect, it } from 'vitest';
import { StudyLogbook } from '../src/study/logbook';

describe('StudyLogbook', () => {
  it('adds and totals minutes by date', () => {
    const log = new StudyLogbook();
    log.add({ id: '1', date: '2026-05-02', topic: 'French', minutes: 20 });
    log.add({ id: '2', date: '2026-05-02', topic: 'French grammar', minutes: 15 });
    expect(log.totalMinutes('2026-05-02')).toBe(35);
  });
});
