import { db } from '../connection/Firebase.js';

const historialCollection = db.collection('historial');
const tareasCollection = db.collection('tareas');


const registrarHistorial = async ({ usuarioId, accion, tareaId, datos }) => {
  const fecha = new Date().toISOString();
  await historialCollection.add({
    usuarioId,
    accion,
    tareaId,
    datos,
    fecha
  });
};

export const crearTarea = async ({ usuarioId, descripcion, tipo, estado, fechaCreacion }) => {
  if (!usuarioId || !descripcion || !tipo || !estado || !fechaCreacion) {
    throw new Error('Faltan campos obligatorios');
  }

  const nuevaTarea = { usuarioId, descripcion, tipo, estado, fechaCreacion };
  const tareaRef = await tareasCollection.add(nuevaTarea);


  await registrarHistorial({
    usuarioId,
    accion: 'crear',
    tareaId: tareaRef.id,
    datos: nuevaTarea
  });

  return { id: tareaRef.id, ...nuevaTarea };
};

export const eliminarTarea = async (id) => {
  const tareaRef = tareasCollection.doc(id);
  const doc = await tareaRef.get();
  if (!doc.exists) throw new Error('Tarea no encontrada');

  const tareaEliminada = doc.data();
  await tareaRef.delete();

  await registrarHistorial({
    usuarioId: tareaEliminada.usuarioId,
    accion: 'eliminar',
    tareaId: id,
    datos: tareaEliminada
  });
};

export const modificarTarea = async (id, { descripcion, tipo, estado }) => {
  const tareaRef = tareasCollection.doc(id);
  const doc = await tareaRef.get();
  if (!doc.exists) throw new Error('Tarea no encontrada');

  const tareaActual = doc.data();

  const updates = {};
  if (descripcion !== undefined) updates.descripcion = descripcion;
  if (tipo !== undefined) updates.tipo = tipo;
  if (estado !== undefined) updates.estado = estado;

  await tareaRef.update(updates);

  await registrarHistorial({
    usuarioId: tareaActual.usuarioId,
    accion: 'modificar',
    tareaId: id,
    datos: { antes: tareaActual, despues: { ...tareaActual, ...updates } }
  });
};

export const obtenerTareasPorUsuario = async (usuarioId) => {
  const snapshot = await tareasCollection.where('usuarioId', '==', usuarioId).get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const obtenerHistorialDesdeDB = async (usuarioId) => {
  const snapshot = await db.collection('historial')
    .where('usuarioId', '==', usuarioId)
    .get();

  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};