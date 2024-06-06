import { defineConfig } from '@pandacss/dev';
import { createPreset } from '@park-ui/panda-preset';

export default defineConfig({
  preflight: true,
  presets: [
    '@pandacss/preset-base',
    createPreset({
      accentColor: 'cyan',
      additionalColors: ['green', 'red'],
    }),
  ],

  patterns: {
    extend: {
      container: {
        defaultValues: {
          maxWidth: '5xl',
          p: 2,
        },
      },
    },
  },

  include: ['./src/**/*.{ts,tsx,js,jsx,astro}'],
  exclude: [],
  jsxFramework: 'react',
  jsxStyleProps: 'minimal',
  outdir: 'styled-system',
});
