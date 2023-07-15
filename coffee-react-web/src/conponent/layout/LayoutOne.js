import React, { useState } from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    AreaChartOutlined,
    ShoppingCartOutlined,
    CoffeeOutlined,
    LogoutOutlined,
    ProfileOutlined,
    ReadOutlined
} from '@ant-design/icons';
import "../layout/LayoutOne.css"
import { Layout, Menu, Button, theme, Space, Dropdown } from 'antd';
import { useNavigate } from 'react-router-dom'

const { Header, Sider, Content } = Layout;

const LayoutOne = (props) => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const navigate = useNavigate();

    const handleOneClick = (linker) => {
        navigate(linker.key)
    }
    const loginEmployee = localStorage.getItem("role") === "employee"
    const profile = JSON.parse(localStorage.getItem("profile"))

    const menu = () => [
        {
            key: '/',
            icon: <AreaChartOutlined />,
            label: 'Dashboard',
        },
        {
            key: '/sale',
            icon: <ShoppingCartOutlined />,
            label: 'Sale',
        },
        {
            key: '/product',
            icon: <CoffeeOutlined />,
            label: 'Product',
        },
        {
            key: '/user',
            icon: <UserOutlined />,
            label: 'User'
        },
        {
            key: '/Report',
            icon: <ReadOutlined />,
            label: 'Report'
        }
    ]

    const handleLogout = () => {
        localStorage.setItem("isLogin", "0");
        window.location.href = "/coffee-management-system/"
    }

    const menuUser = [
        {
            key: '1',
            label: (
                <div>
                    {profile.Name}
                </div>
            ),
            icon : <UserOutlined />
        },
        {
            key: '2',
            label: (
                <div>
                    {profile.Username}
                </div>
            ),
            icon : <ProfileOutlined />
        },
        {
            key: '3',
            label: (
                <div>
                    Logout
                </div>
            ),
            icon : <LogoutOutlined/>,
            onClick: handleLogout,
        },
    ];



    return (
        <Layout style={{ height: 713 }}>
            {loginEmployee?"":
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical" />
                <div className="coffee">
                    <p>Coffee</p>
                </div>
                <Menu
                    theme="dark"
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    items={menu()}
                    onClick={handleOneClick}
                />
            </Sider>}
            <Layout>
                <Header style={{ padding: 0, background: "#EEEEEE" }}>
                    <div style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
                        <Button
                            type="text"
                            icon={collapsed? loginEmployee?"":<MenuUnfoldOutlined style={{ fontSize: '25px' }} /> : loginEmployee?"":<MenuFoldOutlined style={{ fontSize: '25px' }} />}
                            onClick={() => setCollapsed(!collapsed)}
                            style={{
                                fontSize: '16px',
                                width: 64,
                                height: 64,
                            }}
                        />
                        <Space style={{ marginRight: 30 }}>
                            <Dropdown menu={{ items : menuUser }} placement="bottom">
                                <Button><UserOutlined />{profile.Name}</Button>
                            </Dropdown>
                        </Space>
                    </div>
                </Header>
                <Content
                    style={{
                        margin: '10px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: "#EEEEEE",
                    }}
                >
                    {props.children}
                </Content>
            </Layout>
        </Layout>
    );
};

export default LayoutOne;