const path = require('path');
const glob = require('glob');

const CopyPlugin = require('copy-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('@nuxt/friendly-errors-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts');
const { merge } = require('webpack-merge');

// Handle entry points.
const Entries = () => {
  let entries = {
    styles: ['./src/scss/styles.scss'],
    ckeditor: ['./src/scss/ckeditor.scss'],
  };

  const pattern = './src/js/**/*.js';
  const ignore = [];

  glob.sync(pattern, {ignore: ignore}).map((item) => {
    entries[path.parse(item).name] = `./${item}` }
  );
  return entries;
};


module.exports = (env, args) => {

  const isDev = (args.mode === 'development');

  // Set the base config
  const config = {
    entry() {
      return Entries();
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      chunkFilename: 'js/async/[name].chunk.js',
      pathinfo: isDev,
      filename: 'js/[name].min.js',
      publicPath: '../',
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(woff|ttf|eot|svg)$/,
          include: [
            path.resolve(__dirname, 'src/fonts')
          ],
          generator: {
            filename: 'fonts/[name][ext]'
          },
          type: 'asset/resource',
        },
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
          type: 'javascript/auto',
        },
        {
          test: /\.(css|sass|scss)$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: isDev,
                importLoaders: 2,
                esModule: false,
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                'postcssOptions': {
                  'config': path.join(__dirname, 'postcss.config.js'),
                },
                sourceMap: isDev,
              },
            },
            {
              loader: 'sass-loader',
              options: {
                sourceMap: isDev,
                additionalData: "$debug_mode: " + isDev + ";",
              },
            },
          ],
          type: 'javascript/auto',
        },
      ],
    },
    resolve: {
      modules: [
        path.join(__dirname, 'node_modules'),
      ],
      extensions: ['.js', '.json'],
    },
    plugins: [
      new FriendlyErrorsWebpackPlugin(),
      new RemoveEmptyScriptsPlugin(),
      new CopyPlugin({
        'patterns': [
          {
            'from': 'node_modules/select2/dist/js/select2.min.js',
            'to': path.resolve(__dirname, 'dist') + '/js/',
            'force': true,
          },
          {
            'from': 'node_modules/select2/dist/css/select2.min.css',
            'to': path.resolve(__dirname, 'dist') + '/css/',
            'force': true,
          }
        ]
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].min.css',
      }),
    ],
    watchOptions: {
      aggregateTimeout: 300,
    },
    // Tell us only about the errors.
    stats: 'errors-only',
    // Suppress performance errors.
    performance: {
      hints: false,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000
    }
  };

  // Set the config for different modes, development or production.
  if (args.mode === 'development') {
    const SourceMapDevToolPlugin = require('webpack/lib/SourceMapDevToolPlugin');

    return merge(config, {
      mode: 'development',
      devtool: 'eval-source-map',
      plugins: [
        new SourceMapDevToolPlugin({
          filename: '[file].map',
          exclude: [/node_modules/, /images/, /spritemap/, /svg-sprites/],
        })
      ]
    });
  }
  else {
    const TerserPlugin = require('terser-webpack-plugin');

    return merge(config, {
      mode: 'production',
      devtool: false,
      optimization: {
        minimize: true,
        minimizer: [
          new TerserPlugin({
            terserOptions: {
              ecma: 2020,
              mangle: {
                reserved:[
                  'Drupal',
                  'drupalSettings'
                ]
              },
              format: {
                comments: false,
              },
            },
            extractComments: false,
          }),
        ],
      },
    });
  }
};
