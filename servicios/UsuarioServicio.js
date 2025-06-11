import { admin, db } from '../connection/Firebase.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const API_KEY = process.env.FIREBASE_API_KEY;

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

  const user = await admin.auth().createUser({
    email,
    password,
    displayName: nombre,
  });

  await db.collection('usuarios').doc(user.uid).set({
    id: user.uid,
    nombre,
    email,
    fechaRegistro: new Date().toISOString(),
  });

  return { uid: user.uid };
};

export const loginUsuario = async ({ email, password }) => {
  const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, returnSecureToken: true }),
  });

  const data = await response.json();

  if (data.error) {
    throw new Error('Credenciales inválidas');
  }

  const tokenPayload = {
    uid: data.localId,
    email: data.email,
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

  return {
    token,
    usuario: {
      uid: data.localId,
      email: data.email,
    },
  };
};

export const obtenerPerfil = async (uid) => {
  if (!uid) throw new Error('No autorizado');

  const doc = await db.collection('usuarios').doc(uid).get();
  if (!doc.exists) throw new Error('Usuario no encontrado');

  return doc.data();
};