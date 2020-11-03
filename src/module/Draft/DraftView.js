import {Layout, Row, Col, Menu, Button, Icon, Tabs} from 'antd';
import {useMemo, useState} from 'react';
import 'antd/dist/antd.less';

import ss from './DraftView.less';

/// #if ENV == 'DE'
import 'antd/dist/antd.less';
/// #endif

const {Header, Content, Sider} = Layout;
const { SubMenu } = Menu;
const { TabPane } = Tabs;

function DraftView() {

    return (
        <Layout className={ss.wrapper}>
            <Header className="header" style={{padding: '0 20px'}}>
                <Row type="flex">
                    <Col xs={24} sm={10}>
                        {/* <div className="logo">Live Theme</div> */}
                        <div className="logo">
                            <h1 className="logo-title">Ant Design</h1>
                        </div>
                    </Col>
                    <Col xs={0} sm={14}>
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['1']}
                            style={{lineHeight: '64px'}}
                        >
                            <Menu.Item key="1">nav 1</Menu.Item>
                            <Menu.Item key="2">nav 2</Menu.Item>
                            <Menu.Item key="3">nav 3</Menu.Item>
                        </Menu>
                    </Col>
                </Row>
            </Header>
            <Layout>
                <Sider width={256}>
                    <Menu
                        style={{width: 256}}
                        defaultSelectedKeys={['1']}
                        defaultOpenKeys={['sub1']}
                        mode="inline"
                    >
                        <SubMenu
                            key="sub1"
                            title={
                                <span>
              <Icon type="mail"/>
              <span>Navigation One</span>
            </span>
                            }
                        >
                            <Menu.ItemGroup key="g1" title="Item 1">
                                <Menu.Item key="1">Option 1</Menu.Item>
                                <Menu.Item key="2">Option 2</Menu.Item>
                            </Menu.ItemGroup>
                            <Menu.ItemGroup key="g2" title="Item 2">
                                <Menu.Item key="3">Option 3</Menu.Item>
                                <Menu.Item key="4">Option 4</Menu.Item>
                            </Menu.ItemGroup>
                        </SubMenu>
                        <SubMenu
                            key="sub2"
                            title={
                                <span>
              <Icon type="appstore"/>
              <span>Navigation Two</span>
            </span>
                            }
                        >
                            <Menu.Item key="5">Option 5</Menu.Item>
                            <Menu.Item key="6">Option 6</Menu.Item>
                            <SubMenu key="sub3" title="Submenu">
                                <Menu.Item key="7">Option 7</Menu.Item>
                                <Menu.Item key="8">Option 8</Menu.Item>
                            </SubMenu>
                        </SubMenu>
                        <SubMenu
                            key="sub4"
                            title={
                                <span>
              <Icon type="setting"/>
              <span>Navigation Three</span>
            </span>
                            }
                        >
                            <Menu.Item key="9">Option 9</Menu.Item>
                            <Menu.Item key="10">Option 10</Menu.Item>
                            <Menu.Item key="11">Option 11</Menu.Item>
                            <Menu.Item key="12">Option 12</Menu.Item>
                        </SubMenu>
                    </Menu>
                </Sider>
                <Content
                    id="preview-content"
                    style={{
                        flex: 1,
                        overflow: 'auto'
                    }}
                >
                    <Tabs defaultActiveKey="1">
                        <TabPane tab="Tab 1" key="1">
                            <div>
                                <Button type="primary">Primary</Button>
                                <Button>Default</Button>
                                <Button type="dashed">Dashed</Button>
                                <Button type="danger">Danger</Button>
                                <Button type="link">Link</Button>
                            </div>
                        </TabPane>
                        <TabPane tab="Tab 2" key="2">
                            Content of Tab Pane 2
                        </TabPane>
                        <TabPane tab="Tab 3" key="3">
                            Content of Tab Pane 3
                        </TabPane>
                    </Tabs>
                </Content>
            </Layout>
        </Layout>

    );
}

export {DraftView}
