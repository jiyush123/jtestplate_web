const { defineConfig } = require('@vue/cli-service');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devServer: {
      client: {
        overlay: false, // 禁用内置错误覆盖层
      },
    },
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['python','javascript'], // 添加支持的语言列表
      }),
    ],
  },
});
