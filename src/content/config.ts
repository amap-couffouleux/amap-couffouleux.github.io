import { z, defineCollection } from 'astro:content';
// import { colors, type Colors } from '~/lib/colors';

const contracts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    icon: z.string(),
    from: z.string(),
    isOpened: z.boolean(),
    rythme: z.enum(['weekly', 'bimonthly', 'monthly', 'bimester', 'quarterly', 'yearly']),
    defaultNote: z.string().optional(),
    distributions: z.array(
      z.object({
        date: z.date(),
        note: z.string().optional(),
      })
    ),
    // color: z.custom<Colors>((v) => Object.keys(colors).includes(v as string)),
  }),
});

export const collections = {
  contracts,
};
