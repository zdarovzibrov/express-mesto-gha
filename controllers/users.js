const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const UnauthorizedError = require('../errors/unauthorized');
const NotFoundError = require('../errors/notfound');
const ConflictError = require('../errors/conflict');

const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены.');
      }
      return res.send(users);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password
  } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name, about, avatar, email, password: hash
    })
      .then((newUser) => res.status(201).send({
        name: newUser.name,
        about: newUser.about,
        avatar: newUser.avatar,
        email: newUser.email
      }))
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже существует.'));
        }
      });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Пользователь не найден.');
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            next(new UnauthorizedError('Не правильно указан логин или пароль.'));
          }
          const token = jwt.sign({ _id: user._id }, 'super-secret-key', { expiresIn: '7d' });
          return res.send({ token });
        });
    })
    .catch(next);
};

const getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Информация о пользователе не найдена.');
      }
      return res.send(user);
    })
    .catch(next);
};

const editProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Информация о пользователе не найдена.');
      }
      return res.send(user);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const { _id } = req.user;
  const { avatar } = req.body;

  User.findByIdAndUpdate(_id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Информация о пользователе не найдена.');
      }
      return res.send(user);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь не найден.');
      }
      return res.send(user);
    })
    .catch(next);
};

module.exports = {
  getAllUsers,
  getUserById,
  updateAvatar,
  editProfile,
  createUser,
  login,
  getCurrentUser
};
