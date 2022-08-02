var path = require('path');
var HtmlWebpackPlugin =  require('html-webpack-plugin');

module.exports = {
    entry : './src/index.js',
    output : {
        path : path.resolve(__dirname , 'dist'),
        filename: 'index_bundle.js',
        publicPath: '/'
    },
    devServer: {
      historyApiFallback: true
    },
    module : {
        rules : [
            {test : /\.(js)$/, use:'babel-loader'},
            {test : /\.scss|css$/, use:['style-loader', 'css-loader', 'sass-loader']},
            {test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|svg)(\?[a-z0-9=.]+)?$/, use: 'url-loader?limit=100000' }
        ]
    },
    mode:'development',
    plugins : [
        new HtmlWebpackPlugin ({
            template : './src/index.html'
        })
    ]

}
