/*
 * For a detailed explanation regarding each configuration property and type check, visit:
 * https://jestjs.io/docs/configuration
 */

export default {
  coverageProvider: "v8",
  preset: "ts-jest",
  testMatch: ["**/__tests__/integration/**/*.[jt]s?(x)"],
  testTimeout: 10000,
};
