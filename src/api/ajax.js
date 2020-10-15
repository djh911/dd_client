/*
    能发送 ajax 请求的函数模块
    包装 axios
    函数的返回值是 promise 对象
    axios.get()/post()返回的就是 promise 对象
    返回自己创建的 promise 对象:
    统一处理请求异常
    异步返回结果数据, 而不是包含结果数据的 response
*/

import axios from 'axios'
import {message} from 'antd'

export default function ajax(url,data = {},type='GET') {
    return new Promise((resolve,reject) => {
        let promise
        //1.执行异步ajax请求
        if(type === 'GET'){
            promise = axios.get(url,{
                params:data
            })
        }else{
            promise = axios.post(url,data)
        }
        //2.如果成功，执行resolve(value)
        promise.then(response => {
            resolve(response.data)

        //3.如果失败，不调用reject(reason)，而是提示异常信息
        }).catch(error => {
            message.error('请求出错了：' + error.message)

        })
        
       
    })
    
}