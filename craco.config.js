const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      const htmlWebpackPluginInstance = webpackConfig.plugins.find(
        (webpackPlugin) => webpackPlugin instanceof HtmlWebpackPlugin
      );

      if (htmlWebpackPluginInstance) {
        htmlWebpackPluginInstance.userOptions.excludeChunks = ["content"];
      }
      
      return {
        ...webpackConfig,
        entry: {
          main: [env === 'development' &&
            require.resolve('react-dev-utils/webpackHotDevClient'), paths.appIndexJs].filter(Boolean),
          content: './src/chrome/content.js',
        },
        output: {
          ...webpackConfig.output,
          filename: 'static/js/[name].js',
        },
        optimization: {
          ...webpackConfig.optimization,
          runtimeChunk: false,
        }
      }
    },
  }
}