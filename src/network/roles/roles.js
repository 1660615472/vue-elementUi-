import {request} from '../request'

export function getRoles(){
    return request({
        url:'/roles',
        method:'get'

    })
}

//获取所有权限
export function getAllRights(type='tree'){
    return request({
        url:`/rights/${type}`,
        method:'get'
    })
}

//递归函数 获取当前角色中的三级权限
export function getLeafKeys(node,arr){
    //节点不包含children属性则判定为三级权限
    if(!node.children){
       return arr.push(node.id)
    }
    node.children.forEach(item => this.getLeafKeys(item,arr))
}


export function setRoles(roleId,ridsArr){
    return request({
        url:`roles/${roleId}/rights`,
        method:'post',
        data:ridsArr
    })
}