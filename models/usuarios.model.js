const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const usuario = new Schema({
    nombre: { type: String, require: true },
    email: { type: String, require: true },
  });
  
  module.exports = mongoose.model("usuario",usuario);