import path from 'path';
import {fileURLToPath} from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url));

module.exports = {
  entry: path.resolve(__dirname, './src/index.ts'),
  mode: profileEnd,
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
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
};