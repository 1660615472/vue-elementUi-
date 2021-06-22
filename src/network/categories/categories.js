import { request } from '../request'

export function getCategoriess(queryInfo) {
    return request({
        url: '/categories',
        method: 'get',
        params: queryInfo
    })
}

//商品分类数据列表,点击新增按钮以后获取的分类参数，最多2J分类
export function getCategoryList(type) {
    return request({
        url: '/categories',
        method: 'get',
        params: type
    })
}

export function addCategories(data) {
    return request({
        url: '/categories',
        method: 'post',
        data: data
    })
}

//页签
export function getCateParamsList(id, sel) {
    return request({
        url: `/categories/${id}/attributes`,
        method: 'get',
        params: sel
    })
}

//添加动态参数或者静态属性
export function addManyOrOnlyParam(id,data) {
    return request({
        url: `categories/${id}/attributes`,
        method: 'post',
        data: data
    })
}

//根据 ID 查询参数
export function getManyOrOnlyById(cateId,attrId,params){
    return request({
        url:`categories/${cateId}/attributes/${attrId}`,
        method:'get',
        params:params
    })
}

//编辑提交参数
export function editCategories(catId,attrId,data){
    return request({
        url:`categories/${catId}/attributes/${attrId}`,
        method:'put',
        data:data
    })
}

export function deleteCate(cateId,attrid){
    return request({
        url:`categories/${cateId}/attributes/${attrid}`,
        method:'delete'
    })
}