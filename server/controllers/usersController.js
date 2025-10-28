const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {Users} = require("../models/models");
const ApiError = require("../error/ApiError");
const sequelize = require("../db");

const createJWT = (id, name, surname, patronymic, email, passport, role) => {
    return jwt.sign(
        {id: id, name: name, surname: surname, patronymic: patronymic, email: email, passport: passport, role: role},
        process.env.JWT_SECRET_KEY,
        {expiresIn: '1d'}
    );
}

class UsersController {

    async register(req, res) {
        const { email, password, name, surname, patronymic, passport } = req.body;

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await Users.create({name, surname, patronymic, email, password: hashedPassword, passport});
        const token = await createJWT(user.id, user.name, user.surname, user.patronymic, user.email, user.passport, user.role);
        return res.status(200).json({token})
    }

    async login(req, res, next) {
        const { email, password } = req.body;

        const user = await Users.findOne({where: {email}});
        if (!user) {
            return next(ApiError.badRequest("Пользователь не найден!"));
        }

        let comparePassword = await bcrypt.compareSync(password, user.password);
        if (!comparePassword) {
            return next(ApiError.badRequest("Неверный пароль!"));
        }

        const token = await createJWT(user.id, user.name, user.surname, user.patronymic, user.email, user.passport, user.role);
        res.status(200).json({token})
    }

    async check(req, res, next) {
        const token = createJWT(req.user.id, req.user.name, req.user.surname, req.user.patronymic, req.user.email, req.user.passport, req.user.role)
        return res.status(200).json({token})
    }

    async getUsersRolesStats(req, res, next) {
        const usersCount = await  sequelize.query(`
            SELECT
                roles.name,
                COUNT(users.id) AS user_count
            FROM
                roles
                    LEFT JOIN
                users ON users.role = roles.id
            GROUP BY
                roles.name;
        `, {
            type: sequelize.QueryTypes.SELECT
        });

        return res.json(usersCount);
    }

}

module.exports = new UsersController();