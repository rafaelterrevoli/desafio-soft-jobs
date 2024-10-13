import jwt from "jsonwebtoken";
import dotenv from 'dotenv';

dotenv.config(); 
const KEY = process.env.KEY;

 //* Verifique la validez del token usando la misma llave secreta usada en su firma
const verifyToken = (req, res, next) => {
  //* Validar el token recibido en las cabeceras en la ruta que corresponda
  const autorizacionHeader = req.headers.authorization;
  if (!autorizacionHeader) {
    return res.status(401).json({ message: "Falta el token" });
  }

  const [bearer, token] = autorizacionHeader.split(" ");

  const arrayToken = token.split('.');
  const tokenPayload = JSON.parse(atob(arrayToken[1]));
  console.log(tokenPayload);

  if (bearer !== "Bearer") {
    return res
      .status(401)
      .json({ message: 'Falta el Bearer en el header Authorization' });
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Falta el Token en el header Authorization' });
  }

  try {
    //* verificar y decodificar tokens
    jwt.verify(token, KEY) && next();
  } catch (error) {
    console.log('Error en el token o ya expiró');
    return res.status(401).json({ message: "Token inválido" });
  }
};

export default verifyToken;