const { pathsToModuleNameMapper } = require('ts-jest')
const { compilerOptions } = require('./tsconfig.json')

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  passWithNoTests: true,
  snapshotSerializers: ['jest-serializer-path'],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths || {}),
  testMatch: ['**/__tests__/**/*.+(js|jsx|ts|tsx)'],
  testPathIgnorePatterns: ['/__fixtures__/', '/\\.'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx)$'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
}
