import React, {useContext, useEffect, useState} from 'react';
import {Button, Card, Col, Descriptions, Row, Space, Table, Input} from "antd";
import {Context} from "../main.jsx";
import {observer} from "mobx-react-lite";
import {getCurrentOrders, getExpectedOrders, setOrderArrived, setOrderLeft} from "../http/ordersAPI.js";

const Manager = observer(() => {
    const {user} = useContext(Context);
    const userData = user.user;

    const logOut = () => {
        localStorage.removeItem('token');
        user.setUser({});
        user.setIsAuthenticated(false);
    };

    const [expectedOrdersData, setExpectedOrdersData] = useState([]);
    const [currentOrdersData, setCurrentOrdersData] = useState([]);

    const fetchData = async () => {
        const data1 = await getExpectedOrders(userData.id);
        data1.map(data => {
            data.senderData = `ФИО: ${data.senderData.surname} ${data.senderData.name || ""} ${data.senderData.patronymic || ""};\n email: ${data.senderData.email};\n Паспортные данные: ${data.senderData.passport}`;
            data.sizes = `Д: ${data.length}; Ш: ${data.width}; В: ${data.height}; Вес: ${data.weight}`;
        });
        setExpectedOrdersData(data1);

        const data2 = await getCurrentOrders(userData.id);
        data2.map(data => {
            data.senderData = `ФИО: ${data.senderData.surname} ${data.senderData.name || ""} ${data.senderData.patronymic || ""};\n email: ${data.senderData.email};\n Паспортные данные: ${data.senderData.passport}`;
            data.sizes = `Д: ${data.length}; Ш: ${data.width}; В: ${data.height}; Вес: ${data.weight}`;
        });
        setCurrentOrdersData(data2);
    };

    useEffect(() => {
        fetchData();
    }, []);

    const [searchText, setSearchText] = useState("");

    const handleSearch = (value) => {
        setSearchText(value.toLowerCase());
    };

    // Фильтрация
    const filteredExpected = expectedOrdersData.filter(order =>
        JSON.stringify(order).toLowerCase().includes(searchText)
    );

    const filteredCurrent = currentOrdersData.filter(order =>
        JSON.stringify(order).toLowerCase().includes(searchText)
    );

    const columnsExpected = [
        {
            title: 'Трек',
            dataIndex: 'track_code',
            key: 'track_code',
            render: text => <div>{text}</div>,
        },
        {
            title: 'Данные отправителя',
            dataIndex: 'senderData',
            key: 'senderData',
            render: text => <div>{text}</div>,
        },
        {
            title: 'Паспортные данные получателя',
            dataIndex: 'receiver_passport',
            key: 'receiver_passport',
            render: text => <div>{text}</div>,
        },
        {
            title: 'Габариты',
            dataIndex: 'sizes',
            key: 'sizes',
            render: text => <div>{text}</div>,
        },
        {
            title: 'Цена',
            dataIndex: 'cost',
            key: 'cost',
            render: text => <div>{text} руб.</div>,
        },
        {
            title: 'Действие',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={async () => {
                        await setOrderArrived(userData.id, record.id);
                        await fetchData();
                    }}>
                        Принять посылку
                    </Button>
                </Space>
            ),
        },
    ];

    const columnsCurrent = [
        {
            title: 'Трек',
            dataIndex: 'track_code',
            key: 'track_code',
            render: text => <div>{text}</div>,
        },
        {
            title: 'Данные отправителя',
            dataIndex: 'senderData',
            key: 'senderData',
            render: text => <div>{text}</div>,
        },
        {
            title: 'Паспортные данные получателя',
            dataIndex: 'receiver_passport',
            key: 'receiver_passport',
            render: text => <div>{text}</div>,
        },
        {
            title: 'Габариты',
            dataIndex: 'sizes',
            key: 'sizes',
            render: text => <div>{text}</div>,
        },
        {
            title: 'Цена',
            dataIndex: 'cost',
            key: 'cost',
            render: text => <div>{text} руб.</div>,
        },
        {
            title: 'Действие',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <Button onClick={async () => {
                        await setOrderLeft(userData.id, record.id);
                        await fetchData();
                    }}>
                        Отправить посылку
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Row gutter={[16, 16]}>
            <Col span={24}>
                <Card>
                    <Input.Search
                        placeholder="Поиск по всем полям..."
                        allowClear
                        enterButton="Поиск"
                        size="middle"
                        onSearch={handleSearch}
                        onChange={e => handleSearch(e.target.value)}
                    />
                </Card>
            </Col>
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
            <Col xs={24} md={24} lg={18}>
                <Card title="Ожидаемые посылки" className="h-full">
                    <Table columns={columnsExpected} dataSource={filteredExpected} rowKey="id"/>
                </Card>
            </Col>
            <Col xs={24} md={24} lg={24}>
                <Card title="Посылки, ожидающие отправки" className="h-full">
                    <Table columns={columnsCurrent} dataSource={filteredCurrent} rowKey="id"/>
                </Card>
            </Col>
        </Row>
    );
});

export default Manager;