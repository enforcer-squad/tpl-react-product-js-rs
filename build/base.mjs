import { defineConfig } from '@rspack/cli';
// import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
import { rspack } from '@rspack/core';
import { isProd,  resolve,subDir, getCSSModuleRules } from './helper.mjs';
import { ENV, Polyfill } from './config.mjs';

const { HtmlRspackPlugin,CopyRspackPlugin } = rspack;

const base = defineConfig({
  target: 'web',
  entry: {
    index: resolve('./src/index.js'),
  },
  output: {
    clean: true,
    path: resolve(ENV[process.env.NODE_ENV].PATH),
    publicPath: ENV[process.env.NODE_ENV].PUBLIC_PATH,
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
        include: [resolve('./src')],
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
                    libraryName: '@arco-design/web-react',
                    libraryDirectory: 'es',
                    style: true,
                    camel2DashComponentName: false
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
    new CopyRspackPlugin({
      patterns: [
        {
          from: resolve('/public'),
          to: subDir('/'),
        },
      ],
    }),
    new HtmlRspackPlugin({
      template: resolve(`/index.html`),
      filename: `index.html`,
      minify: true,
    }),
    // new ModuleFederationPlugin({
    //   name: 'federation_provider',
    //   filename: 'remoteEntry.js',
    //   shared: {
    //     react: { singleton: true, requiredVersion: '^18.0.0' },
    //     'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
    //   },
    //   // getPublicPath: `return "//" + window.location.host + "/federation_provider"`,
    // }),
  ],
});

export default base;
