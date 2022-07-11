import UsersController from '../controllers/UsersController';
import UsersRepository from '../repository/UsersRepository';
import UsersService from '../services/UsersService';

const entityFactory = () => {
  const repository = new UsersRepository();
  const service = new UsersService(repository);
  const controller = new UsersController(service);
  return controller;
};

export default entityFactory;
