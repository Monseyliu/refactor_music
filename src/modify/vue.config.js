'use strict'

const path = require("path");
const config = require('./src/config/env');
const resolve = dir => path.join(__dirname, dir);


//baseURL 引入
const {
	baseURL,
	baseURL1
} = config[process.env.NODE_ENV]

module.exports = {
	publicPath: '/',
	outputDir: 'dist',
	assetsDir: 'static',
	lintOnSave: process.env.NODE_ENV === 'development',
	devServer: {
		disableHostCheck: true,
		host: '0.0.0.0',
		port: '8082',
		https: false,
		open: false,
		overlay: {
			warnings: false,
			errors: true
		},
		proxy: {
			'/api': {
				target: baseURL1,
				pathRewrite: {
					"^/api": ""
				},
				secure: false,
				changeOrigin: true
			},
			'/dev-api': {
				target: baseURL,
				pathRewrite: {
					"^/dev-api": ""
				},
				secure: false,
				changeOrigin: true
			}
		}
	},
	chainWebpack: config => {

		//proload-prefetch,web性能优化
		config.plugin('preload').tap(() => [{
			rel: 'preload',
			fileBlacklist: [/\.map$/, /hot-update\.js$/, /runtime\..*\.js$/],
			include: 'initial'
		}])
		config.plugins.delete('prefetch')

		//别名
		config.resolve.alias
			.set('api', resolve('src/api'))
			.set('style', resolve('src/assets/style'))
			.set('base', resolve('src/components/base'))
			.set('common', resolve('src/components/common'))
			.set('config', resolve('src/config'))
			.set('pages', resolve('src/pages'))
			.set('images', resolve('src/assets/images'))
			.set('fonts', resolve('src/assets/fonts'))

		//splitChunks 插件
		config.when(process.env.NODE_ENV !== 'development', config => {
			config.optimization.splitChunks({
				chunks: 'all',
				cacheGroups: {
					libs: {
						name: 'chunk-libs',
						test: /[\\/]node_modules[\\/]/,
						priority: 10,
						chunks: 'initial' // only package third parties that are initially dependent
					},
					commons: {
						name: 'chunk-commons',
						test: resolve('src/components'), // can customize your rules
						minChunks: 3, //  minimum common number
						priority: 5,
						reuseExistingChunk: true
					}
				}
			})
			// https:// webpack.js.org/configuration/optimization/#optimizationruntimechunk
			config.optimization.runtimeChunk('single')
		})
	}
}
