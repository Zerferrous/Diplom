const sequelize = require('../db');
const { DataTypes } = require('sequelize');

// === МОДЕЛИ ===

const Roles = sequelize.define('roles', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(50), allowNull: false },
}, { tableName: 'roles' });

const Users = sequelize.define('users', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    surname: { type: DataTypes.STRING(100), allowNull: false },
    patronymic: { type: DataTypes.STRING(100), allowNull: true },
    email: { type: DataTypes.STRING(100), allowNull: false },
    password: { type: DataTypes.STRING(256), allowNull: false },
    passport: { type: DataTypes.STRING(11), allowNull: false },
    role: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 3 }
}, { tableName: 'users' });

const DeliveryPoints = sequelize.define('delivery_points', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    address: { type: DataTypes.STRING(150), allowNull: false },
    longitude: { type: DataTypes.DECIMAL(10, 4), allowNull: false },
    latitude: { type: DataTypes.DECIMAL(10, 4), allowNull: false },
    manager: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'delivery_points' });

const DeliveryTypes = sequelize.define('delivery_types', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING(45), allowNull: false }
}, { tableName: 'delivery_types' });

const Orders = sequelize.define('orders', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    sender: { type: DataTypes.INTEGER, allowNull: false },
    track_code: { type: DataTypes.STRING(10), allowNull: false, unique: true },
    from_delivery_point: { type: DataTypes.INTEGER, allowNull: false},
    to_delivery_point: { type: DataTypes.INTEGER, allowNull: false },
    delivery_type: { type: DataTypes.INTEGER, allowNull: false },
    length: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    width: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    height: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    weight: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    value: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    cost: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    receiver_passport: { type: DataTypes.STRING(11), allowNull: false },
}, { tableName: 'orders', timestamps: true });

const Notifications = sequelize.define('notifications', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(100), allowNull: false },
    message: { type: DataTypes.TEXT, allowNull: false },
    step: { type: DataTypes.INTEGER, allowNull: true },
}, { tableName: 'notifications' });

const OrderDeliverySteps = sequelize.define('order_delivery_steps', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    order: { type: DataTypes.INTEGER, allowNull: false },
    step: { type: DataTypes.INTEGER, allowNull: false },
    delivery_point: { type: DataTypes.INTEGER, allowNull: false },
    arrived_at: { type: DataTypes.DATE, allowNull: true },
    left_at: { type: DataTypes.DATE, allowNull: true }
}, { tableName: 'order_delivery_steps' });

const UsersOnOrder = sequelize.define('users_on_order', {
    order: { type: DataTypes.INTEGER, primaryKey: true },
    user: { type: DataTypes.INTEGER, primaryKey: true },
}, { tableName: 'users_on_order' });

const UserNotifications = sequelize.define('user_notifications', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    user: { type: DataTypes.INTEGER, references: { model: 'users_on_order', key: 'user' } },
    order: { type: DataTypes.INTEGER, references: { model: 'users_on_order', key: 'order' } },
    notification: { type: DataTypes.INTEGER, primaryKey: true },
    is_read: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
}, { tableName: 'user_notifications' });


// === СВЯЗИ ===

Roles.hasMany(Users, {foreignKey: 'role'});
Users.belongsTo(Roles, {foreignKey: 'role', targetKey: 'id', as: 'roleData'});

Users.hasOne(DeliveryPoints, {foreignKey: 'manager'});
DeliveryPoints.belongsTo(Users, {foreignKey: 'manager', targetKey: 'id', as: 'managerData'});

Users.hasMany(Orders, { foreignKey: 'sender' });
Orders.belongsTo(Users, { foreignKey: 'sender', targetKey: 'id', as: 'senderData' });

Users.hasMany(UsersOnOrder, { foreignKey: 'user' });
UsersOnOrder.belongsTo(Users, { foreignKey: 'user', targetKey: 'id', as: 'userData' });

DeliveryTypes.hasMany(Orders, { foreignKey: 'delivery_type' });
Orders.belongsTo(DeliveryTypes, { foreignKey: 'delivery_type', targetKey: 'id', as: 'deliveryType' });

DeliveryPoints.hasMany(Orders, { foreignKey: 'from_delivery_point', as: 'fromOrders' });
Orders.belongsTo(DeliveryPoints, { foreignKey: 'from_delivery_point', targetKey: 'id', as: 'fromPoint' });

DeliveryPoints.hasMany(Orders, { foreignKey: 'to_delivery_point', as: 'toOrders' });
Orders.belongsTo(DeliveryPoints, { foreignKey: 'to_delivery_point', targetKey: 'id', as: 'toPoint' });

Orders.hasMany(UsersOnOrder, { foreignKey: 'order' });
UsersOnOrder.belongsTo(Orders, { foreignKey: 'order', targetKey: 'id', as: 'orderData' });

Orders.hasMany(OrderDeliverySteps, { foreignKey: 'order' });
OrderDeliverySteps.belongsTo(Orders, { foreignKey: 'order', targetKey: 'id', as: 'orderData' });

DeliveryPoints.hasMany(OrderDeliverySteps, { foreignKey: 'delivery_point' });
OrderDeliverySteps.belongsTo(DeliveryPoints, { foreignKey: 'delivery_point', targetKey: 'id', as: 'point' });

Orders.hasMany(Notifications, { foreignKey: 'order' });
Notifications.belongsTo(Orders, { foreignKey: 'order', targetKey: 'id', as: 'orderData' });

Notifications.hasMany(UserNotifications, { foreignKey: 'notification' });
UserNotifications.belongsTo(Notifications, { foreignKey: 'notification', targetKey: 'id', as: 'notificationData' });

module.exports = {
    Roles,
    Users,
    DeliveryPoints,
    DeliveryTypes,
    Orders,
    Notifications,
    OrderDeliverySteps,
    UsersOnOrder,
    UserNotifications
}