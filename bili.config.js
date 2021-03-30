'use strict';

const path = require('path');

/** @type {import('bili').Config} */
module.exports = {
  input: {
    'tce-tiptap': 'src/index.js'
  },
  output: {
    format: ['cjs', 'esm', 'umd', 'umd-min'],
    moduleName: 'TceTiptap'
  },
  externals: [
    /@babel\/runtime/
  ],
  bundleNodeModules: ['rollup-plugin-vue', 'vue-runtime-helpers'],
  plugins: {
    vue: true,
    'tailor-ce': true,
    postcss: {
      extract: 'tce-tiptap.css'
    },
    babel: {
      babelHelpers: 'runtime',
      sourceMap: true,
      extensions: ['.js', '.vue']
    },
    alias: {
      resolve: ['.vue', '.js'],
      entries: [
        { find: '@', replacement: path.resolve(__dirname, './src') }
      ]
    },
    visualizer: {
      sourceMap: true,
      open: false
    },
    replace: {
      preventAssignment: true
    }
  },
  resolvePlugins: {
    alias: require('@rollup/plugin-alias'),
    'tailor-ce': require('@extensionengine/rollup-plugin-tailor-ce')
  }
};
