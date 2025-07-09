if (process.env.NODE_ENV != "productions") {
  require("dotenv").config();
} //to not access credentials while production(deployed)

const express = require("express");
const mongoose = require("mongoose");
const app = express();

const DBurl = process.env.ATLASDB_URL;

const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const userRouter = require("./routes/user.js");
//calling main function
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));
//creating a database
async function main() {
  await mongoose.connect(DBurl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true })); //for parsing
app.use(methodOverride("_method"));
app.engine("ejs", engine);
app.use(express.static(path.join(__dirname, "/public")));

const store = MongoStore.create({
  mongoUrl: DBurl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", () => {
  console.log("ERROR in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store: store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000, //expires in one week
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, //for security purposes - prevents from cross scripting attacks
  },
};

app.get("/", (req, res) => {
  res.redirect("/listings");
});

app.use(session(sessionOptions));
app.use(flash()); //to be written before using routes

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "abc-student",
//   });
//   let regUser = User.register(fakeUser, "helloworld"); //static method - pass user, password, callback if needed
//   res.send(regUser);
// });

//listings
//restructured using express router
app.use("/listings", listingRouter);

//reviews
//restructured using express router
app.use("/listings/:id/reviews", reviewRouter);

app.use("/", userRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
}); //for all
//Custom error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something Went Wrong!" } = err;
  res.status(statusCode).render("error.ejs", { message });
  // res.status(statusCode).send(message);
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});

const cloudinary = require("cloudinary").v2;

cloudinary.api.ping((error, result) => {
  if (error) {
    console.error("Cloudinary connection failed:", error);
  } else {
    console.log("✅ Cloudinary is connected:", result);
  }
});
