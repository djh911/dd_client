import React, { Component } from 'react'
import { Card, Table, Button, Icon, message, Modal } from 'antd'

import LinkButton from '../../components/link-button'
import { reqCategorys, reqAddCategory, reqUpdateCategory } from '../../api/index'
import AddForm from './add-form'
import UpdateForm from './update-form'


export default class Category extends Component {

    state = {
        categorys: [], //一级分类列表
        loading: false,//是否正在获取数据中
        subCategorys: [],//二级分类列表
        parentId: "0", //父分类Id
        parentName: '',//父分类名字
        showStatus: 0 //状态0，1，2，分别表示更新和增加的对话框都不调、只调添加、只调更新
    }



    //获取商品列表的列
    getColumns = () => {
        this.columns = [
            {
                title: '分类名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '操作',
                width: 300,
                render: (category) => (
                    <span>
                        <LinkButton onClick={() => this.showUpdate(category)}> 修改分类</LinkButton>
                        {
                            category.parentId === "0" ? <LinkButton onClick={() => { this.showSubcategorys(category) }}> 查看子分类</LinkButton> : null

                        }
                    </span>
                )
            },
        ]

    }

    //显示二级列表
    showSubcategorys = (category) => {
        this.setState({
            parentId: category._id,
            parentName: category.name
        }, () => {
            this.getCategorys()

        })

    }

    //显示一级分类列表
    showCategorys = () => {
        this.setState({
            parentId: "0",
            parentName: '',
            subCategorys: []
        })
    }

    //向服务器发送请求，获取商品列表
    getCategorys = async (parentId) => {
        //在发送请求前，更新loading状态
        console.log(parentId)
        this.setState({
            loading: true
        })
        parentId = parentId || this.state.parentId
        const result = await reqCategorys(parentId)

        //在发送请求后，更新loading状态
        this.setState({
            loading: false
        })
        //console.log(result)
        if (result.status === 0) {
            //取出分类数组（可能是一级也可能是二级）
            let categorys = result.data
            if (this.state.parentId === "0") {
                //更新一级分类
                this.setState({
                    categorys

                })

            } else {
                this.setState({
                    subCategorys: categorys
                })
            }

        } else {
            message.error('获取商品分类列表失败')
        }


    }

    //响应点击取消及隐藏对话框
    handleCancel = () => {
        this.setState({
            showStatus: 0
        })
        // 重置表单
        this.form.resetFields()
    }

    //添加分类
    addCategory = () => {

        this.form.validateFields( async (err, values) => {
            if (!err) {
                //1.隐藏对话框
               // console.log('表单验证成功')
                this.setState({
                    showStatus: 0
                })

                //2.准备数据，发送请求，添加更新分类
                const { categoryName, parentId } = this.form.getFieldsValue()
                this.form.resetFields()
                const result = await reqAddCategory(parentId, categoryName)
                console.log(result)
                if (result.status === 0) {
                    //3.重新显示列表

                    if (parentId === this.state.parentId) {
                        this.getCategorys()
                    } else if (parentId === '0') {
                        this.setState({
                            parentId: "0"
                        }, () => {
                            this.getCategorys()
                        })
                    }

                }
            }
        })
    }

    //更新分类
    updateCategory = () => {

        this.form.validateFields(async (err, values) => {
            if (!err) {
                //1.隐藏对话框
                this.setState({
                    showStatus: 0
                })

                //准备数据
                const categoryId = this.category._id
                const categoryName = this.form.getFieldsValue().categoryName


                // 重置表单
                this.form.resetFields()


                //2.发送请求更新分类
                const result = await reqUpdateCategory(categoryId, categoryName)
                // console.log(result)
                if (result.status === 0) {
                    //3.重新显示列表
                    this.getCategorys()

                }
            }
        })
    }

    //显示添加的对话框
    showAdd = () => {
        //this.category = 
        this.setState({
            showStatus: 1
        })
    }

    //显示更新的对话框
    showUpdate = (category) => {
        this.category = category
        this.setState({
            showStatus: 2
        })
    }



    componentWillMount() {
        this.getColumns()
    }

    componentDidMount() {
        this.getCategorys()
        //
    }

    render() {

        const category = this.category || {} //如果没有，指定空对象
        const { categorys, loading, subCategorys, parentId, parentName, showStatus } = this.state
        const columns = this.columns
        const title = parentId === "0" ? '一级分类列表' : (
            <span>
                <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>
                <Icon type='arrow-right' style={{ marginRight: 5 }} />
                <span>{parentName}</span>
            </span>
        )
        // Card 的右侧 button
        const extra = (
            <Button type='primary' onClick={this.showAdd} >
                <Icon type='plus' /> 添加
            </Button>
        )



        return (
            <Card title={title} extra={extra} >
                <Table
                    bordered
                    rowKey="_id"
                    pagination={{ pageSize: 5, showQuickJumper: true, showSizeChanger: true }}
                    loading={loading}
                    dataSource={parentId === "0" ? categorys : subCategorys}
                    columns={columns}
                />
                <Modal
                    title="添加分类"
                    visible={showStatus === 1}
                    onOk={this.addCategory}
                    onCancel={this.handleCancel}
                >
                    <AddForm categorys={categorys} parentId={parentId} showForm={(form) => { this.form = form }}></AddForm>

                </Modal>
                <Modal
                    title="更新分类"
                    visible={showStatus === 2}
                    onOk={this.updateCategory}
                    onCancel={this.handleCancel}
                >

                    <UpdateForm categoryName={category.name} showForm={(form) => { this.form = form }}></UpdateForm>
                </Modal>

            </Card>

        )
    }
}