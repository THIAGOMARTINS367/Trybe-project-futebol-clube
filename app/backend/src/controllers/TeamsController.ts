import { Request, Response, NextFunction } from 'express';
import ITeamsService from '../interfaces/ITeamsService';

class TeamsController {
  constructor(private service: ITeamsService) {}

  async getAllTeams(_req: Request, res: Response, next: NextFunction) {
    const result = await this.service.getAllTeams();
    if (Object.keys(result).includes('error')) {
      return next(result);
    }
    res.status(200).json(result);
  }

  async getTeamById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const result = await this.service.getTeamById(Number(id));
    if (Object.keys(result).includes('error')) {
      return next(result);
    }
    res.status(200).json(result);
  }
}

export default TeamsController;
