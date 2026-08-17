// WCAG 2.x relative luminance and contrast ratio formulas.
function channelLuminance(channel: number): number {
  const c = channel / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(hex: string): number {
  const match = /^#([0-9a-f]{6})$/i.exec(hex);
  const digits = match?.[1];
  if (!digits) throw new Error(`contrastRatio expects a 6-digit hex color, got "${hex}"`);
  const value = parseInt(digits, 16);
  const r = channelLuminance((value >> 16) & 0xff);
  const g = channelLuminance((value >> 8) & 0xff);
  const b = channelLuminance(value & 0xff);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(hexA: string, hexB: string): number {
  const luminanceA = relativeLuminance(hexA);
  const luminanceB = relativeLuminance(hexB);
  const lighter = Math.max(luminanceA, luminanceB);
  const darker = Math.min(luminanceA, luminanceB);
  return (lighter + 0.05) / (darker + 0.05);
}
