const conf = require('../conf');

module.exports = function (email, token) {
    return {
        to: email,
        from: conf.EMAIL_FROM,
        subject: 'Восстановление доступа к сайту',
        html: `
            <h1>Вы забыли пароль?</h1>
            <p>Если нет, то проигнорируйте данное письмо</p>
            <p>Иначе нажмите на ссылку ниже:</p>
            <p><a href="${conf.BASE_URL}/auth/password/${token}">Восстановить доступ</a></p>
            <hr />
            <a href="${conf.BASE_URL}">Магазин курсов</a>
        `
    }
}