const mongoose = require("mongoose");
const Productschema= new mongoose.Schema({
name:{
    type: String,
    required: true,
},
price:{
    type: Number,
    required: true,
}, 
 avatar: {
    type: String,
  },
  cloudinary_id: {
    type: String,
  }, 
category:{
    type: String,
    required: true,
},
desc:{
    type: String,
    required: true,
},
})
const product = new mongoose.model('Product',Productschema);
module.exports = product;