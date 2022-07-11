import { Request, Response, NextFunction, Router } from 'express';
import TeamsService from '../services/TeamsService';
import TeamsController from '../controllers/TeamsController';
import TeamsRepository from '../repository/TeamsRepository';

const teamsRouter = Router();

const entityFactory = () => {
  const repository = new TeamsRepository();
  const service = new TeamsService(repository);
  const controller = new TeamsController(service);
  return controller;
};

teamsRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  entityFactory().getAllTeams(req, res, next);
});

export default teamsRouter;
