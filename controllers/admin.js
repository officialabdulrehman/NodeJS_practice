const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render("admin/add-product", {
    docTitle: "Add Product",
    path: "/admin/add-product",
  });
};

exports.postAddProduct = (req, res, next) => {
  const data = { ...req.body}
  data.id = null;
  const product = new Product({...data});
  product.save()
    .then(() => {
      res.redirect('/');
    })
    .catch(err => console.log(err))
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if(!editMode) return res.redirect('/')
  const prodId = req.params.productId;
  Product.findById(prodId, product => {
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
  const productData = {...req.body}
  productData.id = prodId
  const updatedProduct = new Product({...productData})
  updatedProduct.save();
  res.redirect('/admin/products')
}

exports.getProducts = (req, res, next) => {
  Product.fetchAll((products) => {
    res.render("admin/products", {
      prods: products,
      docTitle: "Admin Products",
      path: "/admin/products",
    });
  })
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteById(prodId);
  res.redirect('/admin/products')
}