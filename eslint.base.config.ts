import { FlatCompat } from '@eslint/eslintrc';

import nxEslintPlugin from '@nx/eslint-plugin';
import * as eslintJsModule from '@eslint/js';

type EslintJsConfigModule = {
  configs?: {
    recommended?: object;
  };
  default?: {
    configs?: {
      recommended?: object;
    };
  };
};

const eslintJs = ((eslintJsModule as EslintJsConfigModule).default ?? eslintJsModule) as EslintJsConfigModule;

const compat = new FlatCompat({
  baseDirectory: process.cwd(),
  recommendedConfig: eslintJs.configs?.recommended,
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
