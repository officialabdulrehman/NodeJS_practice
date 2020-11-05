const { set } = require("mongoose");

exports.getLogin = (req, res, next) => {
  const isLoggedIn = req.get('Cookie')
    .split(';')[1]
    .trim()
    .split('=')[1] === 'true';
  console.log(isLoggedIn)
  res.render("auth/login", {
    path: "/login",
    docTitle: "Login",
    isAuthenticated: isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  res.setHeader('Set-Cookie', 'loggedIn=true')
  res.redirect("/");
};
