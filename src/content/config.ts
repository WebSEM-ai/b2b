import { defineCollection, z } from 'astro:content';

// Schema pentru blog posts
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Required fields
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),

    // Optional fields
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('WebSEM Team'),
    heroImage: z.string().optional(),
    heroImageAlt: z.string().optional(),

    // SEO
    ogImage: z.string().optional(),
    canonicalUrl: z.string().url().optional(),

    // Categorization
    category: z.enum([
      'seo',
      'lead-generation',
      'b2b-sales',
      'marketing',
      'ai',
      'email-outreach',
      'case-study',
      'tutorial'
    ]).default('marketing'),

    tags: z.array(z.string()).default([]),

    // Publishing
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),

    // Reading time (will be calculated automatically if not provided)
    readingTime: z.number().optional(),
  }),
});

// Schema pentru case studies (opțional, pentru viitor)
const caseStudiesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    client: z.string(),
    industry: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    heroImage: z.string().optional(),
    results: z.array(z.object({
      metric: z.string(),
      value: z.string(),
      description: z.string().optional(),
    })),
    testimonial: z.object({
      quote: z.string(),
      author: z.string(),
      role: z.string(),
    }).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = {
  'blog': blogCollection,
  'case-studies': caseStudiesCollection,
};
