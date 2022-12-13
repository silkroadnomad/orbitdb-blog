const webpack = require('webpack');
const dotenv = require('dotenv');
const fs = require('fs'); // to check if the file exists
const path = require('path'); // to get the current path

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
var HtmlWebpackPlugin =  require('html-webpack-plugin');

module.exports = env => {
    
    const currentPath = path.join(__dirname);
    const basePath = currentPath + '/.env';
    const envPath = basePath + '.' + env.ENVIRONMENT;
    const finalPath = fs.existsSync(envPath) ? envPath : basePath;
    const fileEnv = dotenv.config({ path: finalPath }).parsed;
    const envKeys = Object.keys(fileEnv).reduce((prev, next) => {
        prev[`process.env.${next}`] = JSON.stringify(fileEnv[next]);
        return prev;
    }, {});

    return {
        entry : './lib/index.js',
        output : {
            path : path.resolve(__dirname , 'dist'),
            filename: 'index_bundle.js',
        },
        devServer: {
            historyApiFallback: true
        },
        module : {
            rules : [
                {test : /\.(js)$/, use:'babel-loader'},
                {test : /\.scss|css$/, use:['style-loader', 'css-loader', 'sass-loader']},
                {test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/, use: 'file-loader' }
            ]
        },
        // resolve: {
        //     modules: [path.resolve(__dirname, 'node_modules'), 'node_modules']
        // },
        // babelrc:false,
        mode:env.ENVIRONMENT,
        plugins : [
            new webpack.DefinePlugin(envKeys),
            new CleanWebpackPlugin(),
            // new HtmlWebpackPlugin ({
            //     template : './src/index.html'
            // })
                // https://github.com/babel/babel/issues/8562
                // require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
                // require.resolve('@babel/plugin-transform-runtime'),
                // require.resolve('babel-plugin-add-module-exports'),
                // require.resolve('@babel/plugin-proposal-class-properties'),
                // require.resolve('@babel/plugin-syntax-dynamic-import'),
                // require.resolve('babel-plugin-react-docgen')
        ]
    };
};
