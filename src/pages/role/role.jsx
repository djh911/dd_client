import React, { Component } from 'react'
import { Card, Button, Table, Modal, message } from 'antd'

import { PAGE_SIZE } from '../../utils/constants'
import { reqGetRoles, reqAddRole, reqUpdateRole } from '../../api/index'
import AddForm from './add-form'
import AuthForm from './auth-form'
import MemoryUtils from '../../utils/memoryUtils'
import {formateDate} from '../../utils/dateUtils'


export default class Role extends Component {

    state = {
        roles: [], //所以角色的列表
        role: {},  //选中的角色
        isShowAdd: false,
        isShowAuth: false
    }

    constructor(props) {
        super(props)
        this.auth = React.createRef()
    }

    initColumns = () => {
        this.columns = [
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: formateDate
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name',
                
            },
        ]
    }

    onRow = (role) => {
        return {
            onClick: event => {
                this.setState({
                    role
                })
            }
        }
    }

    getRoleLists = async () => {
        const result = await reqGetRoles()
        if (result.status === 0) {
            this.setState({
                roles: result.data
            })
        }
    }

    //添加角色
    addRole = () => {
        this.form.validateFields(async (err, values) => {
            if (!err) {
                //1.隐藏对话框
                // console.log('表单验证成功')
                this.setState({
                    isShowAdd: false
                })

                //2.准备数据，发送请求，添加更新分类
                const { roleName } = this.form.getFieldsValue()
                //重置输入数据
                this.form.resetFields()
                const result = await reqAddRole(roleName)
                console.log(result)
                if (result.status === 0) {
                    this.getRoleLists()

                    /*
                        //更新roles状态：基于原有状态数据更新
                        this.setState((state) => ({
                            roles:[...state.roles,role]
                        }))
                    */
                } else {
                    message.error('添加失败')
                }
            }
        })
    }

    //更新角色
    updateRole = async () => {
        //关闭对话框
        this.setState({
            isShowAuth: false
        })
        const role = this.state.role
        //得到最新的menus
        const menus = this.auth.current.getMenus()
        role.menus = menus
        role.auth_name = MemoryUtils.user.username
        console.log(role)
        //请求更新
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            message.success('更新成功')
            this.getRoleLists()
        } else {
            message.error('添加失败')
        }



    }

    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getRoleLists()
    }

    render() {

        const { roles, role, isShowAdd, isShowAuth } = this.state

        const title = (
            <span>
                <Button type='primary' style={{ marginRight: 20 }} onClick={() => this.setState({ isShowAdd: true })}>创建角色</Button>
                <Button type='primary' disabled={!role._id} onClick={() => this.setState({ isShowAuth: true })}>设置角色权限</Button>
            </span>
        )

        return (
            <Card title={title}>
                <Table
                    dataSource={roles}
                    columns={this.columns}
                    // loading={loading}
                    rowKey='_id'
                    pagination={{
                        defaultPageSize: PAGE_SIZE,
                        showQuickJumper: true,
                    }}
                    rowSelection={{ type: 'radio', selectedRowKeys: [role._id] }}
                    onRow={this.onRow}
                />

                <Modal
                    title="添加角色"
                    visible={isShowAdd}
                    onOk={this.addRole}
                    onCancel={() => this.setState({ isShowAdd: false })}
                >
                    <AddForm
                        showForm={(form) => { this.form = form }}
                    />

                </Modal>

                <Modal
                    title="设置角色权限"
                    visible={isShowAuth}
                    onOk={this.updateRole}
                    onCancel={() => this.setState({ isShowAuth: false })}
                >
                    <AuthForm
                        role={role}
                        ref={this.auth}
                    />

                </Modal>

            </Card>
        )
    }
}