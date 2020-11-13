exports.get404 = (req, res, next) => {
  res.status(404).render('page404', { docTitle: 'Page 404', path: '/404', isAuthenticated: req.session.isLoggedIn })
}

exports.get500 = (req, res, next) => {
  res.status(500).render('page500', { docTitle: 'Error!', path: '/500', isAuthenticated: req.session.isLoggedIn})
}