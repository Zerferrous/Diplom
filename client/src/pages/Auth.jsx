import React, {useContext} from 'react';
import {NavLink, useNavigate} from 'react-router-dom';
import {Button, Card, Form, Input, message} from "antd";
import {LockOutlined, MailOutlined} from "@ant-design/icons";
import { Typography } from 'antd';
import {observer} from "mobx-react-lite";
import {Context} from "../main.jsx";
import {login} from "../http/usersAPI.js";
const { Link, Text } = Typography;

const Auth = observer(() => {

    const [messageApi, contextHolder] = message.useMessage();
    const error = (message) => {
        messageApi.open({
            type: 'Ошибка',
            content: message,
        });
    };

    const {user} = useContext(Context);

    const navigate = useNavigate();

    const onFinish = async (values) => {
        try {
            const data = await login(values.email, values.password);
            user.setUser(data);
            user.setIsAuthenticated(true);
            navigate("/profile");
        } catch (e) {
            messageApi.error(e?.response?.data?.message || "Произошла ошибка при входе");
        }
    }

    return (
        <div className="flex items-center justify-center h-full">
            {contextHolder}
            <Card title="Авторизация" className="w-full max-w-[600px]">
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
                        name="password"
                        label="Пароль"
                        normalize={value => value.trim().replace(/\s+/g, "")}
                        rules={[
                            { required: true, message: 'Пожалуйста, введите пароль!' }
                        ]}
                    >
                        <Input.Password
                            prefix={<LockOutlined />}
                            placeholder="Пароль"
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
                            Войти
                        </Button>
                    </Form.Item>

                    <Text>Еще нет аккаунта? <NavLink to="/registration">Зарегистрироваться!</NavLink></Text>
                </Form>
            </Card>
        </div>
    );
});

export default Auth;