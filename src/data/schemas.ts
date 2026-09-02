import { z } from 'zod';

/** A value carried in every supported locale. Mirrors `Localized<T>` in `@/lib/localize`. */
const localizedStringSchema = z.object({
  en: z.string().min(1),
  es: z.string().min(1).optional(),
});

const photoRefSchema = z.object({
  source: z.string().min(1),
  alt: z.string().min(1),
  credit: z.string().min(1).optional(),
});

const coordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const parkSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  neighborhood: z.string().min(1),
  description: localizedStringSchema,
  phone: z.string().min(1),
  website: z.string().url(),
  streetAddress: z.string().min(1),
  photos: z.array(photoRefSchema),
  location: coordinatesSchema,
  stampRadiusMeters: z.number().positive(),
  stamp: z.object({
    image: z.string().min(1),
    label: z.string().min(1),
  }),
});

export const audioGuideSchema = z.object({
  id: z.string().min(1),
  parkId: z.string().min(1),
  title: z.string().min(1),
  narrator: z.string().min(1).optional(),
  durationSeconds: z.number().positive(),
  audioPath: localizedStringSchema,
  transcript: localizedStringSchema,
  chapters: z
    .array(
      z.object({
        title: z.string().min(1),
        startSeconds: z.number().nonnegative(),
      }),
    )
    .optional(),
});

/**
 * One headed part of a figure's long-form writeup. The department authors
 * these as a sequence of headed passages rather than one block of prose, and
 * the detail screen renders each as its own section.
 */
const biographySectionSchema = z.object({
  heading: localizedStringSchema,
  body: localizedStringSchema,
});

export const historicFigureSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  lifespan: z.string().min(1).optional(),
  summary: localizedStringSchema,
  /** Optional: some figures have no known portrait photograph. */
  portrait: photoRefSchema.optional(),
  biography: z.array(biographySectionSchema).min(1),
  /** Optional: outside source the detail screen's "Learn More" button opens. */
  learnMoreUrl: z.string().url().optional(),
  relatedParkIds: z.array(z.string().min(1)),
});

export const merchItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  productUrl: z.string().url(),
  photo: photoRefSchema,
});

export type PhotoRef = z.infer<typeof photoRefSchema>;
export type BiographySection = z.infer<typeof biographySectionSchema>;
export type Park = z.infer<typeof parkSchema>;
export type AudioGuide = z.infer<typeof audioGuideSchema>;
export type HistoricFigure = z.infer<typeof historicFigureSchema>;
export type MerchItem = z.infer<typeof merchItemSchema>;
