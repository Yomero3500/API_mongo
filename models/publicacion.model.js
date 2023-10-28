const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const publicacion = new Schema({
 
    titulo: { type: String, require: true },
    contenido: { type: String, require: true },
    fecha_creacion:{type:Date , require:true},
    usuario_id:{
      type:mongoose.Schema.Types.ObjectId , 
      ref: 'usuario',
      require : true,
    }
  });
  
  module.exports = mongoose.model("publicacion",publicacion);