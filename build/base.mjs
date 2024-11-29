import { defineConfig } from '@rspack/cli';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { rspack } from '@rspack/core';
import { isProd,  resolve, getCSSModuleRules } from './helper.mjs';
import { ENV, Polyfill } from './config.mjs';

const { HtmlRspackPlugin } = rspack;

const base = defineConfig({
  target: 'web',
  entry: {
    index: resolve('./src/index.js'),
  },
  output: {
    clean: true,
    path: resolve('dist'),
    publicPath: ENV[process.env.BUILD_ENV].PUBLIC_PATH,
    filename: '[name].js',
  },
  resolve: {
    alias: {
      '@': resolve('./src'),
    },
    extensions: ['.js', '.jsx', '.json', '.glsl'],
  },
  experiments: {
    css: true,
  },
  module: {
    parser: {
      'css/module': {
        namedExports: false,
      },
    },
    rules: [
      {
        test: /\.js[x]?$/,
        include: [resolve('./src'), resolve('./demos')],
        use: [
          {
            loader: 'builtin:swc-loader',
            options: {
              sourceMap: !isProd,
              jsc: {
                parser: {
                  syntax: 'ecmascript',
                  jsx: true,
                },
                transform: {
                  react: {
                    pragma: 'React.createElement',
                    pragmaFrag: 'React.Fragment',
                    runtime: 'automatic',
                    development: !isProd,
                    refresh: !isProd,
                  },
                },
              },
              env: Polyfill,
              rspackExperiments: {
                import: [
                  {
                    libraryName: 'antd',
                    style: '{{member}}/style/index.css',
                  },
                ],
              },
            },
          },
        ],
      },
      ...getCSSModuleRules(),
    ],
  },
  plugins: [
    new HtmlRspackPlugin({
      template: resolve(`/index.html`),
      filename: `index.html`,
      minify: true,
    }),
    new ModuleFederationPlugin({
      name: 'federation_provider',
      filename: 'remoteEntry.js',
      exposes: {
        './button': resolve('./src/button/index.jsx'),
        './mf': resolve('./src/mf.js'),
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
      },
      dts: false,
      // getPublicPath: `return "//" + window.location.host + "/federation_provider"`,
    }),
  ],
});

export default base;
