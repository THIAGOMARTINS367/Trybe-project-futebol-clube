import * as Joi from 'joi';
import IUsersRepository from '../interfaces/IUsersRepository';
import IUserLogin from '../interfaces/IUserLogin';
import IUsersService from '../interfaces/IUsersService';
import IUser from '../interfaces/IUser';
import generateJwtToken from '../utils/generateJwtToken';
import Bcrypt from '../utils/Bcrypt';
import IToken from '../interfaces/IToken';
import IResponseError from '../interfaces/IResponseError';

class UsersService implements IUsersService {
  constructor(
    private repository: IUsersRepository,
    private joiTypes = Joi.types(),
  ) {}

  validateLoginFields({ email, password }: IUserLogin) {
    const { object, string } = this.joiTypes;
    const { error } = object.keys({
      email: string.email().not().empty().required()
        .messages({
          'string.empty': 'All fields must be filled',
          'any.required': 'All fields must be filled',
        }),
      password: string.not().empty().min(7).required(),
    }).validate({ email, password });
    return error;
  }

  async login(body: IUserLogin): Promise<IToken | IResponseError> {
    const { password } = body;
    const validation = this.validateLoginFields(body);
    if (validation) {
      return { error: { code: 400, message: validation.message } };
    }
    const user: IUser[] | [] = await this.repository.login(body);
    if (user.length === 0) {
      return { error: { code: 401, message: 'Invalid email or password !' } };
    }
    const validPassword = await new Bcrypt().decodeBcryptHash(password, user[0].password);
    if (!validPassword) {
      return { error: { code: 401, message: 'Invalid email or password !' } };
    }
    const userToken: string = generateJwtToken(user[0]);
    return { token: userToken };
  }
}

export default UsersService;
