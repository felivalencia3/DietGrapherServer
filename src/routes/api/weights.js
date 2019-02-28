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
router.get('/hello', auth.required, (req, res) => {
  res.send('Hello, World');
});

router.post('/newuser', auth.required, (req, res) => {
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
    return res.sendStatus(422).json({
      error: {
        weight: 'is required',
      },
    });
  }
  if (!entry.user) {
    return res.status(422).send('user is required');
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
      res.send(toBeUser);
    });
});
router.post('/new', auth.required, (req, res) => {
  const {
    body: {
      entry,
    },
  } = req;
  if (!entry.weight) {
    return res.sendStatus(422).json({
      error: {
        weight: 'is required',
      },
    });
  }
  if (!entry.user) {
    return res.status(422).send('user is required');
  }
  const toBeUser = {
    User: entry.user,
    Weight: entry.weight,
  };
  const Entry = new Weight(toBeUser);
  return Entry.save()
    .then((err) => {
      if (err) {
        console.error(err);
      }
      res.status(200).json({
        weight: entry.weight,
      });
    });
});
router.get('/data', auth.required, (req, res) => {
  const {
    body: {
      user,
    },
  } = req;
  if (!user) {
    req.send({ error: 'No User' });
  }
  Weight.findOne({
    User: user,
  }, {}, {
    sort: {
      created_at: 1,
    },
  }, (err, data) => {
    res.send(data);
  });
});
router.get('/', auth.required, (req, res) => {
  const {
    body: {
      user,
    },
  } = req;
  if (!user) {
    res.send({
      error: 'no user',
    });
  }
  Weight.find({
    User: user,
  }, (err, entry) => {
    res.send(entry);
  });
});
module.exports = router;
