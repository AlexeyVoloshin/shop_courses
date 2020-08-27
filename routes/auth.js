const { Router } = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require("../models/user");
const conf = require("../conf");
const regEmail = require("../emails/registration");
const router = Router();

const transporter = nodemailer.createTransport(sendgrid({
  auth: { api_key: conf.SENDGRID_API_KEY }
}))

router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    isLogin: true,
    errorRegister: req.flash('errorRegister'),
    errorLogin: req.flash('errorLogin'),
    success: req.flash('success')
  });
});
router.get('/logout', (req, res) => {
  //we pass to the destroy method callBack which will be triggered when the session data is destroyed
  req.session.destroy(() => {
    res.redirect('/');
  });
})
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const candidate = await User.findOne({ email });
    if (candidate) {
      const pass = await bcrypt.compare(password, candidate.password)
      if (pass) {
        req.session.user = candidate;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          } else {
            res.redirect('/courses');
          }
        })
      } else {
        req.flash('errorLogin', 'Не верный пароль или email!');
        res.redirect('/auth/login#login');
      }
    } else {
      res.redirect('/auth/login#login');
    }
  } catch (e) {
    console.error(e);
  }
});
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, confirm } = req.body;

    const candidate = await User.findOne({ email });

    if (candidate) {
      req.flash('errorRegister', 'Пользователь с таким email уже зарегестрирован!')
      res.redirect('/auth/login#register');
    } else {
      if (password === confirm) {
        const hashPassword = await bcrypt.hash(password, 10);
        const user = await new User({
          name,
          email,
          password: hashPassword,
          basket: { items: [] }
        })
        await user.save();
        req.flash('success', 'Поздравляем!, регистрация прошла успешно');
        res.redirect('/auth/login#login');
        await transporter.sendMail(regEmail(email));
      } else {
        req.flash('errorRegister', 'Пароль не совпадает!');
      }
    }
  } catch (e) {
    console.error(e);
  }
})

module.exports = router;
