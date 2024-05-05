const { celebrate, Segments, Joi } = require('celebrate');
const { createClient } = require('./clients-repository');

const createClientValidator = Joi.object({
  name: Joi.string().required().label('Name'),
  email: Joi.string().email().required().label('Email'),
  pin: Joi.string().required().label('Pin'),
  cardtype: Joi.string().required().label('Cardtype'),
  cardnumber: Joi.number().required().label('Cardnumber'),
});

const updateClientValidator = Joi.object({
  name: Joi.string().required().label('Name'),
  email: Joi.string().email().required().label('Email'),
});

module.exports = {
  createClient: celebrate({
    [Segments.BODY]: createClientValidator,
  }),
  updateClient: celebrate({
    [Segments.BODY]: updateClientValidator,
  }),
};
