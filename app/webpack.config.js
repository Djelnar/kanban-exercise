const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: "./src/index.tsx",
  mode: "development",
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    historyApiFallback: true,
    compress: true,
    port: 9000,
  },
  devtool: "source-map",
  output: {
    filename: "bundle.js",
    path: path.resolve("dist"),
    publicPath: "/",
  },
  resolve: {
    extensions: [
      '.js',
      '.jsx',
      '.ts',
      '.tsx',
    ],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },
  module: {
    rules:[
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
          test: /\.(png|svg|gif|jpg|jpeg|eot)$/,
          loader: 'url-loader'
      },
      {
        test: /\.(woff|woff2|ttf)$/,
        type: 'asset/resource'
      },

      {
        test: /skin\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /content\.css$/i,
        use: ['css-loader'],
      },
      {
          test:/\.s?css$/,
          use:[
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: './'
              }
            },
              'css-loader',
              'sass-loader'
            ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: './public/index.html',
    }),
    new MiniCssExtractPlugin(),
    ],
}
