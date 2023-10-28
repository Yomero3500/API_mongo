const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comentario = new Schema({
  contenido: { type: String, require: true },
  fechaCreacion: { type: Date, require: true },
  publicacion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "publicacion",
    require: true,
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usuario",
    require: true,
  },
});

module.exports = mongoose.model("comentario", comentario);
