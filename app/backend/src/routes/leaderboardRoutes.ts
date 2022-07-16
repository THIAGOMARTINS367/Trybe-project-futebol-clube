import { NextFunction, Request, Response, Router } from 'express';
import MatchesController from '../controllers/MatchesController';
import MatchesRepository from '../repository/MatchesRepository';
import MatchesService from '../services/MatchesService';

const leaderboardRoutes = Router();

const entityFactory = () => {
  const repository = new MatchesRepository();
  const service = new MatchesService(repository);
  const controller = new MatchesController(service);
  return controller;
};

leaderboardRoutes.get('/home', (req: Request, res: Response, next: NextFunction) => {
  entityFactory().getLeaderboard(req, res, next);
});

leaderboardRoutes.get('/away', (req: Request, res: Response, next: NextFunction) => {
  entityFactory().getLeaderboard(req, res, next);
});

export default leaderboardRoutes;
