// webpack.config.js

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = ({ mode } = { mode: 'production' }) => {
  console.log(`mode is: ${mode}`);

  return {
    mode,
    entry: './src/index.js',
    output: {
      publicPath: '/',
      path: path.resolve(__dirname, 'build'),
      filename: 'main.js',
    },
    resolve: {
      extensions: ['.jsx', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.jpe?g|png$/,
          exclude: /node_modules/,
          use: ['url-loader', 'file-loader'],
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.(sass|less|css)$/,
          use: ['style-loader', 'css-loader', 'less-loader'],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ],
  };
};
