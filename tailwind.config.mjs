import { createGlobPatternsForDependencies } from '@nx/angular/tailwind';

import daisyui from 'daisyui';
import { join } from 'path';

/** @type {import('tailwindcss').Config} */
export default {
  content: [join(__dirname, 'src/**/!(*.stories|*.spec).{ts,html}'), ...createGlobPatternsForDependencies(__dirname)],
  daisyui: {
    themes: [
      'black',
      'cupcake',
      {
        domi: {
          primary: '#00bbff',
          secondary: '#00d5f1',
          accent: '#ff5500',
          neutral: '#181211',
          'base-100': '#2e2726',
          info: '#0082ff',
          success: '#00c956',
          warning: '#ff8200',
          error: '#ff005a',
        },
      },
    ],
  },
  corePlugins: {
    container: false,
  },
  plugins: [
    daisyui,
    ({ addComponents, theme }) => {
      addComponents({
        '.container': {
          '@apply px-4 mx-auto': {},
          maxWidth: theme('screens.2xl'),
        },
      });
    },
  ],
};
