const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'production',
    externals: [
        'react',
        'react-dom',
        'ethers',
        'web3-utils',
        '@uma/core'
    ]
});


