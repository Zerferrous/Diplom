import React, {useEffect, useState} from 'react';
import {
    Button,
    Col,
    Form,
    InputNumber,
    Row,
    Select,
    Typography,
    Radio,
    Card,
    Input,
    Popover,
    Tabs,
    Flex,
    Avatar, Alert
} from 'antd';
import {getAll as getAllPoints} from "../http/deliveryPointsAPI.js";
import {getAll as getAllTypes}  from "../http/deliveryTypesAPI.js";
const { Title, Text } = Typography;

const sizes = [
    {
        value: 'convert',
        label: (
            <Flex align={'center'} gap={20}>
                <Avatar size={'large'} shape={"square"} src="./public/sizes/convert.svg"/>
                <Flex vertical gap={4} justify={"space-between"}>
                    <Typography.Text>
                        Конверт
                    </Typography.Text>
                    <Typography.Paragraph>
                        34x27x2 см, до 0.5 кг
                    </Typography.Paragraph>
                </Flex>
            </Flex>
        ),
        length: '34',
        width: '27',
        height: '2',
        weight: '0.5',
    },
    {
        value: 'box_xs',
        label: (
            <Flex align={'center'} gap={20}>
                <Avatar size={'large'} shape={"square"} src="./public/sizes/box_xs.svg"/>
                <Flex vertical gap={4} justify={"space-between"}>
                    <Typography.Text>
                        Короб XS
                    </Typography.Text>
                    <Typography.Paragraph>
                        17x12x9 см, до 0.5 кг
                    </Typography.Paragraph>
                </Flex>
            </Flex>
        ),
        length: '17',
        width: '12',
        height: '9',
        weight: '0.5'
    },
    {
        value: 'box_s',
        label: (
            <Flex align={'center'} gap={20}>
                <Avatar size={'large'} shape={"square"} src="./public/sizes/box_s.svg"/>
                <Flex vertical gap={4} justify={"space-between"}>
                    <Typography.Text>
                        Короб S
                    </Typography.Text>
                    <Typography.Paragraph>
                        23x19x10 см, до 2 кг
                    </Typography.Paragraph>
                </Flex>
            </Flex>
        ),
        length: '23',
        width: '19',
        height: '10',
        weight: '2'
    },
]

const Calculator = () => {

    const [form] = Form.useForm();

    const [open, setOpen] = useState(false);
    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const [rValue, setRValue] = useState(1);
    const onRChange = e => {
        const size = sizes.find(size => size.value == e.target.value);
        setSizeValue(`Длина: ${size.length} см; Ширина: ${size.width} см; Высота: ${size.height} см; Вес: ${size.weight} кг`);
        setRValue(e.target.value);
        form.setFieldValue("size", size);
    };

    const [sizeValue, setSizeValue] = useState("");
    const onSizeFinish = values => {
        if (values.length === null || values.length === undefined) {
            values.length = 1;
        }
        if (values.width === null || values.width === undefined) {
            values.length = 1;
        }
        if (values.height === null || values.height === undefined) {
            values.length = 1;
        }
        if (values.weight === null || values.weight === undefined) {
            values.length = 1;
        }
        setSizeValue(`Длина: ${values.length} см; Ширина: ${values.width} см; Высота: ${values.height} см; Вес: ${values.weight} кг`);
        form.setFieldValue("size", values);
    };

    function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
        const toRad = (value) => value * Math.PI / 180;

        const R = 6371; // радиус Земли в км
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;

        return distance;
    }

    const [errorText, setErrorText] = useState('');
    const [deliveryCost, setDeliveryCost] = useState(null);
    const onCalculate = values => {
        if (!values.size || !values.deliveryType || !values.from || !values.to) {
            setDeliveryCost(null);
            setErrorText('Заполните все поля!')
            return;
        }

        if (values.from === values.to) {
            setDeliveryCost(null);
            setErrorText('Пункт отправки и пункт доставки должны быть разными!')
            return;
        }

        const length = parseFloat(values.size.length) || 1;
        const width = parseFloat(values.size.width) || 1;
        const height = parseFloat(values.size.height) || 1;
        const weight = parseFloat(values.size.weight) || 1;
        const value = parseFloat(values.value) || 0;
        const deliveryType = values.deliveryType;

        // Получаем точки отправки и назначения
        const fromPoint = deliveryPoints.find(point => point.id === values.from);
        const toPoint = deliveryPoints.find(point => point.id === values.to);

        if (!fromPoint || !toPoint) {
            setDeliveryCost(null);
            return;
        }

        // Расчет расстояния в километрах
        const distanceKm = getDistanceFromLatLonInKm(
            fromPoint.latitude,
            fromPoint.longitude,
            toPoint.latitude,
            toPoint.longitude
        );

        // Объём в кубических сантиметрах
        const volume = length * width * height;

        // Весовой коэффициент (5000 см³ = 1 кг)
        const volumetricWeight = volume / 5000;

        // Используем максимальный из фактического веса и объёмного
        const billableWeight = Math.max(weight, volumetricWeight);

        // Тарифы доставки (примерные)
        const deliveryTypeRates = {
            1: 100,
            2: 150,
            3: 200
        };

        const baseRate = deliveryTypeRates[deliveryType] || 100;

        // Расчет стоимости с учетом расстояния (например, стоимость увеличивается с километражом)
        // Например, базовая ставка + расстояние * 3 руб * вес * коэффициент
        let cost = baseRate + distanceKm * 3 * billableWeight;

        // Доплата за ценность посылки
        if (value > 0) {
            cost += value * 0.01;
        }

        setDeliveryCost(cost.toFixed(2));
    };

    const [deliveryTypes, setDeliveryTypes] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllTypes();
            setDeliveryTypes(data);
        }
        fetchData()
    }, [])

    const [deliveryPoints, setDeliveryPoints] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const data = await getAllPoints();
            setDeliveryPoints(data);
        }
        fetchData()
    }, []);

    return (
        <div className="flex items-center justify-center h-full">
            <Card title="Калькулятор доставки" className="w-full max-w-[1600px]">
                <Form layout="vertical" className="mt-4" onFinish={onCalculate} form={form}>
                    <Row gutter={[16, 16]} wrap>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item label="Точка отправки" name="from"
                                       rules={[
                                           {required: true, message: 'Выберите точку отправки' }
                                       ]}>
                                <Select showSearch placeholder="Выберите точку отправки" options={
                                    deliveryPoints.map((point) => (
                                        {
                                            value: point.id,
                                            label: point.address
                                        }
                                    ))}
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) => {
                                            var _a, _b;
                                            return (
                                                (_a = optionA === null || optionA === void 0 ? void 0 : optionA.label) !== null &&
                                                _a !== void 0
                                                    ? _a
                                                    : ''
                                            )
                                                .toLowerCase()
                                                .localeCompare(
                                                    ((_b = optionB === null || optionB === void 0 ? void 0 : optionB.label) !== null &&
                                                        _b !== void 0
                                                            ? _b
                                                            : ''
                                                    ).toLowerCase(),
                                                );
                                        }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item label="Точка назначения" name="to" rules={[
                                {required: true, message: "Выберите точку назначения"}
                            ]}>
                                <Select showSearch placeholder="Выберите точку назначения" options={
                                    deliveryPoints.map((point) => (
                                        {
                                            value: point.id,
                                            label: point.address
                                        }
                                    ))}
                                        optionFilterProp="label"
                                        filterSort={(optionA, optionB) => {
                                            var _a, _b;
                                            return (
                                                (_a = optionA === null || optionA === void 0 ? void 0 : optionA.label) !== null &&
                                                _a !== void 0
                                                    ? _a
                                                    : ''
                                            )
                                                .toLowerCase()
                                                .localeCompare(
                                                    ((_b = optionB === null || optionB === void 0 ? void 0 : optionB.label) !== null &&
                                                        _b !== void 0
                                                            ? _b
                                                            : ''
                                                    ).toLowerCase(),
                                                );
                                        }}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} md={12} lg={8}>
                            <Form.Item label="Размер посылки" name="size"
                                       rules={[
                                           {required: true, message: 'Введите размер посылки' }
                                       ]}>
                                <Popover open={open}
                                         onOpenChange={handleOpenChange}
                                         placement={'bottom'}
                                         trigger={'click'}
                                         content={
                                             <div onClick={(e) => e.stopPropagation()}>
                                                 <Tabs items={
                                                     [
                                                         {
                                                             key: '1',
                                                             label: "Выбрать",
                                                             children: (
                                                                 <Radio.Group
                                                                     style={
                                                                         {
                                                                             display: 'flex',
                                                                             flexDirection: 'column',
                                                                             gap: 8
                                                                         }
                                                                     }
                                                                     value={rValue}
                                                                     onChange={onRChange}
                                                                     options={sizes}/>
                                                             )
                                                         },
                                                         {
                                                             key: '2',
                                                             label: "Вручную",
                                                             children: (
                                                                 <Form layout={"vertical"} onFinish={onSizeFinish}>
                                                                     <Row gutter={[16, 16]} className="max-w-[400px]" wrap>
                                                                         <Col span={12} >
                                                                             <Form.Item label="Длина" name="length" required={true} initialValue={1}>
                                                                                 <InputNumber min={1} max={199} suffix={"см"}>

                                                                                 </InputNumber>
                                                                             </Form.Item>
                                                                         </Col>
                                                                         <Col span={12} >
                                                                             <Form.Item label="Ширина" name="width" required={true} initialValue={1}>
                                                                                 <InputNumber min={1} max={199} suffix={"см"}>

                                                                                 </InputNumber>
                                                                             </Form.Item>
                                                                         </Col>
                                                                         <Col span={12} >
                                                                             <Form.Item label="Высота" name="height" required={true} initialValue={1}>
                                                                                 <InputNumber min={1} max={199} suffix={"см"}>

                                                                                 </InputNumber>
                                                                             </Form.Item>
                                                                         </Col>
                                                                         <Col span={12} >
                                                                             <Form.Item label="Вес" name="weight" required={true} initialValue={1}>
                                                                                 <InputNumber min={1} max={199} suffix={"кг"}>

                                                                                 </InputNumber>
                                                                             </Form.Item>
                                                                         </Col>
                                                                         <Col span={24} >
                                                                             <Form.Item className="mt-6">
                                                                                 <Button type="primary" size="large" className="w-full" htmlType={"submit"}>
                                                                                     Подтвердить
                                                                                 </Button>
                                                                             </Form.Item>
                                                                         </Col>
                                                                     </Row>
                                                                 </Form>
                                                             )
                                                         },
                                                     ]
                                                 }>
                                                 </Tabs>
                                             </div>
                                         }>
                                    <Input placeholder="Выберите размер посылки" className="w-full max-w-[400px]" value={sizeValue} readOnly>
                                    </Input>
                                </Popover>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Title level={5} className="mt-4">Тип доставки</Title>
                    <Form.Item name="deliveryType" className="mt-2" rules={[
                        {required: true, message: 'Выбирите тип доставки' }
                    ]}>
                        <Radio.Group>
                            {
                                deliveryTypes.map((deliveryType) => (
                                    <Radio.Button key={deliveryType.id} value={deliveryType.id}>{deliveryType.name}</Radio.Button>
                                ))
                            }
                        </Radio.Group>
                    </Form.Item>

                    <Title level={5} className="mt-4">Ценность посылки, руб.</Title>
                    <Form.Item name="value" className="mt-2" rules={[
                        {required: true, message: 'Введите ценность посылки' }
                    ]}>
                        <InputNumber min={0} max={100000} style={{width: '100%'}} placeholder="Введите сумму" className="w-full max-w-[400px]" />
                    </Form.Item>

                    <Form.Item className="mt-6">
                        <Button type="primary" size="large" className="w-[200px]" htmlType={"submit"}>
                            Рассчитать
                        </Button>
                    </Form.Item>
                </Form>
                {/* Показываем стоимость, если она есть */}
                {deliveryCost !== null && (
                    <div className="mt-6">
                        <Title level={4}>Стоимость доставки: <Text type="success">{deliveryCost} руб.</Text></Title>
                    </div>
                )}
                {errorText.length > 0 && (
                    <Alert
                        message="Ошибка"
                        description={errorText}
                        type="error"
                        closable
                    />
                )}
            </Card>
        </div>
    );
};

export default Calculator;