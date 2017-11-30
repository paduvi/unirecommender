import React from 'react';
import {Table} from 'antd';

const columns = [{
    title: 'Mã',
    dataIndex: 'id',
    width: 50,
    key: 'id',
}, {
    title: 'Tên trường',
    dataIndex: 'name',
    key: 'name',
    render: text => <a href="#">{text}</a>,
}, {
    title: 'Kết quả',
    dataIndex: 'count',
    key: 'count',
    width: 70
}];

const data = [{
    key: '1',
    id: 'BKA',
    name: 'Đại Học Bách Khoa Hà Nội',
    count: 3
}, {
    key: '2',
    id: 'QHI',
    name: 'Đại Học Công Nghệ – Đại Học Quốc Gia Hà Nội',
    count: 2
}, {
    key: '3',
    id: 'KHA',
    name: 'Đại Học Kinh Tế Quốc Dân',
    count: 4
}];

export default () => (
    <div>
        <div style={{padding: 24, margin: '16px 0 10px 0', background: '#fff', minHeight: 400}}>
            <Table dataSource={data} columns={columns} size="small" pagination={false}/>
        </div>
    </div>
);