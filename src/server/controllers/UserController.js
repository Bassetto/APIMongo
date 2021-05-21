import UserModel from '../models/User';
import config from '../config/config';
import * as httpStatus from 'http-status';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

const sendResponse = function(res, statusCode, data) {
  res.status(statusCode).json({ data });
};

const generateToken = function(id, type) {
  return jwt.sign({ id, type }, config.tokenSecret, {
    expiresIn: 86400,
  });
};

class UserController {
  constructor() {};

  list(req, res) {
    UserModel.find({})
      .then(users => sendResponse(res, httpStatus.OK, users))
      .catch(err => {
        console.error('Erro: ' + err);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {});
      });
  }

  getByID(req, res) {
    const id = { _id: req.params.id };

    if (!id) {
      sendResponse(res, httpStatus.OK, 'Usuário não encontrado');
    }

    UserModel.findById(id)
      .then(user => sendResponse(res, httpStatus.OK, user))
      .catch(err => {
        console.error('Erro: ' + err);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {});
      });
  }

  create(req, res) {
    const user = req.body;
    UserModel.create(user)
      .then(user =>
        sendResponse(res, httpStatus.CREATED, 'Usuário criado!'),
      )
      .catch(err => {
        console.error('Erro: ' + err);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {});
      });
  }

  update(req, res) {
    const id = { _id: req.params.id };
    const user = req.body;
    const updateUser = {
      name: user.name,
      username: user.username,
      email: user.email,
      password: user.password,
  }
  UserModel.findByIdAndUpdate(id, updateUser)
      .then(user => sendResponse(res, httpStatus.OK, 'Usuário alterado!'))
      .catch((err) => {
        console.error('Erro: ' + err);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {});
      });
  }

  remove(req, res) {
    const id = { _id: req.params.id };
    UserModel.remove(id)
      .then(result => sendResponse(res, httpStatus.OK, result))
      .catch((err) => {
        console.error('Erro: ' + err);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {});
      });
  }
  
  async register(req, res) {
      const { username, email } = req.body;
      try {
        if (await UserModel.findOne({ username, email })) {
          sendResponse(res, httpStatus.BAD_REQUEST, 'Usuário já cadastrado');
        } else {
          const user = await UserModel.create(req.body);
          user.password = undefined;
          user.passwordResetToken = undefined;
          user.passwordResetExpires = undefined;
          sendResponse(res, httpStatus.CREATED, { user, token: generateToken(user.id, user.userType) });
        }
      } catch (err) {
          console.error('Erro: ' + err);
          sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {});
      };
    }

  async authenticate(req, res) {
    const {username, password} = req.body;
    try {
      const user = await UserModel.findOne({ username }).select('+password');

      if (!user) {
        sendResponse(res, httpStatus.NOT_FOUND, 'Usuário não encontrado');
      } else if (!await bcrypt.compare(password, user.password)) {
        sendResponse(res, httpStatus.BAD_REQUEST, 'Senha incorreta');
      } else {
        user.password = undefined;
        sendResponse(res, httpStatus.OK, {user, token: generateToken(user.id)});
      }


    } catch (err) {
        console.error('Erro: ' + err);
        sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, {});
    }
  };

  async forgotPassword(req, res) {
    const { username } = req.body;

    try {
      const user = await UserModel.findOne({ username });

      if (!user) {
        return sendResponse(res, httpStatus.BAD_REQUEST, { error: 'Usuário não encontrado' })
      }

      const token = crypto.randomBytes(20).toString('hex');

      const now = new Date();

      now.setHours(now.getHours() + 1);

      await UserModel.findByIdAndUpdate(user.id, {
        '$set': {
          passwordResetToken: token,
          passwordResetExpires: now,
        },
      });
      sendResponse(res, httpStatus.OK, {token, expires: now});

    } catch (err) {
      console.error('Erro: ' + err);
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, { error: 'Erro em esqueci minha senha, tente novamente' });
    }
  }

  async reset_password(req, res) {
    const { username, token, password } = req.body;

    try {
      const user = await UserModel.findOne({ username }, ['password', 'passwordResetToken', 'passwordResetExpires'], function(err, docs) {
        if (err) {
          console.error(`error: ${err}`);
        }
      }).exec();

      if (!user) {
        return sendResponse(res, httpStatus.BAD_REQUEST, { error: 'Usuário não encontrado' })
      };

      if (token !== user.passwordResetToken) {
        return sendResponse(res, httpStatus.BAD_REQUEST, { error: 'Token Inválido' });
      };

      const now = new Date();

      if (now > user.passwordResetExpires) {
        return sendResponse(res, httpStatus.BAD_REQUEST, { error: 'Token expirado, gere um novo' });
      };

      await UserModel.findByIdAndUpdate(user.id, {
        '$set': {
          password: await bcrypt.hash(password, 10),
        },
      });

      return sendResponse(res, httpStatus.OK, { OK: `A senha do usuário: ${username}, foi alterada com sucesso` });

    } catch (err) {
      console.error('Erro: ' + err);
      sendResponse(res, httpStatus.INTERNAL_SERVER_ERROR, { error: 'Não foi possivel resetar a senha' });
    }
  };
}

export default new UserController();