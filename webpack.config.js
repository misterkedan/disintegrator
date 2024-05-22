const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  entry: ['./src/main.js', './src/css/reset.css', './src/css/main.css'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[contenthash].js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(glsl)$/,
        exclude: /node_modules/,
        loader: 'raw-loader',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'src/html/index.html' }),
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
  ],
};

module.exports = (env, argv) => {
  if (argv.mode === 'development')
    return {
      ...config,
      mode: 'development',
      devtool: 'inline-source-map',
      devServer: {
        static: {
          directory: path.resolve(__dirname, 'dist'),
        },
        host: '192.168.1.10',
        port: 8080,
      },
    };

  return {
    ...config,
    mode: 'production',
    optimization: {
      minimize: true,
      usedExports: true,
      minimizer: [new TerserPlugin({ extractComments: false })],
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };
};
