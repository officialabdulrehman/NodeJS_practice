const Product = require("../models/product");

exports.getProducts = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("shop/product-list", {
        prods: products,
        docTitle: "Products",
        path: "/products",
      });
    })
    .catch(err => console.log(err))
};

exports.getProduct = (req, res, next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      res.render("shop/product-detail", {
        docTitle: product.title,
        product: product,
        path: "/products",
      });
    })
    .catch(err => console.log(err))
};

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(products => {
      res.render("shop/index", {
        prods: products,
        docTitle: "Shop",
        path: "/",
      });
    })
    .catch(err => console.log(err))
};

exports.getCart = (req, res, next) => {
  req.user.getCart()
    .then(products => {
      res.render("shop/cart", {
        path: "/cart",
        docTitle: "Cart",
        products: products,
      });
    })
    .catch(err => console.log(err))
};

exports.postCart = (req, res, next) => {
  const prodId = req.body.productId;
  Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product)
    })
    .then(result => {
      res.redirect('/cart')
    })
};

exports.postCartDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  req.user.deleteItemFromCart(prodId)
    .then(result => {
      console.log(result)
      res.redirect('/cart')
    })
    .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
  req.user.getOrders({include: ['products']})
    .then(orders => {
      res.render("shop/orders", {
        path: "/orders",
        docTitle: "Your Orders",
        orders: orders
      });
    })
    .catch(err => console.log(err))
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
    .then(cart => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then(products => {
      req.user.createOrder()
        .then(order => {
          return order.addProducts(products.map(product => {
            product.orderItem = { quantity: product.cartItem.quantity};
            return product
          }))
        })
        .catch(err => console.log(err))
    })
    .then(result => {
      return fetchedCart.setProducts(null)
    })
    .then(result => {
      res.redirect('/orders')
    })
    .catch(err => console.log(err))
}

// exports.getCheckout = (req, res, next) => {
//   res.render("shop/checkout", {
//     path: "/checkout",
//     docTitle: "Checkout",
//   });
// };
