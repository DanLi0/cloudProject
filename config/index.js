
// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
//服务器地址：请求数据接口地址全在这上面
var baseUrl = 'http://10.138.22.228:4007';

module.exports = {
    build:{
        env: require('./prod.env'),
        index: path.resolve(__dirname, '../dist/index.html'),
        assetsRoot: path.resolve(__dirname, '../dist'),
        assetsSubDirectory: 'static',
        assetsPublicPath: '/',
        productionSourceMap: false,
        // Gzip off by default as many popular static hosts such as
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css'],
        // Run the build command with an extra argument to
        // View the bundle analyzer report after build finishes:
        // `npm run build --report`
        // Set to `true` or `false` to always turn it on or off
        bundleAnalyzerReport: process.env.npm_config_report
    },
    dev: {
        env: require('./dev.env'),
        port: 8087,
        autoOpenBrowser: true,
        assetsSubDirectory: 'static',
        host: 'localhost',
        assetsPublicPath: '/',
        // 配置反向代理
        proxyTable: {
            '/auth':{
                target: baseUrl,
                changeOrigin: true,
                pathRewrite: {
                    '^/auth':'/auth'
                }
            },
            '/admin': {
                target: baseUrl,
                changeOrigin: true,
                pathRewrite: {
                    '^/admin': '/admin'
                }
            },
          '/api': {
                target: baseUrl,
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            },
            '/code': {
                target: baseUrl,
                changeOrigin: true,
                pathRewrite: {
                    '^/code': '/code'
                }
            },
            '/gen': {
                target: baseUrl,
                changeOrigin: true,
                pathRewrite: {
                    '^/gen': '/gen'
                }
            },
            '/daemon': {
                target: baseUrl,
                changeOrigin: true,
                pathRewrite: {
                    '^/daemon': '/daemon'
                }
            },
            '/clocking': {
                target:baseUrl,
                changeOrigin: true,
                pathRewrite: {
                    '^/clocking': '/clocking'
                }
            },
        },
        cssSourceMap: false
    }
}
