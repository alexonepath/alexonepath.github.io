const webpack = require('webpack');
const path = require('path');
const glob = require("glob");
const nodeEnv = process.env.ENV_VAR

const WebpackShellPlugin = require('webpack-shell-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

let jsSrc = glob.sync('./assets/js/custom/*.js');
let jsLibSrc = glob.sync('./assets/js/lib/*.js');
let cssSrc = glob.sync('./assets/css/*.css');

const config = {
    mode: 'none',
    entry: {    //압축할 대상이 되는 파일위치
        page: jsSrc.concat(cssSrc),
        // sha256: jsLibSrc
    },
    output: {
        path: path.resolve(__dirname, './assets/built/static'), //압축한 파일이 저장될 위치
        filename: '[name].js', //압축한 파일 이름.
        // libraryTarget: 'var',
        // library: 'XCube'
    },
    plugins: [
        new CleanWebpackPlugin([path.resolve(__dirname, './assets/built/static')]), //build시 ouput 디렉토리 삭제
        new UglifyJSPlugin(),   //javascript 코드를 압축 및 난독화
        new webpack.ProvidePlugin({ //자유 변수로 등록하여 javascript 소스에서 사용가능. (npm install jquery)
            $: "jquery",
            jQuery: "jquery"
        }),
        new OptimizeCSSAssetsPlugin({}),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].css",
        })
    ],
    resolve: {
        modules: ['node_modules'],
        extensions: ['.js'],
    },
    // Loader 참고 - https://webpack.js.org/loaders/
    module: {
        rules: [
            {
                test: /\.js$/,
                include: path.join(__dirname),
                exclude: /(node_modules)|(dist)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env']
                    }
                }
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.(jpe?g|png|svg|gif|mp3)$/i,
                loaders: ['file-loader'],   //이미지, 폰트 같은 파일들을 하나로 통합한다.
            },
        ]
    }
};

console.log("Mode : " + nodeEnv)
module.exports = (env, argv) => {
    if (nodeEnv === 'alex') {
        config.output.path = '/Users/alex/office/workspace/xblockchain/xblockchain/src/github.com/xbctechnologies/go-xblockchain/internal/jsve/deps'
        config.plugins = [config.plugins[config.plugins.length - 1]]
        config.plugins.push(new WebpackShellPlugin({onBuildEnd: ['make -C /Users/alex/office/workspace/xblockchain/xblockchain/src/github.com/xbctechnologies/go-xblockchain xnode-jsve-build']}))
    }

    return config
};