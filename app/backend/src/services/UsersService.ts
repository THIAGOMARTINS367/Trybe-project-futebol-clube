import IUsersRepository from '../interfaces/IUsersRepository';
import IUserLogin from '../interfaces/IUserLogin';
import IUsersService from '../interfaces/IUsersService';
import IUser from '../interfaces/IUser';
import generateJwtToken from '../utils/generateJwtToken';
import Bcrypt from '../utils/Bcrypt';
import IToken from '../interfaces/IToken';
import IResponseError from '../interfaces/IResponseError';

class UsersService implements IUsersService {
  constructor(private repository: IUsersRepository) {}

  async login(body: IUserLogin): Promise<IToken | IResponseError> {
    const { password } = body;
    const user: IUser[] | [] = await this.repository.login(body);
    const validPassword = await new Bcrypt().decodeBcryptHash(password, user[0].password);
    if (!validPassword) {
      return { error: { code: 404, message: 'Invalid email or password !' } };
    }
    const userToken: string = generateJwtToken(user[0]);
    return { token: userToken };
  }
}

export default UsersService;
