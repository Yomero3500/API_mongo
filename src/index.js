const express = require("express");
const mongoose = require("mongoose");
const rutaUsuarios = require("./routes/usuarios.route")
const rutaPublicacion = require("./routes/publicacion.route");
const rutaComentario = require("./routes/comentario.route");
const app = express();
app.use(express.json());
require("dotenv").config();
mongoose.set("strictQuery", false);

let port = 3006;

//Rutas 
app.use("/usuarios", rutaUsuarios);
app.use("/publicacion", rutaPublicacion);
app.use("/comentarios", rutaComentario);

app.listen(port, () => console.log("Escuchando en el puerto ", port));
//conexion
mongoose
  .connect("mongodb://127.0.0.1/Red-social")
  .then(() => console.log("conectado"))
  .catch(() => console.log("Error"));

module.exports = app;