const mongoose = require('mongoose');


const uri = "MONGOURI";



module.exports = function()
{
  return mongoose.connect(uri)
}
