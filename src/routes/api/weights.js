/* eslint-disable radix */
/* eslint-disable no-plusplus */
const mongoose = require('mongoose');
const router = require('express').Router();
const auth = require('../auth');

const inchesOver5Feet = (cm) => {
  let inch = cm * 0.39370;
  inch -= 60;
  return Math.round(inch);
};

const Weight = mongoose.model('Weights');
router.get('/hello', auth.optional, (req, res) => {
  res.send('Hello, World');
});

router.post('/newuser', auth.required, (req, res) => {
  let message = '';
  const {
    body: {
      entry,
    },
  } = req;
  entry.age = parseInt(entry.age, 10);
  entry.weight = parseInt(entry.weight, 10);
  entry.height = parseInt(entry.height, 10);
  if (entry.gender === 'O') {
    entry.gender = 'M';
  }
  if (!entry.weight) {
    message = 'Error: No Weight';
  }
  if (!entry.user) {
    message = 'Error: No User';
  }
  let BasalMetaRate = 0;
  if (entry.gender === 'M') {
    BasalMetaRate = (10 * entry.weight) + (6.25 * entry.height) - (5 * entry.age) + 5;
  }
  if (entry.gender === 'F') {
    BasalMetaRate = (10 * entry.weight) + (6.25 * entry.height) - (5 * entry.age) - 161;
  }
  let BestWeight = 0;
  if (entry.gender === 'M') {
    BestWeight = 52;
    for (let k = 0; k < inchesOver5Feet(parseInt(entry.height)); k++) {
      BestWeight += 1.9;
    }
  }
  if (entry.gender === 'F') {
    BestWeight = 49;
    for (let j = 0; j < inchesOver5Feet(parseInt(entry.height)); j++) {
      BestWeight += 1.7;
    }
  }
  const bodyMassIndex = entry.weight / ((entry.height / 100) ** 2);
  const toBeUser = {
    User: entry.user,
    Weight: entry.weight,
    Gender: entry.gender,
    Height: entry.height,
    Age: entry.age,
    BMI: Math.round(bodyMassIndex),
    BMR: Math.round(BasalMetaRate),
    IdealWeight: Math.round(BestWeight),
  };

  const FirstEntry = new Weight(toBeUser);

  return FirstEntry.save()
    .then(() => {
      let data = toBeUser;
      if (message) data = message;
      res.send(data);
    });
});
router.post('/new', auth.required, (req, res) => {
  let message = '';
  const {
    body: {
      entry,
    },
  } = req;
  if (!entry.weight) {
    message = 'Error: No Weight';
  }
  if (!entry.user) {
    message = 'Error: No User';
  }
  const toBeUser = {
    User: entry.user,
    Weight: entry.weight,
  };
  const Entry = new Weight(toBeUser);
  return Entry.save()
    .then((err) => {
      let data = { weight: entry.weight };
      if (err) {
        console.error(err);
      }
      if (message) data = message;
      res.send(data);
    });
});
router.get('/data', auth.required, (req, res) => {
  let message = '';
  const {
    query: {
      user,
    },
  } = req;
  if (!user) {
    message = 'Error: No User';
  }
  Weight.findOne({
    User: user,
  }, {}, {
    sort: {
      created_at: 1,
    },
  }, (err, data) => {
    let userData = data;
    if (message) userData = message;
    res.send(userData);
  });
});
router.get('/', auth.required, (req, res) => {
  let message = '';
  const {
    query: {
      user,
    },
  } = req;
  if (!user) {
    message = 'Error: No User';
  }
  const query = Weight.find({
    User: user,
  }).select('Date Weight');
  query.exec((err, entry) => {
    let data = entry;
    if (message) data = message;

    res.send(data);
  });
});
module.exports = router;
