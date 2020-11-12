const { validationResult } = require('express-validator/check');
const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    hasError: false,
    errorMessage: null,
    validationErrors: []
  });
};

exports.postAddProduct = (req, res, next) => {
  const data = { ...req.body}
  data.userId = req.user._id
  const errors = validationResult(req)
  if(!errors.isEmpty()){
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add Product",
      path: "/admin/edit-product",
      hasError: true,
      editing: false,
      product: {...data},
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  const product = new Product({...data})
  product.save()
    .then(result => {
      console.log(result)
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode) return res.redirect('/')
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then(product => {
      if(!product) return res.redirect('/')
      res.render("admin/edit-product", {
        docTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        hasError: false,
        errorMessage: null,
        validationErrors: []
      });
    })
};

exports.postEditProducts = (req, res, next) => {
  const prodId = req.body.productId;
  const {title, price, imageUrl, description} = req.body
  const prodData = {...req.body}
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).render('admin/edit-product', {
      docTitle: 'Edit Product',
      path: '/admin/edit-product',
      editing: true,
      hasError: true,
      product: {...prodData},
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  Product.findById(prodId)
    .then(product => {
      if(product.userId.toString() !== req.user._id.toString()){
        return redirect('/')
      }
      product.title = title
      product.price = price
      product.imageUrl = imageUrl
      product.description = description
      return product.save()
      .then(result => {
        console.log('Updated Product')
        res.redirect('/admin/products')
      })
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
    .then(products => {
      res.render("admin/products", {
        prods: products,
        docTitle: "Admin Products",
        path: "/admin/products",
  
      });
    })
  .catch(err => console.log(err))
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({_id: prodId, userId: req.user._id})
    .then(result => {
      console.log('Deleted')
      res.redirect('/admin/products')
    })
}