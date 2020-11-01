
import './index.less'
import logo from '../../assets/images/logo.png'
import hai from '../../assets/images/hai1.jpg'
import menuConfig from '../../config/menuConfig'
import memoryUtils from "../../utils/memoryUtils";

import React,{Component} from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu, Icon, } from 'antd';

const { SubMenu } = Menu;

/*
    左侧的导航组件
*/

class LeftNav extends Component {

    //判断当前登录用户对item是否有权限
    hasAuth = (item) => {
        const {key,isPublic} = item
        const menus = memoryUtils.user.role.menus
        const username = memoryUtils.user.username
        /*
        * 1.如果是Admin
        * 2.当前用户有此权限
        * 3.当前item是公开的
        * */
        if(username==='admin' || isPublic || menus.indexOf(key)!==-1) {
            return true
        }else if(item.children ){
            return !!item.children.find(child => menus.indexOf(child.key)!==-1)
        }
        return  false
    }

    //利用map()+递归调用，根据menu的数据数组生成对应的标签数组
    getMenuNodes = (menuConfig) => {
        const path = this.props.location.pathname
        return menuConfig.map(item => {

            //如果当前用户有item对应的权限，才需要显示对应的菜单项
            if(this.hasAuth(item)) {
                if (!item.children) {
                    return (
                        <Menu.Item key={item.key}>
                            <Link to={item.key}>
                                <Icon type={item.icon} />
                                <span> {item.title} </span>
                            </Link>
                        </Menu.Item>
                    )

                }else {
                    //查找一个与当前请求路径的子Item
                    const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                    if(cItem){
                        this.openKey = item.key
                    }
                    return (
                        <SubMenu
                            key={item.key}
                            title={
                                <span>
                                <Icon type={item.icon} />
                                <span> {item.title} </span>
                            </span>
                            }

                        >
                            {this.getMenuNodes(item.children)}
                        </SubMenu>
                    )
                }
            }
        })
    }

    //利用reduce(),累计累加
    /*
      getMenuNodes2 = (menuConfig) => {
        return menuConfig.reduce((pre,item) => {
            //想pre中添加元素
            if(!item.children){
                pre.push((
                    <Menu.Item key={item.key}>
                        <Link to={item.key}>
                            <Icon type={item.icon} />
                            <span> {item.title} </span>
                        </Link>
                    </Menu.Item>

                ))

            }else {
                <SubMenu
                    key={item.key}
                    title={
                        <span>
                            <Icon type={item.icon} />
                            <span> {item.title} </span>
                        </span>
                    }

                >
                    {this.getMenuNodes2(item.children)}
                </SubMenu>

            }

            return pre

        },[])

    }
    
    */
    



    /*
        在第一次 render()之前执行一次 一般可以在此同步为第一次 render()准备数据
    */
    componentWillMount() {
        // this.menuNodes = this.getMenuNodes(menuConfig)
        this.menuNodes = this.getMenuNodes(menuConfig)
    }
    

    render() {
        //得到当前的路由路径
        let path = this.props.location.pathname
        const openKey = this.openKey
       
        if(path.indexOf('/product')===0) {
            //当前请求的是商品或其子路由
            path  = '/product'
        }

        return (
            <div className='left-nav'>

                <Link to='/' className='left-nav-header'>
                    <img src={hai} alt="logo"/>
                    <h1>DD后台</h1>
                </Link>


                <Menu
                    
                    mode="inline"
                    theme="dark"
                    selectedKeys={[path]}
                    defaultOpenKeys={[openKey]}
                   
                >

                    {
                        this.menuNodes
                        
                    }
                   
                </Menu>

            </div>
        )
    }
}

/*
withRouter: 高阶组件: 包装非路由组件返回一个包装后的新组件, 新组件会向被包装组件传递
history/location/match 属性
*/
export default withRouter(LeftNav)
