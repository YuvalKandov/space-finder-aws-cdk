const baseDir = '<rootDir>/test/infra';

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: [`${baseDir}/**/*test.ts`],
};