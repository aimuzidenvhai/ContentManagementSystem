import React , {useEffect, useState} from 'react';
import logoImg from '../assets/logo.png'
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space, message} from 'antd';
import defaultAvatar from '../assets/defaultAvatar.jpg'
import {useNavigate} from 'react-router-dom';

export default function Header () {
    const navigate = useNavigate()
    const [avatar, setAvatar] = useState(defaultAvatar)
    const [username, setUsername] = useState("游客")

    //模拟componentDidMount
    useEffect(() => {
        let username1 = localStorage.getItem('username')
        let avatar1 = localStorage.getItem('avatar')
        if(username1){
            setUsername(username1)
        }
        if(avatar1){
            setAvatar('http://47.93.114.103:6688/' + avatar1)
        }
    }, [localStorage.getItem('avatar')]);

    //退出登录
    const logout = () => {

        message.success('退出成功，即将返回登录页面')
        localStorage.clear()  //清除localStorage中的数据
        setTimeout(() => navigate('/login'), 1500)
    }

    const items = [
        {
            key: '1',
            label: '修改资料'
        },
        {
            type: 'divider',
        },
        {
            key: '2',
            onClick: logout,
            label: '退出登录'
        },
        ];

    return (
         <header>
            <img src={logoImg} alt='' className='logo'/>
            <div className='right'>
                 <Dropdown menu={{items,}}>
                    <a onClick={(e) => e.preventDefault()}>
                    
                    <Space>
                        <img src={avatar} className='avatar' alt='' />
                        <span>{username}</span>
                        <DownOutlined />
                    </Space>
                    
                    </a>
                </Dropdown>
            </div>
        </header>
    );
}

