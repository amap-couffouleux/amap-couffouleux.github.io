import { z, defineCollection } from 'astro:content';

const contracts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    icon: z.string(),
    isOpened: z.boolean(),
    rythme: z.enum(['weekly', 'bimonthly', 'monthly', 'bimester', 'quarterly', 'yearly']),
    dates: z.array(z.date()),
    color: z.string(),
  }),
});

export const collections = {
  contracts,
};
