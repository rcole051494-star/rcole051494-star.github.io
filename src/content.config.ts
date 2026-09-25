import { z, defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

const profileCollection = defineCollection({
  loader: glob({ pattern: "**/*.{yml,yaml,json}", base: "./src/content/profile" }),
  schema: z.object({
    name: z.string(),
    headline: z.string(),
    target_roles: z.array(z.string()),
    location: z.string(),
    availability: z.string(),
    bio_short: z.string(),
    origin_story: z.string(),
    links: z.object({
      github: z.string().url(),
      linkedin: z.string().url(),
      labs: z.string().url().optional(),
    }),
    resume: z.object({
      file: z.string(),
      sha256: z.string(),
      signature: z.string(),
    })
  })
});

const caseFilesCollection = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/case-files" }),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    summary: z.string(),
    date: z.string(),
    environment: z.string(),
    duration_hours: z.number(),
    difficulty: z.enum(["beginner", "intermediate", "advanced"]),
    attack_techniques: z.array(z.string()),
    tools: z.array(z.string()),
    skills: z.array(z.string()),
    frameworks: z.array(z.string()),
    featured: z.boolean().default(false),
  })
});

const credentialsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{yml,yaml,json}", base: "./src/content/credentials" }),
  schema: z.object({
    name: z.string(),
    issuer: z.string(),
    date: z.string(),
    status: z.enum(["earned", "in-progress", "planned"]),
    verify_url: z.string().url().optional().or(z.literal("")),
  })
});

const timelineCollection = defineCollection({
  loader: glob({ pattern: "**/*.{yml,yaml,json}", base: "./src/content/timeline" }),
  schema: z.object({
    period: z.string(),
    title: z.string(),
    note: z.string(),
  })
});

const sessionsCollection = defineCollection({
  loader: glob({ pattern: "**/*.{yml,yaml,json}", base: "./src/content/sessions" }),
  schema: z.object({
    date: z.string(),
    type: z.enum(["lab", "ctf", "room", "reading"]),
    title: z.string(),
    takeaway: z.string(),
  })
});

export const collections = {
  'profile': profileCollection,
  'case-files': caseFilesCollection,
  'credentials': credentialsCollection,
  'timeline': timelineCollection,
  'sessions': sessionsCollection,
};
