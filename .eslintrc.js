module.exports = {
  extends: ['next/core-web-vitals'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'react-hooks/exhaustive-deps': 'warn',
  },
  ignorePatterns: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
};
