import {request} from '../request'

export function getUsersInfo(queryParam){
   return request({
        url:'/users',
        method:'get',
        params:queryParam
    })
}

export function updateUserState(id,status){
    return request({
        url:`/users/${id}/state/${status}`,
        method:'put'
    })
}
export function searchUserInfo(queryParam){
    return request({
         url:'/users',
         method:'get',
         params:queryParam
     })
 }

 export function addUser(data){
    return request({
        url:'/users',
        method:'post',
        data:data
    })
 }

 export function getUserById(id){
    return request({
        url:`/users/${id}`,
        method:'get'
    })
 }

 export function updateUserInfo(id,data){
    return request({
        url:`/users/${id}`,
        method:'put',
        data:data
    })
 }

 export function deleteUser(id){
     return request({
         url:`/users/${id}`,
         method:'delete'
     })
 }

 export function setUserRole(userId,roleId){
    return request({
        url:`/users/${userId}/role`,
        method:'put',
        data:{rid:roleId}
    })
 }