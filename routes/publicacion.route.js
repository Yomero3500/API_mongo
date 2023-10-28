const routePublicacion = require("express").Router();
const Publicacion = require("../models/publicacion.model");
const Usuario = require("../models/usuarios.model");
const Cometario = require("../models/comentario.model");

routePublicacion.get("/", async (req, res) => {
  try {
    const publicacion = await Publicacion.find();
    res.json(publicacion);
    console.log(publicacion);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

routePublicacion.get("/:usuario", async (req, res) => {
  const usuario = req.params.usuario;
  const usuarioEncontrado = await Usuario.find().where({ nombre: usuario });
  if (!usuarioEncontrado) {
    return res.json({ msg: "Usuario no encontrado" });
  }
  console.log(usuarioEncontrado);
  try {
    const publicacion = await Publicacion.find({
      usuario_id: usuarioEncontrado[0]._id,
    });
    if (publicacion) {
      res.json(publicacion);
      console.log(publicacion);
      return;
    }
    res.json({ msg: "No se encontraron publicaciones de este usuario" });
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

routePublicacion.post("/add", async (req, res) => {
  try {
    const newPublicacion = await Publicacion.create(req.body);

    if (newPublicacion) {
      res.json(newPublicacion);
      res.end();
    } else {
      res.send({ error: "El usuario no se encontro" });
    }
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

routePublicacion.put("/:titulo", async (req, res) => {
  try {
    const { titulo } = req.params;
    const { contenido } = req.body;
    Publicacion.updateOne(
      {
        titulo: titulo,
      },
      {
        $set: {
          contenido: contenido,
        },
      }
    )
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

routePublicacion.delete("/:fecha", async (req, res) => {
  try {
    const publicacion = await Publicacion.findOneAndDelete({
      fecha_creacion: req.params.fecha,
    });
    if (publicacion) {
      const comentariosBorrados = await Cometario.deleteMany({
        publicacion: publicacion._id,
      });
      res.json([publicacion, comentariosBorrados]);
      return;
    } else {
      res.json({ error: "La publicacion no se encontro" });
    }
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

module.exports = routePublicacion;
