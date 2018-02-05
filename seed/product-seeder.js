let Product = require('../models/product');
let mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/shoppcart', err => {
  if ( err ) throw err;
  console.log("connection to db")
});

let products = [
  new Product({
    title: "Game of thrones",
    description: "is better series at those last years.",
    price: 15.5,
    image_path: "//127.0.0.1:3000/images/nicoise.png"
  }),
  new Product({
    title: "last kingdom",
    description: "Angland storie.",
    price: 10.5,
    image_path: "//127.0.0.1:3000/images/nicoise.png"
  }),
  new Product({
    title: "suits",
    description: "Story about a laughers and several cases",
    price: 8.9,
    image_path: "//127.0.0.1:3000/images/nicoise.png"
  })
];

let done = 0;
products.forEach(product => {
  product.save((err, result)=>{
    done++;
    if ( products.length == done) mongoose.disconnect();
  });
});
