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

//2.添加用户
export const reqAddUser = (user) => ajax(BaseUrl + '/manage/user/add', user, 'POST')

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
    console.log(pageNum, pageSize)
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