const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

const config = {
    mode: 'production',
    entry: './src/Bedriftsmeny.tsx',

    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.less', '.css']
    },

    output: {
        path: path.resolve(__dirname, 'lib'),
        filename: 'Bedriftsmeny.js',
        libraryTarget: 'commonjs2'
    },

    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'ts-loader'
                    }
                ]
            },
            {
                test: /\.less$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            }
        ]
    },

    plugins: [new CleanWebpackPlugin()]
};

module.exports = config;
