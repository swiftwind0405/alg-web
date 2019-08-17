const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const {BundleAnalyzerPlugin} = require('webpack-bundle-analyzer');

const common = require('./common');

const NODE_ENV = 'development';

const assetsRoot = common.assetsRoot;
const srcRoot = common.srcRoot;
const outputRoot = common.devOutputRoot;

module.exports = {
    mode: 'development',

    context: srcRoot,

    devtool: 'source-map',

    entry: common.entry,

    output: {
        path: outputRoot,
        filename: '[name].js',
    },

    module: {
        rules: [
            common.htmlRule,
            common.createJsRule(true, false),
            common.createAntDLessRule(true, null),
            common.createLessRule(true, null),
            common.createCssRule(true, null),
            // common.createFontRule(),
        ]
    },

    resolve: common.resolve,

    resolveLoader: common.resolveLoader,

    plugins: [
        new webpack.EnvironmentPlugin({NODE_ENV: NODE_ENV}),
        new webpack.ProvidePlugin({
            React: 'react'
        }),
        common.createAssetsPlugin(true, outputRoot),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: path.resolve(outputRoot, 'manifest.dll.json'),
        }),
        new CopyWebpackPlugin([
            {
                context: path.join(common.projectRoot, 'node_modules/bimernet-viewer/lib'),
                from: '**/*',
                ignore: ['viewer.min.js', '*.map', '*.css', '*.ts'],
            },
        ], {
            copyUnmodified: true,
        }),
        // new BundleAnalyzerPlugin(),
    ],

    devServer: {
        disableHostCheck: true,
        compress: true,
        quiet: true,
        historyApiFallback: true,
        contentBase: [assetsRoot, outputRoot],
        before: function (app) {
            app.get('/assets.js', function (req, res) {
                const localPath = path.resolve(outputRoot, 'assets.js');
                fs.exists(localPath, function (exists) {
                    if (exists) {
                        fs.createReadStream(localPath).pipe(res);
                    } else {
                        res.writeHead(400, {'Content-Type': 'text/plain'});
                        res.end('ERROR File does NOT Exists');
                    }
                });
            });
        }
    }
};
