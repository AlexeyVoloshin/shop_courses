const express = require("express");
const path = require("path");
const conf = require("./conf");
const csrf = require("csurf");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const Handlebars = require("handlebars");
const exphbs = require("express-handlebars");
const session = require("express-session");
const MongoStore = require("connect-mongodb-session")(session);
const homeRout = require("./routes/home");
const coursesRout = require("./routes/courses");
const addRout = require("./routes/add");
const basketRout = require("./routes/basket");
const ordersRout = require("./routes/orders");
const authRout = require("./routes/auth");
const profileRout = require("./routes/profile");
const fileMiddleware = require("./middleware/file");
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");
const errorHandler = require("./middleware/error");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const app = express();

const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: "main", //file enter to layouts
  extname: "hbs",
  helpers: require('./utils/hbs-lelpers')
});


const store = new MongoStore({
  collection: 'sessions',
  uri: conf.MONGODB_URI
});

app.engine("hbs", hbs.engine); //register the engine
app.set("view engine", "hbs"); //use the engine
app.set("views", "pages"); //folder where views are stored


app.use(express.static(path.join(__dirname, "public"))); //register a folder for styles
app.use('/uploads', express.static(path.join(__dirname, "uploads")));
app.use(express.urlencoded({ extended: true })); //instead of Buffer.from ()
//connect sessions
app.use(
  session({
    secret: conf.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(fileMiddleware.single('avatar')); //before all other middleware
app.use(csrf());
app.use(flash());
app.use(varMiddleware);
app.use(userMiddleware);

app.use("/", homeRout);
app.use("/add", addRout);
app.use("/courses", coursesRout);
app.use("/basket", basketRout);
app.use("/orders", ordersRout);
app.use("/auth", authRout);
app.use("/profile", profileRout);

app.use(errorHandler);

const PORT = process.env.PORT || conf.SERV_PORT;

async function init() {
  try {

    await mongoose.connect(conf.MONGODB_URI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => {
      console.log(`Server is running on host ${conf.BASE_URL}`);
    });
  } catch (e) {
    console.error(e);
  }
}

init();
