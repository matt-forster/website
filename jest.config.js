const esModules = ['solid-styled-components'].join('|');

module.exports = {
  preset: "solid-jest/preset/browser",
  "moduleNameMapper": {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less)$": "<rootDir>/__mocks__/styleMock.js"
  },
  setupFilesAfterEnv: [
    "<rootDir>/jest-setup.ts"
  ],
  transform: {
    '^.+\\.js?$': require.resolve('babel-jest'),
  },
  transformIgnorePatterns: [`/node_modules/(?!(${esModules})/).*/`]
}
