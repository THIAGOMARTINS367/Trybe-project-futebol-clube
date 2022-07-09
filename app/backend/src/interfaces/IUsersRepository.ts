import IUser from './IUser';
import IUserLogin from './IUserLogin';

interface IUsersRepository {
  login(body: IUserLogin): Promise<IUser[] | []>,
  getUserRole(id: number): Promise<string | null>,
}

export default IUsersRepository;
