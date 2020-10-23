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

//3.请求商品目录
export const reqCategorys = (parentId) => ajax(BaseUrl + '/manage/category/list',{parentId})

//4.添加商品目录
export const reqAddCategory = (parentId,categoryName) => ajax(BaseUrl + '/manage/category/add',{parentId,categoryName},'POST')

//5.删除商品目录
export const reqUpdateCategory = (categoryId,categoryName) => ajax(BaseUrl + '/manage/category/update',{categoryId,categoryName},'POST')