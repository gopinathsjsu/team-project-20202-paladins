import eslintConfig from '@eslint/js';
import reactPlugin from 'eslint-plugin-react';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  eslintConfig.configs.recommended,
  {
    files: ['**/*.js', '**/*.jsx'],
    plugins: {react: reactPlugin, prettier: prettierPlugin},
    rules: {
      'react/react-in-jsx-scope': 'off',
      'prettier/prettier': 'error',
    },
  },
];