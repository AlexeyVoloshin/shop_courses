const express = require("express");
const path = require("path");
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
const varMiddleware = require("./middleware/variables");
const userMiddleware = require("./middleware/user");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
// const User = require("./models/user");
const password = "LyW3ShZ555R9bnMI";
const MONGODB_URI = `mongodb+srv://alexey:${password}@cluster0.mfycr.mongodb.net/db_shop?retryWrites=true&w=majority`;

const app = express();

const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(Handlebars),
  defaultLayout: "main", //file enter to layouts
  extname: "hbs",
});


const store = new MongoStore({
  collection: 'sessions',
  uri: MONGODB_URI
});

app.engine("hbs", hbs.engine); //register the engine
app.set("view engine", "hbs"); //use the engine
app.set("views", "pages"); //folder where views are stored


app.use(express.static(path.join(__dirname, "public"))); //register a folder for styles
app.use(express.urlencoded({ extended: true })); //instead of Buffer.from ()
//connect sessions
app.use(
  session({
    secret: "some secret value",
    resave: false,
    saveUninitialized: false,
    store: store
  })
);
app.use(varMiddleware);
app.use(userMiddleware);

app.use("/", homeRout);
app.use("/add", addRout);
app.use("/courses", coursesRout);
app.use("/basket", basketRout);
app.use("/orders", ordersRout);
app.use("/auth", authRout);

const PORT = process.env.PORT || 3000;

async function init() {
  try {

    await mongoose.connect(MONGODB_URI, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (e) {
    console.error(e);
  }
}

init();
