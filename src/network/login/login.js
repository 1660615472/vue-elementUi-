import {request} from '../request'
export function login(loginInfo){
    return request({
        url:'login',
        method:'post',
        data:loginInfo
        
    })
}