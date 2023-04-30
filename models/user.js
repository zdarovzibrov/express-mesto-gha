const mongoose = require('mongoose');
const isEmail = require('validator/lib/isEmail');
const { REGEXP } = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Жак-Ив Кусто'
  },

  about: {
    type: String,
    minLength: 2,
    maxLength: 30,
    default: 'Исследователь'
  },

  avatar: {
    type: String,
    validate: {
      validator: (v) => REGEXP.test(v),
      message: 'Не правильная ссылка',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: (v) => isEmail(v),
      message: 'Не правильный email.',
    },
  },
});

module.exports = mongoose.model('user', userSchema);
