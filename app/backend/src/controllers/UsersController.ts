import { NextFunction, Request, Response } from 'express';
import IResponseError from '../interfaces/IResponseError';
import IToken from '../interfaces/IToken';
import IUserLogin from '../interfaces/IUserLogin';
import IUsersService from '../interfaces/IUsersService';

class UsersController {
  constructor(private service: IUsersService) {}

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { body }: { body: IUserLogin } = req;
    const result: IToken | IResponseError = await this.service.login(body);
    if (Object.keys(result).includes('error')) {
      return next(result);
    }
    res.status(200).json(result);
  }
}

export default UsersController;
