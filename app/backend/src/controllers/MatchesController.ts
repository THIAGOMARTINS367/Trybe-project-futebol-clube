import { NextFunction, Request, Response } from 'express';
import IMatch from '../interfaces/IMatch';
import IMatchesService from '../interfaces/IMatchesService';

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
}

export default MatchesController;
