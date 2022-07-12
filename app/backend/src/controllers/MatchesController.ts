import { NextFunction, Request, Response } from 'express';
import INewMatch from '../interfaces/INewMatch';
import IMatch from '../interfaces/IMatch';
import IMatchesService from '../interfaces/IMatchesService';
import IResponseError from '../interfaces/IResponseError';

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
    const result: INewMatch = await this.service.addMatch(body);
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
}

export default MatchesController;
