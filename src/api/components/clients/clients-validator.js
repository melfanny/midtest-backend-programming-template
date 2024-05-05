const { celebrate, Segments, Joi } = require('celebrate');

const createUserValidator = Joi.object({
  name: Joi.string().required().label('Name'),
  email: Joi.string().email().required().label('Email'),
  pin: Joi.string().required().label('Pin'),
  cardtype: Joi.string().required().label('Cardtype'),
  cardnumber: Joi.number().required().label('Cardnumber'),
});

module.exports = {
  createUser: celebrate({
    [Segments.BODY]: createUserValidator,
  }),
};
