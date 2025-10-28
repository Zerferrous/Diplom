import React, {useContext} from 'react';
import {Button, Card, Col, Form, Input, Row} from "antd";
import {UserOutlined, LockOutlined, MailOutlined} from "@ant-design/icons";
import { Typography } from 'antd';
import {registartion} from "../http/usersAPI.js";
import {Context} from "../main.jsx";
import {observer} from "mobx-react-lite";
import {NavLink} from "react-router-dom";
const { Link, Text } = Typography;

const Reg = observer(() => {

    const {user} = useContext(Context);

    const onFinish = async (values) => {
        try {
            const data = await registartion(values.email, values.password, values.name, values.surname, values.patronymic, `${values.passportSerie} ${values.passportNumber}`);
            user.setUser(data);
            user.setIsAuthenticated(true);
        } catch (e) {
            alert(e.response.data.message);
        }
    }

    return (
        <div className="flex items-center justify-center h-full">
            <Card title="Регистрация" className="w-full max-w-[600px]">
                <Form
                    name="login"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    layout="vertical"
                >
                    <Form.Item
                        name="email"
                        label="Электронная почта"
                        normalize={value => value.trim().replace(/\s+/g, "")}
                        rules={[{ required: true, message: 'Пожалуйста, введите электронную почту!' }]}
                    >
                        <Input
                            type="email"
                            prefix={<MailOutlined />}
                            placeholder="Электронная почта"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="surname"
                        label="Фамилия"
                        normalize={value => value.trim().replace(/\s+/g, "")}
                        rules={[{ required: true, message: 'Пожалуйста, введите фамилию!' }]}
                    >
                        <Input
                            prefix={<UserOutlined/>}
                            placeholder="Фамилия"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="name"
                        label="Имя"
                        normalize={value => value.trim().replace(/\s+/g, "")}
                        rules={[{ required: true, message: 'Пожалуйста, введите имя!' }]}
                    >
                        <Input
                            prefix={<UserOutlined/>}
                            placeholder="Имя"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="patronymic"
                        label="Отчество"
                        normalize={value => value.trim().replace(/\s+/g, "")}
                        rules={[{ required: false}]}
                    >
                        <Input
                            prefix={<UserOutlined/>}
                            placeholder="Отчество"
                            size="large"
                        />
                    </Form.Item>

                    <Row gutter={24}>
                        <Col span={12} xs={24} sm={12}>
                            <Form.Item
                                name="passportSerie"
                                label="Серия паспорта"
                                normalize={value => value.trim().replace(/\s+/g, "")}
                                rules={[
                                    { required: true, message: 'Введите серию паспорта' },
                                    { pattern: /^\d{4}$/, message: 'Серия должна состоять из 4 цифр' },
                                ]}
                            >
                                <Input.OTP
                                    length={4}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12} xs={24} sm={12}>
                            <Form.Item
                                name="passportNumber"
                                label="Номер паспорта"
                                normalize={value => value.trim().replace(/\s+/g, "")}
                                rules={[
                                    { required: true, message: 'Введите номер паспорта' },
                                    { pattern: /^\d{6}$/, message: 'Номер должен состоять из 6 цифр' }]}>
                            >
                                <Input.OTP
                                    length={6}
                                    size="large"
                                />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="password"
                        label="Пароль"
                        normalize={value => value.trim().replace(/\s+/g, "")}
                        rules={[
                            { required: true, message: 'Пожалуйста, введите пароль!' },
                            {type: "string", min: 3, message: "Пароль слишком короткий!"}
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Пароль"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item
                        name="passwordRepeat"
                        label="Повторите пароль"
                        dependencies={['password']}
                        normalize={value => value.trim().replace(/\s+/g, "")}
                        rules={[{ required: true, message: 'Пароли не совпадают!' },
                            ({ getFieldValue }) => ({
                                validator(_, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Пароли не совпадают!'));
                                },
                            }),
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Повторите пароль"
                            size="large"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700"
                            size="large"
                        >
                            Зарегистрироваться
                        </Button>
                    </Form.Item>

                    <Text>Уже есть аккаунт? <NavLink to="/authorization">Войти!</NavLink></Text>
                </Form>
            </Card>
        </div>
    );
});

export default Reg;