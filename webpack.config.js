const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
                    {
                        loader: 'css-modules-typescript-loader',
                        options: {
                            mode: process.env.CI ? 'verify' : 'emit'
                        }
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 1,
                            modules: true
                        }
                    },
                    'less-loader',

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
    },

    devServer: {
        contentBase: [
            path.join(__dirname, 'lib'),
            path.join(__dirname, 'dist'),
            path.join(__dirname, 'demoapp/public'),
        ],
        hot: true,
        port: 8000,
    },
};
