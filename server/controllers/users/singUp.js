const { sign } = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { postUsers, getUserByEmail } = require('../../models/queries/');
const { signUpSchema } = require('../../validation/userSchema');

module.exports = async (req, res, next) => {
  const key = process.env.KEY;

  try {
    const userInfo = await signUpSchema.validate(req.body, {
      abortEarly: false,
    });
    const { email, password: userPassword, username } = userInfo;
    const userExist = await getUserByEmail(email);
    if (userExist) {
      res.send({
        statusCode: 409,
        message: 'Email already exists',
      });
    } else {
      const salt = await bcrypt.genSalt(12);
      const hashPassword = await bcrypt.hash(userPassword, salt);
      const [{ id }] = await postUsers({ email, hashPassword, username });
      const token = sign({ userId: id }, key);
      res.cookie('token', token, { maxAge: 8400000, httpOnly: true });
      res.status(201).send({
        statusCode: 201,
        message: 'user was sign up successfully',
        data: { username, email },
      });
    }
  } catch (error) {
    if (error.name === 'ValidationError')
      res.status(400).send({ statusCode: 400, error: error.errors });
    else next(error);
  }
};
