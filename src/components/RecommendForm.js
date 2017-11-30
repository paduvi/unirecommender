import React from 'react';
import {Form, Avatar, Select, InputNumber, Button} from 'antd';

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
        xs: {span: 24},
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
                this.props.history.push('/recommend');
                return;
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;


        return (
            <div>
                <Avatar shape="square"
                        style={{margin: '40px 0 30px 0', transform: 'scale(1.6)'}}
                        size="large"
                        src={process.env.PUBLIC_URL + '/loadscreen.png'}/>
                <div style={{padding: 24, margin: '16px 0', background: '#fff'}}>
                    <Form onSubmit={this.handleSubmit}>
                        <FormItem
                            {...formItemLayout}
                            label="Chọn nhóm ngành"
                            hasFeedback
                        >
                            {getFieldDecorator('branch', {
                                rules: [{required: true, message: 'Bạn hãy chọn nhóm ngành!'}]
                            })(
                                <Select
                                    showSearch
                                    placeholder="Chọn nhóm ngành"
                                    optionFilterProp="children"
                                    notFoundContent="Không tìm thấy"
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
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
                            {getFieldDecorator('total', {
                                rules: [{
                                    required: true,
                                    message: 'Bạn chưa nhập tổng điểm!'
                                }]
                            })(
                                <InputNumber placeholder="Nhập tổng điểm của bạn" style={{width: '100%'}} min={0}/>
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
                            style={{textAlign: 'center'}}
                        >
                            <Button type="primary" size="default" icon="search" htmlType="submit">Tìm
                                trường</Button>
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }
}

const WrappedRecommendForm = Form.create()(RecommendForm);

export default WrappedRecommendForm;