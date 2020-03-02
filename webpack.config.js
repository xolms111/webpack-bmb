const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SpriteLoaderPlugin = require('svg-sprite-loader/plugin');
const webpack = require('webpack');

const PATHS = {
  src: path.join(__dirname, 'src'),
  dist: path.join(__dirname, 'dist'),
}

const PAGES_DIR = `${PATHS.src}/html/`;
const PAGES = fs.readdirSync(PAGES_DIR).filter(fileName => fileName.endsWith('.jade'));

module.exports = {
  entry: './src/js/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/main.[chunkhash].js',
    publicPath: 'dist/'
  },
  module: {
    rules: [{
        test: /\.scss$/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              sourceMap: true
            }
          }, {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              config: {
                path: './postcss.config.js'
              }
            }
          }, {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.jade$/,
        loader: 'pug-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          }
        }]
      },
      {
        test: /\.svg$/,
        include: path.resolve(__dirname, 'src/icons'),
        use: [
          'svg-sprite-loader',
          'svgo-loader'
        ]
      },
      {
        test: /images[\\\/].+\.(gif|png|jpe?g|svg)$/i,
        include: path.resolve(__dirname, 'src/images'),
        use: [{
            loader: 'file-loader',
            options: {
              name: 'images/[name][hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 70
              }
            }
          },
        ],
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "styles/[name].[chunkhash].css",
    }),
    ...PAGES.map(page => new HtmlWebpackPlugin({
      template: `${PAGES_DIR}/${page}`,
      filename: `./${page.replace(/\.jade/,'.html')}`
    })),
    new SpriteLoaderPlugin(),
    new webpack.ProvidePlugin({
      '$': 'jquery'
    }),
    new CopyWebpackPlugin([{
        from: __dirname + '/src/images',
        to: __dirname + '/dist/images'
      },
      {
        from: __dirname + '/src/fonts',
        to: __dirname + '/dist/fonts'
      },
    ]),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    //compress: true,
    overlay: true,
    port: 8000
  }
};