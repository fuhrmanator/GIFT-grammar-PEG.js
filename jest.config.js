module.exports = {
  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // The paths to modules that run some code to configure or set up the testing environment before each test
  setupFiles: [],

  // The test environment that will be used for testing
  testEnvironment: "node",

  // The glob patterns Jest uses to detect test files
  testMatch: ["**/tests/**/*.js"],

  // An array of regexp pattern strings that are matched against all test paths, matched tests are skipped
  testPathIgnorePatterns: ["/node_modules/"],

  // An array of regexp pattern strings that are matched against all source file paths, matched files will skip transformation
  transformIgnorePatterns: ["/node_modules/"],
};