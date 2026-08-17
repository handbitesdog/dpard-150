export const palette = {
  navy: '#0f3357', // primary
  beige: '#f7efde', // primary
  pear: '#7bb31e', // secondary
  lime: '#b7d854', // secondary
  sky: '#3aa5b9', // secondary
  teal: '#45d3cd', // secondary
  slate: '#72a09a', // accent
  grey: '#e5e5ea',
  white: '#ffffff',
} as const;

// Navy at 50% opacity — inactive tab bar icons/labels.
export const navyMuted = 'rgba(15, 51, 87, 0.5)';

type TextPair = { foreground: keyof typeof palette; background: keyof typeof palette };

// IMPLEMENTATION.md Appendix A — the only pairings measured safe for text
// (4.5:1+). tests/unit/contrast.test.ts asserts every pair here meets that
// bar, so this is the set components are allowed to build on.
export const safeTextPairs: TextPair[] = [
  { foreground: 'navy', background: 'white' },
  { foreground: 'navy', background: 'beige' },
  { foreground: 'navy', background: 'grey' },
  { foreground: 'navy', background: 'lime' },
  { foreground: 'navy', background: 'teal' },
  { foreground: 'navy', background: 'pear' },
  { foreground: 'white', background: 'navy' },
  { foreground: 'beige', background: 'navy' },
];

// Pairings a screen might reach for that fail WCAG AA outright, or are
// borderline enough (navy on sky/slate: ~4.4:1, large text only) to need a
// designer decision — listed explicitly rather than silently omitted.
export const blockedTextPairs: TextPair[] = [
  { foreground: 'white', background: 'pear' },
  { foreground: 'white', background: 'lime' },
  { foreground: 'white', background: 'sky' },
  { foreground: 'white', background: 'teal' },
  { foreground: 'white', background: 'slate' },
  { foreground: 'navy', background: 'sky' },
  { foreground: 'navy', background: 'slate' },
];
