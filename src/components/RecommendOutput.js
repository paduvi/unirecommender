import React from 'react';
import {Table, Spin} from 'antd';

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
            ipcRenderer.send('recommend', {
                brand: 7,
                total: 25
            });

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
            title: 'Mã ngành',
            dataIndex: 'ma_nganh',
            width: 50,
            key: 'ma_nganh'
        }, {
            title: 'Tên ngành',
            dataIndex: 'ten_nganh',
            key: 'ten_nganh'
        }, {
            title: 'Tên trường',
            dataIndex: 'ten_truong',
            key: 'ten_truong'
        }];
        return (
            <div style={{padding: 24, margin: '16px 0 10px 0', background: '#fff', minHeight: 360}}>
                <Table dataSource={this.state.results} columns={columns} size="small" pagination={false}/>
            </div>
        );
    }
}


export default RecommendOutput