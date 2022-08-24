/*
    TODO: Complete all these for both BE and FE

    req.body or req.params (validate these) - require Mongodb script (Ali) says Baby don't hurt me 🕺. Jaeson
    message = needs to be string (no empty string)
    id = needs to be ObjectId 
    🚧

    */
const checkString = (str) => {
  if (!str) {
    throw `str UNDEFINED ERROR: str cannot be undefined`;
  }

  if (typeof str !== "string") {
    throw `str NOT STRING ERROR: str must a string`;
  }

  str = str.trim();

  if (str.length === 0) {
    throw `str EMPTY ERROR: str cannot be an empty string or just spaces.`;
  }
};

/*

    TODO: Styling (message threads)
    
    
    TODO: Semantics of conversations and messages - Ali (staff engineer) does not approve

*/

module.exports = {
  checkString,
};
