import React, {useState, useEffect} from 'react';
import { Space, Table, Button, message } from 'antd';
import {ArticleListApi, ArticleDelApi} from '../request/api'
import moment from 'moment'
import './less/List.less'
import {useNavigate} from 'react-router-dom'

//标题组件
function MyTitle(props) {
    return (
        <div>
            <a className='table_title' href={"http://codesohigh.com:8765/article/" + props.id}
            >{props.title}</a>
            <p style={{color: '#999'}}>{props.subTitle}</p>
        </div>
    )
}

//使用表格做list
export default function List() {
    
    //列表数组
    const [arr, setArr] = useState([])
    const [pagination, setPagination] = useState({current: 1, pageSize: 10, total: 0})
    const navigate = useNavigate()
    const [update, setUpdate] = useState([])

    
    //提取请求的代码
    const getArticleList = (current, pageSize) => {
        ArticleListApi({
            num: current,
            count: pageSize
        }).then(res => {
            if(res.errCode === 0){
                //更改pagination
                let {num, count, total} = res.data;
                setPagination({
                    current: num,
                    pageSize: count,
                    total
                })
                //深拷贝获取到的数组
                let newArr = JSON.parse(JSON.stringify(res.data.arr));
                //声明一个空数组
                let myarr = [];

                newArr.map(item => {
                    let obj = {
                        key: item.id,
                        date: moment(item.date).format("YYYY-MM-DD hh:mm:ss"),
                        mytitle: <MyTitle id={item.id} title={item.title} subTitle={item.subTitle}/>
                    }
                    myarr.push(obj)
                })
                setArr(myarr)
            }
        })
    }

    //请求文章列表
    useEffect(() => {
        getArticleList(pagination.current, pagination.pageSize);
    }, [update])

    //分页
    const pageChange = (arg) => {
        getArticleList(arg.current, arg.pageSize);
    }

    //删除
    const delFn = (id) => {
        ArticleDelApi({id}).then(res => {
            if(res.errCode === 0){
                message.success(res.message)
                //重新刷新页面
                setUpdate(update + 1)
            }
        })
    }

    //每一列
    const columns = [
        {
            dataIndex: 'mytitle',
            key: 'mytitle',
            width: '60%',
            render: text => <div>{text}</div>,
        },
        {
            dataIndex: 'date',
            key: 'date',
            render: (text) => <p>{text}</p>,
        },
        {
            key: 'action',
            render: text => (
            <Space size="middle">
                <Button type='primary' onClick={() => navigate('/edit/' + text.key)}>编辑</Button>
                <Button type='primary' danger onClick={() => delFn(text.key)}>删除</Button>
            </Space>
            ),
        },
        ];

    return (
        <div className='list_table'>
            <Table 
                showHeader={false} 
                columns={columns} 
                dataSource={arr} 
                onChange={pageChange}
                pagination={pagination}
            />
        </div>
    );
}