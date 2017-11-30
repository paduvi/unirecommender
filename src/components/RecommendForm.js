import React from 'react';
import {Form, Select, InputNumber, Button} from 'antd';

const Store = window.require('electron-store');
const store = new Store();

const FormItem = Form.Item;
const Option = Select.Option;


const formItemLayout = {
    labelCol: {
        xs: {span: 24},
        sm: {span: 6},
    },
    wrapperCol: {
        xs: {span: 24},
        sm: {span: 14},
    },
};
const tailFormItemLayout = {
    wrapperCol: {
        xs: {
            span: 14,
            offset: 6,
        },
    },
};

class RecommendForm extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;


        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="Chọn nhóm ngành"
                >
                    {getFieldDecorator('branch', {initialValue: 'all'})(
                        <Select
                            showSearch
                            optionFilterProp="children"
                            notFoundContent="Không tìm thấy"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value='all'>---Tất cả các ngành---</Option>
                            {store.get('list_branch').map(({id, label}) => (
                                <Option value={id}>{label}</Option>
                            ))}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Nhập tổng điểm của bạn:"
                    hasFeedback
                >
                    {getFieldDecorator('total', {rules: [{required: true, message: 'Bạn chưa nhập tổng điểm!'}]})(
                        <InputNumber placeholder="Nhập tổng điểm của bạn" style={{width: '100%'}} min={0}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Đại học / Cao đẳng"
                >
                    {getFieldDecorator('type', {initialValue: 0})(
                        <Select>
                            <Option value={0}>--Loại hình trường--</Option>
                            <Option value={1}>Đại học</Option>
                            <Option value={2}>Cao đẳng</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="Khối thi"
                >
                    {getFieldDecorator('block', {initialValue: 'all'})(
                        <Select
                            showSearch
                            optionFilterProp="children"
                            notFoundContent="Không tìm thấy"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            <Option value='all'>--Khối thi--</Option>
                            {store.get('list_block').map(({id, label}) => (
                                <Option value={id}>{label}</Option>
                            ))}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...tailFormItemLayout}
                >
                    <Button type="primary" size="default" icon="search" htmlType="submit">Tìm trường</Button>
                </FormItem>
            </Form>
        );
    }
}

const WrappedRegistrationForm = Form.create()(RecommendForm);

export default WrappedRegistrationForm;