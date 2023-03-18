import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message, Button, Form, Input } from 'antd';
import {Link, useNavigate} from 'react-router-dom'
import "./less/Login.less"
import logoImg from '../assets/logo.png'
import { RegisterApi } from '../request/api';

export default function Register() {
    const navigate = useNavigate()

    const onFinish = (values) => {
        RegisterApi({
            username: values.username,
            password: values.password
        }).then(res =>{
            if(res.errCode === 0){
                message.success(res.message);
                //跳转页面
                setTimeout(() => navigate('/login'), 1500)
            }else{
                message.error(res.message)
            }
        })
    };

    return (
        <div className='login'>
            <div className='login_box'>
            <img src={logoImg} alt=''/>
            <Form
                name="basic"
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}
                autoComplete="off"
            >
            <Form.Item
                name="username"
                rules={[
                {
                    required: true,
                    message: '请输入用户名！',
                },
                ]}
            >
                <Input size='large' prefix={<UserOutlined/>} placeholder='用户名'/>
            </Form.Item>

            <Form.Item
                name="password"
                rules={[
                {
                    required: true,
                    message: '请输入密码!',
                },
                ]}
            >
                <Input.Password size='large' prefix={<LockOutlined/>} placeholder='密码'/>
            </Form.Item>

            <Form.Item
                name="confirm"
                dependencies={['password']}
                hasFeedback
                rules={[
                {
                    required: true,
                    message: '请再次确认密码！',
                },
                ({ getFieldValue }) => ({
                    validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                    }
                    return Promise.reject(new Error('两次密码不相同！'));
                    },
                }),
                ]}
            >
                <Input.Password size='large' prefix={<LockOutlined/>} placeholder='确认密码'/>
            </Form.Item>

            <Form.Item>
                <Link to='/login'>登录</Link>
            </Form.Item>

            <Form.Item>
                <Button size='large' type="primary" htmlType="submit" block>
                注册
                </Button>
            </Form.Item>
            </Form>
        </div>
        </div>
        
    );
}

