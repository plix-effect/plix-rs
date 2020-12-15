const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const {WebpackPluginServe} = require('webpack-plugin-serve');

const convert = require('koa-connect');
const history = require('connect-history-api-fallback');
const {createProxyMiddleware : proxy} = require('http-proxy-middleware');

module.exports = (env, argv) => {
    const PRODUCTION = argv.mode === "production";
    // const SW_ENABLED = env.sw === undefined ? true : env.sw;

    const REPLACEMENTS = [
        // {search: '\\$WEBPACK_API_ADDRESS', replace:API_URL, flags: "g"},
        // {search: '\\$WEBPACK_ENABLE_SW', replace:String(SW_ENABLED), flags: "g"},
    ];


    console.log(__dirname);
    return {
        devtool: 'source-map',
        mode: PRODUCTION ? 'production' : 'development',
        entry: {
            index: path.join(__dirname, '/src/index.tsx'),
        },
        output: {
            path: path.join(__dirname, "/../_dist/web"),
            filename: '[name].js'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            modules: [
                path.resolve(__dirname+"/../", 'node_modules'),
                path.resolve(__dirname, './'),
            ]
        },
        module: {
            rules: [
                // Правило для .ts .tsx
                {
                    test: /\.tsx?$/,
                    loader: 'ts-loader',
                    options: {
                        configFile: "tsconfig.front.json"
                    },
                    exclude: /node_modules/,
                },
                // Правило подгрузки sass, scss, css
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: './style'
                            }
                        },
                        'css-loader',
                        'sass-loader'
                    ]
                },
                // Правило подставки $WEBPACK: переменных
                {
                    test: /(\.(sa|sc|c)ss|\.[tj]sx?)$/,
                    exclude: /node_modules/,
                    loader: 'string-replace-loader',
                    options: {
                        multiple: REPLACEMENTS
                    }
                }
            ]
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename: "style/style-[id].css",
                chunkFilename: "style/style-[id].css"
            }),
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: path.join(__dirname, "/src/ui/assets/"),
                        to: "./assets"
                    }
                ]
            }),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, "/src/index.html"),
                filename: "index.html",
                base: "/",
            }),
            new HtmlWebpackTagsPlugin({
                tags: [], append: true
            }),
            new WebpackPluginServe({
                "port": 8084,
                "host": "0.0.0.0",
                "historyFallback": true,
                "static": "_dist/web",
                middleware: (app, middleware, options) => {
                    app.use(convert(proxy('/service', { target: 'http://localhost:8083', secure: false, changeOrigin: true })));
                    app.use(convert(history()));
                }
            })
        ],
        watch: !PRODUCTION
    };
};