const glob = require('glob');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = function (options) {
  return {
    ...options,
    entry: () => {
      const accountMigrations = {};
      glob
        .sync('libs/accounts/accounts-domain/src/migrations/*.ts')
        .forEach((filename, ind) => {
          const name = path.basename(filename, path.extname(filename));
          accountMigrations[`accountMigrations_${ind}`] = {
            import: filename,
            filename: `migrations/accounts/${name}.js`,
          };
        });
      return {
        main: {
          import: 'src/main.ts',
          filename: 'main.js',
        },
        ...accountMigrations,
      };
    },
    plugins: [
      ...options.plugins,
      new CopyPlugin({
        patterns: [
          {
            from: 'libs/accounts/accounts-domain/src/migrations/*.sql',
            to: 'migrations/accounts/[name].[ext]',
          },
        ],
      }),
    ],
    output: {
        library: {
            type: 'commonjs'
        }
    },
  };
};
