import { blockedTextPairs, palette, safeTextPairs } from '@/design/colors';
import { contrastRatio } from '@/lib/contrastRatio';

// WCAG AA: 4.5:1 for normal text, 3:1 for large text (>=24px, or >=19px bold).
const AA_NORMAL_TEXT = 4.5;
const AA_LARGE_TEXT = 3;

describe('declared safe text pairs meet WCAG AA for normal text', () => {
  it.each(safeTextPairs)('$foreground on $background', ({ foreground, background }) => {
    const ratio = contrastRatio(palette[foreground], palette[background]);
    expect(ratio).toBeGreaterThanOrEqual(AA_NORMAL_TEXT);
  });
});

describe('blocked pairs stay blocked', () => {
  // Documents why each pair is excluded from safeTextPairs. This is what
  // stops a Figma screenshot from quietly reintroducing white-on-lime: if a
  // color value ever changed enough to pass, this test would start failing
  // instead of the regression slipping in silently.
  it.each(blockedTextPairs)(
    '$foreground on $background fails normal-text AA',
    ({ foreground, background }) => {
      const ratio = contrastRatio(palette[foreground], palette[background]);
      expect(ratio).toBeLessThan(AA_NORMAL_TEXT);
    },
  );

  it('navy on sky and navy on slate still clear the large-text floor', () => {
    // Per Appendix A: safe as decorative fills and large headings, not body
    // text — which is why they're blocked above and not in safeTextPairs.
    expect(contrastRatio(palette.navy, palette.sky)).toBeGreaterThanOrEqual(AA_LARGE_TEXT);
    expect(contrastRatio(palette.navy, palette.slate)).toBeGreaterThanOrEqual(AA_LARGE_TEXT);
  });
});
