import React, { Component } from 'react'
import { Card, Icon, List, } from 'antd'

import miPic from './images/mi10.jpg'
import miPic2 from './images/mi10z.jpg'
import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/constants'
import { reqCategory } from '../../api/index'

const Item = List.Item

export default class ProductDetails extends Component {

    state = {
        cName1: '', //一级分类名称
        cNmae2: '', //二级分类名称
    }

    async componentDidMount() {
        //得到当前商品的分类id
        const { pCategoryId, categoryId } = this.props.location.state.product
        if (pCategoryId === '0') {
            //一级分类下的商品
            const result = await reqCategory(categoryId)
            const cName1 = result.data.name
            this.setState({
                cName1
            })

        } else {
            //二级分类下的商品

            //通过多个await发送多个请求：后面的请求实在前面的请求成功后才发送
            // const result1 = await reqCategory(pCategoryId)
            // const result2 = await reqCategory(categoryId)
            // const cName1 = result1.data.name
            // const cName2 = result2.data.name

            //一次性发多个请求
            const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
            console.log(results)
            const cName1 = results[0].data.name || ''
            const cName2 = results[1].data.name || ''


            this.setState({
                cName1,
                cName2
            })


        }

    }

    render() {

        const { name, price, desc, detail, imgs } = this.props.location.state.product
        const { cName1, cName2 } = this.state

        const title = (
            <span>
                <LinkButton>
                    <Icon type='arrow-left' style={{ marginRight: 15, fontSize: 20 }} onClick={() => this.props.history.push('/product')} />

                </LinkButton>
                <span>商品详情</span>
            </span>
        )


        return (
            <Card title={title} className='product-details'>
                <List grid={{column:1}}>
                    <Item>
                        <span className='left'>商品名称:</span>
                       <span> {name}</span>
                    </Item>
                    <Item>
                        <span className='left' >商品描述:</span>
                        <span style={{display: 'inline-block',width:800}}>{desc}</span>
                    </Item>
                    <Item>
                        <span className='left'>商品价格:</span>
                        <span>{price}元</span>
                    </Item>
                    <Item>
                        <span className='left'>所属分类:</span>
                        <span>{cName1}{cName2 ? ' ---> ' + cName2 : ''}</span>
                    </Item>
                    <Item >
                        <span className='left'>商品图片:</span>
                        {
                            imgs.map(img => <img className='product-img' src={BASE_IMG_URL + img} alt="img" key={img} />)

                        }

                    </Item>
                    <Item>
                        <span className='left'>商品详情:</span>
                        <span dangerouslySetInnerHTML={{ __html: detail }} style={{display: 'inline-block',width:800}}></span>
                    </Item>
                </List>


            </Card>
        )
    }
}