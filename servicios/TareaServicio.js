import { db } from '../connection/Firebase.js';

const tareasCollection = db.collection('tareas');

export const crearTarea = async ({ usuarioId, descripcion, tipo, estado, fechaCreacion }) => {
  if (!usuarioId || !descripcion || !tipo || !estado || !fechaCreacion) {
    throw new Error('Faltan campos obligatorios');
  }

  const nuevaTarea = { usuarioId, descripcion, tipo, estado, fechaCreacion };
  const tareaRef = await tareasCollection.add(nuevaTarea);
  return { id: tareaRef.id, ...nuevaTarea };
};

export const eliminarTarea = async (id) => {
  await tareasCollection.doc(id).delete();
};

export const modificarTarea = async (id, { descripcion, tipo, estado }) => {
  const tareaRef = tareasCollection.doc(id);
  const doc = await tareaRef.get();
  if (!doc.exists) throw new Error('Tarea no encontrada');

  const updates = {};
  if (descripcion !== undefined) updates.descripcion = descripcion;
  if (tipo !== undefined) updates.tipo = tipo;
  if (estado !== undefined) updates.estado = estado;

  await tareaRef.update(updates);
};

export const obtenerTareasPorUsuario = async (usuarioId) => {
  const snapshot = await tareasCollection.where('usuarioId', '==', usuarioId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
