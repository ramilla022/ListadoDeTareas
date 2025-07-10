import { db } from '../connection/Firebase.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const usuariosCollection = db.collection('usuarios');

export const registrarUsuario = async ({ email, password, nombre }) => {
  if (!email || !password || !nombre) {
    throw new Error('Todos los campos son obligatorios');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Email inválido');
  }

  if (password.length < 6) {
    throw new Error('La contraseña debe tener al menos 6 caracteres');
  }

  const existeUsuario = await obtenerUsuarioPorEmail(email);
  if (existeUsuario) {
  throw new Error('El email ya está registrado');
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const nuevoUsuarioRef = await usuariosCollection.add({
    nombre,
    email,
    passwordHash,
    fechaRegistro: new Date().toISOString(),
  });

  return { uid: nuevoUsuarioRef.id };
};

export const loginUsuario = async ({ email, password }) => {

  const usuario = await obtenerUsuarioPorEmail(email);

  if (!usuario) {
    throw new Error('Usuario no encontrado');
  }

const passwordValido = await bcrypt.compare(password, usuario.passwordHash);
  if (!passwordValido) {
    throw new Error('Contraseña inválida');
  }

  const token = jwt.sign({ uid: usuario.id, email: usuario.email },JWT_SECRET,{ expiresIn: '1h' });

  return {
    token,
    usuario: {
      uid: usuario.id,
      email: usuario.email,
      nombre: usuario.nombre,
    },
  };
};

export const obtenerPerfil = async (uid) => {
  if (!uid) throw new Error('No autorizado');

  const doc = await usuariosCollection.doc(uid).get();
  if (!doc.exists) throw new Error('Usuario no encontrado');

  const usuario = doc.data();
  delete usuario.passwordHash;

  return usuario;
};

export const obtenerUsuarioPorEmail = async (email) => {
  const snapshot = await usuariosCollection.where('email', '==', email.toLowerCase()).limit(1).get();

  if (snapshot.empty) {
    console.log('No se encontró ningún usuario');
    return null;
  }

  const doc = snapshot.docs[0];
  const usuario = { id: doc.id, ...doc.data() };

  return usuario;
};