const path = require('path');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const common = require('./common');

const NODE_ENV = 'production';

const assetsRoot = common.assetsRoot;
const srcRoot = common.srcRoot;
const outputRoot = common.buildOutputRoot;
const extractPluginLoader = MiniCssExtractPlugin.loader;

module.exports = {
    mode: 'production',

    context: srcRoot,

    entry: common.entry,

    output: {
        path: outputRoot,
        filename: '[name]-[hash:6].js'
    },

    module: {
        rules: [
            common.htmlRule,
            common.createJsRule(false, false),
            common.createAntDLessRule(false, extractPluginLoader),
            common.createLessRule(false, extractPluginLoader),
            common.createCssRule(false, extractPluginLoader),
        ]
    },

    resolve: common.resolve,

    resolveLoader: common.resolveLoader,

    optimization: {
        minimize: true,
        minimizer: [
            // This is only used in production mode
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        // we want terser to parse ecma 8 code. However, we don't want it
                        // to apply any minfication steps that turns valid ecma 5 code
                        // into invalid ecma 5 code. This is why the 'compress' and 'output'
                        // sections only apply transformations that are ecma 5 safe
                        // https://github.com/facebook/create-react-app/pull/4234
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        // Disabled because of an issue with Uglify breaking seemingly valid code:
                        // https://github.com/facebook/create-react-app/issues/2376
                        // Pending further investigation:
                        // https://github.com/mishoo/UglifyJS2/issues/2011
                        comparisons: false,
                        // Disabled because of an issue with Terser breaking valid code:
                        // https://github.com/facebook/create-react-app/issues/5250
                        // Pending futher investigation:
                        // https://github.com/terser-js/terser/issues/120
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        // Turned on because emoji and regex is not minified properly using default
                        // https://github.com/facebook/create-react-app/issues/2488
                        ascii_only: true,
                    },
                },
                // Use multi-process parallel running to improve the build speed
                // Default number of concurrent runs: os.cpus().length - 1
                parallel: true,
                // Enable file caching
                cache: true,
                sourceMap: false,
            }),
        ],
    },

    plugins: [
        new webpack.EnvironmentPlugin({NODE_ENV: NODE_ENV}),
        new webpack.ProvidePlugin({
            React: 'react'
        }),
        new MiniCssExtractPlugin({
            filename: '[name]-[contenthash:6].css',
        }),
        common.createAssetsPlugin(false, outputRoot),
        new webpack.optimize.AggressiveMergingPlugin(),
        new CopyWebpackPlugin([
            {
                context: assetsRoot,
                from: '**/*',
            },
            {
                context: path.join(common.projectRoot, 'node_modules/bimernet-viewer/lib'),
                from: '**/*',
                ignore: ['viewer.min.js', '*.map', '*.css', '*.ts'],
            },
        ], {
            copyUnmodified: true,
        }),
    ]
};
