module.exports.init=function()
{
  const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/a2dtest')
.then(function()            
{
  console.log("mongo is connected")
})
.catch(function(err)
{
  console.log(err+"error ocuured")
})
}

