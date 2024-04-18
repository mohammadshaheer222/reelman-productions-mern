const bcrypt = require("bcryptjs");

const comparePassword = async (password, hashed) => {
  return await bcrypt.compare(password, hashed);
};

module.exports = { comparePassword };
