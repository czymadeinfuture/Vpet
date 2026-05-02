import { describe, expect, it } from 'vitest';
import { AudioPlayer } from '../src/audio/player';

describe('AudioPlayer', () => {
  it('plays and stops audio source', () => {
    const player = new AudioPlayer();
    expect(player.play('a.mp3')).toBe('a.mp3');
    expect(player.snapshot().current).toBe('a.mp3');
    player.stop();
    expect(player.snapshot().current).toBeNull();
  });

  it('supports queue playback', () => {
    const player = new AudioPlayer();
    player.queue(['a.mp3', 'b.mp3']);
    expect(player.playNext()).toBe('a.mp3');
    expect(player.playNext()).toBe('b.mp3');
    expect(player.playNext()).toBeNull();
  });

  it('validates volume range', () => {
    const player = new AudioPlayer();
    player.setVolume(0.5);
    expect(player.snapshot().volume).toBe(0.5);
    expect(() => player.setVolume(2)).toThrow();
  });
});
