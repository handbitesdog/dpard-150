/** Malformed payloads used to test that every store's migrate function tolerates corrupt MMKV data. */
export const corruptPayloads: unknown[] = [
  null,
  undefined,
  'not an object',
  42,
  [],
  { unexpectedShape: true },
];
