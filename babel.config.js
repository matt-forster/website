module.exports = {
  presets: [
    ['@babel/preset-env', {
      targets: {
        node: 'current'
      }
    }],
    '@babel/preset-typescript',
    'babel-preset-solid',
    'babel-preset-jest'
  ],
  plugins: [
    '@babel/plugin-transform-runtime'
  ]
};
