import { pool } from "../database/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config(); 
const KEY = process.env.KEY;

//* Registrar usuarios
const registerUser = async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body;
    const query =
      "INSERT INTO usuarios (id, email, password, rol, lenguage) VALUES (DEFAULT, $1, $2, $3, $4) RETURNING *;";
    //*  Encriptar las contraseñas al momento de registrar nuevos usuarios
    const values = [email, bcrypt.hashSync(password), rol, lenguage];
    const  result  = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.log(error);
    if (error.constraint === "usuarios_email_key") {
      return res.status(409).json({ message: "El email ya existe" });
    }
  }
};

//* Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const query = "SELECT * FROM usuarios WHERE email = $1;";
    const values = [email];
    const { rows } = await pool.query(query, values);
    if (!rows.length) {
      return res.status(404).json({
        message: "Usuario no existe",
        code: 404,
      });
    }
    const user = rows[0];
    //* Valida el password ingresado
    const verifyUser = bcrypt.compareSync(password, user.password);
    if (!verifyUser) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos",
        code: 401,
      });
    }
    //* Firmar token
    const token = jwt.sign({ email: user.email }, KEY, { expiresIn: '6h' });
    res.status(200).json({ message: "Login exitoso", email: user.email, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//* Disponibilizar una ruta GET /usuarios para devolver los datos de un usuario en caso de que esté autenticado
const getUsers = async (req, res) => {
  try {
    //* Extraiga un token disponible en la propiedad Authorization de las cabeceras
    const token = req.headers.authorization.split(" ")[1];
    //* Decodifique el token para obtener el email del usuario a buscar en su payload
    //* jwt.verify: Esta función verifica un token JWT utilizando una clave secreta (KEY). Si el token es válido, retorna el payload decodificado (un objeto con información del token).
    const { email } = jwt.verify(token, KEY); //* con la desestructuración obtenemos solo lo que necesitamos, en este caso, la propiedad email.
    
    //* Obtenga el registro del usuario
    const query = "SELECT * FROM usuarios WHERE email = $1;";
    const { rows } = await pool.query(query, [email]);
    const user = rows[0];

    //* Verificar si el usuario existe
    if (!user) {
      return res.status(401).json({
        message: "Usuario o contraseña incorrectos",
        code: 401,
      });
    }

    //* Devuelva el registro del usuario
    res.status(200).json([user]);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Ocurrio un error al obtener usuarios" });
  }
};

export const controller = {
    registerUser,
    login,
    getUsers
   };
