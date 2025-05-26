import { admin, db } from '../connection/Firebase.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
const API_KEY = process.env.FIREBASE_API_KEY;

const registrarUsuario = async (req, res) => {
  const { email, password, nombre } = req.body;
  try {
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

    res.status(201).json({ message: 'Usuario registrado correctamente', uid: user.uid });
  } catch (error) {
    console.error('Error en registrarUsuario:', error);
    res.status(500).json({ error: error.message });
  }
};

const loginUsuario = async (req, res) => {
  const { email, password } = req.body;

  try {
    const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));


    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: true }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const tokenPayload = {
      uid: data.localId,
      email: data.email,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      uid: data.localId,
      email: data.email,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const obtenerPerfil = async (req, res) => {
  const uid = req.user.uid;

  try {
    const doc = await db.collection('usuarios').doc(uid).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.status(200).json({ perfil: doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {obtenerPerfil, registrarUsuario, loginUsuario}