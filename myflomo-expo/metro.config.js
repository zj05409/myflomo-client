const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// 添加 CSS 和 JS 文件扩展名到 assetExts
config.resolver.assetExts.push('css', 'js');

module.exports = config; 