import React,{Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Modal} from 'antd'

import './index.less'
import LinkButton from '../link-button'
import {formateDate} from '../../utils/dateUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuConfig from '../../config/menuConfig'

class Header extends Component {

    state = {
        currentTime:formateDate(Date.now())
    }

    getTime() {
        this.interverId = setInterval(() => {
            let currentTime = formateDate(Date.now())
            this.setState({
                currentTime
            })
        })
    }

    //
    getTitle() {
        
        const path = this.props.location.pathname
        let title
        menuConfig.forEach(item => {
            if(item.key === path) {
                title = item.title
            } else if(item.children) {
                const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
                if(cItem) {
                    title = cItem.title
                }
            }
        })
        return title
    }

    /*
        退出登陆
    */
    logout = () => {
        Modal.confirm({
            content: '确定退出吗?',
            onOk: () => {
                console.log('OK')
                // 移除保存的 user
                storageUtils.deleteUser()
                memoryUtils.user = {}
                // 跳转到 login
                this.props.history.replace('/login')
            },
            onCancel() {
                console.log('Cancel')
            },
        })
    }

    //第一次render之后执行，一般执行异步操作
    componentDidMount() {
        this.getTime()

    }

    componentWillUnmount() {
        clearInterval(this.interverId)
    }

    render(){
        return (
            <div className='header'>
                <div className="header-top">
                    <span>welcome , {memoryUtils.user.username}</span>
                    <LinkButton onClick={this.logout}>退出</LinkButton>
                </div>
                <div className="header-bottom">
                    <div className="header-bottom-left">{this.getTitle()}</div>
                    <div className="header-bottom-right">
                        <span>{this.state.currentTime}</span>
                        <img src="http://api.map.baidu.com/images/weather/day/qing.png" alt="天气" />
                        <span>晴天</span>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(Header)