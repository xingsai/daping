import request from '@/utils/request'
//柜子列表
export function getChestList(data) {
	return request({
		url: 'screen/' + data.company_id + '/cabinets',
		method: 'get',
		params: data,
	})
}
//柜子详情
export function getChestDetail(data) {
	return request({
		url: 'screen/cabinet/' + data.id,
		method: 'get',
		params: {},
	})
}
//急救列表
export function getFirstAidList(data) {
	return request({
		url: 'screen/' + data.company_id + '/sos',
		method: 'get',
		params: data,
	})
}
//体系成员
export function getsystemMember(data) {
	return request({
		url: 'screen/' + data.company_id + '/members',
		method: 'get',
		params: data,
	})
}
//用户信息
export function getUserInfo(data) {
	return request({
		url: 'screen/users/census',
		method: 'get',
		params: data,
	})
}