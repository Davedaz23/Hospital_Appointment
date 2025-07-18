const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

// Merge your custom resolver settings
defaultConfig.resolver.assetExts = [
  ...defaultConfig.resolver.assetExts, // Keep Expo's defaults
  'png', 'jpg', 'jpeg', 'gif', 'svg', // Add your extensions
];

module.exports = defaultConfig;