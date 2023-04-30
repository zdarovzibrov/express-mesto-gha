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
const NotFoundError = require('./errors/notfound');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().regex(REGEXP),
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  createUser
);

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login
);

app.use(auth);
app.use(router);

app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

app.use(defaultError);

app.listen(3000, () => {
  console.log('This server is start on 3000');
});
