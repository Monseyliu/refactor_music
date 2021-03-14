import http from "config/http";

//轮播图
export function getBanner() {
	return http({
		url: '/api/public/?service=PcHome.GetTjMatch&cid=14',
		method: 'get'
	})
}
