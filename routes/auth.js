const { Router } = require("express");
const User = require("../models/user");

const router = Router();
router.get("/login", (req, res) => {
  res.render("auth/login", {
    title: "Login",
    isLogin: true,
  });
});
router.get("/logout", (req, res) => {
  //we pass to the destroy method callBack which will be triggered when the session data is destroyed
  req.session.destroy(() => {
    res.redirect('/');
  });
})
router.post("/login", async (req, res) => {
  const user = await User.findById("5f32ad872be7bd1150fc77d3");
  req.session.user = user;

  req.session.isAuthenticated = true;
  req.session.save((err) => {
    if (err) {
      throw err;
    } else {
      res.redirect("/courses");
    }
  })
});


module.exports = router;
