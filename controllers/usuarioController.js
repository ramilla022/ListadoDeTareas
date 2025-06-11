import * as usuarioService from '../servicios/UsuarioServicio.js';

export const registrarUsuario = async (req, res) => {
  try {
    const { uid } = await usuarioService.registrarUsuario(req.body);
    res.status(201).json({ message: 'Usuario registrado correctamente', uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUsuario = async (req, res) => {
  try {
    const result = await usuarioService.loginUsuario(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const obtenerPerfil = async (req, res) => {
  try {
    const perfil = await usuarioService.obtenerPerfil(req.user.uid);
    res.status(200).json({ perfil });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};