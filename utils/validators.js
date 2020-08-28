const { body } = require('express-validator');

exports.registerValidators = [
    body('email').isEmail().withMessage('Введите коректный email'),
    body('password', 'Пароль должен быть минимум 6 символов и содержать только цифры и буквы латиници').isLength({ min: 6, max: 56 }).isAlphanumeric(),
    body('confirm').custom((value, { req, res }) => {
        if (value !== req.body.password) {
            throw new Error('Пароли должны совпадать');
        } else {
            return true
        }
    }),
    body('name').isLength({ min: 3 }).withMessage('Имя должно быть минимум 3 символа')

];

