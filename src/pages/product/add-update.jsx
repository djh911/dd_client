import React, { Component } from 'react'
import { Card, Form, Input, Icon, Cascader, Upload, Button,message } from 'antd'

import LinkButton from '../../components/link-button'
import { reqCategorys,reqAddProduct,reqUpdateProduct } from '../../api/index'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'

const { TextArea } = Input
const { Item } = Form


class ProductAddUpadte extends Component {

    state = {
        options: [],
    };

    constructor(props) {
        super(props)
        //创建用来保存ref标识的标签对象的容器
        this.pw = React.createRef()
        this.editor = React.createRef()
    }

    //接收一个categorys,生成options数组，并更新状态
    initOptions = async (categorys) => {
        const options = categorys.map(category => ({
            value: category._id,
            label: category.name,
            isLeaf: false
        }))
        // 如果当前是更新, 且商品是一个二级分类的商品
        const { product, isUpdate } = this
        if (isUpdate && product.pCategoryId !== '0') {
            // 异步获取 product.pCategoryId 的二级分类列表
            const subCategorys = await this.getCategorys(product.pCategoryId)
            if (subCategorys && subCategorys.length > 0) {
                // 生成二级的 option 数组
                const cOptions = subCategorys.map(c => ({
                    value: c._id,
                    label: c.name,
                    isLeaf: true,
                }))
                // 找到对应的 option
                const targetOption = options.find(option => option.value === product.pCategoryId)
                // 将 cOptions 添加为对应的一级 option 的 children
                targetOption.children = cOptions
            }
        }
        this.setState({
            options
        })

    }

    //获取一级/二级分类列表，并显示
    getCategorys = async (parentId) => {
        const result = await reqCategorys(parentId)

        if (result.status === 0) {
            const categorys = result.data
            if (parentId === 0) {
                this.initOptions(categorys)
            } else {
                return categorys
            }

        }

    }


    //整个表单提交的提交函数
    submit = () => {
        //进行表单验证
        this.props.form.validateFields( async (error, values) => {
            if (!error) {
               
               

                //1.收集数据，并封装为product对象
                let {name,desc,price,categoryIds} = values
                //price = parseInt(price)
                let pCategoryId,categoryId
                if(categoryIds.length === 1) {
                    pCategoryId = 0
                    categoryId = categoryIds[0]
                } else {
                    pCategoryId = categoryIds[0]
                    categoryId = categoryIds[1]
                }
                const imgs = this.pw.current.getImages()
                const detail = this.editor.current.getDetail()
                let product = {name,desc,price,pCategoryId,categoryId,imgs,detail}
                let result
                if(this.isUpdate) {
                    product._id = this.product._id
                    //调用接口请求函数，进行商品的更新
                    result = await reqUpdateProduct(product)
                } else {
                    //调用接口请求函数，进行商品的添加
                    console.log(product)
                    result = await reqAddProduct(product)
                }
                if(result.status===0 ) {
                    console.log(result)
                    message.success(this.isUpdate ? '商品更新成功' : '商品添加成功')
                    this.props.history.goBack()
                } else {
                    console.log(result)
                    message.error(this.isUpdate ? '商品更新失败' : '商品添加失败')
                }

                


                //3.根据结果显示提示信息
            }
        })
    }

    //自定义验证器
    validatePrice = (rule, value, callback) => {
        if (value * 1 <= 0) {
            callback('验证不通过')
        } else {
            callback() //验证通过
        }
    }


    //加载二级分类的函数
    loadData = async selectedOptions => {
        //得到选中的option
        const targetOption = selectedOptions[0];
        targetOption.loading = true

        //根据选中的分类获取二级分类列表
        const subCategorys = await this.getCategorys(targetOption.value)
        targetOption.loading = false
        if (subCategorys && subCategorys.length > 0) {
            //当前选中的分类有二级分类
            const cOptions = subCategorys.map(c => ({
                value: c._id,
                label: c.name,
                isLeaf: true,
            }))
            targetOption.children = cOptions

        } else {
            //当前选择的分类没有二级分类
            targetOption.isLeaf = true
        }
        this.setState({
            options: [...this.state.options]
        })


    }

    componentWillMount() {
        //添加没有值，修改有值
        const product = this.props.location.state
        console.log(product)
        if (product) {
            this.isUpdate = true
        } else {
            this.isUpdate = false
        }
        this.product = product || {}
    }

    componentDidMount() {
        this.getCategorys(0)
    }


    render() {

        const { isUpdate, product } = this


        const { pCategoryId, categoryId , imgs , detail } = product
        //const imgs = []
        const { options } = this.state
        //指定Item布局的配置对象
        const formItemLayout = {
            labelCol: { span: 2 },
            wrapperCol: { span: 8 }
        }

        // 准备用于级联列表显示的数组
        const categoryIds = []
        if (isUpdate) {
            if (pCategoryId === '0') {
                categoryIds.push(categoryId)
            } else {
                categoryIds.push(pCategoryId)
                categoryIds.push(categoryId)
            }
        }

        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style={{ fontSize: 20 }} onClick={() => this.props.history.push('/product')} />
                </LinkButton>
                <span>{isUpdate ? "修改商品" : "添加商品"}</span>
            </span>
        )

        const { getFieldDecorator } = this.props.form

        return (
            <Card title={title} >
                <Form {...formItemLayout}>
                    <Item label='商品名称' >
                        {
                            getFieldDecorator('name', {
                                initialValue: product.name,
                                rules: [
                                    { required: true, message: '必须输入商品名称' }
                                ]
                            })(<Input placeholder='请输入商品名称'></Input>)
                        }

                    </Item>
                    <Item label='商品描述' >
                        {
                            getFieldDecorator('desc', {
                                initialValue: product.desc,
                                rules: [
                                    { required: true, message: '必须输入商品描述' }
                                ]
                            })(<TextArea placeholder='请输入商品描述' autosize={{ minRows: 2, mixRows: 6 }}></TextArea>)
                        }

                    </Item>
                    <Item label='商品价格' >
                        {
                            getFieldDecorator('price', {
                                initialValue: product.price,
                                rules: [
                                    { required: true, message: '必须输入商品价格' },
                                    { validator: this.validatePrice }
                                ]
                            })(<Input type='number' placeholder='请输入商品价格' addonAfter='￥'></Input>)
                        }

                    </Item>
                    <Item label='商品分类' >
                        {
                            getFieldDecorator('categoryIds', {
                                initialValue: categoryIds,
                                rules: [
                                    { required: true, message: '必须输入指定商品分类' }
                                ]
                            })(
                                <Cascader
                                    options={options}
                                    loadData={this.loadData}

                                />
                            )
                        }

                    </Item>
                    <Item label='商品图片' >
                        <PicturesWall ref={this.pw} imgs={imgs}></PicturesWall>
                    </Item>
                    <Item label='商品详情'
                        labelCol={{ span: 2 }}
                        wrapperCol={{ span: 20 }} >
                        <RichTextEditor ref={this.editor} detail={detail}></RichTextEditor>
                    </Item>
                    <Item>
                        <Button type='primary' onClick={this.submit}>提交</Button>
                    </Item>

                </Form>
            </Card>
        )
    }
}

export default Form.create()(ProductAddUpadte)