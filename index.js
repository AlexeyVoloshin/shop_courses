const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const session = require("express-session");
const homeRout = require("./routes/home");
const coursesRout = require("./routes/courses");
const addRout = require("./routes/add");
const basketRout = require("./routes/basket");
const ordersRout = require("./routes/orders");
const authRout = require("./routes/auth");
const varMiddleware = require("./middleware/variables");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const User = require("./models/user");

const app = express();

const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: "main", //файл входа всех layouts
  extname: "hbs", //расширение вьюшки
});
app.engine("hbs", hbs.engine); //регестрируем движок
app.set("view engine", "hbs"); //используем движок
app.set("views", "pages"); //папка где храняться вьюшки

// app.use(async (req, res, next) => {
//   try {
//     const user = await User.findById("5f32ad872be7bd1150fc77d3");
//     req.user = user;
//     next();
//   } catch (e) {
//     console.error(e);
//   }
// });

app.use(express.static(path.join(__dirname, "public"))); //регестрируем папку для стилей
app.use(express.urlencoded({ extended: true })); //вместо Buffer.from()
//подключаем сессии
app.use(
  session({
    secret: "some secret value",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(varMiddleware);

app.use("/", homeRout);
app.use("/add", addRout);
app.use("/courses", coursesRout);
app.use("/basket", basketRout);
app.use("/orders", ordersRout);
app.use("/auth", authRout);

const PORT = process.env.PORT || 3000;

async function init() {
  try {
    const password = "LyW3ShZ555R9bnMI";
    const url = `mongodb+srv://alexey:${password}@cluster0.mfycr.mongodb.net/db_shop?retryWrites=true&w=majority`;
    await mongoose.connect(url, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const candidat = await User.findOne();
    if (!candidat) {
      const user = await new User({
        email: "VoloshinAlexey@gmail.com",
        name: "Voloshin",
        basket: { items: [] },
      });
      await user.save();
    }
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
}

init();
