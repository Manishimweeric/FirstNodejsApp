export default {
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testEnvironment: "node",
  moduleFileExtensions: ["js", "jsx"],
  transformIgnorePatterns: ["/node_modules/"],
  testTimeout: 30000,  // Set a longer global timeout (30 seconds)
};
