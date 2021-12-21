
import { override, addDecoratorsLegacy } from 'customize-cra';

const path = require('path');

module.exports = override(
  addDecoratorsLegacy(),
  (config) => {
    const devtoolMap = {
      development: 'cheap-module-source-map'
    };
    config.devtool = devtoolMap[config.mode] || false;
    return config;
  }
)