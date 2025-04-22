// jest.config.js
module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest",
  },
  transformIgnorePatterns: [
    // Include axios 
    "/node_modules/(?!axios)/"
  ],
  moduleNameMapper: {
    "^axios$": require.resolve("axios"),
  },
};
