import { Router } from 'express';
import {obtenerTareasPorUsuario, crearTarea, modificarTarea, eliminarTarea} from '../controllers/tareaController.js';
import { obtenerPerfil }  from '../controllers/usuarioController.js';

const tareaRoutes = Router()

tareaRoutes.post('/crear', crearTarea, obtenerPerfil);
tareaRoutes.delete('/eliminar/:id', eliminarTarea, obtenerPerfil);
tareaRoutes.put('/modificar/:id', modificarTarea, obtenerPerfil);
tareaRoutes.get('/tareasUsuario/:usuarioId', obtenerTareasPorUsuario, obtenerPerfil);

export default tareaRoutes;