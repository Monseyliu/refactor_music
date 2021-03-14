// 配置请求
import axios from "axios";
import {
	Toast
} from "vant";
import store from "@/store"

//路径
const config = require('../config/env');
const baseURL = config[process.env.NODE_ENV].configURL;
const pendingReq = {};

//创建axios实例
const service = axios.create({
	baseURL,
	timeout: 5000,
	header: {
		'Content-Type': 'application/x-www-form-urlencoded', //必须设置,冲掉默认设置的application/json;charset=UTF-8
		"Accept": "application/json, text/plain, */*",
		"Accept-Encoding": "gzip, deflate, br",
		"Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
		"Cache-Control": "no-cache",
		"Connection": "keep-alive",
		"Content-Length": "52",
		"User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1"
	}
});

//请求拦截
service.interceptors.request.use(config => {
	return config;
}, error => {
	return Promise.reject(error)
});
//响应拦截
service.interceptors.response.use(response => {
	const res = response.data;
	//取消请求
	const key = response.config.url + '&' + response.config.method;
	pendingReq[key] && delete pendingReq[key];

	//于后台约定的错误码
	if (res.ret !== 200) {
		return Promise.reject(new Error(res.msg || 'ERROR'));
	} else {
		let code = !!res.data ? res.data.code : null;
		if (!!code && code === 700) {
			store.dispatch("logout").then(() => {
				//location.reload();
			})
		}
		return res;
	}
}, error => {
	Toast(error.message);
	return Promise.reject(error);
});

export default service;
