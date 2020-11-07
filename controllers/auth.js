const User = require('../models/user');

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    isAuthenticated: false
  });
};

exports.postLogin = (req, res, next) => {
  User.findById('5fa273e4704fb7104820fded')
    .then(user => {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(() => {
        res.redirect('/');
      });
    })
    .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err)
    res.redirect("/");
  })
};
