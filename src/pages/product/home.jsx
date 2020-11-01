import React, { Component } from 'react'
import { Card, Select, Table, Input, Icon, Button,message } from 'antd'

import LinkButton from '../../components/link-button'
import { PAGE_SIZE } from '../../utils/constants'
import { reqProducts, reqSearchProducts,reqUpdateStatus } from '../../api/index'

const Option = Select.Option

export default class ProductHome extends Component {

    state = {
        products: [], //商品数组
        total: 0, //商品的总数量
        loading: false, //是否在加载中
        searchContent: '', //搜索的关键字
        searchType: 'searchName' //根据什么搜索商品
    }

    //初始化表格列的数组的方法-
    initColumns = () => {
        this.columns = [
            {
                width:150,
                title: '商品名称',
                dataIndex: 'name',
            },
            {
                title: '商品描述',
                dataIndex: 'desc',
            },
            {
                title: '价格',
                dataIndex: 'price',
                render: (price) => {
                    return '￥' + price
                }
            },
            {
                title: '状态',
                //dataIndex: 'status',
                render: (product) => {
                    const {status,_id} = product

                    return (
                        <span>
                            <Button type='primary' onClick={() => this.updateStatus(_id,status===1 ? 2:1)}>{status===1?'下架':'上架'}</Button>
                            <span>{status===1? '在售':'已下架'}</span>
                        </span>
                    )
                }
            },
            {
                width: 100,
                title: '操作',
                render: (product) => {

                    return (
                        <span>
                            <LinkButton onClick={() =>this.props.history.push('/product/addupdate',product)}>修改</LinkButton>
                            <LinkButton onClick={() =>this.props.history.push('/product/details',{product})}>详情</LinkButton>
                        </span>
                    )
                }
            },
        ]
    }

    //更新指定商品的状态
    updateStatus = async(productId,status) => {
        const result = await reqUpdateStatus(productId,status)
        if(result.status===0){
            message.success('更新状态成功')
            this.getProducts(this.pageNum)

        }
    }

    //获取指定页码商品分页列表
    getProducts = async (pageNum) => {
        this.pageNum = pageNum
        this.setState({
            loading: true
        })
        //console.log(pageNum)
        const {searchContent,searchType} = this.state
        let result
        if(searchContent){
            result = await reqSearchProducts({pageNum,pageSize:PAGE_SIZE,searchContent,searchType})
        }else{
            result = await reqProducts(pageNum, PAGE_SIZE)
        }
        this.setState({
            loading: false
        })
        if (result.status === 0) {
            //console.log(result)
            const { list, total } = result.data
            this.setState({
                total,
                products:list
            })
        }
    }



    componentWillMount() {
        this.initColumns()
    }

    componentDidMount() {
        this.getProducts(1)
    }

    render() {
        const { products, total, loading, searchType, searchContent } = this.state
        const title = (
            <span>
                <Select style={{ width: 150 }} value={searchType} onChange={value => this.setState({ searchType: value })}>
                    <Option value='searchName'>按名称搜索</Option>
                    <Option value='searchDesc'>按描述搜索</Option>
                </Select>
                <Input
                    placeholder='keywords'
                    style={{ width: 150, margin: '0 15px' }}
                    value={searchContent}
                    onChange = {event => this.setState({searchContent:event.target.value})}
                />
                <Button type='primary' onClick={() => this.getProducts(1)}>search</Button>
            </span>
        )
        const extra = (
            <Button type='primary' onClick = {() => this.props.history.push('/product/addupdate')}>
                <Icon type='plus' />
                添加商品
            </Button>
        )

        const dataSource = products
        const columns = this.columns
        return (
            <Card title={title} extra={extra}>
                <Table
                    dataSource={dataSource}
                    columns={columns}
                    loading={loading}
                    rowKey='_id'
                    pagination={{
                        current: this.pageNum,
                        defaultPageSize: PAGE_SIZE,
                        total,
                        showQuickJumper: true,
                        onChange: this.getProducts
                    }}
                />
            </Card>
        )
    }
}