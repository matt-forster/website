const { getJestProjects } = require('@nrwl/jest');

module.exports = {
  transformIgnorePatterns: ["/node_modules/(?!@testing-library/react)"],
  projects: getJestProjects(),
};
