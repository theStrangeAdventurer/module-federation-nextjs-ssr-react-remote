const { NextFederationPlugin } = require('@module-federation/nextjs-mf');

const remotes = ({ isServer }) => {
  const port = isServer ? 3003 : 3002;
  return {
    remote: `remote@http://localhost:${port}/remote.js`, // client
  }
}

module.exports = {
  webpack(config, options) {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'host',
        remotes: remotes({ isServer: options.isServer }),
        filename: 'static/chunks/remoteEntry.js',
      }),
    );

    return config;
  },
};
