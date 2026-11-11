import { defineCollection } from "astro:content";
import { file, glob } from "astro/loaders";
import { z } from "astro/zod";

const products = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/products" }),
  schema: z.object({
    title: z.string(),
    kind: z.enum(["casing", "tubing", "accessories"]),
    order: z.number(),
    lang: z.string().default("en"),
    seoTitle: z.string(),
    description: z.string(),
    summary: z.string(),
    specLabel: z.string(),
    sizeRange: z.string().optional(),
    facts: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
    connections: z.array(z.object({ name: z.string(), detail: z.string() })).default([]),
    rangeLengths: z
      .array(z.object({ range: z.string(), ft: z.string(), m: z.string() }))
      .default([]),
  }),
});

const sizeBase = {
  od: z.string(),
  odIn: z.number(),
  odMm: z.number(),
  wallIn: z.number(),
  wallMm: z.number(),
  idIn: z.number(),
  grades: z.array(z.string()),
};

const casingSizes = defineCollection({
  loader: file("src/data/casing-sizes.json"),
  schema: z.object({ ...sizeBase, weightLbFt: z.number() }),
});

const tubingSizes = defineCollection({
  loader: file("src/data/tubing-sizes.json"),
  schema: z.object({
    ...sizeBase,
    weightNueLbFt: z.number().nullable(),
    weightEueLbFt: z.number().nullable(),
  }),
});

const grades = defineCollection({
  loader: file("src/data/grades.json"),
  schema: z.object({
    group: z.number(),
    grade: z.string(),
    type: z.string(),
    yieldMinKsi: z.number(),
    yieldMaxKsi: z.number(),
    tensileMinKsi: z.number(),
    yieldMinMpa: z.number(),
    yieldMaxMpa: z.number(),
    tensileMinMpa: z.number(),
    colourBands: z.array(z.string()),
    colours: z.array(z.string()),
    use: z.string(),
  }),
});

export const collections = { products, casingSizes, tubingSizes, grades };
