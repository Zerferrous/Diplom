import React, {useContext, useEffect, useState} from 'react';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    NotificationOutlined,
    CalculatorOutlined,
    DashboardOutlined, CodeSandboxOutlined,
} from '@ant-design/icons';
import {Button, Layout, Menu, Avatar, theme, Space, Badge, Popover, Flex, Typography} from 'antd';
import {
    ADMIN_ROUTE,
    AUTH_ROUTE,
    CALCULATOR_ROUTE,
    CREATE_ORDER_ROUTE,
    MANAGER_ROUTE,
    PROFILE_ROUTE
} from "../utils/consts.js";
import {Context} from "../main.jsx";
import {observer} from "mobx-react-lite";
import {NavLink, useLocation} from "react-router-dom";
import {getUsersNewNotifications, readNotification} from "../http/notificationsAPI.js";

const {Header, Sider, Content} = Layout;
const {Text} = Typography;

const Sidebar = observer(({children}) => {
    const [collapsed, setCollapsed] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [popoverOpen, setPopoverOpen] = useState(false);

    const {
        token: {colorBgContainer},
    } = theme.useToken();

    const {user} = useContext(Context);
    const location = useLocation();

    const [sidebarItems, setSidebarItems] = useState([]);

    const getSelectedKey = () => {
        if (location.pathname.startsWith('/authorization')) return AUTH_ROUTE;
        if (location.pathname.startsWith('/registration')) return AUTH_ROUTE;
        if (location.pathname.startsWith('/profile')) return PROFILE_ROUTE;
        if (location.pathname.startsWith('/admin')) return ADMIN_ROUTE;
        if (location.pathname.startsWith('/calculator')) return CALCULATOR_ROUTE;
        if (location.pathname.startsWith('/createOrder')) return CREATE_ORDER_ROUTE;
        if (location.pathname.startsWith('/manager')) return MANAGER_ROUTE;
        return '';
    };

    useEffect(() => {
        if (!user.isAuthenticated) {
            setSidebarItems([
                {
                    key: AUTH_ROUTE,
                    icon: <UserOutlined/>,
                    label: <NavLink to={AUTH_ROUTE}>Авторизация</NavLink>,
                },
                {
                    key: CALCULATOR_ROUTE,
                    icon: <CalculatorOutlined/>,
                    label: <NavLink to={CALCULATOR_ROUTE}>Калькулятор</NavLink>,
                },
            ]);
        } else if (user.isAuthenticated && user.user.role === 1) {
            setSidebarItems([
                {
                    key: ADMIN_ROUTE,
                    icon: <DashboardOutlined/>,
                    label: <NavLink to={ADMIN_ROUTE}>Админ-панель</NavLink>,
                },
                {
                    key: CALCULATOR_ROUTE,
                    icon: <CalculatorOutlined/>,
                    label: <NavLink to={CALCULATOR_ROUTE}>Калькулятор</NavLink>,
                },
            ]);
        } else if (user.isAuthenticated && user.user.role === 2) {
            setSidebarItems([
                {
                    key: MANAGER_ROUTE,
                    icon: <DashboardOutlined/>,
                    label: <NavLink to={MANAGER_ROUTE}>Управляющий</NavLink>,
                },
                {
                    key: CALCULATOR_ROUTE,
                    icon: <CalculatorOutlined/>,
                    label: <NavLink to={CALCULATOR_ROUTE}>Калькулятор</NavLink>,
                },
            ]);
        } else if (user.isAuthenticated && user.user.role === 3) {
            setSidebarItems([
                {
                    key: PROFILE_ROUTE,
                    icon: <DashboardOutlined/>,
                    label: <NavLink to={PROFILE_ROUTE}>Профиль</NavLink>,
                },
                {
                    key: CALCULATOR_ROUTE,
                    icon: <CalculatorOutlined/>,
                    label: <NavLink to={CALCULATOR_ROUTE}>Калькулятор</NavLink>,
                },
                {
                    key: CREATE_ORDER_ROUTE,
                    icon: <CodeSandboxOutlined/>,
                    label: <NavLink to={CREATE_ORDER_ROUTE}>Новая посылка</NavLink>,
                }
            ]);
        }
    }, [user.isAuthenticated]);

    useEffect(() => {
        let intervalId;

        const fetchNotifications = async () => {
            try {
                if (user.isAuthenticated && user.user?.id ) {
                    const data = await getUsersNewNotifications(user.user.id);
                    setNotifications(data);
                    setNotificationCount(data.length);
                }
            } catch (error) {
                console.error('Ошибка при получении уведомлений:', error);
            }
        };

        if (user.isAuthenticated) {
            fetchNotifications(); // первая загрузка
            intervalId = setInterval(fetchNotifications, 30000);
        }

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [user.isAuthenticated, user.user?.id]);

    const handlePopoverOpen = async (newOpen) => {
        if (newOpen && notifications.length > 0) {
            try {
                await Promise.all(
                    notifications.map((n) => readNotification(n.id))
                );
                // Обнуляем счётчик и обновляем список
                setNotificationCount(0);
            } catch (e) {
                console.error('Ошибка при пометке уведомлений как прочитанных:', e);
            }
        }
    };

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Sider trigger={null} collapsible collapsed={collapsed}>
                <div className="demo-logo-vertical"/>
                <Menu
                    theme="dark"
                    mode="inline"
                    selectedKeys={[getSelectedKey()]}
                    items={sidebarItems}
                />
            </Sider>
            <Layout>
                <Header className="flex justify-between items-center" style={{padding: 0, background: colorBgContainer}}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined/> : <MenuFoldOutlined/>}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{fontSize: '16px', width: 64, height: 64}}/>
                    {user.isAuthenticated && user.user.role === 3 &&
                        <Space style={{marginRight: 12}}>
                            <Popover
                                title="Уведомления"
                                trigger="click"
                                onOpenChange={handlePopoverOpen}
                                content={
                                    <Flex vertical gap="small" style={{ maxWidth: 300 }}>
                                        {notifications.length === 0 ? (
                                            <Text type="secondary">Нет новых уведомлений</Text>
                                        ) : (
                                            notifications.map((n) => (
                                                <div
                                                    key={n.id}
                                                    style={{
                                                        padding: '12px',
                                                        borderRadius: '8px',
                                                        backgroundColor: '#f6f6f6',
                                                        border: '1px solid #e0e0e0',
                                                        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)'
                                                    }}
                                                >
                                                    <Flex vertical>
                                                        <Text strong ellipsis style={{ fontSize: '14px', marginBottom: '4px' }}>
                                                            🔔 {n.notificationData.title}
                                                        </Text>
                                                        <Text type="secondary" style={{ fontSize: '12px' }} ellipsis={{ tooltip: n.notificationData.message }}>
                                                            {n.notificationData.message}
                                                        </Text>
                                                    </Flex>
                                                </div>
                                            ))
                                        )}
                                    </Flex>
                                }
                            >
                                <Badge count={notificationCount}>
                                    <Avatar icon={<NotificationOutlined/>}/>
                                </Badge>
                            </Popover>
                        </Space>
                    }
                </Header>
                <Content className="p-4">
                    {children}
                </Content>
            </Layout>
        </Layout>
    );
});

export default Sidebar;