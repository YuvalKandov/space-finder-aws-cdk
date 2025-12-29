const baseDir = '<rootDir>/test/services';

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [`${baseDir}/**/*test.ts`],
};