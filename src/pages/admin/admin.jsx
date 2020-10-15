import React,{Component} from 'react'
import memoryUtils from '../../utils/memoryUtils'
import { Redirect } from 'react-router-dom'
/*
* 后台管理的路由组件
* */
export default class Admin extends Component{
  render() {
    const user = memoryUtils.user


    if(!user || !user._id){
      //自动跳转到登录界面（在render函数中）
      return <Redirect to='/login' />
    }
    return (
      <div>
        hello {user.username}
      </div>
    )
  }
}
