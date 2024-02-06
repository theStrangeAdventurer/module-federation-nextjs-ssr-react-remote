const HtmlWebpackPlugin = require('html-webpack-plugin');
const { NodeFederationPlugin, StreamingTargetPlugin } = require('@module-federation/node');

const { ModuleFederationPlugin } = require('webpack').container;
const path = require('path');

const config = (env = 'client') => {
  const isServer = env === 'server';
  const port = isServer ? 3003 : 3002;

  const output = {
    publicPath: `http://localhost:${port}/`,
    filename: '[name]-[contenthash].js',
    path: path.join(__dirname, 'dist', env),
  };

  const shared = {
    '@stitches/react': {
      singleton: true,
    },
    react: {
      singleton: true,
      version: '0',
      requiredVersion: false,
    },
    'react-dom': {
      requiredVersion: false,
      singleton: true,
      version: '0',
    },
  };

  const externals = {
    '@stitches/react': '@stitches/react',
    react: 'react',
    'react-dom': 'react-dom',
  };

  const federatedOptions = {
    name: 'remote',
    remotes: {},
    filename: 'remote.js',
    exposes: {
      './Button': './src/Button',
    },
  };

  const plugins = () => {
    if (isServer) {
      return [
        new NodeFederationPlugin({
          ...federatedOptions,
          library: { type: 'commonjs-module', name: 'remote' },
          shared,
        }),
        new StreamingTargetPlugin({
          name: federatedOptions.name,
          library: { type: "commonjs-module", name: 'remote' },            
          remotes: {},
        }),
      ]
    }
    return [
      new ModuleFederationPlugin({
        ...federatedOptions,
        library: { type: 'var', name: 'remote' },
        shared,
      }),
      new HtmlWebpackPlugin({
        template: './public/index.html',
      }),
    ]
  }
  /**
   * @type {import('webpack').Configuration}
   */
  const _config = {
    target: isServer ? false : 'web',
    entry: './src/index',
    mode: 'development',
    externals: isServer ? externals : undefined,
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist', env),
      },
      port: 3002,
    },
    output: {
      ...output,
      ...(isServer ? { chunkFormat: 'commonjs', library: { type: 'commonjs2', name: 'remote' } } : {})
    },
    optimization: {
      splitChunks: false,
      minimize: false,
    },
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          loader: 'babel-loader',
          exclude: /node_modules/,
          options: {
            presets: ['@babel/preset-react'],
          },
        },
      ],
    },
    plugins: plugins(),
  }

  return _config;
};

module.exports = [config('client'), config('server')];