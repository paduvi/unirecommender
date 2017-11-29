import React from 'react';
import {Cascader} from 'antd';

function onChange(value) {
    console.log(value);
}

const options = [{
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [{
        value: 'hangzhou',
        label: 'Hanzhou',
        children: [{
            value: 'xihu',
            label: 'West Lake',
        }],
    }],
}, {
    value: 'jiangsu',
    label: 'Jiangsu',
    children: [{
        value: 'nanjing',
        label: 'Nanjing',
        children: [{
            value: 'zhonghuamen',
            label: 'Zhong Hua Men',
        }],
    }],
}];

const RecommendForm = () => (
    <Cascader options={options} onChange={onChange} changeOnSelect style={{width: '100%'}}/>
);

export default RecommendForm;