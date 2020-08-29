const { Router } = require("express");
const bcrypt = require("bcryptjs");
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const User = require("../models/user");
const conf = require("../conf");
const regEmail = require("../emails/registration");
const resEmail = require("../emails/reset");
const crypto = require("crypto");
const { validationResult } = require('express-validator');
const validators = require("../utils/validators")

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
router.post('/register', validators.registerValidators, async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      req.flash('errorRegister', errors.array()[0].msg);
      return res.status(422).redirect('/auth/login#register');
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const user = await new User({
      name,
      email,
      password: hashPassword,
      basket: { items: [] }
    });
    await user.save();
    req.flash('success', 'Поздравляем! регистрация прошла успешно');
    res.redirect('/auth/login#login');
    await transporter.sendMail(regEmail(email));
  } catch (e) {
    console.error(e);
  }
});
router.get('/reset', (req, res) => {
  res.render('auth/reset', {
    title: 'Востановление пароля',
    error: req.flash('error')
  })
})
router.post('/reset', (req, res) => {
  try {
    crypto.randomBytes(32, async (err, buffer) => {
      if (err) {
        req.flash('error', 'Что-то пошло не так, повторите попытку позже');
        return res.redirect('/auth/reset');
      }
      const token = buffer.toString('hex');
      const candidate = await User.findOne({ email: req.body.email });

      if (candidate) {
        candidate.resetToken = token;
        candidate.resetTokenExp = Date.now() + 60 * 60 * 1000;
        await candidate.save();
        await transporter.sendMail(resEmail(candidate.email, token));
        res.redirect('/auth/login');
      } else {
        req.flash('error', 'Такого email нет!');
        res.redirect('/auth/reset');
      }
    });
  } catch (e) {
    console.error(e);
  }
})
router.get('/password/:token', async (req, res) => {
  if (!req.params.token) {
    return res.redirect('/auth/login');
  }
  try {
    const user = await User.findOne({
      resetToken: req.params.token,
      resetTokenExp: { $gt: Date.now() }
    });
    if (!user) {
      return res.redirect('/auth/login')
    } else {
      res.render('auth/password', {
        title: 'Restore access',
        error: req.flash('error'),
        userId: user._id.toString(),
        token: req.params.token
      });
    }

  } catch (e) {
    console.error(e);
  }


})
router.post('/password', async (req, res) => {
  try {
    const { password, userId, token } = req.body;
    const user = await User.findOne({
      _id: userId,
      resetToken: token,
      resetTokenExp: { $gt: Date.now() } //must be greater than the current date
    })
    if (user) {
      user.password = await bcrypt.hash(password, 10);
      user.resetToken = undefined;
      user.resetTokenExp = undefined;
      await user.save()
      res.redirect('/auth/login');
    } else {
      req.flash('loginError', 'Время востановления пароля истекло');
      res.redirect('/auth/login');
    }
  } catch (e) {
    console.error(e);
  }
})
module.exports = router;
