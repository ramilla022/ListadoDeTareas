import { Router } from 'express';
import { registrarUsuario, loginUsuario, obtenerPerfil }  from '../controllers/usuarioController.js';
import { validarToken } from '../middlewares/validarToken.js'



const usuarioRoutes = Router()

usuarioRoutes.post('/registro', registrarUsuario);
usuarioRoutes.post('/login', loginUsuario);
usuarioRoutes.get('/perfil', validarToken, obtenerPerfil);


export default usuarioRoutes