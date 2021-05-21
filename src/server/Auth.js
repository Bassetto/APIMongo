import * as httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import config from './config/config';

const sendResponse = function(res, statusCode, data) {
  res.status(statusCode).json({ result: data });
};

export default (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return sendResponse(res, httpStatus.UNAUTHORIZED, { error: 'Nenhum token informado' });
  }

  const parts = authHeader.split(' ');

  if (!(parts.length === 2)) {
    return sendResponse(res, httpStatus.UNAUTHORIZED, { error: 'Token incorreto' })
  }
  
  const [ scheme, token ] = parts;

  if (!/^Bearer$/.test(scheme)) {
    return sendResponse(res, httpStatus.UNAUTHORIZED, { error: 'Token mal formatado' });
  }

  jwt.verify(token, config.tokenSecret, (err, decoded) => {
    if (err) return sendResponse(res, httpStatus.UNAUTHORIZED, { error: 'Token invalido' });

    req.userId = decoded.id;
    req.userType = decoded.type;
    return next();
  })
};