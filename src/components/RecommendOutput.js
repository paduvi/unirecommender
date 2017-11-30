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

    actionMore = (e, param) => {
        e.preventDefault();
        console.log(param);
    }

    render() {
        if (!this.state.results)
            return (
                <Spin style={{marginTop: '45vh'}} tip="Loading..."/>
            );

        const columns = [{
            title: 'Mã',
            dataIndex: 'id',
            width: 50,
            key: 'id',
        }, {
            title: 'Tên trường',
            dataIndex: 'name',
            key: 'name',
            render: (text, record) => <a onClick={e => this.actionMore(e, {university: record.id})}>{text}</a>,
        }, {
            title: 'Kết quả',
            dataIndex: 'count',
            key: 'count',
            width: 70
        }];
        return (
            <div style={{padding: 24, margin: '16px 0 10px 0', background: '#fff', minHeight: 360}}>
                <Table dataSource={this.state.results} columns={columns} size="small" pagination={false}/>
            </div>
        );
    }
}


export default RecommendOutput