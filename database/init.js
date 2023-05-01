const mongoose = require('mongoose');


const uri = "mongodb+srv://app:MeT4cgYA59eYU3tD@cluster0.a2vhomi.mongodb.net/todos?retryWrites=true&w=majority";



module.exports = function()
{
  return mongoose.connect(uri)
}
