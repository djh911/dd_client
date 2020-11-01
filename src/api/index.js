/*
    根据接口文档写接口函数
    包含应用中所有的接口请求函数
*/
import ajax from './ajax'
import json from 'jsonp'
import jsonp from 'jsonp'

//const BaseUrl = 'http://localhost:5000'
const BaseUrl = ''


//1.登录请求函数
export const reqLogin = (username, password) => ajax(BaseUrl + '/login', { username, password }, 'POST')

//2.添加/更新用户
export const reqAddOrUpdateUser = (user) => ajax(BaseUrl + '/manage/user/'+(user._id ? 'update' : 'add'), user, 'POST')

//jsonp请求的接口请求函数
export const reqWeather = (city) => {

    return new Promise((resolve, reject) => {

        const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json@ak=3p49MVra6urFRGOT9s8UBWr2`
        //发送jsonp请求
        jsonp(url, {}, (err, data) => {
            console.log('jsonp', err, data)
            //发送jsonp请求成功
            if (!err && data.status === 'success') {

                //取出需要的数据
                const { dayPictureUrl, weather } = data.results[0].weather_data[0]

            }
        })

    })



}

//3.请求一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(BaseUrl + '/manage/category/list', { parentId })

//4.添加分类
export const reqAddCategory = (parentId, categoryName) => ajax(BaseUrl + '/manage/category/add', { parentId, categoryName }, 'POST')

//5.更新分类
export const reqUpdateCategory = (categoryId, categoryName) => ajax(BaseUrl + '/manage/category/update', { categoryId, categoryName }, 'POST')

//6.获取商品分页列表
export const reqProducts = (pageNum, pageSize) => {
    //console.log(pageNum, pageSize)
    return ajax(BaseUrl + '/manage/product/list', { pageNum, pageSize })
}

//7.搜索商品分页列表(商品名称/商品描述) SearchType:SearchName\SearchDesc
export const reqSearchProducts = ({ pageNum, pageSize, searchContent, searchType }) => {
    console.log(pageNum,pageSize,searchContent,searchType)
    return ajax(BaseUrl + '/manage/product/search', {
        pageNum,
        pageSize,
        [searchType]: searchContent

    })
}

//8.获取一个分类
export const reqCategory = (categoryId) => ajax('/manage/category/info',{categoryId})

//9.对商品进行上架/下架处理
export const reqUpdateStatus = (productId,status) => ajax('/manage/product/updateStatus',{productId,status},'POST')

//10.删除商品图片
export const reqDeleteImg = (name) => ajax('/manage/img/delete',{name},'POST')

//11.添加商品s
export const reqAddProduct = (product) => ajax('/manage/product/add',product,'POST')

//12.更新商品
export const reqUpdateProduct = (product) => ajax('/manage/product/update',product,'POST')

//13.获取所有角色的列表
export const reqGetRoles = () => ajax('/manage/role/list')

//14.添加角色
export const reqAddRole = (roleName) =>ajax('/manage/role/add',{roleName},'POST')

//15.更新角色
export const reqUpdateRole = (role) => ajax('/manage/role/update',role,'POST')

//16.获取用户列表
export const reqUserList = () => ajax('/manage/user/list')

//17.删除指定用户
export const reqDeleteUser = (userId) => ajax('/manage/user/delete',{userId},'POST')

