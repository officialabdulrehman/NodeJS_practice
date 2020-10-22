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


const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop')

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('page404', { docTitle: 'Page 404'})
})

app.listen(3000)
