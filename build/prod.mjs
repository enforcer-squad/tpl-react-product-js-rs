import { rspack } from '@rspack/core';
import { defineConfig } from '@rspack/cli';
// import { RsdoctorRspackPlugin } from '@rsdoctor/rspack-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import { merge } from 'webpack-merge';
import base from './base.mjs';
import { subDir } from './helper.mjs';

const { SwcJsMinimizerRspackPlugin } = rspack;

const prod = defineConfig({
  mode: 'production',
  devtool: false,
  output: {
    filename: subDir('js/[name].[contenthash:8].js'),
    chunkFilename: subDir('js/[name].[contenthash:8].js'),
  },
  optimization: {
    moduleIds: 'deterministic',
    chunkIds: 'deterministic',
    minimize: true,
    minimizer: [new SwcJsMinimizerRspackPlugin()],
  },
  plugins: [
    // new BundleAnalyzerPlugin({
    //   analyzerPort: 8899,
    // }),
    // new RsdoctorRspackPlugin({}),
  ],
});

export default merge(base, prod);
