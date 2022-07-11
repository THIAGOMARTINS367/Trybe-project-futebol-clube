import { Request, Response, NextFunction, Router } from 'express';
import TokenAuthenticator from '../middlewares/TokenAuthenticator';
import UsersController from '../controllers/UsersController';
import UsersRepository from '../repository/UsersRepository';
import UsersService from '../services/UsersService';

const userRouter = Router();

const entityFactory = () => {
  const repository = new UsersRepository();
  const service = new UsersService(repository);
  const controller = new UsersController(service);
  return controller;
};

userRouter.post('/', (req: Request, res: Response, next: NextFunction) => {
  entityFactory().login(req, res, next);
});

userRouter.get(
  '/validate',
  (req: Request, _res: Response, next: NextFunction) => {
    new TokenAuthenticator(req, next).validateJwtToken();
  },
  (req: Request, res: Response, next: NextFunction) => {
    entityFactory().getUserRole(req, res, next);
  },
);

export default userRouter;
