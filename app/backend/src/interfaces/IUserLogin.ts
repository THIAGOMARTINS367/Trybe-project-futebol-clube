import IUser from './IUser';

interface IUserLogin extends Omit<IUser, 'id' | 'username' | 'role'> {
  password: string,
}

export default IUserLogin;
