import React,{Component} from 'react'
import { Form,Icon, Input, Button,message} from 'antd';
import {Redirect} from 'react-router-dom'


import './login.less'
import logo from './images/hai2.jpg'
import {reqLogin} from '../../api'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
/*
* 登录的路由组件
* */


 class Login extends Component{

  //登录事件，收集表单数据
  handleSubmit = (event)=>{
    // 阻止事件的默认行为
    event.preventDefault()
    this.props.form.validateFields(async(err, values) => {
      if(!err){
        let {username,password} = values
        console.log('输入的表单数据为：', username,password)
        const result = await reqLogin(username,password)
        //console.log("请求成功了",response)
        //const result = response.data
        if(result.status === 0){
          //登录成功，提示登录成功
          message.success('登录成功')

          //保存user
          const user = result.data
          memoryUtils.user = user
          storageUtils.saveUser(user)


          //跳转到管理界面(使用Replace,不需要回退到登录界面)
          this.props.history.replace('/')

        }else{
          //提示错误信息
          message.error(result.msg)
        }
       
      }else{
        console.log("输入表单有错误")
      }
        
        // reqLogin(username,password).then(response =>{
        //   console.log('请求成功了，返回的数据为：',response.data)
        // }).catch(error =>{
        //   console.log('请求失败了',error)
        // })
   
    });
  }

  //自定义表单的校验规则
  /*
    用户名/密码的的合法性要求
      1). 必须输入
      2). 必须大于等于 4 位
      3). 必须小于等于 12 位
      4). 必须是英文、数字或下划线组成
  */

  validator = (rule,value,callback) => {
    
    //callback如果不传参调用即为输入内容符合规范，否则将打印错误类型

    const length = value && value.length
    const pwdReg = /^[a-zA-Z0-9_]+$/ //定义正则表达式，判断输入的内容必须是英文、数字、下划线组成

    if(!value){
      callback("输入密码不能为空")
    }else if(length < 4){
      callback("输入密码位数要大于4")
    }else if(length > 12){
      callback("输入密码位数要小于12")
    }else if(!pwdReg.test(value)){
      callback("密码必须是英文、数字或下划线组成")
    }else{
      callback() //必须要调用callback函数
    }
  }
  
  render() {
    const user = memoryUtils.user
    if(user && user._id){
      return <Redirect to='/'/>

    }


    //得到form
    const { getFieldDecorator } = this.props.form;
    return (
      <div className='login'>
        <header className='login-header'>
          <img src={logo} alt="/"/>
          <h1>React项目：后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h2>用户登录</h2>
          <Form onSubmit={this.handleSubmit} className="login-form">
            <Form.Item>
              {getFieldDecorator('username', {
                //声明式表单校验规则说明
                rules: [
                  { required: true, whitespace: true, message: '必须输入用户名' },
                  { min: 4, message: '用户名必须大于 4 位' },
                  { max: 12, message: '用户名必须小于 12 位' },
                  { pattern: /^[a-zA-Z0-9_]+$/, message: '用户名必须是英文、数组或下划线组成' }

                ],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="Username"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{ validator : this.validator }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  type="password"
                  placeholder="Password"
                />,
              )}
            </Form.Item>
            <Form.Item>
              
              <Button type="primary" htmlType="submit" className="login-form-button">
                Log in
              </Button>
         
            </Form.Item>
          </Form>

        </section>
      </div>
    )
  }
}

/*
  包装WrapLogin组件，使其中有功能强大的form属性
*/
const WrapLogin = Form.create()(Login)
export default WrapLogin

