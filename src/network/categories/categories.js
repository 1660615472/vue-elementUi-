import {request} from '../request'

export function getCategoriess(queryInfo){
    return request({
        url:'/categories',
        method:'get',
        params:queryInfo
    })
}

//商品分类数据列表,点击新增按钮以后获取的分类参数，最多2J分类
export function getCategoryList(type){
    return request({
        url:'/categories',
        method:'get',
        params:type
    })
}

export function addCategories(data){
    return request({
        url:'/categories',
        method:'post',
        data:data 
    })
}