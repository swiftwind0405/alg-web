const path = require('path');
const AssetsPlugin = require('assets-webpack-plugin');
const autoPrefixer = require('autoprefixer');

const env = require('../env');

const projectRoot = module.exports.projectRoot = path.join(__dirname, '../../');
const srcRoot = module.exports.srcRoot = path.join(projectRoot, 'src');

module.exports.assetsRoot = path.join(projectRoot, 'assets');
module.exports.devOutputRoot = path.join(projectRoot, 'out');
module.exports.buildOutputRoot = path.join(projectRoot, 'dist');

module.exports.entry = {
    app: './entry/app.js',
};

module.exports.htmlRule = {
    test: /\.html$/,
    exclude: /node_modules/,
    include: [projectRoot],
    loader: 'empty-loader'
};

const createBabelLoader = function (isDev) {
    const plugins = isDev ? [] : [
        ['import', {libraryName: 'antd', style: true}],
    ];
    return {
        loader: 'babel-loader',
        options: {
            cacheDirectory: true,
            compact: false,
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-class-properties', ...plugins],
        }
    };
};

const createIfDefLoader = module.exports.createIfDefLoader = function (options) {
    return {
        loader: 'ifdef-loader',
        options: options,
    };
};

module.exports.createJsRule = function (isDev, isMock) {
    return {
        test: /\.jsx?$/,
        exclude: /(node_modules|(NIM_Web_SDK.*\.js))/,
        include: [srcRoot],
        use: [
            createBabelLoader(isDev),
            createIfDefLoader({ENV: env.ENV, MOCK: isMock}),
        ]
    };
};

module.exports.createAntDLessRule = function (isDev, extractPluginLoader) {
    const antDLessRule = {
        test: /\.less$/,
        include: [
            path.resolve(projectRoot, 'node_modules', 'antd'),
        ],
    };

    const postCssLoader = {
        loader: 'postcss-loader',
        options: {
            plugins: () => [autoPrefixer()]
        }
    };

    const lessLoader = {
        loader: 'less-loader',
        options: {javascriptEnabled: true}
    };

    antDLessRule.use = [
        isDev ? 'style-loader' : extractPluginLoader,
        {
            loader: 'css-loader',
            options: {
                sourceMap: true,
            }
        },
        postCssLoader,
        lessLoader,
    ];

    return antDLessRule;
};

module.exports.createLessRule = function (isDev, extractPluginLoader) {
    const lessRule = {
        test: /\.less$/,
        exclude: path.resolve(projectRoot, 'node_modules'),
    };

    const cssLoader = {
        loader: 'css-loader',
        options: {
            url: false,
            sourceMap: true,
            modules: {
                mode: 'local',
                context: path.resolve(__dirname, '../../src'),
                localIdentName: isDev ? '[path][name]-[local]' : 'H[hash:base64:6]',
            },
        }
    };

    const postCssLoader = {
        loader: 'postcss-loader',
        options: {
            plugins: () => [autoPrefixer()]
        }
    };

    const lessLoader = {
        loader: 'less-loader',
        options: {javascriptEnabled: true}
    };

    const styleResourcesLoader = {
        loader: 'style-resources-loader',
        options: {
            patterns: [path.join(srcRoot, 'less/variable.less'), path.join(srcRoot, 'less/mixin.less')],
            injector: (source, resources) => source + resources.map(({content}) => content).join(''),
        }
    };

    lessRule.use = [
        'css-hot-loader',
        isDev ? 'style-loader' : extractPluginLoader,
        cssLoader,
        postCssLoader,
        lessLoader,
        styleResourcesLoader,
    ];

    return lessRule;
};

module.exports.createCssRule = function (isDev, extractPluginLoader) {
    const cssRule = {
        test: /\.css$/,
    };

    const cssLoader = {
        loader: 'css-loader',
        options: {
            url: false,
            sourceMap: true,
        }
    };

    const postCssLoader = {
        loader: 'postcss-loader',
        options: {
            plugins: () => [autoPrefixer()]
        }
    };
    cssRule.use = [
        isDev ? 'style-loader' : extractPluginLoader,
        cssLoader,
        postCssLoader,
    ];

    return cssRule;
};

module.exports.createFontRule = function () {
    return {
        test: /\.(woff|woff2|eot|ttf)((\??.*)?|(\?\w+))$/,
        exclude: /node_modules/,
        include: [srcRoot],
        use: [
            {
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'font/[hash:6].[ext]'
                }
            },
        ]
    };
};

module.exports.createAssetsPlugin = function (isDev, outputRoot) {
    return new AssetsPlugin({
        path: outputRoot,
        filename: 'assets.js',
        processOutput: function (assets) {
            const template = require('../asset/assets').toString();
            const script = template.replace('{/*assets*/}', JSON.stringify(assets))
                .replace('{/*ENV*/}', JSON.stringify(env.ENV))
                .replace('{/*isDev*/}', String(isDev));
            return '(' + script + ')();';
        }
    });
};

/**
 * 默认ant-design-pro中会直接加载antd中的css，本plugin用于将css路径替换为less路径
 * @type {{apply: AntDesignProResolverPlugin.apply}}
 */
const AntDesignProResolverPlugin = {
    apply: function (resolver) {
        resolver.plugin('module', function (request, callback) {
            if (request.request.startsWith('antd/lib') && request.request.endsWith('style/css')) {
                request.request = request.request.slice(0, -4);
                this.doResolve(['file'], request, '', callback);
            } else {
                callback();
            }
        });
    }
};

module.exports.resolve = {
    alias: {
        '@': srcRoot,
    },
    plugins: [
        AntDesignProResolverPlugin,
    ],
};

module.exports.resolveLoader = {
    alias: {
        'empty-loader': path.join(projectRoot, './webpack/loaders/empty-loader.js')
    },
};
