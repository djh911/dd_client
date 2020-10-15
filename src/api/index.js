/*
    根据接口文档写接口函数
    包含应用中所有的接口请求函数
*/
import ajax from './ajax'
//const BaseUrl = 'http://localhost:5000'
const BaseUrl = ''


//1.登录请求函数
export const reqLogin = (username,password) => ajax(BaseUrl+'/login',{username,password},'POST')

//2.添加用户
export const reqAddUser = (user) => ajax(BaseUrl+'/manage/user/add',user,'POST')