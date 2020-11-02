const mongodb = require('mongodb');
const Product = require('../models/product');

const ObjectId = mongodb.ObjectId;

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const data = { ...req.body}
  const product = new Product({...data})
  product.save()
    .then(result => res.redirect('/admin/products'))
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
        product: product
      });
    })
};

exports.postEditProducts = (req, res, next) => {
  const prodId = req.body.productId;
  const prodData = {...req.body}
  prodData._id = new ObjectId(prodId)
  const product = new Product({...prodData})
  product.save()  
    .then(result => {
      console.log('Updated Product')
      res.redirect('/admin/products')
    })
    .catch(err => console.log(err))
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
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
  Product.deleteById(prodId)
    .then(result => {
      console.log('Deleted')
      res.redirect('/admin/products')
    })
}