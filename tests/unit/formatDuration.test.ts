import { formatDuration } from '@/lib/formatDuration';

describe('formatDuration', () => {
  it('formats seconds under a minute', () => {
    expect(formatDuration(45)).toBe('0:45');
  });

  it('formats minutes and seconds', () => {
    expect(formatDuration(480)).toBe('8:00');
  });

  it('pads single-digit seconds', () => {
    expect(formatDuration(365)).toBe('6:05');
  });

  it('formats an hour or more as H:MM:SS', () => {
    expect(formatDuration(3725)).toBe('1:02:05');
  });

  it('rounds fractional seconds', () => {
    expect(formatDuration(59.6)).toBe('1:00');
  });

  it('clamps negative durations to zero', () => {
    expect(formatDuration(-5)).toBe('0:00');
  });
});
