import { NextFunction, Request, Response } from 'express';
import INewMatch from '../interfaces/INewMatch';
import IMatch from '../interfaces/IMatch';
import IMatchesService from '../interfaces/IMatchesService';
import IResponseError from '../interfaces/IResponseError';
import IMatchGoals from '../interfaces/IMatchGoals';
import ILeaderBoard from '../interfaces/ILeaderBoard';
import { homeAwayTeam } from '../types/types';

class MatchesController {
  constructor(private service: IMatchesService) {}

  async getAllMatches(req: Request, res: Response, next: NextFunction) {
    const { inProgress }: { inProgress?: string | undefined } = req.query;
    const result: IMatch[] = await this.service.getAllMatches(inProgress);
    if (Object.keys(result).includes('error')) {
      return next(result);
    }
    res.status(200).json(result);
  }

  async addMatch(req: Request, res: Response, next: NextFunction) {
    const { body }: { body: INewMatch } = req;
    const result: INewMatch | IResponseError = await this.service.addMatch(body);
    if (Object.keys(result).includes('error')) {
      return next(result);
    }
    res.status(201).json(result);
  }

  async editMatchProgress(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const result: {
      message: 'Finished',
    } | IResponseError = await this.service.editMatchProgress(Number(id));
    if (Object.keys(result).includes('error')) {
      return next(result);
    }
    res.status(200).json(result);
  }

  async updateMatch(req: Request, res: Response, next: NextFunction) {
    const { body, params: { id } } = req;
    const requestBody: IMatchGoals = body;
    const matchId: string = id;
    const result: IMatchGoals = await this.service.updateMatch(Number(matchId), requestBody);
    if (Object.keys(result).includes('error')) {
      return next(result);
    }
    res.status(200).json(result);
  }

  async getLeaderboard(req: Request, res: Response, next: NextFunction) {
    const { path }: { path: string } = req;
    const teamsTypeParameter: homeAwayTeam = path === '/home' ? 'homeTeam' : 'awayTeam';
    const result: ILeaderBoard[] = await this.service.getLeaderboard(teamsTypeParameter);
    if (Object.keys(result).includes('error')) {
      return next(result);
    }
    res.status(200).json(result);
  }

  async getGeneralLeaderboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
    const result: ILeaderBoard[] = await this.service.getGeneralLeaderboard();
    if (Object.keys(result).includes('error')) {
      return next(result);
    }
    res.status(200).json(result);
  }
}

export default MatchesController;
