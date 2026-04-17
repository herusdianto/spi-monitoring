const path = require('path');
const webpack = require('webpack');
const { DefinePlugin } = webpack;
const dotenv = require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const envVars = {
  'process.env.VITE_FIREBASE_API_KEY': JSON.stringify(dotenv.parsed.VITE_FIREBASE_API_KEY),
  'process.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(dotenv.parsed.VITE_FIREBASE_AUTH_DOMAIN),
  'process.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(dotenv.parsed.VITE_FIREBASE_PROJECT_ID),
  'process.env.VITE_FIREBASE_STORAGE_BUCKET': JSON.stringify(dotenv.parsed.VITE_FIREBASE_STORAGE_BUCKET),
  'process.env.VITE_FIREBASE_MESSAGING_SENDER_ID': JSON.stringify(dotenv.parsed.VITE_FIREBASE_MESSAGING_SENDER_ID),
  'process.env.VITE_FIREBASE_APP_ID': JSON.stringify(dotenv.parsed.VITE_FIREBASE_APP_ID)
};

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const mode = process.env.NODE_ENV || 'development';
const isProduction = mode === 'production';

module.exports = {
  mode,
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: isProduction ? '[name].[contenthash].js' : '[name].js',
    publicPath: '/',
    clean: true
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'vue': 'vue/dist/vue.esm-bundler.js'
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader'
        ]
      },
      {
        test: /\.s[ac]ss$/,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff2?|eot|ttf|otf)$/i,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template: './public/index.html',
      title: 'SPI Monitoring'
    }),
    new DefinePlugin({
      ...envVars,
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      process: JSON.stringify({
        env: {
          NODE_ENV: mode
        }
      })
    }),
    ...(isProduction ? [new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css'
    })] : [])
  ],
  devServer: {
    port: 8080,
    hot: true,
    historyApiFallback: true,
    proxy: [
      {
        context: ['/api'],
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    ]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    },
    runtimeChunk: 'single'
  },
  devtool: isProduction ? 'source-map' : 'eval-source-map'
};