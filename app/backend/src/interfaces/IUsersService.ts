import IResponseError from './IResponseError';
import IToken from './IToken';
import IUserLogin from './IUserLogin';

interface IUsersService {
  login(body: IUserLogin): Promise<IToken | IResponseError>,
}

export default IUsersService;
