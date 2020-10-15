/*
* 入口js
* */
import React from "react";
import ReactDOM from 'react-dom'

import App from "./App";
import memoryUtils from './utils/memoryUtils'
import storageUtils from './utils/storageUtils'

//读取Local中的保存的user，保存到内存中
const user = storageUtils.getUser()
memoryUtils.user = user

ReactDOM.render(<App/>,document.getElementById('root'))
