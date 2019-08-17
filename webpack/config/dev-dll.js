const path = require('path');
const webpack = require('webpack');

const NODE_ENV = 'development';

const common = require('./common');
const outputRoot = common.devOutputRoot;

// 资源依赖包，提前编译
const vendors = [
    '@antv/data-set',
    '@antv/g2',
    'antd',
    'axios',
    'fbjs',
    'prop-types',
    'query-string',
    'draft-js',
    'rc-table',
    'immutable',
    'moment',
    'punycode',
    'events',
    'css-hot-loader',
    'regenerator-runtime',
    'html-entities',
    'history',
    'react',
    'react-dom',
    'react-redux',
    'react-router',
    'react-router-dom',
    'react-style-proptype',
    'react-virtualized',
    'redux',
    'seamless-immutable',
    'viser-react',

    'antd/lib/index.js',
    'sockjs-client/dist/sockjs.js',
    'style-loader/lib/addStyles.js',
    'loglevel/lib/loglevel.js',

    'ansi-html/index.js',
    'antd/dist/antd.less',
];

const config = {
    mode: 'development',
    devtool: '#source-map',
    entry: {
        dll: vendors
    },
    output: {
        path: outputRoot,
        filename: '[name].js',
        /**
         * output.library
         * 将会定义为 window.${output.library}
         * 在这次的例子中，将会定义为`window.vendor_library`
         */
        library: '[name]',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [
            common.createAntDLessRule(true),
        ]
    },
    resolve: common.resolve,
    plugins: [
        new webpack.EnvironmentPlugin({NODE_ENV: NODE_ENV}),
        new webpack.DllPlugin({
            /**
             * 定义 manifest 文件生成的位置
             * [name]的部分由entry的名字替换
             */
            path: path.join(outputRoot, 'manifest.[name].json'),
            /**
             * name
             * dll bundle 输出到那个全局变量上
             * 和 output.library 一样即可。
             */
            name: '[name]',
            context: __dirname
        })
    ]
};

module.exports = config;
