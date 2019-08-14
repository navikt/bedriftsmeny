module.exports = {
    presets: [
        '@babel/typescript',
        '@babel/react',
        [
            '@babel/env',
            {
                useBuiltIns: 'usage',
                corejs: 3
            }
        ]
    ],
    plugins: ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread']
};
