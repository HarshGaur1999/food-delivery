module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
          '@presentation': './src/presentation',
          '@domain': './src/domain',
          '@data': './src/data',
          '@store': './src/store',
          '@services': './src/services',
          '@utils': './src/utils',
          '@config': './src/config',
          '@navigation': './src/navigation',
        },
      },
    ],
  ],
};
