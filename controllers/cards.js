const ForbiddenError = require('../errors/forbidden');
const NotFoundError = require('../errors/notfound');
const Card = require('../models/card');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      res.status(201).send(cards);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { _id } = req.user;
  const { name, link } = req.body;

  Card.create({ name, link, owner: _id })
    .then((newCard) => {
      res.status(201).send(newCard);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Информация по карточке не найдена.');
      }
      if (card.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет прав на удаление');
      }
      return res.send(card);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Информация по карточке не найдена.');
      }
      return res.send(card);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, { $pull: { likes: req.user._id } }, { new: true })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Информация по карточке не найдена.');
      }
      return res.send(card);
    })
    .catch(next);
};

module.exports = {
  dislikeCard,
  likeCard,
  deleteCard,
  createCard,
  getAllCards,
};
