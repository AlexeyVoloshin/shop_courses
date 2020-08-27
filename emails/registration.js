const conf = require('../conf');

module.exports = function (email) {
    return {
        to: email,
        from: conf.EMAIL_FROM,
        subject: 'Аккаунт создан',
        html: `
            <h1>Добро пожаловать в наш магазин</h1>
            <p>Вы успешно создали аккаунт с email - ${email}</p>
            <hr />
            <a href="${conf.BASE_URL}">Магазин курсов</a>
        `
    }
}