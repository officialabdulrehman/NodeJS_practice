const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
  // res.render('shop', {prods: products, docTitle:'Shop', path: '/'}); //pug
  Product.fetchAll((products) => {
    res.render("shop/product-list", {
      prods: products,
      docTitle: "Products",
      path: "/products",
    });
  })
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
    res.render('shop/product-detail', {docTitle: product.title, product: product, path: '/products'});
  })
}

exports.getIndex = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("shop/index", {
      prods: products,
      docTitle: "Shop",
      path: "/",
    });
  })
};

exports.getCart = (req, res, next) => {
  res.render('shop/cart', {
    path: '/cart',
    docTitle: 'Cart'
  })
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  res.redirect('/cart')
}

exports.getOrders = (req, res, next) => {
  res.render('shop/orders', {
    path: '/orders',
    docTitle: 'Your Orders'
  })
};

exports.getCheckout = (req, res, next) => {
  res.render('shop/checkout', {
    path: '/checkout',
    docTitle: 'Checkout'
  })
};