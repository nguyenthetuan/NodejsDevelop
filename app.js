// const express = require('express');
// const app = express();
// const server = require('http').createServer(app);
// const mongoose = require('mongoose');
const bodyParser = require('body-parser');
// const path = require('path');
// // my vars
// const port = process.env.PORT || 3000;
// const { MONGO_URL } = require('./config/');
// require('./libs/db-connection');
// // configuration

// app.use(
//   session({
//     store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
//     ...options
//   })
// );
// // passport middleware
// app.use(passport.initialize());
// app.use(passport.session());
// // global var
// app.use((req, res, next) => {
//   res.locals.user = req.user || null;
//   res.locals.errors = [];
//   next();
// })
// // static files
// app.use(express.static(path.join(__dirname, '/public')));
// // engine
// app.set('view engine', 'ejs');
// // passport config
// require('./config/passport')(passport);
// // routes
// app.use(require('./routes/')); // main routes
// app.use('/auth', require('./routes/user')); // user routes
// // run server
// server.listen(port, () => console.info(`App running on port ${port}`));
const session = require('express-session');
// const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const express = require('express');
require('dotenv').config()
const app = express();
const server = require('http').createServer(app);
const port = process.env.PORT || 3001;
var cookieParser = require('cookie-parser');
// const { MONGO_URL } = require('./config/');
// require('./libs/db-connection');
const mongoose = require('mongoose');

// Connection URI for your MongoDB database
const uri = 'mongodb://localhost:27017/admin';

// Connect to the MongoDB server
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// Get the default connection
const db = mongoose.connection;
// Event listener for the connection open event
db.once('open', () => {
  console.log('Connected to MongoDB');
  // Perform database operations here
});
// Event listener for the connection error event
db.on('error', (err) => {
  console.error('Error connecting to MongoDB:', err);
});
// Close the connection when the Node.js application is terminated
process.on('SIGINT', () => {
  db.close(() => {
    console.log('MongoDB connection closed.');
    process.exit(0);
  });
});

app.use(cookieParser('223445'))
// passport middleware
app.use(passport.initialize());
app.use(
  session({
    store: MongoStore.create({ mongoUrl: uri }),
  })
);
require('./config/passport')(passport);
// global var
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  res.locals.errors = [];
  next();
})
app.set('view engine', 'ejs');
app.use(require('./routes/')); // main routes
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/auth', require('./routes/user')); //
const initAPIs = require("./routes/api");
// Cho phép các api của ứng dụng xử lý dữ liệu từ body của request
// Khởi tạo các routes cho ứng dụng
initAPIs(app);
app.use(express.json());
server.listen(port, () => console.info(`App running on port ${port}`));

