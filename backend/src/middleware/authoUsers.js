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
    
    const userExists = await pool.query(
      'SELECT * FROM _users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return userExists.rows[0];
    }

    const baseUsername = name ? 
      name.toLowerCase().replace(/[^a-z0-9]/g, '') : 
      email.split('@')[0];
    
    let username = baseUsername;
    let counter = 1;

    while (true) {
      const userExists = await pool.query(
        'SELECT id FROM _users WHERE username = $1',
        [username]
      );
      
      if (userExists.rows.length === 0) break;
      username = `${baseUsername}${counter}`;
      counter++;
    }

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

    return newUser.rows[0];
    
  } catch (error) {
    console.error('Error al crear usuario Auth0:', error);
    throw error;
  }
}

export { crearOActualizarUsuarioAuth0 };