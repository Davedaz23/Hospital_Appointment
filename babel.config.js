module.exports = {
  presets: [
    ['babel-preset-expo', {
      // Required for Metro to work properly
      unstable_transformProfile: 'hermes-stable'
    }],
    ['@babel/preset-react', {
      runtime: 'automatic' // This is crucial for React 17+
    }]
  ],
  plugins: [
    // Add any other plugins you need
    '@babel/plugin-transform-react-jsx'
  ]
};
