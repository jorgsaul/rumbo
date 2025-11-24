import { pool } from '../config/dataBase.js';
import crypto from 'crypto';

async function crearOActualizarUsuarioAuth0(user) {
  try {
    const { email, name, picture, sub } = user;
    
    let proveedor = 'desconocido';
    if (sub.includes('google')) {
      proveedor = 'google';
    } else if (sub.includes('facebook')) {
      proveedor = 'facebook';
    }
    
    console.log('Usuario de:', proveedor, email);
    
    // Verificar si el usuario ya existe
    const userExists = await pool.query(
      'SELECT * FROM _users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      console.log('Usuario ya existe:', email);
      return userExists.rows[0];
    }

    // Crear username único
    const baseUsername = name ? 
      name.toLowerCase().replace(/[^a-z0-9]/g, '') : 
      email.split('@')[0];
    
    let username = baseUsername;
    let counter = 1;

    // Generar username único
    while (true) {
      const userExists = await pool.query(
        'SELECT id FROM _users WHERE username = $1',
        [username]
      );
      
      if (userExists.rows.length === 0) break;
      username = `${baseUsername}${counter}`;
      counter++;
    }

    // Crear nuevo usuario
    const newUser = await pool.query(
      `INSERT INTO _users 
       (id, username, full_name, email, role, avatar_url, bio) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING *`,
      [
        crypto.randomUUID(),
        username,
        name || '',
        email,
        'estudiante',
        picture || '',
        `Registrado con ${proveedor}`
      ]
    );

    console.log('Nuevo usuario creado:', email);
    return newUser.rows[0];
    
  } catch (error) {
    console.error('Error al crear usuario Auth0:', error);
    throw error;
  }
}

export { crearOActualizarUsuarioAuth0 };