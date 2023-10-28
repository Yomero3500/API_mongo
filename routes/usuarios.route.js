const routerUsuario = require("express").Router();
const Usuario = require("../models/usuarios.model");
const Publicacion = require("../models/publicacion.model");
const Comentario = require("../models/comentario.model");

routerUsuario.get("/", async (req, res) => {
  try {
    const usuario = await Usuario.find();
    res.json(usuario);
    console.log(usuario);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

routerUsuario.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const usuario = await Usuario.findOne({ email: email });
    if (usuario) {
      res.json(usuario);
      console.log(usuario);
    } else {
      res.status(404).json({ message: "No se ha encontrado el usuario" });
    }
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

routerUsuario.post("/usuario", async (req, res) => {
  try {
    const newUsuario = await Usuario.create(req.body);
    res.json(newUsuario);
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

routerUsuario.put("/usuario/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, telefono, referencia } = req.body;
    Usuario.updateMany(
      {
        Usuario_id: id,
      },
      {
        $set: {
          nombre: nombre,
          telefono: telefono,
          referencia: referencia,
        },
      }
    )
      .then((data) => res.json(data))
      .catch((error) => res.json({ message: error }));
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

routerUsuario.delete("/historial/:usuario", async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ nombre: req.params.usuario });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { usuarioid, publicacion, comentario } = await Promise.all([
      Comentario.deleteMany({ usuario: usuario._id }),
      Publicacion.deleteMany({ usuario_id: usuario._id }),
      Usuario.deleteOne({ _id: usuario._id }),
    ])
      .then((data) => {
        if (data) {
          return res.json({ msg: "usuario eliminado" });
        } else {
          return res.json({ msg: "No se ha eliminado el usuario" });
        }
      })
      .catch((err) => {
        return res.json({ message: err });
      });
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});

routerUsuario.delete("/referencias/:usuario", async (req, res) => {
  try {
    const usuario = await Usuario.findOne({ nombre: req.params.usuario });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const { usuarioid, publicacion, comentario } = await Promise.all([
      Comentario.updateMany(
        {
          $where: {
            usuario: usuario._id,
          },
        },
        {
          usuario: null,
        },
        {
          new: true,
        }
      ),
      Publicacion.findByIdAndUpdate(
        {
          $where: {
            usuario_id: usuario._id,
          },
        },
        {
          id_usuario: null,
        },
        {
          new: true,
        }
      ),
      Usuario.deleteOne({ _id: usuario._id }),
    ])
      .then((data) => {
        if (data) {
          return res.json({ msg: "usuario eliminado con sus referencias" });
        } else {
          return res.json({ msg: "No se ha eliminado el usuario" });
        }
      })
      .catch((err) => {
        return res.json({ message: err });
      });
  } catch (error) {
    res.status(500).json({ error: "Ha ocurrido un error" });
  }
});
module.exports = routerUsuario;
