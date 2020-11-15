const fileHelper = require('../util/file')
 
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
  const image = req.file
  data.userId = req.user._id
  const errors = validationResult(req)
  console.log("image")
  if(!image){
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      hasError: true,
      editing: false,
      product: {...data},
      errorMessage: 'Attached file is not an image',
      validationErrors: []
    });
  }
  if(!errors.isEmpty()){
    return res.status(422).render("admin/edit-product", {
      docTitle: "Add Product",
      path: "/admin/add-product",
      hasError: true,
      editing: false,
      product: {...data},
      errorMessage: errors.array()[0].msg,
      validationErrors: errors.array()
    });
  }
  const imageUrl = image.path
  data.imageUrl = imageUrl
  const product = new Product({...data})
  product.save()
    .then(result => {
      console.log(result)
      res.redirect('/admin/products')
    })
    .catch(err => {
      //console.log(err)
      // return res.status(500).render("admin/edit-product", {
      //   docTitle: "Add Product",
      //   path: "/admin/add-product",
      //   hasError: true,
      //   editing: false,
      //   product: {...data},
      //   errorMessage: 'Database operation failed, try again',
      //   validationErrors: []
      // });
      //res.redirect('/500')
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
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
    .catch(() => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
};

exports.postEditProducts = (req, res, next) => {
  const prodId = req.body.productId;
  const {title, price, description} = req.body
  const prodData = {...req.body}
  const image = req.file
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
      if(image){
        fileHelper.deleteFile(product.imageUrl)
        product.imageUrl = image.path
      }
      product.description = description
      return product.save()
      .then(result => {
        console.log('Updated Product')
        res.redirect('/admin/products')
      })
    })
    .catch(err => {
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
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
  .catch(err => {
    const error = new Error(err)
    error.httpStatusCode = 500
    return next(error)
  })
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      if(!product){
        return next(new Error('Product not fount'))
      }
      fileHelper.deleteFile(product.imageUrl)
      return Product.deleteOne({_id: prodId, userId: req.user._id})
    })
    .then(result => {
      console.log('Deleted')
      res.redirect('/admin/products')
    })
    .catch((err) => {
      console.log(err)
      const error = new Error(err)
      error.httpStatusCode = 500
      return next(error)
    })
}