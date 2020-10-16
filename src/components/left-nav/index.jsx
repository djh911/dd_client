
import './index.less'
import logo from '../../assets/images/logo.png'
import menuConfig from '../../config/menuConfig'

import React,{Component} from 'react'
import {Link,withRouter} from 'react-router-dom'
import { Menu, Icon, } from 'antd';

const { SubMenu } = Menu;

/*
    左侧的导航组件
*/

class LeftNav extends Component {

    //利用map()+递归调用，根据menu的数据数组生成对应的标签数组
    
    getMenuNodes = (menuConfig) => {
        const path = this.props.location.pathname
        return menuConfig.map(item => {

            /*
                {
                title: '首页', // 菜单标题名称
                key: '/home', // 对应的 path
                icon: 'home', // 图标名称
                }
            */
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
                const cItem = item.children.find(cItem => cItem.key===path)
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
        const path = this.props.location.pathname
        const openKey = this.openKey
       // const menuNodes = this.getMenuNodes(menuConfig)

        return (
            <div className='left-nav'>

                <Link to='/' className='left-nav-header'>
                    <img src={logo} alt="logo"/>
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
