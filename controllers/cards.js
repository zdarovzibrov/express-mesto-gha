const ForbiddenError = require('../errors/forbidden');
const NotFoundError = require('../errors/notfound');
const BadRequestError = require('../errors/badrequest');
const Card = require('../models/card');

const getAllCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Карточки не найдены.');
      }
      return res.send(cards);
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
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании карточки.'));
      } else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  Card.findById(cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка не найдена');
      }

      if (!card.owner.equals(userId)) {
        throw new ForbiddenError('У вас нет прав на удаление этой карточки');
      }

      return Card.deleteOne({ _id: cardId });
    })
    .then(() => {
      res.status(200).send({ message: 'Карточка удалена' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный идентификатор карточки'));
      } else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Информация по карточке не найдена.');
      }
      return res.send(card);
    })
    .catch(next);
};

const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
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
