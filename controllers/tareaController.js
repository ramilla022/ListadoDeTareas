import admin from 'firebase-admin';

const db = admin.firestore();
const tareasCollection = db.collection('tareas');

 const crearTarea = async (req, res) => {
  try {
    const { usuarioId, descripcion, tipo, estado, fechaCreacion } = req.body;

    if (!usuarioId || !descripcion || !tipo || !estado || !fechaCreacion) {
    return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }
    const nuevaTarea = {
      usuarioId,
      descripcion,
      tipo,
      estado,
      fechaCreacion,
    };

    const tareaRef = await tareasCollection.add(nuevaTarea);
    res.status(201).json({ id: tareaRef.id, ...nuevaTarea });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al crear la tarea', error });
  }
};

 const eliminarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    await tareasCollection.doc(id).delete();
    res.status(200).json({ mensaje: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al eliminar la tarea', error });
  }
};

 const modificarTarea = async (req, res) => {
  try {
    const { id } = req.params;
    const { descripcion, tipo, estado } = req.body;

    const tareaRef = tareasCollection.doc(id);
    const doc = await tareaRef.get();

    if (!doc.exists) {
      return res.status(404).json({ mensaje: 'Tarea no encontrada' });
    }

    const updates = {};
    if (descripcion !== undefined) updates.descripcion = descripcion;
    if (tipo !== undefined) updates.tipo = tipo;
    if (estado !== undefined) updates.estado = estado;

    await tareaRef.update(updates);
    res.status(200).json({ mensaje: 'Tarea actualizada correctamente' });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al modificar la tarea', error });
  }
};

 const obtenerTareasPorUsuario = async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const snapshot = await tareasCollection.where('usuarioId', '==', usuarioId).get();

    const tareas = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(tareas);
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener tareas', error });
  }
};

export default {obtenerTareasPorUsuario, crearTarea, modificarTarea, eliminarTarea}