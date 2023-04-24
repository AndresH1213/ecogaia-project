const fs = require('fs');
const path = require('path');
const { response } = require('express');
const Product = require('../models/Product');
const { createCustomError } = require('../errors/curstom-error');
const asyncWrapper = require('../middlewares/async');

const { updateImage, addImage } = require('../helpers/update-image');
const { processImage } = require('../helpers/process-image');

const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({ region: 'us-east-2' });

exports.getProducts = asyncWrapper(async (req, res = response, next) => {
  const [products, total] = await Promise.all([Product.find(), Product.countDocuments()]);
  if (products.length === 0) {
    return next(createCustomError('No products found in the db', 404));
  }
  res.json({
    ok: true,
    products,
    total,
  });
});

exports.getSingleProduct = asyncWrapper(async (req, res = response, next) => {
  const { id, code } = req.query;
  const queryObject = {};
  if (id) {
    queryObject._id = id;
  }
  if (code) {
    queryObject.code = code;
  }
  const product = await Product.findOne(queryObject);
  if (!product) {
    return next(createCustomError(`Product with id '${id}' not found`, 404));
  }
  res.status(200).json({
    ok: true,
    product,
  });
});

exports.presignedUrl = asyncWrapper(async (req, res = response, next) => {
  const name = req.query.name;
  const mime = req.query.mime;

  if (!name || !mime) {
    return next(createCustomError('Please insert name and mime type of the image', 400));
  }

  const imageName = processImage(name, mime);

  if (!imageName) {
    return next(createCustomError('Invalid image format', 400));
  }

  const command = new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: 'ecogaia/' + imageName,
    ContentType: mime,
    ACL: 'public-read',
  });

  const signedUrl = await getSignedUrl(s3, command, { expiresIn: 300 });

  res.status(200).json({
    ok: true,
    signedUrl,
  });
});

exports.createProduct = asyncWrapper(async (req, res = response) => {
  const { name, code, price, characteristics, imageUrl } = req.body;
  let characteristicsObject;
  if (characteristics) {
    characteristicsObject = JSON.parse(characteristics);
  }
  let images = imageUrl;
  if (!Array.isArray(images)) {
    images = [imageUrl];
  }

  const newProduct = new Product({
    name,
    code,
    imageUrl: images,
    price,
    characteristics: characteristicsObject,
  });
  await newProduct.save();

  res.json({
    ok: true,
    newProduct,
    user: req.user,
  });
});

exports.updateProduct = asyncWrapper(async (req, res = response) => {
  const productId = req.params.id;
  const { replace } = req.query;

  const productDB = await Product.findById(productId);

  if (!productDB) {
    return next(createCustomError('There is any product with that id', 404));
  }
  //Images array manipulation, when no url is sent delete the last image, then the
  // url is already in the array do nothing, and if is different add it
  const imagesDB = productDB.imageUrl;
  if (!req.body.imageUrl) {
    imagesDB.pop();
    req.body.imageUrl = imagesDB;
  } else if (replace && imagesDB.length > 0) {
    imagesDB[0] = req.body.imageUrl;
    req.body.imageUrl = imagesDB;
  } else {
    imagesDB.push(req.body.imageUrl);
    req.body.imageUrl = imagesDB;
  }

  // Parse the characteristic object
  if (req.body.characteristics) {
    req.body.characteristics = JSON.parse(req.body.characteristics);
  }

  //update the product

  const productUpdated = await Product.findByIdAndUpdate({ _id: productId }, req.body, {
    new: true,
  });

  res.json({
    ok: true,
    product: productUpdated,
    msg: 'The product was updated with success',
  });
});

exports.deleteProduct = asyncWrapper(async (req, res = response) => {
  const productId = req.params.id;

  const product = await Product.findById(productId);
  if (!product) {
    return next(createCustomError('There is any product with that id', 404));
  }

  await Product.findByIdAndDelete(productId);
  res.json({
    ok: true,
    msg: 'Product Deleted',
  });
});
