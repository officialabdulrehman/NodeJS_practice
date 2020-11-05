const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

const errorController = require('./controllers/error');
const User = require('./models/user');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5fa273e4704fb7104820fded')
    .then(user => {
      req.user = user;
      next()
    })
    .catch(err => console.log(err))
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose.connect('mongodb+srv://nizthedev:nizthedev@node.hixau.mongodb.net/node?retryWrites=true&w=majority')
  .then(result => {
    User.findOne()
      .then(user => {
        if(!user){
          const user = new User({
            name: 'Max',
            email: 'test@test.com',
            cart: {
              items: []
            }
          })
          user.save();
        }
      })
    console.log('connected')
    app.listen(3000)
  })
  .catch(err => console.log(err))
  