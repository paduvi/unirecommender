import React, {PureComponent} from 'react';
import {Layout, Menu, Icon} from 'antd';
import RecommendForm from './RecommendForm';

const {Content, Footer, Sider} = Layout;


const withSider = ComposedComponent => class extends PureComponent {
    state = {
        collapsed: true,
    };

    onCollapse = (collapsed) => {
        this.setState({collapsed});
    }

    render() {
        return <ComposedComponent {...this.state} onCollapse={this.onCollapse}/>
    }
}

const App = ({collapsed, onCollapse}) => (
    <Layout style={{minHeight: '100vh'}}>
        <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={onCollapse}
        >
            <div className="logo"/>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1">
                    <Icon type="user"/>
                    <span>Home</span>
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout>
            <Content style={{margin: '0 16px'}}>
                <div style={{padding: 24, margin: '16px 0', background: '#fff', minHeight: 360}}>
                    <RecommendForm/>
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>
                UniRecommender ©2017 Created by Paduvi
            </Footer>
        </Layout>
    </Layout>
)

export default withSider(App);