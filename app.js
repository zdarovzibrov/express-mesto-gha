const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { celebrate, Joi, errors } = require('celebrate');
const router = require('./routes');
const defaultError = require('./errors/default');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');
const { REGEXP } = require('./utils/constants');

const app = express();

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  '/signup',
  celebrate({
    body: Joi.object()
      .keys({
        name: Joi.string().min(2).max(30),
        about: Joi.string().min(2).max(30),
        avatar: Joi.string().regex(REGEXP),
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      })
      .unknown(true),
  }),
  createUser
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object()
      .keys({
        email: Joi.string().required().email(),
        password: Joi.string().required(),
      })
      .unknown(true),
  }),
  login
);

app.use(auth);
app.use(router);

app.use(errors());

app.use((req, res) => {
  res.status(404).send({
    message: 'Такого адреса не существует',
  });
});

app.use(defaultError);

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.listen(3000, () => {
  console.log('This server is start on 3000');
});
