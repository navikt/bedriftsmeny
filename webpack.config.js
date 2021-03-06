const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const prefixer = require('postcss-prefix-selector');

module.exports = {
    mode: 'production',
    entry: './src/bedriftsmeny/Bedriftsmeny.tsx',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.less', '.css']
    },

    output: {
        path: path.resolve(__dirname, 'lib'),
        publicPath: '/lib/',
        filename: 'Bedriftsmeny.js',
        libraryTarget: 'commonjs2'
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                use: [
                    {
                        loader: 'babel-loader'
                    }
                ]
            },
            {
                test: /\.(css|less)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                prefixer({
                                    prefix: '.bedriftsmeny',
                                    exclude: ['.bedriftsmeny']
                                })
                            ]
                        }
                    },
                    'less-loader'
                ]
            }
        ]
    },

    plugins: [
        new MiniCssExtractPlugin({
            filename: 'bedriftsmeny.css'
        })
    ],

    externals: {
        react: 'react'
    }
};
