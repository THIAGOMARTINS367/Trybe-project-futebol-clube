import IUser from './IUser';
import IUserLogin from './IUserLogin';
import IUsersService from './IUsersService';

interface IUsersRepository extends Omit<IUsersService, 'login'> {
  login(body: IUserLogin): Promise<IUser[] | []>,
}

export default IUsersRepository;
