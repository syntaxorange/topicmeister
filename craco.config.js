const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      // TODO: remove
      webpackConfig.optimization.minimize = false;
      const htmlWebpackPluginInstance = webpackConfig.plugins.find(
        (webpackPlugin) => webpackPlugin instanceof HtmlWebpackPlugin
      );

      if (htmlWebpackPluginInstance) {
        htmlWebpackPluginInstance.userOptions.excludeChunks = ["content", "background"];
      }
      
      return {
        ...webpackConfig,
        entry: {
          main: [env === 'development' &&
            require.resolve('react-dev-utils/webpackHotDevClient'), paths.appIndexJs].filter(Boolean),
          content: './src/content/content.js',
          background: './src/backend/background.js'
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