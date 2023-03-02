const Combo = require('../models/Combo');
const asyncWrapper = require('../middlewares/async');

exports.singleCombo = asyncWrapper(async (req, res = response) => {
  let { title, comboId, pageUrl } = req.query;
  const queryObject = {};
  if (title) {
    title = title.replace('+', ' ');
    queryObject.title = title;
  } else if (pageUrl) {
    queryObject.pageUrl = pageUrl;
  }
  if (comboId) {
    queryObject._id = comboId;
  }

  const combo = await Combo.findOne(queryObject).populate('products', 'name');
  if (!combo) {
    return res.status(404).json({
      ok: false,
      msg: 'No combo found with that title',
    });
  }
  res.json({
    ok: true,
    combo,
  });
});

exports.getCombos = async (req, res = response) => {
  const combos = await Combo.find({ availability: true });

  if (combos.length < 1) {
    return res.status(404).json({
      ok: false,
      msg: 'Any available combos found',
    });
  }
  res.json({
    ok: true,
    combos,
  });
};

exports.setCombos = async (req, res = response, next) => {
  const { title, price, image } = req.body;
  let products = req.body.products;
  if (!image) {
    return res.status(400).json({
      ok: false,
      msg: 'Image missing',
    });
  }
  if (!Array.isArray(products)) {
    products = products.split(',');
  }
  const pageUrl = title.toLowerCase().replace(/ /g, '-');

  const combo = await Combo.create({
    title,
    products,
    price,
    pageUrl,
    image,
  });

  res.json({
    ok: true,
    combo,
  });
};

exports.removeCombo = (req, res = response) => {
  const comboId = req.params.id;
  Combo.findOneAndUpdate({ _id: comboId }, { availability: false })
    .then((result) => {
      return res.json({
        ok: true,
        msg: `Combo ${comboId} removed`,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        ok: false,
        msg: 'Error removing combo',
      });
    });
};
