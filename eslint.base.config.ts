import { FlatCompat } from '@eslint/eslintrc';

import nxEslintPlugin from '@nx/eslint-plugin';
import js from '@eslint/js';

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js?.configs?.recommended,
});

export default [
  { plugins: { '@nx': nxEslintPlugin } },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: 'type:feature',
              onlyDependOnLibsWithTags: [
                'type:shared',
                'domain:tools',
                'domain:ui',
                'domain:models',
                'domain:constants',
                'domain:utils',
                'domain:home',
                'type:feature',
              ],
            },
            {
              sourceTag: 'type:shared',
              onlyDependOnLibsWithTags: ['type:shared'],
            },
          ],
        },
      ],
    },
  },
  ...compat
    .config({
      extends: ['plugin:@nx/typescript'],
    })
    .map(config => ({
      ...config,
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        ...config.rules,
      },
    })),
  ...compat
    .config({
      extends: ['plugin:@nx/javascript'],
    })
    .map(config => ({
      ...config,
      files: ['**/*.js', '**/*.jsx'],
      rules: {
        ...config.rules,
      },
    })),
];
