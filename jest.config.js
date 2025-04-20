const esModules = ['solid-js', 'solid-testing-library', 'solid-meta', 'solid-styled-components', 'seroval', 'seroval-plugins'].join('|');

module.exports = {
  preset: "solid-jest/preset/browser",
  moduleNameMapper: {
    "\\.svg$": "<rootDir>/__mocks__/svgMock.js",
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__mocks__/fileMock.js",
    "\\.(css|less|scss|sass)$": "identity-obj-proxy"
  },
  setupFilesAfterEnv: [
    "<rootDir>/jest-setup.ts"
  ],
  transform: {
    "^.+\\.(ts|tsx|js|jsx)$": "babel-jest"
  },
  transformIgnorePatterns: [`/node_modules/(?!(${esModules})/).*/`],
  testEnvironment: "jsdom"
}
