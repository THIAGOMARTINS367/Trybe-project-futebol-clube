import { NextFunction, Request, Response } from 'express';
import IMatch from '../interfaces/IMatch';
import IMatchesService from '../interfaces/IMatchesService';

class MatchesController {
  constructor(private service: IMatchesService) {}

  async getAllMatches(_req: Request, res: Response, next: NextFunction) {
    const result: IMatch[] = await this.service.getAllMatches();
    if (Object.keys(result).includes('error')) {
      return next(result);
    }
    res.status(200).json(result);
  }
}

export default MatchesController;
