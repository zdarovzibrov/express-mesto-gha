const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getAllUsers,
  getUserById,
  updateAvatar,
  editProfile,
  getCurrentUser,
} = require('../controllers/users');
const { REGEXP } = require('../utils/constants');

usersRouter.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().pattern(REGEXP),
  }).unknown(true),
}), updateAvatar);

usersRouter.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}), editProfile);

usersRouter.get('/me', getCurrentUser);

usersRouter.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().alphanum().length(24),
  }).unknown(true),
}), getUserById);

usersRouter.get('/', getAllUsers);

module.exports = usersRouter;
