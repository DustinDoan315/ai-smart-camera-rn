const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  '@': path.resolve(__dirname, 'src'),
  '@ui': path.resolve(__dirname, 'src/ui'),
  '@core': path.resolve(__dirname, 'src/core'),
  '@app': path.resolve(__dirname, 'src/app'),
  '@state': path.resolve(__dirname, 'src/state'),
  '@data': path.resolve(__dirname, 'src/data'),
  '@domain': path.resolve(__dirname, 'src/domain'),
  '@services': path.resolve(__dirname, 'src/services'),
  '@assets': path.resolve(__dirname, 'src/assets'),
};

module.exports = config;
