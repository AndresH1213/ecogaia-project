require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const islocal = require('./helpers/islocal');

const connectDB = require('./db/connect');
const notFound = require('./middlewares/not-found');
const errorHandlerMiddleware = require('./middlewares/error-handler');

const helmet = require('helmet');
const compression = require('compression');
// routes import
const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/products.routes');
const combosRoutes = require('./routes/combos.routes');
const shopRoutes = require('./routes/shop.routes');

const app = express();
// CORS Config
app.use(cors());

// middlewares
app.use(express.json());

// helmet secure headers
app.use(helmet());
app.use(compression());

// headers for cors policy
const originAllowed = islocal() ? '*' : 'https://ecogaiashop.site';
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', originAllowed);
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', '*');
  next();
});

// Public dir
app.use(express.static('public'));

// routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/combos', combosRoutes);
app.use('/api/shop', shopRoutes);

// path for health checks
app.use('/', (req, res) => {
  res.status(200);
  res.send('ok');
});
// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, 'public/index.html'));
// });

app.use(notFound);
app.use(errorHandlerMiddleware);

let port = process.env.PORT || 3000;
if (islocal()) {
  port = 3000;
}

const start = async () => {
  try {
    // connect to DB
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server listening in port ${port}...`));
  } catch (err) {
    console.log(err, 'Ocurrio un error por favor comuniquese con el administrador');
  }
};

start();
