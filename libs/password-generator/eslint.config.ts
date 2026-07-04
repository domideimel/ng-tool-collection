import angular from 'angular-eslint';
import { FlatCompat } from '@eslint/eslintrc';

import js from '@eslint/js';
// eslint-disable-next-line @nx/enforce-module-boundaries
import baseConfig from '../../eslint.base.config';

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  ...baseConfig,

  ...baseConfig,
  { files: ['**/*.ts'], processor: angular.processInlineTemplates },
  ...compat.config({ extends: ['plugin:@nx/angular'] }).map(config => ({
    ...config,
    files: ['**/*.ts'],
    rules: {
      ...config.rules,
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'lib',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'lib',
          style: 'kebab-case',
        },
      ],
    },
  })),
  ...compat
    .config({
      extends: ['plugin:@nx/angular-template'],
    })
    .map(config => ({
      ...config,
      files: ['**/*.html'],
      rules: {
        ...config.rules,
      },
    })),
];
