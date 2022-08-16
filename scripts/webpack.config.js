const path = require('path');

module.exports = {
  entry: './entry.js',
  mode: "development",
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
    filename: 'scripts.js',
    path: path.resolve(__dirname, 'bin'),
  },
};