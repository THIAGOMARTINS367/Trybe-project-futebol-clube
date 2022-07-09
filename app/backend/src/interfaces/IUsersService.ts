import IResponseError from './IResponseError';
import IToken from './IToken';
import IUser from './IUser';
import IUserLogin from './IUserLogin';

interface IUsersService {
  login(body: IUserLogin): Promise<IToken | IResponseError>,
  getUserRole(userData: IUser): Promise<string | IResponseError>,
}

export default IUsersService;
