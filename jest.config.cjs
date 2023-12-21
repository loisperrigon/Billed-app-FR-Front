module.exports = {
    verbose: false,
    setupFiles: ["./setup-jest.js"],
    collectCoverageFrom: [
        "**/*.{js,jsx}",
        "!**/app/**",
        "!**/assets/**",
        "!**/external/**",
        "!**/fixtures/**",
        "!**/lcov-report/**"
    ],
    transform: {
        "^.+\\.jsx?$": "babel-jest"
    },
    moduleNameMapper: {
        "^node-fetch$": "node-fetch"
    }
};
