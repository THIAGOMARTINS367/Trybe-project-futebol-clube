import IUserLogin from '../interfaces/IUserLogin';
import UsersModel from '../database/models/UsersModel';
import IUsersRepository from '../interfaces/IUsersRepository';
import IUser from '../interfaces/IUser';

class UsersRepository implements IUsersRepository {
  constructor(private model = UsersModel) {
    this.model = model;
  }

  async login({ email }: IUserLogin): Promise<IUser[] | []> {
    const user: IUser[] | [] = await this.model.findAll({
      where: {
        email,
      },
    });
    return user;
  }
}

export default UsersRepository;
