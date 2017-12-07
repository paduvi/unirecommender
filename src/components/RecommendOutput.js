import React from 'react';
import {Table, Spin} from 'antd';
import * as qs from 'query-string';


const ipcRenderer = window.require('electron').ipcRenderer;

class RecommendOutput extends React.Component {

    state = {
        results: null
    }

    componentDidMount = () => {
        return this.loadData();
    }

    loadData = async () => {
        const results = await new Promise(resolve => {
            ipcRenderer.send('recommend', qs.parse(this.props.location.search));

            ipcRenderer.on('recommend-response', (event, results) => {
                resolve(results);
            })
        });
        this.setState({results});
    }

    render() {
        if (!this.state.results)
            return (
                <Spin style={{marginTop: '45vh'}} tip="Loading..."/>
            );

        const columns = [{
            title: 'STT',
            dataIndex: 'key',
            width: 50,
            key: 'key'
        }, {
            title: 'Mã ngành',
            dataIndex: 'ma_nganh',
            width: 100,
            key: 'ma_nganh'
        }, {
            title: 'Tên ngành',
            dataIndex: 'ten_nganh',
            key: 'ten_nganh'
        }, {
            title: 'Tên trường',
            dataIndex: 'ten_truong',
            key: 'ten_truong',
            width: 400
        }, {
            title: 'Điểm chuẩn',
            dataIndex: 'diem_chuan',
            key: 'diem_chuan',
            width: 150
        }, {
            title: 'Chỉ tiêu',
            dataIndex: 'chi_tieu_nganh',
            key: 'chi_tieu_nganh',
            width: 150
        }];
        return (
            <div style={{padding: 24, margin: '16px 0 10px 0', background: '#fff', minHeight: 500}}>
                <Table dataSource={this.state.results} columns={columns} size="small"/>
            </div>
        );
    }
}


export default RecommendOutput