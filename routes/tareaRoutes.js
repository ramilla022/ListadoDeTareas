import { Router } from 'express';
import tareaController from '../controllers/tareaController.js';

const {obtenerTareasPorUsuario, crearTarea, modificarTarea, eliminarTarea} = tareaController

const tareaRoutes = Router()

tareaRoutes.post('/crear', crearTarea);
tareaRoutes.delete('/eliminar/:id', eliminarTarea);
tareaRoutes.put('/modificar/:id', modificarTarea);
tareaRoutes.get('/tareasUsuario/:usuarioId', obtenerTareasPorUsuario);

export default tareaRoutes;