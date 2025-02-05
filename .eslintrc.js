module.exports = {
  overrides: [
    {
      files: ['*.js', '*.jsx', '*.ts', '*.tsx'],
      extends: 'love'
    }
  ],
  rules: {
    "@typescript-eslint/strict-boolean-expressions": "off"
  }
}