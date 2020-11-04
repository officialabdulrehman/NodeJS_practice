const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');
const User = require('./models/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// app.use((req, res, next) => {
//   User.findById('5f9fb681d40f7eb3c6c7be5a')
//     .then(user => {
//       req.user = new User(user.name, user.email, user.cart, user._id);
//       next()
//     })
//     .catch(err => console.log(err))
// })

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://nizthedev:nizthedev@node.hixau.mongodb.net/node?retryWrites=true&w=majority')
  .then(result => {
    console.log('connected')
    app.listen(3000)
  })
  .catch(err => console.log(err))