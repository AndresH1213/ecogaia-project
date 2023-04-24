const Product = require('../models/Product');
const Combo = require('../models/Combo');

exports.addImage = async (prodId, filename) => {
  const product = await Product.findById(prodId);
  if (!product) {
    console.log('Product not found');
    return false;
  }

  product.imageUrl.push(filename);
  await product.save();

  return true;
};
