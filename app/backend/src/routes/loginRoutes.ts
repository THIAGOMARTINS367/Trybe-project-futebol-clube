import { Request, Response, NextFunction, Router } from 'express';
import TokenAuthenticator from '../middlewares/TokenAuthenticator';
import entityFactory from '../utils/entityFactory';

const userRouter = Router();

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
