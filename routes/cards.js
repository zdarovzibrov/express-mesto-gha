const cardsRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  dislikeCard,
  likeCard,
  deleteCard,
  createCard,
  getAllCards,
} = require('../controllers/cards');
const { REGEXP } = require('../utils/constants');

cardsRouter.get('/', getAllCards);

cardsRouter.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      link: Joi.string().required().regex(REGEXP),
    }),
  }),
  createCard
);

cardsRouter.delete(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  dislikeCard
);

cardsRouter.put(
  '/:cardId/likes',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  likeCard
);

cardsRouter.delete(
  '/:cardId',
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().length(24).hex().required(),
    }),
  }),
  deleteCard
);

module.exports = cardsRouter;
