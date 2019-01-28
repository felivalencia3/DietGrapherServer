/* eslint-disable no-plusplus */
const mongoose = require('mongoose');

const {
  Schema,
} = mongoose;
const WeightSchema = new Schema({
  User: String,
  Weight: Number,
  Date: {
    type: Date,
    default: Date.now,
  },
  Gender: {
    type: String,
    default: 0,
  },
  Height: {
    type: Number,
    default: 0,
  },
  Age: {
    type: Number,
    default: 0,
  },
  BMI: {
    type: Number,
    default: 0,
  },
  BMR: {
    type: Number,
    default: 0,
  },
  IdealWeight: {
    type: Number,
    default: 0,
  },
});
WeightSchema.methods.getBMI = () => {
  const BMI = this.Weight / ((this.Height / 100) ** 2);
  this.BMI = BMI;
};
WeightSchema.methods.getBMR = () => {
  let BMR;
  if (this.Gender === 'M') {
    BMR = (10 * this.Weight) + (6.25 * this.Height) - (5 * this.Age) + 5;
  }
  if (this.Gender === 'F') {
    BMR = (10 * this.Weight) + (6.25 * this.Height) - (5 * this.Age) - 161;
  }
  this.BMR = BMR;
};
WeightSchema.methods.getIdealWeight = () => {
  let IdealWeight;
  if (this.Gender === 'M') {
    IdealWeight = 52;
    for (let index = 0; index < this.Height - 5; index++) {
      IdealWeight += 1.9;
    }
  }
  if (this.Gender === 'F') {
    IdealWeight = 49;
    for (let index = 0; index < this.Height - 5; index++) {
      IdealWeight += 1.7;
    }
  }
  this.IdealWeight = IdealWeight;
};
WeightSchema.methods.toUserJSON = () => {
  const UserJSON = {
    user: this.User,
    weight: this.Weight,
    gender: this.Gender,
    height: this.Height,
    age: this.Age,
    Date: this.Date,
    BMI: this.BMI,
    BMR: this.BMR,
    idealWeight: this.IdealWeight,
  };
  return UserJSON;
};
mongoose.model('Weights', WeightSchema);
