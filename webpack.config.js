const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: './frontend/main.js',
    quiz: './frontend/assets/js/quiz.js',
    chess: './frontend/assets/js/chess.js',
    mathmine: './frontend/assets/js/mathmine.js',
    fouroperations: './frontend/assets/js/fouroperations.js',
    colorstheory: './frontend/assets/js/colorstheory.js',
    canva: './frontend/assets/js/canva.js',
    library: './frontend/assets/js/library.js',
    wordcompletion: './frontend/assets/js/wordcompletion.js',
    logicgame: './frontend/assets/js/logicgame.js'
  },
  output: {
    path: path.resolve(__dirname, 'public', 'assets'),
    filename: 'js/[name].js',
  },
  plugins: [
    new CleanWebpackPlugin({
      cleanOnceBeforeBuildPatterns: ['js/**/*', 'css/**/*'],
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        type: 'javascript/esm',
        use: {
          loader: 'babel-loader',
          options: {
            presets: [['@babel/preset-env', { modules: false }]],
          },
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  devtool: 'source-map',
};
