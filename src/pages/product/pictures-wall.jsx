import React, { Component } from 'react'
import { Upload, Icon, Modal, message } from 'antd'
import PropTypes from 'prop-types'

import { reqDeleteImg } from '../../api/index'
import {BASE_IMG_URL} from '../../utils/constants'

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = error => reject(error)
    })
}

export default class PicturesWall extends Component {

    static propTpes = {
        imgs: PropTypes.array
    }

    constructor(props) {

        super(props)

        let fileList = []
        //如果传入imgs属性，根据imgs显示
        const imgs = this.props.imgs || []
        console.log(imgs)
        if (imgs || imgs.length > 0) {
            fileList = imgs.map((img, index) => ({
                uid: -index,
                name: img,
                status: 'done',
                url: BASE_IMG_URL + img

            }))

        }
        
        this.state = {
            previewVisible: false, //标识是否显示大图预览
            previewImage: '',  //大图的url地址
            fileList
        }
    }

    getImages = () => this.state.fileList.map(file => file.name)

    handleCancel = () => this.setState({ previewVisible: false })

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        })
    }

    //file 当前操作的文件对象,fileList 当前的文件列表。
    handleChange = async ({ fileList, file }) => {
        //console.log('hnadleChange',file.status,fileList.length,file)

        //一旦上传成功，修改上传的file的信息（name，url）
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                message.success('上传图片成功')
                const { name, url } = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        } else if (file.status === 'removed') {
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }

        }

        this.setState({ fileList })
    }


    render() {
        const { previewVisible, previewImage, fileList } = this.state
        const uploadButton = (
            <div>
                <Icon type="plus" />
                <div className="ant-upload-text">Upload</div>
            </div>
        )
        return (
            <div className="clearfix">
                <Upload
                    accept="image/*" /*接受图片的格式*/
                    action="/manage/img/upload"  /*上传图片的接口地址*/
                    name='image'  /*请求的参数名*/
                    listType="picture-card"
                    fileList={fileList}  /*所有已上传图片的数组*/
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 8 ? null : uploadButton}
                </Upload>
                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                </Modal>
            </div>
        )
    }
}

