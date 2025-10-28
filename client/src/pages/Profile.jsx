import React, {useContext, useEffect, useMemo, useState} from 'react';
import {
    Button,
    Card,
    Col,
    Descriptions, Input,
    List, message, Popover, Radio,
    Row,
    Space, Tabs,
    Timeline,
    Typography
} from 'antd';
import ProfileMap from '../components/ProfileMap.jsx';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {addUserToOrder, getUsersOrdersNotFinished, getUsersOrdersFinished} from "../http/ordersAPI.js";
import dayjs from "dayjs";
import {getOrderDeliveryStepsMessages} from "../http/orderDeliveryStepsAPI.js";

const Profile = observer(() => {

    const [messageApi, contextHolder] = message.useMessage();
    const error = (message) => {
        messageApi.open({
            type: 'Ошибка',
            content: message,
        });
    };

    const { user } = useContext(Context);

    const userData = user.user;

    const [userOrdersFinished, setUserOrdersFinished] = useState([]);
    const [userOrdersNotFinished, setUserOrdersNotFinished] = useState([]);
    const fetchOrders = async () => {
        const dataNotFinished = await getUsersOrdersNotFinished(user.user.id);
        const dataFinished = await getUsersOrdersFinished(user.user.id);
        setUserOrdersNotFinished(dataNotFinished);
        setUserOrdersFinished(dataFinished);
    }
    useEffect(() => {
        fetchOrders();
    }, []);

    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [deliverySteps, setDeliverySteps] = useState([]);
    useEffect(() => {
        if (!selectedOrderId) return;

        const fetchData = async () => {
            const data = await getOrderDeliveryStepsMessages(selectedOrderId);
            setDeliverySteps(data);
        };

        fetchData();
        }, [selectedOrderId]);

    const logOut = () => {
        localStorage.removeItem('token');
        user.setUser({});
        user.setIsAuthenticated(false);
    }

    const [trackCode, setTrackCode] = useState('');
    const addTrackCode = async () => {
        try {
            await addUserToOrder(userData.id, trackCode);
            await fetchOrders();
        } catch (e) {
            messageApi.error(e?.response?.data?.message || "Произошла ошибка при добавлении посылки");
        }
    }

    return (
        <div className="p-4">
            {contextHolder}
            <Row gutter={[16, 16]}>
                {/* Профиль */}
                <Col xs={24} md={24} lg={6}>
                    <Card title="Мой профиль" className="h-full">
                        <Descriptions layout="vertical" column={1}>
                            <Descriptions.Item label="ФИО">{`${userData.surname} ${userData.name || ''} ${userData.patronymic || ''}`}</Descriptions.Item>
                            <Descriptions.Item label="Эл. почта">{userData.email}</Descriptions.Item>
                            <Descriptions.Item>
                                <Button type="primary" danger block onClick={logOut}>
                                    Выйти
                                </Button>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                </Col>

                {/* Заказы */}
                <Col xs={24} md={24} lg={18} xl={18}>
                    <Card
                        title={
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                                <Typography.Text strong>Отслеживаемые заказы</Typography.Text>
                                <Popover placement="bottom" title="Добавление заказа" content={(
                                    <div>
                                        <Space>
                                            <Input placeholder="Трек-код" value={trackCode} onChange={(e) => setTrackCode(e.target.value)} />
                                            <Button onClick={() => {addTrackCode()}}>
                                                Добавить
                                            </Button>
                                        </Space>
                                    </div>
                                )}>
                                    <Button type="primary">Добавить заказ</Button>
                                </Popover>
                            </div>
                        }
                        className="h-[45vh] overflow-auto"
                    >
                        <Tabs items={[
                            {
                                key: '1',
                                label: "Активные",
                                children: (
                                    <List
                                        dataSource={userOrdersNotFinished}
                                        renderItem={(item, index) => (
                                            <List.Item key={index}>
                                                <div className="flex justify-between w-full items-center">
                                                    <Space direction="vertical" align="start">
                                                        <Typography.Text className="text-base">Заказ №{item.id}</Typography.Text>
                                                        <Typography.Text className="text-base">Трек: {item.track_code}</Typography.Text>
                                                        <Typography.Text type="secondary">От: {dayjs(item.createdAt).format('DD.MM.YYYY HH:mm')}</Typography.Text>
                                                    </Space>
                                                    <Button onClick={() => setSelectedOrderId(item.id)} size="small">Подробнее</Button>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                )
                            },
                            {
                                key: '2',
                                label: "Завершенные",
                                children: (
                                    <List
                                        dataSource={userOrdersFinished}
                                        renderItem={(item, index) => (
                                            <List.Item key={index}>
                                                <div className="flex justify-between w-full items-center">
                                                    <Space direction="vertical" align="start">
                                                        <Typography.Text className="text-base">Заказ №{item.id}</Typography.Text>
                                                        <Typography.Text className="text-base">Трек: {item.track_code}</Typography.Text>
                                                        <Typography.Text type="secondary">От: {dayjs(item.createdAt).format('DD.MM.YYYY HH:mm')}</Typography.Text>
                                                    </Space>
                                                    <Button onClick={() => setSelectedOrderId(item.id)} size="small">Подробнее</Button>
                                                </div>
                                            </List.Item>
                                        )}
                                    />
                                )
                            },
                        ]}>

                        </Tabs>
                    </Card>
                </Col>

                {/* Отслеживание */}
                {selectedOrderId !== null &&
                <Col xs={24} md={24} lg={24} xl={24}>
                    <Card title="Отслеживание" className="h-[44vh] overflow-auto" >
                        <Row gutter={[16, 16]} className="h-full">
                            <Col xs={24} md={12}>
                                <Timeline
                                    items={deliverySteps.map(step => ({
                                        children: (
                                            <div>
                                                <Typography.Text strong>{step.message}</Typography.Text>
                                                <br />
                                                <Typography.Text type="secondary">{step.address}</Typography.Text>
                                                <br />
                                                <Typography.Text type="secondary">{dayjs(step.datetime).format('DD.MM.YYYY HH:mm')}</Typography.Text>
                                            </div>
                                        )
                                    }))}
                                />
                            </Col>
                            <Col xs={24} md={12}>
                                <div className="h-full w-full">
                                    <ProfileMap orderId={selectedOrderId} />
                                </div>
                            </Col>
                        </Row>
                    </Card>
                </Col>
                }
            </Row>
        </div>
    );
});

export default Profile;