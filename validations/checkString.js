/*
    TODO: Complete all these for both BE and FE

    req.body or req.params (validate these) - require Mongodb script (Ali) says Baby don't hurt me 🕺. Jaeson
    message = needs to be string (no empty string)
    id = needs to be ObjectId 
    🚧

    */
const checkString = (message) => {
  if (!message) {
    throw `MESSAGE UNDEFINED ERROR: message cannot be undefined`;
  }

  if (typeof message !== "string") {
    throw `MESSAGE NOT STRING ERROR: message must a string`;
  }

  message = message.trim();

  if (message.length === 0) {
    throw `MESSAGE EMPTY ERROR: message cannot be an empty string or just spaces.`;
  }
};

/*

    TODO: Styling (message threads)
    
    
    TODO: Semantics of conversations and messages - Ali (staff engineer) does not approve

*/

module.exports = {
  checkString,
};
