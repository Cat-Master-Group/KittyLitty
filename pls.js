const bcrypt = require("bcryptjs");
const saltRounds = 16;

const hi = async () => {
  const password = await bcrypt.hash("mousefriend", saltRounds);
  console.log(password);
};
console.log(hi());
