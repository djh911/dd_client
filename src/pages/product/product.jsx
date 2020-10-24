import React, {Component} from 'react'
import {Switch,Route, Redirect} from 'react-router-dom'

import PruductHome from './home'
import ProductDetails from './detail'
import ProductAddUpadte from './add-update'
import './product.less'

export default class Product extends Component {

    render(){

        return(
            <div>
                <Switch>
                    <Route path = '/product' component={PruductHome} exact></Route>
                    <Route path='/product/details' component={ProductDetails}></Route>
                    <Route path='/product/addupdate' component={ProductAddUpadte}></Route>
                    <Redirect to='/product'/>
                </Switch>
            </div>
        )
    }
}