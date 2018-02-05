let mongoose = require("mongoose");
let bcrypt   = require('bcrypt-nodejs');

const userSchema = new mongoose.Schema({
  email: {type: String, required: true},
  password: {type: String, required: true}
});

//add some methods to user model to use when hash & compare a password
userSchema.methods.hashPassword = function (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}

userSchema.methods.validePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('User', userSchema);
