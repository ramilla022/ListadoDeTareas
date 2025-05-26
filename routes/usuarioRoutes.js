import { Router } from 'express';
import usuarioController from '../controllers/usuarioController.js';
import { validarToken } from '../middlewares/validarToken.js'

const { registrarUsuario, loginUsuario, obtenerPerfil } = usuarioController;


const usuarioRoutes = Router()

usuarioRoutes.post('/registro', registrarUsuario);
usuarioRoutes.post('/login', loginUsuario);
usuarioRoutes.get('/perfil', validarToken, obtenerPerfil);


export default usuarioRoutes