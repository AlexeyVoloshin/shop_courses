const { Router } = require("express");
const User = require("../models/user");

const router = Router();
router.get('/login', (req, res) => {
  res.render('auth/login', {
    title: 'Login',
    isLogin: true,
  });
});
router.get('/logout', (req, res) => {
  //we pass to the destroy method callBack which will be triggered when the session data is destroyed
  req.session.destroy(() => {
    res.redirect('/');
  });
})
router.post('/login', async (req, res) => {
  // const user = await User.findById("5f32ad872be7bd1150fc77d3");
  try {
    const { email, password } = req.body;
    const candidat = await User.findOne({ email });
    if (candidat) {
      if (password === candidat.password) {
        req.session.user = candidat;
        req.session.isAuthenticated = true;
        req.session.save((err) => {
          if (err) {
            throw err;
          } else {
            res.redirect('/courses');
          }
        })
      } else {
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

    const candidat = await User.findOne({ email });
    console.log('1', req.body)

    if (candidat) {
      res.redirect('/auth/login#register');
    } else {
      console.log('2')
      if (password === confirm) {
        console.log('3')

        const user = await new User({
          name,
          email,
          password,
          basket: { items: [] }
        })
        await user.save();
        res.redirect('/auth/login#login')
      }
    }

  } catch (e) {
    console.error(e);
  }
})

module.exports = router;
