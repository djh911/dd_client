import React,{Component} from 'react'
import {Layout} from 'antd'
import { Redirect,Switch,Route } from 'react-router-dom'

import memoryUtils from '../../utils/memoryUtils'
import LeftNav from '../../components/left-nav'
import Header from '../../components/header'
import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

/*
* 后台管理的路由组件
* */

const {Sider,Content,Footer}  = Layout

export default class Admin extends Component{
  render() {
    const user = memoryUtils.user


    if(!user || !user._id){
      //自动跳转到登录界面（在render函数中）
      return <Redirect to='/login' />
    }
    return (
      <Layout style={{height:'100%'}}>
        <Sider>
          <LeftNav/>
        </Sider>
        <Layout>
          <Header>
            Header
          </Header>
          <Content style={{backgroundColor:'white'}}>
            <Switch>
              <Route path='/home' component={Home} />
              <Route path='/category' component={Category} />
              <Route path='/product' component={Product} />
              <Route path='/role' component={Role} />
              <Route path='/user' component={User} />
              <Route path='/charts/bar' component={Bar} />
              <Route path='/charts/line' component={Line} />
              <Route path='/charts/pie' component={Pie} />
              <Redirect to='/home' />

            </Switch> 
          </Content>
          <Footer style={{textAlign:'center',color:'#aaaaaa'}}>hello 哈哈哈哈</Footer>

        </Layout>
       
      </Layout> 
    )
  }
}
