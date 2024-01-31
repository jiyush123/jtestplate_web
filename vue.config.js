const { defineConfig } = require('@vue/cli-service');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
// module.exports = defineConfig({
//   transpileDependencies: true
// })

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['python','javascript'], // 添加支持的语言列表
      }),
    ],
  },
});
