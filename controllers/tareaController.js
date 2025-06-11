import * as tareaService from '../servicios/TareaServicio.js';

export const crearTarea = async (req, res) => {
  try {
    const tarea = await tareaService.crearTarea(req.body);
    res.status(201).json(tarea);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
};

export const eliminarTarea = async (req, res) => {
  try {
    await tareaService.eliminarTarea(req.params.id);
    res.status(200).json({ mensaje: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la tarea', error });
  }
};

export const modificarTarea = async (req, res) => {
  try {
    await tareaService.modificarTarea(req.params.id, req.body);
    res.status(200).json({ mensaje: 'Tarea actualizada correctamente' });
  } catch (error) {
    res.status(404).json({ mensaje: error.message });
  }
};

export const obtenerTareasPorUsuario = async (req, res) => {
  try {
    const tareas = await tareaService.obtenerTareasPorUsuario(req.params.usuarioId);
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tareas', error });
  }
};
