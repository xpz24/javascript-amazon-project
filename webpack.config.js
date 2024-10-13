import path from 'path';
import { glob } from 'glob';

export default {
  // Entry points for production code and a separate entry for Jasmine tests
  entry: {
    amazon: './scripts/amazon.js',
    checkout: './scripts/checkout.js',
    orders: './scripts/orders.js',
    // orderSummary: './scripts/checkout/orderSummary.js',

    // Separate entry point for Jasmine test files
    jasmineTests: glob
      // .sync(['./tests/spec/**/*.js', './tests/src/**/*.js'])
      .sync('./tests/spec/**/*.js')
      .map((file) => `./${file.replace(/\\/g, '/')}`), // Glob to match all test files in the 'spec' folder
  },

  output: {
    filename: '[name].bundle.js', // Separate bundles for production code and test code
    path: path.resolve('dist'),
  },
  mode: 'development', // Change to 'production' for optimized builds

  module: {
    rules: [
      {
        test: /\.js$/, // Apply Babel loader to JavaScript files
        exclude: /node_modules/, // Exclude third-party modules from Babel processing
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                '@babel/preset-env',
                {
                  targets: {
                    edge: '129', // Target the latest version of Microsoft Edge
                  },
                  useBuiltIns: 'usage', // Include polyfills based on usage in your code
                  corejs: 3, // Use CoreJS version 3 for polyfills
                },
              ],
            ],
          },
        },
      },
      {
        test: /\.css$/i, // Apply this rule to CSS files
        use: ['style-loader', 'css-loader'], // Process and inject CSS
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },

  resolve: {
    fallback: {
      fs: false, // Disable 'fs' module as it's not needed in the browser
      path: false, // Disable 'path' module as well
    },
  },

  // Optional: Enable source maps for easier debugging in the browser
  // devtool: 'source-map',
};
