const inchesOver5Feet = (cm) => {
  const inch = cm * 0.39370;
  const remainder = inch % 12;
  return Math.round(remainder);
};