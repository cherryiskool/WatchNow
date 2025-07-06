if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
};

const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const passport = require('passport');
const flash = require('express-flash')
const session = require('express-session')
const SQLiteStore = require('connect-sqlite3')(session)

// routes for respective routers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const videosRouter = require('./routes/videos');
const profileRouter = require('./routes/profile')

// will be used later to have PUT and UPDATE 
const methodOverride = require('method-override');

// allows for variables to be written into ejs pages
app.set('view engine', 'ejs');
// tells express to look in views folder | not strictly necessary
app.set('views', __dirname + '/views');
// set a layout page to not have to keep retyping code out
app.set('layout', 'layouts/layout');
// tells express to use layouts
app.use(expressLayouts);

app.use(methodOverride('_method'));
// tells express to use this directory for files
app.use(express.static('public'));
// allows for server to parse through http requests - req.body etc.
app.use(express.urlencoded({limit: '10mb', extended: false}));


app.use(flash())

// stores session details for logged in user
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: new SQLiteStore({db: 'sessions.db', dir: './models'})
}))


// initialise passport
app.use(passport.initialize());
// update user info - req.user
app.use(passport.session())

// this allows all ejs pages to access the username associated with the user passport created in auth.js
// in headers.ejs i use it to make dynamic navbar links (checks that youre signed in etc.)
app.use(function(req, res, next) {
  console.log('server app ', req.user)
  try {
    res.locals.username = req.user.username
    res.locals.userWallet = req.user.walletAddress
  } catch {
    console.log('user is not logged in')
  }
  next();
})

// what each routes url should begin with
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/videos', videosRouter);
app.use('/', profileRouter);

// allows for there to be a set port or for it to be set to 3000 by default
app.listen(process.env.PORT || 3000);