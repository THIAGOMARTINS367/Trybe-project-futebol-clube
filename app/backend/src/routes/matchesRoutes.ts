import { NextFunction, Request, Response, Router } from 'express';
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

export default matchesRouter;
