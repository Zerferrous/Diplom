import React, {useContext, useEffect, useState} from 'react';
import { Button, Card, Col, Descriptions, Row, Space } from "antd";
import { observer } from "mobx-react-lite";
import { Context } from "../main.jsx";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend, LineChart, Line
} from 'recharts';
import {getOrderDeliveryStepsMessages} from "../http/orderDeliveryStepsAPI.js";
import {getDeliveryPointsStats} from "../http/deliveryPointsAPI.js";
import {getDeliveryTypesStats, getOrdersStats} from "../http/ordersAPI.js";
import {getUsersRolesStats} from "../http/usersAPI.js";

const Admin = observer(() => {
    const { user } = useContext(Context);
    const userData = user.user;

    const [deliveryPointsStats, setDeliveryPointsStats] = useState([]);
    const [deliveryTypesStats, setDeliveryTypesStats] = useState([]);
    const [usersRolesStats, setUsersRolesStats] = useState([]);
    const [ordersStats, setOrdersStats] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const dataDeliveryPointsStats = await getDeliveryPointsStats();
            setDeliveryPointsStats(dataDeliveryPointsStats);
            const dataDeliveryTypesStats = await getDeliveryTypesStats();
            setDeliveryTypesStats(dataDeliveryTypesStats);
            const usersRolesStats = await getUsersRolesStats();
            setUsersRolesStats(usersRolesStats);
            const ordersStats = await getOrdersStats();
            setOrdersStats(ordersStats);
        };

        fetchData();
        }, [])

    console.log(deliveryTypesStats);


    const logOut = () => {
        localStorage.removeItem('token');
        user.setUser({});
        user.setIsAuthenticated(false);
    };

    // Цвета для графиков
    const deliveryTypeColors = ['#1890ff', '#52c41a', '#faad14'];
    const userRoleColors = ['#ff4d4f', '#13c2c2', '#722ed1'];


    const getBarColor = (time) => {
        if (time > 60) return '#ff4d4f';
        if (time > 40) return '#faad14';
        return '#52c41a';
    };

    return (
        <Space className="w-full" direction="vertical">
            <Row gutter={[16, 16]}>
                {/* Профиль */}
                <Col xs={24} md={24} lg={6}>
                    <Card title="Мой профиль" className="h-full">
                        <Descriptions layout="vertical" column={1}>
                            <Descriptions.Item label="ФИО">
                                {`${userData.surname} ${userData.name || ''} ${userData.patronymic || ''}`}
                            </Descriptions.Item>
                            <Descriptions.Item label="Эл. почта">{userData.email}</Descriptions.Item>
                            <Descriptions.Item>
                                <Button type="primary" danger block onClick={logOut}>
                                    Выйти
                                </Button>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* График 1: Эффективность пунктов */}
                <Col xs={24} lg={18}>
                    <Card title="Эффективность пунктов сортировки (в минутах)">
                        <ResponsiveContainer width="100%" height={1080}>
                            <BarChart layout="vertical" data={deliveryPointsStats}>
                                <XAxis type="number" label={{ value: 'Минуты', position: 'insideBottomRight', offset: -5 }} />
                                <YAxis type="category" dataKey="address" width={200} />
                                <Tooltip />
                                <Bar dataKey="avgTime">
                                    {deliveryPointsStats.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={getBarColor(entry.avgTime)} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {/* График 2: Заказы по типу */}
                <Col xs={24} md={12}>
                    <Card title="Распределение посылок по типу доставки">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={deliveryTypesStats} dataKey="orders_count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {deliveryTypesStats.map((entry, index) => (
                                        <Cell key={`cell-orders-${index}`} fill={deliveryTypeColors[index % deliveryTypeColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>

                {/* График 3: Пользователи по ролям */}
                <Col xs={24} md={12}>
                    <Card title="Распределение пользователей по ролям">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie data={usersRolesStats} dataKey="user_count" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
                                    {usersRolesStats.map((entry, index) => (
                                        <Cell key={`cell-users-${index}`} fill={userRoleColors[index % userRoleColors.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                {/* График 4: Заказы по дням */}
                <Col xs={24}>
                    <Card title="Динамика заказов за последние дни">
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={ordersStats}>
                                <XAxis dataKey="order_date" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="orders_count" stroke="#722ed1" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </Col>
            </Row>
        </Space>
    );
});

export default Admin;
