const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
// const expressHbs = require('express-handlebars');

const app = express();

// app.set('view engine', 'pug');

// app.engine('hbs', expressHbs({
//   extname: "hbs",
//   defaultLayout: 'main-layout',
//   layoutsDir: "views/layouts/"
// }));
// app.set('view engine', 'hbs');

app.set('view engine', 'ejs');


const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorController = require('./controllers/error');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404)

app.listen(3000)
