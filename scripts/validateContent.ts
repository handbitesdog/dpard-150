import type { z } from 'zod';
import { audioGuideSchema, historicFigureSchema, parkSchema } from '../src/data/schemas';
import type { AudioGuide, HistoricFigure, Park } from '../src/data/schemas';
import { validateCatalog } from '../src/data/validateCatalog';

function parseAll<T>(
  schema: z.ZodType<T>,
  raw: unknown[],
  label: string,
): { parsed: T[]; errors: string[] } {
  const parsed: T[] = [];
  const errors: string[] = [];

  raw.forEach((entry, index) => {
    const result = schema.safeParse(entry);
    if (result.success) {
      parsed.push(result.data);
    } else {
      errors.push(`Invalid ${label} at index ${index}: ${result.error.message}`);
    }
  });

  return { parsed, errors };
}

/**
 * Parses raw park/guide/figure data against the content schemas and runs
 * catalog cross-reference checks, collecting every error rather than
 * stopping at the first. Empty array means the catalog is fully valid.
 */
export function validateContent(
  rawParks: unknown[],
  rawGuides: unknown[],
  rawFigures: unknown[],
): string[] {
  const parksResult = parseAll<Park>(parkSchema, rawParks, 'park');
  const guidesResult = parseAll<AudioGuide>(audioGuideSchema, rawGuides, 'guide');
  const figuresResult = parseAll<HistoricFigure>(
    historicFigureSchema,
    rawFigures,
    'historic figure',
  );

  const catalogErrors = validateCatalog(
    parksResult.parsed,
    guidesResult.parsed,
    figuresResult.parsed,
  );

  return [
    ...parksResult.errors,
    ...guidesResult.errors,
    ...figuresResult.errors,
    ...catalogErrors,
  ];
}
