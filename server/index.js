require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./routes/index');
const errorHandler = require('./middleware/ErrorHandlingMiddleware');
const sequelize = require('./db');
const {DeliveryTypes, DeliveryPoints, Users, Roles, Orders, UsersOnOrder, OrderDeliverySteps} = require("./models/models");
const {deliveryTypesData, deliveryPointsData, rolesData, usersData, ordersData, usersOnOrderData, orderDeliveryStepsData
} = require("./models/data");
const bcrypt = require("bcrypt");

const PORT = process.env.SERVER_PORT || 8080;

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', router);

app.use(errorHandler);

const start = async () => {
    try {
        await sequelize.authenticate();
        //Создание БД
        await sequelize.sync({force: true});

        //Вставка начальных данных в таблицы
        await Roles.bulkCreate(rolesData);
        await Users.bulkCreate(usersData);
        await DeliveryTypes.bulkCreate(deliveryTypesData);
        await DeliveryPoints.bulkCreate(deliveryPointsData);

        //Создание триггеров
        await sequelize.query(
            `DROP TRIGGER IF EXISTS \`${process.env.DB_NAME}\`.\`orders_AFTER_INSERT\`;`
        );
        await sequelize.query(
            `CREATE TRIGGER orders_AFTER_INSERT
                AFTER INSERT ON orders
                FOR EACH ROW
                BEGIN
                  INSERT INTO \`${process.env.DB_NAME}\`.users_on_order (\`order\`, \`user\`, createdAt, updatedAt)
                  VALUES (NEW.id, NEW.sender, NOW(), NOW());
                END;`
        );

        await sequelize.query(
            `DROP TRIGGER IF EXISTS \`${process.env.DB_NAME}\`.\`order_delivery_steps_AFTER_UPDATE\`;`
        );
        await sequelize.query(
            `CREATE TRIGGER \`order_delivery_steps_AFTER_UPDATE\` AFTER UPDATE ON \`order_delivery_steps\` FOR EACH ROW BEGIN
            -- Если изменилось время прибытия
            IF NOT (OLD.arrived_at <=> NEW.arrived_at) THEN
        
                -- Первый шаг
                IF NEW.step = 1 THEN
                    INSERT INTO \`${process.env.DB_NAME}\`.\`notifications\` (\`order\`, \`title\`, \`message\`, \`step\`, \`createdAt\`, \`updatedAt\`)
                    VALUES (NEW.order, 'Заказ в точке отправления', 'Заказ принят в пункте отправления, ожидайте дальнейших обновлений!', NEW.step, now(), now());
        
                -- Последний шаг
                ELSEIF NEW.step = (
                    SELECT MAX(step)
                    FROM \`order_delivery_steps\`
                    WHERE \`order\` = NEW.order
                ) THEN
                    INSERT INTO \`${process.env.DB_NAME}\`.\`notifications\` (\`order\`, \`title\`, \`message\`, \`step\`, \`createdAt\`, \`updatedAt\`)
                    VALUES (NEW.order, 'Заказ доставлен!', 'Заказ ожидает выдачи в пункте назначения, возьмите с собой паспорт!', NEW.step, now(), now());
        
                -- Промежуточные шаги
                ELSE
                    INSERT INTO \`${process.env.DB_NAME}\`.\`notifications\` (\`order\`, \`title\`, \`message\`, \`step\`, \`createdAt\`, \`updatedAt\`)
                    VALUES (NEW.order, 'Изменение статуса заказа!', 'Заказ принят в новом пункте доставки, ожидайте дальнейших обновлений!', NEW.step, now(), now());
                END IF;
        
            -- Если изменилось время отбытия
            ELSEIF NOT (OLD.left_at <=> NEW.left_at) THEN
                IF NEW.step <> (
                    SELECT MAX(step)
                    FROM \`order_delivery_steps\`
                    WHERE \`order\` = NEW.order
                ) THEN
                    INSERT INTO \`${process.env.DB_NAME}\`.\`notifications\` (\`order\`, \`title\`, \`message\`, \`step\`, \`createdAt\`, \`updatedAt\`)
                    VALUES (NEW.order, 'Изменение статуса заказа!', 'Заказ покинул пункт доставки, ожидайте дальнейших обновлений!', NEW.step, now(), now());
                ELSE
                    INSERT INTO \`${process.env.DB_NAME}\`.\`notifications\` (\`order\`, \`title\`, \`message\`, \`step\`, \`createdAt\`, \`updatedAt\`)
                    VALUES (NEW.order, 'Заказ забрали!', 'Заказ забрали, доставка считается завершенной!', NEW.step, now(), now());
                END IF;
            END IF;
        END`
        );

        await sequelize.query(
            `DROP TRIGGER IF EXISTS \`${process.env.DB_NAME}\`.\`notifications_AFTER_INSERT\`;`
        );
        await sequelize.query(
            `CREATE TRIGGER \`notifications_AFTER_INSERT\` AFTER INSERT ON \`notifications\` FOR EACH ROW BEGIN
                INSERT INTO \`${process.env.DB_NAME}\`.\`user_notifications\` (\`user\`, \`order\`, \`notification\`, \`createdAt\`, \`updatedAt\`)
                SELECT \`users_on_order\`.\`user\`, \`users_on_order\`.\`order\`, NEW.id, now(), now()
                FROM \`users_on_order\`
                WHERE \`users_on_order\`.\`order\` = NEW.\`order\`;
            END`
        )

        app.listen(PORT, () => console.log(`Сервер запущен на порту: ${PORT}`));
    } catch (e) {
        console.log(e);
    }
}

start();