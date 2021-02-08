const isDev = (process.env.NODE_ENV !== "production");

const path = require("path");
const globImporter = require("node-sass-glob-importer");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");

module.exports = {
  entry: {
    styles: ["./src/scss/styles.scss"],
    bundle: ["./src/js/common.js"],
    heroToggle: ["./src/js/heroToggle.js"],
    columnsToggle: ["./src/js/columnsToggle.js"],
    listOfLinks: ["./src/js/listOfLinks.js"],
  },
  output: {
    devtoolLineToLine: true,
    path: path.resolve(__dirname, "dist"),
    chunkFilename: "js/async/[name].chunk.js",
    pathinfo: true,
    filename: "js/[name].min.js",
    publicPath: "../",
  },
  module: {
    rules: [{
      test: /\.(config.js)$/,
      use: [
        {
          loader: "file-loader",
          options: {
            name: "[path][name].[ext]",
            outputPath: "./"
          }
        }
      ]
    },
      {
        test: /\.(png|jpe?g|gif)$/,
        use: [{
          loader: "file-loader",
          options: {
            name: "media/[name].[ext]?[hash]",
          },
        },
        ],
      },
      {
        test: /\.(woff|ttf|eot|svg)$/,
        include: [
          path.resolve(__dirname, "src/fonts")
        ],
        use: [{
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]",
          },
        },
        ],
      },
      {
        test: /modernizrrc\.js$/,
        loader: "expose-loader?Modernizr!webpack-modernizr-loader",
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.(css|sass|scss)$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              name: "[name].[ext]?[hash]",
            }
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: isDev,
              importLoaders: 2,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              "postcssOptions": {
                "config": path.join(__dirname, "postcss.config.js"),
              },
              sourceMap: isDev,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: isDev,
              sassOptions: {
                importer: globImporter()
              },
            },
          },
        ],
      },
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, "node_modules"),
    ],
    extensions: [".js", ".json"],
  },
  plugins: [
    new FriendlyErrorsWebpackPlugin(),
    new FixStyleOnlyEntriesPlugin(),
    new CleanWebpackPlugin(["dist"], {
      root: path.resolve(__dirname),
    }),
    new CopyPlugin({
      "patterns": [
        {
          "context": "./",
          "from": "node_modules/select2/dist/js/select2.min.js",
          "to": path.resolve(__dirname, "dist") + "/js/",
          "force": true,
          "flatten": true
        },
        {
          "context": "./",
          "from": "node_modules/select2/dist/css/select2.min.css",
          "to": path.resolve(__dirname, "dist") + "/css/",
          "force": true,
          "flatten": true
        }
      ]
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].min.css",
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
