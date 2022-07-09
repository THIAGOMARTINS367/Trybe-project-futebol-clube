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

  async getUserRole(id: number): Promise<string | null> {
    const user = await this.model.findByPk(id);
    return user ? user.getDataValue('role') : null as string | null;
  }
}

export default UsersRepository;
