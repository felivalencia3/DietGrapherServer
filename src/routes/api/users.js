const mongoose = require('mongoose');
const passport = require('passport');
const router = require('express').Router();
const auth = require('../auth');

const Users = mongoose.model('Users');

// POST new user route (optional, everyone has access)
router.post('/', auth.optional, (req, res) => {
  const {
    body: {
      user,
    },
  } = req;

  if (!user.email) {
    return res.status(422).send('Email is Required');
  }

  if (!user.password) {
    return res.status(422).send('Password is Required');
  }

  const finalUser = new Users(user);

  finalUser.setPassword(user.password);

  return finalUser.save()
    .then(() => res.send({
      user: finalUser.toAuthJSON(),
    }));
});

// POST login route (optional, everyone has access)
router.post('/login', auth.optional, (req, res, next) => {
  const {
    body: {
      user,
    },
  } = req;

  if (!user.email) {
    return res.status(422).send('Email is Required');
  }

  if (!user.password) {
    return res.status(422).send('Password is Required');
  }

  return passport.authenticate('local', {
    session: false,
  }, (err, passportUser) => {
    if (err) {
      return next(err);
    }

    if (passportUser) {
      const nextuser = passportUser;
      nextuser.token = passportUser.generateJWT();

      return res.send({
        user: nextuser.toAuthJSON(),
      });
    }

    return res.sendStatus(400);
  })(req, res, next);
});

// GET current route (required, only authenticated users have access)
router.get('/current', auth.required, (req, res) => {
  const {
    payload: {
      id,
    },
  } = req;

  return Users.findById(id)
    .then((user) => {
      if (!user) {
        return res.sendStatus(400);
      }

      return res.send({
        user: user.toAuthJSON(),
      });
    });
});
router.get('/redirect', auth.required, (req, res) => {
  res.send(true);
});
module.exports = router;
