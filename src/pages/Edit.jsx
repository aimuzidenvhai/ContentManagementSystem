import React, {useEffect, useState} from 'react';
import { Button, Modal, Form, Input, message} from 'antd';
import {PageHeader} from '@ant-design/pro-layout'
import moment from 'moment';
import '../pages/less/Edit.less'
import E from 'wangeditor'
import {ArticleAddApi, ArticleSearchApi, ArticleUpdateApi} from '../request/api'
import {useParams, useNavigate, useLocation} from 'react-router-dom'

let editor = null;

export default function Edit() {
    const [content, setContent] = useState('')
    const [title, setTitle] = useState('')
    const [subTitle, setSubTitle] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [form] = Form.useForm()
    const params = useParams()
    const location = useLocation()
    const navigate = useNavigate()

    const dealDate = (errCode, msg) => {
        setIsModalOpen(false)   //关闭对话框
        if(errCode === 0){
            message.success(msg)
            //跳回list页面
            setTimeout(() => {
                navigate('/list')
            }, 1500)
        }else{
            message.error(msg)
        }
    }
    //对话框点击后提交
    const handleOk = () => {
        form
        .validateFields()
          .then((values) => {
            // form.resetFields();
            let {title, subTitle} = values;

            //地址栏有id代表要更新一篇文章
            if(params.id){
                //更新文章的请求
                ArticleUpdateApi({title, subTitle, content, id: params.id}).then(res => dealDate(res.errCode, res.message)
                )
            }else{
                //添加文章请求
                ArticleAddApi({title, subTitle, content}).then(res => dealDate(res.errCode, res.message))
            }
            
          })
          .catch(() => {
            return;
          })
        //setIsModalOpen(false);         //关闭对话框
    };

    //模拟componentDidMount
    useEffect(() => {
        editor = new E('#div1')
        editor.config.onchange = (newHtml) => {
            setContent(newHtml)
        }
        editor.create()
        
        //根据地址栏id做请求
        if(params.id){
            ArticleSearchApi({id: params.id}).then(res => {
                console.log(res)
                if(res.errCode === 0){
                    editor.txt.html(res.data.content)  //重新设置编辑器内容
                    setTitle(res.data.title)
                    setSubTitle(res.data.subTitle)
                }
            })
        }

        return () => {
            //组件销毁时销毁编辑器 注：class写法需要在componentWillUmount中调用
            editor.destroy()
        }

    }, [location.pathname]) 

    return (
        <div>
            <PageHeader className='site-page-header-ghost-wrapper'
                ghost={false}
                onBack={params.id ? () => window.history.back() : null}
                title="文章编辑"
                subTitle={"当前日期：" + moment(new Date()).format("YYYY-MM-DD")}
                extra={<Button key="1" type="primary" onClick={() => setIsModalOpen(true)}>提交文章</Button>}
                >
            </PageHeader>
            <div id='div1' style={{padding: "0 20px 20px", background: "#fff"}}></div>
            <Modal zIndex={99999} title="Basic Modal" open={isModalOpen} onOk={handleOk} 
                onCancel={() => setIsModalOpen(false)} okText="提交" cancelText="取消" >
                <Form
                    form={form}
                    labelCol={{span: 4}}
                    wrapperCol={{span: 18}}
                    name="form_in_modal"
                    autoComplete='off'
                    initialValues={{title: title, subTitle: subTitle}}
                >
                    <Form.Item
                        name="title"
                        label="标题"
                        rules={[
                            {
                            required: true,
                            message: '请填写标题!',
                            },
                        ]}
                        >
                        <Input />
                    </Form.Item>
                    <Form.Item name="subTitle" label="副标题">
                        <Input type="textarea" />
                    </Form.Item>
                </Form>
            </Modal>

        </div>
    );
}

