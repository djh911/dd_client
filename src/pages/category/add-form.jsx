/*
    添加分类的fprm组件
*/

import React, { Component } from 'react'
import {
    Form,
    Select,
    Input,
} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component {

    static propTypae = {
        categorys:PropTypes.array.isRequired,
        parentId:PropTypes.string.isRequired,
        showForm:PropTypes.func.isRequired
    }

    componentWillMount () {
        this.props.showForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const { categorys,parentId } = this.props

        return (
            <Form>
                <Item>
                    {
                        getFieldDecorator('parentId',{
                            initialValue:parentId
                        })(
                            <Select>
                                <Option value='0' key='0'>一级分类</Option>
                                {
                                    categorys.map((category) => {
                                        return (
                                            <Option value={category._id} key={category._id}>{category.name}</Option>
                                        )
                                    })
                                }

                            </Select>

                        )
                    }

                </Item>

                <Item>
                    {
                        getFieldDecorator('categoryName',{
                            initialValue:''
                        })(
                            <Input placeholder="请输入分类名称" />

                        )
                    }
                    
                </Item>


            </Form>
        )
    }

}

export default Form.create()(AddForm)