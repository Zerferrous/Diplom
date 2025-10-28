const bcrypt = require("bcrypt");
const rolesData = [
    {
        name: 'Администратор'
    },
    {
        name: 'Управляющий'
    },
    {
        name: 'Клиент'
    }
]

const deliveryTypesData = [
    {
        name: 'Обычная'
    },
    {
        name: 'Срочная'
    }
]

const usersData = [
    {
        name: 'Администратор',
        surname: '',
        email: process.env.ADMIN_EMAIL,
        password: bcrypt.hashSync(process.env.ADMIN_PASSWORD, 12),
        passport: '',
        role: 1,
    },
    {
        name: 'Управляющий',
        surname: 'Нижний Новгород, улица Звездинка, 9',
        email: 'NizhnyNovgorodDP@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '',
        role: 2
    },
    {
        name: 'Управляющий',
        surname: 'Москва, улица Новый Арбат, 11с1',
        email: 'MoskvaNovyArbat11s1DP@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '',
        role: 2
    },
    {
        name: 'Управляющий',
        surname: 'Санкт-Петербург, проспект Римского-Корсакова, 23',
        email: 'SanktPeterburgRimskogoKorsakova23DP@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '',
        role: 2
    },
    {
        name: 'Управляющий',
        surname: 'Республика Татарстан, Казань, Вахитовский район, улица Калинина, 1',
        email: 'KazanKalinin1DP@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '',
        role: 2
    },
    {
        name: 'Управляющий',
        surname: 'Чувашская Республика, Чебоксары, проспект Ленина, 3',
        email: 'CheboksaryLenina3DP@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '',
        role: 2
    },
    {
        name: 'Управляющий',
        surname: 'Екатеринбург, улица Малышева, 5',
        email: 'EkaterinburgMalysheva5DP@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '',
        role: 2
    },
    {
        name: 'Управляющий',
        surname: 'Новосибирск, Красный проспект, 182',
        email: 'NovosibirskKrasnyProspekt182DP@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '',
        role: 2
    },
    {
        name: 'Управляющий',
        surname: 'Ростов-на-Дону, проспект Ворошиловский, 24',
        email: 'RostovVoroshilovsky24DP@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '',
        role: 2
    },
    {
        name: 'Управляющий',
        surname: 'Самара, Московское шоссе, 4',
        email: 'SamaraMoskovskoe4DP@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '',
        role: 2
    },
    {
        name: 'Управляющий',
        surname: 'Уфа, проспект Октября, 67',
        email: 'UfaOktyabrya67DP@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '',
        role: 2
    },
    {
        name: 'Управляющий',
        surname: 'Пермь, улица Ленина, 64',
        email: 'PermLenina64DP@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '',
        role: 2
    },
    {
        name: 'Управляющий',
        surname: 'Волгоград, улица Советская, 20',
        email: 'VolgogradSovetskaya20DP@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '',
        role: 2
    },
    {
        name: 'Управляющий',
        surname: 'Красноярск, улица Карла Маркса, 114',
        email: 'KrasnoyarskKarlaMarksa114DP@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '',
        role: 2
    },
    {
        name: 'Управляющий',
        surname: 'Саратов, улица Чапаева, 59',
        email: 'SaratovChapaeva59DP@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '',
        role: 2
    },
    {
        name: 'Управляющий',
        surname: 'Тюмень, улица Республики, 61',
        email: 'TyumenRespubliki61DP@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '',
        role: 2
    },
    {
        surname: 'Дубков',
        name: 'Матвей',
        patronymic: 'Алексеевич',
        email: 'dubkov.05@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '9999 999999'
    },
    {
        surname: 'Куракин',
        name: 'Кирилл',
        patronymic: 'Захарович',
        email: 'kirill38@outlook.com',
        password: bcrypt.hashSync("1234", 12),
        passport: '2347 238987'
    },
    {
        surname: 'Донцов',
        name: 'Давид',
        patronymic: 'Семенович',
        email: 'david.doncov@rambler.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '3474 834823'
    },
    {
        surname: 'Язова',
        name: 'Милана',
        patronymic: 'Даниловна',
        email: 'milana1982@mail.ru',
        password: bcrypt.hashSync("1234", 12),
        passport: '3456 765432'
    }
]

const deliveryPointsData = [
    {
        address: 'Нижний Новгород, улица Звездинка, 9',
        longitude: '43.9994',
        latitude: '56.3165',
        manager: 2
    },
    {
        address: 'Москва, улица Новый Арбат, 11с1',
        longitude: '37.5962',
        latitude: '55.7521',
        manager: 3
    },
    {
        address: 'Санкт-Петербург, проспект Римского-Корсакова, 23',
        longitude: '30.3042',
        latitude: '59.9246',
        manager: 4
    },
    {
        address: 'Республика Татарстан, Казань, Вахитовский район, улица Калинина, 1',
        longitude: '49.1361',
        latitude: '55.7813',
        manager: 5
    },
    {
        address: 'Чувашская Республика, Чебоксары, проспект Ленина, 3',
        longitude: '47.2472',
        latitude: '56.1311',
        manager: 6
    },
    {
        address: 'Екатеринбург, улица Малышева, 5',
        longitude: '60.5975',
        latitude: '56.8376',
        manager: 7
    },
    {
        address: 'Новосибирск, Красный проспект, 182',
        longitude: '82.9204',
        latitude: '55.0415',
        manager: 8
    },
    {
        address: 'Ростов-на-Дону, проспект Ворошиловский, 24',
        longitude: '39.7126',
        latitude: '47.2292',
        manager: 9
    },
    {
        address: 'Самара, Московское шоссе, 4',
        longitude: '50.2358',
        latitude: '53.1959',
        manager: 10
    },
    {
        address: 'Уфа, проспект Октября, 67',
        longitude: '56.0361',
        latitude: '54.7388',
        manager: 11
    },
    {
        address: 'Пермь, улица Ленина, 64',
        longitude: '56.2429',
        latitude: '58.0112',
        manager: 12
    },
    {
        address: 'Волгоград, улица Советская, 20',
        longitude: '44.5103',
        latitude: '48.7080',
        manager: 13
    },
    {
        address: 'Красноярск, улица Карла Маркса, 114',
        longitude: '92.8672',
        latitude: '56.0097',
        manager: 14
    },
    {
        address: 'Саратов, улица Чапаева, 59',
        longitude: '45.9801',
        latitude: '51.5315',
        manager: 15
    },
    {
        address: 'Тюмень, улица Республики, 61',
        longitude: '65.5416',
        latitude: '57.1522',
        manager: 16
    }
]

// const ordersData = [
//     {
//         sender: 17,
//         track_code: 'TRK000001',
//         from_delivery_point: 1,
//         to_delivery_point: 2,
//         delivery_type: 1,
//         length: 30.50,
//         width: 20.00,
//         height: 15.75,
//         weight: 2.30,
//         value: 1500.00,
//         cost: 350.00,
//         receiver_passport: '1234 567890'
//     },
//     {
//         sender: 18,
//         track_code: 'TRK000002',
//         from_delivery_point: 3,
//         to_delivery_point: 4,
//         delivery_type: 2,
//         length: 40.00,
//         width: 25.00,
//         height: 20.00,
//         weight: 3.50,
//         value: 2500.00,
//         cost: 400.00,
//         receiver_passport: '2345 678901'
//     },
//     {
//         sender: 19,
//         track_code: 'TRK000003',
//         from_delivery_point: 5,
//         to_delivery_point: 6,
//         delivery_type: 1,
//         length: 25.00,
//         width: 15.00,
//         height: 10.00,
//         weight: 1.20,
//         value: 900.00,
//         cost: 280.00,
//         receiver_passport: '3456 789012'
//     },
//     {
//         sender: 20,
//         track_code: 'TRK000004',
//         from_delivery_point: 7,
//         to_delivery_point: 8,
//         delivery_type: 2,
//         length: 50.00,
//         width: 30.00,
//         height: 25.00,
//         weight: 5.75,
//         value: 3200.00,
//         cost: 550.00,
//         receiver_passport: '4567 890123'
//     },
//     {
//         sender: 17,
//         track_code: 'TRK000005',
//         from_delivery_point: 9,
//         to_delivery_point: 10,
//         delivery_type: 1,
//         length: 35.00,
//         width: 22.00,
//         height: 18.00,
//         weight: 2.80,
//         value: 1800.00,
//         cost: 370.00,
//         receiver_passport: '5678 901234'
//     },
//     {
//         sender: 18,
//         track_code: 'TRK000006',
//         from_delivery_point: 11,
//         to_delivery_point: 12,
//         delivery_type: 2,
//         length: 28.00,
//         width: 18.00,
//         height: 14.00,
//         weight: 2.00,
//         value: 1200.00,
//         cost: 320.00,
//         receiver_passport: '6789 012345'
//     },
//     {
//         sender: 19,
//         track_code: 'TRK000007',
//         from_delivery_point: 13,
//         to_delivery_point: 14,
//         delivery_type: 1,
//         length: 45.00,
//         width: 29.00,
//         height: 24.00,
//         weight: 4.60,
//         value: 2700.00,
//         cost: 500.00,
//         receiver_passport: '7890 123456'
//     },
//     {
//         sender: 20,
//         track_code: 'TRK000008',
//         from_delivery_point: 15,
//         to_delivery_point: 1,
//         delivery_type: 2,
//         length: 38.00,
//         width: 26.00,
//         height: 20.00,
//         weight: 3.90,
//         value: 2000.00,
//         cost: 430.00,
//         receiver_passport: '8901 234567'
//     },
//     {
//         sender: 17,
//         track_code: 'TRK000009',
//         from_delivery_point: 2,
//         to_delivery_point: 3,
//         delivery_type: 1,
//         length: 32.00,
//         width: 21.00,
//         height: 17.00,
//         weight: 2.50,
//         value: 1600.00,
//         cost: 360.00,
//         receiver_passport: '9012 345678'
//     },
//     {
//         sender: 18,
//         track_code: 'TRK000010',
//         from_delivery_point: 4,
//         to_delivery_point: 5,
//         delivery_type: 2,
//         length: 29.00,
//         width: 19.00,
//         height: 13.00,
//         weight: 1.80,
//         value: 1100.00,
//         cost: 310.00,
//         receiver_passport: '0123 456789'
//     }
// ];
//
// const usersOnOrderData = [
//     {
//         order: 1,
//         user: 17
//     },
//     {
//         order: 2,
//         user: 18
//     },
//     {
//         order: 3,
//         user: 19
//     },
//     {
//         order: 4,
//         user: 20
//     },
//     {
//         order: 5,
//         user: 17
//     },
//     {
//         order: 6,
//         user: 18
//     },
//     {
//         order: 7,
//         user: 19
//     },
//     {
//         order: 8,
//         user: 20
//     },
//     {
//         order: 9,
//         user: 17
//     },
//     {
//         order: 10,
//         user: 18
//     },
// ];
//
// const orderDeliveryStepsData = [
//     // Заказ 1 - доставлен до 2 шага
//     { order: 1, step: 1, delivery_point: 1, arrived_at: '2024-01-01T08:00:00Z', left_at: '2024-01-01T09:00:00Z' },
//     { order: 1, step: 2, delivery_point: 2 },
//
//     // Заказ 2 - доставлен до 3 шага
//     { order: 2, step: 1, delivery_point: 3, arrived_at: '2024-01-01T08:30:00Z', left_at: '2024-01-01T10:00:00Z' },
//     { order: 2, step: 2, delivery_point: 2, arrived_at: '2024-01-01T11:00:00Z', left_at: '2024-01-01T13:00:00Z' },
//     { order: 2, step: 3, delivery_point: 4 },
//
//     // Заказ 3 - в пути
//     { order: 3, step: 1, delivery_point: 5 },
//     { order: 3, step: 2, delivery_point: 4 },
//     { order: 3, step: 3, delivery_point: 6 },
//
//     // Заказ 4 - доставлен до 4 шага
//     { order: 4, step: 1, delivery_point: 7, arrived_at: '2024-01-01T07:00:00Z', left_at: '2024-01-01T08:00:00Z' },
//     { order: 4, step: 2, delivery_point: 15, arrived_at: '2024-01-01T09:00:00Z', left_at: '2024-01-01T10:00:00Z' },
//     { order: 4, step: 3, delivery_point: 6, arrived_at: '2024-01-01T11:00:00Z', left_at: '2024-01-01T12:00:00Z' },
//     { order: 4, step: 4, delivery_point: 10, arrived_at: '2024-01-01T13:00:00Z' },
//     { order: 4, step: 5, delivery_point: 9 },
//     { order: 4, step: 6, delivery_point: 14 },
//     { order: 4, step: 7, delivery_point: 12 },
//     { order: 4, step: 8, delivery_point: 8 },
//
//     // Заказ 5 - доставлен до 2 шага
//     { order: 5, step: 1, delivery_point: 9, arrived_at: '2024-01-01T09:00:00Z', left_at: '2024-01-01T10:00:00Z' },
//     { order: 5, step: 2, delivery_point: 10 },
//
//     // Заказ 6 - не доставлен
//     { order: 6, step: 1, delivery_point: 11 },
//     { order: 6, step: 2, delivery_point: 10 },
//     { order: 6, step: 3, delivery_point: 9 },
//     { order: 6, step: 4, delivery_point: 12 },
//
//     // Заказ 7 - доставлен до 6 шага
//     { order: 7, step: 1, delivery_point: 13, arrived_at: '2024-01-01T08:00:00Z', left_at: '2024-01-01T09:00:00Z' },
//     { order: 7, step: 2, delivery_point: 7, arrived_at: '2024-01-01T10:00:00Z', left_at: '2024-01-01T11:00:00Z' },
//     { order: 7, step: 3, delivery_point: 15, arrived_at: '2024-01-01T12:00:00Z', left_at: '2024-01-01T13:00:00Z' },
//     { order: 7, step: 4, delivery_point: 6, arrived_at: '2024-01-01T14:00:00Z', left_at: '2024-01-01T15:00:00Z' },
//     { order: 7, step: 5, delivery_point: 10, arrived_at: '2024-01-01T16:00:00Z', left_at: '2024-01-01T17:00:00Z' },
//     { order: 7, step: 6, delivery_point: 4, arrived_at: '2024-01-01T18:00:00Z' },
//     { order: 7, step: 7, delivery_point: 9 },
//     { order: 7, step: 8, delivery_point: 14 },
//
//     // Заказ 8 - не доставлен
//     { order: 8, step: 1, delivery_point: 15 },
//     { order: 8, step: 2, delivery_point: 6 },
//     { order: 8, step: 3, delivery_point: 11 },
//     { order: 8, step: 4, delivery_point: 1 },
//
//     // Заказ 9 - доставлен до 2 шага
//     { order: 9, step: 1, delivery_point: 2, arrived_at: '2024-01-01T08:00:00Z', left_at: '2024-01-01T09:00:00Z' },
//     { order: 9, step: 3, delivery_point: 3 },
//
//     // Заказ 10 - доставлен до 2 шага
//     { order: 10, step: 1, delivery_point: 5, arrived_at: '2024-01-01T08:00:00Z', left_at: '2024-01-01T09:00:00Z' },
//     { order: 10, step: 2, delivery_point: 4, arrived_at: '2024-01-01T10:00:00Z' },
//     { order: 10, step: 3, delivery_point: 6 }
// ];


module.exports = {
    rolesData: rolesData,
    usersData,
    deliveryTypesData,
    deliveryPointsData,
    // ordersData,
    // usersOnOrderData,
    // orderDeliveryStepsData
}