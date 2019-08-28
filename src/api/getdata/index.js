// 本次项目封装好的获取数据接口的方法

import request from '@/router/axios'

//获取用户数据方法
export function getUser(query){
    return request({
        url: '/clocking/ifaceuser/page',
        method: 'post',
        params: query
    })
}

//获取设备信息的方法
export function getDevice(query){
    return request({
        url: '/clocking/ifacesystem/page',
        method: 'post',
        params:query
    })
}

//用户考勤报表数据
export function getUserform(query){
    return request({
        url: '/clocking/ifaceclock/clockReport',
        method: 'post',
        params:query
    })
}

//根据设备查询人员数据
export function getByDevice(query){
    return request({
        url: '/clocking/ifacesystem/system/'+query,
        method: 'post',
    })
}

//下载考勤报表
export function downloadUserform(query){
    return request({
        url: '/clocking/ifaceclock/clockReportWriter',
        method: 'post',
        params:query
    })
}

//请求考勤图片
export function downloadImage(query){
    return request({
        url: '/clocking/clockphoto/findClockPhotos',
        method: 'post',
        params:query
    })
}
