const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
 username:{
   type:String,
   required:true,
   unique:true
 },
 password:
 {
  type:String,
  required:true
 },
 created_at:
{ 
    type: Date,
    required: true,
    default: Date.now
 },

created_by:
{
     type:String,
     required:true
    }

},
 )

 const userModel = mongoose.model('User', userSchema);

 module.exports=userModel