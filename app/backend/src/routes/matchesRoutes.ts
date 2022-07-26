import { NextFunction, Request, Response, Router } from 'express';
import TokenAuthenticator from '../middlewares/TokenAuthenticator';
import MatchesController from '../controllers/MatchesController';
import MatchesRepository from '../repository/MatchesRepository';
import MatchesService from '../services/MatchesService';

const matchesRouter = Router();

const entityFactory = () => {
  const repository = new MatchesRepository();
  const service = new MatchesService(repository);
  const controller = new MatchesController(service);
  return controller;
};

matchesRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  entityFactory().getAllMatches(req, res, next);
});

matchesRouter.post(
  '/',
  (req: Request, _res: Response, next: NextFunction) => {
    new TokenAuthenticator(req, next).validateJwtToken();
  },
  (req: Request, res: Response, next: NextFunction) => {
    entityFactory().addMatch(req, res, next);
  },
);

matchesRouter.patch('/:id/finish', (req: Request, res: Response, next: NextFunction) => {
  entityFactory().editMatchProgress(req, res, next);
});

matchesRouter.patch('/:id', (req: Request, res: Response, next: NextFunction) => {
  entityFactory().updateMatch(req, res, next);
});

export default matchesRouter;
