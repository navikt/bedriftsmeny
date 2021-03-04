const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const prefixer = require('postcss-prefix-selector');

const allConfigs = {
    production: {
        verbatim: {
            entry: './src/Bedriftsmeny.tsx',
            externals: {
                react: 'react'
            }
        },
        output: {
            filename: 'Bedriftsmeny.js',
            libraryTarget: 'commonjs2'
        },
        css_filename: 'bedriftsmeny.css'
    },
    development: {
        verbatim: {
            entry: './dev/index.tsx',
            devtool: "eval-source-map",
            devServer: {
                contentBase: path.join(__dirname, "dev/static/")
            }
        },
        output: {
            filename: 'index.js',
            libraryTarget: 'umd'
        },
        css_filename: 'index.css',
    }
}

module.exports = (env, argv) => {
    const config = allConfigs[argv.mode];
    if (!config) {
        console.error(`mode ${env} not found`)
        process.exit(1)
    }
    return {
        ...config.verbatim,
        mode: env,

        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.less', '.css']
        },

        output: {
            path: path.resolve(__dirname, 'lib'),
            publicPath: '/lib/',
            filename: config.output.filename,
            libraryTarget: config.output.libraryTarget
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

        plugins: [ new MiniCssExtractPlugin({ filename: config.css_filename }) ],

        stats: {
            orphanModules: true
        }
    }
};
