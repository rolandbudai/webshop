// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
app.use(cors());
app.use(express.json());

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  description: { type: DataTypes.TEXT },
});

app.get('/', (req, res) => res.send('Webshop backend működik!'));

// REST API endpoint termékekhez
app.get('/products', async (req, res) => {
  const products = await Product.findAll();
  res.json(products);
});

app.post('/products', async (req, res) => {
  const { name, price, description } = req.body;
  const product = await Product.create({ name, price, description });
  res.status(201).json(product);
});

app.delete('/products/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const deleted = await Product.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Termék törölve' });
    } else {
      res.status(404).json({ error: 'Nem található termék az adott azonosítóval' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Hiba történt a törlés során' });
  }
});


const port = process.env.PORT || 4000;

sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Backend fut a ${port}-on`));
});
