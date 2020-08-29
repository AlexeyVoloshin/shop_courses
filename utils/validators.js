const { body } = require('express-validator');
const User = require("../models/user");

exports.registerValidators = [
    body('email').isEmail().withMessage('Введите коректный email')
        .custom(async (value, { req }) => {
            try {
                const user = await User.findOne({ email: value })
                if (user) {
                    return Promise.reject('Пользователь с таким email уже зарегестрирован!');
                }
            } catch (e) {
                console.error(e);
            }
        }).normalizeEmail(),
    body('password', 'Пароль должен быть минимум 6 символов и содержать только цифры и буквы латиници')
        .isLength({ min: 6, max: 56 })
        .isAlphanumeric().trim(),
    body('confirm').custom((value, { req, res }) => {
        if (value !== req.body.password) {
            throw new Error('Пароли должны совпадать');
        } else {
            return true
        }
    }).trim(),
    body('name').isLength({ min: 3 })
        .withMessage('Имя должно быть минимум 3 символа')
        .trim()
];

