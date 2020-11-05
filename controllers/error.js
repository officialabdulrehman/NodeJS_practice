exports.get404 = (req, res, next) => {
  res.status(404).render('page404', { docTitle: 'Page 404', path: '404', isAuthenticated: req.isLoggedIn})
}