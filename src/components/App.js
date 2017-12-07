import React, {PureComponent} from 'react';
import {Layout, Menu, Icon} from 'antd';
import RecommendForm from './RecommendForm';
import RecommendOutput from './RecommendOutput';
import {BrowserRouter as Router, Route} from 'react-router-dom'

const {Content, Footer, Sider} = Layout;

const ipcRenderer = window.require('electron').ipcRenderer;

const withSider = ComposedComponent => class extends PureComponent {
    state = {
        collapsed: true,
    };

    onCollapse = (collapsed) => {
        this.setState({collapsed});
    };

    onClick = ({key}) => {
        switch (key) {
            case 1:
                return this.props.history.push('/');
            case 2:
                return this.exit();
            default:
                return;
        }
    };

    exit = () => {
        ipcRenderer.send('exit');
    };

    render() {
        return <ComposedComponent {...this.state} onCollapse={this.onCollapse}/>
    }
}

const App = ({collapsed, onCollapse}) => (
    <Router>
        <Layout style={{minHeight: '100vh'}}>
            <Sider
                collapsible
                collapsed={collapsed}
                onCollapse={onCollapse}
            >
                <div className="logo"/>
                <Menu theme="dark" selectable={false} mode="inline">
                    <Menu.Item key="1">
                        <Icon type="user"/>
                        <span>Home</span>
                    </Menu.Item>
                    <Menu.Item key="2">
                        <Icon type="poweroff"/>
                        <span>Exit</span>
                    </Menu.Item>
                </Menu>
            </Sider>
            <Layout>
                <Content style={{margin: '0 16px', textAlign: 'center'}}>
                    <Route exact path="/" component={RecommendForm}/>
                    <Route path="/recommend" component={RecommendOutput}/>
                </Content>
                <Footer style={{textAlign: 'center'}}>
                    UniRecommender ©2017 Created by Paduvi
                </Footer>
            </Layout>
        </Layout>
    </Router>
)

export default withSider(App);