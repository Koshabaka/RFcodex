const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

module.exports = mergeConfig(defaultConfig, {
  transformer: {
    minifierConfig: {
      keep_classnames: true,
      keep_fnames: true,
    },
  },
  resolver: {
    assetExts: [...defaultConfig.resolver.assetExts, 'db'],
  },
});
