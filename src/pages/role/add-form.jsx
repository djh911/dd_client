/*
    添加角色的fprm组件
*/

import React, { Component } from 'react'
import {
    Form,
    Input,
} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item


class AddForm extends Component {

    static propTypae = {
        showForm: PropTypes.func.isRequired
    }

    componentWillMount() {
        this.props.showForm(this.props.form)
    }

    render() {
        const { getFieldDecorator } = this.props.form
        const formItemLayout = {
            labelCol: { span: 5 },
            wrapperCol: { span: 15 }
        }

        return (
            <Form>

                <Item label='角色名称' {...formItemLayout}>
                    {
                        getFieldDecorator('roleName', {
                            initialValue: '',
                            rules: [
                                { required: true, message: '角色名称必须输入' }
                            ]
                        })(
                            <Input placeholder="请输入角色名称" />

                        )
                    }

                </Item>


            </Form>
        )
    }

}

export default Form.create()(AddForm)