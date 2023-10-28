const router = require("express").Router();
const Comenterio = require("../models/comentario.model");
const Publicacion = require("../models/publicacion.model");
const Usuario = require("../models/usuarios.model");

router.get("/", async (req, res) => {
  try {
    const comentario = await Comenterio.find();
    res.json(comentario);
    console.log(comentario);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

router.get("/:titulo", async (req, res) => {
  const titulo = req.params.titulo;
  const tituloEncontrado = await Publicacion.find().where({ titulo: titulo });
  if (!tituloEncontrado[0]) {
    return res.json({ msg: "Publicacion no encontrada" });
  }

  try {
    const comentario = await Comenterio.find({
      publicacion: tituloEncontrado[0]._id,
    });
    if (!comentario[0]) {
      res.json({ msg: "No se encontraron comentarios de esta publicacion" });
    } else {
      res.json([comentario]);
      console.log(comentario);
    }
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

router.post("/add", async (req, res) => {
  try {
    const newComentario = await Comenterio.create(req.body);
    res.json(newComentario);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

router.put("/update/:titulo&:nombre", async (req, res) => {
  try {
    const { titulo, nombre } = req.params;
    const { contenido } = req.body;
    const [nombreP, nombreU] = await Promise.all([
      Publicacion.findOne({ titulo: titulo }),
      Usuario.findOne({ nombre: nombre }),
    ]);
    console.log(nombreP._id, nombreU._id);

    if (!nombreP) {
      return res.status(404).json({ error: "Publicación no encontrada" });
    }
    if (!nombreU) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const comentario = await Comenterio.findOneAndUpdate(
      {
        publicacion: nombreP._id,
        usuario: nombreU._id,
      },
      {
        $set: {
          contenido: contenido,
        },
      },
      {
        new: true,
      }
    );
    if (comentario) {
      return res.json({ success: true, comentario });
    } else {
      return res
        .status(404)
        .json({ error: "No se encontraron comentarios de esta publicación" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ha ocurrido un error en el servidor" });
  }
});

router.delete("/:fecha&:publicacion", async (req, res) => {
  try {
    const [publicacion, fecha] = await Promise.all([
      Publicacion.findOne({ titulo: req.params.publicacion }),
      Comenterio.findOne({ fechaCreacion: new Date(req.params.fecha) }),
    ]);
    if (!fecha) {
      return res.json({ error: "Fecha del comentario no encontrada" });
    }
    if (!publicacion) {
      return res.json({ error: "Publicacion no encontrada" });
    }
    const comentarios = await Comenterio.deleteOne({
      publicacion: publicacion._id,
      fechaCreacion: fecha.fechaCreacion,
    });
    if (comentarios) {
      return res.json({ success: true, comentarios });
    } else {
      return res
        .status(404)
        .json({ error: "No se encontraron comentarios de esta publicación" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

module.exports = router;
