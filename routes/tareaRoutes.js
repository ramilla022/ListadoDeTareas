import { Router } from 'express';
import {obtenerTareasPorUsuario, crearTarea, modificarTarea, eliminarTarea} from '../controllers/tareaController.js';

const tareaRoutes = Router()

tareaRoutes.post('/crear', crearTarea);
tareaRoutes.delete('/eliminar/:id', eliminarTarea);
tareaRoutes.put('/modificar/:id', modificarTarea);
tareaRoutes.get('/tareasUsuario/:usuarioId', obtenerTareasPorUsuario);

export default tareaRoutes;