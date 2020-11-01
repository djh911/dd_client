/*
    添加角色的fprm组件
*/

import React, { Component } from 'react'
import {
    Form,
    Input,
    Tree
} from 'antd'
import PropTypes from 'prop-types'
import menuConfig from '../../config/menuConfig'

const Item = Form.Item
const { TreeNode } = Tree


export default class AuthForm extends Component {

    static propTypae = {
        role: PropTypes.object.isRequired

    }

   
    constructor(props) {
        super(props)

        //初始化状态
        const menus = this.props.role.menus
        this.state = {
            checkedKeys:menus
        }
    }

    //为父组件得到数据
    getMenus = () => {
        const menus = this.state.checkedKeys
        return menus
    }
 
    getTreeNodes = (menuConfig) => {
        return menuConfig.reduce((pre,item) =>{
            pre.push(<TreeNode title={item.title} key={item.key} >
                {item.children ? this.getTreeNodes(item.children) : null}
            </TreeNode>)
            return pre
        },[])
    }

    onCheck = (checkedKeys) => {
        console.log(checkedKeys)
        this.setState({
            checkedKeys
        })
    }

    componentWillMount () {
        this.treeNodes = this.getTreeNodes(menuConfig)
    }

    //当组件接收到新的属性时调用
    componentWillReceiveProps (nextProps) {
        const menus = nextProps.role.menus
        this.setState({
            checkedKeys:menus
        })
    }

    render() {
        const { role } = this.props
        const {checkedKeys} = this.state
        console.log(role)
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        }

        return (
            <Form>

                <Item label='角色名称' {...formItemLayout}>
                    <Input value={role.name} disabled />
                    <Tree
                        checkable
                        defaultExpandAll={true}
                        checkedKeys={checkedKeys}
                        onCheck={this.onCheck}
                    >
                        <TreeNode title="平台权限" key="0-0">
                            {this.treeNodes}
                        </TreeNode>
                    </Tree>


                </Item>


            </Form>
        )
    }

}

