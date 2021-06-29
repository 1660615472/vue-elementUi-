import {request} from '../request'

export function getGoodsList(data){
    return request({
        url:`/goods`,
        method:'get',
        params:data
    })
}

export function deleteGood(id){
    return request({
        url:`/goods/${id}`,
        method:'delete'
    })
}

export function addGoods(data){
    return request({
        url:`/goods`,
        method:'post',
        data:data
    })
}