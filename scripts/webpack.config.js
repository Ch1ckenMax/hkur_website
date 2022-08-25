const path = require('path');

module.exports = {
  entry: {
    global: './entry_point/global.js',
    index: './entry_point/index.js'
  },
  mode: "production",
  devtool: false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'bin'),
  },
};